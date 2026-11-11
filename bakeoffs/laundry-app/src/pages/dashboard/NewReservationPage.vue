<script setup lang="ts">
import { ref } from 'vue'
import { machines } from '../../data/demo'
const complete = ref(false)
</script>
<template><div class="form-page"><span class="eyebrow">New reservation</span><h2>Find your time</h2><p class="muted">Choose a machine and a 45-minute window.</p><form class="reservation-form" @submit.prevent="complete = true"><label>Machine<select><option v-for="machine in machines.filter(m => m.status === 'available')" :key="machine.id">{{ machine.name }} · {{ machine.type }}</option></select></label><label>Date<input type="date" value="2026-11-11" /></label><label>Available time<select><option>12:30 PM – 1:15 PM</option><option>1:30 PM – 2:15 PM</option><option>3:00 PM – 3:45 PM</option></select></label><button class="button button--accent">Confirm reservation <span>→</span></button><p v-if="complete" class="form-success">Reservation saved in demo mode. <RouterLink to="/dashboard">View your dashboard →</RouterLink></p></form></div></template>
