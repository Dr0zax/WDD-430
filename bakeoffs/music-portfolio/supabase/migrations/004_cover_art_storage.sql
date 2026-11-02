-- The site lists files so it can match `<release slug>.<extension>` to a release.
-- A public bucket permits downloading known URLs, but listing still needs SELECT.
create policy "Allow public listing of cover art"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'cover art');
