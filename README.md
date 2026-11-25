# Landing Factory · Tech Salles

Fábrica de landing pages. Você cola o briefing e as fotos de um cliente, e uma equipe de agentes de IA (no Claude Code) escolhe as seções de uma biblioteca, escreve a copy, monta a página em HTML puro, testa no celular e no desktop e entrega um preview para você aprovar.

Plano completo e decisões do projeto: [PLANO.md](PLANO.md). Rotina com o cliente: [docs/operacao.md](docs/operacao.md).

## Como funciona

```
briefing + fotos ──▶ agentes (Claude Code) ──▶ página pronta ──▶ você revisa ──▶ publica
                      │                          ▲
                      └── biblioteca de seções ──┘      tudo acompanhado no painel
```

- **Biblioteca:** 121 seções aprovadas (hero, serviços, sobre, FAQ, rodapé...) tiradas de páginas reais, com espaços (`slots`) para a copy.
- **Agentes:** cada um faz uma coisa (triar briefing, escolher seções, escrever copy, revisar, julgar). Ficam em `.claude/agents/`.
- **Scripts:** montam, testam e publicam sem gastar uso da IA.
- **Painel:** tela local para criar cliente, colar briefing, enviar fotos, ver a página e fazer a curadoria da biblioteca.

## O que você precisa

| Item | Para quê | Custo |
|---|---|---|
| Node.js 20 ou mais novo | rodar scripts e painel | grátis |
| Claude Code (app desktop) com assinatura | rodar os agentes | a sua assinatura (cada página usa de 10 a 25 min de uso) |
| Git e GitHub | guardar o projeto | grátis |
| Conta Cloudflare | publicar as páginas (Cloudflare Pages) | grátis no plano básico |

## Instalar (uma vez)

Dentro da pasta do projeto, no terminal:

```powershell
npm install
npx playwright install chromium
npx wrangler login
```

- `npm install` baixa as dependências.
- `playwright install chromium` baixa o navegador que o teste de qualidade usa.
- `wrangler login` abre o navegador para entrar no Cloudflare (só precisa para publicar).

Depois abra o **Claude Code desktop nesta pasta** e rode `/model sonnet`.

> **Importante:** existe uma única cópia do projeto. Sempre abra o Claude Code e o terminal dentro dela. Se a sessão abrir em outra pasta, os comandos `/gerar-landing` etc. não aparecem.

## Passo a passo: gerar a primeira página

### 1. Abra o painel
```powershell
npm run painel
```
Abra **http://localhost:4300** no navegador. Deixe o terminal aberto enquanto usa (`Ctrl+C` fecha). O painel só funciona no seu computador.

### 2. Crie o cliente
Menu **+ Novo cliente**, digite o nome (ex.: `Abelha Chocolataria`) e clique em **Criar cliente**.

### 3. Cole o briefing
No cartão **1 · Material do cliente**, cole o que o cliente mandou, do jeito que veio no WhatsApp (pode ser a conversa inteira) e clique em **Salvar briefing**. Para saber o que pedir ao cliente, use as perguntas prontas: botão **Copiar perguntas para o cliente** (ou [docs/briefing-perguntas.md](docs/briefing-perguntas.md)).

Exemplo do que colar:

```
Nome: Abelha Chocolataria
Sou a Helena, chocolateira artesanal em Campos do Jordão (SP), Rua das Araucárias, 88.
Aberto de quinta a domingo, das 11h às 19h.
Fazemos barras bean to bar, bombons e caixas de presente. Usamos cacau de pequenos produtores.
Público: turistas e casais. WhatsApp 12 99999-0000, Instagram @abelhachocolataria.
Cores: marrom, dourado e creme. Não tenho depoimentos.
```

### 4. Envie as fotos
Arraste as fotos para a área pontilhada (JPG, PNG, WebP, AVIF ou HEIC). **Sem ao menos 1 foto o sistema não segue.** Se um envio falhar, o painel mostra uma mensagem vermelha.

