create extension if not exists pgcrypto;

create type public.user_role as enum ('resident', 'admin');
create type public.machine_type as enum ('washer', 'dryer');
create type public.machine_status as enum ('available', 'in-use', 'maintenance');
create type public.reservation_status as enum ('confirmed', 'pending', 'cancelled');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  role public.user_role not null default 'resident',
  unit text,
  created_at timestamptz not null default now()
);
create table public.machines (
  id uuid primary key default gen_random_uuid(), name text not null,
  type public.machine_type not null, status public.machine_status not null default 'available',
  location text default 'Laundry room', created_at timestamptz not null default now()
);
create table public.reservations (
  id uuid primary key default gen_random_uuid(),
  machine_id uuid not null references public.machines(id) on delete restrict,
  user_id uuid not null references public.profiles(id) on delete cascade,
  start_time timestamptz not null, end_time timestamptz not null,
  status public.reservation_status not null default 'confirmed',
  created_at timestamptz not null default now(), constraint reservation_time_order check (end_time > start_time)
);
create index reservations_machine_time_idx on public.reservations (machine_id, start_time, end_time);
create index reservations_user_time_idx on public.reservations (user_id, start_time);

alter table public.profiles enable row level security;
alter table public.machines enable row level security;
alter table public.reservations enable row level security;

create or replace function public.current_user_role() returns public.user_role
language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid();
$$;
create policy "Public can view machines" on public.machines for select using (true);
create policy "Admins manage machines" on public.machines for all using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');
create policy "Users view profiles" on public.profiles for select to authenticated using (true);
create policy "Users update own profile" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "Users view reservations" on public.reservations for select to authenticated using (user_id = auth.uid() or public.current_user_role() = 'admin');
create policy "Users create reservations" on public.reservations for insert to authenticated with check (user_id = auth.uid() or public.current_user_role() = 'admin');
create policy "Users update reservations" on public.reservations for update to authenticated using (user_id = auth.uid() or public.current_user_role() = 'admin') with check (user_id = auth.uid() or public.current_user_role() = 'admin');
create policy "Admins delete reservations" on public.reservations for delete to authenticated using (public.current_user_role() = 'admin');

create or replace function public.prevent_reservation_overlap() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.status <> 'cancelled' and exists (
    select 1 from public.reservations existing where existing.machine_id = new.machine_id and existing.id <> new.id and existing.status <> 'cancelled'
      and tstzrange(existing.start_time, existing.end_time, '[)') && tstzrange(new.start_time, new.end_time, '[)')
  ) then raise exception 'This machine is already reserved for that time.'; end if;
  return new;
end;
$$;
create trigger reservations_no_overlap before insert or update on public.reservations for each row execute function public.prevent_reservation_overlap();

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin insert into public.profiles (id, name, email) values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)), new.email); return new; end;
$$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
