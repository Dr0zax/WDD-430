-- Seed data for the Drozax music portfolio.
-- Release list sourced from https://drozax.bandcamp.com/music
-- Dates are intentionally NULL where Bandcamp only exposed a month/year or
-- did not expose a release date in the music listing.

insert into public.music_entries (
    title,
    slug,
    release_type,
    release_date,
    description,
    genre,
    credits,
    external_links,
    is_featured,
    is_published
)
values
    ('Chromatic', 'chromatic', 'single', null, null, 'Chillsynth/Chillwave', 'Drozax', '{"bandcamp": "https://drozax.bandcamp.com/track/chromatic"}'::jsonb, false, true),
    ('Polaris', 'polaris', 'album', '2025-10-01', 'My 3rd full-length album.', 'Chillsynth/Chillwave', 'Drozax', '{"bandcamp": "https://drozax.bandcamp.com/album/polaris"}'::jsonb, true, true),
    ('Subspace', 'subspace', 'single', null, null, 'Chillsynth/Chillwave', 'Drozax', '{"bandcamp": "https://drozax.bandcamp.com/track/subspace"}'::jsonb, false, true),
    ('Stardust', 'stardust', 'single', null, null, 'Chillsynth/Chillwave', 'Drozax', '{"bandcamp": "https://drozax.bandcamp.com/track/stardust"}'::jsonb, false, true),
    ('Lumen', 'lumen', 'single', null, null, 'Chillsynth/Chillwave', 'Drozax', '{"bandcamp": "https://drozax.bandcamp.com/track/lumen"}'::jsonb, false, true),
    ('Ponder', 'ponder', 'single', null, null, 'Chillsynth/Chillwave', 'Drozax', '{"bandcamp": "https://drozax.bandcamp.com/track/ponder"}'::jsonb, false, true),
    ('Skyline', 'skyline', 'single', null, null, 'Chillsynth/Chillwave', 'Drozax', '{"bandcamp": "https://drozax.bandcamp.com/track/skyline"}'::jsonb, false, true),
    ('Signals', 'signals', 'single', null, null, 'Chillsynth/Chillwave', 'Drozax', '{"bandcamp": "https://drozax.bandcamp.com/track/signals"}'::jsonb, false, true),
    ('Kinetic', 'kinetic', 'single', null, null, 'Chillsynth/Chillwave', 'Drozax', '{"bandcamp": "https://drozax.bandcamp.com/track/kinetic"}'::jsonb, false, true),
    ('Palm', 'palm', 'single', null, null, 'Chillsynth/Chillwave', 'Drozax', '{"bandcamp": "https://drozax.bandcamp.com/track/palm"}'::jsonb, false, true),
    ('Reflections', 'reflections', 'single', null, null, 'Chillsynth/Chillwave', 'Drozax', '{"bandcamp": "https://drozax.bandcamp.com/track/reflections"}'::jsonb, false, true),
    ('Flow', 'flow', 'single', null, null, 'Chillsynth/Chillwave', 'Drozax', '{"bandcamp": "https://drozax.bandcamp.com/track/flow"}'::jsonb, false, true),
    ('Velocity', 'velocity', 'single', null, null, 'Chillsynth/Chillwave', 'Drozax', '{"bandcamp": "https://drozax.bandcamp.com/track/velocity"}'::jsonb, false, true),
    ('Velocity Remastered', 'velocity-remastered', 'single', null, null, 'Chillsynth/Chillwave', 'Drozax', '{"bandcamp": "https://drozax.bandcamp.com/track/velocity-remastered"}'::jsonb, false, true),
    ('Alpine', 'alpine', 'single', null, null, 'Chillsynth/Chillwave', 'Drozax', '{"bandcamp": "https://drozax.bandcamp.com/track/alpine"}'::jsonb, false, true)
on conflict (slug) do update set
    title = excluded.title,
    release_type = excluded.release_type,
    release_date = excluded.release_date,
    description = excluded.description,
    genre = excluded.genre,
    credits = excluded.credits,
    external_links = excluded.external_links,
    is_featured = excluded.is_featured,
    is_published = excluded.is_published,
    updated_at = now();

insert into public.gear_entries (
    name,
    slug,
    category,
    manufacturer,
    model,
    description,
    status,
    tags,
    is_featured,
    is_published
)
values
    ('FL Studio', 'fl-studio', 'DAW', 'Image-Line', 'FL Studio', 'Digital audio workstation used for music production.', 'owned', '{"DAW","production"}', false, true),
    ('Ableton', 'ableton', 'DAW', 'Ableton', null, 'Digital audio workstation used for music production and arrangement.', 'owned', '{"DAW","production"}', false, true),
    ('Serum 2', 'serum-2', 'Software synthesizer', 'Xfer Records', 'Serum 2', 'Wavetable synthesizer used for sound design and production.', 'owned', '{"synthesizer","soft synth"}', false, true),
    ('Arturia V Collection X', 'arturia-v-collection-x', 'Instrument collection', 'Arturia', 'V Collection X', 'Collection of virtual instruments used for sound design and production.', 'owned', '{"virtual instruments","synthesizer"}', false, true),
    ('Arturia FX Collection 5', 'arturia-fx-collection-5', 'Effects collection', 'Arturia', 'FX Collection 5', 'Collection of software effects used for mixing and sound design.', 'owned', '{"effects","mixing"}', false, true)
on conflict (slug) do update set
    name = excluded.name,
    category = excluded.category,
    manufacturer = excluded.manufacturer,
    model = excluded.model,
    description = excluded.description,
    status = excluded.status,
    tags = excluded.tags,
    is_featured = excluded.is_featured,
    is_published = excluded.is_published,
    updated_at = now();
