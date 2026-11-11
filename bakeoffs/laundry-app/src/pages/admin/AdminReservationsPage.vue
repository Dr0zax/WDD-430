<script setup lang="ts">
import { reservations } from '../../data/demo'
import ScheduleList from '../../components/ScheduleList.vue'
</script>
<template><div class="page-stack"><div class="section-heading"><div><span class="eyebrow">Operations</span><h2>Manage reservations</h2></div><button class="button button--accent">＋ Create reservation</button></div><div class="filter-bar"><input placeholder="Search resident or machine" /><select><option>All statuses</option><option>Confirmed</option><option>Cancelled</option></select><button class="button button--ghost">Filter</button></div><ScheduleList :reservations="reservations" admin /></div></template>
