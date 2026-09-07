---
name: curriculo-lomloe-andalucia
description: "Traduce la salida de las skills de diseño curricular genéricas (backwards-design-unit-planner, competency-unpacker, kud-knowledge-type-mapper, criterion-referenced-rubric-generator, curriculum-crosswalk, coverage-audit, learning-progression-builder, scope-and-sequence-designer, developmental-band-translator) al marco legal de Educación Primaria en Andalucía (LOMLOE). Úsala siempre que se planifique, programe o evalúe contenido para 5º o 6º de Primaria en este proyecto, o cuando se mencione currículo, criterios de evaluación, saberes básicos, competencias clave o competencias específicas."
disable-model-invocation: false
user-invocable: true
effort: low
skill_id: "local/curriculo-lomloe-andalucia"
version: "1.0"
evidence_strength: "n/a — mapeo normativo, no pedagógico"
legal_sources:
  - "Real Decreto 157/2022, de 1 de marzo (BOE), ordenación y enseñanzas mínimas de Educación Primaria — marco estatal"
  - "Decreto 101/2023, de 9 de mayo (BOJA núm. 90, de 15 de mayo de 2023), ordenación y currículo de Educación Primaria en Andalucía"
  - "Orden de 30 de mayo de 2023 (BOJA núm. 104, de 2 de junio de 2023), desarrollo de competencias específicas, criterios de evaluación, saberes básicos por área, orientaciones para situaciones de aprendizaje, atención a la diversidad, evaluación y tránsito de etapa"
chains_well_with:
  - "backwards-design-unit-planner"
  - "competency-unpacker"
  - "kud-knowledge-type-mapper"
  - "criterion-referenced-rubric-generator"
  - "curriculum-crosswalk"
  - "coverage-audit"
  - "learning-progression-builder"
  - "scope-and-sequence-designer"
  - "developmental-band-translator"
tags: ["lomloe", "andalucia", "primaria", "curriculo", "normativa"]
---

# Alineación LOMLOE-Andalucía (Educación Primaria)

## Qué hace esta skill

Las skills de este proyecto (`.claude/skills/`) proceden en su mayoría de una librería internacional en inglés que usa vocabulario genérico ("standard", "curriculum_framework", "grade level", "subject area"). Esta skill no las traduce palabra por palabra: **fija el vocabulario y la estructura oficiales** que debe usarse cuando el resultado de cualquiera de esas skills se aplique a este proyecto (una app de refuerzo para 5º y 6º de Primaria, es decir, tercer ciclo).

## Marco legal aplicable

- **Estatal:** Real Decreto 157/2022, de 1 de marzo — enseñanzas mínimas de Primaria.
- **Andalucía:** Decreto 101/2023, de 9 de mayo (BOJA núm. 90, 15/05/2023) — ordenación y currículo.
- **Desarrollo:** Orden de 30 de mayo de 2023 (BOJA núm. 104, 2/06/2023) — competencias específicas, criterios de evaluación y saberes básicos por área, situaciones de aprendizaje, atención a la diversidad, evaluación y tránsito entre etapas.

La etapa se organiza en **tres ciclos de dos cursos**: 1er ciclo (1º-2º), 2º ciclo (3º-4º) y **3er ciclo (5º-6º)**. Este proyecto trabaja en tercer ciclo.

## Vocabulario oficial (usar siempre este, no el genérico de las skills importadas)

| Término genérico de la skill importada | Término oficial LOMLOE-Andalucía a usar |
|---|---|
| standard / learning objective | **criterio de evaluación** (por área y ciclo) |
| curriculum_framework / content | **saber básico** (por área y ciclo) |
| competency / broad descriptor | **competencia específica** (por área) |
| grade level | **ciclo** (1º, 2º o 3er ciclo) y **curso** (1º-6º) |
| subject area | **área** (nombre oficial del área, no una traducción libre de "subject") |
| 21st-century skills / general competencies | las **8 competencias clave**: CCL (comunicación lingüística), CP (plurilingüe), STEM (competencia matemática y competencia en ciencia, tecnología e ingeniería), CD (digital), CPSAA (personal, social y de aprender a aprender), CC (ciudadana), CE (emprendedora), CCEC (conciencia y expresión culturales) |
| — | **Perfil de salida** al término de la Enseñanza Básica: el referente último al que deben contribuir las competencias específicas de todas las áreas |
| — | **situación de aprendizaje**: unidad de programación que moviliza saberes básicos y competencias específicas de forma contextualizada |

