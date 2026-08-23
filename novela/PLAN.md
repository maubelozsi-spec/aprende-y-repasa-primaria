# Novela Colectiva — plan del proyecto

App de escritura literaria colaborativa para 3.er ciclo de Primaria, dentro de
"Aprende y Repasa". Toda la clase (o varios grupos con proyectos distintos)
escribe una misma novela por turnos, con panel docente, corrección ortográfica,
fichas de personajes y exportación final a documento.

Este documento es la referencia para continuar el desarrollo desde cualquier
dispositivo: recoge decisiones cerradas, lo que falta por decidir y el orden de
trabajo. **Antes de programar, leer las decisiones cerradas.**

---

## 1. Decisiones ya cerradas

| Tema | Decisión |
|---|---|
| Coste | 0 € obligatorio. Todo funciona sin IA (motor propio en el navegador). La IA real es una capa **opcional** que el docente activa pegando su clave en su dispositivo, igual que en `ingles-viajes/js/ia.js`. |
| Orden de escritura | Libre por defecto (se publica en el orden en que se pulsa el botón) **+ modo "cola de turnos" activable** por el docente en cada proyecto. |
| Autoría | Los alumnos ven la novela sin autores. Solo el docente pincha un fragmento y ve el código del autor. (Interruptor previsto por si algún día se quiere abrir.) |
| Claves de acceso | Se reutilizan las claves de 6 caracteres que ya genera el panel docente (`students/{code}`). No hay sistema de códigos nuevo. |
| Base técnica | HTML + CSS + JS modular sin build, Firebase (Firestore + Auth anónima), PWA propia. Mismo patrón que `cifras-letras/` y `economia-familiar/`. |

---

## 2. Estructura de carpetas prevista

```
novela/
  index.html        · portada: entrar como alumno o como docente
  escribir.html     · vista del alumno: novela + resumen + fichas + editor
  docente.html      · panel docente: proyectos, corrección, cierre, exportación
  proyeccion.html   · pantalla de aula (opcional, fase 3)
  manifest.json  sw.js
  css/estilos.css
  js/
    firebase-init.js   · reexporta la config global
    comun.js           · sesiones, avisos, modales (copiar de cifras-letras)
    proyectos.js       · crear/abrir/cerrar proyectos, suscripciones
    editor.js          · editor de 10 líneas, contador, avisos en vivo
    corrector.js       · ortografía sin IA (diccionario + reglas + sugerencias)
    diccionario.js     · léxico ampliado (parte de cifras-letras/js/diccionario.js)
    fichas.js          · personajes, lugares y palabras inventadas
    coherencia.js      · avisos de continuidad antes de publicar
    resumen.js         · resumen automático extractivo + resumen editable
    docente.js         · panel, correcciones, participación, cierre
    exportar.js        · .docx/.pdf usando ../js/docx-writer.js
    ia.js              · capa opcional (misma pauta que ingles-viajes/js/ia.js)
```

---

## 3. Modelo de datos (Firestore)

Colecciones nuevas, con prefijo `nov` para no chocar con lo existente:

- **`novProyectos/{proyectoId}`**
  `teacherId, classId, titulo, semilla{genero, epoca, tono, personajesIniciales},
  estado: abierto|pausado|cerrado, modoTurno: libre|cola, maxLineas: 10,
  ventanaEscritura{abierta, desde, hasta}, autoriaVisible: false,
  moderacionPrevia: false, siguienteOrden, numFragmentos, numPalabras,
  createdAt, closedAt, cerradoPor`

- **`novFragmentos/{fragmentoId}`**
  `proyectoId, orden, texto, textoOriginal, autorCode, createdAt,
  estado: publicado|pendiente|oculto, faltasDetectadas[], entidades[],
  editadoPorDocente: bool`
  `textoOriginal` se conserva siempre: es lo que el alumno escribió de verdad,
  imprescindible para evaluar y para que ninguna corrección borre su trabajo.

- **`novFichas/{fichaId}`** — mini wiki del proyecto
  `proyectoId, tipo: personaje|lugar|invento, nombre, alias[],
  respuestas{quienEs, relacion, aspecto, dondeEsta, otros},
  estadoNarrativo (vivo/desaparecido/...), autorCode, createdAt`

- **`novNotas/{notaId}`** — correcciones e indicaciones del docente
  `proyectoId, fragmentoId, destinatarioCode, texto,
  tipo: correccion|indicacion|felicitacion, leido, createdAt`

- **`novTurnos/{proyectoId}/cola/{code}`** — solo en modo cola: `pedidoAt`.

Reglas de seguridad (`firestore.rules`): el docente dueño (`teacherId == uid`)
lo puede todo; el alumno solo lee proyectos de su `classId` y solo escribe
fragmentos con su propio `autorCode`, comprobado contra `students/{code}.authUid`
como ya se hace en el resto de la app.

---

## 4. Funcionamiento

