# Contrato de Conteúdo — Aulas em MDX

> Este documento define o formato em que as aulas devem ser escritas. Ele é o **ponto de encontro** entre a trilha de conteúdo (você escrevendo as aulas) e a trilha de plataforma (a área logada que renderiza essas aulas). Enquanto ambas seguirem este contrato, podem ser desenvolvidas em paralelo sem retrabalho.
>
> **Regra de ouro:** se você precisar de algo que não está descrito aqui, não invente uma sintaxe nova — me avise para a gente adicionar ao contrato. Assim a plataforma sempre saberá renderizar.

---

## 1. Onde as aulas vivem

```
/content
  /modulos
    01-principios-e-framework/
      _modulo.mdx              ← metadados do módulo
      01-as-tres-camadas.mdx   ← uma aula
      02-figma-make-demo.mdx
      ...
    02-componentes-funcionais/
      _modulo.mdx
      01-....mdx
```

- **Pasta do módulo:** `NN-slug-do-modulo/` (número com 2 dígitos)
- **Arquivo da aula:** `NN-slug-da-aula.mdx` (número com 2 dígitos, define a ordem)
- Slugs em kebab-case, em português, sem acentos (ex: `as-tres-camadas`)

---

## 2. Metadados do módulo (`_modulo.mdx`)

Cada pasta de módulo tem um `_modulo.mdx` só com frontmatter:

```mdx
---
titulo: "Princípios e framework"
descricao: "O modelo mental para sair do Figma estático e pensar em camadas."
numero: 1
---
```

| Campo | Obrigatório | Descrição |
|---|---|---|
| `titulo` | sim | Nome do módulo |
| `descricao` | sim | Uma frase, aparece no índice |
| `numero` | sim | Ordem do módulo |

---

## 3. Frontmatter da aula

Toda aula `.mdx` começa com este bloco:

```mdx
---
titulo: "As três camadas"
descricao: "HTML, CSS e JS — o que cada camada faz e por que isso muda tudo."
numero: 1
free: true
duracao: "12 min"
---
```

| Campo | Obrigatório | Descrição |
|---|---|---|
| `titulo` | sim | Título da aula |
| `descricao` | sim | Uma frase de resumo (índice + SEO) |
| `numero` | sim | Ordem dentro do módulo |
| `free` | sim | `true` = aula gratuita (pública). `false` = exige aluno pago (paywall) |
| `duracao` | não | Estimativa de tempo, ex: `"12 min"` |

> **Paywall:** a plataforma usa `free` para decidir. Aulas `free: true` são acessíveis a qualquer visitante. Aulas `free: false` mostram um preview e o paywall para quem não comprou. Você não precisa fazer mais nada — só marcar o campo certo.

---

## 4. O corpo da aula

Depois do frontmatter, escreva normalmente em **Markdown**. Tudo que é Markdown padrão funciona e já vem estilizado no tema da LP (dark, verde-limão, fonte Geist):

```mdx
## Um título de seção

Texto corrido normal. **Negrito**, *itálico*, `código inline` e [links](https://exemplo.com) funcionam.

- Listas
- com itens

> Citações viram blockquote estilizado.

```js
// blocos de código vêm com syntax highlight
const botao = document.querySelector('.like');
```
```

Você **não precisa se preocupar com estilo** — tipografia, cores, espaçamento são herdados do tema. Foque no conteúdo.

---

## 5. Componentes disponíveis

Além do Markdown, você tem componentes prontos. Use-os direto no meio do texto.

### `<Paywall />` — divisor de preview/conteúdo pago

