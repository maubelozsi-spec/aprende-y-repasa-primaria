# Novela Colectiva

App de escritura literaria colaborativa para 3.er ciclo de Primaria, dentro de
"Aprende y Repasa". Toda la clase (o varios grupos, cada uno con su proyecto)
escribe una misma novela por tandas de diez líneas, con corrector ortográfico,
fichas de personajes, panel docente y libro final en PDF.

**Este documento es la referencia para seguir desarrollando desde cualquier
dispositivo.** Dice qué está hecho, dónde está cada cosa y qué queda pendiente.

---

## 1. Cómo se usa en clase

**La primera vez (docente):**
1. Entrar en `novela/docente.html` con la cuenta de profesorado de siempre.
2. «Nueva» → título, grupo y, muy recomendable, el género/época/tono.
   Se autoriza automáticamente a todo el grupo elegido.
3. En «Alumnado» se puede afinar quién escribe. Un mismo alumno puede estar en
   varias novelas a la vez.

**Cada sesión (alumnado):**
1. `novela/index.html` → su clave de seis letras → elige la novela.
2. Lee lo último y el resumen, escribe sus diez líneas y pulsa
   «Añadir a la novela».
3. Si escribe un nombre nuevo, rellena su ficha. Si tiene faltas, las ve
   explicadas y las corrige de un clic.

**Mientras tanto (docente):** en «La novela» ve cada parte con el color y el
código de su autor, y puede felicitar, mandar una indicación, devolver para
corregir, quitar de la novela o borrar. En «Alumnado» ve quién no ha escrito
todavía y las faltas por cada cien palabras de cada uno.

**Al terminar:** «Dar por terminada la novela» (o dejar que lo haga el alumno
autorizado en Ajustes) y descargar los dos PDF.

### Interruptores que conviene conocer

| Ajuste | Para qué |
|---|---|
| Escritura abierta | Cerrarla para que no escriban fuera de clase. |
| Por turnos | Solo escribe quien tiene el turno; útil con el grupo entero a la vez. |
| Aprobar antes de publicar | Nada aparece en la novela sin tu visto bueno. |
| Autoría visible | Por defecto NO: solo el docente ve quién escribió cada parte. |
| Líneas por tanda | 10 por defecto (una línea = 90 caracteres o un salto de línea). |
| Alumno autorizado a terminar | Le aparece el botón de cerrar la novela. |

---

## 2. Qué hay hecho

- **Acceso**: se reutilizan las claves de alumno y las cuentas de docente que ya
  existían (`students/{code}`, `js/auth.js`). No hay un sistema nuevo de códigos.
- **Escritura por tandas** con contador de líneas, borrador guardado en el
  propio equipo y aviso cuando entran partes nuevas mientras escribías.
- **Orden transaccional**: si dos alumnos pulsan el botón a la vez, cada uno
  recibe su número de orden; nadie pisa a nadie.
- **Corrector propio** (~26.600 formas) que distingue faltas seguras (con la
  regla explicada) de palabras simplemente desconocidas, y ofrece la forma
  correcta de un clic. Nunca impide publicar.
- **Fichas obligatorias** de personajes, lugares y palabras inventadas la
  primera vez que aparecen; los nombres de varias palabras se piden juntos.
- **Motor de continuidad** local: personajes que reaparecen sin poder, cambios
  de lugar sin contarlos, saltos de tiempo verbal o de narrador, partes que no
  enlazan. Avisa y aconseja; no reescribe nada.
- **Resumen automático** y botón «No sé cómo seguir» con ideas hechas a partir
  de los personajes de esa misma novela.
- **Filtro de seguridad** antes de publicar: palabras malsonantes y datos
  personales reales (teléfonos, correos, direcciones, DNI).
- **Panel docente**: autoría por colores, participación, faltas por cada cien
  palabras, aprobación previa, turnos, fichas, cierre y borrado.
