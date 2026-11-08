export interface RiscvKeywordItem {
  id: string;
  category: 'Opcode' | 'Pseudoinstrucción' | 'Registro' | 'Directiva' | 'Syscall' | 'Formato';
  name: string;
  syntax: string;
  format?: string;
  expansion?: string;
  description: string;
  example: string;
}

export const RISCV_RESERVED_WORDS: RiscvKeywordItem[] = [
  // --- OPCODES RV32I BÁSICOS ---
  {
    id: 'op-add',
    category: 'Opcode',
    name: 'add',
    syntax: 'add rd, rs1, rs2',
    format: 'Tipo-R',
    description: 'Suma con signo de 32 bits de dos registros: rd = rs1 + rs2. Ignora desbordamiento aritmético.',
    example: 'add t0, a0, a1    # t0 = a0 + a1'
  },
  {
    id: 'op-addi',
    category: 'Opcode',
    name: 'addi',
    syntax: 'addi rd, rs1, imm',
    format: 'Tipo-I',
    description: 'Suma de un registro con un valor inmediato de 12 bits con signo (-2048 a +2047): rd = rs1 + imm.',
    example: 'addi sp, sp, -32  # Reserva 32 bytes en la pila'
  },
  {
    id: 'op-sub',
    category: 'Opcode',
    name: 'sub',
    syntax: 'sub rd, rs1, rs2',
    format: 'Tipo-R',
    description: 'Resta de dos registros: rd = rs1 - rs2.',
    example: 'sub t2, t0, t1    # t2 = t0 - t1'
  },
  {
    id: 'op-mul',
    category: 'Opcode',
    name: 'mul',
    syntax: 'mul rd, rs1, rs2',
    format: 'Tipo-R (Ext. M)',
    description: 'Multiplica los 32 bits inferiores de dos registros: rd = (rs1 * rs2)[31:0].',
    example: 'mul a0, t0, a0    # a0 = n * factorial(n - 1)'
  },
  {
    id: 'op-div',
    category: 'Opcode',
    name: 'div',
    syntax: 'div rd, rs1, rs2',
    format: 'Tipo-R (Ext. M)',
    description: 'División entera con signo: rd = rs1 / rs2. Si rs2 es 0, no genera trampa; rd = -1.',
    example: 'div t0, t1, t2    # t0 = t1 / t2'
  },
  {
    id: 'op-rem',
    category: 'Opcode',
    name: 'rem',
    syntax: 'rem rd, rs1, rs2',
    format: 'Tipo-R (Ext. M)',
    description: 'Resto o residuo de la división entera con signo (módulo): rd = rs1 % rs2.',
    example: 'rem t3, t0, t1    # t3 = t0 % t1'
  },
  {
    id: 'op-and',
    category: 'Opcode',
    name: 'and',
    syntax: 'and rd, rs1, rs2',
    format: 'Tipo-R',
    description: 'Operación lógica AND bit a bit entre dos registros: rd = rs1 & rs2.',
    example: 'and t0, t1, t2    # t0 = t1 AND t2'
  },
  {
    id: 'op-andi',
    category: 'Opcode',
    name: 'andi',
    syntax: 'andi rd, rs1, imm',
    format: 'Tipo-I',
    description: 'Operación lógica AND con un inmediato de 12 bits extendido con signo: rd = rs1 & imm.',
    example: 'andi t0, t0, 7    # t0 = t0 % 8 (aislar últimos 3 bits)'
  },
  {
    id: 'op-or',
    category: 'Opcode',
    name: 'or',
    syntax: 'or rd, rs1, rs2',
    format: 'Tipo-R',
    description: 'Operación lógica OR bit a bit entre dos registros: rd = rs1 | rs2.',
    example: 'or t0, t1, t2     # t0 = t1 OR t2'
  },
  {
    id: 'op-ori',
    category: 'Opcode',
    name: 'ori',
    syntax: 'ori rd, rs1, imm',
    format: 'Tipo-I',
    description: 'Operación lógica OR con un inmediato de 12 bits con signo: rd = rs1 | imm.',
    example: 'ori t0, t0, 0x01  # Enciende el bit 0'
  },
  {
    id: 'op-xor',
    category: 'Opcode',
    name: 'xor',
    syntax: 'xor rd, rs1, rs2',
    format: 'Tipo-R',
    description: 'Operación lógica XOR (OR exclusivo) bit a bit: rd = rs1 ^ rs2.',
    example: 'xor t0, t1, t2    # t0 = t1 XOR t2'
  },
  {
    id: 'op-xori',
    category: 'Opcode',
    name: 'xori',
    syntax: 'xori rd, rs1, imm',
    format: 'Tipo-I',
    description: 'Operación lógica XOR con inmediato. Se utiliza comúnmente con 1 para negar valores booleanos.',
    example: 'xori t2, t2, 1    # Invierte el bit booleano (NOT lógico)'
  },
  {
    id: 'op-sll',
    category: 'Opcode',
    name: 'sll / slli',
    syntax: 'slli rd, rs1, shamt',
    format: 'Tipo-I',
    description: 'Shift Left Logical (desplazamiento lógico a la izquierda) rellenando con ceros: rd = rs1 << shamt.',
    example: 'slli t3, t1, 2    # Multiplica i por 4 (offset de arreglo de 32 bits)'
  },
  {
    id: 'op-srl',
    category: 'Opcode',
    name: 'srl / srli',
    syntax: 'srli rd, rs1, shamt',
    format: 'Tipo-I',
    description: 'Shift Right Logical (desplazamiento lógico a la derecha) sin extensión de signo: rd = rs1 >>> shamt.',
    example: 'srli t0, t0, 1    # División sin signo entre 2'
  },
  {
    id: 'op-sra',
    category: 'Opcode',
    name: 'sra / srai',
    syntax: 'srai rd, rs1, shamt',
    format: 'Tipo-I',
    description: 'Shift Right Arithmetic (desplazamiento aritmético a la derecha) preservando el bit de signo: rd = rs1 >> shamt.',
    example: 'srai t0, t0, 2    # División entera con signo entre 4'
  },
  {
    id: 'op-slt',
    category: 'Opcode',
    name: 'slt',
    syntax: 'slt rd, rs1, rs2',
    format: 'Tipo-R',
    description: 'Set if Less Than (con signo): rd = (rs1 < rs2) ? 1 : 0. Base de todas las comparaciones relacionales.',
    example: 'slt t2, t0, t1    # t2 = 1 si t0 < t1, de lo contrario 0'
  },
  {
    id: 'op-sltu',
    category: 'Opcode',
    name: 'sltu / sltiu',
    syntax: 'sltiu rd, rs1, imm',
    format: 'Tipo-I',
    description: 'Set if Less Than Unsigned (sin signo): compara tratando los números como enteros positivos de 32 bits.',
    example: 'sltiu t0, a0, 10  # Verifica rango sin signo'
  },
  {
    id: 'op-lw',
    category: 'Opcode',
    name: 'lw',
    syntax: 'lw rd, offset(rs1)',
    format: 'Tipo-I',
    description: 'Load Word: Carga una palabra de 32 bits (4 bytes) desde la dirección de memoria rs1 + offset.',
    example: 'lw t0, -12(s0)    # Carga variable local de la pila'
  },
  {
    id: 'op-lh',
    category: 'Opcode',
    name: 'lh / lhu',
    syntax: 'lh rd, offset(rs1)',
    format: 'Tipo-I',
    description: 'Load Halfword: Carga 16 bits (2 bytes). lh extiende el signo a 32 bits; lhu rellena con ceros.',
    example: 'lh t0, 0(a0)      # Carga entero corto de 16 bits'
  },
  {
    id: 'op-lb',
    category: 'Opcode',
    name: 'lb / lbu',
    syntax: 'lbu rd, offset(rs1)',
    format: 'Tipo-I',
    description: 'Load Byte: Carga un único byte (8 bits). lb extiende signo; lbu rellena con ceros (ideal para caracteres ASCII).',
    example: 'lbu t1, 0(a0)     # Carga caracter ASCII'
  },
  {
    id: 'op-sw',
    category: 'Opcode',
    name: 'sw',
    syntax: 'sw rs2, offset(rs1)',
    format: 'Tipo-S',
    description: 'Store Word: Guarda una palabra de 32 bits desde el registro rs2 en la dirección de memoria rs1 + offset.',
    example: 'sw ra, 28(sp)     # Salva dirección de retorno en el marco'
  },
  {
    id: 'op-sh',
    category: 'Opcode',
    name: 'sh',
    syntax: 'sh rs2, offset(rs1)',
    format: 'Tipo-S',
    description: 'Store Halfword: Almacena los 16 bits inferiores de rs2 en la memoria.',
    example: 'sh t0, 0(a0)      # Escribe 2 bytes en memoria'
  },
  {
    id: 'op-sb',
    category: 'Opcode',
    name: 'sb',
    syntax: 'sb rs2, offset(rs1)',
    format: 'Tipo-S',
    description: 'Store Byte: Almacena el byte menos significativo (8 bits) de rs2 en la memoria.',
    example: 'sb t0, 0(a0)      # Escribe 1 byte (caracter)'
  },
  {
    id: 'op-beq',
    category: 'Opcode',
    name: 'beq',
    syntax: 'beq rs1, rs2, label',
    format: 'Tipo-B',
    description: 'Branch if Equal: Salta a la etiqueta label si rs1 == rs2. Salto relativo al PC.',
    example: 'beq t0, t1, .L_IGUALES'
  },
  {
    id: 'op-bne',
    category: 'Opcode',
    name: 'bne',
    syntax: 'bne rs1, rs2, label',
    format: 'Tipo-B',
    description: 'Branch if Not Equal: Salta a la etiqueta label si rs1 != rs2.',
    example: 'bne t0, zero, .L_TRUE'
  },
  {
    id: 'op-blt',
    category: 'Opcode',
    name: 'blt',
    syntax: 'blt rs1, rs2, label',
    format: 'Tipo-B',
    description: 'Branch if Less Than: Salta si rs1 < rs2 (comparación con signo).',
    example: 'blt t0, a1, .L_LOOP'
  },
  {
    id: 'op-bge',
    category: 'Opcode',
    name: 'bge',
    syntax: 'bge rs1, rs2, label',
    format: 'Tipo-B',
    description: 'Branch if Greater or Equal: Salta si rs1 >= rs2 (comparación con signo).',
    example: 'bge t1, a1, .L_END_WHILE'
  },
  {
    id: 'op-jal',
    category: 'Opcode',
    name: 'jal',
    syntax: 'jal rd, label',
    format: 'Tipo-J',
    description: 'Jump and Link: Salta a label y guarda la dirección de retorno (PC + 4) en rd (típicamente ra).',
    example: 'jal ra, calcularSumaFiltrada # Llamada a función'
  },
  {
    id: 'op-jalr',
    category: 'Opcode',
    name: 'jalr',
    syntax: 'jalr rd, rs1, offset',
    format: 'Tipo-I',
    description: 'Jump and Link Register: Salta a la dirección dinámica rs1 + offset y guarda PC + 4 en rd. Base del retorno ret y llamadas a métodos virtuales.',
    example: 'jalr zero, ra, 0  # Retorno canónico al llamador'
  },
  {
    id: 'op-lui',
    category: 'Opcode',
    name: 'lui',
    syntax: 'lui rd, imm20',
    format: 'Tipo-U',
    description: 'Load Upper Immediate: Carga un valor inmediato de 20 bits en los bits superiores [31:12] de rd, rellenando [11:0] con ceros.',
    example: 'lui t0, 0x1000    # Carga dirección base de Heap'
  },
  {
    id: 'op-ecall',
    category: 'Opcode',
    name: 'ecall',
    syntax: 'ecall',
    format: 'Sistema',
    description: 'Environment Call: Transfiere el control al sistema operativo / simulador para ejecutar una llamada al sistema según el valor en a7.',
    example: 'li a7, 4 ; ecall  # Imprime cadena de texto'
  },

  // --- PSEUDOINSTRUCCIONES CLAVE ---
  {
    id: 'pseudo-li',
    category: 'Pseudoinstrucción',
    name: 'li',
    syntax: 'li rd, imm',
    expansion: 'addi rd, zero, imm  (o lui + addi para 32 bits)',
    description: 'Load Immediate: Carga una constante entera arbitraria de hasta 32 bits en el registro rd.',
    example: 'li t0, 25         # t0 = 25'
  },
  {
    id: 'pseudo-la',
    category: 'Pseudoinstrucción',
    name: 'la',
    syntax: 'la rd, symbol',
    expansion: 'auipc rd, %pcrel_hi(symbol) + addi',
    description: 'Load Address: Carga la dirección de memoria absoluta o relativa al PC de una etiqueta de datos o código.',
    example: 'la a0, str_msg    # a0 = &str_msg'
  },
  {
    id: 'pseudo-mv',
    category: 'Pseudoinstrucción',
    name: 'mv',
    syntax: 'mv rd, rs',
    expansion: 'addi rd, rs, 0',
    description: 'Move: Copia el contenido del registro rs al registro rd.',
    example: 'mv s1, a0         # Salva el valor de retorno en s1'
  },
  {
    id: 'pseudo-not',
    category: 'Pseudoinstrucción',
    name: 'not',
    syntax: 'not rd, rs',
    expansion: 'xori rd, rs, -1',
    description: 'Bitwise NOT: Invierte todos los 32 bits de rs: rd = ~rs.',
    example: 'not t0, t0        # Invierte todos los bits'
  },
  {
    id: 'pseudo-neg',
    category: 'Pseudoinstrucción',
    name: 'neg',
    syntax: 'neg rd, rs',
    expansion: 'sub rd, zero, rs',
    description: 'Negación Aritmética: Calcula el complemento a dos: rd = -rs.',
    example: 'neg t1, t0        # t1 = -t0'
  },
  {
    id: 'pseudo-nop',
    category: 'Pseudoinstrucción',
    name: 'nop',
    syntax: 'nop',
    expansion: 'addi zero, zero, 0',
    description: 'No Operation: Ocupa 4 bytes y 1 ciclo sin alterar ningún registro ni estado de la CPU.',
    example: 'nop               # Relleno de ciclo o alineación'
  },
  {
    id: 'pseudo-j',
    category: 'Pseudoinstrucción',
    name: 'j',
    syntax: 'j label',
    expansion: 'jal zero, label',
    description: 'Jump: Salto incondicional relativo al PC hacia label sin guardar dirección de retorno.',
    example: 'j .L_LOOP_TEST    # Salta al encabezado del bucle'
  },
  {
    id: 'pseudo-jr',
    category: 'Pseudoinstrucción',
    name: 'jr',
    syntax: 'jr rs',
    expansion: 'jalr zero, rs, 0',
    description: 'Jump Register: Salto incondicional a la dirección contenida en el registro rs.',
    example: 'jr ra             # Retorna al llamador'
  },
  {
    id: 'pseudo-ret',
    category: 'Pseudoinstrucción',
    name: 'ret',
    syntax: 'ret',
    expansion: 'jalr zero, ra, 0',
    description: 'Return: Retorno estándar de una función hacia la dirección preservada en el registro ra.',
    example: 'ret               # Fin canónico de subprograma'
  },
  {
    id: 'pseudo-call',
    category: 'Pseudoinstrucción',
    name: 'call',
    syntax: 'call symbol',
    expansion: 'auipc ra, offset + jalr ra, ra, offset',
    description: 'Call Subroutine: Salto y enlace para subprogramas ubicados a distancias de hasta +/- 2GB.',
    example: 'call factorial    # Invoca subprograma distante'
  },
  {
    id: 'pseudo-beqz',
    category: 'Pseudoinstrucción',
    name: 'beqz',
    syntax: 'beqz rs, label',
    expansion: 'beq rs, zero, label',
    description: 'Branch if Equal to Zero: Salta a label si el registro rs contiene el valor 0 (falso booleano).',
    example: 'beqz t0, .L_SALIR # Salta si t0 == 0'
  },
  {
    id: 'pseudo-bnez',
    category: 'Pseudoinstrucción',
    name: 'bnez',
    syntax: 'bnez rs, label',
    expansion: 'bne rs, zero, label',
    description: 'Branch if Not Equal to Zero: Salta a label si el registro rs no es cero (verdadero booleano).',
    example: 'bnez t0, .L_TRUE  # Salta si t0 != 0'
  },
  {
    id: 'pseudo-blez',
    category: 'Pseudoinstrucción',
    name: 'blez / bgez',
    syntax: 'blez rs, label',
    expansion: 'bge zero, rs, label',
    description: 'Branch if Less/Greater or Equal to Zero: Compara directamente el registro contra el cero cableado.',
    example: 'blez t0, .L_BASE  # Caso base de recursión si n <= 0'
  },
  {
    id: 'pseudo-seqz',
    category: 'Pseudoinstrucción',
    name: 'seqz / snez',
    syntax: 'seqz rd, rs',
    expansion: 'sltiu rd, rs, 1  (o sub + seqz)',
    description: 'Set if Equal to Zero: rd = (rs == 0) ? 1 : 0. Sintetiza comparaciones de igualdad lógica.',
    example: 'seqz t2, t2       # t2 = 1 si la resta previa fue 0'
  },

  // --- REGISTROS ABI Y HARDWARE ---
  {
    id: 'reg-zero',
    category: 'Registro',
    name: 'zero (x0)',
    syntax: 'zero',
    description: 'Constante 0 cableada en silicio. Cualquier lectura devuelve 0; cualquier escritura se descarta.',
    example: 'add a0, zero, t0  # Equivale a mv a0, t0'
  },
  {
    id: 'reg-ra',
    category: 'Registro',
    name: 'ra (x1)',
    syntax: 'ra',
    description: 'Return Address (Caller-saved). Almacena la dirección de retorno que ejecuta jal/jalr.',
    example: 'sw ra, 28(sp)     # Salva en la pila si la función no es hoja'
  },
  {
    id: 'reg-sp',
    category: 'Registro',
    name: 'sp (x2)',
    syntax: 'sp',
    description: 'Stack Pointer (Callee-saved). Puntero al tope inferior móvil de la pila de memoria. Crece hacia abajo.',
    example: 'addi sp, sp, -32  # Crece la pila 32 bytes (múltiplo de 16)'
  },
  {
    id: 'reg-gp',
    category: 'Registro',
    name: 'gp (x3) / tp (x4)',
    syntax: 'gp / tp',
    description: 'Global Pointer (acceso rápido a variables estáticas globales) y Thread Pointer (hilo de ejecución).',
    example: 'lw t0, 0(gp)      # Acceso a datos globales'
  },
  {
    id: 'reg-t0-t6',
    category: 'Registro',
    name: 't0 - t6 (x5-x7, x28-x31)',
    syntax: 't0, t1, t2, t3, t4, t5, t6',
    description: 'Registros Temporales (Caller-saved). No preservados entre llamadas a funciones. Usados para expresiones locales.',
    example: 'add t0, a0, a1    # Cálculo temporal sin salvar en pila'
  },
  {
    id: 'reg-s0-fp',
    category: 'Registro',
    name: 's0 / fp (x8)',
    syntax: 's0 o fp',
    description: 'Frame Pointer / Saved Register 0 (Callee-saved). Base fija e inamovible para direccionar variables locales.',
    example: 'addi s0, sp, 32   # Ancla el Frame Pointer en la base del marco'
  },
  {
    id: 'reg-s1-s11',
    category: 'Registro',
    name: 's1 - s11 (x9, x18-x27)',
    syntax: 's1..s11',
    description: 'Registros Guardados (Callee-saved). La función llamada DEBE preservarlos en la pila si los va a utilizar.',
    example: 'sw s1, 20(sp)     # Preserva s1 para proteger valor entre llamadas'
  },
  {
    id: 'reg-a0-a7',
    category: 'Registro',
    name: 'a0 - a7 (x10-x17)',
    syntax: 'a0..a7',
    description: 'Argumentos y Retorno (Caller-saved). a0-a7 pasan los primeros 8 parámetros; a0 y a1 retornan resultados. En POO, a0 pasa el puntero this.',
    example: 'mv a0, t2         # Retorna resultado en a0'
  },

  // --- DIRECTIVAS DEL ENSAMBLADOR ---
  {
    id: 'dir-text',
    category: 'Directiva',
    name: '.text',
    syntax: '.text',
    description: 'Indica al ensamblador y enlazador el inicio de la sección de instrucciones de código máquina ejecutable (memoria ROM/flash).',
    example: '.text\n.globl main\nmain:'
  },
  {
    id: 'dir-data',
    category: 'Directiva',
    name: '.data',
    syntax: '.data',
    description: 'Indica el inicio del segmento de datos inicializados en memoria RAM (cadenas literales, constantes y arreglos globales).',
    example: '.data\nstr_exito: .string "Completado con exito"'
  },
  {
    id: 'dir-globl',
    category: 'Directiva',
    name: '.globl',
    syntax: '.globl <simbolo>',
    description: 'Exporta un símbolo (función o variable) haciéndolo visible públicamente para otros archivos objeto durante el enlace.',
    example: '.globl main\n.globl calcularSumaFiltrada'
  },
  {
    id: 'dir-string',
    category: 'Directiva',
    name: '.string / .asciz',
    syntax: '.string "<texto>"',
    description: 'Emite una secuencia de bytes con caracteres ASCII y agrega automáticamente el byte nulo terminador (\\0).',
    example: 'str_hola: .string "Hola mundo\\n"'
  },
  {
    id: 'dir-word',
    category: 'Directiva',
    name: '.word',
    syntax: '.word v1, v2, ...',
    description: 'Emite palabras completas de 32 bits (4 bytes) consecutivas en la memoria.',
    example: 'tabla: .word 10, 20, 30, 40, 50'
  },
  {
    id: 'dir-space',
    category: 'Directiva',
    name: '.space',
    syntax: '.space <bytes>',
    description: 'Reserva una cantidad especificada de bytes contiguos en memoria sin inicializar (útil para buffers globales).',
    example: 'buffer: .space 1024   # Reserva 1 KB de memoria'
  },
  {
    id: 'dir-align',
    category: 'Directiva',
    name: '.align',
    syntax: '.align <potencia>',
    description: 'Alinea la siguiente instrucción o dato a una frontera de 2^potencia bytes (ej. .align 2 = frontera de 4 bytes).',
    example: '.align 2            # Alineación a palabra de 4 bytes'
  },

  // --- LLAMADAS AL SISTEMA (SYSCALLS ECALL) ---
  {
    id: 'sys-print-int',
    category: 'Syscall',
    name: 'Syscall 1: print_int',
    syntax: 'li a0, <valor> ; li a7, 1 ; ecall',
    description: 'Imprime en la consola el número entero con signo contenido en el registro a0.',
    example: 'li a0, 42\nli a7, 1\necall'
  },
  {
    id: 'sys-print-str',
    category: 'Syscall',
    name: 'Syscall 4: print_string',
    syntax: 'la a0, <etiqueta> ; li a7, 4 ; ecall',
    description: 'Imprime en la consola una cadena de caracteres terminada en byte nulo cuya dirección base está en a0.',
    example: 'la a0, str_saludo\nli a7, 4\necall'
  },
  {
    id: 'sys-read-int',
    category: 'Syscall',
    name: 'Syscall 5: read_int',
    syntax: 'li a7, 5 ; ecall',
    description: 'Lee un número entero ingresado por teclado en la consola y lo devuelve en el registro a0.',
    example: 'li a7, 5\necall\nmv t0, a0           # t0 = entero leído'
  },
  {
    id: 'sys-sbrk',
    category: 'Syscall',
    name: 'Syscall 9: sbrk (alloc)',
    syntax: 'li a0, <bytes> ; li a7, 9 ; ecall',
    description: 'Asigna dinámicamente un bloque de memoria en el Heap de tamaño a0 bytes. Retorna el puntero en a0.',
    example: 'li a0, 64\nli a7, 9\necall             # a0 = puntero al bloque en Heap'
  },
  {
    id: 'sys-exit',
    category: 'Syscall',
    name: 'Syscall 10: exit',
    syntax: 'li a7, 10 ; ecall',
    description: 'Finaliza limpiamente la ejecución del programa y devuelve el control al sistema operativo.',
    example: 'li a7, 10\necall             # Terminar ejecución'
  },

  // --- FORMATOS DE INSTRUCCIÓN RV32I ---
  {
    id: 'fmt-r',
    category: 'Formato',
    name: 'Formato Tipo-R (Registro-Registro)',
    syntax: '[funct7 (7b)][rs2 (5b)][rs1 (5b)][funct3 (3b)][rd (5b)][opcode (7b)]',
    description: 'Para operaciones aritmético-lógicas puras entre dos registros de entrada y un registro de destino. Sin campo inmediato.',
    example: 'add, sub, mul, and, or, xor, sll, srl, sra, slt'
  },
  {
    id: 'fmt-i',
    category: 'Formato',
    name: 'Formato Tipo-I (Inmediato / Cargas)',
    syntax: '[imm[11:0] (12b)][rs1 (5b)][funct3 (3b)][rd (5b)][opcode (7b)]',
    description: 'Para operaciones con constantes inmediatas de 12 bits con signo (-2048 a +2047), instrucciones de carga de memoria (lw, lh, lb) y retornos jalr.',
    example: 'addi, andi, ori, xori, slli, srli, srai, slti, lw, jalr'
  },
  {
    id: 'fmt-s',
    category: 'Formato',
    name: 'Formato Tipo-S (Guardado en Memoria)',
    syntax: '[imm[11:5] (7b)][rs2 (5b)][rs1 (5b)][funct3 (3b)][imm[4:0] (5b)][opcode (7b)]',
    description: 'Para guardar datos en memoria (sw, sh, sb). El inmediato de 12 bits se divide en dos fragmentos para mantener rs1 y rs2 en posiciones fijas.',
    example: 'sw rs2, offset(rs1)  # Guarda palabra en memoria'
  },
  {
    id: 'fmt-b',
    category: 'Formato',
    name: 'Formato Tipo-B (Saltos Condicionales)',
    syntax: '[imm[12|10:5] (7b)][rs2 (5b)][rs1 (5b)][funct3 (3b)][imm[4:1|11] (5b)][opcode (7b)]',
    description: 'Para saltos condicionales (beq, bne, blt, bge). El inmediato se multiplica implícitamente por 2 (el bit 0 siempre es 0), permitiendo saltos de hasta +/- 4KB.',
    example: 'beq rs1, rs2, label'
  },
  {
    id: 'fmt-u',
    category: 'Formato',
    name: 'Formato Tipo-U (Inmediato Superior de 20 bits)',
    syntax: '[imm[31:12] (20b)][rd (5b)][opcode (7b)]',
    description: 'Carga una constante inmediata de 20 bits en los bits más significativos [31:12] del registro destino.',
    example: 'lui rd, imm20 ; auipc rd, imm20'
  },
  {
    id: 'fmt-j',
    category: 'Formato',
    name: 'Formato Tipo-J (Salto Incondicional y Enlace)',
    syntax: '[imm[20|10:1|11|19:12] (20b)][rd (5b)][opcode (7b)]',
    description: 'Para saltos largos incondicionales jal. Su inmediato de 20 bits permite un rango de salto relativo de hasta +/- 1 Megabyte.',
    example: 'jal ra, label'
  }
];