### 5. Gere a página
No cartão **2 · Gerar a página**:
1. Abra o Claude Code desktop na pasta do projeto (o painel mostra o caminho, com botão **Copiar pasta**).
2. Clique em **Copiar comando de gerar** e cole no Code. O comando é:
   ```
   /gerar-landing abelha-chocolataria
   ```
   (a caixinha "pular o juiz" deixa mais rápido, mas sem nota de qualidade).
3. Volte ao painel. A tela se atualiza sozinha mostrando as etapas, a nota do juiz e a página.

Leva de 10 a 25 minutos. O botão só libera quando há briefing e foto.

### 6. Revise
Quando aparecer **Abrir página**, confira no celular e no desktop (o painel tem a prévia em celular, tablet e desktop). Siga o checklist de [docs/checklist-qa.md](docs/checklist-qa.md). Lembre de trocar o WhatsApp de teste pelo real e de confirmar registros profissionais antes de mostrar ao cliente.

### 7. Ajuste e publique
```
/ajustar-landing abelha-chocolataria "trocar o horário para 10h às 18h"
/publicar abelha-chocolataria preview
/publicar abelha-chocolataria producao
```
Publicar coloca a página no ar. Só faça depois da sua aprovação. A mensagem pronta para mandar ao cliente fica em `clients/<slug>/mensagem-entrega.md`.

## Os comandos (no Claude Code)

| Comando | O que faz |
|---|---|
| `/gerar-landing <slug> [--sem-juiz]` | Gera a página completa |
| `/ajustar-landing <slug> "<pedido>"` | Aplica um pedido de ajuste do cliente |
| `/publicar <slug> [preview\|producao]` | Publica no Cloudflare Pages |
| `/extrair-biblioteca [slug\|pasta]` | Transforma páginas prontas em seções novas da biblioteca |

## O painel, tela por tela

- **Clientes:** lista com etapa, nota do juiz, peso da página e seções. Clique para abrir.
- **Tela do cliente:** briefing, fotos, passo a passo de gerar, linha do tempo, veredito do juiz com os problemas, prévia, plano e capturas do QA.
- **Biblioteca:** as seções com preview. Dê nota de 1 a 5 e **Aprove** as que os agentes podem usar. Só as aprovadas entram no catálogo (botão **Gerar catálogo**). A meta é ter 4 ou mais de hero, serviços, sobre, processo e CTA final.
- **+ Novo cliente:** cria a pasta `clients/<slug>/`.

## Scripts (não gastam uso da IA)

Todos rodam como `npm run <nome> -- <argumentos>`.

| Comando | O que faz |
|---|---|
| `painel` | Abre o painel local |
| `novo-cliente -- <nome>` | Cria `clients/<slug>/entrada/` |
| `preparar -- <slug>` | Trata as fotos (WebP) e baixa as inspirações |
| `slots -- <slug>` | Lista os espaços de copy que o redator precisa preencher |
| `montar -- <slug> [--rascunho]` | Monta `output/index.html` |
| `qa -- <slug> [--ciclo N]` | Testa no Chromium (mobile e desktop) e tira screenshots |
| `override -- <slug> <chave>` | Cópia editável de uma seção só para esse cliente |
| `troca -- <slug>` | Aplica trocas simples (telefone, horário, foto, cor) |
| `publicar -- <slug> [preview\|producao]` | Deploy no Cloudflare Pages |
| `status -- <slug>` | Mostra o status do cliente |
| `extrair -- "<pasta>"` | Quebra páginas em seções brutas (para a biblioteca) |
| `raw-resumo` | Tabela das seções brutas classificadas |
| `previews` | Screenshot de cada seção + `sections/PREVIEWS.html` |
| `checar-secoes` | Procura cor fixa, classe sem prefixo e slot não declarado |
| `catalogo` | Gera `catalogo.json` com as seções aprovadas |
| `gerar -- <slug>` | Opcional: gera pelo terminal (precisa do CLI `claude` instalado e logado). O caminho normal é colar `/gerar-landing` no Code desktop |