Em aulas pagas (`free: false`), coloque `<Paywall />` numa linha para marcar onde
termina a **prévia gratuita**. Tudo **antes** do marcador é visível para qualquer
visitante; tudo **depois** fica bloqueado, e o card de paywall (preço + "Comprar
agora" na Hotmart) aparece ali mesmo, no meio da aula — sem mandar o aluno para
fora.

```mdx
Introdução visível para todos...

## Uma seção de prévia
Texto que serve de gancho.

<Paywall />

## Daqui pra baixo é só para alunos
Resto da aula...
```

Regras:
- Use apenas em aulas `free: false`. Em aulas gratuitas o marcador é ignorado.
- O marcador fica em **nível raiz**, sozinho numa linha, **entre blocos completos** — não o coloque dentro de um `<Quiz>`, `<Callout>` ou lista. (A prévia é compilada isoladamente; cortar no meio de um bloco quebraria a compilação, e nesse caso a aula inteira é bloqueada por segurança.)
- Aula paga **sem** `<Paywall />` fica totalmente bloqueada (mostra só o card).

---

### `<Video>` — embed de vídeo

```mdx
<Video src="https://www.tella.tv/video/SEU-ID/embed" titulo="Demonstração: primeira tela" />
```

| Prop | Obrigatório | Descrição |
|---|---|---|
| `src` | sim | URL de embed (Tella, YouTube, etc.) |
| `titulo` | não | Legenda acima do player |

> Como os vídeos ainda serão gravados, durante a escrita você pode deixar um placeholder: `<Video src="PLACEHOLDER" titulo="..." />`. A plataforma mostra um espaço reservado até você colocar a URL real.

---

### `<Quiz>` — pergunta de múltipla escolha

Baseado no padrão que você já usa (`data-correct` + opções + feedback). Em MDX fica assim:

```mdx
<Quiz pergunta="Qual camada cuida da aparência do botão?">
  <Opcao>Estrutura (HTML)</Opcao>
  <Opcao correta>Estilo (CSS)</Opcao>
  <Opcao>Comportamento (JS)</Opcao>
  <Feedback>Isso! CSS é a camada que define cor, tamanho, espaçamento — tudo que é visual.</Feedback>
</Quiz>
```

| Elemento | Descrição |
|---|---|
| `<Quiz pergunta="...">` | Envolve a pergunta. O texto vai no atributo `pergunta` |
| `<Opcao>` | Uma alternativa. Pode ter quantas quiser |
| `<Opcao correta>` | Marca a alternativa certa (uma por quiz) |
| `<Feedback>` | Texto mostrado depois que o aluno responde |

> Comportamento: o aluno clica, as opções travam, a certa fica verde, a errada fica vermelha, e o `<Feedback>` aparece. Igual ao seu HTML atual, só que reutilizável.

---

### `<Callout>` — caixa de destaque

```mdx
<Callout tipo="dica">
  Pro tip: peça pro agente explicar o código antes de aceitar.
</Callout>
```

| Prop `tipo` | Uso |
|---|---|
| `dica` | Sugestão prática (padrão) |
| `atencao` | Alerta / cuidado |
| `fonte` | Citação de uma fonte externa |

---

### `<Widget>` — interativos customizados

Os widgets do seu conteúdo atual (disseque o botão, explorer de camadas, makeover de prompt) são **únicos por aula**. Cada um vira um componente React nomeado. Para usar, você só chama pelo nome:

```mdx
<Widget nome="disseca-botao" />
```

> **Como funciona na prática:** quando você definir um widget novo numa aula, me diga o que ele deve fazer (ou me aponte o HTML atual dele no repo skills). Eu construo o componente React no estilo da LP e registro com um `nome`. A partir daí você só referencia `<Widget nome="..." />`. A lista de widgets disponíveis cresce conforme criamos.
>
> Widgets já mapeados do conteúdo atual (a construir): `disseca-botao`, `explorer-camadas`, `cockpit-motor`, `terminal-checklist`, `makeover-prompt`.

---

## 6. Exemplo completo de uma aula

```mdx
---
titulo: "As três camadas"
descricao: "HTML, CSS e JS — o que cada camada faz e por que isso muda tudo."
numero: 1
free: true
duracao: "12 min"
---

Todo protótipo funcional é feito de três camadas. Entender essa separação
é o que te tira do Figma estático.

## Estrutura, estilo e comportamento

A **estrutura** (HTML) é o esqueleto. O **estilo** (CSS) é a aparência.
O **comportamento** (JS) é o que acontece quando você interage.

<Video src="https://www.tella.tv/video/abc123/embed" titulo="As 3 camadas na prática" />

Veja você mesmo: ligue e desligue cada camada do botão abaixo.

<Widget nome="disseca-botao" />

<Callout tipo="dica">
  Quando o agente gerar código, tente identificar onde cada camada aparece.
</Callout>

## Teste seu entendimento

<Quiz pergunta="Qual camada define a cor do botão?">
  <Opcao>HTML</Opcao>
  <Opcao correta>CSS</Opcao>
  <Opcao>JS</Opcao>
  <Feedback>Exato! Cor, tamanho e espaçamento são responsabilidade do CSS.</Feedback>
</Quiz>

## O que você ganhou aqui

Agora você consegue olhar qualquer interface e separar mentalmente as três camadas.
```

---

## 7. Resumo do que você precisa saber para escrever

1. Crie a pasta do módulo e os arquivos `.mdx` numerados
2. Preencha o frontmatter (não esqueça do `free`)
3. Escreva em Markdown normal — o estilo vem de graça
4. Use `<Video>`, `<Quiz>`, `<Callout>` à vontade
5. Para um interativo novo, escreva `<Widget nome="..." />` e me avise o que ele faz
6. Precisou de algo que não está aqui? Me chame para adicionar ao contrato

---

*Este contrato é versionado. Mudanças no formato são combinadas entre as duas trilhas antes de entrar em vigor.*
