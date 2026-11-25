---
description: Extrai seções de páginas prontas e transforma em componentes da biblioteca
argument-hint: [pasta-das-paginas | slug-de-cliente]
---
Você é o maestro da extração. Origem: `$ARGUMENTS`
- Se for uma pasta (ex.: `C:\Users\luizr\OneDrive\landing page`), extraia todas as páginas dela.
- Se for um slug, use `clients/<slug>/output/index.html`.
- Se vazio, pergunte ao Luiz.

## Passo 1: extração bruta (script, 0 tokens)
`npm run extrair -- "<origem>"`
O script cria `sections/_raw/<cliente>/<NN-nome>/` com `section.html` (sem base64), `info.json` e as imagens já extraídas, além de `page.css` e `page.js` por cliente. Mostre ao Luiz o resumo impresso.

## Passo 2: classificação (Haiku, em lotes)
Divida as pastas de seção em lotes de cerca de 15 e chame `classificador-secoes` para cada lote. **Até 4 lotes em paralelo** na mesma mensagem.

## Passo 3: pré-curadoria
Rode `npm run raw-resumo` para gerar `sections/_raw/RESUMO.md` (tabela tipo × origem × nota sugerida × reaproveitável). Mostre a tabela ao Luiz e pergunte:
"Quais seções padronizar? (padrão: todas com reaproveitavel = true e nota ≥ 3)"

## Passo 4: padronização (Sonnet, em paralelo)
Para cada seção escolhida, chame `padronizador-secoes` com a origem e o destino `sections/<tipo>/<tipo>-<cliente>-<NN>/`. **Até 4 em paralelo** por mensagem.

## Passo 5: previews e catálogo
1. `npm run previews` (screenshot mobile de cada seção com tokens e textos de exemplo)
2. `npm run checar-secoes` (procura cor fixa, classe sem prefixo e slot sem declaração no meta)
3. Se houver erro em alguma seção, chame `padronizador-secoes` de novo só para ela, com a lista de erros (no máximo 1 vez).
4. Diga ao Luiz para abrir `sections/PREVIEWS.html`, dar nota e marcar `"aprovada": true` nos `meta.json` (ou responder aqui com a lista, que você edita).
5. Depois da curadoria: `npm run catalogo`.
