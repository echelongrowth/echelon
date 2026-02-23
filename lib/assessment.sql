-- Phase 1: Assessment data collection table
create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  answers jsonb not null,
  version_number int not null default 1,
  is_active boolean not null default true,
  leverage_score int,
  risk_score int,
  intelligence_report jsonb,
  created_at timestamptz not null default now()
);

create index if not exists assessments_user_id_idx
  on public.assessments(user_id);

create index if not exists assessments_created_at_idx
  on public.assessments(created_at desc);

create index if not exists assessments_user_active_idx
  on public.assessments(user_id, is_active);

alter table public.assessments enable row level security;

drop policy if exists "Users can select own assessments" on public.assessments;
drop policy if exists "Users can insert own assessments" on public.assessments;
drop policy if exists "Users can update own assessments" on public.assessments;

-- Users can read only their own assessment records
create policy "Users can select own assessments"
  on public.assessments
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Users can insert assessment records only for themselves
create policy "Users can insert own assessments"
  on public.assessments
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Users can deactivate their own previous active assessment version.
create policy "Users can update own assessments"
  on public.assessments
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function public.recalibrate_assessment(
  p_previous_assessment_id uuid,
  p_answers jsonb,
  p_leverage_score int,
  p_risk_score int,
  p_intelligence_report jsonb
)
returns uuid
language plpgsql
security invoker
as $$
declare
  v_user_id uuid := auth.uid();
  v_previous_version int := 0;
  v_new_assessment_id uuid;
begin
  if v_user_id is null then
    raise exception 'Unauthorized';
  end if;

  if p_previous_assessment_id is not null then
    select version_number
      into v_previous_version
      from public.assessments
      where id = p_previous_assessment_id
        and user_id = v_user_id
        and is_active = true
      for update;

    if not found then
      raise exception 'Active assessment not found for recalibration';
    end if;

    update public.assessments
      set is_active = false
      where id = p_previous_assessment_id
        and user_id = v_user_id;
  end if;

  insert into public.assessments (
    user_id,
    answers,
    version_number,
    is_active,
    leverage_score,
    risk_score,
    intelligence_report
  )
  values (
    v_user_id,
    p_answers,
    v_previous_version + 1,
    true,
    p_leverage_score,
    p_risk_score,
    p_intelligence_report
  )
  returning id into v_new_assessment_id;

  return v_new_assessment_id;
end;
$$;

revoke all on function public.recalibrate_assessment(uuid, jsonb, int, int, jsonb) from public;
grant execute on function public.recalibrate_assessment(uuid, jsonb, int, int, jsonb) to authenticated;
