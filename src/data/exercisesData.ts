export interface ExerciseItem {
  id: string;
  moduleNumber: number;
  category: 'Teoría' | 'Análisis Léxico' | 'Análisis Sintáctico' | 'Análisis Semántico' | 'C3D' | 'RISC-V';
  difficulty: 'Básico' | 'Intermedio' | 'Avanzado';
  title: string;
  description: string;
  codeSnippet?: string;
  type: 'multiple-choice' | 'error-identification' | 'code-completion';
  options?: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  hint: string;
}

export const EXERCISES: ExerciseItem[] = [
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
    id: 'ex-3',
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
    id: 'ex-4',
    moduleNumber: 4,
    category: 'Análisis Semántico',
    difficulty: 'Intermedio',
    title: 'Identificación de Error Semántico Estático',
    description: 'Observe el siguiente fragmento y determine qué comprobación semántica estática falla exactamente:',
    codeSnippet: 'public void procesar() {\n    int limite = 100;\n    if (limite > 50) {\n        int acumulador = 0;\n        break;\n    }\n    acumulador = acumulador + 10;\n}',
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
    id: 'ex-5',
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
    id: 'ex-6',
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
    id: 'ex-7',
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
    id: 'ex-8',
    moduleNumber: 8,
    category: 'RISC-V',
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
  }
];

