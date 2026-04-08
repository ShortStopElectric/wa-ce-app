-- ── WA CE App — Supabase Schema ───────────────────────────────────────────────
-- Run this in your Supabase SQL editor (Dashboard → SQL Editor → New query)

-- ── profiles ─────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text not null,
  name          text not null default '',
  license       text not null default '',
  role          text not null default 'student' check (role in ('student', 'admin')),
  mfa_enrolled  boolean not null default false,
  created_at    timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Service role full access"
  on public.profiles for all
  using (auth.role() = 'service_role');

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ── course_progress ───────────────────────────────────────────────────────────
create table if not exists public.course_progress (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null unique references public.profiles(id) on delete cascade,
  modules               jsonb not null default '[]'::jsonb,
  final_exam_unlocked   boolean not null default false,
  final_exam_attempts   int not null default 0,
  final_exam_passed     boolean not null default false,
  final_score           int,
  cert_issued           boolean not null default false,
  updated_at            timestamptz not null default now()
);

alter table public.course_progress enable row level security;

create policy "Users can view own progress"
  on public.course_progress for select
  using (auth.uid() = user_id);

create policy "Users can upsert own progress"
  on public.course_progress for all
  using (auth.uid() = user_id);

create policy "Service role full access progress"
  on public.course_progress for all
  using (auth.role() = 'service_role');


-- ── final_exams ───────────────────────────────────────────────────────────────
create table if not exists public.final_exams (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null references public.profiles(id) on delete cascade,
  attempt   int not null,
  score     int not null,
  passed    boolean not null,
  taken_at  timestamptz not null default now()
);

alter table public.final_exams enable row level security;

create policy "Users can view own exam records"
  on public.final_exams for select
  using (auth.uid() = user_id);

create policy "Users can insert own exam records"
  on public.final_exams for insert
  with check (auth.uid() = user_id);

create policy "Service role full access exams"
  on public.final_exams for all
  using (auth.role() = 'service_role');


-- ── certificates ─────────────────────────────────────────────────────────────
create table if not exists public.certificates (
  id           uuid primary key,
  user_id      uuid not null unique references public.profiles(id) on delete cascade,
  cert_number  text not null unique,
  issued_at    timestamptz not null,
  expires_at   timestamptz not null,
  final_score  int not null,
  name         text not null default '',
  license      text not null default ''
);

alter table public.certificates enable row level security;

create policy "Users can view own certificate"
  on public.certificates for select
  using (auth.uid() = user_id);

create policy "Service role full access certs"
  on public.certificates for all
  using (auth.role() = 'service_role');

-- ── indexes ───────────────────────────────────────────────────────────────────
create index if not exists idx_course_progress_user on public.course_progress(user_id);
create index if not exists idx_final_exams_user on public.final_exams(user_id);
create index if not exists idx_certificates_user on public.certificates(user_id);
