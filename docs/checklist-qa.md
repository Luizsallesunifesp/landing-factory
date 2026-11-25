# Checklist de QA

## Automático (`scripts/qa.js`)
| Item | Critério | Severidade se falhar |
|---|---|---|
| Overflow horizontal no mobile (390 px) | `scrollWidth <= innerWidth` | alta |
| Slots não preenchidos | nenhum `{{` no HTML final | alta |
| Imagens quebradas | todas com `naturalWidth > 0` | alta |
| Links de WhatsApp | ao menos 1 `wa.me/55` com número de 12 a 13 dígitos | alta |
| Erros no console | 0 | média |
| Peso total sem vídeo | < 1,5 MB | média |
| Base64 embutido | nenhum `data:image` acima de 2 KB | média |
| Contraste dos tokens | AA (4.5:1) | média |
| Imagens sem `alt` | 0 | baixa |
| `<title>`, `meta description`, `og:image` | presentes | baixa |
| Fontes carregadas | `document.fonts.status === 'loaded'` | baixa |
| Tempo até o primeiro conteúdo no mobile | < 2,5 s local | baixa |

## Juiz Opus (visual, nas screenshots)
1. **Cara de IA?** Gradiente genérico, emojis, cards idênticos, copy vaga, layout tudo centralizado.
2. **Hierarquia:** em 3 segundos dá para saber o que é, para quem e onde fica?
3. **Oferta:** o diferencial real do cliente aparece no hero?
4. **CTA:** o botão de WhatsApp aparece no primeiro scroll do mobile e no final?
5. **Fotos:** bem recortadas, sem distorção, com a pessoa do profissional visível quando houver.
6. **Coerência:** as seções parecem da mesma página (mesmo ritmo, mesma tipografia)?
7. **Plano cumprido:** os critérios de `plano.json > criterios_sucesso`.

## Manual (Luiz, antes de mandar o link)
- [ ] Abrir no celular de verdade e rolar a página inteira
- [ ] Clicar no WhatsApp: abre a conversa certa com o texto certo?
- [ ] Nome, registro, endereço e horário conferidos com o cliente
- [ ] Nenhuma informação inventada
