<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { api } from '../../services/api'
import { useAuthStore } from '../../stores/auth'
import type { Machine, Reservation } from '../../types/domain'
import ScheduleList from '../../components/ScheduleList.vue'

const auth = useAuthStore()
const machines = ref<Machine[]>([])
const reservations = ref<Reservation[]>([])
const errorMessage = ref('')
const loading = ref(true)
const upcoming = computed(() => reservations.value.filter((reservation) => reservation.userId === auth.user?.id && reservation.status !== 'cancelled').slice(0, 2))

onMounted(async () => {
  try {
    ;[machines.value, reservations.value] = await Promise.all([api.machines.list(), api.reservations.list()])
  } catch (error) { errorMessage.value = error instanceof Error ? error.message : 'Unable to load your dashboard.' }
  finally { loading.value = false }
})
</script>
<template><div class="page-stack"><p v-if="loading" class="muted">Loading your dashboard…</p><p v-if="errorMessage" class="form-error">{{ errorMessage }}</p><div class="stat-grid"><div class="stat-card"><span class="eyebrow">Upcoming</span><strong>{{ upcoming.length }}</strong><span>reservations</span></div><div class="stat-card"><span class="eyebrow">Available now</span><strong>{{ machines.filter(m => m.status === 'available').length }}</strong><span>machines</span></div><div class="stat-card"><span class="eyebrow">Account</span><strong>{{ auth.user?.unit ?? '—' }}</strong><span>unit</span></div></div><div class="section-heading"><div><span class="eyebrow">Your schedule</span><h2>Upcoming reservations</h2></div></div><ScheduleList :reservations="upcoming" links /><div v-if="!loading && !upcoming.length" class="callout"><span class="hero__note-mark">✦</span><div><strong>No reservations yet.</strong><p>Choose an available machine to get started.</p></div><RouterLink class="text-link" to="/dashboard/reservations/new">Find a time →</RouterLink></div></div></template>
