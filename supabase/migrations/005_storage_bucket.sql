-- Create a storage bucket for lesson media
insert into
    storage.buckets (id, name, public)
values (
        'lesson-media',
        'lesson-media',
        true
    ) on conflict (id) do nothing;

-- Set up security policies for the bucket
create policy "Public Access" on storage.objects for
select using (bucket_id = 'lesson-media');

create policy "Authenticated Uploads" on storage.objects for
insert
    to authenticated
with
    check (bucket_id = 'lesson-media');

create policy "Authenticated Updates" on storage.objects for
update to authenticated using (bucket_id = 'lesson-media');

create policy "Authenticated Deletes" on storage.objects for
delete to authenticated using (bucket_id = 'lesson-media');