// ============================================================
// Novela Colectiva — motor de continuidad.
//
// Es la parte que "le da sentido al texto" sin necesidad de IA ni
// de gastar un céntimo: compara lo que acabas de escribir con las
// fichas de los personajes y con lo que ya había escrito antes, y
// avisa de los saltos más gordos.
//
// Importante: NUNCA reescribe ni impide publicar. Solo avisa, y
// quien escribe decide. Si el docente activa la IA opcional, esa
// revisión se hace además con un modelo de verdad (ver ia.js), pero
// la regla es la misma: propone, no cambia.
// ============================================================


const CONECTORES = [
  "de pronto", "de repente", "al día siguiente", "mientras tanto", "entonces",
  "después", "más tarde", "aquella noche", "por la mañana", "sin embargo",
  "por eso", "así que", "cuando", "mientras", "al llegar", "en ese momento",
  "poco después", "esa misma tarde", "al cabo de un rato", "de camino",
];

const MARCAS_PASADO = /\b\w+(ó|aron|ieron|aba|abas|aban|ía|ían|iste|imos)\b|\b(fue|era|eran|estaba|estaban|tenía|tenían|hubo|había|dijo|vio|hizo|puso|quiso|supo|vino|salió|entró|llegó|miró)\b/gi;
const MARCAS_PRESENTE = /\b(es|son|está|están|va|van|dice|dicen|tiene|tienen|hace|hacen|puede|pueden|viene|vienen|mira|miran|sale|salen|entra|entran|llega|llegan)\b/gi;
const MARCAS_PRIMERA = /\b(yo|mí|conmigo|mi|mis)\b/gi;

function cuenta(texto, re) {
  re.lastIndex = 0;
  return (String(texto || "").match(re) || []).length;
}

