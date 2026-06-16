# Protótipo Funcional — Contexto do Projeto

> Documento de contexto/handoff. Resume objetivo, arquitetura, estado atual,
> decisões e pendências. Última atualização: junho/2026.

---

## 1. Objetivo

Transformar a landing page estática do curso **Protótipo Funcional** (por Nanda
Dias) em uma plataforma completa, no estilo do
[designengineer.xyz](https://www.designengineer.xyz/):

- Aulas **gratuitas** (públicas) e **pagas** (com paywall)
- Área logada para alunos
- Conteúdo que mistura **texto + quizzes + vídeos + widgets interativos**
- **Hotmart** como gateway de pagamento; **Supabase** para login e controle de acesso

A LP estática original continua existindo em `../lp2` (repo
`github.com/fernandadias/prototipo-funcional-lp`). Este projeto (`site-completo`)
é a evolução dela em Next.js.

---

## 2. Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript, `src/`) |
| Estilo | CSS próprio (tema dark / verde-limão) + Tailwind disponível |
| Conteúdo | MDX (`next-mdx-remote`) + frontmatter (`gray-matter`) |
| Auth + DB | Supabase (Auth via magic link / código OTP + Postgres) |
| Pagamento | Hotmart (checkout + webhook) |
| E-mail (auth) | SMTP da Brevo (configurado no Supabase) |
| Vídeo | Embeds (Tella/YouTube) — placeholders por enquanto |
| Deploy | Vercel (pendente) |

Node 22, npm 10. Dev em `http://localhost:3001` (`PORT=3001 npm run dev`).

---

## 3. Estado atual

### ✅ Pronto
- **LP migrada** para Next.js com fidelidade total (animações, cursor, modais)
- **Header compartilhado** em React (`SiteHeader`): pill flutuante na LP
  (`variant="lp"`) e barra cheia fixa no topo na área de aulas
  (`variant="aulas"`), com botão "Área do aluno" / "Sair"
- **Pipeline de conteúdo MDX** + componentes: `Quiz`, `Video`, `Callout`,
  `Widget` (registro), `Paywall` (marcador)
- **Área de aulas (app shell)**: sidebar persistente (busca, progresso, árvore
  de módulos), página de aula (breadcrumb, prev/next, bloco do autor)
- **Progresso** via localStorage (estrutura pronta para migrar ao Supabase)
- **Paywall inline**: marcador `<Paywall />` divide prévia grátis do conteúdo
  pago; card de paywall aparece no meio da aula (sem redirecionar)
- **Auth (Supabase)**: login por **código OTP de 6 dígitos** (resistente a
  scanner de e-mail), restrito a compradores; `/entrar` com CTA de compra
- **Gate real**: aula grátis sempre liberada; aula paga exige aluno logado com
  acesso ativo em `course_access`
- **Webhook da Hotmart**: `/api/hotmart/webhook` libera/revoga acesso

### 🔜 Pendente
- **Deploy na Vercel** + variáveis de ambiente em produção
- **Configurar o webhook na Hotmart** apontando para a URL pública (só funciona
  após deploy) — hoje, para testar, insere-se manualmente em `course_access`
- **Migrar progresso** do localStorage para `lesson_progress` (por aluno)
- **Toggle da sidebar no mobile** (hoje some abaixo de 900px)
- **Ligar os modais de aula da LP** às aulas reais em `/aulas`
- **Vídeos reais** (embeds Tella) no lugar dos placeholders
- **Conteúdo real** das aulas em MDX (trilha da Nanda)
- OG image, ajustes de SEO

---

## 4. Estrutura de arquivos

```
site-completo/
├── content/modulos/NN-slug/            # conteúdo das aulas (MDX)
│   ├── _modulo.mdx                     # metadados do módulo
│   └── NN-slug.mdx                     # uma aula (frontmatter + corpo)
├── public/                             # assets da LP (svg, mp4, wav...) + lp/landing.js
├── docs/supabase-schema.sql            # SQL das tabelas (rodar no Supabase)
├── CONTRATO-CONTEUDO.md                # como escrever as aulas em MDX
├── .env.local                          # chaves (NÃO commitado)
├── .env.local.example                  # template das chaves
└── src/
    ├── middleware.ts                   # renova sessão Supabase
    ├── app/
    │   ├── layout.tsx                  # root (fontes, metadata, SW cleanup)
    │   ├── page.tsx                    # LP (injeta lp-body.html + SiteHeader lp)
    │   ├── globals.css                 # tokens :root + Tailwind
    │   ├── entrar/page.tsx             # login (código OTP) + CTA compra
    │   ├── auth/callback/route.ts       # troca code por sessão (fallback do link)
    │   ├── api/
    │   │   ├── auth/magic-link/route.ts # envia OTP só p/ comprador (gate)
    │   │   └── hotmart/webhook/route.ts # libera/revoga acesso
    │   └── aulas/
    │       ├── layout.tsx              # shell: SiteHeader + Sidebar + main
    │       ├── aulas.css               # tema e estilos da área
    │       ├── page.tsx                # índice de módulos
    │       └── [modulo]/[slug]/page.tsx# página da aula (gate + paywall split)
    ├── components/
    │   ├── chrome/                     # SiteHeader, HeaderNav, LoginButton, ServiceWorkerCleanup, site-header.css
    │   ├── aulas/                      # Sidebar, PaywallCard, AuthorBlock, useProgress, MarkViewed
    │   ├── aula/                       # Quiz, Video, Callout, Widget, mdx-components, widgets/
    │   └── landing/                    # lp-body.html, landing.css
    └── lib/
        ├── content.ts                  # lê módulos/aulas do filesystem
        ├── access.ts                   # getCurrentUser, userHasAccess
        ├── config.ts                   # CHECKOUT_URL (Hotmart)
        └── supabase/                   # client.ts, server.ts (+ admin)
```

---

## 5. Modelo de conteúdo (contrato)

Detalhado em **`CONTRATO-CONTEUDO.md`**. Resumo:

- Pasta `content/modulos/NN-slug-modulo/` com `_modulo.mdx` (frontmatter:
  `titulo`, `descricao`, `numero`) e aulas `NN-slug-aula.mdx`.
- Frontmatter da aula: `titulo`, `descricao`, `numero`, `free` (bool),
  `duracao?`, `autor?`, `autorFoto?`. O slug das URLs é o nome sem o prefixo `NN-`.
- Corpo em Markdown + componentes:
  - `<Video src="..." titulo="..." />` (use `src="PLACEHOLDER"` enquanto não gravou)
  - `<Quiz pergunta="..."> <Opcao/> <Opcao correta/> <Feedback/> </Quiz>`
  - `<Callout tipo="dica|atencao|fonte">`
  - `<Widget nome="..." />` (registrado em `components/aula/Widget.tsx`)
  - `<Paywall />` — em aulas pagas, marca o fim da prévia grátis

Adicionar aula = criar o `.mdx`; aparece automaticamente no índice e na sidebar.

---

## 6. Autenticação e paywall

**Fluxo de login (magic link / código OTP):**
1. Aluno vai em `/entrar`, digita o e-mail.
2. `POST /api/auth/magic-link` checa `course_access` (via service role). Só
   dispara o e-mail se o e-mail for **comprador ativo** — sempre responde
   `{ok:true}` para não revelar quem comprou.
3. Supabase envia (via Brevo) um e-mail com **código de 6 dígitos** (`{{ .Token }}`).
4. Aluno digita o código; `verifyOtp` no cliente cria a sessão (cookies).
5. Header passa a mostrar "Sair"; aulas pagas liberam.

> Optou-se por **código** em vez de link clicável porque links de uso único são
> consumidos por prefetch de e-mail (scanners corporativos, Gmail), causando
> "otp_expired". O código é imune a isso. A rota `/auth/callback` (fluxo de link)
> segue como fallback.

**Acesso pago:** tabela `course_access(email, status, last_event, ...)`. Gate na
página da aula: `temAcesso = meta.free || userHasAccess()`. Aula grátis fica
estática (SSG); aula paga vira dinâmica (lê cookies).

**Webhook da Hotmart** (`/api/hotmart/webhook`): valida o `hottok`
(`HOTMART_WEBHOOK_TOKEN`); `PURCHASE_APPROVED/COMPLETE` → `status=active`;
reembolso/chargeback/cancelamento → `inactive`. Liga compra → acesso
automaticamente.

**Progresso:** `lesson_progress(user_id, lesson_key)` criada para o futuro; hoje
o progresso roda em localStorage (`pf:progress`).

---

## 7. Variáveis de ambiente (`.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=          # Supabase > Settings > API (Project URL)
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # anon / publishable key (client-safe)
SUPABASE_SERVICE_ROLE_KEY=         # service_role / secret key (SÓ servidor)
HOTMART_WEBHOOK_TOKEN=             # hottok do webhook da Hotmart
```
Aceita tanto chaves clássicas (`anon`/`service_role`) quanto novas
(`sb_publishable_*`/`sb_secret_*`).

---

## 8. Setup do Supabase (feito)

1. **Tabelas + RLS:** rodar `docs/supabase-schema.sql` no SQL Editor.
2. **Redirect URLs:** Authentication → URL Configuration → Site URL
   `http://localhost:3001` + Redirect URL `http://localhost:3001/auth/callback`
   (adicionar a URL de produção no deploy).
3. **SMTP próprio (Brevo):** Authentication → Emails → SMTP Settings
   (`smtp-relay.brevo.com:587`, remetente verificado). Obrigatório — o e-mail
   embutido do Supabase é limitado a poucos envios/hora (causa `429`).
4. **Template de e-mail:** incluir `{{ .Token }}` nos templates "Magic Link" e
   "Confirm signup" para o código de 6 dígitos aparecer.

---

## 9. Como testar acesso pago localmente (sem webhook)

O webhook só funciona com URL pública (pós-deploy ou via túnel). Para testar
local: Supabase → Table Editor → `course_access` → Insert row com o e-mail
(minúsculo) e `status = active`. Depois, logar com esse e-mail e abrir uma aula
paga → conteúdo completo.

---

## 10. Decisões importantes

- **Conteúdo em MDX** (não HTML/iframe) — escala melhor e fica no estilo da LP.
- **Header único em React** nas duas áreas (extraído do blob estático da LP).
- **Login por código OTP** (resistente a prefetch de e-mail).
- **Login só para compradores** — não revela quem comprou (anti-enumeração).
- **Vídeo:** começar com Tella/YouTube (custo zero); só migrar para vídeo
  protegido (Mux/Cloudflare signed URLs) se a pirataria virar dor real.
- **Plataforma e conteúdo em paralelo**, alinhados pelo `CONTRATO-CONTEUDO.md`.
```
