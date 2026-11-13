<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { api } from '../../services/api'
import type { Reservation } from '../../types/domain'
import ScheduleList from '../../components/ScheduleList.vue'
const reservations = ref<Reservation[]>([]); const errorMessage = ref('')
onMounted(async () => { try { reservations.value = await api.reservations.list() } catch (error) { errorMessage.value = error instanceof Error ? error.message : 'Unable to load reservations.' } })
</script>
<template><div class="page-stack"><div class="section-heading"><div><span class="eyebrow">Operations</span><h2>Manage reservations</h2></div><button class="button button--accent">＋ Create reservation</button></div><p v-if="errorMessage" class="form-error">{{ errorMessage }}</p><div class="filter-bar"><input placeholder="Search resident or machine" /><select><option>All statuses</option><option>Confirmed</option><option>Cancelled</option></select><button class="button button--ghost">Filter</button></div><ScheduleList :reservations="reservations" admin /></div></template>
