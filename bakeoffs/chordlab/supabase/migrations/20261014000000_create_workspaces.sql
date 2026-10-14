create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  display_name text not null check (char_length(trim(display_name)) between 1 and 80),
  password_hash text not null,
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists users_email_lower_idx on public.users (lower(email));

alter table public.users enable row level security;

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 100),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists workspaces_user_id_created_at_idx
  on public.workspaces (user_id, created_at desc);

alter table public.workspaces enable row level security;

