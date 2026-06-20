# Protótipo Funcional — contexto do projeto

> Documento vivo de contexto. Última atualização: **2026-06-20**.
> Repositório: `fernandadias/curso-prototipo-funcional-area-membros` · branch `main`.

## 1. O que é

Plataforma do curso **Protótipo Funcional** — ensina designers a construir
protótipos funcionais de verdade (com IA + código). O curso **deixou de ser
"aulas em vídeo"** e passou a ser **conteúdo multimídia**: texto, vídeo, quizzes
e widgets interativos numa mesma aula.

Dois produtos no mesmo repositório (monorepo):
- **Landing page (venda)** — estática, em `lp/`, servida no domínio raiz
  `prototipofuncional.com.br`.
- **Área de aulas (plataforma)** — app Next.js em `src/`, servida em
  `curso.prototipofuncional.com.br`.

## 2. Arquitetura

- **Next.js 16** (App Router, Turbopack). Atenção: nesta versão o antigo
  *middleware* virou **`proxy.ts`** (arquivo `src/proxy.ts`) — é onde a sessão
  do Supabase é renovada a cada request.
- **Supabase** — auth (login por **código/OTP de 8 dígitos** por e-mail, sem
  senha), Postgres com **RLS**, e tabela `course_access` que libera o conteúdo
  pago.
- **MDX** — conteúdo das aulas em `content/`, compilado com `next-mdx-remote`.
  ⚠️ Usamos `blockJS: false` no `compileMDX` para preservar as expressões
  `{...}` dos atributos dos widgets (quizzes, etc.) — sem isso eles quebram.
- **Hotmart** — gateway de pagamento. O **webhook** preenche `course_access`;
  os CTAs de compra apontam para o checkout (`CHECKOUT_URL` em `src/lib/config.ts`).
- **Brevo** — e-mail transacional (boas-vindas com o código de acesso).
- **Vercel** — 2 projetos (LP com Root Directory `lp/`; app na raiz). DNS
  delegado à Vercel. Passo a passo em `docs/DEPLOY-monorepo-lp.md`.

### Fluxo de acesso
1. Compra na Hotmart → webhook grava `course_access` (status `active`) pelo e-mail.
2. Aluno entra em `/entrar`, recebe **código por e-mail**, valida (`verifyOtp`).
3. Acesso é checado **no servidor** (`getAlunoInfo` / `userHasAccess` em
   `src/lib/access.ts`) — header e sidebar usam a mesma fonte de verdade.
4. Conteúdo pago só é compilado/enviado para quem tem acesso (**gating no
   servidor**, não só escondido na UI).

## 3. Estrutura de pastas

```
src/
  app/
    aulas/                 # área de aulas (layout com sidebar) + [modulo]/[slug]
    (portal)/              # chrome compartilhado: /inicio e /encontros
    entrar/                # login (código por e-mail)
    compra-*/              # páginas de retorno da Hotmart
    api/                   # magic-link, webhook Hotmart
  components/
    aula/                  # render do MDX: Video, Quiz, Callout, Widget, widgets/
    aulas/                 # chrome da plataforma: AulasHeader, Sidebar, PaywallCard,
                           # ComingSoonCard, InicioHome, EncontrosLista, Comments…
  lib/                     # config, content (MDX), access, supabase (client/server)
  proxy.ts                 # renova sessão do Supabase (ex-middleware)
content/modulos/           # aulas em MDX (ver seção 4)
lp/                        # landing page estática
docs/                      # esta doc, roadmap-lancamento.html, DEPLOY-*
```

## 4. Conteúdo (módulos)

| Módulo | Status | Aulas | Observação |
|---|---|---|---|
| M01 Fundamentos & ambiente | **disponível** | 8 | aulas 1–3 grátis, 4+ pagas |
| M02 Ações e recursos básicos | chegando | 5 | **sendo escrito** — mínimo p/ lançar |
| M03 Começando pela UI | chegando | 3 | títulos definidos |
| M04 A watchlist toma forma | em breve | 0 | só ementa + objetivo |
| M05 Dados de verdade | em breve | 0 | |
| M06 Mundo externo | em breve | 0 | |
| M07 Estressar a UI | em breve | 0 | |
| M08 A mágica da IA | em breve | 0 | |
| M09 No mundo real | em breve | 0 | |

**Frontmatter de aula** (em cada `.mdx`): `titulo`, `descricao`, `numero`,
`free` (bool), `status` (`disponivel` | `chegando`), `previsao` (opcional, ex.:
"julho"), `duracao`. Para abrir uma aula: mude `status` para `disponivel`. Para
cortar preview no meio (paywall), insira `<Paywall />` no ponto desejado.

**Estados de aula na UI:**
- `disponivel` + grátis/aluno → conteúdo completo.
- `disponivel` + paga sem acesso + `<Paywall />` → preview + paywall (corte).
- `disponivel` + paga sem acesso, sem marcador → empty state "só para alunos".
- `chegando` → empty state "em produção" com a previsão.

## 5. O que já foi feito

