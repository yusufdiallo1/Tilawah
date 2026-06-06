-- Tilāwah — add the note-taker bot flag to existing ḥalaqāt installs.
-- Safe to run whether or not 0001 already included the column.
alter table public.halaqat add column if not exists note_taker boolean not null default false;
