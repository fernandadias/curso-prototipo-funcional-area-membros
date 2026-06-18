# Deploy: LP estática (apex) + App das aulas (subdomínio)

Arquitetura escolhida: **monorepo, 2 projetos na Vercel**.

```
repo/
├── lp/            ← LP estática (HTML/CSS/JS puro)  → prototipofuncional.com.br (apex)
├── src/ ...       ← App Next (aulas, auth, webhook) → curso.prototipofuncional.com.br
├── public/ ...
└── ...
```

A LP em `lp/` é autocontida: `index.html` + `landing.css` + `landing.js` + assets.
Sem captura de leads. CTAs de compra → checkout Hotmart
(`https://pay.hotmart.com/G106003864J?off=u44pgon3`). Menu/rodapé têm
"Acessar o curso" → `https://curso.prototipofuncional.com.br`.

---

## 1) App das aulas → `curso.prototipofuncional.com.br`

É o projeto Vercel **que já existe** (o Next app).

1. Vercel → projeto atual → **Settings → Domains** → adicionar
   `curso.prototipofuncional.com.br`.
2. DNS (onde o domínio está registrado): criar **CNAME**
   `curso` → `cname.vercel-dns.com` (a Vercel mostra o valor exato).
3. (Depois, na issue #3) a raiz do app passa a levar para `/aulas`.

> Root Directory desse projeto continua a raiz do repo (onde está o Next).

## 2) LP estática → apex `prototipofuncional.com.br`

Criar um **novo projeto** Vercel a partir do **mesmo repositório**.

1. Vercel → **Add New → Project** → importar o mesmo repo.
2. **Root Directory** = `lp`.
3. **Framework Preset** = *Other* (estático). **Build Command**: vazio.
   **Output Directory**: vazio (serve a própria pasta `lp`).
4. Deploy.
5. **Settings → Domains** → adicionar `prototipofuncional.com.br` **e**
   `www.prototipofuncional.com.br`.
   - ⚠️ Se o apex hoje aponta para o projeto do app, **remova o domínio
     apex do projeto antigo primeiro** (um domínio só vive em um projeto).
6. DNS:
   - Apex `@` → **A** `76.76.21.21` (ou ALIAS/ANAME `cname.vercel-dns.com`,
     conforme seu provedor — a Vercel mostra o registro exato).
   - `www` → **CNAME** `cname.vercel-dns.com`.

## 3) Conferências pós-deploy

- `https://prototipofuncional.com.br` abre a LP estática.
- "Acessar o curso" (menu e rodapé) leva para `curso.`.
- "Comprar agora" leva ao checkout da Hotmart.
- `https://curso.prototipofuncional.com.br` abre o app das aulas (login/auth
  funcionam, cookies no subdomínio).

## Atualizar a LP no futuro

A LP é estática: editar `lp/index.html` / `lp/landing.css` / `lp/landing.js`
e dar push — a Vercel redeploya o projeto da LP. O conteúdo-fonte original
(antes da extração) ainda vive em `src/components/landing/` no app; quando a
LP no app for removida (parte da issue #3/#2), `lp/` passa a ser a única fonte.
