<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { api } from '../../services/api'
import type { User } from '../../types/domain'
const residents = ref<User[]>([]); const errorMessage = ref(''); const message = ref('')
onMounted(async () => { try { residents.value = await api.users.list() } catch (error) { errorMessage.value = error instanceof Error ? error.message : 'Unable to load residents.' } })
async function toggleRole(resident: User) { message.value = ''; try { const updated = await api.users.update(resident.id, { role: resident.role === 'admin' ? 'resident' : 'admin' }); Object.assign(resident, updated); message.value = `${resident.name} is now a ${resident.role}.` } catch (error) { errorMessage.value = error instanceof Error ? error.message : 'Unable to update resident access.' } }
</script>
<template><div class="page-stack"><div class="section-heading"><div><span class="eyebrow">Building access</span><h2>Residents</h2></div><span class="muted">New residents are added through Supabase Auth.</span></div><p v-if="errorMessage" class="form-error">{{ errorMessage }}</p><p v-if="message" class="form-success">{{ message }}</p><div class="user-table"><div v-for="resident in residents" :key="resident.id" class="user-row"><div class="avatar">{{ resident.name.split(' ').map(n => n[0]).join('') }}</div><div><strong>{{ resident.name }}</strong><small>{{ resident.email }} · Unit {{ resident.unit ?? '—' }}</small></div><span class="badge">{{ resident.role }}</span><button class="button button--ghost" @click="toggleRole(resident)">{{ resident.role === 'admin' ? 'Remove admin' : 'Make admin' }}</button></div></div></div></template>
