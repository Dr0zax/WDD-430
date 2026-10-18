'use client'

import { useMemo, useState } from 'react'
import { Chord, deriveChords, Root, SCALES, ScaleId } from '../lib/music'

type ChordExplorerProps = {
  root: Root
  scaleId: ScaleId
  onChordSelect?: (chord: Chord) => void
}

export function ChordExplorer({ root, scaleId, onChordSelect }: ChordExplorerProps) {
  const [selectedChordId, setSelectedChordId] = useState<string>()
  const chords = useMemo(() => deriveChords(root, scaleId), [root, scaleId])

  function handleChordSelect(chord: Chord) {
    setSelectedChordId(chord.id)
    onChordSelect?.(chord)
  }

  return (
    <div className="chord-explorer-results">
      <div className="chord-grid" aria-label={`${root} ${SCALES.find((scale) => scale.id === scaleId)?.name} chords`}>
        {chords.map((chord) => (
          <button
            className={`chord-card${selectedChordId === chord.id ? ' selected' : ''}`}
            key={chord.id}
            type="button"
            aria-pressed={selectedChordId === chord.id}
            onClick={() => handleChordSelect(chord)}
          >
            <span className="chord-degree">{chord.romanNumeral}</span>
            <strong className="chord-symbol">{chord.symbol}</strong>
            <span className="chord-quality">{chord.quality}</span>
            <span className="chord-notes">{chord.notes.join(' · ')}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
