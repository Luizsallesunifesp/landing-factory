// Mini template no estilo Mustache:
//   {{campo}}           texto escapado
//   {{{campo}}}         HTML cru (para richtext)
//   {{#lista}}...{{/lista}}  repete para cada item (ou mostra o bloco se for valor verdadeiro)
//   {{^campo}}...{{/campo}}  mostra se vazio
//   {{img:nome}} {{alt:nome}}  resolvidos pelo resolver passado
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function render(tpl, ctx, resolver = () => undefined, missing = new Set()) {
  const look = (key, stack) => {
    for (let i = stack.length - 1; i >= 0; i--) {
      const s = stack[i];
      if (s && typeof s === 'object' && key in s) return s[key];
    }
    const r = resolver(key, stack);
    if (r === undefined) missing.add(key);
    return r;
  };
  const run = (t, stack) => {
    // blocos (não-guloso, aninhamento por nome)
    t = t.replace(/\{\{([#^])\s*([\w:.-]+)\s*\}\}([\s\S]*?)\{\{\/\s*\2\s*\}\}/g, (_, kind, key, inner) => {
      const v = look(key, stack);
      const empty = v == null || v === false || v === '' || (Array.isArray(v) && v.length === 0);
      if (kind === '^') return empty ? run(inner, stack) : '';
      if (empty) return '';
      if (Array.isArray(v)) return v.map((item, i) => run(inner, [...stack, { '@index': i + 1, '@num': String(i + 1).padStart(2, '0') }, typeof item === 'object' ? item : { '.': item }])).join('');
      return run(inner, typeof v === 'object' ? [...stack, v] : stack);
    });
    t = t.replace(/\{\{\{\s*([\w:.@-]+)\s*\}\}\}/g, (_, k) => String(look(k, stack) ?? ''));
    t = t.replace(/\{\{\s*([\w:.@-]+)\s*\}\}/g, (_, k) => esc(look(k, stack) ?? ''));
    return t;
  };
  return run(tpl, [ctx]);
}

/** Lista os slots usados num template (para checagem) */
export function slotsUsed(tpl) {
  const set = new Set();
  for (const m of tpl.matchAll(/\{\{\{?\s*[#^/]?\s*([\w:.@-]+)\s*\}?\}\}/g)) if (!m[1].startsWith('@') && m[1] !== '.') set.add(m[1]);
  return set;
}
