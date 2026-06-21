-- Rode este script no Supabase: SQL Editor > New query > Run.
-- Comentários das aulas (Fase 1): comentar, responder, reagir (👍/👎),
-- resposta da instrutora destacada, e nome de exibição vindo da Hotmart.
--
-- Ordem importa: as tabelas são criadas ANTES das funções, porque as funções
-- (language sql) referenciam profiles/course_access e são validadas na criação.

-- =========================================================
-- 1) Nome do comprador (vem do buyer.name da Hotmart)
-- =========================================================
alter table public.course_access add column if not exists name text;

-- =========================================================
-- 2) Perfis: nome de exibição + flag de instrutora
-- =========================================================
create table if not exists public.profiles (
  user_id       uuid primary key references auth.users(id) on delete cascade,
  name          text,
  is_instructor boolean not null default false,
  created_at    timestamptz not null default now()
);

-- =========================================================
-- 3) Comentários (com respostas via parent_id)
-- =========================================================
create table if not exists public.comments (
  id         uuid primary key default gen_random_uuid(),
  lesson_key text not null,                                  -- "<modulo>/<aula>"
  user_id    uuid not null references public.profiles(user_id) on delete cascade,
  parent_id  uuid references public.comments(id) on delete cascade,
  body       text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now()
);
create index if not exists comments_lesson_idx on public.comments (lesson_key, created_at);
create index if not exists comments_parent_idx on public.comments (parent_id);

-- =========================================================
-- 4) Reações (👍 = 1, 👎 = -1) — uma por aluno/comentário
-- =========================================================
create table if not exists public.comment_reactions (
  comment_id uuid not null references public.comments(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  value      smallint not null check (value in (-1, 1)),
  created_at timestamptz not null default now(),
  primary key (comment_id, user_id)
);

-- =========================================================
-- 5) Helpers de autorização (SECURITY DEFINER p/ ignorar RLS interna)
-- =========================================================

-- O usuário logado é um aluno ATIVO? (mesma regra do gate de conteúdo)
create or replace function public.is_active_student()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.course_access
    where lower(email) = lower(auth.jwt() ->> 'email')
      and status = 'active'
  );
$$;

-- O usuário logado é a instrutora? (marca-se manualmente em profiles)
create or replace function public.is_instructor()
returns boolean
language sql
security definer
set search_path = public
as $$
  select coalesce(
    (select is_instructor from public.profiles where user_id = auth.uid()),
    false
  );
$$;

-- =========================================================
-- 6) RLS dos perfis
-- =========================================================
alter table public.profiles enable row level security;

-- Alunos ativos leem perfis (para exibir os nomes nos comentários).
drop policy if exists "alunos leem perfis" on public.profiles;
create policy "alunos leem perfis"
  on public.profiles for select to authenticated
  using ( public.is_active_student() );

-- Cada um edita o próprio perfil (apenas a própria linha).
drop policy if exists "editar proprio perfil" on public.profiles;
create policy "editar proprio perfil"
  on public.profiles for update to authenticated
  using ( user_id = auth.uid() ) with check ( user_id = auth.uid() );

-- IMPORTANTE: RLS controla LINHAS, não COLUNAS. Sem o GRANT abaixo, um aluno
-- poderia setar o próprio is_instructor=true direto pela anon key e virar
-- moderador (apagar comentário de qualquer um). Travamos o UPDATE de
-- `authenticated` para SÓ a coluna name; is_instructor fica fora do alcance
-- (continua sendo marcado por você via SQL, no passo 9).
revoke update on public.profiles from authenticated;
grant  update (name) on public.profiles to authenticated;

-- Cria o profile quando o usuário nasce, copiando o nome da course_access.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, name)
  values (
    new.id,
    (select name from public.course_access where lower(email) = lower(new.email))
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill: garante profile para usuários que já existiam.
insert into public.profiles (user_id, name)
select u.id, ca.name
from auth.users u
left join public.course_access ca on lower(ca.email) = lower(u.email)
on conflict (user_id) do nothing;

-- =========================================================
-- 7) RLS dos comentários
-- =========================================================
alter table public.comments enable row level security;

drop policy if exists "alunos leem comentarios" on public.comments;
create policy "alunos leem comentarios"
  on public.comments for select to authenticated
  using ( public.is_active_student() );

drop policy if exists "aluno cria comentario" on public.comments;
create policy "aluno cria comentario"
  on public.comments for insert to authenticated
  with check ( user_id = auth.uid() and public.is_active_student() );

drop policy if exists "aluno edita proprio comentario" on public.comments;
create policy "aluno edita proprio comentario"
  on public.comments for update to authenticated
  using ( user_id = auth.uid() ) with check ( user_id = auth.uid() );

-- Apaga o próprio; a instrutora apaga qualquer um (moderação).
drop policy if exists "apagar comentario" on public.comments;
create policy "apagar comentario"
  on public.comments for delete to authenticated
  using ( user_id = auth.uid() or public.is_instructor() );

-- =========================================================
-- 8) RLS das reações
-- =========================================================
alter table public.comment_reactions enable row level security;

drop policy if exists "alunos leem reacoes" on public.comment_reactions;
create policy "alunos leem reacoes"
  on public.comment_reactions for select to authenticated
  using ( public.is_active_student() );

drop policy if exists "aluno gere propria reacao" on public.comment_reactions;
create policy "aluno gere propria reacao"
  on public.comment_reactions for all to authenticated
  using ( user_id = auth.uid() and public.is_active_student() )
  with check ( user_id = auth.uid() and public.is_active_student() );

-- =========================================================
-- 9) Marque-se como instrutora (troque pelo e-mail que VOCÊ usa para logar):
--    update public.profiles set is_instructor = true
--    where user_id = (select id from auth.users where lower(email) = lower('SEU_EMAIL'));
-- =========================================================
