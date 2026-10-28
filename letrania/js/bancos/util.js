// ============================================================
// Letrania · utilidades para escribir los bancos de ítems.
//
// Cada estación (senda + ficha) es una plantilla de minijuego y una
// lista de ítems. Los bancos (dragon.js, grifo.js, unicornio.js) se
// escriben con estas ayudas para que lo repetitivo (separar sílabas,
// saber si una palabra es aguda, poner o quitar la tilde, construir
// las opciones) se calcule aquí y no pueda quedar descuadrado.
//
// Formato de un ítem ya construido (equivale al de la especificación:
// {plantilla, senda, ficha, enunciado, palabra_con_hueco, opciones,
// correcta, regla, pista, audio, pictograma}):
//   id         "d10-07": senda (d, g, u) + ficha + número. Los ids se
//              guardan en Firestore (fallos), así que en una lista ya
//              publicada solo se AÑADEN palabras al final, nunca se
//              reordenan ni se borran.
//   plantilla  puente | caza | cestas | ordenar | cortar | espejo | eco
//   enunciado  pregunta que se lee
//   palabra    texto con hueco «_» (puente, eco) o palabra a mostrar
//   opciones   textos de los botones / cestas / burbujas
//   correcta   índice de la opción correcta
//   piezas     ordenar: piezas en orden correcto
//   letras     cortar: texto sin cortes; cortes: posiciones de corte
//   solucion   texto que se enseña al resolver
//   regla      la regla en una línea (se enseña siempre al responder)
//   pista      ayuda opcional
//   audio      lo que lee la voz del navegador
//   picto      palabra clave para el pictograma de ARASAAC
// ============================================================
(function () {
  "use strict";

  const VOCALES = "aeiouáéíóúü";
  const FUERTES = "aeoáéó";
  const CON_TILDE = { a: "á", e: "é", i: "í", o: "ó", u: "ú" };
  const SIN_TILDE = { á: "a", é: "e", í: "i", ó: "o", ú: "u" };

  const bancos = {};

  function registrar(senda, ficha, def) {
    const pref = senda.charAt(0);
    def.items.forEach((it, i) => {
      it.id = pref + ficha + "-" + String(i + 1).padStart(2, "0");
    });
    if (!bancos[senda]) bancos[senda] = {};
    bancos[senda][ficha] = def;
  }

  // "fan.TAS.ma" → { silabas: ["fan","tas","ma"], tonica: 1, palabra: "fantasma" }
  // La sílaba tónica se escribe en MAYÚSCULAS.
  function analizar(marcada) {
    const partes = marcada.split(".");
    let tonica = partes.findIndex((s) => s === s.toUpperCase() && s !== s.toLowerCase());
    if (tonica < 0) tonica = partes.length - 1; // monosílabos
    const silabas = partes.map((s) => s.toLowerCase());
    return { silabas: silabas, tonica: tonica, palabra: silabas.join("") };
  }

  function tipoAcento(a) {
    const desdeFinal = a.silabas.length - 1 - a.tonica;
    return desdeFinal === 0 ? "aguda" : desdeFinal === 1 ? "llana" : "esdrujula";
  }

  const NOMBRE_TIPO = { aguda: "aguda", llana: "llana", esdrujula: "esdrújula" };

  function tieneTilde(p) {
    return /[áéíóú]/.test(p);
  }

  // Lo que dicen las reglas generales (no se usan palabras con hiato
  // acentual ni tilde diacrítica en estos bancos).
  function debeLlevarTilde(a) {
    const tipo = tipoAcento(a);
    const ultima = a.palabra.slice(-1);
    const vocalNS = VOCALES.indexOf(ultima) !== -1 || ultima === "n" || ultima === "s";
    if (tipo === "aguda") return a.silabas.length > 1 && vocalNS;
    if (tipo === "llana") return !vocalNS;
    return true;
  }

  function reglaTilde(a) {
    const tipo = tipoAcento(a);
    const ultima = a.palabra.slice(-1);
    const fin = VOCALES.indexOf(ultima) !== -1 ? "vocal" : "-" + ultima;
    if (tipo === "esdrujula") return "«" + a.palabra + "» es esdrújula: las esdrújulas llevan tilde siempre.";
    if (tipo === "aguda")
      return debeLlevarTilde(a)
        ? "«" + a.palabra + "» es aguda y termina en " + fin + ": lleva tilde."
        : "«" + a.palabra + "» es aguda y termina en " + fin + ": no lleva tilde.";
    return debeLlevarTilde(a)
      ? "«" + a.palabra + "» es llana y termina en " + fin + ": lleva tilde."
      : "«" + a.palabra + "» es llana y termina en " + fin + ": no lleva tilde.";
  }

  // Pone la tilde en la vocal que toca de la sílaba tónica: la fuerte
  // (a, e, o) si hay diptongo; si son dos débiles, la segunda.
  function conTildeEnTonica(a) {
    const s = a.silabas[a.tonica];
    let pos = -1;
    for (let i = 0; i < s.length; i++) if (FUERTES.indexOf(s[i]) !== -1) { pos = i; break; }
    if (pos < 0) for (let i = s.length - 1; i >= 0; i--) if (VOCALES.indexOf(s[i]) !== -1) { pos = i; break; }
    const nueva = s.slice(0, pos) + (CON_TILDE[s[pos]] || s[pos]) + s.slice(pos + 1);
    return a.silabas.map((x, i) => (i === a.tonica ? nueva : x)).join("");
  }

  function quitarTildes(p) {
    return p.replace(/[áéíóú]/g, (c) => SIN_TILDE[c]);
  }

  // Forma mal escrita (sin la tilde que lleva, o con una que no lleva).
  function formaErronea(a) {
    return tieneTilde(a.palabra) ? quitarTildes(a.palabra) : conTildeEnTonica(a);
  }

  function separar(a) {
    return a.silabas.join("-");
  }

  // ---------- Constructores de ítems ----------

  // Puente: grupos { regla, palabras: ["[b]lanco", "ha[b]lar"...], pista }
  // El hueco va entre corchetes; «[]» = la palabra no lleva esa letra.
  function puente(opciones, grupos, enunciado) {
    const items = [];
    grupos.forEach((g) => {
      g.palabras.forEach((p) => {
        const m = p.match(/^(.*)\[(.*)\](.*)$/);
        const letra = m[2];
        const correcta = opciones.indexOf(letra === "" ? opciones[opciones.length - 1] : letra);
        const palabra = m[1] + m[2] + m[3];
        items.push({
          plantilla: "puente",
          enunciado: enunciado || "¿" + opciones.join(" o ") + "?",
          palabra: m[1] + "_" + m[3],
          opciones: opciones.slice(),
          correcta: correcta,
          solucion: palabra,
          audio: palabra,
          regla: typeof g.regla === "function" ? g.regla(palabra) : g.regla,
          pista: g.pista || "",
        });
      });
    });
    return items;
  }

  // Escriba (ordenar): frases ya bien escritas; se barajan sus piezas.
  function ordenar(frases, regla) {
    return frases.map((f) => ({
      plantilla: "ordenar",
      enunciado: "Ordena las piezas para formar la oración.",
      piezas: f.split(" "),
      solucion: f,
      audio: f,
      regla: regla,
    }));
  }

  // Escriba (cortar) para separar palabras: se enseña todo junto y en
  // minúscula; el alumno toca entre las letras donde va un espacio.
  function cortarPalabras(frases, regla) {
    return frases.map((f) => {
      const palabras = f.replace(/[.,]/g, "").toLowerCase().split(" ");
      const cortes = [];
      let pos = 0;
      palabras.slice(0, -1).forEach((p) => {
        pos += p.length;
        cortes.push(pos);
      });
      return {
        plantilla: "cortar",
        enunciado: "Toca entre las letras para separar las palabras.",
        letras: palabras.join(""),
        cortes: cortes,
        solucion: f,
        audio: f,
        regla: regla,
        pista: "Lee en voz baja y da una palmada por cada palabra.",
      };
    });
  }

  // Escriba (cortar) para separar sílabas: "cas.ta.ña".
  function cortarSilabas(lista, regla) {
    return lista.map((m) => {
      const a = analizar(m);
      const cortes = [];
      let pos = 0;
      a.silabas.slice(0, -1).forEach((s) => {
        pos += s.length;
        cortes.push(pos);
      });
      return {
        plantilla: "cortar",
        enunciado: "Toca entre las letras para separar las sílabas.",
        letras: a.palabra,
        cortes: cortes,
        solucion: separar(a) + " (" + a.silabas.length + (a.silabas.length === 1 ? " sílaba)" : " sílabas)"),
        audio: a.palabra,
        regla: regla || "Cada sílaba es un golpe de voz: " + separar(a) + ".",
        pista: "Da una palmada por cada golpe de voz.",
      };
    });
  }

  // Caza: tocar la sílaba tónica. Lista "fan.TAS.ma".
  function cazaTonica(lista) {
    return lista.map((m) => {
      const a = analizar(m);
      const fuerte = a.silabas.map((s, i) => (i === a.tonica ? s.toUpperCase() : s)).join("-");
      return {
        plantilla: "caza",
        enunciado: "Caza la sílaba que suena más fuerte.",
        palabra: a.palabra,
        opciones: a.silabas.slice(),
        correcta: a.tonica,
        solucion: fuerte,
        audio: a.palabra,
        regla: "En «" + a.palabra + "» suena más fuerte «" + a.silabas[a.tonica] + "»: " + fuerte + ".",
        pista: "Di la palabra como si llamaras a alguien de lejos: la sílaba que alargas es la tónica.",
      };
    });
  }

  // Cestas por tipo de acentuación. cestas: ["aguda","llana"...] o
  // ["aguda","no-aguda"].
  function cestasAcento(lista, cestas) {
    const etiquetas = { aguda: "Aguda", llana: "Llana", esdrujula: "Esdrújula", "no-aguda": "No es aguda" };
    return lista.map((m) => {
      const a = analizar(m);
      let tipo = tipoAcento(a);
      if (cestas.indexOf(tipo) === -1 && cestas.indexOf("no-aguda") !== -1) tipo = "no-aguda";
      const fuerte = a.silabas.map((s, i) => (i === a.tonica ? s.toUpperCase() : s)).join("-");
      const desc = { aguda: "la última", llana: "la penúltima", esdrujula: "la antepenúltima" }[tipoAcento(a)];
      return {
        plantilla: "cestas",
        enunciado: "¿En qué cesta va?",
        palabra: a.palabra,
        opciones: cestas.map((c) => etiquetas[c]),
        correcta: cestas.indexOf(tipo),
        solucion: fuerte,
        audio: a.palabra,
        regla: fuerte + ": la sílaba tónica es " + desc + ", así que es " + NOMBRE_TIPO[tipoAcento(a)] + ".",
        pista: "Busca primero la sílaba que suena más fuerte y cuenta desde el final.",
      };
    });
  }

  // Espejo de la tilde: la palabra bien escrita y su reflejo mal escrito.
  function espejoTilde(lista, enunciado) {
    return lista.map((m, i) => {
      const a = analizar(m);
      const bien = a.palabra;
      const mal = formaErronea(a);
      const primeroBien = i % 2 === 0;
      return {
        plantilla: "espejo",
        enunciado: enunciado || "¿Cuál está bien escrita?",
        opciones: primeroBien ? [bien, mal] : [mal, bien],
        correcta: primeroBien ? 0 : 1,
        solucion: bien,
        audio: bien,
        regla: reglaTilde(a),
        pista: "Primero busca la sílaba tónica; después mira en qué letra termina.",
      };
    });
  }

  // Cestas genéricas: grupos { cesta: índice, palabras: [...], regla: fn|texto }
  function cestas(etiquetas, grupos, enunciado, mostrar) {
    const items = [];
    grupos.forEach((g) => {
      g.palabras.forEach((p) => {
        const sol = mostrar ? mostrar(p, g) : p;
        items.push({
          plantilla: "cestas",
          enunciado: enunciado,
          palabra: p,
          opciones: etiquetas.slice(),
          correcta: g.cesta,
          solucion: sol,
          audio: p,
          regla: typeof g.regla === "function" ? g.regla(p) : g.regla,
          pista: g.pista || "",
        });
      });
    });
    return items;
  }

  // ---------- Senda del Unicornio (todo en mayúsculas) ----------

  const VOCAL_BASE = { Á: "A", É: "E", Í: "I", Ó: "O", Ú: "U" };
  const base = (t) => t.replace(/[ÁÉÍÓÚ]/g, (c) => VOCAL_BASE[c]);

  // Palabras "MA.MÁ": sílaba con la letra estudiada → «¿qué sílaba
  // falta?»; y «¿qué palabra es?» con la propia lista de distractores.
  // opciones (fase 4): { vocales: ["A","O","U"], relleno: ["CE"] } para
  // letras que solo van con algunas vocales (CA CO CU, QUE QUI...).
  function ecoLetra(letra, lista, otrasLetras, opciones) {
    const items = [];
    const op = opciones || {};
    const vocales = op.vocales || ["A", "E", "I", "O", "U"];
    const palabras = lista.map((m) => {
      const sil = m.split(".");
      return { sil: sil, palabra: sil.join(""), picto: sil.join("").toLowerCase() };
    });
    palabras.forEach((w, n) => {
      // Solo sílabas directas (consonante + vocal), como en la ficha.
      const idx = w.sil.findIndex((s) => base(s).length === letra.length + 1 && base(s).indexOf(letra) === 0);
      if (idx >= 0 && w.sil.length > 1) {
        const buena = base(w.sil[idx]);
        const vocal = buena.slice(letra.length, letra.length + 1);
        const otras = vocales.filter((v) => v !== vocal).map((v) => letra + v).concat(op.relleno || []);
        const distract = [otras[n % otras.length], otras[(n + 1) % otras.length]];
        const ops = [buena].concat(distract);
        const rot = n % 3;
        const opciones = ops.slice(rot).concat(ops.slice(0, rot));
        items.push({
          plantilla: "eco",
          enunciado: "¿QUÉ SÍLABA FALTA?",
          palabra: w.sil.map((s, i) => (i === idx ? "_" : s)).join(""),
          opciones: opciones,
          correcta: opciones.indexOf(buena),
          solucion: w.palabra,
          audio: w.palabra.toLowerCase(),
          picto: w.picto,
          regla: w.palabra + ": " + w.sil.join(" - ") + ".",
        });
      }
    });
    items.push.apply(items, ecoPalabra(lista));
    if (otrasLetras && otrasLetras.length) {
      palabras.forEach((w, n) => {
        const inicial = base(w.palabra).charAt(0);
        if (inicial !== letra) return;
        const otra = otrasLetras[n % otrasLetras.length];
        const opciones = n % 2 === 0 ? [letra, otra] : [otra, letra];
        items.push({
          plantilla: "eco",
          enunciado: "¿CON QUÉ LETRA EMPIEZA?",
          palabra: "",
          opciones: opciones,
          correcta: opciones.indexOf(letra),
          solucion: w.palabra,
          audio: w.palabra.toLowerCase(),
          picto: w.picto,
          regla: w.palabra + " EMPIEZA POR " + letra + ".",
        });
      });
    }
    return items;
  }

  // «¿Qué palabra es?»: la voz dice la palabra y se elige entre tres.
  function ecoPalabra(lista) {
    const items = [];
    const palabras = lista.map((m) => {
      const sil = m.split(".");
      return { sil: sil, palabra: sil.join(""), picto: sil.join("").toLowerCase() };
    });
    palabras.forEach((w, n) => {
      const d1 = palabras[(n + 1) % palabras.length].palabra;
      const d2 = palabras[(n + 3) % palabras.length].palabra;
      const ops = [w.palabra, d1, d2];
      const rot = (n + 1) % 3;
      const opciones = ops.slice(rot).concat(ops.slice(0, rot));
      items.push({
        plantilla: "eco",
        enunciado: "¿QUÉ PALABRA ES?",
        palabra: "",
        opciones: opciones,
        correcta: opciones.indexOf(w.palabra),
        solucion: w.palabra,
        audio: w.palabra.toLowerCase(),
        picto: w.picto,
        regla: "ES " + w.palabra + ".",
      });
    });
    return items;
  }

  // Vocales: «¿con qué vocal empieza?» con dibujo y voz.
  function ecoVocal(lista) {
    const vocales = ["A", "E", "I", "O", "U"];
    return lista.map((p, n) => {
      const v = base(p.charAt(0));
      const otras = vocales.filter((x) => x !== v);
      const ops = [v, otras[n % 4], otras[(n + 2) % 4]];
      const rot = n % 3;
      const opciones = ops.slice(rot).concat(ops.slice(0, rot));
      return {
        plantilla: "eco",
        enunciado: "¿CON QUÉ VOCAL EMPIEZA?",
        palabra: "",
        opciones: opciones,
        correcta: opciones.indexOf(v),
        solucion: p,
        audio: p.toLowerCase(),
        picto: p.toLowerCase(),
        regla: p + " EMPIEZA POR " + v + ".",
      };
    });
  }

  // Repaso: «¿cuál es igual?» con palabras que se parecen.
  function ecoIgual(grupos) {
    return grupos.map((g, n) => {
      const [modelo, otras] = g;
      const ops = [modelo].concat(otras);
      const rot = n % 3;
      const opciones = ops.slice(rot).concat(ops.slice(0, rot));
      return {
        plantilla: "eco",
        enunciado: "¿CUÁL ES IGUAL?",
        palabra: modelo,
        opciones: opciones,
        correcta: opciones.indexOf(modelo),
        solucion: modelo,
        audio: modelo.toLowerCase(),
        picto: modelo.toLowerCase(),
        regla: "ES IGUAL: " + modelo + ".",
      };
    });
  }

  // ---------- Fase 4: más formas de escribir ítems ----------

  // Pares [bien, mal, regla] para el Espejo (o [bien, mal] con una regla común).
  function espejoPares(pares, enunciado, reglaComun, pista) {
    return pares.map((p, i) => {
      const [bien, mal, regla] = p;
      const primeroBien = i % 2 === 0;
      return {
        plantilla: "espejo",
        enunciado: p[3] || enunciado,
        opciones: primeroBien ? [bien, mal] : [mal, bien],
        correcta: primeroBien ? 0 : 1,
        solucion: bien,
        audio: bien.replace(/\|/g, ""),
        regla: regla || (typeof reglaComun === "function" ? reglaComun(bien) : reglaComun),
        pista: pista || "",
      };
    });
  }

  // Elegir entre opciones escritas a mano: [enunciado, palabra, [opciones], índiceCorrecta, regla].
  // La correcta va en la posición que se diga; aquí se rota para que no
  // quede siempre en el mismo sitio.
  function elegir(plantilla, filas, comun) {
    return filas.map((f, n) => {
      const [enunciado, palabra, opciones, correcta, regla, audio] = f;
      const rot = n % opciones.length;
      const ops = opciones.slice(rot).concat(opciones.slice(0, rot));
      const buena = opciones[correcta];
      return Object.assign(
        {
          plantilla: plantilla,
          enunciado: enunciado,
          palabra: palabra,
          opciones: ops,
          correcta: ops.indexOf(buena),
          solucion: buena,
          audio: audio || palabra || buena,
          regla: regla,
        },
        comun || {}
      );
    });
  }

  // Puente con opciones propias para cada ítem. La palabra lleva «_»
  // donde va la opción buena (o va vacía y se rellena después):
  // hueco("Lo contrario de «hacer»: ¿qué prefijo falta?", "_hacer", "des", ["re", "pre"], regla, n)
  function hueco(enunciado, palabra, buena, otras, regla, n) {
    const ops = [buena].concat(otras);
    const rot = n % ops.length;
    const opciones = ops.slice(rot).concat(ops.slice(0, rot));
    const sol = palabra.replace("_", buena);
    return { plantilla: "puente", enunciado: enunciado, palabra: palabra, opciones: opciones, correcta: opciones.indexOf(buena), solucion: sol, audio: sol, regla: regla };
  }

  // Caza de una palabra dentro de una frase: "La noche es *fría*."
  function cazaPalabra(frases, enunciado, reglaFn) {
    return frases.map((f) => {
      const limpia = f.replace(/\*/g, "");
      const palabras = f.replace(/[.,¡!¿?]/g, "").split(" ");
      const correcta = palabras.findIndex((w) => w.indexOf("*") === 0);
      const objetivo = palabras[correcta].replace(/\*/g, "");
      const opciones = palabras.map((w) => w.replace(/\*/g, ""));
      return {
        plantilla: "caza",
        enunciado: enunciado,
        palabra: limpia,
        etiqueta: "Frase",
        opciones: opciones,
        correcta: correcta,
        solucion: objetivo,
        audio: limpia,
        regla: reglaFn(objetivo, limpia),
      };
    });
  }

  // Escriba (ordenar) con piezas largas (oraciones de una historia,
  // partes de una carta...): listas de piezas en su orden correcto.
  function ordenarPiezas(listas, enunciado, regla) {
    return listas.map((piezas) => ({
      plantilla: "ordenar",
      enunciado: enunciado,
      piezas: piezas.slice(),
      solucion: piezas.join(" "),
      audio: piezas.join(" "),
      regla: regla,
    }));
  }

  // Unicornio: grupos consonánticos (BR/BL, PR/PL...). «¿Qué sílaba
  // falta?» con la sílaba buena, la del otro grupo y la directa sin la
  // segunda consonante (BRA / BLA / BA): justo lo que se confunde.
  function ecoGrupo(grupos, lista) {
    const items = [];
    lista.forEach((m, n) => {
      const sil = m.split(".");
      const palabra = sil.join("");
      const idx = sil.findIndex((s) => grupos.some((g) => base(s).indexOf(g) === 0 && base(s).length === g.length + 1));
      if (idx < 0) return;
      const buena = base(sil[idx]);
      const g = grupos.find((x) => buena.indexOf(x) === 0);
      const vocal = buena.slice(g.length);
      const otro = grupos.find((x) => x !== g && x.charAt(0) === g.charAt(0)) || grupos.find((x) => x !== g);
      const ops = [buena, otro + vocal, g.charAt(0) + vocal];
      const rot = n % 3;
      const opciones = ops.slice(rot).concat(ops.slice(0, rot));
      items.push({
        plantilla: "eco",
        enunciado: "¿QUÉ SÍLABA FALTA?",
        palabra: sil.map((s, i) => (i === idx ? "_" : s)).join(""),
        opciones: opciones,
        correcta: opciones.indexOf(buena),
        solucion: palabra,
        audio: palabra.toLowerCase(),
        picto: palabra.toLowerCase(),
        regla: palabra + ": " + sil.join(" - ") + ".",
      });
    });
    return items.concat(ecoPalabra(lista));
  }

  // Unicornio: sílabas inversas (AL, EN, ES...). Opciones: la buena, la
  // misma al revés (LA) y otra inversa.
  function ecoInversa(lista) {
    const inversas = ["AL", "EN", "ES", "IS", "OS", "UN", "AR", "IN"];
    const items = [];
    lista.forEach((m, n) => {
      const sil = m.split(".");
      const palabra = sil.join("");
      const buena = base(sil[0]);
      const alReves = buena.charAt(1) + buena.charAt(0);
      const otra = inversas.filter((x) => x !== buena)[n % (inversas.length - 1)];
      const ops = [buena, alReves, otra];
      const rot = n % 3;
      const opciones = ops.slice(rot).concat(ops.slice(0, rot));
      items.push({
        plantilla: "eco",
        enunciado: "¿QUÉ SÍLABA FALTA?",
        palabra: "_" + sil.slice(1).join(""),
        opciones: opciones,
        correcta: opciones.indexOf(buena),
        solucion: palabra,
        audio: palabra.toLowerCase(),
        picto: palabra.toLowerCase(),
        regla: palabra + ": " + sil.join(" - ") + ".",
      });
    });
    return items.concat(ecoPalabra(lista));
  }

  // Gran repaso: copias de ítems de las fichas anteriores (con id propio
  // de esta estación). Se toma uno de cada «paso» para cubrir todo.
  function repaso(senda, hastaFicha, cuantos) {
    const todos = [];
    for (let f = 1; f < hastaFicha; f++) if (bancos[senda] && bancos[senda][f]) todos.push(bancos[senda][f].items);
    const items = [];
    let k = 0;
    while (items.length < cuantos && todos.some((l) => l.length > k)) {
      todos.forEach((l) => {
        if (items.length < cuantos && l[k]) {
          const copia = Object.assign({}, l[k]);
          delete copia.id;
          items.push(copia);
        }
      });
      k += 3;
    }
    return items;
  }

  window.LetraniaBanco = {
    espejoPares,
    hueco,
    elegir,
    cazaPalabra,
    ordenarPiezas,
    ecoGrupo,
    ecoInversa,
    repaso,
    ecoPalabra,
    ecoVocal,
    ecoIgual,
    bancos,
    registrar,
    analizar,
    tipoAcento,
    tieneTilde,
    debeLlevarTilde,
    conTildeEnTonica,
    quitarTildes,
    separar,
    puente,
    ordenar,
    cortarPalabras,
    cortarSilabas,
    cazaTonica,
    cestasAcento,
    espejoTilde,
    cestas,
    ecoLetra,
    base,
  };
})();
