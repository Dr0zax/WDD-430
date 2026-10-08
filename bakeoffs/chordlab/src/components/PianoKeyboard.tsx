type KeyboardProps = {
    keyCount?: number;
    startMidi?: number;
    onKeyPress?: (midi: number) => void;
}

const NOTE_NAMES = [
    "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"
]

const BLACK_NOTES = new Set(["C#", "D#", "F#", "G#", "A#"]);

function midiToNote(midi: number) {
    return NOTE_NAMES[midi % 12];
}

export function PianoKeyboard({startMidi = 48, keyCount = 24, onKeyPress}: KeyboardProps) {
    const keys = Array.from({ length: keyCount }, (_, index) => {
        const midi = startMidi + index;
        const note = midiToNote(midi);

        return {
            midi,
            note,
            isBlack: BLACK_NOTES.has(note)
        }
    });

    const whiteKeys = keys.filter((key)=> !key.isBlack);
    const whiteKeyWidth = 100 / whiteKeys.length;

    return (
    <div className="relative flex h-48 min-w-max overflow-visible">
      {whiteKeys.map((key) => {
        return (
          <button
            key={key.midi}
            type="button"
            onClick={() => onKeyPress?.(key.midi)}
            className="relative h-full border border-zinc-800 bg-white
                       transition-colors hover:bg-gray-200"
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
            onClick={() => onKeyPress?.(key.midi)}
            className="absolute top-0 z-10 h-28 -translate-x-1/2
                       rounded-b-md border border-black bg-zinc-900
                        hover:bg-zinc-700 active:bg-zinc-500"
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
  );
};
