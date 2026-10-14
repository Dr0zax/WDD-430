import { NextResponse } from 'next/server'
import { getCurrentUser } from '../../../src/lib/auth/session'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ error: 'Authentication service is unavailable.' }, { status: 503 })
  }
}

