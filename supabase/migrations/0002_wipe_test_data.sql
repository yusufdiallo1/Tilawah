-- Tilāwah — one-time cleanup before testing ḥalaqāt with real accounts.
-- Removes ALL existing circles, memberships, and notifications so the app starts
-- from a clean slate. Safe to run repeatedly (idempotent). Run AFTER 0001_halaqat.sql.
truncate table public.halaqah_notifications restart identity cascade;
truncate table public.halaqah_members        restart identity cascade;
truncate table public.halaqat                restart identity cascade;
