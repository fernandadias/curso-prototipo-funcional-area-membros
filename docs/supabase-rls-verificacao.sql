-- =====================================================================
-- Verificação de RLS — rode no Supabase (SQL Editor) DEPOIS de aplicar
-- supabase-schema.sql e comments-schema.sql.
--
-- Objetivo: confirmar que o estado REAL do projeto bate com a intenção do
-- versionado (RLS é configurado no painel, não garantido pelo repo).
-- =====================================================================

-- ---------------------------------------------------------------------
-- A) RLS está LIGADO em todas as tabelas? (relrowsecurity deve ser true)
--    Qualquer linha com rls_ligado = false é furo aberto.
-- ---------------------------------------------------------------------
select c.relname            as tabela,
       c.relrowsecurity     as rls_ligado,
       c.relforcerowsecurity as rls_forcado
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname in (
    'course_access', 'lesson_progress',
    'profiles', 'comments', 'comment_reactions'
  )
order by c.relname;

-- ---------------------------------------------------------------------
-- B) Quais policies existem em cada tabela? Confira nome, comando e
--    expressões. NENHUMA deve ter qual='true' liberando geral, nem
--    alcançar o role 'anon'.
-- ---------------------------------------------------------------------
select schemaname,
       tablename,
       policyname,
       roles,            -- deve ser {authenticated}
       cmd,              -- SELECT / INSERT / UPDATE / DELETE / ALL
       qual    as using_expr,
       with_check
from pg_policies
where schemaname = 'public'
order by tablename, cmd, policyname;

-- ---------------------------------------------------------------------
-- C) Quem pode atualizar QUE coluna de profiles?
--    O esperado: authenticated com UPDATE apenas em 'name'.
--    Se aparecer 'is_instructor' para authenticated, o GRANT não foi aplicado.
-- ---------------------------------------------------------------------
select grantee, privilege_type, column_name
from information_schema.column_privileges
where table_schema = 'public'
  and table_name = 'profiles'
  and privilege_type = 'UPDATE'
order by grantee, column_name;

-- ---------------------------------------------------------------------
-- D) Funções SECURITY DEFINER devem ter search_path fixado.
--    proconfig deve conter "search_path=public".
-- ---------------------------------------------------------------------
select p.proname           as funcao,
       p.prosecdef         as security_definer,
       p.proconfig         as config
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in ('is_active_student', 'is_instructor', 'handle_new_user');

-- =====================================================================
-- E) TESTE PRÁTICO como ALUNO COMUM (não-instrutor).
--    Pegue o id de um usuário aluno e rode trocando :uid.
--    Simula o contexto de RLS daquele usuário sem precisar logar no app.
-- =====================================================================
-- 1) descubra um user_id de aluno (NÃO a sua conta de instrutora):
--    select id, email from auth.users order by created_at desc limit 10;

-- 2) com o id em mãos, rode o bloco abaixo (troque o UUID):
/*
begin;
  -- assume a identidade do aluno para a sessão
  select set_config('request.jwt.claims',
    json_build_object(
      'sub',  'COLE_O_UUID_AQUI',
      'role', 'authenticated',
      'email','email-do-aluno@exemplo.com'
    )::text, true);
  set local role authenticated;

  -- (i) course_access: deve voltar SÓ a linha do próprio e-mail
  select email, status from public.course_access;

  -- (ii) TENTA escalar privilégio — DEVE FALHAR (0 linhas afetadas ou erro
  --      de permissão na coluna). Se atualizar, o GRANT da coluna não pegou.
  update public.profiles set is_instructor = true
   where user_id = 'COLE_O_UUID_AQUI';

  -- (iii) editar o próprio nome — DEVE funcionar
  update public.profiles set name = 'Teste RLS'
   where user_id = 'COLE_O_UUID_AQUI';

rollback;  -- não persiste nada do teste
*/
