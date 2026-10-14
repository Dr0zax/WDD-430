import { NextResponse } from 'next/server'
import { getAuthDatabase } from '../../../../src/lib/auth/config'
import { createSession, findUserByEmail, hashPassword, toAuthUser } from '../../../../src/lib/auth/session'
import { parseAuthInput } from '../../../../src/lib/auth/validation'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  let body: unknown
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 }) }

  const parsed = parseAuthInput(body, true)
  if ('error' in parsed) return NextResponse.json(parsed, { status: 400 })

  try {
    if (await findUserByEmail(parsed.input.email)) {
      return NextResponse.json({ error: 'Unable to create account with those details.' }, { status: 409 })
    }

    const { data, error } = await getAuthDatabase()
      .from('users')
      .insert({
        email: parsed.input.email,
        display_name: parsed.input.displayName,
        password_hash: await hashPassword(parsed.input.password),
        preferences: {},
      })
      .select('id, email, display_name, password_hash, preferences, created_at')
      .single()

    if (error || !data) {
      if (error?.code === '23505') return NextResponse.json({ error: 'Unable to create account with those details.' }, { status: 409 })
      return NextResponse.json({ error: 'Unable to create account. Try again.' }, { status: 500 })
    }

    await createSession(data.id)
    return NextResponse.json({ user: toAuthUser(data) }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Authentication service is unavailable.' }, { status: 503 })
  }
}
