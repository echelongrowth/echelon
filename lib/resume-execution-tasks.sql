-- Pro tactical execution tracking for resume positioning module
create table if not exists public.resume_execution_tasks (
  id uuid primary key default gen_random_uuid(),
  analysis_id uuid not null references public.resume_analyses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id text not null,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists resume_execution_tasks_user_idx
  on public.resume_execution_tasks(user_id);

create index if not exists resume_execution_tasks_analysis_idx
  on public.resume_execution_tasks(analysis_id);

alter table public.resume_execution_tasks enable row level security;

drop policy if exists "Users can select own resume execution tasks" on public.resume_execution_tasks;
drop policy if exists "Users can insert own resume execution tasks" on public.resume_execution_tasks;
drop policy if exists "Users can update own resume execution tasks" on public.resume_execution_tasks;

create policy "Users can select own resume execution tasks"
  on public.resume_execution_tasks
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own resume execution tasks"
  on public.resume_execution_tasks
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own resume execution tasks"
  on public.resume_execution_tasks
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function public.create_resume_analysis_with_tasks(
  p_resume_text text,
  p_analysis_json jsonb,
  p_executive_score int,
  p_tasks jsonb
)
returns uuid
language plpgsql
security invoker
as $$
declare
  v_user_id uuid := auth.uid();
  v_analysis_id uuid;
begin
  if v_user_id is null then
    raise exception 'Unauthorized';
  end if;

  insert into public.resume_analyses (
    user_id,
    resume_text,
    analysis_json,
    executive_score
  )
  values (
    v_user_id,
    p_resume_text,
    p_analysis_json,
    p_executive_score
  )
  returning id into v_analysis_id;

  insert into public.resume_execution_tasks (
    analysis_id,
    user_id,
    task_id,
    completed
  )
  select
    v_analysis_id,
    v_user_id,
    coalesce(task->>'id', md5((task->>'title') || '-' || (task->>'strategic_objective'))),
    false
  from jsonb_array_elements(coalesce(p_tasks, '[]'::jsonb)) task;

  return v_analysis_id;
end;
$$;

revoke all on function public.create_resume_analysis_with_tasks(text, jsonb, int, jsonb) from public;
grant execute on function public.create_resume_analysis_with_tasks(text, jsonb, int, jsonb) to authenticated;

