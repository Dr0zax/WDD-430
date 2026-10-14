'use client'

import { SubmitEvent, useState } from 'react'
import Link from 'next/link'
import { AuthPanel } from '../src/components/AuthPanel'
import { PianoKeyboard } from '../src/components/PianoKeyboard'
import { FieldError } from '../src/components/ui/FieldError'
import { StatusMessage } from '../src/components/ui/StatusMessage'
import { requiredText } from '../src/lib/validation'

export default function Home() {
  const [workspaceName, setWorkspaceName] = useState('')
  const [error, setError] = useState<string>()
  const [requestError, setRequestError] = useState<string>()
  const [savedName, setSavedName] = useState<string>()
  const [selectedMidi, setSelectedMidi] = useState<number>()
  const [isSaving, setIsSaving] = useState(false)

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = requiredText(workspaceName, 'Workspace name')

    if (!result.valid) {
      setSavedName(undefined)
      setError(result.message)
      setRequestError(undefined)
      return
    }

    setError(undefined)
    setRequestError(undefined)
    setSavedName(undefined)
    setIsSaving(true)

    try {
      const response = await fetch('/api/workspaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: workspaceName.trim() }),
      })
      const body = await response.json() as {
        workspace?: { name: string }
        error?: string
      }

      if (!response.ok) {
        setRequestError(
          response.status === 401
            ? 'Sign in before creating a workspace.'
            : body.error ?? 'Unable to create the workspace. Try again.',
        )
        return
      }

      setSavedName(body.workspace?.name ?? workspaceName.trim())
    } catch {
      setRequestError('The server could not be reached. Check your connection and try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand" href="/" aria-label="ChordLab home">ChordLab</Link>
        <nav className="main-nav" aria-label="Main navigation">
          <a className="nav-link active" href="#workspace">Build</a>
          <a className="nav-link" href="#piano">Progressions</a>
          <a className="nav-link" href="#registration">Sign Up</a>
        </nav>
      </header>
      <main className="page-content">
        <AuthPanel />
        <section id="workspace" className="workspace-grid" aria-label="Chord workspace">
          <div className="panel setup-panel">
            <h2>Workspace setup</h2>
            <p className="panel-copy">Give this idea a name so it is easy to recognize while you work.</p>
            <form onSubmit={handleSubmit} noValidate aria-busy={isSaving}>
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
              <button className="primary-button" type="submit" disabled={isSaving}>
                {isSaving ? 'Saving workspace…' : 'Start workspace'}
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
