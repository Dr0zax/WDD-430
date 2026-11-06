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

## Planned architecture

- Vue 3 components for the dashboard and reservation flows
- Pinia for shared machine, reservation, and session state
- Vue Router for dashboard, schedule, and account routes
- A backend API as the source of truth for reservation conflicts
- WebSockets or Server-Sent Events for live machine status
