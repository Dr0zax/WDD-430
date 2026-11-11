import type { Machine, Reservation, User } from '../types/domain'

export const demoUser: User = { id: 'u-1', name: 'Jamie Rivera', email: 'jamie@example.com', role: 'resident', unit: '4B' }

export const machines: Machine[] = [
  { id: 'w-01', name: 'Washer 01', type: 'washer', status: 'in-use', currentUser: 'Avery Chen · 2A', availableAt: '10:25 AM', nextReservation: 'Today · 11:00 AM', location: 'Laundry room' },
  { id: 'w-02', name: 'Washer 02', type: 'washer', status: 'available', nextReservation: 'Today · 12:30 PM', location: 'Laundry room' },
  { id: 'd-01', name: 'Dryer 01', type: 'dryer', status: 'in-use', currentUser: 'Morgan Lee · 5C', availableAt: '10:40 AM', nextReservation: 'Today · 11:30 AM', location: 'Laundry room' },
  { id: 'd-02', name: 'Dryer 02', type: 'dryer', status: 'maintenance', nextReservation: 'Back online tomorrow', location: 'Laundry room' },
]

export const reservations: Reservation[] = [
  { id: 'res-101', machineId: 'w-02', machineName: 'Washer 02', machineType: 'washer', userId: 'u-1', userName: demoUser.name, start: 'Today · 12:30 PM', end: 'Today · 1:15 PM', status: 'confirmed' },
  { id: 'res-102', machineId: 'd-01', machineName: 'Dryer 01', machineType: 'dryer', userId: 'u-1', userName: demoUser.name, start: 'Tomorrow · 8:00 AM', end: 'Tomorrow · 8:45 AM', status: 'confirmed' },
  { id: 'res-103', machineId: 'w-01', machineName: 'Washer 01', machineType: 'washer', userId: 'u-2', userName: 'Avery Chen', start: 'Today · 11:00 AM', end: 'Today · 11:45 AM', status: 'confirmed' },
]

export const residents: User[] = [demoUser, { id: 'u-2', name: 'Avery Chen', email: 'avery@example.com', role: 'resident', unit: '2A' }, { id: 'u-3', name: 'Morgan Lee', email: 'morgan@example.com', role: 'resident', unit: '5C' }]
