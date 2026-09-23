// ============================================================
// Generador de dictados: elige una historia del banco
// (js/dictado-historias.js) que trabaje las reglas ortográficas
// elegidas y la ajusta al número de frases pedido.
//
// Cada historia tiene un inicio y un final fijos y, en medio,
// episodios que se entienden por sí solos: para acortarla se
// quitan episodios (sin cambiar el orden), así el dictado sigue
// siendo una historia con sentido y no frases sueltas.
//
// Las palabras que ilustran una regla se marcan en el texto como
// [palabra|reglaId|explicación]; si ilustra dos reglas:
// [palabra|regla1|explicación 1||regla2|explicación 2].
// parseFrase() convierte la frase en "tokens" (texto normal o
// palabra marcada) que la interfaz colorea y explica al pulsar.
// ============================================================

const DICTADO_RULES = [
  { id: "h", label: "La h", color: "#4338ca" },
  { id: "gj", label: "G / J", color: "#0f766e" },
  { id: "bv", label: "B / V", color: "#b45309" },
  { id: "yll", label: "Y / LL", color: "#7e22ce" },
  { id: "cz", label: "C / Z", color: "#1d4ed8" },
  { id: "xs", label: "X / S", color: "#be123c" },
  { id: "td", label: "Tilde diacrítica", color: "#db2777" },
  { id: "mayus", label: "Mayúsculas", color: "#059669" },
  { id: "agudas", label: "Palabras agudas", color: "#ea580c" },
  { id: "llanas", label: "Palabras llanas", color: "#65a30d" },
  { id: "esdrujulas", label: "Palabras esdrújulas", color: "#0891b2" },
  { id: "diptongo", label: "Diptongos", color: "#ca8a04" },
  { id: "hiato", label: "Hiatos", color: "#475569" },
];

const DICTADO_HISTORIAS = (typeof window !== "undefined" && window.DICTADO_HISTORIAS) || [];

function parseFrase(template) {
  const tokens = [];
  const re = /\[([^|\]]+)\|([^\]]+)\]/g;
  let lastIndex = 0;
  let m;
  while ((m = re.exec(template))) {
    if (m.index > lastIndex) tokens.push({ text: template.slice(lastIndex, m.index) });
    const marcas = m[2].split("||").map((parte) => {
      const k = parte.indexOf("|");
      return { ruleId: parte.slice(0, k).trim(), reason: parte.slice(k + 1).trim() };
    });
    tokens.push({ text: m[1], marcas });
    lastIndex = re.lastIndex;
  }
  if (lastIndex < template.length) tokens.push({ text: template.slice(lastIndex) });
  return { tokens };
}

// Reglas marcadas en una frase (plantilla sin procesar).
function reglasDeFrase(template) {
  const out = new Set();
  parseFrase(template).tokens.forEach((t) => (t.marcas || []).forEach((mk) => out.add(mk.ruleId)));
  return out;
}

function dictadoShuffle(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function historiaMinFrases(h) {
  return h.inicio.length + h.final.length + 1;
}

function historiaMaxFrases(h) {
  return h.inicio.length + h.episodios.length + h.final.length;
}

// Historias que mejor cubren las reglas elegidas (las que trabajan más reglas de la selección).
function historiasCandidatas(reglaIds) {
  let mejor = 0;
  const puntuadas = DICTADO_HISTORIAS.map((h) => {
    const n = h.reglas.filter((r) => reglaIds.includes(r)).length;
    if (n > mejor) mejor = n;
    return { h, n };
  });
  if (!mejor) return [];
  return puntuadas.filter((x) => x.n === mejor).map((x) => x.h);
}

// Número de frases posible con las reglas elegidas: { min, max } o null si no hay historias.
function rangoFrasesDictado(reglaIds) {
  const cands = historiasCandidatas(reglaIds || []);
  if (!cands.length) return null;
  return {
    min: Math.min(...cands.map(historiaMinFrases)),
    max: Math.max(...cands.map(historiaMaxFrases)),
  };
}

function generarDictado(reglaIds, numFrases) {
  if (!reglaIds || !reglaIds.length) throw new Error("Selecciona al menos una regla ortográfica.");
  reglaIds.forEach((id) => {
    if (!DICTADO_RULES.some((r) => r.id === id)) throw new Error("Regla no reconocida: " + id);
  });
  const cands = historiasCandidatas(reglaIds);
  if (!cands.length) throw new Error("No hay historias para las reglas elegidas.");

  // Preferimos las historias en las que cabe el número de frases pedido.
  const caben = cands.filter((h) => numFrases >= historiaMinFrases(h) && numFrases <= historiaMaxFrases(h));
  const pool = caben.length ? caben : cands;
  const h = pool[Math.floor(Math.random() * pool.length)];

  const total = Math.max(historiaMinFrases(h), Math.min(numFrases, historiaMaxFrases(h)));
  const nEpisodios = total - h.inicio.length - h.final.length;

  // Se quedan los episodios con más palabras de las reglas elegidas; a igualdad, al azar.
  const elegidos = dictadoShuffle(h.episodios.map((texto, i) => ({ texto, i })))
    .map((e) => {
      const rs = reglasDeFrase(e.texto);
      return Object.assign(e, { peso: reglaIds.filter((r) => rs.has(r)).length });
    })
    .sort((a, b) => b.peso - a.peso)
    .slice(0, nEpisodios)
    .sort((a, b) => a.i - b.i)
    .map((e) => e.texto);

  const plantillas = h.inicio.concat(elegidos, h.final);
  const frases = plantillas.map((t) => {
    const f = parseFrase(t);
    // Solo se corrigen las reglas elegidas: el resto de marcas se muestran como texto normal.
    f.tokens = f.tokens.map((tk) => {
      if (!tk.marcas) return tk;
      const mk = tk.marcas.find((x) => reglaIds.includes(x.ruleId));
      return mk ? { text: tk.text, ruleId: mk.ruleId, reason: mk.reason } : { text: tk.text };
    });
    return f;
  });

  return {
    id: h.id,
    titulo: h.titulo,
    frases,
    nInicio: h.inicio.length,
    nFinal: h.final.length,
    reglasHistoria: h.reglas.slice(),
    reglasPracticadas: reglaIds.filter((r) => h.reglas.includes(r)),
    solicitadas: numFrases,
    generadas: frases.length,
  };
}

function dictadoTextoPlano(dictado) {
  return dictado.titulo + "\n\n" + dictado.frases.map((f) => f.tokens.map((t) => t.text).join("")).join(" ");
}
