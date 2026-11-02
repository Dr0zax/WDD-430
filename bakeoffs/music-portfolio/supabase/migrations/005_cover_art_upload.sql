-- Admin users upload cover art through the authenticated server-side client.
create policy "Allow authenticated cover art uploads"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'cover art');

create policy "Allow authenticated cover art updates"
on storage.objects
for update
to authenticated
using (bucket_id = 'cover art')
with check (bucket_id = 'cover art');

create policy "Allow authenticated cover art cleanup"
on storage.objects
for delete
to authenticated
using (bucket_id = 'cover art');
