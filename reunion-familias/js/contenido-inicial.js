// ============================================================
// Contenido inicial de la reunión de familias — curso 2026/2027, 5º.
// Estructura calcada de la presentación Genially del curso 2025/2026
// (6º C) y adaptada a 5º. Lo marcado con [POR CONFIRMAR] son datos
// que cambian cada curso y se retocan desde el modo edición.
//
// Este contenido solo se usa como base: en cuanto se guarda algo
// desde la web, manda lo que hay en Firestore. El botón "Restaurar
// contenido original" de Configuración vuelve a cargar esto.
//
// Tipos de bloque:
//   h         → subtítulo de tiza (azul)
//   p         → párrafo
//   ul        → lista de puntos
//   destacado → caja con marco de tiza
//   cols      → dos columnas (cols: [html, html])
//   tabla     → tabla (html con <table>)
//   img       → imagen (src + cap); las añade el docente al editar
// ============================================================

window.CONTENIDO_INICIAL = {
  app: {
    curso: "2026/2027",
    grupo: "5º [POR CONFIRMAR grupo]",
    tutor: "Miguel Ángel Úbeda López",
    centro: "CEIP San Indalecio · La Cañada (Almería)",
    tema: "pizarra-negra",
    fondoColor: null,
    fondoImagen: null,
    fondoVelo: 0.45,
    secciones: [
      { id: "presentacion",   titulo: "Presentación",              visible: true },
      { id: "calendario",     titulo: "Calendario escolar",        visible: true },
      { id: "horario",        titulo: "Horario",                   visible: true },
      { id: "equipo",         titulo: "Equipo docente",            visible: true },
      { id: "normas-centro",  titulo: "Normas del centro",         visible: true },
      { id: "normas-clase",   titulo: "Normas de clase",           visible: true },
      { id: "comportamiento", titulo: "Normas de comportamiento",  visible: true },
      { id: "grupo",          titulo: "Evaluación inicial y grupo", visible: true },
      { id: "criterios",      titulo: "Criterios de evaluación",   visible: true },
      { id: "familias",       titulo: "Colaboración familiar",     visible: true },
      { id: "delegado",       titulo: "Delegado/a de familias",    visible: true },
      { id: "planes",         titulo: "Planes y proyectos",        visible: true },
      { id: "bilinguismo",    titulo: "Bilingüismo",               visible: true },
      { id: "ecoescuela",     titulo: "Ecoescuela y huerto",       visible: true },
      { id: "salud",          titulo: "Creciendo en Salud",        visible: true },
      { id: "igualdad",       titulo: "Igualdad",                  visible: true },
      { id: "biblioteca",     titulo: "Biblioteca",                visible: true },
      { id: "digital",        titulo: "Entorno digital",           visible: true },
      { id: "tutorias",       titulo: "Tutorías",                  visible: true },
      { id: "extraescolares", titulo: "Extraescolares",            visible: true },
      { id: "viaje",          titulo: "Viaje fin de curso",        visible: true },
      { id: "contacto",       titulo: "Contacto y despedida",      visible: true },
    ],
  },

  secciones: {
    presentacion: {
      bloques: [
        { t: "h", html: "Me presento" },
        { t: "p", html: "Mi nombre es <b>Miguel Ángel Úbeda</b> y seré el tutor del grupo durante este curso." },
        { t: "p", html: "En esta aula imparto las asignaturas de <span class=\"por-confirmar\">[POR CONFIRMAR: Lengua, Matemáticas, Ciudadanía y Plástica]</span>." },
        { t: "p", html: "<span class=\"por-confirmar\">[POR CONFIRMAR: otras asignaturas o grupos en los que imparto docencia y programas que coordino, p. ej. Programa STEAM]</span>" },
      ],
    },

    calendario: {
      bloques: [
        { t: "h", html: "Calendario escolar 2026/2027" },
        { t: "ul", html: "<ul><li><b>Primer trimestre:</b> <span class=\"por-confirmar\">[POR CONFIRMAR: del 10 de septiembre al 22 de diciembre]</span>. Sesión de la 1ª evaluación: <span class=\"por-confirmar\">[fecha]</span>.</li><li><b>Segundo trimestre:</b> <span class=\"por-confirmar\">[POR CONFIRMAR: del 7 de enero al 19 de marzo]</span>. Sesión de la 2ª evaluación: <span class=\"por-confirmar\">[fecha]</span>.</li><li><b>Tercer trimestre:</b> <span class=\"por-confirmar\">[POR CONFIRMAR: del 5 de abril al 22 de junio]</span>. Sesión de la 3ª evaluación: <span class=\"por-confirmar\">[fecha]</span>.</li></ul>" },
        { t: "destacado", html: "Los boletines de notas se entregarán a través del <b>Punto de Recogida de iPasen</b>." },
        { t: "p", html: "<span class=\"por-confirmar\">[Sugerencia: añadir aquí una imagen del calendario escolar oficial de la provincia con el botón «Añadir bloque → Imagen»]</span>" },
      ],
    },

    horario: {
      bloques: [
        { t: "h", html: "Horario del grupo" },
        { t: "tabla", html: "<table><thead><tr><th>Hora</th><th>Lunes</th><th>Martes</th><th>Miércoles</th><th>Jueves</th><th>Viernes</th></tr></thead><tbody><tr><td>9:00-9:45</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td></tr><tr><td>9:45-10:30</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td></tr><tr><td>10:30-11:30</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td></tr><tr><td>11:30-12:00</td><td colspan=\"5\">RECREO</td></tr><tr><td>12:00-13:00</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td></tr><tr><td>13:00-14:00</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td></tr></tbody></table>" },
        { t: "p", html: "<span class=\"por-confirmar\">[POR CONFIRMAR: rellenar el horario definitivo de 5º para 2026/2027 pinchando en cada casilla, o sustituir la tabla por una foto del horario]</span>" },
        { t: "h", html: "Novedades" },
        { t: "ul", html: "<ul><li>½ hora de <b>lectura diaria</b>.</li><li>2 medias horas de <b>cálculo</b> semanal.</li><li>½ hora de <b>resolución de problemas</b> 3 días a la semana.</li><li><span class=\"por-confirmar\">[POR CONFIRMAR: otras novedades del curso]</span></li></ul>" },
      ],
    },

    equipo: {
      bloques: [
        { t: "h", html: "Equipo docente" },
        { t: "tabla", html: "<table><thead><tr><th>Asignaturas</th><th>Maestro/a</th></tr></thead><tbody><tr><td>Lengua, Matemáticas, Ciudadanía, Plástica</td><td>Miguel Ángel Úbeda</td></tr><tr><td>Inglés</td><td><span class=\"por-confirmar\">[POR CONFIRMAR]</span></td></tr><tr><td>Francés</td><td><span class=\"por-confirmar\">[POR CONFIRMAR]</span></td></tr><tr><td>Educación Física</td><td><span class=\"por-confirmar\">[POR CONFIRMAR]</span></td></tr><tr><td>Música</td><td><span class=\"por-confirmar\">[POR CONFIRMAR]</span></td></tr><tr><td>Ciencias</td><td><span class=\"por-confirmar\">[POR CONFIRMAR]</span></td></tr><tr><td>Religión / Valores</td><td><span class=\"por-confirmar\">[POR CONFIRMAR]</span></td></tr></tbody></table>" },
      ],
    },

    "normas-centro": {
      bloques: [
        { t: "h", html: "Normas generales del centro" },
        { t: "cols", cols: [
          "<b>Entrada: 9:00 · Salida: 14:00</b><br>La puerta se abrirá a las 9:00 y se cierra a las 9:10.<br><br>Firmar en Secretaría un permiso para que los alumn@s salgan solos.<br><br>Avisar por iPasen si se va a salir durante la jornada escolar.<br><br>Rellenar en iPasen «Autorizaciones recogida».",
          "Las faltas deben justificarse vía <b>iPasen</b> o con una nota.<br><br>Realizar la matrícula de forma digital.<br><br>El centro dispone de <b>página web</b> donde aparecen las novedades de cada curso.<br><br><b>RECREO:</b> de 11:30 a 12:00 (5º y 6º).",
        ] },
      ],
    },

    "normas-clase": {
      bloques: [
        { t: "h", html: "Normas generales de clase" },
        { t: "cols", cols: [
          "<b>Prohibido</b> traer móviles, cámaras de fotos, relojes inteligentes, aparatos electrónicos, videoconsolas, etc.<br><br>No deben traer juguetes ni nada que les sirva de distracción en clase.<br><br>Deben tener un <b>libro de lectura</b> siempre disponible en la rejilla. Además intercambiaremos con los compañer@s el libro comprado el curso pasado para la lectura colectiva.",
          "<b>Carpeta en la mochila</b> para meter las fichas. Las que ya se hayan corregido se quedan en casa.<br><br><b>Uso de la agenda:</b> deben ser responsables y anotar diariamente las tareas y las fechas de los exámenes. Revisar en casa por las familias.<br><br>Delegado/a y subdelegados/as de clase.",
        ] },
      ],
    },

    comportamiento: {
      bloques: [
        { t: "h", html: "Normas de comportamiento" },
        { t: "cols", cols: [
          "<b style=\"color:var(--tiza-azul)\">FALTAS LEVES</b><br>Se registran diariamente por cualquier maestro/a a través de la aplicación Séneca:<br>– Perturbar el desarrollo de la clase.<br>– No hacer la tarea.<br>– Molestar a los compañer@s…<br>Pueden derivar en un Parte de Incidencias si son reiteradas.",
          "<b style=\"color:var(--tiza-rosa)\">FALTAS GRAVES</b><br>Tendrán un Parte de Incidencias inmediato. Se comunicará inmediatamente a las familias a través de las observaciones de iPasen:<br>– Agresiones físicas o verbales.<br>– Humillar, amenazar o coaccionar.<br>– Sustraer materiales o documentos.<br>– Dañar las instalaciones.",
        ] },
        { t: "destacado", html: "<b>Compromisos educativos o de convivencia:</b> dependiendo de la falta que se cometa, se establecerá con el alumno/a y con la familia un compromiso educativo o de convivencia. Tanto la acumulación de faltas leves como tener alguna falta grave supone no poder asistir a la próxima salida que haga el grupo. <u>Estas faltas pueden llevar a la suspensión de actividades extraescolares, incluido el viaje fin de curso.</u>" },
      ],
    },

    grupo: {
      bloques: [
        { t: "h", html: "Información sobre el grupo y resultados de la evaluación inicial" },
        { t: "p", html: "Tras los resultados de la evaluación inicial se establecen distintas medidas:" },
        { t: "ul", html: "<ul><li>Aplicación de un <b>programa de refuerzo</b>.</li><li><span class=\"por-confirmar\">[POR CONFIRMAR: exención de cursar la asignatura de Francés en el caso de que las dificultades sean en el área de Lengua]</span></li><li><span class=\"por-confirmar\">[POR CONFIRMAR: otras medidas específicas del grupo]</span></li></ul>" },
      ],
    },

    criterios: {
      bloques: [
        { t: "h", html: "Criterios de evaluación" },
        { t: "p", html: "Según la actual normativa, el alumnado será evaluado mediante los <b>criterios de evaluación</b>, que contribuyen, en la misma medida, al desarrollo de las competencias específicas." },
        { t: "p", html: "El profesorado utilizará diferentes instrumentos de evaluación para la recogida de esos datos. Entre otros:" },
        { t: "ul", html: "<ul><li>Observación directa y sistemática.</li><li>Análisis de las producciones del alumno/a. Tareas y notas de clase.</li><li>Pruebas específicas y cuestionarios, orales y escritos.</li><li>Autoevaluación.</li></ul>" },
        { t: "destacado", html: "La nota del examen no lo es todo… También valoraremos otras cualidades, aptitudes, actitudes y el esfuerzo." },
        { t: "h", html: "Criterios de calificación" },
        { t: "tabla", html: "<table><thead><tr><th>Calificación</th><th>Porcentaje</th></tr></thead><tbody><tr><td>Insuficiente: 1, 2, 3, 4</td><td>menos del 40%</td></tr><tr><td>Suficiente: 5</td><td>entre el 40% y 60%</td></tr><tr><td>Bien: 6</td><td>entre el 60% y 70%</td></tr><tr><td>Notable: 7 y 8</td><td>entre el 70% y 80%</td></tr><tr><td>Sobresaliente: 9 y 10</td><td>entre el 80% y 100%</td></tr></tbody></table>" },
        { t: "h", html: "Aclaraciones" },
        { t: "cols", cols: [
          "<b>Exámenes:</b> tener en cuenta que pueden juntarse varios la misma semana e incluso el mismo día.<br><br>En Conocimiento del Medio, un <span class=\"por-confirmar\">[POR CONFIRMAR: 20%]</span> de las preguntas serán en inglés.",
          "<b>Notas de clase y tareas:</b> se tendrán en cuenta la realización de tareas, el estudio diario y el comportamiento.<br><br><b>Libreta:</b> se valorará la limpieza y el orden, márgenes, buena letra… y que las actividades estén hechas, corregidas y auto-revisadas (autoevaluación trimestral).",
        ] },
      ],
    },

    familias: {
      bloques: [
        { t: "h", html: "Implicación y colaboración de las familias" },
        { t: "ul", html: "<ul><li>Necesidad del <b>seguimiento</b> por parte de las familias del trabajo escolar, facilitarles el tiempo y las condiciones ambientales para realizar las tareas.</li><li>Importancia de la <b>lectura</b>.</li><li>Importancia de la fluida <b>comunicación</b> con los maestros.</li><li>Inculcar el <b>respeto</b> a los demás y fomentar la convivencia.</li><li>Promover la <b>autonomía personal</b> y la responsabilidad.</li></ul>" },
        { t: "destacado", html: "Importancia de colaborar y ser socio/a del <b>AMPA</b>." },
      ],
    },

    delegado: {
      bloques: [
        { t: "h", html: "Delegado/a de padres y madres de la clase" },
        { t: "p", html: "<i>Orden de 20 de junio de 2011, artículo 10.</i>" },
        { t: "p", html: "<b>Funciones:</b>" },
        { t: "ul", html: "<ul><li>Representar a las madres y padres del alumnado del grupo, recogiendo sus inquietudes, intereses y expectativas, dándoles traslado al profesor/a tutor/a.</li><li>Fomentar y facilitar la comunicación familia-escuela.</li></ul>" },
        { t: "p", html: "<span class=\"por-confirmar\">[Durante la reunión se elegirá al delegado/a de familias del grupo]</span>" },
      ],
    },

    planes: {
      bloques: [
        { t: "h", html: "Planes y proyectos del centro" },
        { t: "cols", cols: [
          "<ul><li><b>Bilingüismo</b></li><li><b>Ecoescuela</b></li><li><b>Creciendo en Salud</b></li><li><b>Plan de Igualdad</b></li></ul>",
          "<ul><li><b>TDE</b> (Transformación Digital Educativa)</li><li><b>Bibliotecas escolares</b></li><li><b>Convivencia</b></li><li><b>PROA</b></li></ul>",
        ] },
        { t: "p", html: "En los siguientes apartados vemos los que más afectan al día a día del grupo." },
      ],
    },

    bilinguismo: {
      bloques: [
        { t: "h", html: "Bilingüismo" },
        { t: "p", html: "Somos un centro bilingüe: parte del horario y de los contenidos se trabajan en inglés, y se celebran las <b>efemérides</b> de la cultura inglesa y francesa." },
        { t: "ul", html: "<ul><li><b>Halloween</b> — <span class=\"por-confirmar\">[fecha POR CONFIRMAR]</span></li><li><b>Le Chandeleur</b> — <span class=\"por-confirmar\">[fecha POR CONFIRMAR]</span></li><li><b>Pancake Day</b> — <span class=\"por-confirmar\">[fecha POR CONFIRMAR]</span></li><li><b>St. Patrick's Day</b> — <span class=\"por-confirmar\">[fecha POR CONFIRMAR]</span></li></ul>" },
      ],
    },

    ecoescuela: {
      bloques: [
        { t: "h", html: "Ecoescuela" },
        { t: "ul", html: "<ul><li><b>Bandera verde</b> Ecoescuelas de Andalucía.</li><li><b>Huerto escolar</b>.</li><li>Recogida de móviles, pilas y tapones.</li><li><b>Residuos 0:</b> el desayuno se trae en fiambrera y lo que traigan de plástico se recicla en casa.</li><li><b>Botella de agua reutilizable</b>.</li></ul>" },
        { t: "destacado", html: "Necesitamos padres/madres que puedan <b>colaborar en las labores del huerto</b>." },
      ],
    },

    salud: {
      bloques: [
        { t: "h", html: "Creciendo en Salud" },
        { t: "ul", html: "<ul><li>Importancia de una <b>alimentación saludable</b>.</li><li>Desayunos con fruta, bocadillos, agua…</li><li>Importancia del <b>descanso</b> y la <b>actividad física</b>.</li></ul>" },
      ],
    },

    igualdad: {
      bloques: [
        { t: "h", html: "Plan de Igualdad" },
        { t: "p", html: "Promover una educación igualitaria entre niños y niñas, hombres y mujeres." },
        { t: "p", html: "<b>Actividades principales:</b>" },
        { t: "ul", html: "<ul><li><b>25 de noviembre:</b> Día Internacional de la Eliminación de la Violencia Contra la Mujer.</li><li><b>8 de marzo:</b> Día Internacional de la Mujer.</li></ul>" },
      ],
    },

    biblioteca: {
      bloques: [
        { t: "h", html: "Biblioteca" },
        { t: "ul", html: "<ul><li>Préstamos de libros y visitas a la biblioteca — <span class=\"por-confirmar\">[POR CONFIRMAR periodicidad, p. ej. cada 15 días]</span>.</li><li>Fomentar el interés por la lectura.</li><li>Banco de libros de la biblioteca en clase.</li></ul>" },
      ],
    },

    digital: {
      bloques: [
        { t: "h", html: "Entorno digital" },
        { t: "cols", cols: [
          "<b style=\"color:var(--tiza-azul)\">iPasen</b><br>Es muy importante tener la aplicación descargada (también se puede acceder a través de la web).<br><br>Tener los datos actualizados: teléfono, correo electrónico, teléfono de emergencias, situaciones familiares relevantes (divorcio, custodias…), <b>alergias</b> y personas autorizadas para la recogida de l@s niñ@s.<br><br>Autorizaciones a través de iPasen para salidas, excursiones, uso de imágenes, audios, etc.",
          "<b style=\"color:var(--tiza-rosa)\">Licencias de libros</b><br><span class=\"por-confirmar\">[POR CONFIRMAR editoriales y pasos de activación para 5º en 2026/2027. Ejemplo del curso pasado: SM — registrarse con su nombre en la página para generar un usuario y contraseña únicos; Francés — se dará un número de licencia a cada niñ@, editorial Santillana]</span>.<br><br>Uso de la plataforma <b>Google Classroom</b> con el correo de <span class=\"por-confirmar\">[dominio POR CONFIRMAR]</span>.",
        ] },
      ],
    },

    tutorias: {
      bloques: [
        { t: "h", html: "Tutorías" },
        { t: "destacado", html: "Horario de tutoría: <b><span class=\"por-confirmar\">[POR CONFIRMAR: lunes de 16:00 a 17:00]</span></b>" },
        { t: "ul", html: "<ul><li>Petición de <b>cita previa</b> a través de Séneca/iPasen.</li><li>Para llevar un seguimiento de las tutorías se elaborará un <b>acta</b> durante la realización de las mismas, que deberán firmar ambas partes.</li><li>Es importante tener una comunicación fluida, por lo que se recomienda al menos <b>1 visita al trimestre</b>.</li></ul>" },
      ],
    },

    extraescolares: {
      bloques: [
        { t: "h", html: "Actividades complementarias y extraescolares" },
        { t: "ul", html: "<ul><li><b>Primer trimestre:</b> <span class=\"por-confirmar\">[POR CONFIRMAR]</span></li><li><b>Segundo trimestre:</b> <span class=\"por-confirmar\">[POR CONFIRMAR]</span></li><li><b>Tercer trimestre:</b> <span class=\"por-confirmar\">[POR CONFIRMAR]</span></li></ul>" },
        { t: "p", html: "Durante el curso: asistencia a teatros, conciertos, salidas por el entorno…" },
      ],
    },

    viaje: {
      bloques: [
        { t: "h", html: "Viaje fin de curso" },
        { t: "p", html: "<span class=\"por-confirmar\">[POR CONFIRMAR si se realiza en 5º o se deja para 6º. Si no procede este curso, este apartado puede ocultarse desde Configuración]</span>" },
        { t: "p", html: "Como referencia, el itinerario del último viaje realizado (Madrid, 4 días):" },
        { t: "ul", html: "<ul><li><b>Día 1 · Almería - Madrid:</b> salida en autocar desde el centro, paseo por El Retiro y visita guiada a pie por el centro histórico de Madrid. Llegada al alojamiento.</li><li><b>Día 2 · Puy du Fou:</b> espectáculos históricos y por la noche «El Sueño de Toledo».</li><li><b>Día 3 · Parque Warner:</b> atracciones y espectáculos, con ticket de almuerzo en el interior.</li><li><b>Día 4 · Regreso:</b> visita al Museo del Prado, almuerzo picnic y regreso a casa.</li></ul>" },
        { t: "cols", cols: [
          "<b>Transporte:</b> traslados desde el centro educativo ida y vuelta y todas las actividades del itinerario.<br><br><b>Alojamiento:</b> bungalows a las afueras de Madrid, habitaciones múltiples (4-5 plazas) con baño privado.<br><br><b>Comidas:</b> pensión completa (entrada con cena y salida con almuerzo).",
          "<b>Presupuesto:</b> <span class=\"por-confirmar\">[POR CONFIRMAR, referencia anterior: desde 385 € · 4 días]</span>.<br><br><b>Seguro de cancelación</b> (opcional): hasta 22 coberturas; cada familia elige si lo contrata en el momento de la inscripción.<br><br>Si queréis hacer alguna modificación estamos abiertos a sugerencias: los programas son 100% personalizados.",
        ] },
      ],
    },

    contacto: {
      bloques: [
        { t: "h", html: "Contacto" },
        { t: "p", html: "Comunicaciones a través de:" },
        { t: "ul", html: "<ul><li><b>iPasen</b></li><li><b>Agenda</b> del alumno/a</li><li><b>Correo electrónico:</b> <span class=\"por-confirmar\">[POR CONFIRMAR]</span></li></ul>" },
        { t: "h", html: "¡GRACIAS!" },
        { t: "p", html: "Gracias por vuestra asistencia y por la colaboración durante todo el curso." },
      ],
    },
  },
};
