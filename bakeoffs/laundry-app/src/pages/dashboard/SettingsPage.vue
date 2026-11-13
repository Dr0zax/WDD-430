<script setup lang="ts">
import { ref } from 'vue'
import { api } from '../../services/api'
import { useAuthStore } from '../../stores/auth'
const auth = useAuthStore()
const name = ref(auth.user?.name ?? '')
const unit = ref(auth.user?.unit ?? '')
const message = ref('')
const errorMessage = ref('')
async function save() {
  message.value = ''; errorMessage.value = ''
  try { if (!auth.user) throw new Error('Your session has expired.'); auth.user = await api.users.update(auth.user.id, { name: name.value, unit: unit.value }); message.value = 'Your account details were saved.' }
  catch (error) { errorMessage.value = error instanceof Error ? error.message : 'Unable to save your details.' }
}
</script>
<template><div class="form-page"><span class="eyebrow">Your account</span><h2>Account settings</h2><p class="muted">Keep your contact details up to date.</p><form class="reservation-form" @submit.prevent="save"><label>Full name<input v-model="name" required /></label><label>Email address<input :value="auth.user?.email" type="email" disabled /></label><label>Apartment / unit<input v-model="unit" /></label><button class="button button--accent">Save changes</button><p v-if="errorMessage" class="form-error">{{ errorMessage }}</p><p v-if="message" class="form-success">{{ message }}</p></form></div></template>
