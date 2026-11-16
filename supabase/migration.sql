
-- =========================================================
-- DIGI JOCKEYS CMS
-- Complete Supabase PostgreSQL Migration
-- Version: 1.0
-- =========================================================

-- =========================================================
-- 1. EXTENSIONS
-- =========================================================

create extension if not exists pgcrypto;


-- =========================================================
-- 2. SHARED FUNCTION: AUTO UPDATE TIMESTAMP
-- =========================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- =========================================================
-- 3. PROFILES
-- Admin profile
-- Authentication and password managed by Supabase Auth
-- =========================================================

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,

  full_name text not null,
  email text not null,
  phone_number text,
  avatar_path text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- =========================================================
-- 4. SERVICES
-- =========================================================

create table public.services (
  id uuid primary key default gen_random_uuid(),

  name text not null,
  category text not null,
  description text,

  cover_image text,

  status text not null default 'active'
    check (status in ('active', 'inactive')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- =========================================================
-- 5. PORTFOLIO PROJECTS
-- =========================================================

create table public.portfolio_projects (
  id uuid primary key default gen_random_uuid(),

  project_name text not null,
  category text not null,

  service_id uuid
    references public.services(id)
    on delete set null,

  description text,

  cover_image text,
  project_url text,

  status text not null default 'draft'
    check (status in ('draft', 'published')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- =========================================================
-- 6. PORTFOLIO IMAGES
-- Multiple screenshots for each project
-- =========================================================

create table public.portfolio_images (
  id uuid primary key default gen_random_uuid(),

  portfolio_id uuid not null
    references public.portfolio_projects(id)
    on delete cascade,

  image_path text not null,
  alt_text text,

  sort_order integer not null default 0,

  created_at timestamptz not null default now()
);


-- =========================================================
-- 7. TESTIMONIALS
-- Customer-submitted reviews
-- Default status: draft
-- =========================================================

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),

  customer_name text not null,

  service_id uuid
    references public.services(id)
    on delete set null,

  rating integer not null
    check (rating between 1 and 5),

  description text not null,

  status text not null default 'draft'
    check (status in ('draft', 'published')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- =========================================================
-- 8. CUSTOMER PROOFS
-- Admin-managed work evidence and screenshots
-- =========================================================

create table public.customer_proofs (
  id uuid primary key default gen_random_uuid(),

  service_id uuid
    references public.services(id)
    on delete set null,

  image_path text not null,
  description text,

  proof_date date not null default current_date,

  status text not null default 'draft'
    check (status in ('draft', 'published')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- =========================================================
-- 9. SITE SETTINGS
-- Only one settings record is allowed
-- =========================================================

create table public.site_settings (
  id integer primary key default 1
    check (id = 1),

  -- General Information
  business_name text not null default 'DigiJockeys',
  tagline text,
  description text,

  logo_path text,
  favicon_path text,

  -- Contact Information
  email text,
  phone_number text,
  whatsapp text,
  instagram text,

  -- SEO
  meta_title text,
  meta_description text,
  keywords text[] not null default '{}',

  -- Website Configuration
  website_published boolean not null default false,
  maintenance_mode boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create default settings record
insert into public.site_settings (id)
values (1)
on conflict (id) do nothing;


-- =========================================================
-- 10. NOTIFICATIONS
-- Admin notification system
-- =========================================================

create table public.notifications (
  id uuid primary key default gen_random_uuid(),

  type text not null default 'info'
    check (type in ('review', 'info', 'success', 'warning')),

  title text not null,
  message text,

  link text,
  entity_id uuid,

  is_read boolean not null default false,

  created_at timestamptz not null default now()
);


-- =========================================================
-- 11. ADMIN CHECK FUNCTION
-- A user is admin if their ID exists in profiles
-- =========================================================

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
  );
$$;


-- =========================================================
-- 12. UPDATED_AT TRIGGERS
-- =========================================================

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger set_services_updated_at
before update on public.services
for each row execute function public.set_updated_at();

create trigger set_portfolio_updated_at
before update on public.portfolio_projects
for each row execute function public.set_updated_at();

create trigger set_testimonials_updated_at
before update on public.testimonials
for each row execute function public.set_updated_at();

create trigger set_customer_proofs_updated_at
before update on public.customer_proofs
for each row execute function public.set_updated_at();

create trigger set_site_settings_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();


-- =========================================================
-- 13. ENABLE ROW LEVEL SECURITY
-- =========================================================

alter table public.profiles enable row level security;
alter table public.services enable row level security;
alter table public.portfolio_projects enable row level security;
alter table public.portfolio_images enable row level security;
alter table public.testimonials enable row level security;
alter table public.customer_proofs enable row level security;
alter table public.site_settings enable row level security;
alter table public.notifications enable row level security;


-- =========================================================
-- 14. PROFILES POLICIES
-- =========================================================

create policy "Admin can view own profile"
on public.profiles
for select
to authenticated
using (id = (select auth.uid()));

create policy "Admin can update own profile"
on public.profiles
for update
to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));


-- =========================================================
-- 15. SERVICES POLICIES
-- =========================================================

create policy "Public can view active services"
on public.services
for select
to anon, authenticated
using (
  status = 'active'
  or (select public.is_admin())
);

create policy "Admin can insert services"
on public.services
for insert
to authenticated
with check ((select public.is_admin()));

create policy "Admin can update services"
on public.services
for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Admin can delete services"
on public.services
for delete
to authenticated
using ((select public.is_admin()));


-- =========================================================
-- 16. PORTFOLIO PROJECTS POLICIES
-- =========================================================

create policy "Public can view published portfolio"
on public.portfolio_projects
for select
to anon, authenticated
using (
  status = 'published'
  or (select public.is_admin())
);

create policy "Admin can insert portfolio"
on public.portfolio_projects
for insert
to authenticated
with check ((select public.is_admin()));

create policy "Admin can update portfolio"
on public.portfolio_projects
for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Admin can delete portfolio"
on public.portfolio_projects
for delete
to authenticated
using ((select public.is_admin()));


-- =========================================================
-- 17. PORTFOLIO IMAGES POLICIES
-- =========================================================

create policy "Public can view published project gallery"
on public.portfolio_images
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.portfolio_projects p
    where p.id = portfolio_images.portfolio_id
      and (
        p.status = 'published'
        or (select public.is_admin())
      )
  )
);

create policy "Admin can insert portfolio images"
on public.portfolio_images
for insert
to authenticated
with check ((select public.is_admin()));

create policy "Admin can update portfolio images"
on public.portfolio_images
for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Admin can delete portfolio images"
on public.portfolio_images
for delete
to authenticated
using ((select public.is_admin()));


-- =========================================================
-- 18. TESTIMONIALS POLICIES
-- =========================================================

create policy "Public can view published testimonials"
on public.testimonials
for select
to anon, authenticated
using (
  status = 'published'
  or (select public.is_admin())
);

-- Visitors can submit reviews as draft only
create policy "Visitors can submit testimonials"
on public.testimonials
for insert
to anon, authenticated
with check (status = 'draft');

create policy "Admin can update testimonials"
on public.testimonials
for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Admin can delete testimonials"
on public.testimonials
for delete
to authenticated
using ((select public.is_admin()));


-- =========================================================
-- 19. CUSTOMER PROOFS POLICIES
-- =========================================================

create policy "Public can view published proofs"
on public.customer_proofs
for select
to anon, authenticated
using (
  status = 'published'
  or (select public.is_admin())
);

create policy "Admin can insert proofs"
on public.customer_proofs
for insert
to authenticated
with check ((select public.is_admin()));

create policy "Admin can update proofs"
on public.customer_proofs
for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Admin can delete proofs"
on public.customer_proofs
for delete
to authenticated
using ((select public.is_admin()));


-- =========================================================
-- 20. SITE SETTINGS POLICIES
-- =========================================================

create policy "Public can view site settings"
on public.site_settings
for select
to anon, authenticated
using (true);

create policy "Admin can update site settings"
on public.site_settings
for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Admin can insert site settings"
on public.site_settings
for insert
to authenticated
with check ((select public.is_admin()));


-- =========================================================
-- 21. NOTIFICATIONS POLICIES
-- Only admin can access notifications
-- =========================================================

create policy "Admin can view notifications"
on public.notifications
for select
to authenticated
using ((select public.is_admin()));

create policy "Admin can update notifications"
on public.notifications
for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Admin can delete notifications"
on public.notifications
for delete
to authenticated
using ((select public.is_admin()));


-- =========================================================
-- 22. AUTOMATIC REVIEW NOTIFICATION
-- Trigger creates notification when customer submits review
-- =========================================================

create or replace function public.notify_new_testimonial()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.notifications (
    type,
    title,
    message,
    link,
    entity_id
  )
  values (
    'review',
    'New Customer Review',
    'A new review has been submitted by ' || new.customer_name,
    '/admin/testimonials/reviews',
    new.id
  );

  return new;
end;
$$;

create trigger trigger_notify_new_testimonial
after insert on public.testimonials
for each row
execute function public.notify_new_testimonial();


-- =========================================================
-- 23. STORAGE BUCKET
-- Public website media
-- =========================================================

insert into storage.buckets (
  id,
  name,
  public
)
values (
  'site-media',
  'site-media',
  true
)
on conflict (id) do update
set public = true;


-- =========================================================
-- 24. STORAGE POLICIES
-- =========================================================

create policy "Public can view site media"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'site-media');

create policy "Admin can upload site media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'site-media'
  and (select public.is_admin())
);

