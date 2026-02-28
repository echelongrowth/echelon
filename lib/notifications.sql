-- Notifications and preference controls (plan-aware)

create table if not exists public.notification_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  channel_in_app boolean not null default true,
  channel_email boolean not null default false,
  digest_mode text not null default 'daily'
    check (digest_mode in ('instant', 'daily', 'weekly')),
  report_ready boolean not null default true,
  task_reminders boolean not null default false,
  billing boolean not null default true,
  security boolean not null default true,
  product_updates boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  cta_url text,
  channel text not null default 'in_app'
    check (channel in ('in_app', 'email')),
  status text not null default 'unread'
    check (status in ('unread', 'read', 'archived')),
  dedupe_key text,
  scheduled_for timestamptz not null default now(),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create unique index if not exists notifications_user_dedupe_idx
  on public.notifications(user_id, dedupe_key)
  where dedupe_key is not null;

create index if not exists notifications_user_created_idx
  on public.notifications(user_id, created_at desc);

create index if not exists notifications_user_status_idx
  on public.notifications(user_id, status);

alter table public.notification_preferences enable row level security;
alter table public.notifications enable row level security;

drop policy if exists "Users can select own notification preferences" on public.notification_preferences;
drop policy if exists "Users can upsert own notification preferences" on public.notification_preferences;
drop policy if exists "Users can select own notifications" on public.notifications;
drop policy if exists "Users can insert own notifications" on public.notifications;
drop policy if exists "Users can update own notifications" on public.notifications;

create policy "Users can select own notification preferences"
  on public.notification_preferences
  for select
  using (auth.uid() = user_id);

create policy "Users can upsert own notification preferences"
  on public.notification_preferences
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can select own notifications"
  on public.notifications
  for select
  using (auth.uid() = user_id);

create policy "Users can insert own notifications"
  on public.notifications
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update own notifications"
  on public.notifications
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
