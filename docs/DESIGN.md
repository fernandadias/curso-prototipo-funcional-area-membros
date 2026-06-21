# DESIGN.md — Sistema visual da área de aulas

Regras de design do projeto. Valem para a **área de aulas** (`/aulas`, `/inicio`,
`/encontros`, `/extras`) e seus componentes. A LP (`/lp`) tem o próprio CSS.

> Fonte da verdade visual: os frames **"Alterações 01"** (página da aula) e
> **"Alterações 02"** (galeria de componentes) no Figma do projeto.

---

## 1. Princípios inegociáveis

1. **Tudo que é interativo no conteúdo da aula tem borda tracejada.**
   O *card/bloco interativo* (quiz, widgets) usa `border: 1px dashed`. Os
   controles **dentro** dele (botões, alternativas, inputs, checkbox, radio)
   continuam com borda/preenchimento **sólidos**. A regra é do contêiner
   interativo, não de todo elemento clicável.

2. **Nunca usar emoji.** Em UI nem em conteúdo de widget. Todo ícone vem do
   Font Awesome. (Texto corrido das aulas: expurgo de emoji virá depois; por ora
   só os widgets já redesenhados.)

3. **Ícones só via Font Awesome Pro 7**, peso **solid** sempre (`fa-solid`).
   `fa-brands` apenas para logos de terceiros. Usar o componente `Icon`
   (`src/components/ui/Icon.tsx`) — nunca um glyph unicode (`→ ← ▾ ✓ ✗`) nem emoji.

---

## 2. Font Awesome — como está montado

- Self-host em `public/fontawesome/` (só `solid` + `brands` — `css/` + `webfonts/`).
- Carregado por `<link>` no `<head>` de `src/app/layout.tsx`.
- Uso: `import { Icon } from "@/components/ui/Icon"` → `<Icon name="arrow-left" />`.
  - `smaller` deixa o ícone ~0.85em (menor que o texto ao lado).
  - `title="..."` torna o ícone acessível; sem `title` ele é decorativo.

---

## 3. Tokens (área de aulas)

Definidos em `.aulas-root` (`src/app/aulas/aulas.css`) e `globals.css`:

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#1a1a1a` | fundo |
| `--chrome` | `#242424` | header, sidebar |
| `--surface` | `#232323` | cards |
| `--surface-2` | `#2a2a2a` | cards internos |
| `--accent` | `#d4f542` | lima — destaque/sucesso |
| `--text` / `--text-dim` / `--text-mute` | `#f0e7da` / `#ccbd9f` / `#9c9180` | texto |
| `--border` / `--border-light` | `#2e2e2e` / `#383838` | bordas |

Cores por camada (HTML/CSS/JS), usadas em camadas e no code-explorer:

| Camada | Cor |
|---|---|
| Estrutura (HTML) | `#e0a16a` |
| Estilo (CSS) | `#7bbedb` |
| Comportamento (JS) | `#d8c06a` |

Estados de resposta: correto = `--accent` (lima); errado = coral `#e08585` /
borda `#7a3a3a`.

---

## 4. Card interativo (padrão dos widgets/quiz)

- Fundo escuro `--surface` (`#232323`).
- **Borda tracejada**: `1px dashed var(--border-light)`.
- Raio `var(--radius)` (12px), padding 16–22px.
- **Não** são mais cards creme (o override creme `.quiz`/`.widget` será removido).

---

## 5. Componentes-base reutilizáveis

### `ListIndicator` — badge numerado
O quadradinho com número em mono (origem: sidebar das aulas). Reusado em:
- **Alternativas do quiz** (01/02/03).
- **Itens de camada** — aqui é **colorido por camada** (laranja/azul/dourado).

### `Checkbox` (visual)
Quadrado; marcado = preenchido lima + `Icon name="check"`. Usado em disseca-botão
e checklist.

### `Radio` (visual)
Círculo; estados *default* (anel) e *checked* (anel lima + miolo). Usado nas
alternativas do quiz.

---

## 6. Especificações por componente (do Figma "Alterações 01/02")

- **Quiz** — card escuro + tracejado. Cada alternativa = `ListIndicator` + label +
  `Radio` à direita. Estados:
  - correto → alternativa lima + radio checked + feedback com `Icon name="check"`;
  - errado → alternativa coral + radio checked + feedback com `Icon name="xmark"`.
- **Camadas** — sem borda esquerda colorida; emoji → `ListIndicator` colorido por camada.
- **Prompt** — header escuro; label **branco** e só "Prompt"; CTA "Copiar"
  (`Icon name="copy"`); corpo do prompt com `letter-spacing: 0.04em`.
- **Extra** — CTA "Abrir" com `Icon name="arrow-up-right"`.
- **Disseca-botão / Checklist / Reflexão / Code-explorer / Antes×depois** —
  card escuro + tracejado, ícones FA (`check`, `heart`, `file-pen`, etc.).
- **Sidebar** — linhas separadoras de módulo a 100% da largura.
- **Callout** — ícones FA (`hexagon-exclamation` atenção, `comment-question`,
  `book-blank`) no lugar dos emojis.

---

## 7. Mapa emoji/glyph → Font Awesome

| Antes | Depois (`Icon name=`) |
|---|---|
| `←` / `→` | `arrow-left` / `arrow-right` |
| `‹` / `›` | `angle-left` / `angle-right` |
| `«` | `angles-left` |
| `▾` / `▴` | `caret-down` / `caret-up` |
| `✓` | `check` |
| `✗` | `xmark` |
| `▶` | `play` |
| `⚠️` | `hexagon-exclamation` |
| `💡` | `lightbulb` |
| `🔗` | `link` / `book-blank` (fonte) |
| `✍️` | `file-pen` |
| `♡` / `♥` | `heart` |
| 🔶 / 🔷 / 🔸 (camadas) | `ListIndicator` numerado, colorido por camada |
| copiar | `copy` |
