# Archivos de terceros de la Novela Colectiva

Se sirven tal cual desde GitHub Pages (sin coste, sin servicios externos).

- `nspell.js`: [nspell](https://github.com/wooorm/nspell) 2.1.5, de Titus
  Wormer, licencia MIT. Empaquetado en un solo archivo (con su dependencia
  `is-buffer`, MIT) para cargarlo en un Web Worker sin paso de build.
- `diccionario-es/`: diccionario de español para LibreOffice / Apache
  OpenOffice (es_ES) del proyecto RLA-ES, distribuido en el paquete npm
  `dictionary-es` 4.0.0. Triple licencia GPL-3.0 / LGPL-3.0 / MPL-1.1: ver
  `diccionario-es/LICENCIA.txt`.

Los usa `novela/js/diccionario-worker.js` para que el corrector no marque
como dudosas palabras correctas que no están en el vocabulario propio
(`novela/js/lexico.js`).
