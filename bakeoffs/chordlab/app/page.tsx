'use client'

import Link from 'next/link'
import { useState } from 'react'
import { PianoKeyboard } from '../src/components/PianoKeyboard'
import { WorkspacePanel } from '../src/components/WorkspacePanel'
import { WorkspacesPanel } from '../src/components/WorkspacesPanel'
import { NavBar } from '../src/components/NavBar'


export default function Home() {
  const [selectedMidi, setSelectedMidi] = useState<number>()

  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand" href="/" aria-label="ChordLab home">ChordLab</Link>
        <NavBar/>
      </header>
      <main className="page-content">
        <section id="workspace" className="workspace-grid" aria-label="Chord workspace">
          <WorkspacePanel />
          <WorkspacesPanel />
          <div className="panel piano-panel" id="piano">
            <div className="panel-heading">
              <div>
                <h2>Note input</h2>
                <p className="panel-copy">Select a key to preview a note.</p>
              </div>
              {selectedMidi !== undefined ? <span className="note-badge">MIDI {selectedMidi}</span> : null}
            </div>
            <div className="piano-scroll-region">
              <PianoKeyboard startMidi={36} keyCount={36} onKeyPress={setSelectedMidi} />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
