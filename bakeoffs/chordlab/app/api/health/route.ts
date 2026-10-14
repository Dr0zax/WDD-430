import { NextResponse } from 'next/server'

export function GET() {
  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  )

  return NextResponse.json({
    ok: configured,
    service: 'chordlab-api',
    supabase: configured ? 'configured' : 'missing_configuration',
  }, { status: configured ? 200 : 503 })
}

