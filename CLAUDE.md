# Instrucciones del proyecto

## Coste cero: requisito obligatorio

Esta aplicación no puede suponer ningún gasto económico. Cualquier cambio
debe seguir funcionando con el plan gratuito **Spark** de Firebase
(proyecto `aprende-y-repasa-cc321`) y con GitHub Pages en repositorio
público. El proyecto no tiene cuenta de facturación vinculada y no debe
tenerla.

Infraestructura actual (toda gratuita):

- Alojamiento: GitHub Pages (`.github/workflows/pages.yml`), sin paso de build.
- Firebase Firestore (base de datos) y Firebase Authentication
  (email/contraseña para docentes, anónimo para alumnado), cargados por CDN.

### No usar

- Cloud Functions, Cloud Storage, Firebase Hosting con funciones, Cloud Run,
  extensiones de Firebase, exportaciones/copias programadas de Firestore,
  verificación por SMS (autenticación por teléfono), Identity Platform
  ni cualquier otro servicio que exija el plan Blaze o una tarjeta.
- APIs de pago o con clave de facturación (IA, mapas, traducción, envío de
  correos o SMS, etc.).
- Dependencias o servicios externos de pago o con prueba gratuita que caduque.

Si una funcionalidad solo es posible con algo de pago, no se implementa:
se avisa al docente y se propone una alternativa gratuita.

### Cuotas diarias de Spark (Firestore)

50.000 lecturas, 20.000 escrituras, 20.000 borrados y 1 GiB almacenado.
Al superarlas la app deja de leer/guardar hasta el reinicio diario
(medianoche, hora del Pacífico). Por tanto:

- Evitar escuchas `onSnapshot` innecesarias o sobre colecciones grandes;
  cancelarlas (`unsubscribe`) al salir de la vista.
- Preferir lecturas puntuales, consultas acotadas (`where`, `limit`) y la
  caché local persistente ya configurada en `js/firebase-init.js`.
- Agrupar escrituras (`writeBatch`) y no escribir en bucles por cada
  pulsación o cada segundo.
- Al añadir una función que lea o escriba en Firestore, estimar su consumo
  para una clase entera (unos 25 alumnos) más el panel docente abierto.
