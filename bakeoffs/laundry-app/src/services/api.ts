import { supabase } from '../lib/supabase'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import type { Machine, Reservation, User, UserRole } from '../types/domain'

type MachineRow = { id: string; name: string; type: Machine['type']; status: Machine['status']; location: string | null }
type ReservationRow = { id: string; machine_id: string; user_id: string; start_time: string; end_time: string; status: Reservation['status']; machines: MachineRow; profiles: { name: string } | null }
type ProfileRow = { id: string; name: string; email: string; role: UserRole; unit: string | null }

function requireSupabase() {
  if (!supabase) throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to your local environment.')
  return supabase
}
function throwIfError(error: { message: string } | null) { if (error) throw new Error(error.message) }
function toMachine(row: MachineRow): Machine { return { id: row.id, name: row.name, type: row.type, status: row.status, location: row.location ?? undefined } }
function toReservation(row: ReservationRow): Reservation { return { id: row.id, machineId: row.machine_id, machineName: row.machines.name, machineType: row.machines.type, userId: row.user_id, userName: row.profiles?.name ?? 'Resident', start: row.start_time, end: row.end_time, status: row.status } }
function toUser(row: ProfileRow): User { return { id: row.id, name: row.name, email: row.email, role: row.role, unit: row.unit ?? undefined } }

export const api = {
  auth: {
    login: async (credentials: { email: string; password: string }) => {
      const { data, error } = await requireSupabase().auth.signInWithPassword(credentials)
      throwIfError(error); if (!data.user) throw new Error('Unable to sign in')
      return { user: await api.users.get(data.user.id), token: data.session?.access_token ?? '' }
    },
    logout: async () => { const { error } = await requireSupabase().auth.signOut(); throwIfError(error) },
    me: async () => { const { data, error } = await requireSupabase().auth.getUser(); throwIfError(error); if (!data.user) throw new Error('No active session'); return api.users.get(data.user.id) },
    session: () => requireSupabase().auth.getSession(),
    onAuthStateChange: (callback: (event: AuthChangeEvent, session: Session | null) => void) => requireSupabase().auth.onAuthStateChange(callback),
  },
  machines: {
    list: async () => { const { data, error } = await requireSupabase().from('machines').select('*').order('name'); throwIfError(error); return (data ?? []).map(toMachine) },
    get: async (id: string) => { const { data, error } = await requireSupabase().from('machines').select('*').eq('id', id).single(); throwIfError(error); return toMachine(data as MachineRow) },
    create: async (machine: Omit<Machine, 'id'>) => { const { data, error } = await requireSupabase().from('machines').insert(machine).select().single(); throwIfError(error); return toMachine(data as MachineRow) },
    update: async (id: string, machine: Partial<Machine>) => { const { data, error } = await requireSupabase().from('machines').update(machine).eq('id', id).select().single(); throwIfError(error); return toMachine(data as MachineRow) },
    remove: async (id: string) => { const { error } = await requireSupabase().from('machines').delete().eq('id', id); throwIfError(error) },
  },
  reservations: {
    list: async () => { const { data, error } = await requireSupabase().from('reservations').select('*, machines!inner(*), profiles(name)').order('start_time'); throwIfError(error); return ((data ?? []) as unknown as ReservationRow[]).map(toReservation) },
    get: async (id: string) => { const { data, error } = await requireSupabase().from('reservations').select('*, machines!inner(*), profiles(name)').eq('id', id).single(); throwIfError(error); return toReservation(data as unknown as ReservationRow) },
    create: async (reservation: Omit<Reservation, 'id' | 'status'>) => { const { data, error } = await requireSupabase().from('reservations').insert({ machine_id: reservation.machineId, user_id: reservation.userId, start_time: reservation.start, end_time: reservation.end, status: 'confirmed' }).select('*, machines!inner(*), profiles(name)').single(); throwIfError(error); return toReservation(data as unknown as ReservationRow) },
    update: async (id: string, reservation: Partial<Reservation>) => { const { data, error } = await requireSupabase().from('reservations').update({ start_time: reservation.start, end_time: reservation.end, status: reservation.status, machine_id: reservation.machineId }).eq('id', id).select('*, machines!inner(*), profiles(name)').single(); throwIfError(error); return toReservation(data as unknown as ReservationRow) },
    cancel: async (id: string) => api.reservations.update(id, { status: 'cancelled' }),
  },
  users: {
    list: async () => { const { data, error } = await requireSupabase().from('profiles').select('*').order('name'); throwIfError(error); return (data ?? []).map(toUser) },
    get: async (id: string) => { const { data, error } = await requireSupabase().from('profiles').select('*').eq('id', id).single(); throwIfError(error); return toUser(data as ProfileRow) },
    update: async (id: string, user: Partial<User>) => { const { data, error } = await requireSupabase().from('profiles').update({ name: user.name, unit: user.unit }).eq('id', id).select().single(); throwIfError(error); return toUser(data as ProfileRow) },
  },
}
