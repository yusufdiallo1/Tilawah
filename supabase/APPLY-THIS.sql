-- Tilāwah — Ḥalaqāt (study circles) schema + Row-Level Security.
-- Apply in Supabase → SQL Editor (or `supabase db push`). Idempotent-ish (drops policies first).

-- ============ TABLES ============
create table if not exists public.halaqat (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references auth.users(id) on delete cascade,
  name        text not null check (char_length(name) between 1 and 80),
  type        text not null default 'hifz' check (type in ('hifz','matn','tafsir','tajwid')),
  visibility  text not null default 'public' check (visibility in ('public','private')),
  code        text unique,                         -- join code for private circles
  capacity    int  not null default 8 check (capacity between 2 and 100),
  recurring   boolean not null default true,
  meet_time   text,                                -- e.g. "05:30"
  cancelled_for date,                              -- set when host cancels for a given day
  created_at  timestamptz not null default now()
);

create table if not exists public.halaqah_members (
  halaqah_id  uuid not null references public.halaqat(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  joined_at   timestamptz not null default now(),
  primary key (halaqah_id, user_id)
);

create table if not exists public.halaqah_notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  halaqah_id  uuid references public.halaqat(id) on delete set null,
  kind        text not null,                       -- 'deleted' | 'cancelled' | 'joined' | ...
  body        text not null,
  read        boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists idx_members_user on public.halaqah_members(user_id);
create index if not exists idx_notif_user   on public.halaqah_notifications(user_id, read);
create index if not exists idx_halaqat_pub  on public.halaqat(visibility, created_at desc);

-- ============ RLS ============
alter table public.halaqat               enable row level security;
alter table public.halaqah_members       enable row level security;
alter table public.halaqah_notifications enable row level security;

-- halaqat: anyone authenticated sees PUBLIC circles or circles they own/belong to.
drop policy if exists halaqat_select on public.halaqat;
create policy halaqat_select on public.halaqat for select to authenticated
  using (
    visibility = 'public'
    or owner_id = auth.uid()
    or exists (select 1 from public.halaqah_members m where m.halaqah_id = id and m.user_id = auth.uid())
  );

-- create: only as yourself (owner_id must be the caller).
drop policy if exists halaqat_insert on public.halaqat;
create policy halaqat_insert on public.halaqat for insert to authenticated
  with check (owner_id = auth.uid());

-- update: only the owner (cancel-for-day, rename, etc.).
drop policy if exists halaqat_update on public.halaqat;
create policy halaqat_update on public.halaqat for update to authenticated
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- delete: ONLY the owner — never another user's halaqah.
drop policy if exists halaqat_delete on public.halaqat;
create policy halaqat_delete on public.halaqat for delete to authenticated
  using (owner_id = auth.uid());

-- members: a user sees membership rows for circles they're in or own; can join/leave themselves.
drop policy if exists members_select on public.halaqah_members;
create policy members_select on public.halaqah_members for select to authenticated
  using (
    user_id = auth.uid()
    or exists (select 1 from public.halaqat h where h.id = halaqah_id and h.owner_id = auth.uid())
  );
drop policy if exists members_insert on public.halaqah_members;
create policy members_insert on public.halaqah_members for insert to authenticated
  with check (user_id = auth.uid());
drop policy if exists members_delete on public.halaqah_members;
create policy members_delete on public.halaqah_members for delete to authenticated
  using (user_id = auth.uid());

-- notifications: a user reads/updates ONLY their own.
drop policy if exists notif_select on public.halaqah_notifications;
create policy notif_select on public.halaqah_notifications for select to authenticated
  using (user_id = auth.uid());
drop policy if exists notif_update on public.halaqah_notifications;
create policy notif_update on public.halaqah_notifications for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
-- inserts to notifications come from the server (service role bypasses RLS) when a host
-- deletes/cancels a circle, fanning out one row per member.

-- ============ REALTIME ============
-- enable realtime so member lists / notifications update live (idempotent).
do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='halaqat') then
    alter publication supabase_realtime add table public.halaqat;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='halaqah_members') then
    alter publication supabase_realtime add table public.halaqah_members;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='halaqah_notifications') then
    alter publication supabase_realtime add table public.halaqah_notifications;
  end if;
end $$;
-- Tilāwah — one-time cleanup before testing ḥalaqāt with real accounts.
-- Removes ALL existing circles, memberships, and notifications so the app starts
-- from a clean slate. Safe to run repeatedly (idempotent). Run AFTER 0001_halaqat.sql.
truncate table public.halaqah_notifications restart identity cascade;
truncate table public.halaqah_members        restart identity cascade;
truncate table public.halaqat                restart identity cascade;
