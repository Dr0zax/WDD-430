<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { api } from '../../services/api'
import type { Machine } from '../../types/domain'
import MachineCard from '../../components/MachineCard.vue'
const machines = ref<Machine[]>([]); const errorMessage = ref('')
onMounted(async () => { try { machines.value = await api.machines.list() } catch (error) { errorMessage.value = error instanceof Error ? error.message : 'Unable to load machines.' } })
</script>
<template><div class="page-stack"><div class="section-heading"><div><span class="eyebrow">Operations</span><h2>Manage machines</h2></div><button class="button button--accent">＋ Add machine</button></div><p v-if="errorMessage" class="form-error">{{ errorMessage }}</p><div class="machine-grid"><MachineCard v-for="machine in machines" :key="machine.id" :machine="machine" /></div></div></template>
