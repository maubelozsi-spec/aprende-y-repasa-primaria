// ============================================================
// Roles de clase: catálogo de iconos, colores y roles de partida.
//
// Los iconos son SVG propios (viewBox 48×48) que se pintan con
// currentColor sobre el círculo oscuro de la tarjeta: el tono claro
// del rol para la figura y el fondo del círculo para los huecos
// (clase "h" = relleno, "hl" = trazo). Así cualquier icono combina
// con cualquier color sin tener que dibujarlo dos veces.
// ============================================================

const ROLES_ICONOS = {
  puerta: {
    nombre: "Puerta",
    svg: '<path d="M11 44V21a13 13 0 0 1 26 0v23z"/><path class="h" d="M16 22h7v9h-7zM25 22h7v9h-7zM16 33h7v8h-7zM25 33h7v8h-7z"/><circle class="h" cx="24" cy="14" r="2.6"/>',
  },
  cortina: {
    nombre: "Cortina",
    svg: '<rect x="5" y="6" width="38" height="4.5" rx="2.2"/><path d="M8 11h13c0 10-2 21 2 31H10c-3-9-2-21-2-31z"/><path d="M40 11H27c0 10 2 21-2 31h13c3-9 2-21 2-31z"/>',
  },
  fotocopias: {
    nombre: "Fotocopias",
    svg: '<path d="M9 5h18l8 8v23H9z" opacity=".55"/><path d="M14 11h18l8 8v24H14z"/><path class="h" d="M19 25h16v2.6H19zM19 30.5h16v2.6H19zM19 36h11v2.6H19z"/>',
  },
  cesta: {
    nombre: "Cesta",
    svg: '<path class="ln" d="M15 20l6-10M33 20l-6-10"/><path d="M5 19h38l-4.5 21a3 3 0 0 1-3 2.4h-23a3 3 0 0 1-3-2.4z"/><path class="h" d="M13 25h22v2.4H13zM14 31.5h20v2.4H14z"/>',
  },
  taper: {
    nombre: "Táper",
    svg: '<rect x="7" y="18" width="34" height="23" rx="4"/><rect x="4.5" y="12" width="39" height="8" rx="3"/><path class="h" d="M10 20h3.5v5H10zM34.5 20H38v5h-3.5z"/>',
  },
  ventana: {
    nombre: "Ventana",
    svg: '<path d="M9 43V21a15 15 0 0 1 30 0v22z"/><path class="h" d="M22.5 7h3v36h-3zM9 25h30v3H9z"/>',
  },
  escoba: {
    nombre: "Escoba",
    svg: '<path d="M31 3.5l4.5 2.2-9.3 18.6-4.5-2.2z"/><path d="M18 21.5l12.5 6.2-3 6.4C25 39 19 43.5 9.5 44c3.3-4.6 4-11 8.5-22.5z"/><path class="hl" d="M15.5 37l5-7.5M20 40l5-7.5"/>',
  },
  portapapeles: {
    nombre: "Revisar",
    svg: '<rect x="9" y="8.5" width="30" height="36" rx="3"/><rect x="16.5" y="4.5" width="15" height="8" rx="2"/><path class="hl" d="M16 28l6 6 11-12" style="stroke-width:4"/>',
  },
  abaco: {
    nombre: "Ábaco",
    svg: '<rect x="5" y="5" width="38" height="38" rx="4"/><rect class="h" x="9.5" y="9.5" width="29" height="29"/><path d="M9.5 15h29v2h-29zM9.5 23h29v2h-29zM9.5 31h29v2h-29z"/><circle cx="14" cy="16" r="3"/><circle cx="20" cy="16" r="3"/><circle cx="33" cy="16" r="3"/><circle cx="14" cy="24" r="3"/><circle cx="27" cy="24" r="3"/><circle cx="33" cy="24" r="3"/><circle cx="14" cy="32" r="3"/><circle cx="20" cy="32" r="3"/><circle cx="26" cy="32" r="3"/>',
  },
  viento: {
    nombre: "Aire",
    svg: '<path class="ln" d="M5 17h22a5.5 5.5 0 1 0-5.5-5.5"/><path class="ln" d="M5 25h30a5.5 5.5 0 1 1-5.5 5.5"/><path class="ln" d="M5 33h13a4.5 4.5 0 1 1-4.5 4.5"/>',
  },
  antorcha: {
    nombre: "Antorcha",
    svg: '<path d="M24 3.5c5.5 5 7.5 9.5 4.3 13.6-1.1 1.4-2.8 2.2-4.3 2.2s-3.2-.8-4.3-2.2C16.5 13 18.5 8.5 24 3.5z"/><path d="M16.5 20.5h15l-2.2 5.5H18.7z"/><path d="M19.5 27h9l-2.2 17h-4.6z"/><path class="h" d="M20 31.5h8v2.2h-8zM20.6 36.5h6.8v2.2h-6.8z"/>',
  },
  bombilla: {
    nombre: "Bombilla",
    svg: '<path d="M24 4.5a12.5 12.5 0 0 0-7.4 22.6c1.6 1.2 2.2 3 2.2 5h10.4c0-2 .6-3.8 2.2-5A12.5 12.5 0 0 0 24 4.5z"/><rect x="18.8" y="34.5" width="10.4" height="3.2" rx="1.2"/><rect x="20" y="39.5" width="8" height="3.4" rx="1.7"/>',
  },
  libro: {
    nombre: "Libro",
    svg: '<path d="M4.5 10.5c7-2 13.5-1 18.5 3v28c-5-4-11.5-5-18.5-3z"/><path d="M43.5 10.5c-7-2-13.5-1-18.5 3v28c5-4 11.5-5 18.5-3z"/>',
  },
  planta: {
    nombre: "Planta",
    svg: '<path class="ln" d="M24 28V15"/><path d="M23 18.5c-8.5 0-12.5-5-12.5-11.5 7.5 0 12.5 4.3 12.5 11.5z"/><path d="M25 23c0-7.5 4.5-12.5 12.5-12.5 0 7.5-5 12.5-12.5 12.5z"/><rect x="11.5" y="27" width="25" height="5" rx="1.5"/><path d="M14 32h20l-3 12H17z"/>',
  },
  pizarra: {
    nombre: "Pizarra",
    svg: '<path class="ln" d="M14 33l-4 10M34 33l4 10"/><rect x="4.5" y="6.5" width="39" height="27" rx="2"/><rect class="h" x="8.5" y="10.5" width="31" height="19"/><path class="ln" style="stroke-width:2.6" d="M13 24c3-6 5.5 2 8.5-4s5.5 2 9-3"/>',
  },
  reloj: {
    nombre: "Reloj",
    svg: '<rect x="20" y="3" width="8" height="5" rx="1.5"/><circle cx="24" cy="26" r="17"/><path class="hl" style="stroke-width:3.4" d="M24 16v10l7 5"/>',
  },
  megafono: {
    nombre: "Portavoz",
    svg: '<path d="M7 18.5h9L34 8v31L16 28.5H7z"/><path d="M16 28.5l3 12.5h6.5l-3-12.5z"/><path class="ln" d="M38.5 17.5c3.4 3.4 3.4 9.6 0 13"/>',
  },
  lapiz: {
    nombre: "Material",
    svg: '<path d="M32.5 4.5l11 11-24.5 24.5-11-11z"/><path d="M8 29l11 11-14 4z"/><path class="h" d="M29.5 7.5l11 11-2.2 2.2-11-11z"/>',
  },
  papelera: {
    nombre: "Reciclaje",
    svg: '<rect x="8" y="9" width="32" height="5" rx="1.5"/><rect x="18.5" y="4.5" width="11" height="5.5" rx="1"/><path d="M11 16h26l-2.5 28h-21z"/><path class="hl" d="M18.5 21v17.5M24 21v17.5M29.5 21v17.5"/>',
  },
  ordenador: {
    nombre: "Tablets",
    svg: '<rect x="5" y="7" width="38" height="25" rx="2"/><rect class="h" x="9" y="11" width="30" height="17"/><path d="M19 32h10l2 7.5H17z"/><rect x="12.5" y="39" width="23" height="3.4" rx="1.7"/>',
  },
  balon: {
    nombre: "Balón",
    svg: '<circle cx="24" cy="24" r="19"/><path class="h" d="M24 15.5l7.6 5.5-2.9 8.9h-9.4L16.4 21z"/><path class="hl" d="M24 5.5v10M31.6 21l9.3-3.2M28.7 29.9l5.6 8.2M19.3 29.9l-5.6 8.2M16.4 21l-9.3-3.2"/>',
  },
  calendario: {
    nombre: "Calendario",
    svg: '<rect x="6" y="9.5" width="36" height="33.5" rx="3"/><rect class="h" x="10" y="19" width="28" height="20"/><rect x="13.5" y="4.5" width="4.5" height="9.5" rx="1.6"/><rect x="30" y="4.5" width="4.5" height="9.5" rx="1.6"/><path d="M13.5 22h5v4.5h-5zM21.5 22h5v4.5h-5zM29.5 22h5v4.5h-5zM13.5 30.5h5V35h-5zM21.5 30.5h5V35h-5z"/>',
  },
  sobre: {
    nombre: "Recados",
    svg: '<rect x="4.5" y="10.5" width="39" height="28" rx="3"/><path class="hl" style="stroke-width:3" d="M7 14l17 13.5L41 14"/>',
  },
  botiquin: {
    nombre: "Botiquín",
    svg: '<path d="M17.5 13V9a2.5 2.5 0 0 1 2.5-2.5h8A2.5 2.5 0 0 1 30.5 9v4h-3.4v-3h-6.2v3z"/><rect x="5" y="12.5" width="38" height="29" rx="3.5"/><path class="h" d="M20.8 18.5h6.4v5.4h5.4v6.4h-5.4v5.4h-6.4v-5.4h-5.4v-6.4h5.4z"/>',
  },
  estrella: {
    nombre: "Estrella",
    svg: '<path d="M24 4.5l5.9 12.4 13.6 1.7-10 9.4 2.6 13.5L24 34.9l-12.1 6.6 2.6-13.5-10-9.4 13.6-1.7z"/>',
  },
  personas: {
    nombre: "Mediación",
    svg: '<circle cx="17" cy="14.5" r="6.5"/><circle cx="33" cy="17" r="5.2"/><path d="M4 41c0-8.5 5.5-14.5 13-14.5S30 32.5 30 41z"/><path d="M28 27.5c1.4-1.3 3.4-2.1 5.3-2.1 6.3 0 10.7 5.3 10.7 13.6V41H32c0-5.2-1.4-9.6-4-13.5z"/>',
  },
  musica: {
    nombre: "Música",
    svg: '<path d="M16 10l22-5.5v6L16 16z"/><rect x="16" y="10" width="4" height="25"/><rect x="34" y="4.5" width="4" height="25"/><ellipse cx="13" cy="36" rx="7.5" ry="5.8"/><ellipse cx="31" cy="30.5" rx="7.5" ry="5.8"/>',
  },
  llave: {
    nombre: "Llave",
    svg: '<circle cx="14" cy="24" r="9.5"/><circle class="h" cx="14" cy="24" r="3.6"/><path d="M21.5 21.5H43v5h-3v5.5h-5.2v-5.5h-3v4.2h-4.4v-4.2h-5.9z"/>',
  },
};

