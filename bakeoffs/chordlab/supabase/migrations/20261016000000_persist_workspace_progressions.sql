alter table public.workspaces
  add column if not exists progression jsonb not null default '{}'::jsonb,
  add column if not exists updated_at timestamptz not null default timezone('utc', now());

update public.workspaces
set progression = jsonb_build_object(
  'title', name,
  'key', 'C',
  'scale', 'major',
  'tempo', 100,
  'timeSignature', jsonb_build_array(4, 4),
  'chords', jsonb_build_array(),
  'updatedAt', updated_at::text
)
where progression = '{}'::jsonb;

create index if not exists workspaces_user_id_updated_at_idx
  on public.workspaces (user_id, updated_at desc);
