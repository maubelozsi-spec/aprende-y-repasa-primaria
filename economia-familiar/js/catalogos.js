// ============================================================
// Economía Familiar 2.0 — catálogos de contenido del juego.
// Todo lo que en la versión de Base44 generaba la IA vive aquí
// como plantillas: perfiles de familia, tarjetas de suerte e
// imprevistos, negocios con estacionalidad, eventos de la
// localidad, retos por tramo, metas de ahorro e insignias.
// Son datos puros: la lógica que los usa está en motor.js.
// ============================================================

// ---------- Perfiles de familia listos para usar ----------
// El docente puede crear familias a mano o repartir estos perfiles.
// Los ingresos/gastos están pensados para 4º-6º de primaria: números
// redondos y realistas sin ser exactos.
export const PERFILES_FAMILIA = [
  {
    nombre: "Familia Sol", emoji: "☀️",
    miembros: [
      { nombre: "Padre", edad: 45, rol: "En desempleo (presta ayuda)", ingresos: 700 },
      { nombre: "Madre", edad: 43, rol: "Cocinera", ingresos: 1350 },
      { nombre: "Hijo", edad: 11, rol: "Estudiante", ingresos: 0 },
      { nombre: "Hija", edad: 7, rol: "Estudiante", ingresos: 0 },
    ],
    mascotas: "",
    gastosFijos: [
      { concepto: "Alquiler", importe: 650 },
      { concepto: "Luz y gas", importe: 130 },
      { concepto: "Agua", importe: 40 },
      { concepto: "Comida", importe: 420 },
      { concepto: "Coche (gasolina y seguro)", importe: 160 },
      { concepto: "Teléfono e internet", importe: 70 },
      { concepto: "Médico", importe: 30 },
    ],
  },
  {
    nombre: "Familia Brisa", emoji: "💨",
    miembros: [
      { nombre: "Padre", edad: 42, rol: "Taxista", ingresos: 1700 },
      { nombre: "Madre", edad: 40, rol: "Dependienta", ingresos: 1150 },
      { nombre: "Hijo", edad: 15, rol: "Estudiante", ingresos: 0 },
    ],
    mascotas: "",
    gastosFijos: [
      { concepto: "Hipoteca", importe: 650 },
      { concepto: "Luz y gas", importe: 140 },
      { concepto: "Agua", importe: 45 },
      { concepto: "Comida", importe: 450 },
      { concepto: "Taxi (gasolina y licencia)", importe: 250 },
      { concepto: "Teléfono e internet", importe: 75 },
      { concepto: "Contribuciones", importe: 90 },
    ],
  },
  {
    nombre: "Familia Eco", emoji: "🌱",
    miembros: [
      { nombre: "Padre", edad: 40, rol: "Repartidor (media jornada)", ingresos: 950 },
      { nombre: "Madre", edad: 39, rol: "Artesana autónoma", ingresos: 830 },
      { nombre: "Hija", edad: 10, rol: "Estudiante", ingresos: 0 },
    ],
    mascotas: "1 gato",
    gastosFijos: [
      { concepto: "Hipoteca", importe: 550 },
      { concepto: "Luz y gas", importe: 100 },
      { concepto: "Agua", importe: 35 },
      { concepto: "Comida", importe: 350 },
      { concepto: "Moto (gasolina y seguro)", importe: 120 },
      { concepto: "Teléfono e internet", importe: 55 },
      { concepto: "Cuota de autónomo", importe: 90 },
    ],
  },
  {
    nombre: "Familia Luna", emoji: "🌙",
    miembros: [
      { nombre: "Madre", edad: 38, rol: "Enfermera (turnos)", ingresos: 1900 },
      { nombre: "Hijo", edad: 12, rol: "Estudiante", ingresos: 0 },
      { nombre: "Hija", edad: 9, rol: "Estudiante", ingresos: 0 },
    ],
    mascotas: "1 perro",
    gastosFijos: [
      { concepto: "Alquiler", importe: 600 },
      { concepto: "Luz y gas", importe: 120 },
      { concepto: "Agua", importe: 40 },
      { concepto: "Comida", importe: 430 },
      { concepto: "Autobús y transporte", importe: 80 },
      { concepto: "Teléfono e internet", importe: 65 },
      { concepto: "Veterinario y pienso", importe: 60 },
    ],
  },
  {
    nombre: "Familia Monte", emoji: "⛰️",
    miembros: [
      { nombre: "Padre", edad: 48, rol: "Agricultor", ingresos: 1250 },
      { nombre: "Madre", edad: 46, rol: "Maestra", ingresos: 1850 },
      { nombre: "Hijo", edad: 14, rol: "Estudiante", ingresos: 0 },
      { nombre: "Hija", edad: 11, rol: "Estudiante", ingresos: 0 },
      { nombre: "Abuela", edad: 74, rol: "Pensionista", ingresos: 800 },
    ],
    mascotas: "2 perros y gallinas",
    gastosFijos: [
      { concepto: "Hipoteca", importe: 700 },
      { concepto: "Luz y gas", importe: 160 },
      { concepto: "Agua", importe: 50 },
      { concepto: "Comida", importe: 520 },
      { concepto: "Furgoneta (gasolina y seguro)", importe: 200 },
      { concepto: "Teléfono e internet", importe: 80 },
      { concepto: "Medicinas de la abuela", importe: 45 },
    ],
  },
  {
    nombre: "Familia Mar", emoji: "🌊",
    miembros: [
      { nombre: "Padre", edad: 41, rol: "Pescador", ingresos: 1400 },
      { nombre: "Padre", edad: 39, rol: "Administrativo", ingresos: 1500 },
      { nombre: "Hija", edad: 10, rol: "Estudiante", ingresos: 0 },
    ],
    mascotas: "",
    gastosFijos: [
      { concepto: "Alquiler", importe: 680 },
      { concepto: "Luz y gas", importe: 125 },
      { concepto: "Agua", importe: 40 },
      { concepto: "Comida", importe: 400 },
      { concepto: "Coche (gasolina y seguro)", importe: 170 },
      { concepto: "Teléfono e internet", importe: 70 },
      { concepto: "Material de pesca", importe: 55 },
    ],
  },
  {
    nombre: "Familia Estrella", emoji: "⭐",
    miembros: [
      { nombre: "Madre", edad: 44, rol: "Conductora de autobús", ingresos: 1600 },
      { nombre: "Padre", edad: 45, rol: "Camarero", ingresos: 1300 },
      { nombre: "Hijo", edad: 13, rol: "Estudiante", ingresos: 0 },
      { nombre: "Hijo", edad: 8, rol: "Estudiante", ingresos: 0 },
      { nombre: "Hija", edad: 5, rol: "Infantil", ingresos: 0 },
    ],
    mascotas: "1 hámster",
    gastosFijos: [
      { concepto: "Hipoteca", importe: 720 },
      { concepto: "Luz y gas", importe: 150 },
      { concepto: "Agua", importe: 50 },
      { concepto: "Comida", importe: 550 },
      { concepto: "Coche (gasolina y seguro)", importe: 180 },
      { concepto: "Teléfono e internet", importe: 75 },
      { concepto: "Comedor escolar", importe: 90 },
    ],
  },
  {
    nombre: "Familia Nube", emoji: "☁️",
    miembros: [
      { nombre: "Madre", edad: 36, rol: "Programadora (teletrabajo)", ingresos: 2100 },
      { nombre: "Hija", edad: 11, rol: "Estudiante", ingresos: 0 },
    ],
    mascotas: "1 gato",
    gastosFijos: [
      { concepto: "Alquiler", importe: 750 },
      { concepto: "Luz y gas", importe: 110 },
      { concepto: "Agua", importe: 35 },
      { concepto: "Comida", importe: 320 },
      { concepto: "Transporte público", importe: 60 },
      { concepto: "Teléfono e internet", importe: 90 },
      { concepto: "Veterinario y pienso", importe: 40 },
    ],
  },
  {
    nombre: "Familia Río", emoji: "🏞️",
    miembros: [
      { nombre: "Padre", edad: 50, rol: "Albañil", ingresos: 1550 },
      { nombre: "Madre", edad: 47, rol: "Limpiadora (media jornada)", ingresos: 750 },
      { nombre: "Hijo", edad: 16, rol: "Estudiante de FP", ingresos: 0 },
      { nombre: "Hija", edad: 12, rol: "Estudiante", ingresos: 0 },
    ],
    mascotas: "",
    gastosFijos: [
      { concepto: "Alquiler", importe: 620 },
      { concepto: "Luz y gas", importe: 135 },
      { concepto: "Agua", importe: 45 },
      { concepto: "Comida", importe: 480 },
      { concepto: "Furgoneta de trabajo", importe: 190 },
      { concepto: "Teléfono e internet", importe: 70 },
      { concepto: "Material escolar y ropa", importe: 50 },
    ],
  },
  {
    nombre: "Familia Faro", emoji: "🗼",
    miembros: [
      { nombre: "Abuelo", edad: 70, rol: "Pensionista", ingresos: 1100 },
      { nombre: "Abuela", edad: 68, rol: "Pensionista", ingresos: 950 },
      { nombre: "Nieta", edad: 11, rol: "Estudiante", ingresos: 0 },
    ],
    mascotas: "1 canario",
    gastosFijos: [
      { concepto: "Comunidad y casa propia", importe: 180 },
      { concepto: "Luz y gas", importe: 120 },
      { concepto: "Agua", importe: 40 },
      { concepto: "Comida", importe: 380 },
      { concepto: "Transporte y taxi", importe: 70 },
      { concepto: "Teléfono e internet", importe: 60 },
      { concepto: "Farmacia", importe: 85 },
    ],
  },
];

