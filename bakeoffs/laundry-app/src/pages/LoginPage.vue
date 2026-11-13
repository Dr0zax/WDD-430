<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '../services/api'
import { isSupabaseConfigured } from '../lib/supabase'
const email = ref('')
const password = ref('')
const submitted = ref(false)
const resetSent = ref(false)
const resetMode = ref(false)
const errorMessage = ref('')
const router = useRouter()
const route = useRoute()
async function signIn() {
  errorMessage.value = ''
  submitted.value = false
  try {
    if (!isSupabaseConfigured) throw new Error('Authentication is not configured. Add the Supabase variables to your local environment.')
    await api.auth.login({ email: email.value, password: password.value })
    await router.push(typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard')
  } catch (error) { errorMessage.value = error instanceof Error ? error.message : 'Unable to sign in' }
}

async function sendResetEmail() {
  errorMessage.value = ''
  resetSent.value = false
  try {
    if (!isSupabaseConfigured) throw new Error('Authentication is not configured. Add the Supabase variables to your local environment.')
    await api.auth.resetPassword(email.value)
    resetSent.value = true
  } catch (error) { errorMessage.value = error instanceof Error ? error.message : 'Unable to send a reset email' }
}
</script>
<template><div class="container auth-page"><div class="auth-card"><span class="eyebrow">{{ resetMode ? 'Reset your password' : 'Welcome back' }}</span><h1>{{ resetMode ? 'Get back into Washboard' : 'Sign in to Washboard' }}</h1><p class="muted">{{ resetMode ? 'We will email you a secure password reset link.' : 'Manage your reservations and keep laundry day moving.' }}</p><form @submit.prevent="resetMode ? sendResetEmail() : signIn()"><label>Email address<input v-model="email" type="email" placeholder="you@example.com" required /></label><label v-if="!resetMode">Password<input v-model="password" type="password" placeholder="••••••••" required /></label><div v-if="!resetMode" class="form-row form-row--between"><label class="checkbox"><input type="checkbox" /> Remember me</label><button class="text-link text-link--button" type="button" @click="resetMode = true">Forgot password?</button></div><button class="button button--accent button--full">{{ resetMode ? 'Send reset link' : 'Sign in' }}</button><p v-if="errorMessage" class="form-error">{{ errorMessage }}</p><p v-if="resetSent" class="form-success">Check your inbox for a password reset link.</p></form><button v-if="resetMode" class="text-link text-link--button" type="button" @click="resetMode = false">← Back to sign in</button><p class="auth-footer">Need access? Ask your building manager.</p></div></div></template>