### Contenido oficial verificado en esta carpeta

- `perfil-competencial-tercer-ciclo.md`: descriptores operativos de las 8 competencias clave al completar el tercer ciclo (Decreto 101/2023, Anexo "Perfil competencial"), transcritos literalmente.
- `anexo-ii-criterios-tercer-ciclo.md`: competencias específicas, criterios de evaluación (5º y 6º) y códigos de saberes básicos de **Matemáticas**, **Lengua Castellana y Literatura** y **Primera Lengua Extranjera**, tercer ciclo, transcritos literalmente del Anexo II de la Orden de 30 de mayo de 2023 (documento completo con los 6 anexos, aportado por el usuario). Incluye además el texto completo de los saberes básicos de Lengua Castellana y Literatura; los de Matemáticas y Primera Lengua Extranjera están solo por código.

Cuando otra skill de este proyecto necesite citar un criterio de evaluación, un saber básico o un descriptor de competencia clave de 5º-6º para Matemáticas, Lengua o Inglés, usa estos dos archivos — no reconstruyas ni parafrasees el contenido de memoria.

## Cómo aplicarla

1. Cuando otra skill de este proyecto genere una unidad, rúbrica, progresión o mapeo curricular, sustituye su terminología genérica por la tabla de arriba antes de presentar el resultado al usuario.
2. Etiqueta siempre el ciclo/curso real (3er ciclo, 5º o 6º), nunca "Year 5" ni equivalentes de otros sistemas.
3. Cita el área con su nombre oficial de Primaria (Lengua Castellana y Literatura, Primera Lengua Extranjera, Matemáticas, Ciencias de la Naturaleza, Ciencias Sociales, Educación Artística, Educación Física, Valores Cívicos y Éticos/Religión, y Segunda Lengua Extranjera donde proceda). Verifica el nombre exacto del área en el Anexo I del Decreto 101/2023 si hay alguna duda, no lo inventes por analogía con otro sistema educativo.

## Límite explícito — léelo antes de generar un criterio de evaluación o saber básico

**Esta skill fija el marco y el vocabulario; el contenido literal solo está verificado donde se indica explícitamente.** El Perfil competencial y el Anexo II de Matemáticas, Lengua Castellana y Literatura y Primera Lengua Extranjera (arriba) SÍ son texto oficial verbatim para tercer ciclo. Fuera de esas tres áreas (Conocimiento del Medio, Educación Artística, Educación Física, Valores Cívicos y Éticos, Segunda Lengua Extranjera) o fuera de tercer ciclo, no hay texto verificado — no lo inventes.

Cuando se necesite el texto literal de un criterio de evaluación o saber básico que no esté en `anexo-ii-criterios-tercer-ciclo.md` (otra área, otro ciclo, o el texto completo de un saber básico de Matemáticas/Inglés que aquí solo tiene código):
- Pide al usuario que pegue el fragmento del Anexo II correspondiente, o
- Indica explícitamente que el criterio propuesto es una **formulación orientativa, no el texto oficial**, y que debe contrastarse con el Anexo II antes de usarse en documentación oficial (programación didáctica, informes de evaluación, etc.).

## Fuera de alcance de esta skill

La mayoría de las skills instaladas en este proyecto (retrieval-practice-generator, spaced-practice-scheduler, cognitive-load-analyser, feedback-quality-analyser, udl-*, wellbeing-motivation-agency, etc.) describen **métodos pedagógicos**, no contenido curricular: no dependen del currículo de ningún país y no necesitan esta alineación. Aplica esta skill solo cuando el resultado haga referencia directa a competencias, criterios de evaluación, saberes básicos o estructura de curso/ciclo.