// ---------- Tarjetas de suerte (positivas) ----------
// "importe" puede ser fijo o un rango [min, max]; motor.js elige.
export const TARJETAS_SUERTE = [
  { texto: "¡Os toca un premio pequeño en la lotería del barrio!", emoji: "🎟️", importe: [60, 150] },
  { texto: "Devolución de la declaración de la renta.", emoji: "🧾", importe: [120, 260] },
  { texto: "Vendéis por internet cosas que ya no usabais.", emoji: "📦", importe: [40, 110] },
  { texto: "Un vecino os paga por cuidar su casa en vacaciones.", emoji: "🏠", importe: [50, 90] },
  { texto: "Horas extra en el trabajo este mes.", emoji: "⏰", importe: [100, 220] },
  { texto: "Regalo de un familiar por un cumpleaños.", emoji: "🎁", importe: [50, 120] },
  { texto: "El ayuntamiento devuelve una tasa cobrada de más.", emoji: "🏛️", importe: [30, 80] },
  { texto: "Ganáis un concurso de recetas del barrio.", emoji: "🥘", importe: [60, 100] },
  { texto: "Encontráis una oferta increíble y ahorráis en la compra.", emoji: "🛒", importe: [40, 90] },
  { texto: "Os pagan por participar en una encuesta de consumo.", emoji: "📋", importe: [25, 60] },
  { texto: "Un trabajo pequeño el fin de semana (pintar, mudanza…).", emoji: "🪜", importe: [80, 160] },
  { texto: "La compañía de la luz os aplica un descuento por buen cliente.", emoji: "💡", importe: [30, 70] },
];

