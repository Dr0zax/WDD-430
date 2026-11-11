<script setup lang="ts">
import { machines, reservations, residents } from '../../data/demo'
import ScheduleList from '../../components/ScheduleList.vue'
</script>
<template><div class="page-stack"><div class="stat-grid"><div class="stat-card"><span class="eyebrow">Today</span><strong>{{ reservations.length }}</strong><span>reservations</span></div><div class="stat-card"><span class="eyebrow">Machines</span><strong>{{ machines.length }}</strong><span>total machines</span></div><div class="stat-card"><span class="eyebrow">Residents</span><strong>{{ residents.length }}</strong><span>active accounts</span></div></div><div class="section-heading"><div><span class="eyebrow">Building schedule</span><h2>All reservations</h2></div><RouterLink class="button button--ghost" to="/admin/reservations">Manage all →</RouterLink></div><ScheduleList :reservations="reservations" admin /></div></template>
