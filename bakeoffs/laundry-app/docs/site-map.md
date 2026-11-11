# Washboard site map

Washboard is an apartment laundry scheduling app. The public-facing experience emphasizes live machine status, while authenticated users can create and manage reservations. Administrators can manage the shared schedule and reservations for the building.

## Information architecture

```text
Washboard
├── Landing page /
│   ├── Live machine status
│   │   ├── Washer status
│   │   ├── Dryer status
│   │   └── Current user / resident using each machine
│   ├── Shared laundry calendar
│   │   ├── Washer schedule
│   │   ├── Dryer schedule
│   │   ├── Date navigation
│   │   └── Reservation details
│   └── Login call-to-action
│
├── Login /login
│   ├── Email or username
│   ├── Password
│   ├── Remember me
│   ├── Forgot password
│   └── Sign in
│
├── User dashboard /dashboard
│   ├── Current reservations
│   ├── Upcoming reservations
│   ├── Machine availability
│   ├── Create reservation /dashboard/reservations/new
│   │   ├── Select washer or dryer
│   │   ├── Select date
│   │   ├── Select available time slot
│   │   └── Confirm reservation
│   ├── Reservation details /dashboard/reservations/:id
│   │   ├── View reservation
│   │   ├── Edit reservation
│   │   └── Cancel reservation
│   └── Account settings /dashboard/settings
│
└── Admin dashboard /admin
    ├── Reservation overview
    ├── Full building schedule
    ├── Manage reservations /admin/reservations
    │   ├── View all reservations
    │   ├── Filter by resident, machine, date, or status
    │   ├── Edit reservation
    │   ├── Cancel reservation
    │   └── Create reservation on behalf of a resident
    ├── Manage machines /admin/machines
    │   ├── Add or remove a machine
    │   ├── Update machine status
    │   └── Mark a machine as unavailable for maintenance
    └── Manage users /admin/users
        ├── View residents
        ├── Update resident access
        └── Assign administrator role
```

## Page responsibilities

### Landing page

The landing page should answer two questions immediately:

1. Is the washer or dryer available right now?
2. Who is currently using it, and when will it be available?

The machine status section belongs above the fold. Each machine card should show its name, type, current status, current user when appropriate, remaining time, and the next reservation. The calendar below it provides the broader schedule.

### Login page

The login page is the entry point for residents and administrators. After authentication, residents go to `/dashboard`; administrators go to `/admin`.

### User dashboard

The user dashboard is the resident's personal workspace. It should prioritize upcoming reservations and make the primary action—creating a reservation—easy to find. Users may only view and manage their own reservations.

### Admin dashboard

The admin dashboard is for building or property staff. It provides a complete view of the schedule and tools to resolve conflicts, cancel reservations, manage machine availability, and manage resident access.

## Access rules

| Route | Guest | Resident | Admin |
| --- | --- | --- | --- |
| `/` | View | View | View |
| `/login` | View | Redirect to dashboard | Redirect to admin |
| `/dashboard/**` | Redirect to login | View and manage own reservations | View according to admin policy |
| `/admin/**` | Redirect to login | Forbidden or redirect | View and manage building data |

## Primary user flows

### Resident creates a reservation

```text
Landing page → Login → User dashboard → New reservation
→ Choose machine → Choose date/time → Confirm
→ Reservation details → Landing page schedule updated
```

### Resident manages a reservation

```text
Login → User dashboard → Reservation details
→ Edit or cancel → Confirm change → Dashboard updated
```

### Admin manages the schedule

```text
Login → Admin dashboard → Reservation overview
→ Filter or select reservation → Edit, cancel, or create
→ Schedule and machine status updated
```

## Suggested Vue Router structure

```ts
const routes = [
  { path: '/', component: LandingPage },
  { path: '/login', component: LoginPage },
  {
    path: '/dashboard',
    component: UserDashboard,
    meta: { requiresAuth: true, role: 'resident' },
    children: [
      { path: '', component: DashboardOverview },
      { path: 'reservations/new', component: CreateReservationPage },
      { path: 'reservations/:id', component: ReservationDetailsPage },
      { path: 'settings', component: AccountSettingsPage },
    ],
  },
  {
    path: '/admin',
    component: AdminDashboard,
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      { path: '', component: AdminOverview },
      { path: 'reservations', component: AdminReservationsPage },
      { path: 'machines', component: AdminMachinesPage },
      { path: 'users', component: AdminUsersPage },
    ],
  },
]
```

## Core domain objects

- **User:** resident or administrator account.
- **Machine:** washer or dryer with availability and maintenance status.
- **Reservation:** user, machine, start time, end time, and reservation status.
- **Machine usage:** the current active session, including the current user and remaining time.

The backend should be the source of truth for reservation conflicts. The landing page can use WebSockets or Server-Sent Events later to keep machine status current without requiring a full page refresh.
