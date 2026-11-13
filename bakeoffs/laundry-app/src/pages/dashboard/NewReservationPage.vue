<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { api } from '../../services/api'
import { useAuthStore } from '../../stores/auth'
import type { Machine } from '../../types/domain'
const machines = ref<Machine[]>([])
const machineId = ref('')
const start = ref('')
const end = ref('')
const complete = ref(false)
const errorMessage = ref('')
onMounted(async () => { try { machines.value = await api.machines.list(); machineId.value = machines.value.find((machine) => machine.status === 'available')?.id ?? '' } catch (error) { errorMessage.value = error instanceof Error ? error.message : 'Unable to load machines.' } })
async function createReservation() {
  complete.value = false; errorMessage.value = ''
  try { const user = useAuthStore().user; if (!user) throw new Error('Your session has expired. Please sign in again.'); await api.reservations.create({ machineId: machineId.value, userId: user.id, start: start.value, end: end.value, machineName: '', machineType: 'washer', userName: user.name }); complete.value = true } catch (error) { errorMessage.value = error instanceof Error ? error.message : 'Unable to save reservation.' }
}
</script>
<template><div class="form-page"><span class="eyebrow">New reservation</span><h2>Find your time</h2><p class="muted">Choose a machine and a 45-minute window.</p><form class="reservation-form" @submit.prevent="createReservation"><label>Machine<select v-model="machineId" required><option disabled value="">Choose a machine</option><option v-for="machine in machines.filter(m => m.status === 'available')" :key="machine.id" :value="machine.id">{{ machine.name }} · {{ machine.type }}</option></select></label><label>Start time<input v-model="start" type="datetime-local" required /></label><label>End time<input v-model="end" type="datetime-local" required /></label><button class="button button--accent">Confirm reservation <span>→</span></button><p v-if="errorMessage" class="form-error">{{ errorMessage }}</p><p v-if="complete" class="form-success">Reservation saved. <RouterLink to="/dashboard">View your dashboard →</RouterLink></p></form></div></template>