// ---------- Tarjetas de imprevisto (negativas) ----------
export const TARJETAS_IMPREVISTO = [
  { texto: "Se estropea la lavadora y hay que repararla.", emoji: "🧺", importe: [-180, -90] },
  { texto: "Avería del coche: al taller.", emoji: "🚗", importe: [-280, -120] },
  { texto: "Visita al dentista no cubierta.", emoji: "🦷", importe: [-150, -60] },
  { texto: "Se rompe el móvil de la familia.", emoji: "📱", importe: [-200, -80] },
  { texto: "Multa de aparcamiento.", emoji: "🅿️", importe: [-100, -40] },
  { texto: "Fuga de agua: factura del fontanero.", emoji: "🔧", importe: [-160, -70] },
  { texto: "El frigorífico deja de enfriar: reparación urgente.", emoji: "🧊", importe: [-220, -100] },
  { texto: "Gafas nuevas para un miembro de la familia.", emoji: "👓", importe: [-140, -70] },
  { texto: "La mascota se pone enferma: veterinario.", emoji: "🐾", importe: [-120, -50], requiereMascota: true },
  { texto: "Sube el recibo de la comunidad por una derrama.", emoji: "🏢", importe: [-130, -60] },
  { texto: "Hay que comprar un abrigo y botas de invierno.", emoji: "🧥", importe: [-110, -50] },
  { texto: "Excursión escolar no prevista.", emoji: "🚌", importe: [-60, -25] },
  { texto: "Se pierde una llave y hay que llamar al cerrajero.", emoji: "🔑", importe: [-90, -45] },
  { texto: "El ordenador necesita una reparación.", emoji: "💻", importe: [-170, -80] },
];

