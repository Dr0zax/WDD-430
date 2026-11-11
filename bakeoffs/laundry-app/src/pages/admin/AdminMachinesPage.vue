<script setup lang="ts">
import { machines } from '../../data/demo'
import MachineCard from '../../components/MachineCard.vue'
</script>
<template><div class="page-stack"><div class="section-heading"><div><span class="eyebrow">Operations</span><h2>Manage machines</h2></div><button class="button button--accent">＋ Add machine</button></div><div class="machine-grid"><MachineCard v-for="machine in machines" :key="machine.id" :machine="machine" /></div></div></template>
