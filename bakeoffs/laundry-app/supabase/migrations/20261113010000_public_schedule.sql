-- The landing page includes a public, read-only schedule. Expose only the
-- fields needed by that view instead of making profiles publicly readable.
create or replace view public.shared_reservations as
select r.id, r.machine_id, m.name as machine_name, m.type as machine_type,
       r.start_time, r.end_time, r.status, p.name as user_name
from public.reservations r
join public.machines m on m.id = r.machine_id
join public.profiles p on p.id = r.user_id
where r.status <> 'cancelled';

grant select on public.shared_reservations to anon, authenticated;
