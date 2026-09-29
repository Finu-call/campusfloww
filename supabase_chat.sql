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

-- Use SECURITY DEFINER helpers so RLS on classroom_members does not
-- prevent the chat policy from checking membership/host status.
create or replace function public.can_access_classroom_chat(p_classroom_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $
    select exists (
        select 1
        from public.classroom_members cm
        where cm.classroom_id = p_classroom_id
          and cm.user_id = auth.uid()
          and cm.status = 'active'
    )
    or exists (
        select 1
        from public.classrooms c
        where c.id = p_classroom_id
          and c.host_id = auth.uid()
    );
$;

revoke all on function public.can_access_classroom_chat(uuid) from public;
grant execute on function public.can_access_classroom_chat(uuid) to authenticated;

drop policy if exists "classroom members can read chat" on public.classroom_messages;
create policy "classroom members can read chat"
on public.classroom_messages
for select
to authenticated
using (public.can_access_classroom_chat(classroom_id));

drop policy if exists "classroom members can send chat" on public.classroom_messages;
create policy "classroom members can send chat"
on public.classroom_messages
for insert
to authenticated
with check (
    sender_id = auth.uid()
    and public.can_access_classroom_chat(classroom_id)
);

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
