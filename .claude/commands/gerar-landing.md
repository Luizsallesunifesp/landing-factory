---
description: Gera a landing page completa de um cliente (maestro da equipe de agentes)
argument-hint: <slug> [--sem-juiz]
---
Você é o **maestro**. Gere a landing page do cliente `$ARGUMENTS`.
O primeiro argumento é o slug; `--sem-juiz` pula o A9.

Regras do maestro: você não escreve copy nem HTML, não lê `output/index.html` e não lê os arquivos de saída dos agentes por inteiro (confie no resumo deles; abra um JSON só para decidir um desvio). Atualize o status ao fim de cada etapa com `node scripts/status.js <slug> "<etapa>" "<resultado>"`.

## Etapa 0: checagem
- Confirme que existe `clients/<slug>/entrada/briefing.md` (ou .txt) e ao menos 1 foto em `entrada/fotos/`. Se faltar, pare e diga ao Luiz o que falta.
- Se `clients/<slug>/plano.json` já existir, pergunte ao Luiz se é para refazer do zero ou usar `/ajustar-landing`.

## Etapa 1: preparar (scripts, 0 tokens)
`npm run preparar -- <slug>`

## Etapa 2: entrada (Haiku, em paralelo)
Chame **na mesma mensagem** os subagentes `triador-briefing`, `leitor-inspiracoes` e `curador-fotos`, passando o slug.
- Se o triador responder `ESSENCIAL_FALTANDO: sim`: pare, mostre ao Luiz o conteúdo de `clients/<slug>/perguntas-cliente.md` e encerre com status "aguardando cliente".

## Etapa 3: direção (Opus)
Chame `diretor-criativo`. Depois rode `npm run slots -- <slug>` para gerar `work/slots.json`.
- Se o script avisar que algum `id` não existe no catálogo, devolva ao diretor com a lista de ids válidos (no máximo 1 vez).

## Etapa 4: copy (Sonnet)
Chame `copywriter` em modo completo.

## Etapa 5: montagem
`npm run montar -- <slug>`
- Se o plano tiver seções com `ajuste_custom`, chame `montador` para cada uma (em paralelo, se forem várias).

## Etapa 6: QA técnico (até 2 ciclos)
1. `npm run qa -- <slug> --ciclo 1`
2. Chame `inspetor-tecnico`.
3. Se `PODE_SEGUIR: não`: leia `feedback.json` e despache cada item para o destino:
   - `A5` → `copywriter` em modo correção e depois `npm run montar -- <slug>`
   - `A6` → `montador` com a chave da seção
   - `script` → rode o script indicado (montar, preparar) ou resolva o dado
   Rode o ciclo 2 (`--ciclo 2`). Se ainda houver item crítico ou alto, pare e mostre ao Luiz.

## Etapa 7: conformidade (Sonnet, só se `regulado: true`)
Chame `revisor-conformidade`. Se houver itens:
- destino `luiz`: pare e pergunte ao Luiz (ex.: número de registro)
- destino `A5`: `copywriter` em modo correção → `npm run montar -- <slug>` → `npm run qa -- <slug> --ciclo 1`

## Etapa 8: juiz (Opus, pule se `--sem-juiz`)
Chame `juiz-final`.
- Aprovado → etapa 9.
- Reprovado no ciclo 1 → despache o feedback como na etapa 6 (itens `A4` vão para o `diretor-criativo`, e depois refaça a partir da etapa 4), rode `npm run qa -- <slug> --ciclo 2` e chame o juiz de novo.
- Reprovado no ciclo 2 → pare e mostre ao Luiz a nota, os problemas e o `recado_luiz`.

## Etapa 9: preview e mensagem
1. `npm run publicar -- <slug> preview`
2. Chame `entregador` (fase preview).

## Final
Responda ao Luiz em até 8 linhas: link do preview, nota do juiz, quantas chamadas de cada modelo foram feitas, pontos de atenção e o caminho de `mensagem-entrega.md`. Lembre-o do checklist manual em `docs/checklist-qa.md`.
