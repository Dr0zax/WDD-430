import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import { accessGuard, routes } from './router'
import './assets/css/main.css'

const router = createRouter({
  history: createWebHistory(),
  routes,
})
router.beforeEach(accessGuard)

createApp(App).use(createPinia()).use(router).mount('#app')
