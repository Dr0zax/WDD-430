# ChordLab

ChordLab is a Next.js app for building and exploring musical chords.

## Development

Install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

Useful commands:

- `pnpm lint` checks the codebase.
- `pnpm build` creates a production build.
- `pnpm start` serves the production build.

## Supabase API setup

1. Create a Supabase project and copy `.env.example` to `.env.local`.
2. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from the Supabase project API settings.
3. Set a server-only `SUPABASE_SERVICE_ROLE_KEY` and a random `JWT_SECRET` of at least 32 bytes. Never expose either value to browser code.
4. Start the app and check `/api/health`; it should return `ok: true`.

Authentication uses bcrypt password hashes and a seven-day, httpOnly JWT cookie. The admin Supabase client is server-only and stores users in `public.users`; `/api/auth/*` provides register, login, logout, and current-session checks. `/api/workspaces` provides authenticated list/create operations, and `/api/workspaces/[id]` saves progression changes. Do not expose a secret/service-role key in browser code or commit `.env.local`.
