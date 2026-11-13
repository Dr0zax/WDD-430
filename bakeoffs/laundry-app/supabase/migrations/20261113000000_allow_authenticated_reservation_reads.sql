-- Residents can view the shared reservation schedule, while write access remains restricted.
drop policy if exists "Users view reservations" on public.reservations;

create policy "Authenticated users view reservations"
  on public.reservations
  for select
  to authenticated
  using (true);
