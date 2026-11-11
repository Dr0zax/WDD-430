export type UserRole = 'resident' | 'admin'
export type MachineType = 'washer' | 'dryer'
export type MachineStatus = 'available' | 'in-use' | 'maintenance'
export type ReservationStatus = 'confirmed' | 'pending' | 'cancelled'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  unit?: string
}

export interface Machine {
  id: string
  name: string
  type: MachineType
  status: MachineStatus
  currentUser?: string
  availableAt?: string
  nextReservation?: string
  location?: string
}

export interface Reservation {
  id: string
  machineId: string
  machineName: string
  machineType: MachineType
  userId: string
  userName: string
  start: string
  end: string
  status: ReservationStatus
}

export interface ApiError {
  message: string
  status?: number
}
