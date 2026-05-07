create type public.crew_type as enum ('family', 'anonymous');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.households (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  member_count integer not null default 1,
  child_count integer not null default 0,
  withdrawal_rate numeric not null,
  expected_annual_return numeric not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id)
);

create table public.monthly_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  household_id uuid references public.households(id) on delete set null,
  year_month text not null,
  savings_rate numeric not null,
  achievement_rate numeric not null,
  fire_distance_months integer not null,
  target_year integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, year_month)
);

create table public.crews (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type public.crew_type not null,
  fire_type text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.crew_members (
  crew_id uuid not null references public.crews(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  nickname text not null,
  savings_rate numeric not null default 0,
  achievement_rate numeric not null default 0,
  target_year integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (crew_id, user_id)
);

alter table public.profiles enable row level security;
alter table public.households enable row level security;
alter table public.monthly_snapshots enable row level security;
alter table public.crews enable row level security;
alter table public.crew_members enable row level security;

create policy "Users can read their profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can upsert their profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can manage their household summary"
  on public.households for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "Users can manage their monthly snapshots"
  on public.monthly_snapshots for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Crew owners can manage crews"
  on public.crews for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "Crew members can read their crews"
  on public.crews for select
  using (
    auth.uid() = owner_id
    or exists (
      select 1
      from public.crew_members
      where crew_members.crew_id = crews.id
        and crew_members.user_id = auth.uid()
    )
  );

create policy "Crew members can read member public metrics"
  on public.crew_members for select
  using (
    exists (
      select 1
      from public.crew_members own_membership
      where own_membership.crew_id = crew_members.crew_id
        and own_membership.user_id = auth.uid()
    )
  );

create policy "Users can join or update their crew member row"
  on public.crew_members for insert
  with check (auth.uid() = user_id);

create policy "Users can update their crew member row"
  on public.crew_members for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
