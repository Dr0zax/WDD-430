import { NextResponse } from 'next/server'
import { getAuthDatabase } from '../../../src/lib/auth/config'
import { getCurrentUser } from '../../../src/lib/auth/session'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await getAuthDatabase()
      .from('workspaces')
      .select('id, name, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: 'Unable to load workspaces.' }, { status: 500 })
    }

    return NextResponse.json({ workspaces: data })
  } catch {
    return NextResponse.json({ error: 'Authentication service is unavailable.' }, { status: 503 })
  }
}

export async function POST(request: Request) {
  let body: { name?: unknown }

  try {
    body = await request.json() as { name?: unknown }
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 })
  }

  try {
    const name = typeof body.name === 'string' ? body.name.trim() : ''

    if (name.length < 1 || name.length > 100) {
      return NextResponse.json(
        { error: 'Workspace name must be between 1 and 100 characters.' },
        { status: 400 },
      )
    }

    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await getAuthDatabase()
      .from('workspaces')
      .insert({ name, user_id: user.id })
      .select('id, name, created_at')
      .single()

    if (error) {
      return NextResponse.json({ error: `Unable to create workspace. ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({ workspace: data }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Authentication service is unavailable.' }, { status: 503 })
  }
}

