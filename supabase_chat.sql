-- CampusFlow classroom chat
-- Run this once in Supabase SQL Editor.

create table if not exists public.classroom_messages (
    id uuid primary key default gen_random_uuid(),
    classroom_id uuid not null references public.classrooms(id) on delete cascade,
    sender_id uuid not null references public.profiles(id) on delete cascade,
    message text not null check (char_length(trim(message)) between 1 and 1000),
    created_at timestamptz not null default now()
);

create index if not exists classroom_messages_classroom_created_idx
    on public.classroom_messages (classroom_id, created_at);

alter table public.classroom_messages enable row level security;

-- A user can read messages only from classrooms they belong to.
drop policy if exists "classroom members can read chat" on public.classroom_messages;
create policy "classroom members can read chat"
on public.classroom_messages
for select
to authenticated
using (
    exists (
        select 1
        from public.classroom_members cm
        where cm.classroom_id = classroom_messages.classroom_id
          and cm.user_id = auth.uid()
          and cm.status = 'active'
    )
    or exists (
        select 1
        from public.classrooms c
        where c.id = classroom_messages.classroom_id
          and c.host_id = auth.uid()
    )
);

-- A user can send messages only as themselves and only in a classroom
-- where they are an active member or the host.
drop policy if exists "classroom members can send chat" on public.classroom_messages;
create policy "classroom members can send chat"
on public.classroom_messages
for insert
to authenticated
with check (
    sender_id = auth.uid()
    and (
        exists (
            select 1
            from public.classroom_members cm
            where cm.classroom_id = classroom_messages.classroom_id
              and cm.user_id = auth.uid()
              and cm.status = 'active'
        )
        or exists (
            select 1
            from public.classrooms c
            where c.id = classroom_messages.classroom_id
              and c.host_id = auth.uid()
        )
    )
);

-- Users can delete only their own messages.
drop policy if exists "users can delete own chat" on public.classroom_messages;
create policy "users can delete own chat"
on public.classroom_messages
for delete
to authenticated
using (sender_id = auth.uid());

-- Enable Supabase Realtime for new chat messages.
do $$
begin
    alter publication supabase_realtime add table public.classroom_messages;
exception
    when duplicate_object then null;
end $$;
