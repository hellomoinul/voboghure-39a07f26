-- Security fixes: Restrict storage buckets to prevent public listing
-- event-gallery bucket
CREATE POLICY "Authenticated upload to event-gallery"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'event-gallery');

CREATE POLICY "Authenticated read from event-gallery"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'event-gallery');

-- avatars bucket
CREATE POLICY "Authenticated upload to avatars"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Authenticated read from avatars"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'avatars');