// ---------- Negocios (catálogo con estacionalidad) ----------
// exito: probabilidad (0-100) de que un mes vaya bien.
// beneficioBase: ganancia de un mes "normal" si va bien.
// temporada: multiplicador por mes (1-12). Sin entrada = 1.
export const NEGOCIOS = [
  { nombre: "Heladería en la playa", emoji: "🍦", coste: 20000, exito: 55, beneficioBase: 3000, descripcion: "Máquinas de helado, neveras y permisos. Depende muchísimo del buen tiempo: el verano lo es todo.", temporada: { 6: 1.8, 7: 2.2, 8: 2.2, 9: 1.3, 12: 0.4, 1: 0.4, 2: 0.5 } },
  { nombre: "Cafetería del barrio", emoji: "☕", coste: 25000, exito: 45, beneficioBase: 2200, descripcion: "Local, cafetera profesional y licencias. Mucha competencia, pero con clientes fieles da ingresos estables.", temporada: { 8: 0.7 } },
  { nombre: "Churrería", emoji: "🥐", coste: 12000, exito: 60, beneficioBase: 1600, descripcion: "Puesto de churros con freidora y carrito. Funciona de maravilla en otoño e invierno y en la Feria.", temporada: { 10: 1.4, 11: 1.5, 12: 1.6, 1: 1.6, 2: 1.4, 7: 0.6, 8: 0.8 } },
  { nombre: "Tienda de tecnología", emoji: "📱", coste: 60000, exito: 45, beneficioBase: 8000, descripcion: "Local céntrico, mucho dinero en productos caros. Riesgo alto: si acierta gana mucho, si falla pierde mucho.", temporada: { 11: 1.5, 12: 1.9, 1: 1.3 } },
  { nombre: "Frutería ecológica", emoji: "🍎", coste: 15000, exito: 60, beneficioBase: 1700, descripcion: "Fruta y verdura de proximidad. Márgenes pequeños pero clientela constante todo el año.", temporada: {} },
  { nombre: "Academia de repaso", emoji: "📚", coste: 10000, exito: 65, beneficioBase: 1800, descripcion: "Clases de apoyo escolar. Muy segura durante el curso; en verano casi no hay alumnos.", temporada: { 9: 1.3, 5: 1.4, 6: 1.2, 7: 0.3, 8: 0.3 } },
  { nombre: "Food truck de hamburguesas", emoji: "🍔", coste: 30000, exito: 50, beneficioBase: 3200, descripcion: "Camioneta equipada y permisos ambulantes. Triunfa en ferias, conciertos y verano.", temporada: { 5: 1.3, 6: 1.4, 7: 1.5, 8: 1.6, 1: 0.6, 2: 0.6 } },
  { nombre: "Peluquería", emoji: "💇", coste: 18000, exito: 55, beneficioBase: 2000, descripcion: "Local pequeño y sillones. Clientela fiel, picos antes de ferias, bodas y Navidad.", temporada: { 5: 1.2, 12: 1.4 } },
  { nombre: "Tienda de deportes", emoji: "⚽", coste: 35000, exito: 50, beneficioBase: 3500, descripcion: "Ropa y material deportivo. Vuelta al cole y Navidad son sus mejores momentos.", temporada: { 9: 1.5, 12: 1.6, 1: 1.2 } },
  { nombre: "Floristería", emoji: "💐", coste: 14000, exito: 55, beneficioBase: 1500, descripcion: "Flores frescas y plantas. Picos enormes en primavera, San Valentín y Todos los Santos.", temporada: { 2: 1.5, 4: 1.4, 5: 1.5, 10: 1.3, 11: 1.4 } },
  { nombre: "Alquiler de bicis y patinetes", emoji: "🚲", coste: 22000, exito: 50, beneficioBase: 2600, descripcion: "Flota de bicis para turistas y vecinos. Verano fortísimo, invierno flojo.", temporada: { 6: 1.6, 7: 1.9, 8: 1.9, 9: 1.3, 12: 0.5, 1: 0.4, 2: 0.5 } },
  { nombre: "Panadería artesana", emoji: "🥖", coste: 28000, exito: 60, beneficioBase: 2400, descripcion: "Horno de leña y obrador. El pan se vende todos los días del año; roscones y dulces disparan diciembre.", temporada: { 12: 1.5, 1: 1.2 } },
  { nombre: "Tienda de videojuegos", emoji: "🎮", coste: 40000, exito: 45, beneficioBase: 4500, descripcion: "Consolas, juegos y torneos. Muy dependiente de lanzamientos y de la campaña de Navidad.", temporada: { 11: 1.4, 12: 2.0, 1: 1.3, 6: 0.8 } },
  { nombre: "Chiringuito de playa", emoji: "🏖️", coste: 26000, exito: 50, beneficioBase: 3800, descripcion: "Solo abre bien de mayo a septiembre, pero esos meses pueden ser espectaculares.", temporada: { 5: 1.3, 6: 1.7, 7: 2.1, 8: 2.1, 9: 1.4, 10: 0.4, 11: 0.2, 12: 0.2, 1: 0.2, 2: 0.2, 3: 0.3, 4: 0.6 } },
  { nombre: "Clínica veterinaria", emoji: "🐶", coste: 50000, exito: 60, beneficioBase: 5000, descripcion: "Equipamiento médico caro, pero las mascotas necesitan cuidados todo el año.", temporada: {} },
  { nombre: "Tienda de disfraces", emoji: "🎭", coste: 16000, exito: 45, beneficioBase: 2200, descripcion: "Casi todo se vende en Carnaval y Halloween; el resto del año, muy tranquilo.", temporada: { 2: 2.2, 10: 1.9, 1: 1.2, 4: 0.6, 5: 0.6, 6: 0.5, 7: 0.5, 8: 0.5 } },
  { nombre: "Gimnasio de barrio", emoji: "🏋️", coste: 45000, exito: 55, beneficioBase: 4200, descripcion: "Máquinas y monitores. Enero (propósitos de año nuevo) y septiembre son sus grandes meses.", temporada: { 1: 1.6, 9: 1.4, 8: 0.6 } },
  { nombre: "Puesto del mercado de abastos", emoji: "🐟", coste: 9000, exito: 65, beneficioBase: 1400, descripcion: "Pequeño puesto de pescado y conservas. Poca inversión y clientela de toda la vida.", temporada: { 12: 1.5 } },
  { nombre: "Escuela de surf", emoji: "🏄", coste: 20000, exito: 45, beneficioBase: 3000, descripcion: "Tablas, neoprenos y monitores titulados. Muy estacional y depende del tiempo.", temporada: { 6: 1.6, 7: 1.9, 8: 1.9, 9: 1.3, 11: 0.4, 12: 0.3, 1: 0.3, 2: 0.4 } },
  { nombre: "Papelería y copistería", emoji: "✏️", coste: 13000, exito: 60, beneficioBase: 1500, descripcion: "Material escolar, fotocopias y regalos pequeños. Septiembre es su mes de oro.", temporada: { 9: 1.9, 6: 1.2, 8: 0.7 } },
  { nombre: "Taller de reparación de bicis", emoji: "🔧", coste: 11000, exito: 60, beneficioBase: 1500, descripcion: "Herramientas y recambios. Trabajo constante, más en primavera y verano.", temporada: { 4: 1.2, 5: 1.3, 6: 1.3, 7: 1.2 } },
  { nombre: "Obrador de tartas por encargo", emoji: "🎂", coste: 8000, exito: 55, beneficioBase: 1300, descripcion: "Se trabaja desde casa con horno profesional. Cumpleaños todo el año, comuniones en primavera.", temporada: { 4: 1.3, 5: 1.5, 12: 1.3 } },
  { nombre: "Tienda de souvenirs", emoji: "🧲", coste: 17000, exito: 50, beneficioBase: 2000, descripcion: "Recuerdos para turistas. Va como un tiro en verano y Semana Santa.", temporada: { 4: 1.4, 6: 1.5, 7: 1.8, 8: 1.8, 1: 0.5, 2: 0.5, 11: 0.5 } },
  { nombre: "Guardería de mascotas", emoji: "🐕‍🦺", coste: 19000, exito: 55, beneficioBase: 2100, descripcion: "Cuidar perros y gatos cuando sus familias viajan: agosto, Navidad y puentes a tope.", temporada: { 7: 1.4, 8: 1.7, 12: 1.5, 4: 1.2 } },
  { nombre: "Lavadero de coches ecológico", emoji: "🚿", coste: 24000, exito: 55, beneficioBase: 2300, descripcion: "Lavado con poca agua. Constante todo el año, algo más flojo con lluvias.", temporada: { 11: 0.8, 12: 0.8 } },
  { nombre: "Librería con cuentacuentos", emoji: "📖", coste: 21000, exito: 45, beneficioBase: 1900, descripcion: "Libros y actividades infantiles. Navidad, Feria del Libro y Sant Jordi disparan las ventas.", temporada: { 4: 1.5, 12: 1.7, 8: 0.6 } },
  { nombre: "Puesto de palomitas y algodón", emoji: "🍿", coste: 6000, exito: 60, beneficioBase: 1000, descripcion: "Carrito ambulante barato de montar. Vive de ferias, parques y cine de verano.", temporada: { 6: 1.4, 7: 1.5, 8: 1.7, 1: 0.5, 2: 0.6 } },
  { nombre: "Estudio de fotografía", emoji: "📷", coste: 27000, exito: 45, beneficioBase: 2800, descripcion: "Cámaras y platós. Bodas y comuniones en primavera-verano, orlas en junio.", temporada: { 5: 1.5, 6: 1.6, 9: 1.2, 1: 0.6, 2: 0.6 } },
  { nombre: "Tienda de plantas de interior", emoji: "🪴", coste: 12000, exito: 50, beneficioBase: 1400, descripcion: "Plantas, macetas y talleres. Primavera fuerte y regalos en Navidad.", temporada: { 3: 1.3, 4: 1.4, 5: 1.4, 12: 1.3 } },
  { nombre: "Escape room familiar", emoji: "🗝️", coste: 38000, exito: 40, beneficioBase: 4800, descripcion: "Salas tematizadas. Inversión grande y riesgo alto, pero si se llena da mucho dinero.", temporada: { 12: 1.3, 1: 1.2, 7: 0.8, 8: 0.8 } },
];

