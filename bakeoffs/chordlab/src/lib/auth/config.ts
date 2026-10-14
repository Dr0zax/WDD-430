import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export function getAuthConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const secretKey = process.env.SUPABASE_SECRET_KEY
  const jwtSecret = process.env.JWT_SECRET

  if (!url || !secretKey || !jwtSecret) {
    throw new Error('Authentication environment variables are not configured.')
  }

  if (new TextEncoder().encode(jwtSecret).length < 32) {
    throw new Error('JWT_SECRET must be at least 32 bytes long.')
  }

  return { url, secretKey: secretKey, jwtSecret }
}

let adminClient: SupabaseClient | undefined

export function getAuthDatabase() {
  if (!adminClient) {
    const { url, secretKey: secretKey } = getAuthConfig()
    adminClient = createClient(url, secretKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  }

  return adminClient
}