## Onde fica cada coisa

```
landing-factory/
├─ clients/<slug>/          um cliente (não vai para o GitHub)
│  ├─ entrada/              briefing.md, fotos/, inspiracoes.txt
│  ├─ plano.json, copy.json o que os agentes decidiram e escreveram
│  ├─ output/index.html     a página final
│  └─ qa/, veredito.json    testes e nota do juiz
├─ sections/                biblioteca: <tipo>/<id>/{section.html, .css, .js, meta.json, preview.png}
├─ .claude/agents/          os agentes (A0 a A11)
├─ .claude/commands/        os comandos /gerar-landing etc.
├─ docs/                    tokens de design, regras de nicho, schemas, checklists, operação
├─ scripts/                 todos os scripts
├─ painel/                  interface do painel
└─ catalogo.json            o que o diretor criativo enxerga da biblioteca
```

## Regras que o sistema segue

- Página em HTML, CSS e JS puros, sem framework. Bibliotecas só por CDN com versão fixa (AOS, GSAP, Lenis).
- Imagens em WebP. Nunca base64 dentro do HTML.
- CTA principal sempre pelo WhatsApp.
- Mobile primeiro e respeitando `prefers-reduced-motion`.
- Cores, fontes e espaçamento só pelos tokens de [docs/tokens.md](docs/tokens.md).
- **Marketing honesto:** nada de números de resultado, depoimentos ou nomes que o cliente não forneceu. Nicho de saúde segue [docs/regras-nicho.md](docs/regras-nicho.md).
- Página final abaixo de 1,5 MB sem vídeo.

## Problemas comuns

| Sintoma | Causa e solução |
|---|---|
| `/gerar-landing` não aparece no Code | A sessão abriu em outra pasta. Abra o Code na pasta do projeto |
| Botão de gerar bloqueado no painel | Falta briefing (salve o texto) ou foto (envie ao menos uma) |
| Foto não sobe | Formato não aceito ou arquivo grande demais. Veja a mensagem vermelha. Use JPG, PNG, WebP, AVIF ou HEIC |
| `Porta 4300 em uso` | O painel já está aberto em outro terminal. Feche-o ou use `PAINEL_PORT=4301 npm run painel` |
| Painel mostra versão antiga | `Ctrl+C` no terminal do painel e `npm run painel` de novo |
| `qa` falha ao abrir o navegador | Rode `npx playwright install chromium` |
| Juiz reprovou duas vezes | O sistema para após 2 ciclos de correção e mostra o motivo. Veja o veredito no painel e decida |
| Cliente pede mudança grande de direção | É serviço extra: refaz o plano com o Opus (ver [docs/operacao.md](docs/operacao.md)) |

## Glossário

- **Seção:** um bloco da página (hero, serviços, FAQ...), guardado na biblioteca.
- **Slot:** espaço da seção onde entra a copy, como `{{titulo}}`.
- **Tokens:** cores, fontes e espaçamentos padrão que toda seção usa.
- **Catálogo:** lista das seções aprovadas que o diretor criativo pode escolher.
- **Juiz:** agente que avalia as screenshots da página como um diretor de arte.
- **QA:** teste automático da página no Chromium (celular e desktop).
- **Override:** versão de uma seção alterada só para um cliente, sem mexer na biblioteca.

## Estado do projeto

- Fases 1 a 3 concluídas: setup, biblioteca com 121 seções aprovadas e teste completo (página da Renata, nota 8). Resultado e lições em [docs/fase3-resultado.md](docs/fase3-resultado.md).
- Próximo: primeiro cliente real (Fase 4) e evolução contínua da biblioteca (Fase 5). Detalhes no [PLANO.md](PLANO.md).
