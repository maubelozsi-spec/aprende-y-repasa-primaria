# Education Agent Skills Library (instalado aquí)

Las 165 carpetas de este directorio (excepto este README) proceden de:

**Fuente:** https://github.com/GarethManning/education-agent-skills
**Autor:** Gareth Manning
**Licencia:** CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/) — uso y modificación libres, con atribución y "compartir igual".

Son 165 skills de Claude Code (uno por carpeta, formato `SKILL.md`) agrupadas originalmente en 20 dominios pedagógicos: diseño curricular y evaluación, ciencia del aprendizaje y memoria, autorregulación, instrucción explícita, pensamiento histórico, EAL/idiomas, bienestar y motivación, diseño universal (UDL), pensamiento sistémico, desarrollo profesional docente, etc. Se han aplanado en un único nivel (`.claude/skills/<skill>/SKILL.md`) porque así es como Claude Code las detecta en un proyecto; la carpeta de dominio original de cada skill queda indicada en su campo `skill_id` dentro del YAML.

Se activan solas cuando la conversación con Claude Code encaja con su descripción (por ejemplo, al pedir una programación de unidad, una rúbrica, o una secuencia de repaso espaciado), salvo las marcadas `disable-model-invocation: true`, que solo se usan si se invocan explícitamente.

## Importante — qué NO es esto

Esta librería está basada en evidencia educativa internacional (Hattie, Wiggins & McTighe, Rosenshine, EEF, etc.), pero **no está alineada con el currículo LOMLOE ni con las instrucciones de la Consejería de Educación de la Junta de Andalucía**. Los ejemplos y convenciones (cursos "Year 8", IB MYP, etc.) son de sistemas anglosajones. Sirve como apoyo pedagógico general (estructura de unidades, evaluación formativa, práctica de recuperación espaciada, andamiaje...), pero cualquier referencia a criterios de evaluación, saberes básicos o competencias específicas debe contrastarse y adaptarse al currículo andaluz vigente antes de usarla con el alumnado.

Instalado el 2026-09-07 a petición del usuario.
