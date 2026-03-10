-- profiles
create table profiles (
  id uuid references auth.users primary key,
  username text unique not null,
  full_name text not null,
  initials text not null,
  role text not null default 'member',
  created_at timestamptz default now()
);

-- projects
create table projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  client_name text,
  description text,
  start_date date,
  end_date date,
  status text not null default 'active',
  team_size int not null default 1,
  fee_type text not null,
  fee_amount numeric not null default 0,
  currency text not null default 'USD',
  total_received numeric not null default 0,
  total_earning numeric not null default 0,
  platform text not null default 'direct',
  last_edited_by text,
  last_edited_at timestamptz default now(),
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

-- milestones
create table milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  title text not null,
  due_date date,
  is_completed boolean not null default false,
  amount numeric not null default 0,
  notes text,
  created_at timestamptz default now()
);

-- project_costs
create table project_costs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  label text not null,
  amount numeric not null,
  cost_date date,
  cost_type text not null default 'other',
  note text,
  created_at timestamptz default now()
);

-- payments
create table payments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  amount numeric not null,
  payment_date date,
  payment_type text not null default 'partial',
  note text,
  created_at timestamptz default now()
);

-- edit_logs
create table edit_logs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  edited_by text not null,
  field_changed text not null,
  old_value text,
  new_value text,
  edited_at timestamptz default now()
);

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table projects enable row level security;
alter table milestones enable row level security;
alter table project_costs enable row level security;
alter table payments enable row level security;
alter table edit_logs enable row level security;

-- RLS Policies (allow all authenticated users full access — small team)
create policy "Authenticated full access" on profiles for all using (auth.role() = 'authenticated');
create policy "Authenticated full access" on projects for all using (auth.role() = 'authenticated');
create policy "Authenticated full access" on milestones for all using (auth.role() = 'authenticated');
create policy "Authenticated full access" on project_costs for all using (auth.role() = 'authenticated');
create policy "Authenticated full access" on payments for all using (auth.role() = 'authenticated');
create policy "Authenticated full access" on edit_logs for all using (auth.role() = 'authenticated');