// Estrategias comerciales mensuales para el negocio.
export const ESTRATEGIAS_NEGOCIO = [
  { id: "mantener", nombre: "Mantener el negocio", emoji: "🙂", coste: 0, multiplicador: 1, riesgo: 0, descripcion: "Seguir como hasta ahora, sin gastos ni riesgos extra." },
  { id: "publicidad", nombre: "Campaña de publicidad", emoji: "📣", coste: 300, multiplicador: 1.4, riesgo: 10, descripcion: "Pagar anuncios y carteles. Si el mes va bien, se gana bastante más." },
  { id: "calidad", nombre: "Invertir en calidad", emoji: "✨", coste: 200, multiplicador: 1.2, riesgo: -5, descripcion: "Mejores productos y formación. Cuesta un poco y sube las ventas de forma segura." },
  { id: "recortar", nombre: "Recortar gastos", emoji: "✂️", coste: 0, multiplicador: 0.8, riesgo: -10, descripcion: "Mes prudente: se gana menos, pero es más difícil que salga mal." },
  { id: "oferta", nombre: "Gran oferta especial", emoji: "🏷️", coste: 150, multiplicador: 1.6, riesgo: 20, descripcion: "Bajar precios para atraer a mucha gente. Puede salir genial… o regular." },
];

// ---------- Eventos de la localidad (plantilla inicial por partida) ----------
// El docente puede editarlos, borrarlos o añadir los suyos.
// tipo: "gasto_fijo" (obligatorio), "gasto_opcional" (la familia decide),
//       "ingreso_fijo", "ingreso_opcional".
export const EVENTOS_PLANTILLA = [
  { titulo: "Rebajas de enero", emoji: "🛍️", meses: [1], tipo: "gasto_opcional", importeMin: 40, importeMax: 150, probabilidad: 100, descripcion: "Ropa y cosas de casa a mitad de precio. ¿Compramos ahora lo que necesitaremos?" },
  { titulo: "Carnaval", emoji: "🎭", meses: [2], tipo: "gasto_opcional", importeMin: 20, importeMax: 80, probabilidad: 100, descripcion: "Disfraces y salida en pasacalles." },
  { titulo: "Semana Santa", emoji: "🕯️", meses: [4], tipo: "gasto_opcional", importeMin: 50, importeMax: 200, probabilidad: 100, descripcion: "Días de vacaciones: ¿escapada o planes en casa?" },
  { titulo: "Feria del pueblo", emoji: "🎡", meses: [8], tipo: "gasto_opcional", importeMin: 60, importeMax: 220, probabilidad: 100, descripcion: "Atracciones, casetas y cena en la feria. La semana más divertida del año… y de las más caras." },
  { titulo: "Vacaciones de verano", emoji: "🏖️", meses: [7], tipo: "gasto_opcional", importeMin: 150, importeMax: 500, probabilidad: 100, descripcion: "¿Viaje, camping o playa cerca de casa? Cada opción tiene su precio." },
  { titulo: "Vuelta al cole", emoji: "🎒", meses: [9], tipo: "gasto_fijo", importeMin: 90, importeMax: 180, probabilidad: 100, descripcion: "Libros, material y ropa nueva. No se puede evitar." },
  { titulo: "Halloween y castañada", emoji: "🎃", meses: [10], tipo: "gasto_opcional", importeMin: 15, importeMax: 50, probabilidad: 100, descripcion: "Disfraces, castañas y dulces." },
  { titulo: "Puente de diciembre", emoji: "🌉", meses: [12], tipo: "gasto_opcional", importeMin: 60, importeMax: 200, probabilidad: 100, descripcion: "Días libres antes de Navidad: ¿escapada o descanso en casa?" },
  { titulo: "Navidad y Reyes Magos", emoji: "🎄", meses: [12], tipo: "gasto_fijo", importeMin: 120, importeMax: 300, probabilidad: 100, descripcion: "Regalos, comidas familiares y roscón. La cuesta de enero empieza aquí." },
  { titulo: "Subida de la luz en invierno", emoji: "🔌", meses: [1, 2], tipo: "gasto_fijo", importeMin: 30, importeMax: 70, probabilidad: 70, descripcion: "La calefacción se nota en la factura." },
  { titulo: "Aire acondicionado en verano", emoji: "🌡️", meses: [7, 8], tipo: "gasto_fijo", importeMin: 25, importeMax: 60, probabilidad: 70, descripcion: "Ola de calor: la factura de la luz sube." },
  { titulo: "Mercadillo solidario del cole", emoji: "🧸", meses: [5], tipo: "ingreso_opcional", importeMin: 20, importeMax: 60, probabilidad: 100, descripcion: "Vender juguetes y libros usados: un dinerillo extra y se ayuda a otros." },
  { titulo: "Cosecha y trabajos de temporada", emoji: "🍇", meses: [9, 10], tipo: "ingreso_opcional", importeMin: 80, importeMax: 200, probabilidad: 80, descripcion: "Echar unas horas en la vendimia o la recogida. Cansado, pero se paga." },
  { titulo: "San Valentín", emoji: "💘", meses: [2], tipo: "gasto_opcional", importeMin: 15, importeMax: 60, probabilidad: 100, descripcion: "Detalle o cena especial." },
  { titulo: "Día de la madre / del padre", emoji: "💐", meses: [3, 5], tipo: "gasto_opcional", importeMin: 15, importeMax: 50, probabilidad: 100, descripcion: "Un regalo para celebrarlo." },
];

