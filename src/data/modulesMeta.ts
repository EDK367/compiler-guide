export interface ModuleMeta {
  id: string;
  number: number;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  badge: string;
  topics: { id: string; title: string }[];
  sources: { title: string; detail: string }[];
}

export const MODULES: ModuleMeta[] = [
  {
    id: 'm1',
    number: 1,
    slug: '1-fundamentos',
    title: 'Módulo 1: Fundamentos de Compiladores',
    shortTitle: 'Fundamentos',
    description: 'Conceptos basales, contrastes rigurosos entre compiladores, intérpretes y ensambladores, fases del compilador, enlazador y cargador.',
    badge: 'Arquitectura',
    topics: [
      { id: 'que-es-compilador', title: '1. ¿Qué es un compilador e intérprete?' },
      { id: 'comparativa-traduccion', title: '2. Comparativa: Compilador vs Intérprete vs Ensamblador' },
      { id: 'etapas-compilacion', title: '3. Etapas del proceso de compilación (Front-End & Back-End)' },
      { id: 'codigo-intermedio-objeto', title: '4. Análisis, Código Intermedio y Código Objeto' },
      { id: 'enlazador-cargador', title: '5. El Enlazador (Linker) y el Cargador (Loader)' },
      { id: 'arquitectura-general', title: '6. Arquitecturas de compiladores: Pasada única vs Múltiples pasadas' }
    ],
    sources: [
      { title: 'Traducción Dirigida por la Sintaxis y Comprobación de Tipos', detail: 'Ing. Mario Ramírez Tobar - Estructura de un Compilador (pág. 710-728)' },
      { title: 'Generación de Código Intermedio', detail: 'Ing. Mario Ramírez Tobar - Flujo secuencial y transformación (pág. 112-133)' }
    ]
  },
  {
    id: 'm2',
    number: 2,
    slug: '2-analisis-lexico',
    title: 'Módulo 2: Análisis Léxico',
    shortTitle: 'Léxico',
    description: 'Tokens, lexemas, patrones, expresiones regulares, autómatas finitos (Thompson, Subconjuntos, Hopcroft) y manejo de errores léxicos.',
    badge: 'Front-End',
    topics: [
      { id: 'tokens-lexemas-patrones', title: '1. Tokens, Lexemas y Patrones: Definiciones formales' },
      { id: 'expresiones-regulares', title: '2. Álgebra de Expresiones Regulares' },
      { id: 'automatas-finitos', title: '3. Autómatas Finitos: AFND y AFD' },
      { id: 'algoritmos-construccion', title: '4. Construcción de Thompson y Construcción de Subconjuntos' },
      { id: 'construccion-lexer', title: '5. Implementación práctica del escáner léxico' },
      { id: 'errores-lexicos', title: '6. Manejo y recuperación de errores léxicos' }
    ],
    sources: [
      { title: 'Traducción Dirigida por la Sintaxis y Comprobación de Tipos', detail: 'Ing. Mario Ramírez Tobar - El Analizador Léxico y tuplas <token, attr> (pág. 718-732)' }
    ]
  },
  {
    id: 'm3',
    number: 3,
    slug: '3-analisis-sintactico',
    title: 'Módulo 3: Análisis Sintáctico',
    shortTitle: 'Sintáctico',
    description: 'Gramáticas libres de contexto, árboles de derivación, ambigüedad, eliminación de recursividad izquierda, LL, LR y el Stack del analizador.',
    badge: 'Front-End',
    topics: [
      { id: 'gramaticas-glc', title: '1. Gramáticas Libres de Contexto (GLC) y Derivaciones' },
      { id: 'arboles-ambiguedad', title: '2. Árboles sintácticos y el problema de la ambigüedad' },
      { id: 'recursividad-izquierda', title: '3. Eliminación de recursividad izquierda (Teoría y acciones semánticas)' },
      { id: 'factorizacion-izquierda', title: '4. Factorización izquierda para análisis determinista' },
      { id: 'stack-analizadores', title: '5. El Funcionamiento LIFO del Stack en LL y LR (Mario Ramírez Tobar)' },
      { id: 'sdd-sdt', title: '6. Definiciones S-atribuidas, L-atribuidas y Marcadores' }
    ],
    sources: [
      { title: 'Traducción Dirigida por la Sintaxis y Comprobación de Tipos', detail: 'Ing. Mario Ramírez Tobar - Recursividad Izquierda, Stack LL vs LR y SDD/SDT (pág. 1-705)' }
    ]
  },
  {
    id: 'm4',
    number: 4,
    slug: '4-analisis-semantico',
    title: 'Módulo 4: Análisis Semántico',
    shortTitle: 'Semántico',
    description: 'Comprobaciones estáticas (tipos, nombres, ámbitos, control de flujo, unicidad, accesos), Tabla de Tipos y Tabla de Símbolos.',
    badge: 'Front-End',
    topics: [
      { id: 'rol-analisis-semantico', title: '1. ¿Tiene mi lenguaje sentido? Rol del análisis semántico' },
      { id: 'comprobaciones-estaticas', title: '2. Las 6 Comprobaciones Semánticas Estáticas' },
      { id: 'sistemas-de-tipos', title: '3. Equivalencia nominal vs estructural y conversión de tipos' },
      { id: 'tabla-de-tipos', title: '4. Especificación y estructura de la Tabla de Tipos' },
      { id: 'tabla-de-simbolos', title: '5. Especificación y estructura de la Tabla de Símbolos' },
      { id: 'caso-estudio-pascal', title: '6. Caso de estudio completo paso a paso (Factorial y Vector en Pascal)' }
    ],
    sources: [
      { title: 'Traducción Dirigida por la Sintaxis y Comprobación de Tipos', detail: 'Ing. Mario Ramírez Tobar - Comprobaciones Semánticas, Tabla de Tipos y Tabla de Símbolos (pág. 707-1375)' }
    ]
  },
  {
    id: 'm5',
    number: 5,
    slug: '5-codigo-intermedio',
    title: 'Módulo 5: Traducción y Código Intermedio',
    shortTitle: 'C3D / TAC',
    description: 'Código de 3 Direcciones (C3D), Cuádruplas, Tripletas, aplanado de arreglos 2D/3D, booleanos con cortocircuito, subprogramas y I/O.',
    badge: 'Middle-End',
    topics: [
      { id: 'que-es-c3d', title: '1. Principio fundamental del Código de Tres Direcciones' },
      { id: 'instrucciones-permitidas', title: '2. Conjunto canónico de instrucciones C3D' },
      { id: 'cuadruplas-tripletas', title: '3. Cuádruplas / Cuartetos y Tripletas' },
      { id: 'aplanado-arreglos', title: '4. Arreglos multidimensionales: Fórmulas de aplanado 2D y 3D' },
      { id: 'booleanos-cortocircuito', title: '5. Expresiones booleanas, jerarquías y etiquetas de cortocircuito' },
      { id: 'control-flujo-c3d', title: '6. Traducción de if-else, while, do-while y for' },
      { id: 'funciones-io-constantes', title: '7. Subprogramas, llamadas anidadas, I/O en consola y constantes' }
    ],
    sources: [
      { title: 'Generación de Código Intermedio', detail: 'Ing. Mario Ramírez Tobar - Manual completo de C3D, Arreglos, Booleanos y Cuartetos (pág. 1-733)' }
    ]
  },
  {
    id: 'm6',
    number: 6,
    slug: '6-optimizacion',
    title: 'Módulo 6: Generación y Optimización de Código',
    shortTitle: 'Optimización',
    description: 'Bloques básicos, grafos de flujo (CFG), DAG, optimizaciones locales y globales, propagación de constantes, dead code y asignación de registros.',
    badge: 'Back-End',
    topics: [
      { id: 'bloques-basicos-cfg', title: '1. Particionamiento en Bloques Básicos y CFG' },
      { id: 'dag-bloques-basicos', title: '2. Representación en Grafos Acíclicos Dirigidos (DAG)' },
      { id: 'optimizaciones-locales', title: '3. Optimizaciones locales: Plegado, propagación y reducción de fuerza' },
      { id: 'optimizaciones-globales', title: '4. Optimizaciones globales y transformaciones de bucles' },
      { id: 'eliminacion-codigo-muerto', title: '5. Eliminación de código muerto y variables no vivas' },
      { id: 'asignacion-registros', title: '6. Asignación de registros y coloración de grafos (Chaitin)' }
    ],
    sources: [
      { title: 'Generación de Código Intermedio', detail: 'Ing. Mario Ramírez Tobar - Eficiencia de código intermedio y traducción secuencial (pág. 112-173)' }
    ]
  },
  {
    id: 'm7',
    number: 7,
    slug: '7-riscv',
    title: 'Módulo 7: Arquitectura RISC-V y Ensamblador',
    shortTitle: 'RISC-V (RV32I)',
    description: 'RV32I, registros ABI, mnemónicos, Frame Pointer, distribución canónica -offset(fp), j vs jal, Cuádruplas a RISC-V, llamadas y recursión.',
    badge: 'Hardware',
    topics: [
      { id: 'puente-c3d-hardware', title: '1. El puente entre C3D y el silicio' },
      { id: 'glosario-registros-abi', title: '2. Glosario completo de registros ABI (RV32I)' },
      { id: 'mnemonicos-convenciones', title: '3. Mnemónicos RISC-V y reglas nemotécnicas' },
      { id: 'arquitectura-frame-pointer', title: '4. ¿Por qué Frame Pointer (fp/s0) y no sp? Distribución -offset(fp)' },
      { id: 'saltos-j-jal', title: '5. Mecánica de saltos: j (goto) vs jal (subprogramas)' },
      { id: 'matriz-cuadruplas-riscv', title: '6. Matriz canónica de traducción Cuádruplas -> RISC-V' },
      { id: 'casos-estudio-riscv', title: '7. Casos completos: Factorial(4), Cadena A->B->C y QuickSort' }
    ],
    sources: [
      { title: 'De Código 3 Direcciones a RISC-V', detail: 'Ing. Mario Ramírez Tobar - Diapositivas interactivas completas (marito-website.vercel.app)' }
    ]
  },
  {
    id: 'm8',
    number: 8,
    slug: '8-paradigmas',
    title: 'Módulo 8: Paradigmas de Programación y Compilación',
    shortTitle: 'Paradigmas',
    description: 'Análisis, representación en memoria y traducción de código Imperativo, Orientado a Objetos (Heap, this, vtables) y Funcional (closures, TCO).',
    badge: 'Avanzado',
    topics: [
      { id: 'paradigma-imperativo', title: '1. Compilación del paradigma imperativo: Estado, mutabilidad y llamadas' },
      { id: 'poo-layout-heap', title: '2. POO: Distribución de objetos en el Heap y rol del puntero this en RISC-V' },
      { id: 'poo-despacho-vtables', title: '3. POO: Polimorfismo, Tablas Virtuales (vtables) y herencia' },
      { id: 'poo-caso-completo', title: '3b. Caso de Estudio: De Clase Java a RISC-V (Heap & Recursión)' },
      { id: 'funcional-orden-superior', title: '4. Paradigma funcional: Funciones como valores de primera clase' },
      { id: 'funcional-closures-lambdas', title: '5. Implementación de Closures (registros de entorno) y Lambdas' },
      { id: 'funcional-inmutabilidad-tco', title: '6. Optimización de llamadas recursivas de cola (TCO) y evaluación perezosa' }
    ],
    sources: [
      { title: 'De Código 3 Direcciones a RISC-V', detail: 'Ing. Mario Ramírez Tobar - POO en Assembler, Heap vs Stack y Puntero this (Slides 38-41)' },
      { title: 'Generación de Código Intermedio', detail: 'Ing. Mario Ramírez Tobar - Subprogramas y árboles de activación (pág. 5-115)' }
    ]
  }
];

