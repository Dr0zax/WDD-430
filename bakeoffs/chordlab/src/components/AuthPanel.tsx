'use client'

import { SubmitEvent, useEffect, useRef, useState } from 'react'
import { FieldError } from './ui/FieldError'
import { StatusMessage } from './ui/StatusMessage'
import { parseAuthInput } from '../lib/auth/client-validation'
import { redirect, RedirectType } from 'next/navigation'

type User = { email: string; displayName: string }

export function AuthPanel() {
  const [user, setUser] = useState<User | null>(null)
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState<string>()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const firstInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(async (response) => response.ok ? response.json() : null)
      .then((body: { user?: User } | null) => setUser(body?.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false))
  }, [])

  function changeMode(nextMode: 'login' | 'register') {
    setMode(nextMode)
    setError(undefined)
    window.setTimeout(() => firstInput.current?.focus(), 0)
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsed = parseAuthInput({ email, password, displayName }, mode === 'register')
    if ('error' in parsed) {
      setError(parsed.error)
      return
    }
    setError(undefined)
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/auth/${mode === 'register' ? 'register' : 'login'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, ...(mode === 'register' ? { displayName } : {}) }),
      })
      const body = await response.json() as { user?: User; error?: string }
      if (!response.ok) {
        setError(body.error ?? 'Unable to authenticate. Try again.')
        return
      }
      setUser(body.user ?? null)
      setPassword('')
    } catch {
      setError('The server could not be reached. Check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) return <section className="panel auth-panel" aria-busy="true"><p>Checking your session…</p></section>

  if (user) {
    redirect("/", RedirectType.push);
  }

  return (
    <section className="panel auth-panel" id="registration" aria-labelledby="auth-heading">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Account support</p>
          <h2 id="auth-heading">{mode === 'register' ? 'Create your account' : 'Log in to ChordLab'}</h2>
          <p className="panel-copy">Use an account to keep your ChordLab workspace ready for future features.</p>
        </div>
        <div className="auth-mode" role="group" aria-label="Authentication mode">
          <button type="button" className={mode === 'login' ? 'mode-button active' : 'mode-button'} onClick={() => changeMode('login')}>Log in</button>
          <button type="button" className={mode === 'register' ? 'mode-button active' : 'mode-button'} onClick={() => changeMode('register')}>Sign up</button>
        </div>
      </div>
      <form onSubmit={handleSubmit} noValidate aria-busy={isSubmitting}>
        {mode === 'register' ? (
          <>
            <label className="field-label" htmlFor="display-name">Display name</label>
            <input id="display-name" name="displayName" value={displayName} onChange={(event) => setDisplayName(event.target.value)} autoComplete="name" />
          </>
        ) : null}
        <label className="field-label" htmlFor="auth-email">Email</label>
        <input ref={firstInput} id="auth-email" name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required aria-invalid={Boolean(error)} aria-describedby={error ? 'auth-error' : undefined} />
        <label className="field-label" htmlFor="auth-password">Password</label>
        <input id="auth-password" name="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === 'register' ? 'new-password' : 'current-password'} required aria-invalid={Boolean(error)} aria-describedby={error ? 'auth-error' : undefined} />
        <FieldError id="auth-error" message={error} />
        <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Please wait…' : mode === 'register' ? 'Create account' : 'Log in'}
        </button>
      </form>
      {error ? <StatusMessage tone="error" title="Authentication failed">{error}</StatusMessage> : null}
    </section>
  )
}
