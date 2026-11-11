-- Caderno — profiles, notebooks, notes e tasks.
-- Rodar no SQL Editor do projeto Supabase de cada fellow.
-- Idempotente. Não insere usuário fixo: a linha de perfil nasce no signup.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '',
  theme text not null default 'light' check (theme in ('light', 'dark'))
);

alter table public.profiles enable row level security;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own
  on public.profiles
  for select
  using (id = auth.uid());

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own
  on public.profiles
  for insert
  with check (id = auth.uid());

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own
  on public.profiles
  for update
  using (id = auth.uid())
  with check (id = auth.uid());

drop policy if exists profiles_delete_own on public.profiles;
create policy profiles_delete_own
  on public.profiles
  for delete
  using (id = auth.uid());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, theme)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', ''),
    'light'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Cadernos, notas e tarefas. O dono é user_id.
-- Apagar o caderno apaga as notas. Apagar a nota apaga as tarefas.
-- updated_at de caderno e nota muda na trigger; o client não envia esse valor.

create table if not exists public.notebooks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  is_favorite boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  notebook_id uuid not null references public.notebooks (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  body text not null default '',
  is_favorite boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  note_id uuid not null references public.notes (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  is_done boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.notebooks enable row level security;
alter table public.notes enable row level security;
alter table public.tasks enable row level security;

drop policy if exists notebooks_select_own on public.notebooks;
create policy notebooks_select_own
  on public.notebooks
  for select
  using (user_id = auth.uid());

drop policy if exists notebooks_insert_own on public.notebooks;
create policy notebooks_insert_own
  on public.notebooks
  for insert
  with check (user_id = auth.uid());

drop policy if exists notebooks_update_own on public.notebooks;
create policy notebooks_update_own
  on public.notebooks
  for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists notebooks_delete_own on public.notebooks;
create policy notebooks_delete_own
  on public.notebooks
  for delete
  using (user_id = auth.uid());

drop policy if exists notes_select_own on public.notes;
create policy notes_select_own
  on public.notes
  for select
  using (
    user_id = auth.uid()
    and exists (
      select 1
      from public.notebooks
      where notebooks.id = notes.notebook_id
        and notebooks.user_id = auth.uid()
    )
  );

drop policy if exists notes_insert_own on public.notes;
create policy notes_insert_own
  on public.notes
  for insert
  with check (
    user_id = auth.uid()
    and exists (
      select 1
      from public.notebooks
      where notebooks.id = notes.notebook_id
        and notebooks.user_id = auth.uid()
    )
  );

drop policy if exists notes_update_own on public.notes;
create policy notes_update_own
  on public.notes
  for update
  using (
    user_id = auth.uid()
    and exists (
      select 1
      from public.notebooks
      where notebooks.id = notes.notebook_id
        and notebooks.user_id = auth.uid()
    )
  )
  with check (
    user_id = auth.uid()
    and exists (
      select 1
      from public.notebooks
      where notebooks.id = notes.notebook_id
        and notebooks.user_id = auth.uid()
    )
  );

drop policy if exists notes_delete_own on public.notes;
create policy notes_delete_own
  on public.notes
  for delete
  using (
    user_id = auth.uid()
    and exists (
      select 1
      from public.notebooks
      where notebooks.id = notes.notebook_id
        and notebooks.user_id = auth.uid()
    )
  );

drop policy if exists tasks_select_own on public.tasks;
create policy tasks_select_own
  on public.tasks
  for select
  using (
    user_id = auth.uid()
    and exists (
      select 1
      from public.notes
      where notes.id = tasks.note_id
        and notes.user_id = auth.uid()
    )
  );

drop policy if exists tasks_insert_own on public.tasks;
create policy tasks_insert_own
  on public.tasks
  for insert
  with check (
    user_id = auth.uid()
    and exists (
      select 1
      from public.notes
      where notes.id = tasks.note_id
        and notes.user_id = auth.uid()
    )
  );

drop policy if exists tasks_update_own on public.tasks;
create policy tasks_update_own
  on public.tasks
  for update
  using (
    user_id = auth.uid()
    and exists (
      select 1
      from public.notes
      where notes.id = tasks.note_id
        and notes.user_id = auth.uid()
    )
  )
  with check (
    user_id = auth.uid()
    and exists (
      select 1
      from public.notes
      where notes.id = tasks.note_id
        and notes.user_id = auth.uid()
    )
  );

drop policy if exists tasks_delete_own on public.tasks;
create policy tasks_delete_own
  on public.tasks
  for delete
  using (
    user_id = auth.uid()
    and exists (
      select 1
      from public.notes
      where notes.id = tasks.note_id
        and notes.user_id = auth.uid()
    )
  );

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists notebooks_set_updated_at on public.notebooks;
create trigger notebooks_set_updated_at
  before update on public.notebooks
  for each row execute function public.set_updated_at();

drop trigger if exists notes_set_updated_at on public.notes;
create trigger notes_set_updated_at
  before update on public.notes
  for each row execute function public.set_updated_at();
