create table if not exists public.campus_notifications (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    classroom_id uuid references public.classrooms(id) on delete cascade,
    type text not null default 'classroom',
    title text not null,
    message text,
    route text,
    is_read boolean not null default false,
    created_at timestamptz not null default now()
);

create index if not exists campus_notifications_user_created_idx
on public.campus_notifications(user_id, created_at desc);

create index if not exists campus_notifications_unread_idx
on public.campus_notifications(user_id, is_read);

alter table public.campus_notifications enable row level security;

drop policy if exists "users can read own notifications" on public.campus_notifications;
create policy "users can read own notifications"
on public.campus_notifications for select to authenticated
using (user_id = auth.uid());

drop policy if exists "users can update own notifications" on public.campus_notifications;
create policy "users can update own notifications"
on public.campus_notifications for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

alter publication supabase_realtime add table public.campus_notifications;
