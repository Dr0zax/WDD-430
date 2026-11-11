<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '../services/api'
import { isSupabaseConfigured } from '../lib/supabase'
const email = ref('')
const password = ref('')
const submitted = ref(false)
const errorMessage = ref('')
const router = useRouter()
const route = useRoute()
async function signIn() {
  errorMessage.value = ''
  try {
    if (isSupabaseConfigured) {
      const result = await api.auth.login({ email: email.value, password: password.value })
      localStorage.setItem('washboard-role', result.user.role)
      await router.push(typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard')
      return
    }
    localStorage.setItem('washboard-session', 'demo-session')
    localStorage.setItem('washboard-role', 'resident')
    submitted.value = true
  } catch (error) { errorMessage.value = error instanceof Error ? error.message : 'Unable to sign in' }
}
</script>
<template><div class="container auth-page"><div class="auth-card"><span class="eyebrow">Welcome back</span><h1>Sign in to Washboard</h1><p class="muted">Manage your reservations and keep laundry day moving.</p><form @submit.prevent="signIn"><label>Email or username<input v-model="email" type="email" placeholder="you@example.com" required /></label><label>Password<input v-model="password" type="password" placeholder="••••••••" required /></label><div class="form-row form-row--between"><label class="checkbox"><input type="checkbox" /> Remember me</label><a href="#">Forgot password?</a></div><button class="button button--accent button--full">Sign in</button><p v-if="errorMessage" class="form-error">{{ errorMessage }}</p><p v-if="submitted" class="form-success">Demo mode: welcome back. <RouterLink to="/dashboard">Continue to dashboard →</RouterLink></p></form><p class="auth-footer">Need access? Ask your building manager.</p></div></div></template>
