import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Session } from '@supabase/supabase-js'
import { api } from '../services/api'
import type { User } from '../types/domain'

export const useAuthStore = defineStore('auth', () => {
  const session = ref<Session | null>(null)
  const user = ref<User | null>(null)
  const loading = ref(true)
  const error = ref('')
  let unsubscribe: (() => void) | undefined

  const isAuthenticated = computed(() => Boolean(session.value))

  async function loadProfile() {
    user.value = session.value?.user ? await api.users.get(session.value.user.id) : null
  }

  async function initialize() {
    loading.value = true
    error.value = ''
    try {
      const result = await api.auth.session()
      session.value = result.data.session
      if (session.value) await loadProfile()
      const authSubscription = api.auth.onAuthStateChange((_event, nextSession) => {
        session.value = nextSession
        void loadProfile().catch((profileError) => {
          error.value = profileError instanceof Error ? profileError.message : 'Unable to load your profile.'
        })
      })
      unsubscribe = () => authSubscription.data.subscription.unsubscribe()
    } catch (authError) {
      error.value = authError instanceof Error ? authError.message : 'Unable to initialize authentication.'
    } finally {
      loading.value = false
    }
  }

  async function signOut() {
    await api.auth.logout()
    session.value = null
    user.value = null
  }

  function dispose() {
    unsubscribe?.()
  }

  return { session, user, loading, error, isAuthenticated, initialize, signOut, dispose }
})
