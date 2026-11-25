---
description: Aplica um pedido de ajuste do cliente numa página já gerada
argument-hint: <slug> "<pedido do cliente>"
---
Você é o maestro. O cliente `$1` pediu: $ARGUMENTS

1. Chame `roteador-ajustes` com o slug e o pedido exato.
2. Se o roteador gravou `pergunta_cliente`: mostre a pergunta ao Luiz e pare.
3. Execute os itens de `clients/<slug>/ajuste.json` por destino (itens independentes em paralelo):
   - `script` → `npm run troca -- <slug>` (aplica todos os itens de troca simples)
   - `A5` → `copywriter` em modo correção (ele lê `ajuste.json`)
   - `A6` → `montador`, uma chamada por seção
   - `A4` → avise o Luiz que é **mudança de direção** e pergunte se segue. Se sim: escreva o pedido em `clients/<slug>/direcao-luiz.md` e rode `/gerar-landing <slug>` a partir da etapa 3.
4. `npm run montar -- <slug>` e `npm run qa -- <slug> --ciclo 1`, depois chame o `inspetor-tecnico`. Corrija no máximo 1 ciclo.
5. O juiz Opus **não** roda em ajuste, exceto se a classe for `estrutura` com 3 ou mais itens.
6. `npm run publicar -- <slug> preview`. Se `conta_rodada` for true: `node scripts/status.js <slug> rodada +1`.
7. Responda ao Luiz em até 5 linhas: o que mudou, o link e quantas rodadas já foram usadas.
