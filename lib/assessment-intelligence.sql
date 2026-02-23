-- Add intelligence columns for Phase 1 scoring + AI output.
alter table public.assessments
  add column if not exists version_number int not null default 1,
  add column if not exists is_active boolean not null default true,
  add column if not exists leverage_score int,
  add column if not exists risk_score int,
  add column if not exists intelligence_report jsonb;

create index if not exists assessments_user_active_idx
  on public.assessments(user_id, is_active);

drop policy if exists "Users can update own assessments" on public.assessments;

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
