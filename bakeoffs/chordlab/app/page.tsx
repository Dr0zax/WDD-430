'use client'

import { SubmitEvent, useState } from 'react'
import Link from 'next/link'
import { PianoKeyboard } from '../src/components/PianoKeyboard'
import { FieldError } from '../src/components/ui/FieldError'
import { StatusMessage } from '../src/components/ui/StatusMessage'
import { requiredText } from '../src/lib/validation'

export default function Home() {
  const [workspaceName, setWorkspaceName] = useState('')
  const [error, setError] = useState<string>()
  const [savedName, setSavedName] = useState<string>()
  const [selectedMidi, setSelectedMidi] = useState<number>()

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = requiredText(workspaceName, 'Workspace name')

    if (!result.valid) {
      setSavedName(undefined)
      setError(result.message)
      return
    }

    setError(undefined)
    setSavedName(workspaceName.trim())
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand" href="/" aria-label="ChordLab home">ChordLab</Link>
        <nav className="main-nav" aria-label="Main navigation">
          <a className="nav-link active" href="#workspace">Build</a>
          <a className="nav-link" href="#piano">Progressions</a>
        </nav>
      </header>
      <main className="page-content">
        <section id="workspace" className="workspace-grid" aria-label="Chord workspace">
          <div className="panel setup-panel">
            <h2>Workspace setup</h2>
            <p className="panel-copy">Give this idea a name so it is easy to recognize while you work.</p>
            <form onSubmit={handleSubmit} noValidate>
              <label className="field-label" htmlFor="workspace-name">Workspace name</label>
              <input
                id="workspace-name"
                name="workspaceName"
                value={workspaceName}
                onChange={(event) => setWorkspaceName(event.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'workspace-name-error' : undefined}
                placeholder="e.g. Sunday morning"
                autoComplete="off"
              />
              <FieldError id="workspace-name-error" message={error} />
              <button className="primary-button" type="submit">Start workspace</button>
            </form>
            {savedName ? (
              <StatusMessage tone="success" title="Workspace ready">
                “{savedName}” is ready for note exploration.
              </StatusMessage>
            ) : null}
          </div>

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
