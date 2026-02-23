-- Phase 1 Pro Module: Resume Positioning Intelligence
create table if not exists public.resume_analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resume_text text not null,
  analysis_json jsonb not null,
  executive_score int not null check (executive_score >= 0 and executive_score <= 100),
  created_at timestamptz not null default now()
);

create index if not exists resume_analyses_user_created_idx
  on public.resume_analyses(user_id, created_at desc);

alter table public.resume_analyses enable row level security;

drop policy if exists "Users can select own resume analyses" on public.resume_analyses;
drop policy if exists "Users can insert own resume analyses" on public.resume_analyses;

create policy "Users can select own resume analyses"
  on public.resume_analyses
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own resume analyses"
  on public.resume_analyses
  for insert
  to authenticated
  with check (auth.uid() = user_id);

