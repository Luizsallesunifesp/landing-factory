# Landing Factory — Plano completo

Sistema pessoal da **Tech Salles** para gerar landing pages de alta conversão com uma equipe de agentes (Opus, Sonnet e Haiku) rodando no **Claude Code**, usando a assinatura do Luiz.

> **Uso:** pessoal. O cliente fala com o Luiz pelo WhatsApp, e o Luiz roda o sistema. Nenhum cliente acessa o sistema ou dispara geração. Por isso a assinatura do Claude atende: é uso individual do Claude Code.

---

## 1. Objetivo

| Antes (manual pelo Claude.ai) | Depois (Landing Factory) |
|---|---|
| Cada página começa do zero numa conversa | A página nasce de uma biblioteca com as melhores seções já feitas |
| Imagens em base64 dentro do HTML (até 1,5 MB) | Pasta `assets/` com WebP, cache do Cloudflare (padrão Samanta) |
| Revisão depende de lembrar de tudo | QA automático (mobile, links, peso) + juiz Opus |
| Fontes e estruturas se repetem sem querer | O Diretor varia a tipografia e consulta o histórico |
| Publicação manual | `npm run publicar <cliente>` |

**Prioridades de qualidade (em ordem):** 1) visual que não pareça feito por IA, 2) animações e scroll funcionando no mobile, 3) copy e conversão, 4) velocidade de entrega.

---

## 2. Fluxo de um cliente (do WhatsApp à entrega)

```
Cliente chama no WhatsApp
  └─ Luiz manda as perguntas de docs/briefing-perguntas.md
  └─ Luiz salva respostas, fotos e links de inspiração em clients/<slug>/entrada/
       (npm run novo-cliente <slug> cria a pasta)

/gerar-landing <slug>                      ← um comando no Claude Code
  1. scripts   preparar          (tratar fotos + baixar e limpar inspirações)   0 tokens
  2. Haiku     triador-briefing  ┐
     Haiku     leitor-inspiracoes├ em paralelo
     Haiku     curador-fotos     ┘
     → se faltar algo essencial: gera perguntas-cliente.md e PARA
  3. Opus      diretor-criativo  → plano.json
  4. Sonnet    copywriter        → copy.json
  5. script    montar            → output/index.html                            0 tokens
  6. Sonnet    montador          → só nas seções marcadas "ajuste_custom"
  7. script    qa                → qa/relatorio.json + screenshots              0 tokens
  8. Haiku     inspetor-tecnico  → feedback.json (correções roteadas, máx. 2 ciclos)
  9. Sonnet    revisor-conformidade (só se nicho regulado)
 10. Opus      juiz-final        → aprovado | feedback (máx. 2 ciclos → Luiz)
 11. script    publicar preview  → link de preview                              0 tokens
 12. Haiku     entregador        → mensagem-entrega.md (pronta para o WhatsApp)

Cliente pede ajuste → /ajustar-landing <slug> "pedido"
  Haiku roteador-ajustes classifica → script, copywriter, montador ou diretor

Cliente aprova → /publicar <slug> producao
```

**Chamadas por página (alvo):** Opus 2 · Sonnet 2 a 5 · Haiku 5 a 8.

---

## 3. A equipe de agentes

Todos ficam em `.claude/agents/`. O campo `model:` define o modelo de cada um.

| # | Agente | Modelo | Lê | Escreve | Quando roda |
|---|---|---|---|---|---|
| A0a | `classificador-secoes` | haiku | `sections/_raw/**/section.html` | `meta.json` da seção | Extração da biblioteca |
| A0b | `padronizador-secoes` | sonnet | seção bruta + CSS da página | seção com slots e tokens | Extração da biblioteca |
| A1 | `triador-briefing` | haiku | `entrada/briefing.*` | `briefing.json` | Toda página |
| A2 | `leitor-inspiracoes` | haiku | `work/inspiracoes/*.txt` | `inspiracao.json` | Toda página com inspiração |
| A3 | `curador-fotos` | haiku | `work/thumbs/*` | `assets.json` | Toda página |
| A4 | `diretor-criativo` | **opus** | os 3 JSONs + `catalogo.json` + histórico | `plano.json` | 1× por página (+1 se mudar a direção) |
| A5 | `copywriter` | sonnet | `plano.json`, `briefing.json`, slots | `copy.json` | Toda página e ajustes de texto |
| A6 | `montador` | sonnet | uma seção de `output/` + pedido | a seção corrigida | Só em ajuste_custom ou feedback |
| A7 | `inspetor-tecnico` | haiku | `qa/relatorio.json` | `feedback.json` | Após cada QA |
| A8 | `revisor-conformidade` | sonnet | `copy.json` + `docs/regras-nicho.md` | `feedback.json` | Só se `regulado: true` |
| A9 | `juiz-final` | **opus** | screenshots + `plano.json` + histórico de feedback | `veredito.json` | Após QA sem erro crítico |
| A10 | `roteador-ajustes` | haiku | pedido do cliente + `plano.json` | `ajuste.json` | Em cada pedido de ajuste |
| A11 | `entregador` | haiku | `status.json`, `briefing.json`, link | `mensagem-entrega.md` | Preview e entrega final |

