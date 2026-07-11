create table testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) > 0 and char_length(name) <= 80),
  quote text not null check (char_length(quote) > 0 and char_length(quote) <= 500),
  user_id uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

alter table testimonials enable row level security;

create policy "Public read"
  on testimonials for select
  using (true);

create policy "Authenticated insert own"
  on testimonials for insert
  with check (auth.uid() = user_id);

-- ============================================================
-- Admin-managed content: gallery, services, site settings
-- Emails below must exactly match src/admin/allowedAdminEmails.js
-- (that file is UX-only; this SQL is the real security boundary).
-- ============================================================

create table gallery_photos (
  id uuid primary key default gen_random_uuid(),
  image_path text not null,
  caption text check (char_length(caption) <= 200),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table services (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) > 0 and char_length(title) <= 120),
  description text not null check (char_length(description) > 0 and char_length(description) <= 500),
  image_path text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table site_settings (
  id smallint primary key default 1 check (id = 1),
  hero_image_path text,
  hero_heading text check (char_length(hero_heading) <= 150),
  hero_subheading text check (char_length(hero_subheading) <= 300),
  about_image_path text,
  about_heading text check (char_length(about_heading) <= 150),
  about_bio text check (char_length(about_bio) <= 2000),
  updated_at timestamptz not null default now()
);
insert into site_settings (id) values (1) on conflict (id) do nothing;

alter table gallery_photos enable row level security;
alter table services enable row level security;
alter table site_settings enable row level security;

create policy "Public read" on gallery_photos for select using (true);
create policy "Public read" on services for select using (true);
create policy "Public read" on site_settings for select using (true);

create policy "Admin write" on gallery_photos for all
  using (auth.jwt() ->> 'email' in ('ndiranguh02@gmail.com', 'meshackmashua@gmail.com'))
  with check (auth.jwt() ->> 'email' in ('ndiranguh02@gmail.com', 'meshackmashua@gmail.com'));

create policy "Admin write" on services for all
  using (auth.jwt() ->> 'email' in ('ndiranguh02@gmail.com', 'meshackmashua@gmail.com'))
  with check (auth.jwt() ->> 'email' in ('ndiranguh02@gmail.com', 'meshackmashua@gmail.com'));

create policy "Admin write" on site_settings for all
  using (auth.jwt() ->> 'email' in ('ndiranguh02@gmail.com', 'meshackmashua@gmail.com'))
  with check (auth.jwt() ->> 'email' in ('ndiranguh02@gmail.com', 'meshackmashua@gmail.com'));

-- Testimonial moderation: same two admins can delete inappropriate
-- submissions. Existing "Public read" / "Authenticated insert own"
-- policies are untouched.
create policy "Admin delete" on testimonials for delete
  using (auth.jwt() ->> 'email' in ('ndiranguh02@gmail.com', 'meshackmashua@gmail.com'));

-- ============================================================
-- Storage: one shared public bucket for all admin-managed media
-- ============================================================
insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do nothing;

update storage.buckets
set file_size_limit = 5242880,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
where id = 'site-media';

create policy "Public read site-media" on storage.objects for select
  using (bucket_id = 'site-media');

create policy "Admin insert site-media" on storage.objects for insert
  with check (bucket_id = 'site-media' and auth.jwt() ->> 'email' in ('ndiranguh02@gmail.com', 'meshackmashua@gmail.com'));

create policy "Admin update site-media" on storage.objects for update
  using (bucket_id = 'site-media' and auth.jwt() ->> 'email' in ('ndiranguh02@gmail.com', 'meshackmashua@gmail.com'))
  with check (bucket_id = 'site-media' and auth.jwt() ->> 'email' in ('ndiranguh02@gmail.com', 'meshackmashua@gmail.com'));

create policy "Admin delete site-media" on storage.objects for delete
  using (bucket_id = 'site-media' and auth.jwt() ->> 'email' in ('ndiranguh02@gmail.com', 'meshackmashua@gmail.com'));

