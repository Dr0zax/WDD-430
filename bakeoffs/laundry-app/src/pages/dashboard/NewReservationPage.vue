<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '../../services/api'
import { useAuthStore } from '../../stores/auth'
import type { Machine } from '../../types/domain'

const route = useRoute()
const machines = ref<Machine[]>([])
const machineId = ref('')
const start = ref('')
const end = ref('')
const complete = ref(false)
const errorMessage = ref('')
const editId = computed(() => typeof route.params.id === 'string' ? route.params.id : '')
const editing = computed(() => Boolean(editId.value))
function inputDate(value: string) { const date = new Date(value); if (Number.isNaN(date.getTime())) return ''; const offset = date.getTimezoneOffset(); return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16) }
onMounted(async () => { try { machines.value = await api.machines.list(); const existing = editId.value ? await api.reservations.get(editId.value) : null; machineId.value = existing?.machineId ?? machines.value.find((machine) => machine.status === 'available')?.id ?? ''; start.value = existing ? inputDate(existing.start) : ''; end.value = existing ? inputDate(existing.end) : '' } catch (error) { errorMessage.value = error instanceof Error ? error.message : 'Unable to load reservation details.' } })
async function saveReservation() {
  complete.value = false; errorMessage.value = ''
  try { const user = useAuthStore().user; if (!user) throw new Error('Your session has expired. Please sign in again.'); const startDate = new Date(start.value); const endDate = new Date(end.value); if (endDate.getTime() - startDate.getTime() !== 45 * 60 * 1000) throw new Error('Reservations must be exactly 45 minutes.'); if (startDate.getTime() < Date.now()) throw new Error('Choose a future start time.'); const machine = machines.value.find((item) => item.id === machineId.value); if (!machine || machine.status === 'maintenance') throw new Error('Choose an available machine.'); if (editing.value) await api.reservations.update(editId.value, { machineId: machineId.value, start: start.value, end: end.value }); else await api.reservations.create({ machineId: machine.id, userId: user.id, start: start.value, end: end.value, machineName: machine.name, machineType: machine.type, userName: user.name }); complete.value = true } catch (error) { errorMessage.value = error instanceof Error ? error.message : 'Unable to save reservation.' }
}
</script>
<template>
  <div class="form-page"><span class="eyebrow">{{ editing ? 'Edit reservation' : 'New reservation' }}</span>
    <h2>{{ editing ? 'Update your time' : 'Find your time' }}</h2>
    <p class="muted">Choose a machine and a 45-minute window.</p>
    <form class="reservation-form" @submit.prevent="saveReservation"><label>Machine<select v-model="machineId" required>
          <option disabled value="">Choose a machine</option>
          <option v-for="machine in machines.filter((item) => item.status !== 'maintenance')" :key="machine.id"
            :value="machine.id">{{ machine.name }} · {{ machine.type }}</option>
        </select></label><label>Start time<input v-model="start" type="datetime-local" required /></label><label>End
        time<input v-model="end" type="datetime-local" required /></label><button class="button button--accent">{{
          editing ? 'Save changes' : 'Confirm reservation' }} <span>→</span></button>
      <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>
      <p v-if="complete" class="form-success">Reservation saved. <RouterLink to="/dashboard">View your dashboard →
        </RouterLink>
      </p>
    </form>
  </div>
</template>
