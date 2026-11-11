<script setup lang="ts">
import type { Machine } from '../types/domain'
defineProps<{ machine: Machine }>()
</script>
<template>
  <article class="machine-card" :class="`machine-card--${machine.status}`">
    <div class="machine-card__top"><span class="eyebrow">{{ machine.type }}</span><span class="status-dot"
        :class="`status-dot--${machine.status}`"></span></div>
    <h3>{{ machine.name }}</h3>
    <p v-if="machine.status === 'in-use'" class="machine-card__status">In use by <strong>{{ machine.currentUser
        }}</strong></p>
    <p v-else-if="machine.status === 'available'" class="machine-card__status status-text--available">Ready to start</p>
    <p v-else class="machine-card__status status-text--maintenance">Under maintenance</p>
    <div class="machine-card__meta"><span v-if="machine.availableAt">Available {{ machine.availableAt }}</span><span
        v-else>{{ machine.nextReservation }}</span><span class="status-label">{{ machine.status.replace('-', ' ')
        }}</span></div>
  </article>
</template>
