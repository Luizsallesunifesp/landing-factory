---
description: Publica a página de um cliente no Cloudflare Pages (preview ou produção)
argument-hint: <slug> [preview|producao]
---
Publique o cliente com os argumentos `$ARGUMENTS` (padrão: preview).

1. Se for `producao`: confirme com o Luiz que o cliente aprovou o preview. Sem confirmação, não publique.
2. `npm run publicar -- $ARGUMENTS`
3. Em produção, chame o `entregador` (fase entrega) e lembre o Luiz de ligar o domínio (ver `docs/operacao.md`, seção Domínio).
4. Responda com o link e o caminho de `mensagem-entrega.md`.
