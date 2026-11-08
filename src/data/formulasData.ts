export interface FormulaItem {
  id: string;
  category: 'Léxico' | 'Sintáctico' | 'Semántico' | 'Código Intermedio' | 'RISC-V';
  name: string;
  latex: string;
  symbols: { symbol: string; meaning: string }[];
  whenToUse: string;
  procedure: string[];
  example: {
    statement: string;
    steps: string[];
    result: string;
  };
  commonErrors: string[];
  practiceExercise: {
    question: string;
    hint: string;
    solution: string;
  };
}

export const FORMULAS: FormulaItem[] = [
  {
    id: 'f-kleene-regex',
    category: 'Léxico',
    name: 'Clausura de Kleene y Clausura Positiva',
    latex: 'R^* = \\bigcup_{i=0}^{\\infty} R^i = \\{\\varepsilon\\} \\cup R \\cup R^2 \\cup \\dots, \\quad R^+ = R R^* = \\bigcup_{i=1}^{\\infty} R^i',
    symbols: [
      { symbol: 'R', meaning: 'Lenguaje regular o patrón de expresión regular base.' },
      { symbol: 'R^*', meaning: 'Clausura de Kleene: cero o más repeticiones de cadenas en R.' },
      { symbol: 'R^+', meaning: 'Clausura positiva: una o más repeticiones de cadenas en R.' },
      { symbol: '\\varepsilon', meaning: 'Cadena vacía (longitud cero).' }
    ],
    whenToUse: 'Definición de tokens que aceptan repetición arbitraria de caracteres, como identificadores `[a-zA-Z][a-zA-Z0-9]*` y literales numéricos `[0-9]+`.',
    procedure: [
      '1. Identificar el conjunto base de símbolos permitidos para la repetición.',
      '2. Determinar si la ausencia total del símbolo es válida (usar Kleene `*`) o si se requiere al menos una ocurrencia (usar positiva `+`).',
      '3. Transformar expresiones equivalentes: `R^+ = R R^*` y `R^* = R^+ \\cup \\{\\varepsilon\\}`.'
    ],
    example: {
      statement: 'Sea el alfabeto $\\Sigma = \\{0, 1\\}$, modelar los identificadores binarios que inician con 1 seguido de cualquier cantidad de dígitos binarios.',
      steps: [
        'Símbolo obligatorio inicial: `1`.',
        'Símbolos siguientes repetibles cero o más veces: $(0 \\mid 1)^*$.',
        'Expresión regular resultante: $1(0 \\mid 1)^*$.'
      ],
      result: '$L = \\{1, 10, 11, 100, 101, 110, 111, \\dots\\}$'
    },
    commonErrors: [
      'Confundir $R^+$ con $R^*$, permitiendo identificadores vacíos inválidos.',
      'Olvidar que $R^0 = \\{\\varepsilon\\}$, no el conjunto vacío $\\emptyset$.'
    ],
    practiceExercise: {
      question: 'Demuestre formalmente si $(a^* b^*)^* = (a \\mid b)^*$.',
      hint: 'Analice si cualquier combinación finita de letras "a" y "b" puede ser generada por ambos lados.',
      solution: 'Ambas expresiones generan $(a \\mid b)^*$, ya que cualquier secuencia arbitraria de símbolos del alfabeto $\\{a, b\\}$ se puede particionar en bloques $a^n b^m$.'
    }
  },
  {
    id: 'f-subconjuntos-thompson',
    category: 'Léxico',
    name: 'Construcción de Subconjuntos: ε-clausura y Transición',
    latex: '\\varepsilon\\text{-clausura}(s) = \\{s\\} \\cup \\bigcup_{p \\in \\varepsilon\\text{-clausura}(s)} \\{q \\mid p \\xrightarrow{\\varepsilon} q\\}, \\quad \\text{mueve}(T, a) = \\bigcup_{s \\in T} \\{q \\mid s \\xrightarrow{a} q\\}',
    symbols: [
      { symbol: 's', meaning: 'Estado individual del autómata no determinista (AFND).' },
      { symbol: 'T', meaning: 'Conjunto de estados del AFND que conforman un meta-estado en el AFD.' },
      { symbol: 'a', meaning: 'Símbolo del alfabeto de entrada ($a \\in \\Sigma$).' },
      { symbol: '\\varepsilon\\text{-clausura}(T)', meaning: 'Conjunto de todos los estados alcanzables desde cualquier estado en T mediante transiciones vacías (épsilon).' }
    ],
    whenToUse: 'Conversión formal de un Autómata Finito No Determinista con transiciones $\\varepsilon$ a un Autómata Finito Determinista (AFD) equivalente ejecutable en tiempo lineal.',
    procedure: [
      '1. Estado inicial del AFD: $S_0 = \\varepsilon\\text{-clausura}(s_{\\text{inicio}})$.',
      '2. Para cada estado no marcado $U$ del AFD y cada símbolo $a \\in \\Sigma$:',
      '   a. Calcular $Dest = \\varepsilon\\text{-clausura}(\\text{mueve}(U, a))$.',
      '   b. Si $Dest$ no existe en la tabla de estados del AFD, agregarlo como nuevo estado.',
      '   c. Registrar la transición $\\delta_{\\text{AFD}}(U, a) = Dest$.',
      '3. Repetir hasta que todos los estados del AFD estén marcados.'
    ],
    example: {
      statement: 'Dado un AFND con transición $\\varepsilon$ desde el estado 0 hacia 1 y 2, y transición con "a" desde 1 hacia 3. Calcular la transición desde el estado inicial con el símbolo "a".',
      steps: [
        '$S_0 = \\varepsilon\\text{-clausura}(\\{0\\}) = \\{0, 1, 2\\}$.',
        '$\\text{mueve}(S_0, \\text{"a"}) = \\text{mueve}(\\{0, 1, 2\\}, \\text{"a"}) = \\{3\\}$.',
        '$S_1 = \\varepsilon\\text{-clausura}(\\{3\\}) = \\{3\\}$.'
      ],
      result: 'Transición en el AFD: $\\delta(S_0, \\text{"a"}) = S_1$.'
    },
    commonErrors: [
      'Olvidar incluir el propio estado $s$ dentro de su $\\varepsilon\\text{-clausura}(s)$.',
      'Aplicar la transición de símbolo antes de calcular la clausura $\\varepsilon$.'
    ],
    practiceExercise: {
      question: 'Si un estado $q$ tiene una transición $\\varepsilon$ hacia sí mismo en bucle, ¿qué ocurre con el cálculo de $\\varepsilon\\text{-clausura}$?',
      hint: 'Considere la noción de punto fijo en teoría de conjuntos.',
      solution: 'El algoritmo utiliza un conjunto visitado (o pila) que ignora estados ya explorados, convergiendo sin caer en bucle infinito.'
    }
  },
  {
    id: 'f-eliminacion-rec-izq',
    category: 'Sintáctico',
    name: 'Eliminación Formal de Recursividad Izquierda',
    latex: 'A \\to A \\alpha_1 \\mid \\dots \\mid A \\alpha_m \\mid \\beta_1 \\mid \\dots \\mid \\beta_n \\implies \\begin{cases} A \\to \\beta_1 A\' \\mid \\dots \\mid \\beta_n A\' \\\\ A\' \\to \\alpha_1 A\' \\mid \\dots \\mid \\alpha_m A\' \\mid \\varepsilon \\end{cases}',
    symbols: [
      { symbol: 'A', meaning: 'Símbolo no terminal con producción recursiva por la izquierda.' },
      { symbol: '\\alpha_i', meaning: 'Secuencia de símbolos que acompaña al no terminal recursivo.' },
      { symbol: '\\beta_j', meaning: 'Secuencia de símbolos que no comienza con el no terminal A.' },
      { symbol: 'A\'', meaning: 'Nuevo no terminal introducido para absorber la cola recursiva derecha.' }
    ],
    whenToUse: 'En la preparación de gramáticas para analizadores sintácticos descendentes (LL(1) o descenso recursivo), donde la recursividad izquierda provocaría un bucle infinito en las funciones de derivación.',
    procedure: [
      '1. Agrupar las producciones de $A$ en aquellas que inician con $A$ (recursivas: $A \\alpha_i$) y las que no (no recursivas: $\\beta_j$).',
      '2. Crear un nuevo no terminal $A\'$.',
      '3. Reemplazar las producciones de $A$ por $A \\to \\beta_j A\'$ para cada $\\beta_j$.',
      '4. Definir las producciones de $A\'$ como $A\' \\to \\alpha_i A\' \\mid \\varepsilon$.',
      '5. Regla vital del PDF de Mario Ramírez Tobar: Si existen acciones semánticas incrustadas, trátelas como símbolos terminales durante la transformación.'
    ],
    example: {
      statement: 'Eliminar la recursividad izquierda de $E \\to E + T \\mid T$.',
      steps: [
        'Identificar: $\\alpha = + T$, $\\beta = T$.',
        'Producciones base: $E \\to T E\'$.',
        'Producciones del sufijo: $E\' \\to + T E\' \\mid \\varepsilon$.'
      ],
      result: '$E \\to T E\', \\quad E\' \\to + T E\' \\mid \\varepsilon$'
    },
    commonErrors: [
      'Olvidar la alternativa vacía $\\varepsilon$ en el nuevo no terminal $A\'$, bloqueando derivaciones terminales.',
      'Aplicar la regla cuando $\\beta$ comienza indirectamente con $A$ sin antes haber expandido las producciones previas.'
    ],
    practiceExercise: {
      question: 'Elimine la recursividad izquierda de: $E \\to E + T \\;\\{\\text{print}(+) \\} \\mid E - T \\mid T$.',
      hint: 'Considere la acción $\\{\\text{print}(+)\\}$ como parte del sufijo $\\alpha_1$.',
      solution: '$E \\to T E\', \\quad E\' \\to + T \\;\\{\\text{print}(+) \\} E\' \\mid - T E\' \\mid \\varepsilon$'
    }
  },
  {
    id: 'f-first-follow',
    category: 'Sintáctico',
    name: 'Cálculo de Conjuntos PRIMERO (FIRST) y SIGUIENTE (FOLLOW)',
    latex: '\\begin{aligned} \\text{FIRST}(\\alpha) &= \\{ a \\in V_T \\mid \\alpha \\Rightarrow^* a \\beta \\} \\cup (\\text{si } \\alpha \\Rightarrow^* \\varepsilon \\text{ entonces } \\{\\varepsilon\\}) \\\\ \\text{FOLLOW}(A) &= \\{ a \\in V_T \\mid S \\Rightarrow^* \\alpha A a \\beta \\} \\cup (\\text{si } S \\Rightarrow^* \\alpha A \\text{ entonces } \\{\\$\\}) \\end{aligned}',
    symbols: [
      { symbol: 'V_T', meaning: 'Conjunto de símbolos terminales de la gramática.' },
      { symbol: 'V_N', meaning: 'Conjunto de símbolos no terminales.' },
      { symbol: '\\$', meaning: 'Marcador de fin de cadena de entrada.' },
      { symbol: '\\Rightarrow^*', meaning: 'Derivación en cero o más pasos.' }
    ],
    whenToUse: 'Construcción de tablas de análisis sintáctico predictivo LL(1) y resolución de conflictos de desplazamiento/reducción en analizadores LR.',
    procedure: [
      '1. PRIMERO de terminal: $\\text{FIRST}(a) = \\{a\\}$.',
      '2. Si $X \\to \\varepsilon$, entonces $\\varepsilon \\in \\text{FIRST}(X)$.',
      '3. Si $X \\to Y_1 Y_2 \\dots Y_k$, agregar $\\text{FIRST}(Y_1) \\setminus \\{\\varepsilon\\}$ a $\\text{FIRST}(X)$. Si $Y_1 \\Rightarrow^* \\varepsilon$, continuar sucesivamente con $Y_2, \\dots$.',
      '4. SIGUIENTE: Colocar $\\$$ en $\\text{FOLLOW}(S)$.',
      '5. Si hay una producción $A \\to \\alpha B \\beta$, todo elemento de $\\text{FIRST}(\\beta) \\setminus \\{\\varepsilon\\}$ va a $\\text{FOLLOW}(B)$.',
      '6. Si $A \\to \\alpha B$ o $A \\to \\alpha B \\beta$ donde $\\beta \\Rightarrow^* \\varepsilon$, todo elemento de $\\text{FOLLOW}(A)$ va a $\\text{FOLLOW}(B)$.'
    ],
    example: {
      statement: 'Calcular FIRST y FOLLOW para: $S \\to A B, \\; A \\to a \\mid \\varepsilon, \\; B \\to b$.',
      steps: [
        '$\\text{FIRST}(A) = \\{a, \\varepsilon\\}$, $\\text{FIRST}(B) = \\{b\\}$.',
        '$\\text{FIRST}(S) = (\\text{FIRST}(A) \\setminus \\{\\varepsilon\\}) \\cup \\text{FIRST}(B) = \\{a, b\\}$.',
        '$\\text{FOLLOW}(S) = \\{\\$\\}$.',
        'En $S \\to A B$: $\\text{FOLLOW}(A) = \\text{FIRST}(B) = \\{b\\}$.',
        '$\\text{FOLLOW}(B) = \\text{FOLLOW}(S) = \\{\\$\\}$.'
      ],
      result: '$\\text{FIRST}(S)=\\{a,b\\}, \\text{FOLLOW}(A)=\\{b\\}, \\text{FOLLOW}(B)=\\{\\$\\}$'
    },
    commonErrors: [
      'Incluir $\\varepsilon$ dentro del conjunto $\\text{FOLLOW}$. Los conjuntos FOLLOW solo contienen terminales y $\\$$.',
      'Olvidar propagar $\\text{FOLLOW}(A)$ cuando el sufijo de una producción deriva en $\\varepsilon$.'
    ],
    practiceExercise: {
      question: 'Dada la producción $A \\to B C$ donde $\\varepsilon \\in \\text{FIRST}(B)$ y $\\varepsilon \\in \\text{FIRST}(C)$, ¿contiene $\\text{FIRST}(A)$ a $\\varepsilon$?',
      hint: 'Revise si la cadena vacía completa puede ser derivada por la concatenación de ambos.',
      solution: 'Sí, porque tanto B como C pueden anularse simultáneamente, lo que permite que $A \\Rightarrow^* \\varepsilon$.'
    }
  },
  {
    id: 'f-aplanado-arreglos',
    category: 'Código Intermedio',
    name: 'Fórmulas de Aplanado de Arreglos Multidimensionales',
    latex: '\\begin{aligned} \\text{Pos}_{2D}(i, j) &= i \\times D_2 + j \\\\ \\text{Pos}_{3D}(i, j, k) &= (i \\times D_2 \\times D_3) + (j \\times D_3) + k \\\\ \\text{Pos}_{ND}(i_1, \\dots, i_n) &= \\sum_{r=1}^{n} \\left( i_r \\times \\prod_{m=r+1}^{n} D_m \\right) \\end{aligned}',
    symbols: [
      { symbol: 'i, j, k', meaning: 'Índices de acceso a las dimensiones respectivas (basados en 0).' },
      { symbol: 'D_1, D_2, D_3', meaning: 'Tamaño (cardinalidad) de cada una de las dimensiones declaradas.' },
      { symbol: '\\text{Pos}', meaning: 'Desplazamiento escalar resultante en el arreglo unidimensional subyacente.' },
      { symbol: 'w', meaning: 'Ancho en bytes de cada elemento según su tipo primitivo (ej. 4 bytes para int).' }
    ],
    whenToUse: 'Traducción de arreglos multidimensionales a Código de Tres Direcciones (C3D) y ensamblador, dado que la memoria física del computador es estrictamente lineal.',
    procedure: [
      '1. Extraer los tamaños de las dimensiones declaradas en la Tabla de Tipos o AST.',
      '2. Para 2 dimensiones: multiplicar el primer índice por la cantidad de columnas ($D_2$) y sumar el segundo índice.',
      '3. Para 3 dimensiones: multiplicar el primer índice por el producto de las dos dimensiones siguientes ($D_2 \\times D_3$), sumar el segundo índice multiplicado por la tercera dimensión ($D_3$), y sumar el tercer índice.',
      '4. En C3D emitir multiplicaciones y sumas escalonadas con variables temporales.'
    ],
    example: {
      statement: 'Sea el arreglo `int a[2][4]`. Calcular el índice aplanado para acceder a `a[1][3]`, tal como se describe en el PDF de Mario Ramírez Tobar.',
      steps: [
        '$i = 1$, $j = 3$, $D_2 = 4$.',
        '$\\text{Pos} = 1 \\times 4 + 3 = 4 + 3 = 7$.',
        'En C3D: `t1 = 1 * 4`, `t2 = t1 + 3`, `dest = a[t2]`.'
      ],
      result: 'Índice lineal: 7 (séptima posición de memoria contigua).'
    },
    commonErrors: [
      'Multiplicar por la primera dimensión en lugar de la segunda dimensión (filas vs columnas).',
      'Olvidar multiplicar el índice final por el tamaño del tipo de dato ($w = 4$ bytes) al traducir a ensamblador con direccionamiento por bytes.'
    ],
    practiceExercise: {
      question: 'Dado un arreglo tridimensional `int matriz[3][5][8]`, determine la fórmula y la posición aplanada de `matriz[2][4][1]`.',
      hint: 'Aplique $\\text{Pos} = (i \\times D_2 \\times D_3) + (j \\times D_3) + k$.',
      solution: '$\\text{Pos} = (2 \\times 5 \\times 8) + (4 \\times 8) + 1 = 80 + 32 + 1 = 113$.'
    }
  },
  {
    id: 'f-marco-pila-offset',
    category: 'RISC-V',
    name: 'Distribución Canónica del Marco con Frame Pointer (-offset(fp))',
    latex: '\\begin{aligned} \\text{Offset}(s0_{\\text{viejo}}) &= 0(fp) \\\\ \\text{Offset}(ra) &= -4(fp) \\\\ \\text{Offset}(\\text{this} / \\text{param}_1) &= -8(fp) \\\\ \\text{Offset}(\\text{local}_i) &= - (12 + 4 \\times (i - 1))(fp) \\\\ \\text{Offset}(\\text{arg}_{k > 8}) &= + (4 \\times (k - 8))(fp) \\end{aligned}',
    symbols: [
      { symbol: 'fp / s0', meaning: 'Registro puntero de marco (Frame Pointer, x8). Base inamovible de la activación.' },
      { symbol: 'ra', meaning: 'Return Address (x1). Dirección de instrucción a la cual retornar con `ret`.' },
      { symbol: 'sp', meaning: 'Stack Pointer (x2). Apuntador al tope móvil inferior de la pila.' },
      { symbol: 'i', meaning: 'Índice de la variable local del usuario ($i \\ge 1$).' }
    ],
    whenToUse: 'Generación de código objeto RISC-V para funciones y métodos, asegurando direccionamiento inalterable para las variables locales sin verse afectadas por las fluctuaciones dinámicas de `sp`.',
    procedure: [
      '1. Prólogo de la función:',
      '   a. Decrementar la pila: `addi sp, sp, -FRAMESIZE` (múltiplo de 16).',
      '   b. Respaldar s0 previo: `sw s0, (FRAMESIZE-4)(sp)`.',
      '   c. Respaldar ra previo: `sw ra, (FRAMESIZE-8)(sp)`.',
      '   d. Establecer fp en la base: `addi s0, sp, (FRAMESIZE-4)`.',
      '2. Respaldar parámetros de registros `a0..a7` en sus ranuras correspondientes (`-8(fp)`, etc.).',
      '3. Acceder a variables locales con desplazamientos negativos constantes.',
      '4. Epílogo: restaurar `ra` y `s0`, reajustar `sp` y ejecutar `ret` (`jr ra`).'
    ],
    example: {
      statement: 'Configurar el marco para una función con 2 variables locales (int total, int factor) y tamaño 32 bytes.',
      steps: [
        'Prólogo: `addi sp, sp, -32`',
        'Guardar s0: `sw s0, 28(sp)`',
        'Guardar ra: `sw ra, 24(sp)`',
        'Fijar s0: `addi s0, sp, 28`',
        'Total en `-12(s0)`, factor en `-16(s0)`.'
      ],
      result: 'Ranuras estables fijadas: 0(fp)=s0_viejo, -4(fp)=ra, -12(fp)=total, -16(fp)=factor.'
    },
    commonErrors: [
      'Usar `sp` directamente para direccionar variables mientras se apilan argumentos para subllamadas.',
      'No alinear el marco de pila a múltiplos de 16 bytes, violando la especificación ABI de RISC-V.'
    ],
    practiceExercise: {
      question: '¿Por qué las funciones hoja (leaf functions) que no llaman a nadie pueden omitir el guardado de `ra`?',
      hint: 'Considere si el registro `ra` es sobreescrito alguna vez dentro del cuerpo de la función.',
      solution: 'Al no invocar ninguna subfunción con `jal`, el registro `ra` nunca se sobreescribe, por lo que el `ret` puede leer directamente el `ra` original sin gastar operaciones de memoria en la pila.'
    }
  },
  {
    id: 'f-formatos-riscv',
    category: 'RISC-V',
    name: 'Codificación y Formatos de Instrucción RV32I',
    latex: '\\begin{aligned} \\text{Tipo-R}: & \\quad [\\text{funct7}_{7}][\\text{rs2}_{5}][\\text{rs1}_{5}][\\text{funct3}_{3}][\\text{rd}_{5}][\\text{opcode}_{7}] \\\\ \\text{Tipo-I}: & \\quad [\\text{imm}[11:0]_{12}][\\text{rs1}_{5}][\\text{funct3}_{3}][\\text{rd}_{5}][\\text{opcode}_{7}] \\\\ \\text{Tipo-S}: & \\quad [\\text{imm}[11:5]_{7}][\\text{rs2}_{5}][\\text{rs1}_{5}][\\text{funct3}_{3}][\\text{imm}[4:0]_{5}][\\text{opcode}_{7}] \\\\ \\text{Tipo-B}: & \\quad [\\text{imm}[12|10:5]_{7}][\\text{rs2}_{5}][\\text{rs1}_{5}][\\text{funct3}_{3}][\\text{imm}[4:1|11]_{5}][\\text{opcode}_{7}] \\end{aligned}',
    symbols: [
      { symbol: 'opcode', meaning: 'Código de operación base (7 bits) que identifica la categoría de la instrucción.' },
      { symbol: 'rd', meaning: 'Registro de destino (5 bits, 32 registros x0-x31).' },
      { symbol: 'rs1, rs2', meaning: 'Registros fuente 1 y 2 (5 bits cada uno).' },
      { symbol: 'funct3, funct7', meaning: 'Campos de función suplementarios que distinguen la operación específica.' },
      { symbol: 'imm', meaning: 'Valor inmediato codificado con signo dentro de la instrucción.' }
    ],
    whenToUse: 'Fase de ensamblado y emisión de código binario máquina en el Back-End del compilador.',
    procedure: [
      '1. Identificar el mnemónico y asociarlo a su clase de formato (R, I, S, B, U, J).',
      '2. Asignar el número de registro hardware para cada alias ABI (ej. `t0` = x5, `a0` = x10, `s0` = x8).',
      '3. Extraer el campo inmediato extendiendo el signo según corresponda.',
      '4. Empaquetar los campos de bits en una palabra fija de 32 bits en formato little-endian.'
    ],
    example: {
      statement: 'Determinar el formato y codificación de la instrucción `addi t0, zero, 25`.',
      steps: [
        'Formato: Tipo-I (aritmética con inmediato).',
        'Opcode: 0010011 (0x13). Funct3: 000.',
        'rd = t0 (x5 = 00101). rs1 = zero (x0 = 00000).',
        'imm = 25 (000000011001 en 12 bits).'
      ],
      result: 'Binario: `000000011001_00000_000_00101_0010011` = 0x01900293.'
    },
    commonErrors: [
      'Confundir el formato Tipo-S (Store `sw`) con Tipo-I (Load `lw`): en los Stores el destino es memoria, no un registro rd.',
      'No considerar el desplazamiento implícito de 1 bit en saltos condicionales Tipo-B (el bit 0 siempre es 0).'
    ],
    practiceExercise: {
      question: '¿Por qué el campo inmediato en el formato Tipo-S está fragmentado en dos secciones separadas (imm[11:5] e imm[4:0])?',
      hint: 'Observe la posición de los campos rs1 y rs2 en los formatos Tipo-R y Tipo-S.',
      solution: 'Para simplificar el hardware de decodificación de la CPU: los campos de registros fuente `rs1` (bits 19:15) y `rs2` (bits 24:20) permanecen en posiciones físicas idénticas en todos los formatos de instrucción.'
    }
  }
];

