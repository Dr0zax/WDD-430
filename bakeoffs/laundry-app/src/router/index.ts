import type { RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import AppShell from '../layouts/AppShell.vue'
import LandingPage from '../pages/LandingPage.vue'
import LoginPage from '../pages/LoginPage.vue'
import DashboardLayout from '../pages/dashboard/DashboardLayout.vue'
import DashboardOverview from '../pages/dashboard/DashboardOverview.vue'
import NewReservationPage from '../pages/dashboard/NewReservationPage.vue'
import ReservationDetailsPage from '../pages/dashboard/ReservationDetailsPage.vue'
import SettingsPage from '../pages/dashboard/SettingsPage.vue'
import AdminLayout from '../pages/admin/AdminLayout.vue'
import AdminOverview from '../pages/admin/AdminOverview.vue'
import AdminReservationsPage from '../pages/admin/AdminReservationsPage.vue'
import AdminMachinesPage from '../pages/admin/AdminMachinesPage.vue'
import AdminUsersPage from '../pages/admin/AdminUsersPage.vue'
import { api } from '../services/api'

export const routes: RouteRecordRaw[] = [{ path: '/', component: AppShell, children: [
  { path: '', component: LandingPage },
  { path: 'login', component: LoginPage },
  { path: 'dashboard', component: DashboardLayout, meta: { requiresAuth: true, role: 'resident' }, children: [
    { path: '', component: DashboardOverview }, { path: 'reservations/new', component: NewReservationPage }, { path: 'reservations/:id/edit', component: NewReservationPage }, { path: 'reservations/:id', component: ReservationDetailsPage }, { path: 'settings', component: SettingsPage },
  ] },
  { path: 'admin', component: AdminLayout, meta: { requiresAuth: true, role: 'admin' }, children: [
    { path: '', component: AdminOverview }, { path: 'reservations', component: AdminReservationsPage }, { path: 'machines', component: AdminMachinesPage }, { path: 'users', component: AdminUsersPage },
  ] },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]}]

export async function accessGuard(to: RouteLocationNormalized) {
  const protectedRoute = to.matched.find((record) => record.meta.requiresAuth)

  if (!protectedRoute) return true
  try {
    const session = (await api.auth.session()).data.session
    if (!session) return { path: '/login', query: { redirect: to.fullPath } }
    if (protectedRoute.meta.role) {
      const profile = await api.users.get(session.user.id)
      if (protectedRoute.meta.role !== profile.role && profile.role !== 'admin') return { path: '/dashboard' }
    }
  } catch {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
  return true
}