create policy "Admin can update site media"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'site-media'
  and (select public.is_admin())
)
with check (
  bucket_id = 'site-media'
  and (select public.is_admin())
);

create policy "Admin can delete site media"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'site-media'
  and (select public.is_admin())
);


-- =========================================================
-- 25. DATABASE INDEXES
-- =========================================================

-- Services
create index idx_services_status
on public.services(status);

-- Portfolio
create index idx_portfolio_status
on public.portfolio_projects(status);

create index idx_portfolio_service
on public.portfolio_projects(service_id);

create index idx_portfolio_category
on public.portfolio_projects(category);

-- Portfolio gallery
create index idx_portfolio_images_project
on public.portfolio_images(portfolio_id, sort_order);

-- Testimonials
create index idx_testimonials_status
on public.testimonials(status);

create index idx_testimonials_service
on public.testimonials(service_id);

create index idx_testimonials_created
on public.testimonials(created_at desc);

-- Customer proofs
create index idx_customer_proofs_status
on public.customer_proofs(status);

create index idx_customer_proofs_service
on public.customer_proofs(service_id);

create index idx_customer_proofs_date
on public.customer_proofs(proof_date desc);

-- Notifications
create index idx_notifications_created
on public.notifications(created_at desc);

create index idx_notifications_unread
on public.notifications(is_read, created_at desc);


-- =========================================================
-- 26. ENABLE REALTIME FOR NOTIFICATIONS
-- =========================================================

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'notifications'
  ) then
    alter publication supabase_realtime
    add table public.notifications;
  end if;
end;
$$;


-- =========================================================
-- END OF DIGI JOCKEYS CMS MIGRATION
-- =========================================================
