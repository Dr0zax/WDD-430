<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../../stores/auth'
const { user } = storeToRefs(useAuthStore())
</script>
<template><div class="container app-page"><div class="workspace-heading"><div><span class="eyebrow">Resident workspace</span><h1>Welcome, {{ user?.name ?? 'resident' }}.</h1></div><RouterLink class="button button--accent" to="/dashboard/reservations/new">＋ New reservation</RouterLink></div><div class="workspace-layout"><aside class="side-nav"><RouterLink to="/dashboard">Overview</RouterLink><RouterLink to="/dashboard/reservations/new">New reservation</RouterLink><RouterLink to="/dashboard/settings">Account settings</RouterLink><RouterLink class="side-nav__back" to="/">← Live status</RouterLink></aside><section class="workspace-content"><RouterView /></section></div></div></template>
