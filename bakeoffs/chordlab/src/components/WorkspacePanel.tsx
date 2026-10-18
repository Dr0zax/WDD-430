"use client";

import { SubmitEvent, useEffect, useRef, useState } from "react";
import { FieldError } from "./ui/FieldError";
import { StatusMessage } from "./ui/StatusMessage";
import { requiredText } from "../lib/validation";
import { playNotes, stopAllAudio } from "../lib/audio";
import {
    createProgression,
    isValidProgression,
    Progression,
    ProgressionEntry,
} from "../lib/progression";
import type { Chord, Root, ScaleId } from "../lib/music";

type WorkspacePanelProps = {
    selectedChord?: Chord;
    root: Root;
    scaleId: ScaleId;
    onProgressionChange?: (progression: Progression) => void;
};

type SavedWorkspace = {
    id: string;
    name: string;
    progression: Progression;
    created_at: string;
    updated_at: string;
};

export function WorkspacePanel({
    selectedChord,
    root,
    scaleId,
    onProgressionChange,
}: WorkspacePanelProps) {
    const [workspaceName, setWorkspaceName] = useState("");
    const [workspaceId, setWorkspaceId] = useState<string>();
    const [workspaces, setWorkspaces] = useState<SavedWorkspace[]>([]);
    const [isLoadingWorkspaces, setIsLoadingWorkspaces] = useState(true);
    const [isSavingProgression, setIsSavingProgression] = useState(false);
    const [error, setError] = useState<string>();
    const [requestError, setRequestError] = useState<string>();
    const [savedName, setSavedName] = useState<string>();
    const [isSaving, setIsSaving] = useState(false);
    const [progression, setProgression] = useState<Progression>(() =>
        createProgression("Untitled idea", root, scaleId),
    );
    const [progressionError, setProgressionError] = useState<string>();
    const [playingIndex, setPlayingIndex] = useState<number>();
    const [isPlaying, setIsPlaying] = useState(false);
    const playbackRun = useRef(0);
    const progressionEntryCounter = useRef(0);
    const saveQueue = useRef(Promise.resolve());

    useEffect(() => {
        let active = true;
        async function loadWorkspaces() {
            try {
                const response = await fetch("/api/workspaces");
                if (!response.ok) return;
                const body = (await response.json()) as {
                    workspaces?: SavedWorkspace[];
                };
                if (active) setWorkspaces(body.workspaces ?? []);
            } finally {
                if (active) setIsLoadingWorkspaces(false);
            }
        }
        void loadWorkspaces();
        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        const next = {
            ...progression,
            key: root,
            scale: scaleId,
            updatedAt: new Date().toISOString(),
        };
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setProgression(next);
        onProgressionChange?.(next);
        // Chords are preserved on key changes so the user can deliberately remove them.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [root, scaleId]);

    useEffect(
        () => () => {
            playbackRun.current += 1;
            stopAllAudio();
        },
        [],
    );

    function updateProgression(next: Progression) {
        const updated = { ...next, updatedAt: new Date().toISOString() };
        setProgression(updated);
        onProgressionChange?.(updated);
        if (workspaceId) {
            saveQueue.current = saveQueue.current.then(() =>
                saveProgression(workspaceId, updated),
            );
        }
    }

    async function saveProgression(id: string, next: Progression) {
        setIsSavingProgression(true);
        try {
            const response = await fetch(`/api/workspaces/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: next.title, progression: next }),
            });
            if (!response.ok) {
                setRequestError("Unable to save the latest progression.");
                return;
            }
            const body = (await response.json()) as { workspace?: SavedWorkspace };
            if (body.workspace) {
                setWorkspaces((current) =>
                    current.map((workspace) =>
                        workspace.id === body.workspace!.id
                            ? body.workspace!
                            : workspace,
                    ),
                );
            }
        } catch {
            setRequestError("The server could not save the latest progression.");
        } finally {
            setIsSavingProgression(false);
        }
    }

    function loadWorkspace(workspace: SavedWorkspace) {
        stopProgression();
        setWorkspaceId(workspace.id);
        setWorkspaceName(workspace.name);
        setProgression(workspace.progression);
        onProgressionChange?.(workspace.progression);
        setSavedName(workspace.name);
        setRequestError(undefined);
        setProgressionError(undefined);
    }

    function addChord() {
        if (!selectedChord) {
            setProgressionError(
                "Select a chord from the explorer before adding it.",
            );
            return;
        }
        if (progression.chords.length >= 8) {
            setProgressionError(
                "A progression can contain at most eight chords.",
            );
            return;
        }
        progressionEntryCounter.current += 1;
        const entry: ProgressionEntry = {
            id: `${selectedChord.id}-${progressionEntryCounter.current}`,
            chord: selectedChord,
            durationBeats: 4,
        };
        updateProgression({
            ...progression,
            chords: [...progression.chords, entry],
        });
        setProgressionError(undefined);
    }

    function removeChord(index: number) {
        if (!progression.chords[index]) {
            setProgressionError("That chord is no longer in the progression.");
            return;
        }
        updateProgression({
            ...progression,
            chords: progression.chords.filter(
                (_, entryIndex) => entryIndex !== index,
            ),
        });
    }

    function moveChord(index: number, direction: -1 | 1) {
        const target = index + direction;
        if (
            !progression.chords[index] ||
            target < 0 ||
            target >= progression.chords.length
        ) {
            setProgressionError("That chord cannot move in that direction.");
            return;
        }
        const chords = [...progression.chords];
        [chords[index], chords[target]] = [chords[target], chords[index]];
        updateProgression({ ...progression, chords });
        setProgressionError(undefined);
    }

    async function playProgression() {
        if (!isValidProgression(progression)) {
            setProgressionError(
                "Add at least one valid chord before playing the progression.",
            );
            return;
        }
        stopProgression();
        const run = playbackRun.current + 1;
        playbackRun.current = run;
        setIsPlaying(true);
        setProgressionError(undefined);
        try {
            for (let index = 0; index < progression.chords.length; index += 1) {
                if (playbackRun.current !== run) return;
                const entry = progression.chords[index];
                const beatSeconds = 60 / progression.tempo;
                setPlayingIndex(index);
                await playNotes(
                    noteNamesToMidi(entry.chord.notes),
                    entry.durationBeats * beatSeconds,
                );
                await new Promise<void>((resolve) =>
                    window.setTimeout(
                        resolve,
                        entry.durationBeats * beatSeconds * 1000,
                    ),
                );
            }
        } catch (playbackError) {
            setProgressionError(
                playbackError instanceof Error
                    ? playbackError.message
                    : "Unable to play this progression. Try again.",
            );
        } finally {
            if (playbackRun.current === run) {
                setIsPlaying(false);
                setPlayingIndex(undefined);
                stopAllAudio();
            }
        }
    }

    function stopProgression() {
        playbackRun.current += 1;
        stopAllAudio();
        setIsPlaying(false);
        setPlayingIndex(undefined);
    }

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        const result = requiredText(workspaceName, "Workspace name");
        if (!result.valid) {
            setSavedName(undefined);
            setError(result.message);
            setRequestError(undefined);
            return;
        }
        setError(undefined);
        setRequestError(undefined);
        setSavedName(undefined);
        setIsSaving(true);
        try {
            const response = await fetch("/api/workspaces", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: workspaceName.trim(),
                    progression: { ...progression, title: workspaceName.trim() },
                }),
            });
            const body = (await response.json()) as {
                workspace?: SavedWorkspace;
                error?: string;
            };
            if (!response.ok) {
                setRequestError(
                    response.status === 401
                        ? "Sign in before creating a workspace."
                        : (body.error ??
                              "Unable to create the workspace. Try again."),
                );
                return;
            }
            if (body.workspace) {
                setWorkspaceId(body.workspace.id);
                setWorkspaces((current) => [body.workspace!, ...current]);
                setProgression(body.workspace.progression);
                onProgressionChange?.(body.workspace.progression);
            }
            setSavedName(body.workspace?.name ?? workspaceName.trim());
        } catch {
            setRequestError(
                "The server could not be reached. Check your connection and try again.",
            );
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="panel setup-panel">
          <div>
            <div className="panel-heading">
                <div>
                    <h2>Progression workspace</h2>
                    <p className="panel-copy">
                        Select a chord, add it here, then arrange your idea.
                    </p>
                </div>
                <span className="chord-count">
                    {progression.chords.length}/8 chords
                </span>
            </div>
            <form onSubmit={handleSubmit} noValidate aria-busy={isSaving}>
                <label className="field-label" htmlFor="workspace-name">
                    Workspace name
                </label>
                <input
                    id="workspace-name"
                    name="workspaceName"
                    value={workspaceName}
                    onChange={(event) => setWorkspaceName(event.target.value)}
                    aria-invalid={Boolean(error)}
                    aria-describedby={
                        error ? "workspace-name-error" : undefined
                    }
                    placeholder="e.g. Sunday morning"
                    autoComplete="off"
                />
                <FieldError id="workspace-name-error" message={error} />
                <button
                    className="primary-button"
                    type="submit"
                    disabled={isSaving}
                >
                    {isSaving ? "Saving workspace…" : "Start workspace"}
                </button>
            </form>
            <div className="workspace-loader">
                <label className="field-label" htmlFor="saved-workspace">
                    Load a saved workspace
                </label>
                <select
                    id="saved-workspace"
                    value={workspaceId ?? ""}
                    onChange={(event) => {
                        const workspace = workspaces.find(
                            (item) => item.id === event.target.value,
                        );
                        if (workspace) loadWorkspace(workspace);
                    }}
                    disabled={isLoadingWorkspaces || !workspaces.length}
                >
                    <option value="">
                        {isLoadingWorkspaces
                            ? "Loading workspaces…"
                            : workspaces.length
                              ? "Choose a workspace"
                              : "No saved workspaces yet"}
                    </option>
                    {workspaces.map((workspace) => (
                        <option key={workspace.id} value={workspace.id}>
                            {workspace.name}
                        </option>
                    ))}
                </select>
            </div>
            {requestError ? (
                <StatusMessage tone="error" title="Workspace was not created">
                    {requestError}
                </StatusMessage>
            ) : null}
            {savedName ? (
                <StatusMessage tone="success" title="Workspace ready">
                    “{savedName}” is ready for note exploration.
                </StatusMessage>
            ) : null}
            {workspaceId ? (
                <p className="save-status" role="status">
                    {isSavingProgression ? "Saving changes…" : "Changes saved"}
                </p>
            ) : null}
            <div className="progression-toolbar">
                <button
                    type="button"
                    className="secondary-button"
                    onClick={addChord}
                    disabled={!selectedChord}
                >
                    Add selected chord
                </button>
                <button
                    type="button"
                    className="secondary-button"
                    onClick={playProgression}
                    disabled={isPlaying || !progression.chords.length}
                >
                    Play progression
                </button>
                <button
                    type="button"
                    className="secondary-button"
                    onClick={stopProgression}
                    disabled={!isPlaying}
                >
                    Stop
                </button>
            </div>
          </div>
            {progression.chords.length === 0 ? (
                <p className="empty-state">
                    Your progression is empty. Choose one of the compatible
                    chords and select “Add selected chord”.
                </p>
            ) : (
                <ol className="progression-list">
                    {progression.chords.map((entry, index) => (
                        <li
                            className={`progression-row${playingIndex === index ? " current" : ""}`}
                            key={entry.id}
                            aria-current={
                                playingIndex === index ? "step" : undefined
                            }
                        >
                            <div>
                                <span className="progression-position">
                                    {index + 1}
                                </span>
                                <strong>{entry.chord.symbol}</strong>
                                <span className="progression-detail">
                                    {entry.chord.notes.join(" · ")} ·{" "}
                                    {entry.durationBeats} beats
                                </span>
                                {playingIndex === index ? (
                                    <span className="playing-label">
                                        Now playing
                                    </span>
                                ) : null}
                            </div>
                            <div className="row-actions">
                                <button
                                    type="button"
                                    className="icon-button"
                                    onClick={() => moveChord(index, -1)}
                                    disabled={index === 0}
                                >
                                    Move up
                                </button>
                                <button
                                    type="button"
                                    className="icon-button"
                                    onClick={() => moveChord(index, 1)}
                                    disabled={
                                        index === progression.chords.length - 1
                                    }
                                >
                                    Move down
                                </button>
                                <button
                                    type="button"
                                    className="icon-button danger"
                                    onClick={() => removeChord(index)}
                                >
                                    Remove
                                </button>
                            </div>
                        </li>
                    ))}
                </ol>
            )}
            {progressionError ? (
                <p className="progression-error" role="alert">
                    {progressionError}
                </p>
            ) : null}
        </div>
    );
}

function noteNamesToMidi(notes: readonly string[]) {
    const pitchClasses: Record<string, number> = {
        C: 0,
        "C#": 1,
        D: 2,
        "D#": 3,
        E: 4,
        F: 5,
        "F#": 6,
        G: 7,
        "G#": 8,
        A: 9,
        "A#": 10,
        B: 11,
    };
    return notes.map((note) => 60 + pitchClasses[note]).sort((a, b) => a - b);
}
