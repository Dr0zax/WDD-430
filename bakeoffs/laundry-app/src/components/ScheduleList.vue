<script setup lang="ts">
import type { Reservation } from '../types/domain'
defineProps<{ reservations: Reservation[]; admin?: boolean }>()
</script>
<template>
  <div class="schedule-list">
    <div v-for="reservation in reservations" :key="reservation.id" class="schedule-row">
      <div class="schedule-time"><strong>{{ reservation.start.split(' · ')[1] }}</strong><span>{{
        reservation.end.split(' · ')[1] }}</span></div>
      <div class="schedule-machine"><span class="machine-icon" :class="`machine-icon--${reservation.machineType}`">{{
        reservation.machineType === 'washer' ? 'W' : 'D' }}</span><span><strong>{{ reservation.machineName
            }}</strong><small>{{ admin ? reservation.userName : reservation.start.split(' · ')[0] }}</small></span>
      </div>
      <span class="badge badge--success">{{ reservation.status }}</span>
    </div>
  </div>
</template>