### Alumno
1. Entra con su clave (la de siempre) y ve los proyectos abiertos de su clase.
2. Abre el proyecto: novela completa, **resumen de por dónde va** y fichas.
3. Botón *Escribir* → editor con contador de líneas (máximo 10) y corrección
   ortográfica en vivo: la palabra dudosa se subraya y al tocarla salen
   sugerencias, con la regla explicada en corto ("se escribe con b porque…").
4. Al pulsar **Añadir a la novela**:
   - se detectan nombres propios y palabras desconocidas nuevas y se piden sus
     fichas (¿quién es? ¿qué relación tiene con la historia? ¿dónde está?…);
     sin ficha no se publica;
   - el motor de coherencia avisa de saltos: personaje sin ficha, personaje que
     estaba en otro sitio, cambio de tiempo verbal o de narrador, contradicción
     con una ficha existente. El alumno corrige o justifica y publica;
   - se asigna el `orden` con una transacción, así dos envíos simultáneos nunca
     se pisan; si mientras escribía se publicó otro fragmento, se le avisa y se
     le ofrece releerlo antes de mandar.
5. Puede escribir tantas veces como quiera, siempre en lotes de 10 líneas.
6. Recibe las indicaciones del docente en un aviso dentro de la app.

### Docente
- Crea proyectos (uno para toda la clase o varios para grupos distintos),
  pone el título y, opcionalmente, la semilla (género, época, tono).
- Ve la novela con la autoría a la vista: color y código por alumno, filtro por
  alumno, y mapa de participación (quién escribe mucho, quién no ha escrito).
- Sobre cualquier fragmento: comentar (le llega al alumno), corregir el texto
  (queda registrado, con el original guardado), ocultar, reordenar.
- Abre y cierra la ventana de escritura, cambia libre ↔ cola, pausa el proyecto.
- Cierra la novela o autoriza a un alumno a cerrarla.
- Exporta el documento final.

### La parte "que la historia tenga sentido", sin coste
Motor local que **avisa y sugiere, nunca reescribe a espaldas del alumno**:
comprueba fichas, continuidad de personajes y lugares, tiempo verbal y persona
narrativa, repeticiones y conectores. Si el docente activa la IA opcional, esa
misma revisión la hace un modelo de verdad y propone una reescritura suave que
el alumno acepta o rechaza; el texto original siempre queda guardado.

### Resumen de la novela
Automático y extractivo (sin IA): última escena, personajes que han aparecido,
lugares, hilos abiertos y número de palabras. Editable a mano por el docente.
Con IA activada, resumen redactado por capítulos.

### Exportación final
Reutiliza `js/docx-writer.js` (ya genera .docx en el navegador, sin librerías):
- versión limpia: portada con el título, la novela y los créditos de la clase;
- versión docente: la novela con autorías y comentarios;
- anexo opcional: índice de personajes y lugares a partir de las fichas.

---

## 5. Orden de trabajo propuesto

**Fase 1 — el núcleo (que funcione en clase mañana)**
1. Estructura de carpetas, CSS y PWA, siguiendo `cifras-letras/`.
2. Reglas de Firestore para las colecciones `nov*`.
3. Panel docente mínimo: crear proyecto con título y ver la novela con autorías.
4. Vista de alumno: leer la novela + editor de 10 líneas + publicar con orden
   transaccional.

**Fase 2 — lo que hace que la novela no se descarrile**
5. Corrector ortográfico con sugerencias.
6. Fichas de personajes, lugares e inventos, obligatorias al aparecer.
7. Resumen automático.
8. Comentarios del docente y avisos al alumno.
9. Motor de coherencia local.

**Fase 3 — cierre y extras**
10. Cierre de la novela y exportación a .docx.
11. Modo cola de turnos y ventana de escritura.
12. Pantalla de proyección para el aula.
13. Capa de IA opcional.
14. Informe de evaluación por alumno (palabras, faltas por 100 palabras, fichas).

---

## 6. Cuidados que no hay que perder de vista

- **Datos de menores**: solo códigos y apodos, nunca nombres y apellidos reales.
  Si se activa la IA, avisar de forma explícita de que el texto sale del centro.
- **Filtro previo** de palabras malsonantes y de datos personales (teléfonos,
  direcciones) antes de publicar, con aviso al docente.
- **Límites del plan gratuito de Firebase** (Spark): con 25 alumnos escuchando
  la misma novela en directo hay que paginar y no suscribirse a todo el
  histórico, o se agotan las lecturas diarias.
- **Definir "línea"**: se contará por caracteres (~90 por línea) además de por
  saltos de línea, para que no se haga trampa con líneas de una palabra.
- **Nada de borrados irreversibles**: papelera y deshacer en el panel docente.

---

## 7. Pendiente de decidir (preguntado al docente)

- Nº de alumnos a la vez y dispositivos (ordenador, Chromebook, tablet, móvil).
- ¿Moderación previa (yo apruebo antes de que se vea) o publicación directa?
- ¿Las correcciones del docente cambian el texto de la novela o solo llegan
  como indicación para que el alumno lo reescriba?
- ¿Puede un alumno editar o borrar su propio fragmento después de enviarlo?
- ¿Un alumno puede pertenecer a varios proyectos a la vez?
- ¿Exportación en Word, PDF o las dos?
