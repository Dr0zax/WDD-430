-- Explicit grants for the content tables used by the Supabase Data API.
-- RLS policies still restrict these operations to administrator sessions.
grant select on table public.music_entries to anon;
grant select, insert, update, delete on table public.music_entries to authenticated;

grant select on table public.gear_entries to anon;
grant select, insert, update, delete on table public.gear_entries to authenticated;
