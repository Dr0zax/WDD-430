<script setup lang="ts">
import { machines, reservations } from '../data/demo'
import MachineCard from '../components/MachineCard.vue'
import ScheduleList from '../components/ScheduleList.vue'
</script>
<template>
  <div class="container page-stack">
    <section class="hero"><div class="hero__copy"><span class="eyebrow">Your laundry room, at a glance</span><h1>Clean clothes.<br><em>Less waiting.</em></h1><p>See what's available, find your next opening, and reserve a machine in a few taps.</p><div class="hero__actions"><RouterLink class="button button--accent" to="/dashboard/reservations/new">Reserve a machine <span>↗</span></RouterLink><RouterLink class="text-link" to="/login">Resident sign in</RouterLink></div></div><div class="hero__note"><span class="hero__note-mark">✦</span><p>Live status is updated by residents in the laundry room.</p></div></section>
    <section class="section-block"><div class="section-heading"><div><span class="eyebrow">Right now</span><h2>Machine status</h2></div><span class="live-indicator"><i></i> Live</span></div><div class="machine-grid"><MachineCard v-for="machine in machines" :key="machine.id" :machine="machine" /></div></section>
    <section class="section-block schedule-section"><div class="section-heading"><div><span class="eyebrow">The shared schedule</span><h2>Coming up today</h2></div><button class="button button--ghost">Today <span>⌄</span></button></div><ScheduleList :reservations="reservations" /><div class="section-footer"><RouterLink class="text-link" to="/login">Sign in to view the full calendar <span>→</span></RouterLink></div></section>
  </div>
</template>
