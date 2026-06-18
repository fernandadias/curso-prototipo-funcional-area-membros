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
6. DNS — **no registro.br** (este domínio é `.br`).

### Opção recomendada: manter o DNS no registro.br (preserva o e-mail/MX)
No **editor de zona DNS** do registro.br (NÃO trocar os servidores DNS),
adicione:

| Tipo | Nome | Valor |
|---|---|---|
| A | `@` (apex) | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |
| CNAME | `curso` | `cname.vercel-dns.com` |

- ⚠️ **Não mexer nos registros MX** (e-mail `contato@…` continua funcionando).
- ⚠️ Apex usa **A** (não CNAME — a raiz não aceita CNAME). IP da Vercel:
  `76.76.21.21`.

### Opção alternativa: delegar a zona para a Vercel
Trocar os servidores DNS para `ns1.vercel-dns.com` / `ns2.vercel-dns.com`.
- Mais simples (a Vercel gerencia tudo), **mas**: **desative o DNSSEC** no
  registro.br e **recrie os registros MX** do e-mail dentro da Vercel, senão
  o e-mail para de funcionar.

> A Vercel mostra o registro exato ao adicionar cada domínio no projeto —
> siga os valores que ela exibir.

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
