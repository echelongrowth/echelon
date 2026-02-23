-- Pro entrepreneurial module: Strategic Side-Project Engine
create table if not exists public.side_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  analysis_id uuid references public.resume_analyses(id) on delete set null,
  career_goal text,
  generated_at timestamptz not null default now(),
  projects_json jsonb not null
);

create index if not exists side_projects_user_generated_idx
  on public.side_projects(user_id, generated_at desc);

alter table public.side_projects enable row level security;

drop policy if exists "Users can select own side projects" on public.side_projects;
drop policy if exists "Users can insert own side projects" on public.side_projects;

create policy "Users can select own side projects"
  on public.side_projects
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own side projects"
  on public.side_projects
  for insert
  to authenticated
  with check (auth.uid() = user_id);
