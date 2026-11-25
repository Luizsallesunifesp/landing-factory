# Landing Factory — regras do projeto

Sistema pessoal da Tech Salles (Luiz) para gerar landing pages de clientes. Plano completo: `PLANO.md`.
Responda sempre em português.

## Stack obrigatória das páginas
- HTML/CSS/JS puro. Sem framework e sem build.
- Bibliotecas permitidas, sempre por CDN com versão fixa: AOS 2.3.4, GSAP 3.12.5 (+ ScrollTrigger) e Lenis 1.1.13.
- Google Fonts para tipografia.
- Imagens em `output/assets/` como WebP. **Nunca embutir base64.**
- CTA principal sempre pelo WhatsApp (`https://wa.me/55DDDNUMERO?text=...` com texto URL-encoded).
- Mobile first. Toda animação precisa funcionar no celular e respeitar `prefers-reduced-motion`.
- Cores, fontes, raio e espaçamento só pelos tokens de `docs/tokens.md`.

## Papel da sessão principal (maestro)
- Rode a sessão principal em **Sonnet** (`/model sonnet`).
- O maestro **não escreve copy nem HTML**. Ele roda scripts, chama subagentes e lê os resumos que eles devolvem.
- Chame subagentes independentes **na mesma mensagem**, para rodarem em paralelo.
- Nunca leia `output/index.html` inteiro nem arquivos de `sections/_raw/` com base64. Use os scripts.
- Atualize `clients/<slug>/status.json` com `node scripts/status.js <slug> <etapa> <resultado>`.

## Regras para todos os agentes
- Leia só os arquivos listados no seu prompt.
- Escreva um arquivo de saída que siga o schema em `docs/schemas/`.
- Devolva ao maestro no máximo 5 linhas: o que gravou, problemas e se pode seguir.
- Críticas e correções sempre no formato `docs/schemas/feedback.schema.json`.
- No máximo 2 ciclos de correção por etapa. Depois disso, escale (Haiku → Sonnet → Opus → Luiz).

## Qualidade (em ordem)
1. Não parecer feito por IA: sem gradiente roxo genérico, sem emojis como ícone, sem "Transforme sua vida", sem 3 cards iguais com ícone em círculo, sem tudo centralizado.
2. Scroll e animações funcionando no mobile.
3. Copy específica do negócio (cidade, nome, diferencial real) e CTA claro.
4. Velocidade: a página final deve ficar abaixo de 1,5 MB sem vídeo.

## Marketing honesto
- Nada de números de resultado, depoimentos ou nomes de clientes que o cliente não forneceu.
- Nicho de saúde: seguir `docs/regras-nicho.md`.

## Painel
- `npm run painel` abre a interface local em http://localhost:4300 (clientes, curadoria, novo cliente). Código em `scripts/painel.js` e `painel/index.html`.

## Comandos
- `/extrair-biblioteca [slug|pasta]`: transforma páginas em seções da biblioteca
- `/gerar-landing <slug> [--sem-juiz]`: gera a página completa
- `/ajustar-landing <slug> "<pedido>"`: aplica um pedido de ajuste do cliente
- `/publicar <slug> [preview|producao]`
