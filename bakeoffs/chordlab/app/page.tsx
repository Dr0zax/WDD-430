'use client'

import Link from 'next/link'
import { useState } from 'react'
import { PianoKeyboard } from '../src/components/PianoKeyboard'
import { WorkspacePanel } from '../src/components/WorkspacePanel'
import { NavBar } from '../src/components/NavBar'
import { ChordExplorer } from '../src/components/ChordExplorer'
import { KeyScaleSelector } from '../src/components/KeyScaleSelector'
import type { Chord, Root, ScaleId } from '../src/lib/music'


export default function Home() {
  const [selectedMidi, setSelectedMidi] = useState<number>()
  const [selectedChord, setSelectedChord] = useState<Chord>()
  const [root, setRoot] = useState<Root>('C')
  const [scaleId, setScaleId] = useState<ScaleId>('major')

  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand" href="/" aria-label="ChordLab home">ChordLab</Link>
        <NavBar/>
      </header>
      <main className="page-content">
        <section id="workspace" className="workspace-grid" aria-label="Chord workspace">
          <WorkspacePanel selectedChord={selectedChord} root={root} scaleId={scaleId} />
          <section className="panel explorer-panel" aria-labelledby="explorer-title">
            <div className="panel-heading">
              <div>
                {/* <p className="eyebrow">Explore harmony</p> */}
                <h2 id="explorer-title">Key and scale Selection</h2>
                <p className="panel-copy">Choose a key and a scale to work with.</p>
              </div>
            </div>
            <KeyScaleSelector
              root={root}
              scaleId={scaleId}
              onRootChange={(nextRoot) => {
                setRoot(nextRoot)
                setSelectedChord(undefined)
              }}
              onScaleChange={(nextScale) => {
                setScaleId(nextScale)
                setSelectedChord(undefined)
              }}
            />
            <ChordExplorer root={root} scaleId={scaleId} onChordSelect={setSelectedChord} />
          </section>
          <section className="panel piano-panel" id="piano">
            <div className="panel-heading">
              <div>
                <h2>Note input</h2>
                <p className="panel-copy">Select notes to build and hear a chord.</p>
              </div>
              {selectedMidi !== undefined ? <span className="note-badge">MIDI {selectedMidi}</span> : null}
            </div>
            <PianoKeyboard startMidi={36} keyCount={36} onKeyPress={setSelectedMidi} />
          </section>
          {selectedChord ? (
            <p className="selection-announcement" role="status">
              Selected {selectedChord.symbol} ({selectedChord.notes.join(', ')}). It is ready for the progression workspace.
            </p>
          ) : null}
        </section>
      </main>
    </div>
  )
}
