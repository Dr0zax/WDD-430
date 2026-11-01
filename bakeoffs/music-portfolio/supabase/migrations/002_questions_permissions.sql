-- Explicit grants for the roles used by Supabase's Data API.
-- RLS controls which rows are accessible; these grants control which
-- operations the API role may perform at all.
grant select, insert on table public.questions to anon;
grant select, insert, update, delete on table public.questions to authenticated;
