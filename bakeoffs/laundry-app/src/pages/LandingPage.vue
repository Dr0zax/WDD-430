<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
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
const selectedDate = ref(new Date().toISOString().slice(0, 10))
const { isAuthenticated } = storeToRefs(useAuthStore())
const visibleReservations = computed(() => reservations.value.filter((reservation) => reservation.start.slice(0, 10) === selectedDate.value))
function shiftDate(amount: number) { const date = new Date(`${selectedDate.value}T12:00:00`); date.setDate(date.getDate() + amount); selectedDate.value = date.toISOString().slice(0, 10) }
onMounted(async () => {
  try { machines.value = await api.machines.list() } catch (error) { errorMessage.value = error instanceof Error ? error.message : 'Unable to load machine status.' }
  try { reservations.value = await api.reservations.listPublic(); scheduleAvailable.value = true } catch { /* Public visitors can still see machine status. */ }
})
</script>
<template>
  <div class="container page-stack">
    <section v-if="!isAuthenticated" class="hero"><div class="hero__copy"><span class="eyebrow">Your laundry room, at a glance</span><h1>Clean clothes.<br><em>Less waiting.</em></h1><p>See what's available, find your next opening, and reserve a machine in a few taps.</p><div class="hero__actions"><RouterLink class="button button--accent" to="/dashboard/reservations/new">Reserve a machine <span>↗</span></RouterLink><RouterLink class="text-link" to="/login">Resident sign in</RouterLink></div></div><div class="hero__note"><span class="hero__note-mark">✦</span><p>Live status is updated by residents in the laundry room.</p></div></section>
    <section class="section-block"><div class="section-heading"><div><span class="eyebrow">Right now</span><h2>Machine status</h2></div><span class="live-indicator"><i></i> Live</span></div><div class="machine-grid"><MachineCard v-for="machine in machines" :key="machine.id" :machine="machine" /></div></section>
    <section class="section-block schedule-section"><div class="section-heading"><div><span class="eyebrow">The shared schedule</span><h2>{{ new Date(`${selectedDate}T12:00:00`).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' }) }}</h2></div><div class="date-controls"><button class="button button--ghost" type="button" @click="shiftDate(-1)">←</button><button class="button button--ghost" type="button" @click="selectedDate = new Date().toISOString().slice(0, 10)">Today</button><button class="button button--ghost" type="button" @click="shiftDate(1)">→</button></div></div><ScheduleList v-if="scheduleAvailable" :reservations="visibleReservations" /><p v-else class="muted">The shared schedule is temporarily unavailable.</p><p v-if="scheduleAvailable && !visibleReservations.length" class="muted">No reservations on this date.</p><div v-if="errorMessage" class="form-error">{{ errorMessage }}</div><div class="section-footer"><RouterLink class="text-link" to="/login">Sign in to reserve a machine <span>→</span></RouterLink></div></section>
  </div>
</template>
