import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import { accessGuard, routes } from './router'
import './assets/css/main.css'
import { useAuthStore } from './stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes,
})
router.beforeEach(accessGuard)

const app = createApp(App)
const pinia = createPinia()
app.use(pinia).use(router)
void useAuthStore(pinia).initialize()
app.mount('#app')
