<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const { isAuthenticated, user } = storeToRefs(auth)
const router = useRouter()

async function signOut() {
  await auth.signOut()
  await router.push('/')
}
</script>
<template>
  <div class="site-shell">
    <header class="site-header container">
      <RouterLink class="brand" to="/"><span class="brand-mark">W</span><span>Washboard</span></RouterLink>
      <nav class="site-nav" aria-label="Primary navigation"><RouterLink to="/">Live status</RouterLink><RouterLink v-if="isAuthenticated" to="/dashboard">My dashboard</RouterLink><span v-if="user" class="site-nav__user">{{ user.name }}</span><button v-if="isAuthenticated" class="button button--small button--dark" type="button" @click="signOut">Sign out</button><RouterLink v-else class="button button--small button--dark" to="/login">Sign in</RouterLink></nav>
    </header>
    <main><RouterView /></main>
    <footer class="site-footer container"><span>Washboard</span><span>Simple scheduling for shared laundry rooms.</span></footer>
  </div>
</template>
