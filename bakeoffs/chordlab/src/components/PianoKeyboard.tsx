'use client'

import { useEffect, useMemo, useState } from 'react'
import { playNotes, stopAllAudio } from '../lib/audio'

type KeyboardProps = {
    keyCount?: number;
    startMidi?: number;
    onKeyPress?: (midi: number) => void;
    onSelectedNotesChange?: (midi: number[]) => void;
    onSubmitNotes?: (midi: number[]) => void;
}

const NOTE_NAMES = [
    "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"
]

const BLACK_NOTES = new Set(["C#", "D#", "F#", "G#", "A#"]);

export function midiToNote(midi: number) {
    return NOTE_NAMES[((midi % 12) + 12) % 12];
}

export function PianoKeyboard({startMidi = 48, keyCount = 24, onKeyPress, onSelectedNotesChange, onSubmitNotes}: KeyboardProps) {
    const [selectedNotes, setSelectedNotes] = useState<number[]>([])
    const [audioError, setAudioError] = useState<string>()
    const [isPlaying, setIsPlaying] = useState(false)
    const keys = useMemo(() => Array.from({ length: keyCount }, (_, index) => {
        const midi = startMidi + index;
        const note = midiToNote(midi);

        return {
            midi,
            note,
            isBlack: BLACK_NOTES.has(note)
        }
    }), [keyCount, startMidi]);

    useEffect(() => onSelectedNotesChange?.(selectedNotes), [onSelectedNotesChange, selectedNotes])

    function toggleNote(midi: number) {
        setSelectedNotes((current) => current.includes(midi) ? current.filter((note) => note !== midi) : [...current, midi].sort((a, b) => a - b))
        onKeyPress?.(midi)
    }

    function clearNotes() {
        stopAllAudio()
        setIsPlaying(false)
        setSelectedNotes([])
    }

    function stopChord() {
        stopAllAudio()
        setIsPlaying(false)
    }

    async function playSelectedNotes() {
        try {
            setAudioError(undefined)
            await playNotes(selectedNotes)
            setIsPlaying(true)
        } catch (error) {
            setAudioError(error instanceof Error ? error.message : 'Unable to start audio. Try again.')
            setIsPlaying(false)
        }
    }

    const whiteKeys = keys.filter((key)=> !key.isBlack);
    const whiteKeyWidth = 100 / whiteKeys.length;

    return (
    <div className="piano-shell">
    <div className="piano-scroll-region" aria-label="Scrollable piano keyboard">
    <div className="piano border border-zinc-800 rounded-2xl" role="group" aria-label="Piano keyboard">
      {whiteKeys.map((key) => { 
        return (
          <button
            key={key.midi}
            type="button"
            onClick={() => toggleNote(key.midi)}
            aria-pressed={selectedNotes.includes(key.midi)}
            aria-label={`${key.note} (${key.midi})`}
            className={`piano-white-key relative h-full bg-white
                       ${selectedNotes.includes(key.midi) ? 'selected' : ''}
                       transition-colors not-first:border-l border-zinc-500 hover:bg-gray-200`}
            style={{ width: `${whiteKeyWidth}%` }}
          >
            <span className="absolute bottom-2 left-0 right-0 text-xs text-zinc-500">
              {key.note}
            </span>
          </button>
        );
      })}

      {keys.map((key, index) => {
        if (!key.isBlack) return null;

        const precedingWhiteKeys = keys
          .slice(0, index)
          .filter((item) => !item.isBlack).length;

        const left = precedingWhiteKeys * whiteKeyWidth;

        return (
          <button
            key={key.midi}
            type="button"
            onClick={() => toggleNote(key.midi)}
            aria-pressed={selectedNotes.includes(key.midi)}
            aria-label={`${key.note} sharp (${key.midi})`}
            className={`piano-black-key absolute top-0 z-10 h-28 -translate-x-1/2
                       rounded-b-md border border-black bg-zinc-900
                        hover:bg-zinc-700 active:bg-zinc-500 ${selectedNotes.includes(key.midi) ? 'selected' : ''}`}
            style={{
              left: `${left}%`,
              width: `${whiteKeyWidth * 0.62}%`,
            }}
          >
            <span className="sr-only">{key.note}</span>
          </button>
        );
      })}
    </div>
    </div>
      <div className="piano-actions">
        <p className="piano-help">Swipe the keyboard sideways to reach all notes.</p>
        <p className="selected-notes" aria-live="polite">{selectedNotes.length ? `Selected: ${selectedNotes.map(midiToNote).join(', ')}` : 'No notes selected yet.'}</p>
        <button type="button" className="secondary-button" onClick={clearNotes} disabled={!selectedNotes.length}>Clear</button>
        <button type="button" className="secondary-button" onClick={() => onSubmitNotes?.(selectedNotes)} disabled={!selectedNotes.length}>Use notes</button>
        <button type="button" className="secondary-button" onClick={stopChord} disabled={!isPlaying}>Stop</button>
        <button type="button" className="primary-button compact-button" onClick={playSelectedNotes} disabled={!selectedNotes.length}>{isPlaying ? 'Play again' : 'Play chord'}</button>
      </div>
      {audioError ? <p className="audio-error" role="alert">{audioError} Click Play to retry.</p> : null}
    </div>
  );
};