// ---------- Retos por tramo (se asignan al crear la familia) ----------
// Un reto por tramo de meses (1-4, 5-8, 9-12), como en la versión 1.
// "recurrente": el efecto se aplica todos los meses del tramo.
export const RETOS_TRAMO = {
  facil: [
    { descripcion: "Una tía os ayuda con los gastos", importe: 100, recurrente: true },
    { descripcion: "Beca de comedor concedida", importe: 80, recurrente: true },
    { descripcion: "Encontráis trabajo extra de fin de semana", importe: 150, recurrente: false },
    { descripcion: "Premio del sorteo del AMPA", importe: 200, recurrente: false },
    { descripcion: "Vendéis la bici antigua", importe: 120, recurrente: false },
    { descripcion: "Ayuda del ayuntamiento para material escolar", importe: 90, recurrente: false },
  ],
  media: [
    { descripcion: "Sube el precio de la gasolina", importe: -60, recurrente: true },
    { descripcion: "Clases de refuerzo para un hijo", importe: -50, recurrente: true },
    { descripcion: "Avería del coche", importe: -250, recurrente: false },
    { descripcion: "Un familiar encuentra trabajo a media jornada", importe: 450, recurrente: false },
    { descripcion: "Actividad extraescolar nueva", importe: -35, recurrente: true },
    { descripcion: "Arreglo de la persiana y pintura", importe: -180, recurrente: false },
  ],
  dificil: [
    { descripcion: "Reducción de jornada en el trabajo", importe: -200, recurrente: true },
    { descripcion: "Sube el alquiler", importe: -90, recurrente: true },
    { descripcion: "Tratamiento médico no cubierto", importe: -300, recurrente: false },
    { descripcion: "Se estropea la caldera", importe: -400, recurrente: false },
    { descripcion: "Subida general de la cesta de la compra", importe: -70, recurrente: true },
    { descripcion: "Hay que ayudar a un familiar en apuros", importe: -150, recurrente: false },
  ],
};

