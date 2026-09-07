# Education Agent Skills Library (instalado aquí)

Las 165 carpetas de este directorio (excepto este README) proceden de:

**Fuente:** https://github.com/GarethManning/education-agent-skills
**Autor:** Gareth Manning
**Licencia:** CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/) — uso y modificación libres, con atribución y "compartir igual".

Son 165 skills de Claude Code (uno por carpeta, formato `SKILL.md`) agrupadas originalmente en 20 dominios pedagógicos: diseño curricular y evaluación, ciencia del aprendizaje y memoria, autorregulación, instrucción explícita, pensamiento histórico, EAL/idiomas, bienestar y motivación, diseño universal (UDL), pensamiento sistémico, desarrollo profesional docente, etc. Se han aplanado en un único nivel (`.claude/skills/<skill>/SKILL.md`) porque así es como Claude Code las detecta en un proyecto; la carpeta de dominio original de cada skill queda indicada en su campo `skill_id` dentro del YAML.

Se activan solas cuando la conversación con Claude Code encaja con su descripción (por ejemplo, al pedir una programación de unidad, una rúbrica, o una secuencia de repaso espaciado), salvo las marcadas `disable-model-invocation: true`, que solo se usan si se invocan explícitamente.

## Importante — qué NO es esto

Esta librería está basada en evidencia educativa internacional (Hattie, Wiggins & McTighe, Rosenshine, EEF, etc.) y usa vocabulario y ejemplos de sistemas anglosajones ("Year 8", IB MYP, etc.). La mayor parte de las skills (repaso espaciado, carga cognitiva, calidad del feedback, andamiaje, bienestar...) describen **métodos pedagógicos independientes del currículo de cualquier país** y no necesitan adaptación. Solo las skills de diseño/estructura curricular (`backwards-design-unit-planner`, `competency-unpacker`, `kud-knowledge-type-mapper`, `criterion-referenced-rubric-generator`, `curriculum-crosswalk`, `coverage-audit`, `learning-progression-builder`, `scope-and-sequence-designer`, `developmental-band-translator`) hacen referencia directa a currículo, y ahí es donde importa la falta de alineación.

## Alineación LOMLOE-Andalucía

Se añadió `curriculo-lomloe-andalucia/SKILL.md` (no forma parte de la librería original) para fijar el vocabulario y la estructura oficiales — competencias clave, competencias específicas, criterios de evaluación, saberes básicos, ciclos — que deben usarse cuando las skills de diseño curricular de arriba se apliquen a este proyecto (3er ciclo de Primaria, 5º-6º), con las referencias legales exactas (RD 157/2022, Decreto 101/2023, Orden de 30 de mayo de 2023).

Esa skill fija el marco, no el contenido: no incluye el texto literal de los criterios de evaluación ni de los saberes básicos por área (Anexo II de la Orden), porque no se ha verificado ese texto palabra por palabra en esta instalación y presentarlo como oficial sin verificar sería peor que no darlo. Léela para saber cuándo y cómo pedir/contrastar ese texto.

Instalado el 2026-09-07 a petición del usuario.
