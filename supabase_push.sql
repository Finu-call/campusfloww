create table if not exists public.campus_push_subscriptions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    endpoint text not null unique,
    p256dh text not null,
    auth text not null,
    created_at timestamptz not null default now()
);

alter table public.campus_push_subscriptions enable row level security;

drop policy if exists "users manage own push subscriptions" on public.campus_push_subscriptions;
create policy "users manage own push subscriptions"
on public.campus_push_subscriptions for all to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());