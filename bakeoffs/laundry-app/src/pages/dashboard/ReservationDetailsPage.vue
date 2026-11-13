<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '../../services/api'
import type { Reservation } from '../../types/domain'
const route = useRoute(); const router = useRouter(); const reservation = ref<Reservation | null>(null); const errorMessage = ref(''); const cancelled = ref(false)
onMounted(async () => { try { reservation.value = await api.reservations.get(String(route.params.id)) } catch (error) { errorMessage.value = error instanceof Error ? error.message : 'Unable to load this reservation.' } })
async function cancelReservation() { if (!reservation.value) return; try { reservation.value = await api.reservations.cancel(reservation.value.id); cancelled.value = true } catch (error) { errorMessage.value = error instanceof Error ? error.message : 'Unable to cancel this reservation.' } }
</script>
<template><div class="detail-card"><span class="eyebrow">Reservation details</span><p v-if="errorMessage" class="form-error">{{ errorMessage }}</p><template v-if="reservation"><h2>{{ reservation.machineName }}</h2><p class="detail-time">{{ reservation.start }} – {{ reservation.end }}</p><span class="badge badge--success">{{ reservation.status }}</span><div class="detail-actions"><button class="button button--dark" disabled>Edit reservation</button><button v-if="reservation.status !== 'cancelled'" class="button button--ghost" @click="cancelReservation">Cancel reservation</button><RouterLink v-else class="button button--ghost" to="/dashboard">Back to dashboard</RouterLink></div><p v-if="cancelled" class="form-success">Reservation cancelled.</p></template><p v-else-if="!errorMessage" class="muted">Loading reservation…</p></div></template>
