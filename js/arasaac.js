// ============================================================
// Cliente ligero para la API pública de ARASAAC (pictogramas).
//
// Los pictogramas son propiedad del Gobierno de Aragón, creados por
// Sergio Palao para ARASAAC (https://arasaac.org) y se distribuyen
// bajo licencia Creative Commons BY-NC-SA: uso no comercial, citando
// la autoría y compartiendo igual. Encaja con una web docente sin
// ánimo de lucro; toda página que use este módulo debe mostrar la
// atribución (ver ACS_ARASAAC_ATRIBUCION más abajo).
//
// Aquí no se guarda ningún id de pictograma a mano: cada ficha pide
// un pictograma por palabra clave (p. ej. "gato") y este módulo
// resuelve el id en el navegador de quien la usa, contra la API de
// búsqueda, con caché en localStorage para no repetir la búsqueda
// cada vez. Si la API no responde (sin conexión, servicio caído...)
// se devuelve null y quien llama debe mostrar una alternativa
// (recuadro con la palabra) en vez de dejar una imagen rota.
// ============================================================

const ARASAAC_SEARCH_URL = "https://api.arasaac.org/api/pictograms/es/search/";
const ARASAAC_IMG_URL = "https://api.arasaac.org/api/pictograms/";
const ARASAAC_CACHE_KEY = "ar_arasaac_cache_v1";

const ACS_ARASAAC_ATRIBUCION =
  "Pictogramas de ARASAAC (Gobierno de Aragón, autor: Sergio Palao) · arasaac.org · Licencia CC BY-NC-SA";

function arasaacLeerCache() {
  try {
    return JSON.parse(localStorage.getItem(ARASAAC_CACHE_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function arasaacGuardarCache(cache) {
  try {
    localStorage.setItem(ARASAAC_CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    // localStorage lleno o bloqueado (modo privado...): seguimos sin
    // caché, solo se pierde velocidad, no funcionalidad.
  }
}

// Quita solo los acentos agudos del español (evitamos depender de
// rangos Unicode de marcas combinadas, más frágiles de escribir/leer).
function arasaacNormalizar(texto) {
  const mapa = {
    "á": "a",
    "é": "e",
    "í": "i",
    "ó": "o",
    "ú": "u",
    "ü": "u",
  };
  let resultado = String(texto).toLowerCase().trim();
  Object.keys(mapa).forEach((acentuada) => {
    resultado = resultado.split(acentuada).join(mapa[acentuada]);
  });
  return resultado;
}

function arasaacElegirMejorResultado(resultados, palabra) {
  if (!resultados || !resultados.length) return null;
  const objetivo = arasaacNormalizar(palabra);
  const exacto = resultados.find((r) =>
    (r.keywords || []).some((k) => arasaacNormalizar(k.keyword) === objetivo)
  );
  return exacto || resultados[0];
}

// Devuelve el id numérico de pictograma para una palabra, o null si
// no se ha encontrado o ha fallado la petición. Usa caché.
async function arasaacBuscarId(palabra) {
  const cache = arasaacLeerCache();
  const clave = arasaacNormalizar(palabra);
  if (clave in cache) return cache[clave];

  try {
    const res = await fetch(ARASAAC_SEARCH_URL + encodeURIComponent(palabra));
    if (!res.ok) throw new Error("HTTP " + res.status);
    const datos = await res.json();
    const elegido = arasaacElegirMejorResultado(datos, palabra);
    const id = elegido ? elegido._id : null;
    cache[clave] = id;
    arasaacGuardarCache(cache);
    return id;
  } catch (e) {
    return null;
  }
}

// URL de la imagen dinámica de un pictograma ya resuelto.
// color=false -> solo contorno en blanco y negro, pensado para
// imprimir con poca tinta o para colorear (se usa en la ficha para
// imprimir); color=true -> versión a todo color (se usa en pantalla).
function arasaacUrlImagen(id, { color = true } = {}) {
  return `${ARASAAC_IMG_URL}${id}?color=${color ? "true" : "false"}`;
}

// Crea un <img> para una palabra clave y lo resuelve de forma
// asíncrona. Mientras se busca el pictograma muestra un marcador de
// carga; si no se encuentra o falla, sustituye la imagen por un
// recuadro con la propia palabra en vez de dejar un icono roto.
function arasaacCrearImagen(palabra, { color = true, alt } = {}) {
  const wrap = document.createElement("span");
  wrap.className = "acs-pic acs-pic-cargando";

  const img = document.createElement("img");
  img.alt = alt || palabra;
  img.loading = "lazy";
  wrap.appendChild(img);

  arasaacBuscarId(palabra).then((id) => {
    wrap.classList.remove("acs-pic-cargando");
    if (!id) {
      arasaacMostrarAlternativa(wrap, palabra);
      return;
    }
    img.src = arasaacUrlImagen(id, { color });
    img.onerror = () => arasaacMostrarAlternativa(wrap, palabra);
  });

  return wrap;
}

function arasaacMostrarAlternativa(wrap, palabra) {
  wrap.classList.add("acs-pic-alternativa");
  wrap.innerHTML = "";
  const span = document.createElement("span");
  span.className = "acs-pic-alternativa-texto";
  span.textContent = palabra;
  wrap.appendChild(span);
}