// ---------- Consejos de ahorro en los gastos fijos ----------
// Cada mes la familia recibe 3 consejos aplicables a SUS gastos y
// elige uno: el ahorro se aplica ese mes y aprenden que hay
// estrategias reales para gastar menos. "aplicaA" son palabras que
// deben aparecer en el concepto del gasto; "pct" es el % de ahorro
// sobre ese gasto (con tope "max" en €).
export const CONSEJOS_AHORRO = [
  { id: "led", emoji: "💡", titulo: "Caza-vampiros eléctricos", texto: "Apagad las luces al salir, desenchufad los aparatos en espera (la tele y la consola gastan aunque estén apagadas) y cambiad a bombillas LED.", aplicaA: ["luz", "gas", "electricidad"], pct: 15, max: 40 },
  { id: "termostato", emoji: "🌡️", titulo: "Un grado menos", texto: "Bajar la calefacción solo 1 grado (o subir 1 el aire) ahorra hasta un 7% por grado. Un jersey en casa es gratis.", aplicaA: ["luz", "gas", "calefacción"], pct: 10, max: 30 },
  { id: "ducha", emoji: "🚿", titulo: "Duchas de canción", texto: "Duchas de lo que dura una canción (5 minutos) y grifo cerrado mientras os laváis los dientes o enjabonáis los platos.", aplicaA: ["agua"], pct: 15, max: 15 },
  { id: "menu", emoji: "📝", titulo: "Menú semanal y lista de la compra", texto: "Planificad el menú de la semana, haced lista antes de comprar y no vayáis al súper con hambre: se compra solo lo necesario y no se tira comida.", aplicaA: ["comida", "compra", "alimentación"], pct: 12, max: 60 },
  { id: "marcas", emoji: "🏷️", titulo: "Marca blanca y ofertas", texto: "Comparad precios por kilo, aprovechad ofertas de temporada y probad marcas blancas: muchas se fabrican en las mismas fábricas que las caras.", aplicaA: ["comida", "compra", "alimentación"], pct: 10, max: 50 },
  { id: "tupper", emoji: "🍱", titulo: "Táper al rescate", texto: "Cocinad de más el domingo y congelad raciones: los táperes evitan caer en comida rápida o precocinados caros entre semana.", aplicaA: ["comida", "compra", "alimentación"], pct: 8, max: 40 },
  { id: "tarifa", emoji: "📞", titulo: "Revisar la tarifa", texto: "Llamad a vuestra compañía de teléfono e internet y preguntad por ofertas: muchas familias pagan servicios que no usan. Comparar es gratis.", aplicaA: ["teléfono", "internet", "móvil"], pct: 20, max: 25 },
  { id: "compartir-coche", emoji: "🚗", titulo: "Compartir coche", texto: "Poneos de acuerdo con otras familias para llevar a los niños al cole o al entreno por turnos: la mitad de viajes, la mitad de gasolina.", aplicaA: ["coche", "gasolina", "taxi", "furgoneta"], pct: 15, max: 40 },
  { id: "bici", emoji: "🚲", titulo: "Piernas y pedales", texto: "Para trayectos cortos, andando o en bici: cero gasolina, cero atascos y encima cuenta como deporte.", aplicaA: ["coche", "gasolina", "moto", "transporte", "autobús"], pct: 10, max: 30 },
  { id: "eco-conduccion", emoji: "🐢", titulo: "Conducción eficiente", texto: "Sin acelerones ni frenazos, marchas largas y ruedas bien hinchadas: el mismo viaje puede gastar un 15% menos de combustible.", aplicaA: ["coche", "gasolina", "furgoneta", "moto", "taxi"], pct: 12, max: 35 },
  { id: "bono", emoji: "🎫", titulo: "Bono de transporte", texto: "Si usáis mucho el autobús, el bono mensual o la tarjeta joven sale mucho más barato que pagar billete a billete.", aplicaA: ["transporte", "autobús", "bus"], pct: 15, max: 20 },
  { id: "genericos", emoji: "💊", titulo: "Medicamentos genéricos", texto: "Preguntad en la farmacia por el genérico: mismo principio activo, mismo efecto, bastante más barato.", aplicaA: ["médico", "farmacia", "medicinas"], pct: 15, max: 20 },
  { id: "pienso", emoji: "🐾", titulo: "Pienso a lo grande", texto: "Comprar el saco grande de pienso y comparar veterinarios para las vacunas ahorra un buen pico al año.", aplicaA: ["veterinario", "pienso", "mascota"], pct: 12, max: 20 },
  { id: "presupuesto", emoji: "📒", titulo: "Presupuesto familiar", texto: "Apuntad TODOS los gastos de la semana en una libreta o una app. Solo con verlos escritos, las familias gastan menos: se descubren fugas de dinero.", aplicaA: ["*"], pctTotal: 2, max: 45 },
  { id: "segunda-mano", emoji: "🔁", titulo: "Segunda mano primero", texto: "Antes de comprar algo nuevo (ropa, libros, deporte), mirad en tiendas de segunda mano o intercambiad con otras familias del cole.", aplicaA: ["*"], pctTotal: 1.5, max: 35 },
  { id: "comparar", emoji: "🔍", titulo: "Comparar antes de pagar", texto: "Para cualquier recibo (seguro, luz, internet) hay comparadores gratis. Dedicar 20 minutos a comparar puede ahorrar todo el año.", aplicaA: ["*"], pctTotal: 2, max: 40 },
];

// ---------- Ruleta del mes: oportunidades e imprevistos ----------
// Sustituye a las tarjetas: cada mes se monta una ruleta nueva con
// estos elementos. Importes pequeños porque el dado puede obligar a
// girar varias veces.
export const RULETA_OPORTUNIDADES = [
  { texto: "Venta de segunda mano", emoji: "📦", descripcion: "Vendéis por internet ropa y juguetes que ya no usabais. ¡Lo que no usas, a otro le sirve!", importe: [30, 90] },
  { texto: "Horas extra", emoji: "⏰", descripcion: "Un fin de semana de trabajo extra bien pagado.", importe: [60, 120] },
  { texto: "Cuidar la mascota del vecino", emoji: "🐕", descripcion: "El vecino se va de viaje y os paga por cuidar a su perro.", importe: [20, 50] },
  { texto: "Premio del barrio", emoji: "🏆", descripcion: "¡Ganáis el concurso de tortillas de las fiestas!", importe: [40, 100] },
  { texto: "Devolución de Hacienda", emoji: "🧾", descripcion: "Os devuelven dinero de los impuestos: pagasteis de más y ahora vuelve.", importe: [50, 150] },
  { texto: "Clases particulares", emoji: "📚", descripcion: "Alguien de la familia da clases de repaso a un vecino.", importe: [40, 80] },
  { texto: "Encuesta pagada", emoji: "📋", descripcion: "Participáis en un estudio de consumo y os lo pagan.", importe: [15, 40] },
  { texto: "Chatarra y reciclaje", emoji: "♻️", descripcion: "Lleváis chatarra y aparatos viejos al punto de reciclaje que paga por ellos.", importe: [20, 45] },
  { texto: "Mercadillo casero", emoji: "🧺", descripcion: "Montáis un puestecillo de limonada y bizcochos en la fiesta del barrio.", importe: [25, 60] },
  { texto: "Apaño bien pagado", emoji: "🔧", descripcion: "Ayudáis a un vecino con una mudanza y os lo agradece con dinero.", importe: [30, 70] },
];