// Cada color tiene el tono oscuro de la banda del nombre y del aro, y
// el tono claro con el que se pinta el icono dentro del círculo.
const ROLES_COLORES = [
  { id: "granate", nombre: "Granate", banda: "#6e2a3a", claro: "#f2b8c0" },
  { id: "ciruela", nombre: "Ciruela", banda: "#5a3557", claro: "#e9bfe5" },
  { id: "marino", nombre: "Azul marino", banda: "#2e4760", claro: "#b9d5f0" },
  { id: "pino", nombre: "Verde pino", banda: "#2f5b4c", claro: "#9fdcc8" },
  { id: "oliva", nombre: "Oliva", banda: "#4d5531", claro: "#d0dd9c" },
  { id: "cuero", nombre: "Cuero", banda: "#5b3f2f", claro: "#f6c99a" },
  { id: "pizarra", nombre: "Pizarra", banda: "#3e3f47", claro: "#cfcbe6" },
  { id: "petroleo", nombre: "Petróleo", banda: "#2b5660", claro: "#a6d9e1" },
  { id: "teja", nombre: "Teja", banda: "#8a3f22", claro: "#f8bfa0" },
  { id: "ocre", nombre: "Ocre", banda: "#7a5617", claro: "#f3d78c" },
];

// Los roles que se usan en clase (tarjetas de la foto). "plazas" es
// cuántos alumnos lo ejercen a la vez; se cambia en la pestaña Roles.
const ROLES_POR_DEFECTO = [
  { id: "puerta", latin: "Ianitor", nombre: "Puerta", descripcion: "Abre y cierra la puerta y organiza la fila al salir", icono: "puerta", color: "pizarra", plazas: 1 },
  { id: "cortina", latin: "Velarium", nombre: "Cortina", descripcion: "La sube por la mañana y la baja si molesta el sol", icono: "cortina", color: "ciruela", plazas: 1 },
  { id: "fotocopias", latin: "Librarius", nombre: "Fotocopias", descripcion: "Recoge las fotocopias y las reparte a la clase", icono: "fotocopias", color: "cuero", plazas: 1 },
  { id: "tapers", latin: "Cellarius", nombre: "Tápers del desayuno", descripcion: "Reparte y recoge los tápers y comprueba que no falta ninguno", icono: "cesta", color: "granate", plazas: 1 },
  { id: "ventanas", latin: "Custos fenestrae", nombre: "Ventanas", descripcion: "Abre las ventanas al entrar y las cierra al salir", icono: "ventana", color: "marino", plazas: 2 },
  { id: "limpieza", latin: "Aedilis", nombre: "Limpieza y orden", descripcion: "Revisa que el suelo esté limpio y las sillas en su sitio", icono: "escoba", color: "pino", plazas: 1 },
  { id: "revisar-tareas", latin: "Corrector", nombre: "Revisar tareas", descripcion: "Comprueba quién ha hecho la tarea y avisa al maestro", icono: "portapapeles", color: "oliva", plazas: 2 },
  { id: "puntos", latin: "Quaestor", nombre: "Puntos de recompensa", descripcion: "Apunta los puntos del día y guarda las tarjetas", icono: "abaco", color: "ocre", plazas: 1 },
  { id: "aire", latin: "Custos venti", nombre: "Aire acondicionado", descripcion: "Lo enciende y lo apaga cuando lo indica el maestro", icono: "viento", color: "petroleo", plazas: 1 },
  { id: "luces", latin: "Lucernarius", nombre: "Luces", descripcion: "Las enciende al entrar y las apaga al salir", icono: "antorcha", color: "teja", plazas: 1 },
];

window.ROLES_CATALOGO = { iconos: ROLES_ICONOS, colores: ROLES_COLORES, porDefecto: ROLES_POR_DEFECTO };
