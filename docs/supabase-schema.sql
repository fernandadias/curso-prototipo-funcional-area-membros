-- Rode este script no Supabase: SQL Editor > New query > Run.
-- Cria as tabelas de acesso ao curso e de progresso, com RLS.

-- =========================================================
-- 1) Acesso ao curso (preenchido pelo webhook da Hotmart)
-- =========================================================
create table if not exists public.course_access (
  email       text primary key,
  status      text not null default 'inactive',   -- 'active' | 'inactive'
  last_event  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.course_access enable row level security;

-- O aluno logado pode LER apenas a própria linha (pelo e-mail do token).
-- O webhook escreve via service_role, que ignora RLS (não precisa policy).
drop policy if exists "ler proprio acesso" on public.course_access;
create policy "ler proprio acesso"
  on public.course_access
  for select
  to authenticated
  using ( lower(email) = lower(auth.jwt() ->> 'email') );

-- =========================================================
-- 2) Progresso por aluno (uma linha por aula vista)
-- =========================================================
create table if not exists public.lesson_progress (
  user_id     uuid not null references auth.users(id) on delete cascade,
  lesson_key  text not null,                       -- "<moduloSlug>/<aulaSlug>"
  viewed_at   timestamptz not null default now(),
  primary key (user_id, lesson_key)
);

alter table public.lesson_progress enable row level security;

-- O aluno só enxerga e mexe no próprio progresso.
drop policy if exists "gerir proprio progresso" on public.lesson_progress;
create policy "gerir proprio progresso"
  on public.lesson_progress
  for all
  to authenticated
  using ( user_id = auth.uid() )
  with check ( user_id = auth.uid() );