-- ============================================================
-- Admin-managed content: availability calendar
-- Emails below must exactly match src/admin/allowedAdminEmails.js
-- (that file is UX-only; this SQL is the real security boundary).
-- ============================================================

create table availability_schedule (
  day_of_week smallint primary key check (day_of_week between 0 and 6), -- 0 = Sunday .. 6 = Saturday, matches JS Date.getDay()
  is_available boolean not null default true,
  start_time time not null default '09:00',
  end_time time not null default '18:00',
  check (start_time < end_time)
);

create table unavailability_periods (
  id uuid primary key default gen_random_uuid(),
  start_date date not null,
  end_date date not null,
  note text check (char_length(note) <= 200),
  created_at timestamptz not null default now(),
  check (end_date >= start_date)
);

-- Seed a sensible default (Mon–Sat 09:00–18:00, Sunday closed) so the public
-- calendar is never accidentally all-closed before the chef configures it —
-- same "never broken before setup" principle as the Gallery/Services/
-- Hero/About fallbacks above.
insert into availability_schedule (day_of_week, is_available, start_time, end_time) values
  (0, false, '09:00', '18:00'), -- Sunday
  (1, true,  '09:00', '18:00'), -- Monday
  (2, true,  '09:00', '18:00'), -- Tuesday
  (3, true,  '09:00', '18:00'), -- Wednesday
  (4, true,  '09:00', '18:00'), -- Thursday
  (5, true,  '09:00', '18:00'), -- Friday
  (6, true,  '09:00', '18:00')  -- Saturday
on conflict (day_of_week) do nothing;

alter table availability_schedule enable row level security;
alter table unavailability_periods enable row level security;

create policy "Public read" on availability_schedule for select using (true);
create policy "Public read" on unavailability_periods for select using (true);

create policy "Admin write" on availability_schedule for all
  using (auth.jwt() ->> 'email' in ('ndiranguh02@gmail.com', 'meshackmashua@gmail.com'))
  with check (auth.jwt() ->> 'email' in ('ndiranguh02@gmail.com', 'meshackmashua@gmail.com'));

create policy "Admin write" on unavailability_periods for all
  using (auth.jwt() ->> 'email' in ('ndiranguh02@gmail.com', 'meshackmashua@gmail.com'))
  with check (auth.jwt() ->> 'email' in ('ndiranguh02@gmail.com', 'meshackmashua@gmail.com'));

-- NOTE: RLS here is row-level, not column-level — `note` on
-- unavailability_periods is public-read like the rest of the row (same
-- tier as gallery captions / site_settings text). Keep notes generic
-- (e.g. "Booked", "Vacation") rather than sensitive guest/client details,
-- since anyone with the anon key can query this table directly, not just
-- visitors who click through the calendar UI.

-- ============================================================
-- Inquiries: a persistent record of contact form + availability
-- booking-request submissions, logged server-side alongside the
-- existing email notification.
--
-- Unlike every other table above, there is deliberately NO insert
-- policy here. Rows are only ever written by the Netlify Function
-- (netlify/functions/contact.js) using the Supabase service_role key,
-- which bypasses RLS entirely — the anon key used by the browser has
-- no way to write to this table at all. This keeps inquiry logging
-- off the public write surface, since (unlike testimonials) there's
-- no legitimate reason for a visitor's browser to insert here directly.
-- ============================================================

create table inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  source text not null default 'contact',
  handled boolean not null default false,
  created_at timestamptz not null default now()
);

alter table inquiries enable row level security;

create policy "Admin read" on inquiries for select
  using (auth.jwt() ->> 'email' in ('ndiranguh02@gmail.com', 'meshackmashua@gmail.com'));

create policy "Admin update" on inquiries for update
  using (auth.jwt() ->> 'email' in ('ndiranguh02@gmail.com', 'meshackmashua@gmail.com'))
  with check (auth.jwt() ->> 'email' in ('ndiranguh02@gmail.com', 'meshackmashua@gmail.com'));

create policy "Admin delete" on inquiries for delete
  using (auth.jwt() ->> 'email' in ('ndiranguh02@gmail.com', 'meshackmashua@gmail.com'));
