export interface ExerciseItem {
  id: string;
  moduleNumber: number;
  category: 'Teoría' | 'Análisis Léxico' | 'Análisis Sintáctico' | 'Análisis Semántico' | 'C3D' | 'Optimización' | 'RISC-V' | 'Paradigmas';
  difficulty: 'Básico' | 'Intermedio' | 'Avanzado';
  title: string;
  description: string;
  codeSnippet?: string;
  type: 'multiple-choice' | 'error-identification' | 'code-completion';
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  hint: string;
}

export const EXERCISES: ExerciseItem[] = [
  // --- MÓDULO 1: FUNDAMENTOS ---
  {
    id: 'ex-1',
    moduleNumber: 1,
    category: 'Teoría',
    difficulty: 'Básico',
    title: 'Diferencia esencial entre Compilador e Intérprete',
    description: '¿Cuál de las siguientes afirmaciones describe con mayor precisión la diferencia en la fase de traducción y ejecución?',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'El compilador traduce línea por línea en tiempo de ejecución, mientras que el intérprete produce código de máquina en disco.' },
      { id: 'b', text: 'El compilador traduce todo el código fuente previamente generando un archivo ejecutable u objeto independiente, mientras que el intérprete procesa y evalúa las instrucciones directamente en tiempo de ejecución.' },
      { id: 'c', text: 'El intérprete realiza optimizaciones globales de flujo de datos y el compilador solo realiza análisis léxico.' },
      { id: 'd', text: 'El compilador no puede reportar errores de sintaxis antes de la ejecución.' }
    ],
    correctAnswer: 'b',
    hint: 'Piense en cuándo se produce la traducción a código ejecutable y cómo influye en la velocidad de ejecución.',
    explanation: 'El compilador efectúa una traducción completa por adelantado (Ahead-Of-Time), permitiendo análisis globales y generando binarios que la máquina ejecuta a máxima velocidad. El intérprete evalúa las instrucciones a medida que se ejecutan.'
  },
  {
    id: 'ex-2',
    moduleNumber: 1,
    category: 'Teoría',
    difficulty: 'Intermedio',
    title: 'Rol del Enlazador (Linker) y Cargador (Loader)',
    description: '¿Cuál es la función exacta del Enlazador (Linker) en la cadena de construcción de software?',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'Traducir código fuente de alto nivel a código de tres direcciones.' },
      { id: 'b', text: 'Combinar múltiples módulos objeto independientes, resolver referencias externas a funciones de biblioteca y reubicar direcciones para crear un ejecutable único.' },
      { id: 'c', text: 'Comprobar la concordancia estricta de tipos en expresiones aritméticas.' },
      { id: 'd', text: 'Asignar registros de la CPU a variables temporales.' }
    ],
    correctAnswer: 'b',
    hint: 'Considere qué ocurre cuando invoca `printf` o funciones definidas en otros archivos `.o`.',
    explanation: 'El enlazador (linker) toma los archivos objeto (`.o` o `.obj`) y las bibliotecas del sistema, resuelve las referencias externas pendientes (direcciones de símbolos no definidos en ese archivo) y reubica el código en un único espacio binario ejecutable.'
  },

  // --- MÓDULO 2: ANÁLISIS LÉXICO ---
  {
    id: 'ex-3',
    moduleNumber: 2,
    category: 'Análisis Léxico',
    difficulty: 'Básico',
    title: 'Distinción entre Token, Lexema y Patrón',
    description: 'En la sentencia `int total = 45;`, ¿cuál es la correspondencia correcta de acuerdo con el material del Ing. Mario Ramírez Tobar?',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'Token: "45", Lexema: CONST_INT, Patrón: número' },
      { id: 'b', text: 'Token: <ID, "total">, Lexema: "total", Patrón: regla que define letras seguidas de dígitos' },
      { id: 'c', text: 'Token: regla gramatical, Lexema: identificador abstracto, Patrón: el símbolo en memoria' },
      { id: 'd', text: 'Token: "int", Lexema: tipo de dato, Patrón: tupla semántica' }
    ],
    correctAnswer: 'b',
    hint: 'El token es el símbolo abstracto con su atributo, el lexema es la cadena de caracteres real encontrada en el texto, y el patrón es la regla formal (expresión regular).',
    explanation: 'El lexema es la subcadena de texto concreta ("total"). El patrón es la expresión regular que lo rige (ej. `[a-zA-Z_][a-zA-Z0-9_]*`), y el token es la tupla abstracta `<ID, "total">` que se remite al analizador sintáctico.'
  },
  {
    id: 'ex-4',
    moduleNumber: 2,
    category: 'Análisis Léxico',
    difficulty: 'Intermedio',
    title: 'Algoritmo de Construcción de Subconjuntos (AFN a AFD)',
    description: 'En la conversión de un AFN con transiciones épsilon a un AFD determinista, ¿qué representa formalmente cada estado del AFD resultante?',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'Un único estado físico del autómata original sin transiciones épsilon.' },
      { id: 'b', text: 'Un conjunto de estados del AFN alcanzables simultáneamente mediante la operación de épsilon-clausura y transiciones de entrada.' },
      { id: 'c', text: 'Un token de salida en la tabla de símbolos del compilador.' },
      { id: 'd', text: 'Una producción no terminal de la gramática libre de contexto.' }
    ],
    correctAnswer: 'b',
    hint: 'El no-determinismo permite estar en múltiples estados a la vez; el AFD simula esto agrupándolos.',
    explanation: 'El algoritmo de subconjuntos agrupa en cada estado del AFD el conjunto de todos los estados del AFN en los que el sistema podría encontrarse tras consumir una secuencia dada, calculado mediante $\\varepsilon\\text{-clausura}(\\text{mueve}(T, a))$.'
  },

  // --- MÓDULO 3: ANÁLISIS SINTÁCTICO ---
  {
    id: 'ex-5',
    moduleNumber: 3,
    category: 'Análisis Sintáctico',
    difficulty: 'Intermedio',
    title: 'Eliminación de Recursividad Izquierda con Acciones Semánticas',
    description: 'Dada la producción $E \\to E + T \\;\\{\\text{print}(+) \\} \\mid T$, según el método del Ing. Mario Ramírez Tobar donde las acciones semánticas se tratan como terminales, ¿cuál es la transformación equivalente?',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'E -> T E\' ; E\' -> + T { print(+) } E\' | epsilon' },
      { id: 'b', text: 'E -> E + T E\' ; E\' -> { print(+) } | epsilon' },
      { id: 'c', text: 'E -> T + E ; E\' -> T { print(+) }' },
      { id: 'd', text: 'No es posible eliminar recursividad si hay acciones semánticas incrustadas.' }
    ],
    correctAnswer: 'a',
    hint: 'Identifique el sufijo alpha = + T { print(+) } y la base beta = T.',
    explanation: 'Al tratar `{ print(+) }` como parte del sufijo terminal $\\alpha = + T \\{\\text{print}(+) \\}$, la regla estándar $A \\to \\beta R, R \\to \\alpha R \\mid \\varepsilon$ genera limpiamente: $E \\to T E\'$, y $E\' \\to + T \\{\\text{print}(+) \\} E\' \\mid \\varepsilon$.'
  },
  {
    id: 'ex-6',
    moduleNumber: 3,
    category: 'Análisis Sintáctico',
    difficulty: 'Avanzado',
    title: 'Cálculo del Conjunto FOLLOW(A)',
    description: 'Para una gramática con producciones $S \\to A B c$, $B \\to b \\mid \\varepsilon$, ¿qué símbolos pertenecen a $FOLLOW(A)$?',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: '{ b } solamente' },
      { id: 'b', text: '{ b, c }' },
      { id: 'c', text: '{ $ } exclusivamente' },
      { id: 'd', text: '{ epsilon }' },
    ],
    correctAnswer: 'b',
    hint: 'Considere que $B$ sigue a $A$. Como $B$ puede derivar en épsilon, lo que sigue a $B$ también sigue a $A$.',
    explanation: 'Por la regla de FOLLOW, $FIRST(B) - \\{\\varepsilon\\} = \\{b\\} \\subseteq FOLLOW(A)$. Como $\\varepsilon \\in FIRST(B)$, el símbolo siguiente $c$ también sigue a $A$. Por lo tanto, $FOLLOW(A) = \\{b, c\\}$.'
  },
  {
    id: 'ex-7',
    moduleNumber: 3,
    category: 'Análisis Sintáctico',
    difficulty: 'Intermedio',
    title: 'Ambigüedad Gramatical y el Problema del Dangling Else',
    description: '¿Por qué la gramática estándar de condicionales anidados con `if cond then stmt else stmt` es ambigua?',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'Porque genera múltiples árboles de derivación para una misma sentencia, asociando el `else` tanto al `if` interior como al exterior.' },
      { id: 'b', text: 'Porque contiene ciclos infinitos de producciones épsilon.' },
      { id: 'c', text: 'Porque requiere retroceso infinito en analizadores ascendentes LR.' },
      { id: 'd', text: 'Porque viola la compatibilidad de tipos booleanos.' }
    ],
    correctAnswer: 'a',
    hint: 'La ambigüedad significa que existe al menos una cadena con más de un árbol de análisis sintáctico válido.',
    explanation: 'Una gramática es ambigua si genera dos o más árboles sintácticos para la misma entrada. En el caso del dangling else, una sentencia como `if C1 then if C2 then S1 else S2` puede asociar el `else` al primer o al segundo `if` a menos que se use una regla de precedencia.'
  },

  // --- MÓDULO 4: ANÁLISIS SEMÁNTICO ---
  {
    id: 'ex-8',
    moduleNumber: 4,
    category: 'Análisis Semántico',
    difficulty: 'Intermedio',
    title: 'Identificación de Error Semántico Estático',
    description: 'Observe el siguiente fragmento y determine qué comprobación semántica estática falla exactamente:',
    codeSnippet: `public void procesar() {
    int limite = 100;
    if (limite > 50) {
        int acumulador = 0;
        break;
    }
    acumulador = acumulador + 10;
}`,
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'Falla únicamente la comprobación de unicidad de nombres.' },
      { id: 'b', text: 'Falla la comprobación de control de flujo (break fuera de ciclo/switch) y comprobación de ámbito (acumulador fuera de su bloque).' },
      { id: 'c', text: 'Falla la comprobación de equivalencia de tipos estructural.' },
      { id: 'd', text: 'No hay errores semánticos; los errores se disparan en tiempo de ejecución.' }
    ],
    correctAnswer: 'b',
    hint: 'Revise dónde es válido usar `break` y cuál es el alcance del bloque delimitado por las llaves del `if`.',
    explanation: 'Tal como explica el PDF de Mario Ramírez Tobar: 1) `break` solo es legal dentro de ciclos (while, for, do-while) o switch, lo cual viola el control de flujo. 2) La variable `acumulador` fue declarada dentro del ámbito local del `if`, por lo que no es visible fuera de él.'
  },
  {
    id: 'ex-9',
    moduleNumber: 4,
    category: 'Análisis Semántico',
    difficulty: 'Intermedio',
    title: 'Equivalencia de Tipos: Por Nombre vs Estructural',
    description: 'Dos estructuras con campos idénticos pero declaradas bajo nombres distintos (`struct PuntoA { int x, y; }` y `struct PuntoB { int x, y; }`) son equivalentes según:',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'Equivalencia por nombre únicamente.' },
      { id: 'b', text: 'Equivalencia estructural, pero no por nombre.' },
      { id: 'c', text: 'Ninguna de las dos, porque los tipos en compiladores son siempre incompatibles.' },
      { id: 'd', text: 'Equivalencia dinámica en tiempo de ejecución.' }
    ],
    correctAnswer: 'b',
    hint: 'La equivalencia estructural compara los componentes internos campo a campo; la equivalencia por nombre exige idéntico identificador de tipo.',
    explanation: 'Bajo equivalencia estructural, dos tipos son idénticos si tienen la misma composición y orden de campos elementales. Bajo equivalencia por nombre (como en C, C++ y Java), se consideran tipos distintos e incompatibles porque sus nombres difieren.'
  },

  // --- MÓDULO 5: CÓDIGO INTERMEDIO ---
  {
    id: 'ex-10',
    moduleNumber: 5,
    category: 'C3D',
    difficulty: 'Intermedio',
    title: 'Aplanado de Arreglo Bidimensional en C3D',
    description: 'En un arreglo declarado como `int matriz[4][8]`, ¿cuál es el cálculo C3D canónico para asignar el valor 99 a `matriz[2][5]`?',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 't1 = 2 * 4; t2 = t1 + 5; matriz[t2] = 99' },
      { id: 'b', text: 't1 = 2 * 8; t2 = t1 + 5; matriz[t2] = 99' },
      { id: 'c', text: 'matriz[2][5] = 99 (el código intermedio mantiene las dos dimensiones)' },
      { id: 'd', text: 't1 = 5 * 8; t2 = t1 + 2; matriz[t2] = 99' }
    ],
    correctAnswer: 'b',
    hint: 'La fórmula canónica del material es: Posicion = indiceA * dimensionB + indiceB.',
    explanation: 'En C3D los arreglos multidimensionales deben aplanarse. Multiplicamos el índice de la primera dimensión (2) por el tamaño de la segunda dimensión (8) y sumamos el índice de la segunda dimensión (5): $2 \\times 8 + 5 = 21$. Luego: `matriz[21] = 99`.'
  },
  {
    id: 'ex-11',
    moduleNumber: 5,
    category: 'C3D',
    difficulty: 'Avanzado',
    title: 'Aplanado de Arreglo Tridimensional (3D)',
    description: 'Para un arreglo cúbico `int cubo[D1][D2][D3]`, ¿cuál es la fórmula general del desplazamiento para el elemento `cubo[i][j][k]`?',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: '((i * D2 + j) * D3 + k) * tamaño_tipo' },
      { id: 'b', text: '(i + j + k) * D1 * D2 * D3' },
      { id: 'c', text: '(i * D1 + j * D2 + k * D3) * 4' },
      { id: 'd', text: '(i * j * k) * 4' }
    ],
    correctAnswer: 'a',
    hint: 'Se avanza por planos ($i \\times D_2$), luego filas ($+ j$), se multiplica por el ancho de fila ($\\times D_3$) y se añade la columna ($+ k$).',
    explanation: 'La fórmula canónica Row-Major para 3 dimensiones acumula: $((i \\times D_2 + j) \\times D_3 + k) \\times \\text{sizeof}(elemento)$. En C3D se generan temporales para multiplicar por $D_2$, sumar $j$, multiplicar por $D_3$ y sumar $k$.'
  },
  {
    id: 'ex-12',
    moduleNumber: 5,
    category: 'C3D',
    difficulty: 'Intermedio',
    title: 'Diferencia entre Cuádruplas y Tripletas',
    description: '¿Cuál es la diferencia estructural clave entre una Cuádrupla y una Tripleta en representaciones intermedias?',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'Las cuádruplas tienen campo de destino explícito (op, arg1, arg2, dest); las tripletas omiten dest y referencian resultados previos mediante índices (op, arg1, arg2).' },
      { id: 'b', text: 'Las tripletas se usan en procesadores de 64 bits y las cuádruplas en 32 bits.' },
      { id: 'c', text: 'Las cuádruplas no permiten operadores relacionales.' },
      { id: 'd', text: 'Las tripletas no admiten saltos incondicionales goto.' }
    ],
    correctAnswer: 'a',
    hint: 'Piense en cómo se indexan los temporales en memoria intermedia.',
    explanation: 'En las cuádruplas el resultado de cada cálculo tiene un nombre explícito (`t1`, `t2`), facilitando reordenamientos y optimizaciones. En las tripletas, el resultado de una operación se identifica implícitamente por el número de renglón donde se computó, por ejemplo `(0) + (1)`.'
  },

  // --- MÓDULO 6: OPTIMIZACIÓN DE CÓDIGO ---
  {
    id: 'ex-13',
    moduleNumber: 6,
    category: 'Optimización',
    difficulty: 'Intermedio',
    title: 'Propagación de Constantes y Reducción de Fuerza',
    description: 'En una optimización de compilador, reemplazar la instrucción `x = y * 8` por `x = y << 3` es un ejemplo de:',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'Eliminación de código muerto.' },
      { id: 'b', text: 'Reducción de fuerza (Strength Reduction).' },
      { id: 'c', text: 'Desenrollado de ciclos (Loop Unrolling).' },
      { id: 'd', text: 'Propagación de copias.' }
    ],
    correctAnswer: 'b',
    hint: 'Considere el costo computacional de un multiplicador de hardware frente a un desplazador de bits (shifter).',
    explanation: 'La Reducción de Fuerza consiste en sustituir una operación costosa en ciclos de reloj (como la multiplicación entera) por una operación equivalente más rápida y económica (como un desplazamiento de bits a la izquierda por 3 posiciones para multiplicar por $2^3 = 8$).'
  },
  {
    id: 'ex-14',
    moduleNumber: 6,
    category: 'Optimización',
    difficulty: 'Avanzado',
    title: 'Eliminación de Subexpresiones Comunes',
    description: 'Dado el bloque de código C3D:\n`t1 = a + b`\n`x = t1 * c`\n`t2 = a + b`\n`y = t2 * d`\n¿Cómo optimiza un compilador este bloque si `a` y `b` no se modifican?',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'Elimina `t2` y reutiliza `t1`: `y = t1 * d`, ahorrando una suma.' },
      { id: 'b', text: 'Fusiona las variables `x` e `y` en un solo registro.' },
      { id: 'c', text: 'Invierte el orden de ejecución ejecutando primero `y`.' },
      { id: 'd', text: 'Convierte las sumas en desplazamientos a la izquierda.' }
    ],
    correctAnswer: 'a',
    hint: 'La subexpresión `a + b` ya fue calculada y sus operandos siguen intactos en el punto de la segunda evaluación.',
    explanation: 'Al detectar que `a + b` ya está disponible en `t1` y que ningún operando ha sido modificado, el optimizador reutiliza `t1` directamente en la evaluación de `y`, eliminando el cálculo redundante de `t2`.'
  },

  // --- MÓDULO 7: RISC-V RV32I & PILA ---
  {
    id: 'ex-15',
    moduleNumber: 7,
    category: 'RISC-V',
    difficulty: 'Avanzado',
    title: 'Frame Pointer y Convención -offset(fp)',
    description: '¿Por qué la primera variable local del usuario se ubica típicamente en `-12(fp)` y no en `0(fp)` en el esquema del curso?',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'Porque las primeras posiciones están reservadas por convención de hardware para respaldar el antiguo Frame Pointer en 0(fp), la dirección de retorno ra en -4(fp) y el primer parámetro/this en -8(fp).' },
      { id: 'b', text: 'Porque el bus de direcciones de RISC-V solo puede leer desplazamientos impares.' },
      { id: 'c', text: 'Porque los registros temporales t0-t6 se mapean en la memoria flash de la CPU.' },
      { id: 'd', text: 'Es una restricción arbitraria que carece de justificación técnica.' }
    ],
    correctAnswer: 'a',
    hint: 'Revise qué registros vitales deben salvarse en el prólogo para no corromper la cadena de llamadas al volver con `ret`.',
    explanation: 'Tal como detallan las diapositivas del Ing. Mario Ramírez Tobar: `0(fp)` resguarda el enlace dinámico al marco padre (`s0_viejo`), `-4(fp)` resguarda la dirección de retorno `ra`, y `-8(fp)` se reserva para `this` o el primer argumento pasado. Por ende, `-12(fp)` es el primer byte seguro para variables del usuario.'
  },
  {
    id: 'ex-16',
    moduleNumber: 7,
    category: 'RISC-V',
    difficulty: 'Avanzado',
    title: 'Diferencia de Control: j vs jal',
    description: '¿Cuándo debe el compilador emitir estrictamente la instrucción `jal` en lugar de `j`?',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'En cada salto condicional if-else.' },
      { id: 'b', text: 'Únicamente para retornar al inicio de un bucle while.' },
      { id: 'c', text: 'Exclusivamente al invocar un subprograma o método, porque `jal` guarda la dirección de retorno (PC + 4) en el registro `ra`.' },
      { id: 'd', text: 'Cuando el desplazamiento es mayor a 4096 bytes en memoria.' }
    ],
    correctAnswer: 'c',
    hint: '¿Qué instrucción preserva el punto al cual la subfunción debe regresar al terminar con `ret`?',
    explanation: '`j etiqueta` es un salto incondicional simple (equivalente a `goto`) que NO modifica `ra`, usado para control de flujo interno (if, while, for). `jal ra, funcion` guarda `PC + 4` en `ra` para posibilitar el retorno de la llamada.'
  },
  {
    id: 'ex-17',
    moduleNumber: 7,
    category: 'RISC-V',
    difficulty: 'Intermedio',
    title: 'Suma Inmediata: addi y el Registro zero (x0)',
    description: '¿Cuál es la forma canónica en RISC-V para cargar una constante entera (ej. 42) en el registro `t0` usando una sola instrucción?',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'addi t0, zero, 42 (o la pseudoinstrucción li t0, 42)' },
      { id: 'b', text: 'sw t0, 42(zero)' },
      { id: 'c', text: 'lw 42, t0' },
      { id: 'd', text: 'jal t0, 42' }
    ],
    correctAnswer: 'a',
    hint: 'El registro `zero` (x0) siempre contiene el valor 0 de forma inmutable por hardware.',
    explanation: 'En RISC-V, como el registro `zero` siempre vale 0, sumar un inmediato a `zero` (`addi rd, zero, imm`) carga efectivamente ese valor inmediato en el registro destino. El ensamblador ofrece el alias `li rd, imm` para abreviarlo.'
  },
  {
    id: 'ex-18',
    moduleNumber: 7,
    category: 'RISC-V',
    difficulty: 'Avanzado',
    title: 'Alineación de Pila en la ABI de RISC-V',
    description: '¿Por qué las instrucciones de prólogo y epílogo modifican el puntero de pila en múltiplos de 16 bytes (`addi sp, sp, -16`, `-32`, etc.)?',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'Por la especificación formal de la ABI de RISC-V que exige alineación de 16 bytes en la pila para optimizar accesos de caché y compatibilidad con vectores.' },
      { id: 'b', text: 'Porque las instrucciones RISC-V miden 16 bytes cada una.' },
      { id: 'c', text: 'Porque la memoria RAM solo acepta números divisibles por 16.' },
      { id: 'd', text: 'Es un error del ensamblador sin implicación real.' }
    ],
    correctAnswer: 'a',
    hint: 'La arquitectura y los buses de memoria transfieren datos en bloques alineados.',
    explanation: 'La ABI estándar de RISC-V impone que el Stack Pointer (`sp`) esté siempre alineado a 16 bytes en cada llamada a función. Esto optimiza el rendimiento del bus de datos y garantiza soporte para tipos de datos de precisión extendida.'
  },

  // --- MÓDULO 8: PARADIGMAS & POO ---
  {
    id: 'ex-19',
    moduleNumber: 8,
    category: 'Paradigmas',
    difficulty: 'Avanzado',
    title: 'POO: Atributos de Clase en Recursión',
    description: 'Si una clase contiene 20 atributos (80 bytes) y uno de sus métodos recursivos se invoca 1,000 veces, ¿dónde residen esos 80 bytes según la arquitectura explicada en el material de referencia?',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'Se copian 1,000 veces en la pila ocupando 80,000 bytes de marcos de activación.' },
      { id: 'b', text: 'Residen en una única ubicación física en el Heap (0x1000) y cada marco de pila en recursión solo almacena el puntero `this` de 4 bytes en `-8(fp)` para acceder a ellos.' },
      { id: 'c', text: 'Se transforman en constantes estáticas en el segmento `.rodata`.' },
      { id: 'd', text: 'Se asignan a los registros s1 a s11 permanentemente.' }
    ],
    correctAnswer: 'b',
    hint: 'Piense en la separación Heap vs Stack ilustrada en las diapositivas de clase.',
    explanation: 'Las variables de instancia de un objeto viven en el Heap una sola vez. Cada nivel recursivo genera un marco liviano que solo recibe la dirección del objeto en `a0` (`this`) y la almacena en `-8(fp)`, accediendo a los atributos mediante `lw reg, offset(this)`.'
  },
  {
    id: 'ex-20',
    moduleNumber: 8,
    category: 'Paradigmas',
    difficulty: 'Avanzado',
    title: 'Desbordamiento de Argumentos a Pila Positiva (>8 Parámetros)',
    description: 'En una función con 10 parámetros enteros en RISC-V, ¿dónde se reciben los parámetros 9 y 10 dentro del cuerpo de la función llamada?',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'En los registros temporales t0 y t1.' },
      { id: 'b', text: 'En offsets POSITIVOS respecto al Frame Pointer: 0(fp) y 4(fp) (o en el marco del llamador), porque desbordaron el límite de registros a0-a7.' },
      { id: 'c', text: 'Se descartan porque la CPU no puede recibir más de 8 parámetros.' },
      { id: 'd', text: 'En la memoria Heap a partir de 0x1000.' }
    ],
    correctAnswer: 'b',
    hint: 'RISC-V cuenta con 8 registros de argumentos (a0 a a7). Los extras se apilan en el marco llamador antes del salto.',
    explanation: 'La convención de llamada estipula que hasta 8 argumentos se transfieren en `a0` a `a7`. A partir del noveno argumento, el llamador los empuja a la pila. Tras el enlace del Frame Pointer (`s0`), la función los lee en offsets positivos: `0(fp)`, `4(fp)`, etc.'
  },
  {
    id: 'ex-21',
    moduleNumber: 8,
    category: 'Paradigmas',
    difficulty: 'Avanzado',
    title: 'Preservación de Registros Callee-Saved en Fibonacci Recursivo',
    description: 'En una función como `fib(n-1) + fib(n-2)`, ¿por qué es imperativo resguardar el resultado de la primera llamada en un registro callee-saved (`s1`) o en la pila?',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'Porque la segunda llamada a `fib` sobreescribirá inmediatamente el registro `a0` con su propio valor de retorno, destruyendo el resultado de la primera llamada si no fue resguardado.' },
      { id: 'b', text: 'Porque la CPU entra en pánico si dos llamadas ocurren en el mismo ciclo.' },
      { id: 'c', text: 'Porque el registro `ra` se vuelve de solo lectura tras la primera llamada.' },
      { id: 'd', text: 'No es necesario; RISC-V almacena todos los resultados históricos en hardware.' }
    ],
    correctAnswer: 'a',
    hint: 'Todas las funciones retornan su resultado en el mismo registro físico `a0`.',
    explanation: 'En recursión múltiple, la primera llamada retorna su valor en `a0`. Para invocar la segunda llamada se debe usar `a0` como argumento (`n - 2`), y su retorno sobreescribirá `a0`. Por tanto, el compilador debe salvar el primer resultado en un registro preservado (`s1`) o en el marco de pila local.'
  },
  {
    id: 'ex-22',
    moduleNumber: 8,
    category: 'Paradigmas',
    difficulty: 'Intermedio',
    title: 'Compilación de Funciones Lambda y Closures',
    description: 'Desde la perspectiva del compilador, ¿qué estructura debe generar internamente para representar una clausura (closure) que captura variables de su entorno léxico?',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'Una variable global estática en `.data`.' },
      { id: 'b', text: 'Un par o estructura anónima que contiene: 1) un puntero al código compilado de la función, y 2) una referencia o copia de las variables capturadas (marco de entorno).' },
      { id: 'c', text: 'Un archivo `.o` temporal en el sistema de archivos.' },
      { id: 'd', text: 'Una instrucción especial de hardware que clona la memoria RAM.' }
    ],
    correctAnswer: 'b',
    hint: 'Una función de orden superior necesita tanto el código ejecutable como el contexto de las variables que atrapó.',
    explanation: 'Un closure no es un simple puntero a función: requiere el puntero a las instrucciones más el registro de activación o estructura que almacena las variables libres capturadas, garantizando que sigan vivas aunque la función contenedora haya terminado.'
  },
  {
    id: 'ex-23',
    moduleNumber: 2,
    category: 'Análisis Léxico',
    difficulty: 'Avanzado',
    title: 'Construcción de Thompson: Clausura de Kleene (R*)',
    description: 'En el algoritmo de Thompson, ¿cuántos nuevos estados y cuántas transiciones épsilon se introducen para construir el AFN de la clausura de Kleene $R^*$ a partir del AFN de $R$?',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: '2 nuevos estados y 4 transiciones épsilon (hacia adelante, el lazo de repetición y el bypass directo).' },
      { id: 'b', text: 'Ningún estado nuevo, solo se invierten las flechas del autómata.' },
      { id: 'c', text: '1 estado nuevo y 1 transición nula.' },
      { id: 'd', text: 'Depende del número de caracteres del alfabeto.' }
    ],
    correctAnswer: 'a',
    hint: 'Se requiere un nuevo estado inicial y un nuevo estado final, permitiendo tanto 0 repeticiones como bucles infinitos.',
    explanation: 'La construcción canónica de Thompson para $R^*$ agrega: 1 nuevo estado inicial y 1 nuevo estado final, conectados mediante: 1) épsilon del nuevo inicio al inicio de $R$, 2) épsilon del final de $R$ al nuevo final, 3) épsilon del final de $R$ al inicio de $R$ (bucle), y 4) épsilon del nuevo inicio al nuevo final (bypass para la cadena vacía).'
  },
  {
    id: 'ex-24',
    moduleNumber: 4,
    category: 'Análisis Semántico',
    difficulty: 'Avanzado',
    title: 'Atributos Sintetizados vs Atributos Heredados en DSGs',
    description: 'En una Definición Dirigida por la Sintaxis (DDS), ¿cuál es la diferencia de flujo de evaluación entre un atributo sintetizado y uno heredado?',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'El sintetizado se computa a partir de los valores de los hijos del nodo (flujo ascendente); el heredado se computa a partir del padre o hermanos del nodo (flujo descendente/lateral).' },
      { id: 'b', text: 'Los sintetizados solo admiten cadenas de texto y los heredados solo números.' },
      { id: 'c', text: 'Los atributos sintetizados se calculan en tiempo de ejecución y los heredados en preprocesamiento.' },
      { id: 'd', text: 'Son exactamente idénticos en dirección de cálculo.' }
    ],
    correctAnswer: 'a',
    hint: 'Piense en cómo se evalúa el valor numérico de una expresión (desde las hojas hacia la raíz) versus la propagación de un tipo declarado hacia una lista de identificadores.',
    explanation: 'Un atributo sintetizado en el nodo $N$ depende exclusivamente de los hijos de $N$ (típico de evaluación de expresiones matemáticas de abajo hacia arriba). Un atributo heredado depende del padre de $N$ o de sus hermanos (típico de propagación de tipos de datos hacia variables declaradas en la misma sentencia).'
  },
  {
    id: 'ex-25',
    moduleNumber: 6,
    category: 'Optimización',
    difficulty: 'Intermedio',
    title: 'Eliminación de Código Muerto (Dead Code Elimination)',
    description: '¿Bajo qué condición estricta una instrucción de asignación `x = expr` califica como código muerto para ser eliminada de forma segura?',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'Cuando el valor calculado para `x` nunca se lee posteriormente en ninguna ruta de ejecución futura y `expr` no produce efectos secundarios (como I/O o excepciones).' },
      { id: 'b', text: 'Cuando `expr` contiene números pares.' },
      { id: 'c', text: 'Únicamente cuando la variable `x` es local y no global.' },
      { id: 'd', text: 'Cuando la instrucción está dentro de un bucle for.' }
    ],
    correctAnswer: 'a',
    hint: 'El código muerto es aquel cuyo cómputo no afecta en absoluto la salida observable del programa.',
    explanation: 'Una asignación es código muerto si la variable `x` es "muerta" (su valor nunca se utilizará antes de ser sobreescrito o antes de finalizar la función) y la expresión de la derecha no posee efectos colaterales (llamadas a subprogramas con mutación de memoria o I/O).'
  },

  // --- C3D: PREGUNTAS ADICIONALES (MÓDULO 5) ---
  {
    id: 'ex-26',
    moduleNumber: 5,
    category: 'C3D',
    difficulty: 'Intermedio',
    title: 'Generación C3D para sentencia while',
    description: 'Para el ciclo `while (i < n) { suma = suma + arr[i]; i = i + 1; }`, ¿cuál es la estructura canónica de etiquetas e instrucciones C3D?',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'L_TEST: if i >= n goto L_END; t0 = i * 4; t1 = arr + t0; t2 = Heap[t1]; suma = suma + t2; i = i + 1; goto L_TEST; L_END:' },
      { id: 'b', text: 'while_start: suma = suma + arr[i]; if i < n goto while_start' },
      { id: 'c', text: 'for i = 0 to n: suma += arr[i]' },
      { id: 'd', text: 'L_END: if i >= n return; L_TEST: suma = suma + arr[i]; i = i + 1' }
    ],
    correctAnswer: 'a',
    hint: 'El while se descompone en: etiqueta de evaluación inicial, salto condicional de salida invertido con goto, cuerpo y goto de retorno al test.',
    explanation: 'En Código de Tres Direcciones, un bucle while se lineariza así: 1) Etiqueta de inicio `L_TEST`, 2) Condición invertida con salto a la salida `if i >= n goto L_END`, 3) Cuerpo del ciclo (con cálculo aplanado de desplazamiento arr[i] en Heap), 4) `goto L_TEST` para reevaluar, 5) Etiqueta `L_END` para continuar la ejecución secuencial.'
  },
  {
    id: 'ex-27',
    moduleNumber: 5,
    category: 'C3D',
    difficulty: 'Avanzado',
    title: 'Instrucción param y call en invocaciones C3D',
    description: '¿Cuál es la función exacta de `param t0; param t1; t2 = call func, 2` en C3D y cuándo se emite?',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'Declara dos variables globales t0 y t1 en la cabecera de func.' },
      { id: 'b', text: 'Se emite estrictamente en el sitio de llamada (caller) para pasar argumentos antes de invocar un subprograma o método, y el número 2 indica la cantidad de parámetros consumidos.' },
      { id: 'c', text: 'Sirve para recibir parámetros dentro del cuerpo de la función llamada.' },
      { id: 'd', text: 'Es una instrucción exclusiva de lenguajes interpretados sin tipado.' }
    ],
    correctAnswer: 'b',
    hint: 'La instrucción `param` solo se usa cuando se invoca una función o método con argumentos (incluyendo llamadas recursivas), preparando los datos antes del `call`.',
    explanation: 'En C3D, `param` NO se utiliza dentro del cuerpo de la función para declarar variables receptoras; se emite únicamente en el sitio de llamada (`caller`) antes de la instrucción `call`. La instrucción `t2 = call func, 2` consume los 2 `param` previos y asigna el retorno en `t2`.'
  },
  {
    id: 'ex-28',
    moduleNumber: 5,
    category: 'C3D',
    difficulty: 'Avanzado',
    title: 'Acceso a atributos en POO con Heap en C3D',
    description: 'En un método de clase, la asignación `this.saldo = this.saldo + monto` (donde `saldo` reside en el offset 0 de la instancia en Heap), ¿cómo se traduce a C3D cumpliendo el principio de máximo 3 accesos?',
    codeSnippet: `// this: referencia a la instancia en Heap
// saldo: offset 0
// monto: parámetro local`,
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'this.saldo = this.saldo + monto' },
      { id: 'b', text: 't0 = Heap[this + 0]; t1 = t0 + monto; Heap[this + 0] = t1' },
      { id: 'c', text: 'saldo = saldo + monto' },
      { id: 'd', text: 't0 = *this; t0 = t0 + monto; *this = t0' }
    ],
    correctAnswer: 'b',
    hint: 'Cada lectura y escritura en memoria Heap debe ser explícita mediante un temporal intermedio.',
    explanation: 'De acuerdo con las reglas de C3D explicadas por el Ing. Mario Ramírez Tobar: 1) Se carga el atributo desde Heap a un temporal: `t0 = Heap[this + 0]`. 2) Se efectúa la suma puramente aritmética: `t1 = t0 + monto`. 3) Se escribe el resultado actualizado de vuelta a la memoria Heap: `Heap[this + 0] = t1`.'
  },
  {
    id: 'ex-29',
    moduleNumber: 5,
    category: 'C3D',
    difficulty: 'Intermedio',
    title: 'Restricción de los 3 operandos en C3D',
    description: '¿Cuál de las siguientes instrucciones viola formalmente la definición canónica de Código de Tres Direcciones?',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 't1 = a + b' },
      { id: 'b', text: 't2 = Heap[this + 4]' },
      { id: 'c', text: 'x = a + b * c - d' },
      { id: 'd', text: 'if t1 >= t2 goto L1' }
    ],
    correctAnswer: 'c',
    hint: 'Una instrucción de C3D admite a lo sumo un operador y un resultado por sentencia.',
    explanation: 'La instrucción `x = a + b * c - d` contiene tres operadores (`+`, `*`, `-`) y cuatro operandos fuente. El generador de C3D debe descomponerla obligatoriamente en pasos atómicos: `t1 = b * c`, `t2 = a + t1`, `x = t2 - d`.'
  },
  {
    id: 'ex-30',
    moduleNumber: 5,
    category: 'C3D',
    difficulty: 'Intermedio',
    title: 'Codificación de booleanos (true/false) en C3D',
    description: 'En el esquema de C3D de compiladores, ¿cómo se representan los valores booleanos en asignaciones y comparaciones condicionales?',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'Como cadenas de texto literales "true" y "false".' },
      { id: 'b', text: 'Como enteros numéricos donde 1 representa true y 0 representa false, permitiendo saltos con `if var == 1 goto L_VERDADERO`.' },
      { id: 'c', text: 'Como punteros nulos en el Heap.' },
      { id: 'd', text: 'Como instrucciones ecall de parada de sistema.' }
    ],
    correctAnswer: 'b',
    hint: 'En representaciones intermedias y de máquina, los valores de verdad se reducen a valores enteros de 32 bits.',
    explanation: 'En C3D los booleanos se implementan canónicamente con la convención estándar: `false = 0` y `true = 1`. De este modo, `bandera = true` se procesa como `bandera = 1` y las condiciones se evalúan mediante comparaciones numéricas relacionales estándar.'
  },
  {
    id: 'ex-31',
    moduleNumber: 5,
    category: 'C3D',
    difficulty: 'Básico',
    title: 'Naturaleza de los Temporales (t0, t1, t2...)',
    description: '¿Qué representan conceptualmente las variables temporales generadas en C3D?',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'Registros fijos del microprocesador x0 a x31.' },
      { id: 'b', text: 'Variables virtuales intermedias generadas por el compilador para almacenar valores parciales de expresiones, independientes de la arquitectura de destino.' },
      { id: 'c', text: 'Constantes de la sección .rodata.' },
      { id: 'd', text: 'Etiquetas de memoria RAM de solo lectura.' }
    ],
    correctAnswer: 'b',
    hint: 'El código intermedio es independiente del hardware; los temporales luego se mapean a registros o ranuras de pila.',
    explanation: 'Los temporales en C3D son variables ilimitadas abstractas creadas por el analizador semántico o generador de TAC. En una fase posterior de generación de código final (como RISC-V), el asignador de registros mapeará estos temporales a registros físicos reales (`t0-t6`, `s0-s11`) o a la pila.'
  },

  // --- RISC-V: PREGUNTAS ADICIONALES (MÓDULO 7) ---
  {
    id: 'ex-32',
    moduleNumber: 7,
    category: 'RISC-V',
    difficulty: 'Intermedio',
    title: 'Carga de datos: lw vs lb vs lh',
    description: 'En la arquitectura RISC-V RV32I, ¿cuál es la diferencia entre `lw`, `lh` y `lb`?',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'lw carga 32 bits (palabra completa); lh carga 16 bits con extensión de signo; lb carga 8 bits con extensión de signo a los 32 bits del registro destino.' },
      { id: 'b', text: 'lw carga solo enteros positivos; lb carga números con coma flotante.' },
      { id: 'c', text: 'Las tres instrucciones cargan 32 bits sin ninguna diferencia en hardware.' },
      { id: 'd', text: 'lb y lh solo pueden leer de la pila y nunca del Heap.' }
    ],
    correctAnswer: 'a',
    hint: 'El sufijo denota el ancho en bytes: w = word (4 bytes), h = half-word (2 bytes), b = byte (1 byte).',
    explanation: '`lw` (load word) carga 32 bits. `lh` (load half-word) carga 16 bits y extiende el bit 15 de signo a los 32 bits del registro destino. `lb` (load byte) carga 8 bits con extensión de signo. Para cargas sin signo existen las variantes `lhu` y `lbu`.'
  },
  {
    id: 'ex-33',
    moduleNumber: 7,
    category: 'RISC-V',
    difficulty: 'Avanzado',
    title: 'Estructura del Prólogo y Epílogo Canónico con Frame Pointer',
    description: 'En la convención de cátedra del Ing. Mario Ramírez Tobar, ¿cuál es la secuencia correcta del prólogo para una función que reserva marco en la pila?',
    codeSnippet: `# Ejemplo de prólogo:
addi sp, sp, -16
sw ra, 12(sp)
sw s0, 8(sp)
addi s0, sp, 16`,
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'Reserva 16 bytes (múltiplo de 16), resguarda la dirección de retorno ra, resguarda el Frame Pointer anterior s0 y ancla el nuevo s0 en la base del marco.' },
      { id: 'b', text: 'Borra la memoria RAM y reinicia los registros temporales t0 a t6.' },
      { id: 'c', text: 'Copia el contenido del Heap a la sección .text.' },
      { id: 'd', text: 'Es un bucle infinito que comprueba desbordamientos de enteros.' }
    ],
    correctAnswer: 'a',
    hint: 'La ABI exige alinear la pila a 16 bytes y salvar los registros de enlace dinámico antes de ejecutar el cuerpo.',
    explanation: 'El prólogo canónico: 1) `addi sp, sp, -16` decrementa la pila en múltiplo de 16. 2) `sw ra, 12(sp)` guarda la dirección de retorno para volver con `ret`. 3) `sw s0, 8(sp)` preserva el FP del llamador. 4) `addi s0, sp, 16` establece el nuevo Frame Pointer desde donde se indexan variables locales con offsets negativos.'
  },
  {
    id: 'ex-34',
    moduleNumber: 7,
    category: 'RISC-V',
    difficulty: 'Intermedio',
    title: 'Desplazamiento slli para indexación de arreglos',
    description: 'En la traducción de `arr[i]` (donde cada elemento es int de 4 bytes), ¿por qué se utiliza `slli t3, t1, 2`?',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'Porque desplaza los bits de i dos posiciones a la izquierda, multiplicando i por 2^2 = 4 (el tamaño de cada int32) de forma óptima en 1 ciclo de reloj.' },
      { id: 'b', text: 'Porque suma 2 al índice i para evitar desbordamiento.' },
      { id: 'c', text: 'Porque divide i entre 4 para obtener la fila de la matriz.' },
      { id: 'd', text: 'Porque en RISC-V las direcciones de memoria son impares.' }
    ],
    correctAnswer: 'a',
    hint: 'Desplazar a la izquierda k bits equivale matemáticamente a multiplicar por 2^k.',
    explanation: '`slli` (Shift Left Logical Immediate) desplaza el registro hacia la izquierda. Desplazar por 2 posiciones (`slli t3, t1, 2`) multiplica el índice por 4, calculando el desplazamiento en bytes exacto para un elemento int32 sin requerir una instrucción `mul` más costosa.'
  },
  {
    id: 'ex-35',
    moduleNumber: 7,
    category: 'RISC-V',
    difficulty: 'Avanzado',
    title: 'Registros Callee-Saved vs Caller-Saved en la ABI',
    description: 'Si una función recursiva o método modifica el registro `s1`, ¿qué obligación impone la convención ABI de RISC-V?',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'Ninguna; todos los registros se pueden sobreescribir libremente.' },
      { id: 'b', text: 'Es un registro callee-saved (preservado por el llamado); la función debe respaldarlo en la pila en el prólogo y restaurar su valor original antes de retornar con `ret`.' },
      { id: 'c', text: 'Debe emitir un ecall de error inmediatamente.' },
      { id: 'd', text: 'Los registros s1 a s11 son de solo lectura y no se pueden escribir.' }
    ],
    correctAnswer: 'b',
    hint: 'Los registros con prefijo `s` (saved) pertenecen al llamador y deben preservarse intactos.',
    explanation: 'En RISC-V: los registros `t0-t6` y `a0-a7` son caller-saved (el llamador asume que pueden cambiar tras una llamada). En contraste, `s0-s11` son callee-saved: si la subrutina los utiliza (como en Fibonacci para guardar `fib(n-1)`), está obligada a guardarlos en su marco y restaurarlos antes del retorno.'
  },
  {
    id: 'ex-36',
    moduleNumber: 7,
    category: 'RISC-V',
    difficulty: 'Básico',
    title: 'Expansión de la pseudoinstrucción ret',
    description: '¿A qué instrucción base de hardware equivale la pseudoinstrucción `ret` en RISC-V?',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'jalr zero, ra, 0 (salto indirecto a la dirección en ra descartando el nuevo PC en zero).' },
      { id: 'b', text: 'jal zero, 0' },
      { id: 'c', text: 'lw pc, 0(sp)' },
      { id: 'd', text: 'beq zero, zero, ra' }
    ],
    correctAnswer: 'a',
    hint: 'El retorno utiliza el registro de enlace `ra` (x1) que guardó `PC + 4` durante el `jal`.',
    explanation: 'La instrucción `ret` es un mnemónico ensamblador para `jalr zero, ra, 0`: transfiere el control de ejecución a la dirección apuntada por `ra` y descarta el guardado del siguiente enlace usando el registro `zero` (x0).'
  },
  {
    id: 'ex-37',
    moduleNumber: 7,
    category: 'RISC-V',
    difficulty: 'Intermedio',
    title: 'Llamadas al sistema (ecall) para impresión y salida',
    description: 'En el entorno de ejecución de RISC-V, ¿cuál es el procedimiento estándar para invocar un servicio del sistema mediante `ecall`?',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'Cargar los argumentos en `a0-a2`, colocar el código del servicio solicitado en `a7` y ejecutar la instrucción `ecall`.' },
      { id: 'b', text: 'Escribir el texto directamente en el puerto 80 del procesador con `out`.' },
      { id: 'c', text: 'Hacer un salto `jal` a la dirección 0x00000000.' },
      { id: 'd', text: 'Modificar el registro Frame Pointer s0 a 0.' }
    ],
    correctAnswer: 'a',
    hint: 'El registro `a7` contiene el número de llamada al sistema (syscall ID) y `a0` el argumento principal.',
    explanation: 'La convención de syscalls en RISC-V estipula: colocar el número de servicio en el registro `a7` (ej. 4 para print_string, 1 para print_int, 10 para exit), los argumentos en `a0` (ej. dirección de la cadena cargada con `la a0, str`) y disparar la excepción controlada con `ecall`.'
  },
  {
    id: 'ex-38',
    moduleNumber: 7,
    category: 'RISC-V',
    difficulty: 'Avanzado',
    title: 'Multiplicación entera y la Extensión M (RV32M)',
    description: '¿Qué instrucción realiza la multiplicación de 32 bits con resultado de 32 bits en RISC-V y cuál es su formato?',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'mul rd, rs1, rs2 — Instrucción Tipo-R de la extensión estándar M de hardware.' },
      { id: 'b', text: 'mult rd, imm — Instrucción Tipo-I' },
      { id: 'c', text: 'imul rd, rs1, rs2, rs3 — Instrucción Tipo-J' },
      { id: 'd', text: 'RISC-V no admite multiplicación en hardware; siempre se emulan sumas sucesivas.' }
    ],
    correctAnswer: 'a',
    hint: 'La extensión M añade multiplicación y división en formato Registro-Registro (Tipo-R).',
    explanation: '`mul rd, rs1, rs2` pertenece a la extensión estándar RV32M. Multiplica los registros rs1 y rs2 y almacena los 32 bits menos significativos del producto en rd. Es una instrucción de formato Tipo-R con opcode `0110011` y funct3 `000`.'
  },
  {
    id: 'ex-39',
    moduleNumber: 7,
    category: 'RISC-V',
    difficulty: 'Intermedio',
    title: 'Directivas esenciales: .data, .text, .globl y .string',
    description: '¿Cuál es el propósito exacto de las directivas `.data`, `.text`, `.globl` y `.string` en un archivo ensamblador?',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: '.data abre el segmento de datos estáticos/cadenas; .text abre la sección de instrucciones ejecutables; .globl exporta un símbolo al enlazador; .string define una cadena terminada en byte nulo (0x00).' },
      { id: 'b', text: 'Son comandos del sistema operativo que formatean el disco duro.' },
      { id: 'c', text: 'Son instrucciones de la ALU ejecutadas por la CPU en tiempo de ejecución.' },
      { id: 'd', text: 'Son palabras reservadas de Java que se conservan en ensamblador.' }
    ],
    correctAnswer: 'a',
    hint: 'Las directivas del ensamblador empiezan con punto (.) y no generan instrucciones directas de CPU sino que guían la organización del archivo objeto.',
    explanation: 'Las directivas organizan la estructura del binario: `.data` reserva memoria para literales constantes y variables globales, `.string "..."` genera los bytes de la cadena seguidos de `\\0`, `.text` ubica el código en la memoria de instrucciones y `.globl nombre` publica el símbolo para que el enlazador (linker) resuelva su dirección externa.'
  },
  {
    id: 'ex-40',
    moduleNumber: 7,
    category: 'RISC-V',
    difficulty: 'Avanzado',
    title: 'Paso de más de 8 argumentos y Pila Positiva',
    description: 'Cuando una función tiene 10 parámetros enteros en RISC-V, ¿por qué los parámetros 9 y 10 se leen con offsets positivos como `0(fp)` y `4(fp)`?',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'Porque el llamador los empujó en su marco de pila antes de la llamada, quedando físicamente por encima del nuevo Frame Pointer anclado en el prólogo.' },
      { id: 'b', text: 'Porque los offsets negativos están prohibidos por el microprocesador.' },
      { id: 'c', text: 'Porque se almacenan en el registro program counter.' },
      { id: 'd', text: 'Es un error de compilación; ninguna función puede recibir más de 8 argumentos.' }
    ],
    correctAnswer: 'a',
    hint: 'Los primeros 8 argumentos se transfieren en `a0-a7`. Los excedentes los empuja el llamador a la pila antes del salto.',
    explanation: 'La convención de llamada estipula que los argumentos que desbordan los 8 registros ABI (`a0-a7`) se colocan en la pila del llamador. Cuando la función llamada ejecuta su prólogo y establece `s0 = sp`, esos argumentos quedan en la región superior a la base del marco, leyéndose con offsets positivos: `0(s0)`, `4(s0)`, etc.'
  },
  {
    id: 'ex-41',
    moduleNumber: 7,
    category: 'RISC-V',
    difficulty: 'Intermedio',
    title: 'Diferencia de control: jal vs j',
    description: '¿Por qué para invocar un subprograma se debe usar `jal` y no `j`?',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'Porque `jal` almacena la dirección de retorno (PC + 4) en el registro `ra`, permitiendo al subprograma regresar con `ret` al terminar.' },
      { id: 'b', text: 'Porque `j` solo funciona si la función está en la misma línea de código.' },
      { id: 'c', text: 'Porque `jal` ejecuta la función en modo de 64 bits.' },
      { id: 'd', text: 'Porque `j` desactiva las interrupciones del procesador.' }
    ],
    correctAnswer: 'a',
    hint: 'La letra "l" en `jal` significa "Link" (enlazar la dirección de retorno en el registro de enlace).',
    explanation: '`j etiqueta` es un salto incondicional puro (equivalente a `goto`) que descarta la dirección de retorno (`jal zero, offset`). Para invocar funciones o métodos es indispensable `jal ra, funcion` (o pseudoinstrucción `call funcion`), que resguarda la dirección de la siguiente instrucción en `ra` para que el `ret` pueda regresar.'
  }
];
