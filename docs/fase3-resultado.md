# Fase 3 — teste com a Renata (cliente `renata-teste`)

Briefing escrito a partir do texto da página original, foto placeholder, WhatsApp de teste. Fluxo completo do `/gerar-landing`, publicação não executada.

## Resultado
- 11 seções, 64 KB, 0 imagens, só AOS. QA automático: ciclo 1 com 2 problemas baixos, ciclo 2 com 1.
- Conformidade (A8): sem cura, prazo, depoimento ou número de resultado. 2 trechos que soavam como promessa foram corrigidos.
- Juiz (Opus), ciclo 2: **nota 7, reprovado** (limite de 2 ciclos atingido, escala para o Luiz). Critérios de sucesso 1 a 6 atendidos, página sem cara de IA.

## Defeitos que o juiz apontou (a corrigir com o montador)
1. `03-dor-elaine-03` slot `nota_final`: `<strong>` aparece escapado (slot declarado como texto, usado com HTML).
2. `09-local-renata-06`: link "Ver no Google Maps" aparece com `maps_url` vazio.
3. `02-hero-samanta-02` subtítulo no mesmo tamanho do título.
4. Médios: grid 3+1 em serviços, nav sem respiro no desktop, endereço duplicado no card de local, título do FAQ pequeno e container desalinhado.

## O que errou no sistema (lições)
- **Slots com HTML:** padronizadores declaram `texto` mas a seção usa `<strong>`/`<em>`. Falta checagem no `checar-secoes` (slot `texto` usado com `{{ }}` e copy com tag).
- **Links opcionais:** seções com link de Maps/WhatsApp precisam de `{{#maps_url}}…{{/maps_url}}` para sumir quando vazio.
- **Âncoras do nav:** não existiam. Corrigido: campo `ancora` no plano, `montar.js` põe o `id` na raiz, e o diretor foi instruído a defini-lo.
- **Contraste de escala tipográfica:** subtítulo do hero herdado de outro cliente herdou tamanho de display. Padronizador deve fixar hierarquia título/subtítulo.
- **Dados que o agente não tem:** registro profissional fora do padrão CRP, WhatsApp e Maps reais dependem do Luiz.
- **Sem foto:** o sistema funciona, mas o diretor precisa de seções sem foto (ele soube escolher).

## Pendências antes de usar com cliente real
- Corrigir os 3 itens altos e remontar.
- Confirmar registro, WhatsApp e URL do Maps.

## Rodada de correção (após o aval do Luiz)
- Corrigidos na biblioteca: `dor-elaine-03` (`{{{nota_final}}}`), `local-renata-06` (link do Maps condicional, `presencial_texto` sem endereço), `hero-samanta-02` (hierarquia título/subtítulo). Corrigido no motor: busca do Maps não repete mais a cidade.
- Overrides do cliente: grid 2x2 em serviços, nav sem rótulo mono abaixo de 1200px.
- Juiz (ciclo 3, fora do limite por autorização do Luiz): **nota 8, não aprovado**. O alerta "link do Maps vazio" foi falso positivo (o link usa o endereço do briefing).
- Restam, como itens médios: nav a ~1000px quebra em 2 linhas e o FAQ (`faq-thais-09`) fica mais estreito que as outras seções, com título pequeno. Corrigir na biblioteca antes do primeiro cliente real.
- Lição: o juiz lê só screenshots e pode errar sobre dados; o maestro deve checar itens de "dado ausente" no HTML antes de despachar.
