# Landing Factory · Tech Salles

Fábrica pessoal de landing pages com agentes Opus, Sonnet e Haiku no Claude Code. Plano completo em **PLANO.md**.

## Instalar (uma vez)
```bash
npm install
npx playwright install chromium
npx wrangler login
```
Abra a pasta no Claude Code e rode `/model sonnet`.

## Montar a biblioteca (uma vez, depois só quando tiver página nova boa)
```
/extrair-biblioteca C:\Users\luizr\OneDrive\landing page
```
Antes, descompacte o `samanta.zip` dentro dessa pasta (numa subpasta `samanta`).

## Cada cliente
```bash
npm run novo-cliente -- nome-do-cliente     # cria clients/nome-do-cliente/entrada/
```
Cole o briefing, as fotos e os links de inspiração em `entrada/`, e então no Claude Code:
```
/gerar-landing nome-do-cliente
/ajustar-landing nome-do-cliente "o que o cliente pediu"
/publicar nome-do-cliente producao
```

## Painel (interface local)
```
npm run painel
```
Abre em http://localhost:4300 (só no seu computador). Mostra os clientes e a etapa de cada um, abre a página e as capturas do QA, edita briefing e fotos, cria cliente novo e faz a curadoria da biblioteca (nota 1 a 5, aprovar, gerar catálogo). Gerar a página continua sendo no Claude Code: o painel mostra o comando `/gerar-landing <slug>` para copiar.

## Scripts (não gastam tokens)
| Comando | O que faz |
|---|---|
| `npm run extrair -- "<pasta>"` | Quebra páginas em seções brutas e tira o base64 |
| `npm run raw-resumo` | Tabela das seções classificadas |
| `npm run previews` | Screenshot de cada seção da biblioteca + `sections/PREVIEWS.html` |
| `npm run checar-secoes` | Procura cor fixa, classe sem prefixo e slot não declarado |
| `npm run catalogo` | Gera o `catalogo.json` com as seções aprovadas |
| `npm run preparar -- <slug>` | Trata fotos e baixa as inspirações |
| `npm run slots -- <slug>` | Lista os slots que o copywriter precisa preencher |
| `npm run montar -- <slug> [--rascunho]` | Monta `output/index.html` |
| `npm run override -- <slug> <chave>` | Cópia editável de uma seção só para esse cliente |
| `npm run troca -- <slug>` | Aplica trocas simples do `ajuste.json` |
| `npm run qa -- <slug> [--ciclo N]` | Testes no Chromium + screenshots |
| `npm run publicar -- <slug> [preview\|producao]` | Deploy no Cloudflare Pages |
| `node scripts/status.js <slug>` | Mostra o status do cliente |
