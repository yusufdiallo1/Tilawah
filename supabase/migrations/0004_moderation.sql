-- Tilāwah — chat moderation: strikes, then auto-delete + ban on the 3rd strike.

-- Per-user strike tally. Server-managed (service role) — the user may read their own.
create table if not exists public.user_strikes (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  strikes    int  not null default 0,
  banned     boolean not null default false,
  last_reason text,
  updated_at timestamptz not null default now()
);

-- Emails that have been banned (so a deleted account can't simply re-register).
create table if not exists public.banned_emails (
  email      text primary key,
  reason     text,
  created_at timestamptz not null default now()
);

alter table public.user_strikes enable row level security;
alter table public.banned_emails enable row level security;

-- A user can read ONLY their own strike row. Writes happen server-side (service role,
-- which bypasses RLS) — there is intentionally no insert/update policy for users.
drop policy if exists strikes_select_own on public.user_strikes;
create policy strikes_select_own on public.user_strikes for select to authenticated
  using (user_id = auth.uid());

-- banned_emails is server-only; no authenticated policies (service role bypasses RLS).
