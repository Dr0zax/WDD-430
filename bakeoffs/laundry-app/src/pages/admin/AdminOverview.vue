<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { api } from '../../services/api'
import type { Machine, Reservation, User } from '../../types/domain'
import ScheduleList from '../../components/ScheduleList.vue'
const machines = ref<Machine[]>([]); const reservations = ref<Reservation[]>([]); const residents = ref<User[]>([]); const errorMessage = ref('')
onMounted(async () => { try { [machines.value, reservations.value, residents.value] = await Promise.all([api.machines.list(), api.reservations.list(), api.users.list()]) } catch (error) { errorMessage.value = error instanceof Error ? error.message : 'Unable to load admin data.' } })
</script>
<template><div class="page-stack"><p v-if="errorMessage" class="form-error">{{ errorMessage }}</p><div class="stat-grid"><div class="stat-card"><span class="eyebrow">Reservations</span><strong>{{ reservations.length }}</strong><span>scheduled</span></div><div class="stat-card"><span class="eyebrow">Machines</span><strong>{{ machines.length }}</strong><span>total machines</span></div><div class="stat-card"><span class="eyebrow">Residents</span><strong>{{ residents.length }}</strong><span>active accounts</span></div></div><div class="section-heading"><div><span class="eyebrow">Building schedule</span><h2>All reservations</h2></div><RouterLink class="button button--ghost" to="/admin/reservations">Manage all →</RouterLink></div><ScheduleList :reservations="reservations" admin /></div></template>
