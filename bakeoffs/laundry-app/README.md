# Laundry App

Vue 3 + TypeScript starter for an apartment laundry scheduling app.

## Run locally

```bash
pnpm install
pnpm dev
```

## Available scripts

- `pnpm dev` — start the Vite development server
- `pnpm build` — type-check and build for production
- `pnpm type-check` — run Vue's TypeScript checker
- `pnpm preview` — preview the production build locally

## Supabase setup

The app uses `@supabase/supabase-js` for browser authentication and database access. Copy `.env.example` to `.env.local` and fill in the project URL and publishable key from Supabase. The app intentionally does not use or expose a service-role/secret key.

Apply `supabase/migrations/20261111000000_washboard.sql` with the Supabase CLI or SQL editor. It creates profiles, machines, reservations, reservation-overlap protection, the auth profile trigger, and Row Level Security policies.

When the Supabase variables are absent, the UI remains available in demo mode; database calls fail with a clear configuration message rather than silently writing elsewhere.

## Planned architecture

- Vue 3 components for the dashboard and reservation flows
- Pinia for shared machine, reservation, and session state
- Vue Router for dashboard, schedule, and account routes
- A backend API as the source of truth for reservation conflicts
- WebSockets or Server-Sent Events for live machine status

## Project documentation

- [Site map](docs/site-map.md)
