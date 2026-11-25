# Operação do dia a dia

## Rotina por cliente
| Passo | Quem | Comando ou ação | Tempo estimado |
|---|---|---|---|
| 1. Primeiro contato | Luiz | Mandar `docs/briefing-perguntas.md` | 2 min |
| 2. Salvar material | Luiz | `npm run novo-cliente <slug>` e copiar respostas e fotos para `entrada/` | 5 min |
| 3. Gerar | Sistema | `/gerar-landing <slug>` | 10 a 25 min |
| 4. Revisão manual | Luiz | Checklist manual de `docs/checklist-qa.md` | 5 min |
| 5. Mandar preview | Luiz | Colar `mensagem-entrega.md` no WhatsApp | 1 min |
| 6. Ajustes | Sistema | `/ajustar-landing <slug> "pedido"` | 2 a 10 min por pedido |
| 7. Publicar | Sistema | `/publicar <slug> producao` | 2 min |
| 8. Domínio | Luiz | Ligar o domínio no Cloudflare (ver abaixo) | 10 min |
| 9. Doar seções | Sistema | `/extrair-biblioteca <slug>` se a página tiver seção nova boa | 5 min |

## Nome do cliente (slug)
Minúsculo, sem acento, com hífen: `samanta-oliveira`, `acalm-head-spa`.

## Domínio
- **Preview:** automático em `preview.tsl-<slug>.pages.dev`.
- **Subdomínio Tech Salles:** no painel do Cloudflare, abra Pages → projeto → Custom domains → `<slug>.techsalles.com.br`. Isso exige que `techsalles.com.br` esteja na mesma conta Cloudflare.
- **Domínio próprio do cliente:** o cliente registra (Registro.br para `.com.br`) no nome dele e aponta o DNS para o Cloudflare. Depois, faça o mesmo passo de Custom domains.

## Ajustes: o que conta como rodada
O roteador classifica cada pedido:
- `troca_simples` (telefone, foto, cor, horário): não conta como rodada
- `texto` e `estrutura`: conta como rodada
- `mudanca_direcao`: refaz o plano com o Opus; tratar como serviço extra

> Defina aqui quantas rodadas estão inclusas no seu preço: **[a definir pelo Luiz]**

## Registro de melhorias
Anote aqui o que travou em cada cliente, para ajustar os agentes:

| Data | Cliente | Problema | Ajuste feito |
|---|---|---|---|
| 2026-11 | renata-teste (Fase 3) | Slot com HTML escapado; link Maps sem condição; âncoras do nav inexistentes; nav quebrando a 1000px; juiz com falso positivo de dado | Corrigido na biblioteca e no motor (ver docs/fase3-resultado.md) |
| | | | |