- **Infra/decoupling**: LP virou estática em `lp/`; app no subdomínio `curso.`;
  monorepo na Vercel; DNS delegado. (#1, #2, #3)
- **Login** novo (UI dos Figmas, código por e-mail, casos de saída: comprar,
  não sei o e-mail, assistir grátis). (#4)
- **Header** (`AulasHeader`) com estados aluno × não-aluno vindos do servidor,
  menu, dropdown de perfil + **Perfil fakedoor** (modal de interesse). (#5)
- **Sidebar** nova: badges de módulo, status, progresso, "objetivo", módulos
  colapsáveis, aula ativa, busca, estados (grátis/para-alunos/chegando). (#6)
- **Início** (home do aluno) — mock: saudação, próximo encontro com contagem,
  encontros anteriores, retomar, avisos (dispensáveis + empty state),
  calendário com detalhes por dia. (#7)
- **Encontros** (gravações) — mock, com player no mesmo embed das aulas. (#8)
- **Conteúdo M1** completo e fiel (8 aulas) + biblioteca de widgets.
- **Paywall + empty states** (chegando/fechada) e **gating no servidor**. (#26, #49)
- **CI** (GitHub Actions: lint + build/type-check em PR e push na main). (#47)
- **Áudio/UX**: som de clique da LP em toda a área de aulas; confete lima;
  marcar aula como concluída.
- **Correções notáveis**: header não-aluno × sidebar aluno (estado vindo do
  servidor); `middleware.ts` → `proxy.ts`; CTAs que apareciam como texto
  (estilos `.btn` portados para `aulas.css`).

### Estado de lançamento (flag)
`COMUNIDADE_ATIVA` em `src/lib/config.ts` (hoje **`false`**) esconde Início/
Encontros do menu, faz o login cair em `/aulas` e redireciona `/inicio` e
`/encontros` para `/aulas` — porque essas áreas ainda usam **mock**. Vira
`true` num lugar só quando o backend (#9) e a integração (#27) ficarem prontos.

## 6. Roadmap

> Visual (Gantt) em **`docs/roadmap-lancamento.html`** (abrir no navegador).

**Meta:** abrir a venda. **Dependência de negócio:** Módulos 1 e 2 prontos
(conteúdo + vídeo) com paywall e fluxo compra→acesso funcionando.

**Caminho crítico (a trava é vídeo):**
`Decidir hospedagem (#33) → gravar M1 (#34) + (escrever M2 #32 → gravar M2 #35) → subir → testar compra→acesso → 🚀 abrir venda`

### Épicos e issues (GitHub)

**Lançamento (must):**
- #25 Conteúdo para o lançamento → #32 aulas M2 · #33 hospedagem de vídeo ·
  #34 vídeos M1 · #35 vídeos M2
- #26 Gating → ✅ #36 paywall · ✅ #37 empty fechada · ✅ #38 empty chegando
- #24 LP — reposicionamento → #29 copy · #30 módulos · #31 remover seção (should)

**Pós-lançamento (fast-follow):**
- #27 Início/Encontros reais (dep. #9) → #39 próximo encontro · #40 encontros ·
  #41 avisos · #42 calendário · #43 play→número
- #9 Backend de comunidade (encontros/avisos/fakedoor)
- #11 Experiência da aula → #15 progresso no scroll/auto-conclusão · #16 footer + avaliação
- #12 Voz do aluno → #17 contato/feedback · #18 pedir conteúdo · #19 relacionadas
- #13 Banners contextuais → #20 banner reutilizável
- #14 Temas e navegação → #21 white mode · #22 contagem na sidebar colapsada
- #28 Assistente do curso (IA) → #44 chat treinado no conteúdo
- #23 Persistir reflexões do aluno (Supabase) + id único

**Segurança e confiabilidade (#46):**
- ✅ #47 CI · #48 auditoria RLS · ✅ #49 gating no servidor · #50 endurecer
  webhook · #51 headers de segurança · #52 rate limit no magic-link ·
  #53 Dependabot/audit · #54 smoke tests (Playwright)

> Postura de segurança atual está sólida: RLS habilitado/coerente,
> `SERVICE_ROLE_KEY` só no servidor, magic-link sem enumeração, webhook valida
> token. As issues acima são endurecimento, não correção de brecha.

### Decisões pendentes (suas)
1. **Hospedagem de vídeo** (#33) — recomendação: Vimeo (simples) ou Bunny
   Stream (mais barato em escala).
2. **M2** — material/roteiro para rascunhar o MDX; quantas aulas e grátis/pagas.
3. Manter Início/Encontros escondidos no lançamento (recomendado) vs. /inicio
   mínimo e honesto.

## 7. Convenções importantes

- **Regra de marca:** a cor primária **lima nunca sobre fundo claro** — em
  superfície clara, inverter (fundo escuro + texto lima).
- **Next 16:** usar **`proxy.ts`** (não `middleware.ts`); ler os guias em
  `node_modules/next/dist/docs/` antes de mexer em convenções.
- **MDX:** manter `blockJS: false` no `compileMDX`.
- **Labels do board:** tipo (`épico`/`feature`/`melhoria`/`bug`/`infra`/
  `segurança`), área (`conteúdo`/`comunidade`/`plataforma`/`design`),
  prioridade (`must`/`should`/`could`).
- **CI:** todo PR roda lint + build; manter verde.

## 8. Variáveis de ambiente

| Var | Onde | Para quê |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | client + server | conexão Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | client + server | conexão Supabase (anon) |
| `SUPABASE_SERVICE_ROLE_KEY` | **só servidor** | webhook/admin (ignora RLS) |
| `HOTMART_WEBHOOK_TOKEN` | servidor | validar webhook da Hotmart |
| `BREVO_API_KEY` | servidor | e-mail de boas-vindas |

As do app já estão configuradas no projeto da Vercel. A LP não usa env.

## 9. Rodar localmente

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de produção (inclui type-check)
npm run lint
```

Precisa de um `.env.local` com as variáveis acima para auth/comentários
funcionarem em dev.
