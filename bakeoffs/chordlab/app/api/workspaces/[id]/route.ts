import { NextResponse } from 'next/server'
import { getAuthDatabase } from '../../../../src/lib/auth/config'
import { getCurrentUser } from '../../../../src/lib/auth/session'
import { isProgression } from '../../../../src/lib/progression'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  let body: { name?: unknown; progression?: unknown }

  try {
    body = await request.json() as { name?: unknown; progression?: unknown }
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 })
  }

  const name = typeof body.name === 'string' ? body.name.trim() : undefined
  if (name !== undefined && (name.length < 1 || name.length > 100)) {
    return NextResponse.json({ error: 'Workspace name must be between 1 and 100 characters.' }, { status: 400 })
  }
  if (body.progression === undefined) {
    return NextResponse.json({ error: 'A progression is required.' }, { status: 400 })
  }
  if (!isProgression(body.progression)) {
    return NextResponse.json({ error: 'A valid progression is required.' }, { status: 400 })
  }

  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const updates: { progression: unknown; updated_at: string; name?: string } = {
      progression: body.progression,
      updated_at: new Date().toISOString(),
    }
    if (name !== undefined) updates.name = name

    const { data, error } = await getAuthDatabase()
      .from('workspaces')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select('id, name, progression, created_at, updated_at')
      .single()

    if (error) {
      return NextResponse.json({ error: 'Unable to save the workspace.' }, { status: 500 })
    }
    return NextResponse.json({ workspace: data })
  } catch {
    return NextResponse.json({ error: 'Authentication service is unavailable.' }, { status: 503 })
  }
}
