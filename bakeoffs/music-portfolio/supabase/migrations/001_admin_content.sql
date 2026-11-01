create extension if not exists pgcrypto;

create table if not exists public.music_entries (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    slug text not null unique,
    release_type text,
    release_date date,
    description text,
    cover_image_url text,
    genre text,
    credits text,
    track_listing text,
    external_links text,
    embed_url text,
    is_featured boolean not null default false,
    is_published boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.gear_entries (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text not null unique,
    category text,
    manufacturer text,
    model text,
    description text,
    personal_notes text,
    image_url text,
    external_url text,
    status text,
    tags text,
    is_featured boolean not null default false,
    is_published boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.questions (
    id uuid primary key default gen_random_uuid(),
    visitor_name text,
    visitor_email text,
    question_text text not null,
    answer_text text,
    status text not null default 'pending' check (status in ('pending', 'answered', 'published', 'rejected')),
    submitted_at timestamptz not null default now(),
    answered_at timestamptz,
    published_at timestamptz,
    updated_at timestamptz not null default now()
);

alter table public.music_entries enable row level security;
alter table public.gear_entries enable row level security;
alter table public.questions enable row level security;

create policy "Public can view published music" on public.music_entries for select using (is_published = true);
create policy "Admins manage music" on public.music_entries for all using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Public can view published gear" on public.gear_entries for select using (is_published = true);
create policy "Admins manage gear" on public.gear_entries for all using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Public can view published questions" on public.questions for select using (status = 'published');
create policy "Public can submit questions" on public.questions for insert with check (status = 'pending');
create policy "Admins manage questions" on public.questions for all using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create index if not exists music_entries_release_date_idx on public.music_entries (release_date desc);
create index if not exists gear_entries_category_idx on public.gear_entries (category);
create index if not exists questions_status_submitted_at_idx on public.questions (status, submitted_at desc);
