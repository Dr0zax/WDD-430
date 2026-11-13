<script setup lang="ts">
import type { Reservation } from '../types/domain'
defineProps<{ reservations: Reservation[]; admin?: boolean }>()
function formatTime(value: string) {
  if (value.includes(' · ')) return value.split(' · ')[1]
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}
function formatDay(value: string) {
  if (value.includes(' · ')) return value.split(' · ')[0]
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}
</script>
<template>
  <div class="schedule-list">
    <div v-for="reservation in reservations" :key="reservation.id" class="schedule-row">
      <div class="schedule-time"><strong>{{ formatTime(reservation.start) }}</strong><span>{{ formatTime(reservation.end) }}</span></div>
      <div class="schedule-machine"><span class="machine-icon" :class="`machine-icon--${reservation.machineType}`">{{
        reservation.machineType === 'washer' ? 'W' : 'D' }}</span><span><strong>{{ reservation.machineName
            }}</strong><small>{{ reservation.userName }} · {{ formatDay(reservation.start) }}</small></span>
      </div>
      <span class="badge badge--success">{{ reservation.status }}</span>
    </div>
  </div>
</template>
