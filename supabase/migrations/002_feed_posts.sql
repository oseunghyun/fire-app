create table if not exists public.feed_posts (
  id uuid primary key default gen_random_uuid(),
  crew_id uuid references public.crews(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  author_nickname text not null,
  category text not null,
  title text not null,
  body text,
  period_label text,
  mascot_mood text not null default 'saving',
  likes_count integer not null default 0,
  comments_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.feed_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.feed_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  author_nickname text not null,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.feed_posts enable row level security;
alter table public.feed_comments enable row level security;

create policy "Crew members can read feed posts"
  on public.feed_posts for select
  using (
    auth.uid() = user_id
    or (
      crew_id is not null
      and exists (
        select 1
        from public.crew_members own_membership
        where own_membership.crew_id = feed_posts.crew_id
          and own_membership.user_id = auth.uid()
      )
    )
  );

create policy "Users can create their feed posts"
  on public.feed_posts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their feed posts"
  on public.feed_posts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Crew members can read feed comments"
  on public.feed_comments for select
  using (
    exists (
      select 1
      from public.feed_posts
      join public.crew_members own_membership on own_membership.crew_id = feed_posts.crew_id
      where feed_posts.id = feed_comments.post_id
        and own_membership.user_id = auth.uid()
    )
    or auth.uid() = user_id
  );

create policy "Users can create their feed comments"
  on public.feed_comments for insert
  with check (auth.uid() = user_id);

create policy "Users can update their feed comments"
  on public.feed_comments for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
