'use client'

import { useEffect, useState } from 'react'

type User = {
  email: string
  displayName: string
}

export function AuthNavLink() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((response) => (response.ok ? response.json() : null))
      .then((body) => setUser(body?.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false))
  }, [])

  async function handleSignOut() {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    window.location.href = '/'
  }

  if (isLoading) return null

  if (user) {
    return (
      <button
        className="nav-link"
        type="button"
        onClick={handleSignOut}
      >
        Log Out
      </button>
    )
  }

  return (
    <a className="nav-link" href="/auth">
      Log In
    </a>
  )
}