### Regras de comunicação

1. **Os agentes não conversam entre si.** Cada um lê arquivos da pasta do cliente e escreve **um** arquivo de saída. A sessão principal (o "maestro", rodando o comando `/gerar-landing`) chama o próximo.
2. **Cada agente devolve ao maestro no máximo 5 linhas:** o que gravou, problemas e se pode seguir. O conteúdo fica no arquivo, não na conversa.
3. **Toda crítica usa o formato único** de `docs/schemas/feedback.schema.json`, com origem, destino, seção, slot, severidade, problema e correção. Assim o agente de destino recebe uma tarefa cirúrgica.
4. **Escada de escalonamento:** Haiku não resolve → Sonnet. Sonnet falha 2× na mesma correção → Opus. Opus reprova 2× → Luiz decide.
5. **Limite de ciclos:** no máximo 2 ciclos de correção por etapa.
6. **`status.json`** registra cada etapa (agente, horário, resultado). É o painel de cada cliente.

---

## 4. A biblioteca de seções

É o coração da qualidade. O sistema **não cria páginas do zero**: ele escolhe e combina variações já testadas, extraídas das 13 páginas da pasta `OneDrive\landing page`.

### Inventário das páginas (análise de 24/11/2026)

| Tipo | Exemplos de origem | Quantidade aproximada |
|---|---|---|
| `nav` | todas | 13 |
| `hero` | todas | 13 |
| `cta-final` | final-cta, agendar, contato, reserva, booking | 13 |
| `sobre` | sobre, dra, quem-assina, profissional | ~11 |
| `servicos` | serviços, especialidades, protocolos, tratamentos, áreas | ~11 |
| `processo` | processo, método, ritual, como-funciona | ~9 |
| `local` | local, mapa | ~7 |
| `dor` | dor, sinais, quando-procurar | 5 |
| `faq` | faq, perguntas | 5 |
| `prova` | depoimentos, prova, trust, resultados | 5 |
| `faixa` | quoteband, band, breathe | ~5 |
| `especial` | quiz (Tiago Farma), preço (Hiroshi), insta (Karol), produtos (Acalm), portfólio (Luiz), sequência de frames do dente (Samanta) | 6 |
| `footer` | todas | 13 |

**Achados:**
- 70% a 95% do peso das páginas é imagem em base64. A extração tira o base64 para arquivos.
- A Samanta (assets em pasta, WebP, `_headers`) é o **padrão de saída**.
- Fraunces + Manrope aparece em 4 páginas. O Diretor varia a tipografia (regra no histórico).
- Stack recorrente: AOS, GSAP, GSAP + ScrollTrigger + Lenis nas mais novas e CTA por WhatsApp em todas.

### Formato de uma seção na biblioteca

```
sections/hero/hero-samanta-01/
├── section.html    # HTML com slots {{headline}}, {{img:hero}}, {{#itens}}...{{/itens}}
├── section.css     # CSS só desta seção, usando os tokens padrão (docs/tokens.md)
├── section.js      # opcional: animação própria (GSAP/ScrollTrigger)
├── meta.json       # tipo, estilo, nicho, libs, slots e limites de caracteres, nota
└── preview.png     # screenshot mobile (gerado pelo script)
```

O `catalogo.json` (gerado por `npm run catalogo`) lista **só o meta** de cada seção aprovada. É o único arquivo que o Opus lê sobre a biblioteca: ele nunca abre HTML.

---

## 5. Estrutura do projeto

```
landing-factory/
├── PLANO.md                     # este arquivo
├── CLAUDE.md                    # regras que o Claude Code lê sempre
├── package.json                 # scripts npm
├── .claude/
│   ├── settings.json            # permissões
│   ├── agents/                  # 13 agentes (A0a, A0b, A1–A11)
│   └── commands/
│       ├── extrair-biblioteca.md
│       ├── gerar-landing.md     # o maestro
│       ├── ajustar-landing.md
│       └── publicar.md
├── docs/
│   ├── tokens.md                # tokens de design padrão
│   ├── regras-nicho.md          # conformidade por nicho
│   ├── checklist-qa.md
│   ├── briefing-perguntas.md    # mensagem para mandar no WhatsApp
│   ├── operacao.md              # rotina do dia a dia
│   └── schemas/                 # contrato de cada JSON
├── scripts/                     # tudo que não gasta token
├── sections/
│   ├── _base/shell.html         # esqueleto da página (head, tokens, libs, botão WhatsApp)
│   ├── _raw/                    # extração bruta (não vai para o catálogo)
│   └── <tipo>/<id>/             # seções aprovadas
├── catalogo.json
├── clients/
│   ├── _historico.json          # fontes e seções usadas por cliente (anti-repetição)
│   └── <slug>/
│       ├── entrada/             # o que o cliente mandou (briefing, fotos, inspiracoes.txt)
│       ├── work/                # gerado pelos scripts (thumbs, inspirações limpas)
│       ├── briefing.json  inspiracao.json  assets.json
│       ├── plano.json  copy.json  feedback.json  veredito.json
│       ├── qa/                  # relatório e screenshots
│       ├── output/              # o site final (index.html + assets/ + _headers)
│       └── status.json
└── templates/                   # mensagens de WhatsApp
```

