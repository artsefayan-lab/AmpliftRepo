-- ─────────────────────────────────────────────────────────
-- Amplify Platform — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ─────────────────────────────────────────────────────────

create table if not exists public.creators (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz default now(),

  -- Personal
  first_name    text not null,
  last_name     text not null,
  email         text not null unique,
  phone         text,
  location      text,

  -- Creator type
  creator_type  text,
  niches        text[],

  -- Platforms
  platforms     text[],
  primary_platform text,
  follower_range   text,
  engagement_rate  text,
  profile_link     text,

  -- About
  bio           text,
  past_brands   text,
  rate_range    text,
  turnaround    text,
  extra_notes   text,

  -- Admin fields
  status        text not null default 'pending',
  admin_notes   text,
  approved_at   timestamptz
);

-- Row-level security: allow public inserts (applications), admin reads all
alter table public.creators enable row level security;

-- Anyone can submit an application
create policy "Allow public insert"
  on public.creators for insert
  with check (true);

-- Only service role (your API routes) can read/update
create policy "Service role full access"
  on public.creators for all
  using (auth.role() = 'service_role');

-- Index for fast status filtering
create index if not exists creators_status_idx on public.creators(status);
create index if not exists creators_created_at_idx on public.creators(created_at desc);
