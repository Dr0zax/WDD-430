import bcrypt from 'bcrypt'
import { jwtVerify, SignJWT } from 'jose'
import { cookies } from 'next/headers'
import { getAuthConfig, getAuthDatabase } from './config'

export const SESSION_COOKIE = 'chordlab_session'
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7

export type AuthUser = {
  id: string
  email: string
  displayName: string
  preferences: Record<string, unknown>
  createdAt: string
}

type DatabaseUser = {
  id: string
  email: string
  display_name: string
  password_hash: string
  preferences: Record<string, unknown> | null
  created_at: string
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export function toAuthUser(user: DatabaseUser): AuthUser {
  return {
    id: user.id,
    email: user.email,
    displayName: user.display_name,
    preferences: user.preferences ?? {},
    createdAt: user.created_at,
  }
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export async function createSession(userId: string) {
  const { jwtSecret } = getAuthConfig()
  const secret = new TextEncoder().encode(jwtSecret)
  const token = await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .setIssuer('chordlab')
    .setAudience('chordlab-web')
    .sign(secret)

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION_SECONDS,
  })
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
}

async function getSessionUserId() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null

  try {
    const { jwtSecret } = getAuthConfig()
    const { payload } = await jwtVerify(token, new TextEncoder().encode(jwtSecret), {
      issuer: 'chordlab',
      audience: 'chordlab-web',
    })
    return typeof payload.sub === 'string' ? payload.sub : null
  } catch {
    return null
  }
}

export async function getCurrentUser() {
  const userId = await getSessionUserId()
  if (!userId) return null

  const { data, error } = await getAuthDatabase()
    .from('users')
    .select('id, email, display_name, password_hash, preferences, created_at')
    .eq('id', userId)
    .maybeSingle()

  if (error || !data) return null
  return toAuthUser(data as DatabaseUser)
}

export async function findUserByEmail(email: string) {
  const { data, error } = await getAuthDatabase()
    .from('users')
    .select('id, email, display_name, password_hash, preferences, created_at')
    .eq('email', normalizeEmail(email))
    .maybeSingle()

  if (error) throw error
  return data as DatabaseUser | null
}
