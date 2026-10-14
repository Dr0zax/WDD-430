export type AuthInput = {
  email: string
  password: string
  displayName?: string
}

export function parseAuthInput(body: unknown, includeDisplayName: boolean) {
  const input = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>
  const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : ''
  const password = typeof input.password === 'string' ? input.password : ''
  const displayName = typeof input.displayName === 'string' ? input.displayName.trim() : ''

  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'Enter a valid email address.' }
  }
  if (password.length < 8 || password.length > 72) {
    return { error: 'Password must be between 8 and 72 characters.' }
  }
  if (includeDisplayName && (displayName.length < 1 || displayName.length > 80)) {
    return { error: 'Display name must be between 1 and 80 characters.' }
  }

  return { input: { email, password, displayName } as AuthInput }
}
