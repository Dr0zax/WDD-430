import { NextResponse } from 'next/server'
import { createSession, findUserByEmail, toAuthUser, verifyPassword } from '../../../../src/lib/auth/session'
import { parseAuthInput } from '../../../../src/lib/auth/validation'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  let body: unknown
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 }) }

  const parsed = parseAuthInput(body, false)
  if ('error' in parsed) return NextResponse.json(parsed, { status: 400 })

  try {
    const user = await findUserByEmail(parsed.input.email)
    if (!user || !(await verifyPassword(parsed.input.password, user.password_hash))) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
    }

    await createSession(user.id)
    return NextResponse.json({ user: toAuthUser(user) })
  } catch {
    return NextResponse.json({ error: 'Authentication service is unavailable.' }, { status: 503 })
  }
}
