<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { api } from '../../services/api'
import type { User } from '../../types/domain'
const residents = ref<User[]>([]); const errorMessage = ref('')
onMounted(async () => { try { residents.value = await api.users.list() } catch (error) { errorMessage.value = error instanceof Error ? error.message : 'Unable to load residents.' } })
</script>
<template><div class="page-stack"><div class="section-heading"><div><span class="eyebrow">Building access</span><h2>Residents</h2></div><button class="button button--accent">＋ Invite resident</button></div><p v-if="errorMessage" class="form-error">{{ errorMessage }}</p><div class="user-table"><div v-for="resident in residents" :key="resident.id" class="user-row"><div class="avatar">{{ resident.name.split(' ').map(n => n[0]).join('') }}</div><div><strong>{{ resident.name }}</strong><small>{{ resident.email }} · Unit {{ resident.unit }}</small></div><span class="badge">{{ resident.role }}</span><button class="icon-button">•••</button></div></div></div></template>