export const RULETA_IMPREVISTOS = [
  { texto: "Pinchazo de rueda", emoji: "🛞", descripcion: "Una rueda pinchada: parche o rueda nueva, no queda otra.", importe: [-70, -30] },
  { texto: "Adiós, microondas", emoji: "🍲", descripcion: "El microondas dice basta. Toca repararlo o comprar otro.", importe: [-90, -50] },
  { texto: "Multa por despiste", emoji: "🅿️", descripcion: "Aparcasteis donde no tocaba. La grúa no perdona.", importe: [-100, -40] },
  { texto: "Visita al dentista", emoji: "🦷", descripcion: "Un empaste que no puede esperar.", importe: [-120, -60] },
  { texto: "Cumpleaños sorpresa", emoji: "🎁", descripcion: "Invitación de última hora: regalo y merienda.", importe: [-50, -20] },
  { texto: "Mochila perdida", emoji: "🎒", descripcion: "Se pierde la mochila con el estuche dentro. Hay que reponerlo todo.", importe: [-60, -30] },
  { texto: "Factura sorpresa de la luz", emoji: "💡", descripcion: "Este mes la factura llega más alta de lo esperado.", importe: [-90, -40] },
  { texto: "A la farmacia", emoji: "💊", descripcion: "Un catarro familiar: jarabes, pañuelos y termómetro nuevo.", importe: [-50, -20] },
  { texto: "Cristal roto", emoji: "🪟", descripcion: "El balonazo entró por la ventana del vecino. Hay que pagar el cristal.", importe: [-100, -50] },
  { texto: "El móvil al agua", emoji: "📱", descripcion: "El móvil se cae donde no debía. Reparación de pantalla.", importe: [-150, -60] },
];

export const RULETA_RESPIRO = { texto: "¡Mes tranquilo!", emoji: "😮‍💨", descripcion: "Esta vez no pasa nada: respirad hondo.", importe: [0, 0] };

// ---------- Metas de ahorro familiares ----------
export const METAS_AHORRO = [
  { id: "vacaciones", titulo: "Vacaciones en familia", emoji: "✈️", importe: 1500, descripcion: "Ahorrar para una semana de vacaciones todos juntos." },
  { id: "reforma", titulo: "Reformar la cocina", emoji: "🔨", importe: 3000, descripcion: "Cambiar los muebles y electrodomésticos viejos." },
  { id: "ordenador", titulo: "Ordenador nuevo", emoji: "💻", importe: 800, descripcion: "Un ordenador para estudiar y trabajar." },
  { id: "bicicletas", titulo: "Bicis para toda la familia", emoji: "🚴", importe: 600, descripcion: "Una bici para cada miembro y salir juntos los domingos." },
  { id: "colchon", titulo: "Colchón de emergencias", emoji: "🛟", importe: 2000, descripcion: "Tener guardado el equivalente a un mes de gastos por si acaso." },
  { id: "instrumento", titulo: "Un instrumento musical", emoji: "🎸", importe: 500, descripcion: "Esa guitarra o ese teclado que tanta ilusión hace." },
  { id: "mascota", titulo: "Adoptar una mascota", emoji: "🐶", importe: 400, descripcion: "Adopción, vacunas y todo lo que necesita para empezar." },
];

// ---------- Insignias ----------
export const INSIGNIAS = [
  { id: "ahorradora", nombre: "Familia ahorradora", emoji: "🐷", descripcion: "Ahorrar dinero tres meses seguidos." },
  { id: "solidaria", nombre: "Familia solidaria", emoji: "❤️", descripcion: "Ayudar a otras familias con dos préstamos solidarios." },
  { id: "emprendedora", nombre: "Familia emprendedora", emoji: "🚀", descripcion: "Mantener un negocio abierto tres meses." },
  { id: "remontada", nombre: "La gran remontada", emoji: "💪", descripcion: "Salir del plan de rescate con las cuentas saneadas." },
  { id: "previsora", nombre: "Familia previsora", emoji: "🏦", descripcion: "Abrir una cuenta de ahorro en el banco." },
  { id: "equilibrada", nombre: "Familia equilibrada", emoji: "⚖️", descripcion: "Salud emocional de 70 o más durante tres meses." },
  { id: "meta", nombre: "¡Meta cumplida!", emoji: "🏆", descripcion: "Alcanzar la meta de ahorro de la familia." },
  { id: "docemeses", nombre: "Un año entero", emoji: "🎉", descripcion: "Completar los doce meses del juego." },
];

// ---------- Constantes del juego ----------
export const CONFIG_JUEGO = {
  ahorroInicial: 500,
  interesCuentaAhorro: 2, // % mensual
  interesPrestamoPct: 10, // interés total del préstamo bancario (se devuelve el 110%)
  mesLimitePrestamo: 12, // todo préstamo se devuelve antes de acabar el año
  mesesPrestamoSolidario: 3,
  inflacionMensual: 0.5, // % de subida de los gastos fijos al mes (si está activada)
  pagaExtraPorcentaje: 50, // % de los ingresos que llega de paga extra en junio y diciembre
  mesesPagaExtra: [6, 12],
  mesesPlanRescate: 3,
  ocioMaxRescate: 5, // % máximo de ocio durante el plan de rescate
  // Probabilidad de que la tarjeta del mes sea de suerte según dificultad.
  probSuerte: { facil: 60, media: 45, dificil: 35 },
  // Escala de importes de tarjetas y retos según dificultad.
  escalaImportes: { facil: 0.8, media: 1, dificil: 1.25 },
};

export const NOMBRES_MES = [
  "", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
