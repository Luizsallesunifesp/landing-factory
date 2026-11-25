# Tokens de design padrão

Toda seção da biblioteca usa **apenas** estes tokens. O diretor criativo define os valores em `plano.json > design.tokens`, e o `montar.js` escreve no `:root`.

| Token | Uso | Exemplo |
|---|---|---|
| `--c-bg` | fundo principal | `#F6F1EA` |
| `--c-surface` | fundo de cards e blocos | `#FFFFFF` |
| `--c-surface-2` | faixas alternadas | `#EDE4D8` |
| `--c-text` | texto principal | `#1E1B18` |
| `--c-muted` | texto secundário | `#6B6259` |
| `--c-line` | bordas e divisores | `rgba(30,27,24,.12)` |
| `--c-primary` | cor da marca e botões | `#2F4A3A` |
| `--c-on-primary` | texto sobre a primária | `#FFFFFF` |
| `--c-accent` | detalhes e destaques | `#C08A4B` |
| `--c-dark` | seções escuras | `#141311` |
| `--c-on-dark` | texto sobre o escuro | `#F2EEE8` |
| `--f-display` | títulos | `'Fraunces', serif` |
| `--f-body` | texto | `'Manrope', sans-serif` |
| `--f-mono` | etiquetas e detalhes (opcional) | `'JetBrains Mono', monospace` |
| `--fs-hero` | tamanho do título do hero | `clamp(2.6rem, 8vw, 6rem)` |
| `--radius` | raio de borda | `14px` |
| `--radius-lg` | raio grande | `28px` |
| `--space` | unidade de espaçamento | `clamp(16px, 2.2vw, 24px)` |
| `--section-y` | respiro vertical das seções | `clamp(72px, 12vw, 160px)` |
| `--max-w` | largura máxima | `1200px` |
| `--motion` | intensidade das animações (0 = sem, 1 = normal, 1.5 = forte) | `1` |
| `--ease` | curva padrão | `cubic-bezier(.2,.7,.2,1)` |

## Regras
- Contraste mínimo AA (4.5:1) entre `--c-text` e `--c-bg`, e entre `--c-on-primary` e `--c-primary`. O `qa.js` confere.
- Animações em JS leem `--motion` com `getComputedStyle(document.documentElement).getPropertyValue('--motion')` e multiplicam distâncias e durações por ele.
- Com `prefers-reduced-motion: reduce`, o shell força `--motion: 0`.
- Nunca use cor fixa (`#...`) dentro de `section.css`. Use só tokens ou `color-mix()` com tokens.
