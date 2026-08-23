// ============================================================
// Novela Colectiva — filtro de seguridad antes de publicar.
//
// Dos cosas que con menores no se pueden dejar al azar:
//   · insultos y palabras muy gruesas: se avisa y no se publica
//     hasta que se cambien (el docente lo ve en su panel);
//   · datos personales de verdad (teléfonos, correos, direcciones):
//     una novela de clase acaba imprimiéndose y enseñándose fuera,
//     así que no deben aparecer.
//
// La lista es corta a propósito: no se trata de censurar el
// vocabulario de una novela de aventuras (ahí caben monstruos,
// peleas y sustos), sino de frenar lo que no debe salir del aula.
// ============================================================

const GRUESAS = [
  "gilipollas", "cabron", "cabrón", "puta", "puto", "putos", "putas", "joder",
  "jodido", "mierda", "polla", "coño", "hostia", "hostias", "capullo",
  "subnormal", "retrasado", "maricon", "maricón", "zorra", "follar", "pollas",
  "imbecil", "imbécil", "estupido", "estúpido", "idiota", "tonto del culo",
];

const PATRONES_DATOS = [
  { re: /\b[6-9]\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}\b/, que: "un número de teléfono" },
  { re: /\b[\w.+-]+@[\w-]+\.[a-z]{2,}\b/i, que: "una dirección de correo" },
  { re: /\b(calle|avenida|plaza|c\/)\s+[A-ZÁÉÍÓÚÑ][\w áéíóúñ]{3,}\s*,?\s*\d+/i, que: "una dirección de casa" },
  { re: /\b\d{8}[A-Za-z]\b/, que: "un DNI" },
];

export function revisarSeguridad(texto) {
  const problemas = [];
  const bajo = " " + String(texto || "").toLowerCase().replace(/[.,;:!?¡¿"«»()]/g, " ") + " ";

  for (const palabra of GRUESAS) {
    if (bajo.includes(" " + palabra + " ")) {
      problemas.push({
        grave: true,
        mensaje: "Hay una palabra malsonante («" + palabra + "»). Cámbiala: esta novela la va a leer toda la clase y las familias.",
      });
      break;
    }
  }

  for (const p of PATRONES_DATOS) {
    if (p.re.test(texto)) {
      problemas.push({
        grave: true,
        mensaje: "Parece que has escrito " + p.que + " de verdad. En una novela que se va a publicar no pueden aparecer datos reales: invéntalos.",
      });
    }
  }

  if (/[A-ZÁÉÍÓÚÑ]{6,}/.test(String(texto || "").replace(/\s/g, ""))) {
    problemas.push({
      grave: false,
      mensaje: "Estás escribiendo en mayúsculas. En un libro las mayúsculas se leen como si gritaras.",
    });
  }

  return problemas;
}
