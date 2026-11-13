<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { api } from '../services/api'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'
import type { Machine, Reservation } from '../types/domain'
import MachineCard from '../components/MachineCard.vue'
import ScheduleList from '../components/ScheduleList.vue'
const machines = ref<Machine[]>([])
const reservations = ref<Reservation[]>([])
const errorMessage = ref('')
const scheduleAvailable = ref(false)
const { isAuthenticated } = storeToRefs(useAuthStore())
onMounted(async () => {
  try { machines.value = await api.machines.list() } catch (error) { errorMessage.value = error instanceof Error ? error.message : 'Unable to load machine status.' }
  try { if ((await api.auth.session()).data.session) { reservations.value = await api.reservations.list(); scheduleAvailable.value = true } } catch { /* Public visitors can still see machine status. */ }
})
</script>
<template>
  <div class="container page-stack">
    <section v-if="!isAuthenticated" class="hero"><div class="hero__copy"><span class="eyebrow">Your laundry room, at a glance</span><h1>Clean clothes.<br><em>Less waiting.</em></h1><p>See what's available, find your next opening, and reserve a machine in a few taps.</p><div class="hero__actions"><RouterLink class="button button--accent" to="/dashboard/reservations/new">Reserve a machine <span>↗</span></RouterLink><RouterLink class="text-link" to="/login">Resident sign in</RouterLink></div></div><div class="hero__note"><span class="hero__note-mark">✦</span><p>Live status is updated by residents in the laundry room.</p></div></section>
    <section class="section-block"><div class="section-heading"><div><span class="eyebrow">Right now</span><h2>Machine status</h2></div><span class="live-indicator"><i></i> Live</span></div><div class="machine-grid"><MachineCard v-for="machine in machines" :key="machine.id" :machine="machine" /></div></section>
    <section class="section-block schedule-section"><div class="section-heading"><div><span class="eyebrow">The shared schedule</span><h2>Coming up today</h2></div><button class="button button--ghost">Today <span>⌄</span></button></div><ScheduleList v-if="scheduleAvailable" :reservations="reservations" /><p v-else class="muted">Sign in to view the building schedule.</p><div v-if="errorMessage" class="form-error">{{ errorMessage }}</div><div class="section-footer"><RouterLink class="text-link" to="/login">Sign in to view the full calendar <span>→</span></RouterLink></div></section>
  </div>
</template>
