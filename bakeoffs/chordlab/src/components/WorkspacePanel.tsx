import { SubmitEvent, useState } from "react";
import { FieldError } from "./ui/FieldError";
import { StatusMessage } from "./ui/StatusMessage";
import { requiredText } from "../lib/validation";

export function WorkspacePanel() {
    const [workspaceName, setWorkspaceName] = useState("");
    const [error, setError] = useState<string>();
    const [requestError, setRequestError] = useState<string>();
    const [savedName, setSavedName] = useState<string>();
    const [isSaving, setIsSaving] = useState(false);

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
                body: JSON.stringify({ name: workspaceName.trim() }),
            });
            const body = (await response.json()) as {
                workspace?: { name: string };
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
            <h2>Workspace setup</h2>
            <p className="panel-copy">
                Give this idea a name so it is easy to recognize while you work.
            </p>
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
        </div>
    );
}