- **Correcciones al alumno**: llegan como mensaje con su texto al lado y un
  botón para ir a corregirlo. El texto original nunca se sobrescribe
  (`textoOriginal`).
- **PDF** generado en el propio navegador, sin librerías: la novela para leer y
  el cuaderno del docente con autoría, participación e indicaciones.
- **Tutorial** para el alumnado con un recuadro para practicar con el corrector
  de verdad sin guardar nada.
- **IA opcional** (`js/ia.js`): solo en el panel docente y solo si el docente
  pega su clave de la API. Revisa la coherencia de una parte y redacta el
  resumen. Propone; nunca cambia el texto.
- **PWA**: instalable y utilizable con el wifi caído.

---

## 3. Mapa de archivos

```
novela/
  index.html      portada y entrada del alumnado
  escribir.html   vista del alumno (novela, editor, resumen, fichas, mensajes)
  docente.html    panel docente (novela, alumnado, fichas, ajustes, descargas)
  tutorial.html   tutorial con recuadro de práctica
  manifest.json sw.js css/estilos.css
  js/
    comun.js         sesiones, avisos, modales, contar líneas
    firebase-init.js reexporta la app de Firebase de la raíz
    proyectos.js     TODO el acceso a Firestore (colecciones nov*)
    inicio.js  escribir.js  docente.js  tutorial.js
    lexico.js        listas de palabras (ARCHIVO GENERADO)
    diccionario.js   genera plurales, femeninos, -mente y conjugaciones
    corrector.js     reglas, faltas deducidas y dudas
    fichas.js        preguntas y ventanas de las fichas
    coherencia.js    avisos de continuidad
    resumen.js       resumen extractivo e ideas para seguir
    moderacion.js    filtro de seguridad
    pdf.js           escritor de PDF propio
    exportar.js      los dos documentos finales
    ia.js            capa opcional de IA (solo panel docente)
```

## 4. Datos (Firestore)

- `novProyectos/{id}`: `teacherId, classId, titulo, semilla, participantes[],
  estado, modoTurno, moderacionPrevia, autoriaVisible, maxLineas,
  escrituraAbierta, siguienteOrden, numFragmentos, numPalabras, resumenManual,
  turnoDe, cerradorAutorizado`.
- `novFragmentos/{id}`: `proyectoId, teacherId, orden, texto, textoOriginal,
  autorCode, estado (publicado|pendiente|cambios|oculto), palabras, creadoEn,
  editadoEn, vecesEditado`.
- `novFichas/{id}`: `proyectoId, teacherId, tipo, nombre, respuestas{},
  estadoNarrativo, autorCode`.
- `novNotas/{id}`: `proyectoId, teacherId, fragmentoId, destinatarioCode, tipo,
  texto, leido, resuelto`.

Las reglas están en `firestore.rules` (raíz): cada uno solo publica en su
nombre, solo corrige su parte, `textoOriginal` no se puede sobrescribir y solo
el alumno autorizado puede dar por terminada la novela. **Al cambiar las reglas
hay que volver a publicarlas en la consola de Firebase.**

## 5. Coste

Cero. Firebase plan Spark, GitHub Pages y todo el procesamiento en el
navegador. Lo único que puede costar dinero es la capa de IA opcional, que solo
se activa pegando una clave propia y solo funciona en el dispositivo del
docente. Para no agotar la cuota gratuita de Firestore, cada pantalla escucha
únicamente el proyecto abierto.

## 6. Ideas pendientes

- Pantalla de proyección para la pizarra digital, con la novela creciendo en
  directo (patrón ya resuelto en `cifras-letras/proyeccion.html`).
- Reordenar partes desde el panel docente (ahora solo se pueden ocultar).
- Papelera con deshacer para lo borrado.
- Capítulos: cerrar capítulo y generar su resumen.
- Informe de evaluación exportable en CSV además del PDF.
- Lectura en voz alta con la voz del navegador (accesibilidad).
- Portada ilustrada por el alumnado.
