import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export function getAuthConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const jwtSecret = process.env.JWT_SECRET

  if (!url || !serviceRoleKey || !jwtSecret) {
    throw new Error('Authentication environment variables are not configured.')
  }

  if (new TextEncoder().encode(jwtSecret).length < 32) {
    throw new Error('JWT_SECRET must be at least 32 bytes long.')
  }

  return { url, serviceRoleKey, jwtSecret }
}

let adminClient: SupabaseClient | undefined

export function getAuthDatabase() {
  if (!adminClient) {
    const { url, serviceRoleKey } = getAuthConfig()
    adminClient = createClient(url, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  }

  return adminClient
}