// Devuelve una lista de avisos {clase, mensaje, consejo}.
export function revisarContinuidad(textoNuevo, contexto) {
  const avisos = [];
  const fichas = contexto.fichas || [];
  const anteriores = contexto.fragmentos || [];
  const texto = String(textoNuevo || "");
  const textoBajo = texto.toLowerCase();
  const previo = anteriores.slice(-6).map((f) => f.texto).join("\n");
  const ultimo = anteriores.length ? anteriores[anteriores.length - 1].texto : "";

  // 1. Personajes que ya no deberían aparecer
  for (const ficha of fichas) {
    if (ficha.tipo !== "personaje") continue;
    const estado = ficha.estadoNarrativo || "en la historia";
    if (estado === "en la historia") continue;
    const re = new RegExp("\\b" + escapaRe(ficha.nombre) + "\\b", "i");
    if (re.test(texto)) {
      avisos.push({
        clase: "personaje",
        mensaje: `En la ficha de ${ficha.nombre} pone que ${estado}, y vuelve a aparecer en tu parte.`,
        consejo: "Si vuelve, explica cómo; si es un recuerdo o un fantasma, dilo. Si te habías equivocado, cambia su ficha.",
      });
    }
  }

  // 2. Cambio de lugar sin contarlo
  const lugaresFicha = fichas.filter((f) => f.tipo === "lugar");
  const lugarAnterior = ultimoLugar(ultimo, lugaresFicha);
  const lugarNuevo = ultimoLugar(texto, lugaresFicha);
  if (lugarAnterior && lugarNuevo && lugarAnterior !== lugarNuevo) {
    const hayViaje = /\b(fue|fueron|llegó|llegaron|salió|salieron|viajó|viajaron|corrió|corrieron|entró|entraron|volvió|volvieron|marchó|marcharon|cruzó|cruzaron|camino|camina|caminaron)\b/i.test(texto);
    if (!hayViaje) {
      avisos.push({
        clase: "lugar",
        mensaje: `La parte anterior pasaba en ${lugarAnterior} y la tuya pasa en ${lugarNuevo}.`,
        consejo: "Cuenta en una frase cómo han llegado hasta allí, o el lector se perderá.",
      });
    }
  }

  // 3. Cambio de tiempo verbal
  if (previo.length > 200) {
    const pasadoPrevio = cuenta(previo, MARCAS_PASADO);
    const presentePrevio = cuenta(previo, MARCAS_PRESENTE);
    const pasadoNuevo = cuenta(texto, MARCAS_PASADO);
    const presenteNuevo = cuenta(texto, MARCAS_PRESENTE);
    if (pasadoPrevio > presentePrevio * 1.5 && presenteNuevo > pasadoNuevo && presenteNuevo >= 3) {
      avisos.push({
        clase: "tiempo",
        mensaje: "La novela se venía contando en pasado (fue, dijo, llegó) y tu parte está en presente.",
        consejo: "Pasa tus verbos al pasado para que suene igual que el resto.",
      });
    }
    if (presentePrevio > pasadoPrevio * 1.5 && pasadoNuevo > presenteNuevo && pasadoNuevo >= 3) {
      avisos.push({
        clase: "tiempo",
        mensaje: "La novela se venía contando en presente y tu parte está en pasado.",
        consejo: "Pon los verbos en presente para no romper el ritmo.",
      });
    }
  }

  // 4. Cambio de narrador
  if (previo.length > 200) {
    const primeraPrevio = cuenta(previo, MARCAS_PRIMERA);
    const primeraNuevo = cuenta(texto, MARCAS_PRIMERA);
    const dialogo = /["«—]/.test(texto);
    if (primeraPrevio === 0 && primeraNuevo >= 2 && !dialogo) {
      avisos.push({
        clase: "narrador",
        mensaje: "El resto de la novela está contada desde fuera (él, ella, ellos) y tú escribes en primera persona (yo).",
        consejo: "Cámbialo a tercera persona, o ponlo entre comillas si es alguien que habla.",
      });
    }
  }

  // 5. Enlace con lo anterior
  if (anteriores.length > 0) {
    const empieza = textoBajo.trimStart().slice(0, 40);
    const tieneConector = CONECTORES.some((c) => empieza.startsWith(c));
    if (!tieneConector && texto.length > 80) {
      avisos.push({
        clase: "enlace",
        mensaje: "Tu parte empieza sin enlazar con lo anterior.",
        consejo: "Prueba a empezar con: " + CONECTORES.slice(0, 6).join(", ") + "…",
        leve: true,
      });
    }
    // mismo comienzo que la parte anterior
    const primeraPalabraNueva = textoBajo.trim().split(/\s+/)[0];
    const primeraPalabraVieja = String(ultimo).toLowerCase().trim().split(/\s+/)[0];
    if (primeraPalabraNueva && primeraPalabraNueva === primeraPalabraVieja) {
      avisos.push({
        clase: "enlace",
        mensaje: `La parte anterior también empezaba por «${primeraPalabraVieja}».`,
        consejo: "Cambia el principio para que no suene repetitivo.",
        leve: true,
      });
    }
  }

  // 6. Personajes nuevos de golpe: más de dos nombres nuevos a la vez
  const nuevos = (contexto.propiosNuevos || []).length;
  if (nuevos >= 3) {
    avisos.push({
      clase: "personaje",
      mensaje: `Metes ${nuevos} nombres nuevos de una vez.`,
      consejo: "Es mucho para tan poco texto: quizá sea mejor presentar uno o dos y dejar los demás para tu siguiente turno.",
      leve: true,
    });
  }

  // 7. Sin diálogo nunca
  if (previo.length > 600 && !/["«—]/.test(previo) && !/["«—]/.test(texto)) {
    avisos.push({
      clase: "estilo",
      mensaje: "Llevamos muchas líneas sin que hable nadie.",
      consejo: "Un diálogo corto anima mucho la novela: —¿Y ahora qué hacemos? —preguntó…",
      leve: true,
    });
  }

  return avisos;
}

function ultimoLugar(texto, lugares) {
  let mejor = null;
  let pos = -1;
  for (const l of lugares) {
    const re = new RegExp("\\b" + escapaRe(l.nombre) + "\\b", "gi");
    let m;
    while ((m = re.exec(String(texto || ""))) !== null) {
      if (m.index > pos) { pos = m.index; mejor = l.nombre; }
    }
  }
  return mejor;
}

function escapaRe(t) {
  return String(t || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