---

## 6. Onde roda

| Peça | Onde | Custo |
|---|---|---|
| Agentes | Claude Code no PC do Luiz (aba Code do app desktop ou terminal), logado na assinatura | Cota da assinatura |
| Scripts | Node 22+ no PC | 0 |
| Sites | Cloudflare Pages (`wrangler`), mesma conta da Samanta | Plano gratuito (confirmar limites) |
| Preview | `preview.tsl-<slug>.pages.dev` | 0 |
| Produção | `<slug>.pages.dev` → domínio do cliente ou `<slug>.techsalles.com.br` | Domínio à parte |
| Código | GitHub (Luizsallesunifesp), repositório privado | 0 |

**Não colocar o projeto no OneDrive:** a sincronização trava com `node_modules`. Use `C:\Users\luizr\source\repos\landing-factory`. A pasta `OneDrive\landing page` continua sendo o arquivo das páginas antigas e serve de fonte da biblioteca.

### Economia da cota da assinatura

1. A sessão principal roda em **Sonnet** (`/model sonnet`). O Opus aparece só nos agentes A4 e A9.
2. Nenhum agente lê HTML com base64 nem a página inteira. Eles trabalham com JSON, seção isolada e screenshot.
3. Fotos chegam aos agentes como miniatura de 512 px.
4. Inspirações chegam limpas (sem scripts, SVG e trackers), com no máximo 6 mil caracteres por site.
5. O catálogo traz só os metas, nunca o código.
6. Ajustes editam **um slot ou uma seção**, nunca a página toda.
7. Limite de 2 ciclos de correção por etapa.
8. Se a cota apertar: gere fora do horário de pico ou rode o juiz Opus só em clientes premium (flag `--sem-juiz`).

---

## 7. Fases de implementação (ordem para o Claude Code executar)

> Os scripts foram testados com as 13 páginas reais (141 seções extraídas, base64 zerado, cada seção com 4 a 8 KB) e com um cliente fictício (slots → montar → QA → troca simples → override).

### Fase 1 — Setup (≈ 1 hora)
- [x] Copiar esta pasta para `C:\Users\luizr\source\repos\landing-factory`
- [x] `npm install` e `npx playwright install chromium`
- [x] `git init` e criar o repositório privado no GitHub
- [x] `npx wrangler login` (conta Cloudflare da Samanta)
- [x] Abrir no Claude Code e rodar `/model sonnet`

### Fase 2 — Biblioteca (≈ 1 a 2 dias)
- [x] Descompactar `samanta.zip` na pasta `OneDrive\landing page\samanta`
- [x] `npm run extrair -- "C:\Users\luizr\OneDrive\landing page"` → `sections/_raw/` (a pasta `teste` e os arquivos de backup são ignorados)
- [x] `/extrair-biblioteca`: Haiku classifica, Sonnet padroniza cada seção com slots e tokens
- [x] `npm run previews` → screenshot de cada seção
- [x] **Luiz cura:** em cada `meta.json`, nota de 1 a 5 e `aprovada: true/false`. Só as aprovadas entram no catálogo
- [x] `npm run catalogo`
- **Meta:** pelo menos 4 variações aprovadas de hero, serviços, sobre, processo e CTA final

### Fase 3 — Primeiro teste (≈ 1 dia)
- [x] Recriar uma página antiga (sugestão: Renata, a mais leve) só a partir de um briefing escrito
- [x] Comparar com a original: o sistema chega perto? Onde errou?
- [ ] Ajustar os prompts dos agentes e as regras do CLAUDE.md

### Fase 4 — Primeiro cliente real
- [ ] `npm run novo-cliente <slug>` → `/gerar-landing <slug>` → preview → ajustes → produção
- [ ] Anotar em `docs/operacao.md` o que travou e o tempo gasto

### Fase 5 — Evolução (contínua)
- Toda página aprovada pode doar seções novas para a biblioteca (`/extrair-biblioteca <slug>`)
- Ajustar regras de nicho conforme os clientes
- Se um dia o sistema for aberto para clientes dispararem a geração sozinhos, a etapa dos agentes precisa migrar para a **API com chave própria**, porque a assinatura não cobre esse uso

---

## 8. Decisões que ficam com o Luiz

- Preço, prazo e número de rodadas de ajuste inclusas (ver `docs/operacao.md`)
- Se o domínio do cliente fica na conta do cliente ou na da Tech Salles
- Quais seções entram na biblioteca (curadoria da Fase 2)
- Aprovação final antes de mandar qualquer link ao cliente
