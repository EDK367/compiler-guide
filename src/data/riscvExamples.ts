export interface RiscvTraceStep {
  pc: string;
  instruction: string;
  comment: string;
  explanation: string;
  registers: {
    pc: string;
    zero: number;
    ra: string;
    sp: string;
    fp: string;
    a0: number;
    a1: number;
    t0: number;
    t1: number;
    t2: number;
    t3: number;
  };
  stack: {
    addr: string;
    offset: string;
    role: string;
    value: string;
    highlight?: boolean;
  }[];
  heap?: {
    addr: string;
    field: string;
    type: string;
    value: string;
  }[];
}

export interface RiscvExampleProgram {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  highLevelCode: string;
  c3dCode: string;
  assemblyCode: string;
  frameDescription: string;
  steps: RiscvTraceStep[];
}

export const RISCV_PROGRAMS: RiscvExampleProgram[] = [
  {
    id: 'aritmetica-fp',
    title: 'Aritmética y Asignación con Frame Pointer',
    subtitle: 'De C3D a instrucciones con ranuras de memoria fijas',
    badge: 'Aritmética',
    highLevelCode: `// Código de Alto Nivel
int a = 15;
int x = 25 + 12 + a;
int z = -x * 5 + 2;`,
    c3dCode: `// Código de Tres Direcciones (C3D)
t1 = 25 + 12
t2 = t1 + a
x = t2
t3 = -x
t4 = t3 * 5
t5 = t4 + 2
z = t5`,
    assemblyCode: `# RISC-V RV32I con Frame Pointer
# Ranuras fijas: a en -12(fp), x en -16(fp), z en -20(fp)
operacion:
  addi sp, sp, -32        # Reservar marco (32B múltiplo de 16)
  sw   s0, 28(sp)         # Guardar s0 previo en 0(fp)
  addi s0, sp, 28         # Fijar fp en la base fija

  li   t0, 15
  sw   t0, -12(s0)        # a = 15

  li   t0, 37             # Constante plegada (25 + 12)
  lw   t1, -12(s0)        # Cargar 'a'
  add  t2, t0, t1         # t2 = 37 + a (52)
  sw   t2, -16(s0)        # Guardar en x

  lw   t0, -16(s0)        # Cargar 'x' (52)
  neg  t1, t0             # t1 = -x (-52)
  li   t2, 5              # t2 = 5
  mul  t3, t1, t2         # t3 = -52 * 5 (-260)
  addi t4, t3, 2          # t4 = -260 + 2 (-258)
  sw   t4, -20(s0)        # Guardar en z

  lw   s0, 0(s0)          # Restaurar s0
  addi sp, sp, 32         # Liberar pila
  ret`,
    frameDescription: 'Marco de 32 bytes: 0(fp)=s0_prev, -4(fp)=ra, -8(fp)=reserva, -12(fp)=a, -16(fp)=x, -20(fp)=z.',
    steps: [
      {
        pc: '0x0000',
        instruction: 'addi sp, sp, -32',
        comment: 'Reservar espacio en la pila',
        explanation: 'Se reduce el Stack Pointer en 32 bytes (la pila crece hacia abajo). 32 bytes garantiza alineación a 16 bytes.',
        registers: { pc: '0x0000', zero: 0, ra: '0x0040', sp: '0x0118', fp: '0x0154', a0: 0, a1: 0, t0: 0, t1: 0, t2: 0, t3: 0 },
        stack: [
          { addr: '0x0154', offset: '0(fp_prev)', role: 'Marco Anterior', value: '0x0000' }
        ]
      },
      {
        pc: '0x0004',
        instruction: 'sw s0, 28(sp)',
        comment: '0(fp): Salvar antiguo Frame Pointer',
        explanation: 'Se almacena el puntero de marco de la función que llamó para poder restaurarlo al salir.',
        registers: { pc: '0x0004', zero: 0, ra: '0x0040', sp: '0x0118', fp: '0x0154', a0: 0, a1: 0, t0: 0, t1: 0, t2: 0, t3: 0 },
        stack: [
          { addr: '0x0134', offset: '28(sp) / 0(fp)', role: 's0 anterior (enlace dinámico)', value: '0x0154', highlight: true }
        ]
      },
      {
        pc: '0x0008',
        instruction: 'addi s0, sp, 28',
        comment: 'Fijar Frame Pointer',
        explanation: 's0 ahora apunta permanentemente a la base fija del nuevo marco. Durante toda la función, s0 no cambiará.',
        registers: { pc: '0x0008', zero: 0, ra: '0x0040', sp: '0x0118', fp: '0x0134', a0: 0, a1: 0, t0: 0, t1: 0, t2: 0, t3: 0 },
        stack: [
          { addr: '0x0134', offset: '0(fp)', role: 's0 anterior', value: '0x0154' }
        ]
      },
      {
        pc: '0x000C',
        instruction: 'li t0, 15 ; sw t0, -12(s0)',
        comment: 'Asignar a = 15 en -12(fp)',
        explanation: 'Se carga 15 en t0 y se guarda en la primera ranura libre de variables locales en -12(fp).',
        registers: { pc: '0x0014', zero: 0, ra: '0x0040', sp: '0x0118', fp: '0x0134', a0: 0, a1: 0, t0: 15, t1: 0, t2: 0, t3: 0 },
        stack: [
          { addr: '0x0134', offset: '0(fp)', role: 's0 anterior', value: '0x0154' },
          { addr: '0x0128', offset: '-12(fp)', role: "Variable 'a'", value: '15', highlight: true }
        ]
      },
      {
        pc: '0x0018',
        instruction: 'li t0, 37 ; lw t1, -12(s0) ; add t2, t0, t1',
        comment: 'Evaluar 37 + a = 52',
        explanation: 'Se carga el valor constante plegado 37 en t0, se lee "a" (15) de la pila en t1, y se suman dejando 52 en t2.',
        registers: { pc: '0x0024', zero: 0, ra: '0x0040', sp: '0x0118', fp: '0x0134', a0: 0, a1: 0, t0: 37, t1: 15, t2: 52, t3: 0 },
        stack: [
          { addr: '0x0134', offset: '0(fp)', role: 's0 anterior', value: '0x0154' },
          { addr: '0x0128', offset: '-12(fp)', role: "Variable 'a'", value: '15' }
        ]
      },
      {
        pc: '0x0028',
        instruction: 'sw t2, -16(s0)',
        comment: 'Guardar en x (-16(fp))',
        explanation: 'El resultado intermedio 52 se almacena en la ranura de memoria de la variable "x" en -16(fp).',
        registers: { pc: '0x0028', zero: 0, ra: '0x0040', sp: '0x0118', fp: '0x0134', a0: 0, a1: 0, t0: 37, t1: 15, t2: 52, t3: 0 },
        stack: [
          { addr: '0x0134', offset: '0(fp)', role: 's0 anterior', value: '0x0154' },
          { addr: '0x0128', offset: '-12(fp)', role: "Variable 'a'", value: '15' },
          { addr: '0x0124', offset: '-16(fp)', role: "Variable 'x'", value: '52', highlight: true }
        ]
      },
      {
        pc: '0x002C',
        instruction: 'lw t0, -16(s0) ; neg t1, t0 ; mul t3, t1, 5 ; addi t4, t3, 2',
        comment: 'Calcular z = (-52 * 5) + 2 = -258',
        explanation: 'Se lee "x" (52), se niega (-52), se multiplica por 5 (-260) y se suma 2 (-258).',
        registers: { pc: '0x003C', zero: 0, ra: '0x0040', sp: '0x0118', fp: '0x0134', a0: 0, a1: 0, t0: 52, t1: -52, t2: 5, t3: -260 },
        stack: [
          { addr: '0x0134', offset: '0(fp)', role: 's0 anterior', value: '0x0154' },
          { addr: '0x0128', offset: '-12(fp)', role: "Variable 'a'", value: '15' },
          { addr: '0x0124', offset: '-16(fp)', role: "Variable 'x'", value: '52' }
        ]
      },
      {
        pc: '0x0040',
        instruction: 'sw t4, -20(s0)',
        comment: 'Guardar z en -20(fp)',
        explanation: 'Se almacena el valor final -258 en la ranura de memoria de la variable "z".',
        registers: { pc: '0x0040', zero: 0, ra: '0x0040', sp: '0x0118', fp: '0x0134', a0: 0, a1: 0, t0: 52, t1: -52, t2: 5, t3: -258 },
        stack: [
          { addr: '0x0134', offset: '0(fp)', role: 's0 anterior', value: '0x0154' },
          { addr: '0x0128', offset: '-12(fp)', role: "Variable 'a'", value: '15' },
          { addr: '0x0124', offset: '-16(fp)', role: "Variable 'x'", value: '52' },
          { addr: '0x0120', offset: '-20(fp)', role: "Variable 'z'", value: '-258', highlight: true }
        ]
      }
    ]
  },
  {
    id: 'factorial-recursivo',
    title: 'Factorial Recursivo: Cadena fact(4) y Desenrollado',
    subtitle: 'El rol de ra, enlace dinámico y retorno por a0 respaldado en pila',
    badge: 'Recursión',
    highLevelCode: `// Java / Alto Nivel
public int factorial(int n) {
    if (n <= 1) {
        return 1;
    }
    return n * factorial(n - 1);
}`,
    c3dCode: `// C3D con llamadas
factorial:
  if n <= 1 goto L_base
  goto L_rec
L_base:
  return 1
L_rec:
  t1 = n - 1
  param t1
  t2 = call factorial 1
  t3 = n * t2
  return t3`,
    assemblyCode: `factorial:
  addi sp, sp, -24        # Marco de 24B
  sw   s0, 20(sp)         # 0(fp): s0 anterior
  sw   ra, 16(sp)         # -4(fp): dirección de retorno
  addi s0, sp, 20         # fp base

  sw   a0, -8(s0)         # -8(fp): guardar 'n'

  li   t0, 1
  ble  a0, t0, L_base     # if (n <= 1) caso base

  # Paso recursivo
  addi a0, a0, -1         # a0 = n - 1
  jal  ra, factorial      # llamada recursiva

  # Al regresar: a0 trae el retorno de la llamada hija
  sw   a0, -12(s0)        # VITAL: Salvar retorno en -12(fp)
  lw   t0, -8(s0)         # Cargar n original
  lw   t1, -12(s0)        # Cargar retorno guardado
  mul  a0, t0, t1         # a0 = n * retorno
  j    L_epilogo

L_base:
  li   a0, 1              # Caso base retorna 1

L_epilogo:
  lw   ra, -4(s0)         # Restaurar ra
  lw   s0, 0(s0)          # Restaurar s0
  addi sp, sp, 24         # Liberar pila
  ret                     # jr ra`,
    frameDescription: 'Marco de 24B: 0(fp)=s0_prev, -4(fp)=ra, -8(fp)=n, -12(fp)=retorno de la subllamada.',
    steps: [
      {
        pc: '0x0000',
        instruction: 'main -> jal ra, fact(4)',
        comment: 'Invocación inicial con a0 = 4',
        explanation: 'main carga el argumento n=4 en el registro a0 y ejecuta jal ra, factorial. El hardware guarda la dirección de retorno en ra.',
        registers: { pc: '0x0000', zero: 0, ra: '0x0018', sp: '0x0154', fp: '0x0154', a0: 4, a1: 0, t0: 0, t1: 0, t2: 0, t3: 0 },
        stack: [
          { addr: '0x0154', offset: '0(fp)', role: 'Marco main', value: 'main_ctx' }
        ]
      },
      {
        pc: '0x0008',
        instruction: 'fact(4) Prólogo',
        comment: 'Marco fact(4): sp=0x013C, fp=0x013C',
        explanation: 'fact(4) reserva 24 bytes, resguarda el fp previo (0x0154), el ra (0x0018) y guarda n=4 en -8(fp).',
        registers: { pc: '0x0008', zero: 0, ra: '0x0018', sp: '0x0124', fp: '0x013C', a0: 4, a1: 0, t0: 0, t1: 0, t2: 0, t3: 0 },
        stack: [
          { addr: '0x013C', offset: '0(fp)', role: 'fact(4): s0_prev', value: '0x0154' },
          { addr: '0x0138', offset: '-4(fp)', role: 'fact(4): ra_main', value: '0x0018' },
          { addr: '0x0134', offset: '-8(fp)', role: 'fact(4): n', value: '4', highlight: true }
        ]
      },
      {
        pc: '0x0020',
        instruction: 'fact(4) -> jal ra, fact(3)',
        comment: 'a0 = 3 ; llamada recursiva',
        explanation: 'Como 4 > 1, prepara a0 = 3 y salta a factorial. Se crea el marco fact(3) apilado debajo.',
        registers: { pc: '0x0020', zero: 0, ra: '0x0060', sp: '0x010C', fp: '0x0124', a0: 3, a1: 0, t0: 0, t1: 0, t2: 0, t3: 0 },
        stack: [
          { addr: '0x013C', offset: 'Marco 4', role: 'fact(4)', value: 'n=4' },
          { addr: '0x0124', offset: '0(fp)', role: 'fact(3): s0_prev', value: '0x013C' },
          { addr: '0x0120', offset: '-4(fp)', role: 'fact(3): ra_fact4', value: '0x0060' },
          { addr: '0x011C', offset: '-8(fp)', role: 'fact(3): n', value: '3', highlight: true }
        ]
      },
      {
        pc: '0x0020',
        instruction: 'fact(3) -> jal ra, fact(2)',
        comment: 'a0 = 2 ; llamada recursiva',
        explanation: 'fact(3) llama a fact(2). La pila continúa creciendo hacia abajo con otro marco de 24B.',
        registers: { pc: '0x0020', zero: 0, ra: '0x0060', sp: '0x00F4', fp: '0x010C', a0: 2, a1: 0, t0: 0, t1: 0, t2: 0, t3: 0 },
        stack: [
          { addr: '0x013C', offset: 'Marco 4', role: 'fact(4)', value: 'n=4' },
          { addr: '0x0124', offset: 'Marco 3', role: 'fact(3)', value: 'n=3' },
          { addr: '0x010C', offset: '0(fp)', role: 'fact(2): s0_prev', value: '0x0124' },
          { addr: '0x0104', offset: '-8(fp)', role: 'fact(2): n', value: '2', highlight: true }
        ]
      },
      {
        pc: '0x0020',
        instruction: 'fact(2) -> jal ra, fact(1) [CASO BASE]',
        comment: 'a0 = 1 ; condición n <= 1 VERDADERA',
        explanation: 'fact(1) detecta n=1 <= 1. No efectúa más llamadas. Carga 1 en a0, libera su marco y retorna con ret.',
        registers: { pc: '0x0040', zero: 0, ra: '0x0060', sp: '0x00DC', fp: '0x00F4', a0: 1, a1: 0, t0: 1, t1: 0, t2: 0, t3: 0 },
        stack: [
          { addr: '0x013C', offset: 'Marco 4', role: 'fact(4)', value: 'n=4' },
          { addr: '0x0124', offset: 'Marco 3', role: 'fact(3)', value: 'n=3' },
          { addr: '0x010C', offset: 'Marco 2', role: 'fact(2)', value: 'n=2' },
          { addr: '0x00F4', offset: '0(fp)', role: 'fact(1): caso base', value: 'retorna a0=1', highlight: true }
        ]
      },
      {
        pc: '0x0060',
        instruction: 'Retorno a fact(2): sw a0, -12(s0)',
        comment: 'fact(2) recibe a0 = 1, calcula 2 * 1 = 2',
        explanation: 'fact(2) guarda a0 (1) en su pila en -12(fp). Multiplica n=2 por 1 = 2. Carga 2 en a0 y retorna.',
        registers: { pc: '0x0060', zero: 0, ra: '0x0060', sp: '0x00F4', fp: '0x010C', a0: 2, a1: 0, t0: 2, t1: 1, t2: 0, t3: 0 },
        stack: [
          { addr: '0x013C', offset: 'Marco 4', role: 'fact(4)', value: 'n=4' },
          { addr: '0x0124', offset: 'Marco 3', role: 'fact(3)', value: 'n=3' },
          { addr: '0x010C', offset: 'Marco 2', role: 'fact(2) desenrollado', value: 'deja a0=2', highlight: true }
        ]
      },
      {
        pc: '0x0060',
        instruction: 'Retorno a fact(3): n * sub = 3 * 2 = 6',
        comment: 'fact(3) recibe a0 = 2, calcula 3 * 2 = 6',
        explanation: 'fact(3) guarda 2 en -12(fp), multiplica por n=3 obteniendo 6. Carga 6 en a0 y retorna.',
        registers: { pc: '0x0060', zero: 0, ra: '0x0018', sp: '0x010C', fp: '0x0124', a0: 6, a1: 0, t0: 3, t1: 2, t2: 0, t3: 0 },
        stack: [
          { addr: '0x013C', offset: 'Marco 4', role: 'fact(4)', value: 'n=4' },
          { addr: '0x0124', offset: 'Marco 3', role: 'fact(3) desenrollado', value: 'deja a0=6', highlight: true }
        ]
      },
      {
        pc: '0x0060',
        instruction: 'Retorno a fact(4): n * sub = 4 * 6 = 24',
        comment: 'fact(4) recibe a0 = 6, calcula 4 * 6 = 24',
        explanation: 'fact(4) guarda 6 en -12(fp), multiplica por n=4 obteniendo 24. Carga 24 en a0 y retorna finalmente a main.',
        registers: { pc: '0x0018', zero: 0, ra: '0x0018', sp: '0x0154', fp: '0x0154', a0: 24, a1: 0, t0: 4, t1: 6, t2: 0, t3: 0 },
        stack: [
          { addr: '0x0154', offset: '0(fp)', role: 'Marco main', value: 'Recibe a0 = 24', highlight: true }
        ]
      }
    ]
  },
  {
    id: 'poo-heap-this',
    title: 'POO: Heap, Puntero this y Acceso a Atributos',
    subtitle: 'Los atributos de clase viven en el Heap (0x1000) y this entra en a0',
    badge: 'POO & Heap',
    highLevelCode: `// Java / POO
public class Calculadora {
    int id;          // offset 0 (4 bytes)
    int total;       // offset 4 (4 bytes)

    public void acumular(int valor) {
        this.total = this.total + valor;
    }
}`,
    c3dCode: `// C3D con puntero this (dirección Heap)
Calculadora_acumular:
  t1 = this + 4      // dirección del atributo total
  t2 = heap[t1]      // leer this.total
  t3 = t2 + valor    // sumar valor
  heap[t1] = t3      // guardar en this.total`,
    assemblyCode: `Calculadora_acumular:
  addi sp, sp, -16        # Marco de 16B
  sw   s0, 12(sp)
  addi s0, sp, 12

  sw   a0, -8(s0)         # Salvar 'this' (recibido en a0)
  sw   a1, -12(s0)        # Salvar 'valor' (recibido en a1)

  lw   t0, -8(s0)         # t0 = puntero this (0x1000)
  lw   t1, 4(t0)          # t1 = this.total (offset 4 en el Heap!)
  lw   t2, -12(s0)        # t2 = valor

  add  t3, t1, t2         # t3 = total + valor
  sw   t3, 4(t0)          # Actualizar Heap: this.total = t3

  lw   s0, 0(s0)
  addi sp, sp, 16
  ret`,
    frameDescription: 'Objeto instanciado en el Heap en 0x1000. La pila solo resguarda el puntero this (4B) y el parámetro.',
    steps: [
      {
        pc: '0x0000',
        instruction: 'Invocación: a0 = 0x1000 (this), a1 = 50 (valor)',
        comment: 'Convención: this siempre viaja en a0',
        explanation: 'En métodos de instancia, el compilador inserta implícitamente el puntero "this" como el primer argumento en a0.',
        registers: { pc: '0x0000', zero: 0, ra: '0x0020', sp: '0x0154', fp: '0x0154', a0: 4096, a1: 50, t0: 0, t1: 0, t2: 0, t3: 0 },
        stack: [
          { addr: '0x0154', offset: '0(fp)', role: 'Marco caller', value: 'caller_ctx' }
        ],
        heap: [
          { addr: '0x1000', field: 'id', type: 'int (4B)', value: '1' },
          { addr: '0x1004', field: 'total', type: 'int (4B)', value: '100' }
        ]
      },
      {
        pc: '0x0008',
        instruction: 'sw a0, -8(s0) ; sw a1, -12(s0)',
        comment: 'Salvar this en -8(fp) y valor en -12(fp)',
        explanation: 'El marco de pila almacena el puntero al Heap (0x1000) en su ranura local -8(fp).',
        registers: { pc: '0x0008', zero: 0, ra: '0x0020', sp: '0x0144', fp: '0x0150', a0: 4096, a1: 50, t0: 0, t1: 0, t2: 0, t3: 0 },
        stack: [
          { addr: '0x0150', offset: '0(fp)', role: 's0 anterior', value: '0x0154' },
          { addr: '0x0148', offset: '-8(fp)', role: "Puntero 'this'", value: '0x1000', highlight: true },
          { addr: '0x0144', offset: '-12(fp)', role: "Parámetro 'valor'", value: '50' }
        ],
        heap: [
          { addr: '0x1000', field: 'id', type: 'int (4B)', value: '1' },
          { addr: '0x1004', field: 'total', type: 'int (4B)', value: '100' }
        ]
      },
      {
        pc: '0x0014',
        instruction: 'lw t0, -8(s0) ; lw t1, 4(t0)',
        comment: 'Cargar this (0x1000) y leer offset 4: 100',
        explanation: 'Se lee la dirección base del objeto y mediante direccionamiento base + desplazamiento 4(t0) se accede al atributo "total" en el Heap.',
        registers: { pc: '0x0018', zero: 0, ra: '0x0020', sp: '0x0144', fp: '0x0150', a0: 4096, a1: 50, t0: 4096, t1: 100, t2: 50, t3: 0 },
        stack: [
          { addr: '0x0150', offset: '0(fp)', role: 's0 anterior', value: '0x0154' },
          { addr: '0x0148', offset: '-8(fp)', role: "Puntero 'this'", value: '0x1000' },
          { addr: '0x0144', offset: '-12(fp)', role: "Parámetro 'valor'", value: '50' }
        ],
        heap: [
          { addr: '0x1000', field: 'id', type: 'int (4B)', value: '1' },
          { addr: '0x1004', field: 'total', type: 'int (4B)', value: '100', highlight: true }
        ]
      },
      {
        pc: '0x0020',
        instruction: 'add t3, t1, t2 ; sw t3, 4(t0)',
        comment: 'Sumar 100 + 50 = 150 y mutar el Heap',
        explanation: 'La instrucción "sw t3, 4(t0)" muta el estado persistente del objeto en el Heap (0x1004 = 150) in-situ.',
        registers: { pc: '0x0024', zero: 0, ra: '0x0020', sp: '0x0144', fp: '0x0150', a0: 4096, a1: 50, t0: 4096, t1: 100, t2: 50, t3: 150 },
        stack: [
          { addr: '0x0150', offset: '0(fp)', role: 's0 anterior', value: '0x0154' },
          { addr: '0x0148', offset: '-8(fp)', role: "Puntero 'this'", value: '0x1000' },
          { addr: '0x0144', offset: '-12(fp)', role: "Parámetro 'valor'", value: '50' }
        ],
        heap: [
          { addr: '0x1000', field: 'id', type: 'int (4B)', value: '1' },
          { addr: '0x1004', field: 'total', type: 'int (4B)', value: '150', highlight: true }
        ]
      }
    ]
  },
  {
    id: 'fibonacci-doble-recursivo',
    title: 'Doble Recursión: Fibonacci(3) y Pila',
    subtitle: 'Llamadas bifurcadas en árbol con preservación de s1 y ra',
    badge: 'Fibonacci(3)',
    highLevelCode: `// ========================================================
// Función Recursiva Doble: Secuencia de Fibonacci
// fib(n) = fib(n-1) + fib(n-2)
// ========================================================
class Algoritmos {
    int fibonacci(int n) {
        // CASO BASE 1: fib(0) = 0
        if (n <= 0) return 0;
        // CASO BASE 2: fib(1) = 1
        if (n == 1) return 1;
        // PASO RECURSIVO: se bifurca en dos llamadas y se acumula
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
}`,
    c3dCode: `// ========================================================
// C3D: Fibonacci con saltos y parámetros canónicos
// ========================================================
Fibonacci:
    if n <= 0 goto L_ZERO       // Salto a caso base 0
    if n == 1 goto L_ONE        // Salto a caso base 1
    t0 = n - 1                  // Argumento rama izquierda
    param t0                    // Pasa t0 a registro a0
    t1 = call Fibonacci, 1      // t1 = fib(n - 1)
    t2 = n - 2                  // Argumento rama derecha
    param t2                    // Pasa t2 a registro a0
    t3 = call Fibonacci, 1      // t3 = fib(n - 2)
    t4 = t1 + t3                // Suma ambas ramas del árbol
    return t4                   // Retorna suma acumulada
L_ZERO: 
    return 0                    // Retorno caso base 0
L_ONE:  
    return 1                    // Retorno caso base 1`,
    assemblyCode: `# ========================================================
# RISC-V RV32I: Fibonacci con Frame Pointer y preservación de s1
# ========================================================
fibonacci:
    addi sp, sp, -32            # 1. Prólogo: reserva marco de 32 bytes
    sw   ra, 28(sp)             # Salva dirección de retorno
    sw   s0, 24(sp)             # Salva Frame Pointer llamador
    sw   s1, 20(sp)             # Salva callee-saved s1 (para rama izquierda)
    addi s0, sp, 32             # Fija nuevo Frame Pointer en la base
    sw   a0, -8(s0)             # Guarda argumento n en la pila local

    # 2. Casos base
    lw   t0, -8(s0)             # Carga n desde la pila local
    blez t0, .L_ZERO            # Si n <= 0 salta a retornar 0
    li   t1, 1
    beq  t0, t1, .L_ONE         # Si n == 1 salta a retornar 1

    # 3. Rama izquierda: fib(n - 1)
    addi a0, t0, -1             # a0 = n - 1
    jal  ra, fibonacci          # Llamada recursiva (ra = PC + 4)
    mv   s1, a0                 # s1 = fib(n - 1) (protege retorno en callee-saved)

    # 4. Rama derecha: fib(n - 2)
    lw   t0, -8(s0)             # Recupera n original del marco actual
    addi a0, t0, -2             # a0 = n - 2
    jal  ra, fibonacci          # Segunda llamada recursiva: a0 = fib(n - 2)

    # 5. Suma de ramas y retorno
    add  a0, s1, a0             # a0 = fib(n-1) + fib(n-2)
    j    .L_RET

.L_ZERO:
    li   a0, 0                  # Retorno caso base 0
    j    .L_RET
.L_ONE:
    li   a0, 1                  # Retorno caso base 1

.L_RET:
    # 6. Epílogo canónico
    lw   s1, 20(sp)             # Restaura s1
    lw   s0, 24(sp)             # Restaura Frame Pointer
    lw   ra, 28(sp)             # Restaura ra
    addi sp, sp, 32             # Libera marco
    ret                         # Retorna al llamador`,
    frameDescription: 'Marco de 32B con ra, s0, registro preservado s1 y parámetro n',
    steps: [
      {
        pc: '0x0000',
        instruction: 'addi sp, sp, -32 ; sw ra, 28(sp) ; sw s0, 24(sp)',
        comment: 'Prólogo: reserva 32B y salva ra y s0',
        explanation: 'Se crea el marco de activación para fib(3). ra almacena el retorno del llamador principal.',
        registers: { pc: '0x0000', zero: 0, ra: '0x0040', sp: '0x0120', fp: '0x0140', a0: 3, a1: 0, t0: 0, t1: 0, t2: 0, t3: 0 },
        stack: [
          { addr: '0x0140', offset: '0(fp)', role: 's0 anterior', value: '0x0160' },
          { addr: '0x013C', offset: '-4(fp)', role: 'ra de retorno', value: '0x0040' }
        ]
      },
      {
        pc: '0x000C',
        instruction: 'sw a0, -8(s0) ; sw s1, 20(sp)',
        comment: 'Preservar n = 3 en -8(fp) y s1',
        explanation: 's1 es callee-saved: debe ser preservado porque almacenará el resultado de fib(n-1) mientras se llama a fib(n-2).',
        registers: { pc: '0x000C', zero: 0, ra: '0x0040', sp: '0x0120', fp: '0x0140', a0: 3, a1: 0, t0: 0, t1: 0, t2: 0, t3: 0 },
        stack: [
          { addr: '0x0140', offset: '0(fp)', role: 's0 anterior', value: '0x0160' },
          { addr: '0x013C', offset: '-4(fp)', role: 'ra de retorno', value: '0x0040' },
          { addr: '0x0138', offset: '-8(fp)', role: 'Parámetro n', value: '3', highlight: true }
        ]
      },
      {
        pc: '0x0014',
        instruction: 'addi a0, zero, 2 ; jal ra, fibonacci',
        comment: 'Llamada recursiva a fib(2)',
        explanation: 'Se evalúa la primera rama: a0 = 3 - 1 = 2. jal ra almacena la siguiente instrucción en ra y salta a la función.',
        registers: { pc: '0x0018', zero: 0, ra: '0x001C', sp: '0x0100', fp: '0x0120', a0: 2, a1: 0, t0: 2, t1: 0, t2: 0, t3: 0 },
        stack: [
          { addr: '0x0140', offset: '0(fp_fib3)', role: 'Marco fib(3)', value: '3' },
          { addr: '0x0120', offset: '0(fp_fib2)', role: 's0 de fib(2)', value: '0x0140', highlight: true },
          { addr: '0x011C', offset: '-4(fp_fib2)', role: 'ra en fib(2)', value: '0x001C' }
        ]
      },
      {
        pc: '0x0024',
        instruction: 'mv s1, a0 ; addi a0, zero, 1 ; jal ra, fibonacci',
        comment: 's1 = fib(2) = 1. Llamada a fib(1)',
        explanation: 'Al regresar de fib(2) con a0 = 1, se salva ese resultado en s1. Se prepara a0 = 3 - 2 = 1 y se llama a fib(1).',
        registers: { pc: '0x0028', zero: 0, ra: '0x002C', sp: '0x0120', fp: '0x0140', a0: 1, a1: 0, t0: 1, t1: 1, t2: 0, t3: 0 },
        stack: [
          { addr: '0x0140', offset: '0(fp)', role: 's0 anterior', value: '0x0160' },
          { addr: '0x0138', offset: '-8(fp)', role: 'Parámetro n', value: '3' },
          { addr: '0x0134', offset: '-12(fp)', role: 'Guardado de s1', value: '1', highlight: true }
        ]
      },
      {
        pc: '0x0034',
        instruction: 'add a0, s1, a0',
        comment: 'Sumar ramas: s1 (1) + a0 (1) = 2',
        explanation: 'Al retornar de fib(1) con a0 = 1, se suma el resultado de ambas ramas recursivas: fib(3) = 1 + 1 = 2.',
        registers: { pc: '0x0038', zero: 0, ra: '0x0040', sp: '0x0120', fp: '0x0140', a0: 2, a1: 0, t0: 1, t1: 1, t2: 2, t3: 0 },
        stack: [
          { addr: '0x0140', offset: '0(fp)', role: 's0 anterior', value: '0x0160' },
          { addr: '0x013C', offset: '-4(fp)', role: 'ra de retorno', value: '0x0040' },
          { addr: '0x0138', offset: '-8(fp)', role: 'Resultado en a0', value: '2', highlight: true }
        ]
      },
      {
        pc: '0x003C',
        instruction: 'lw s1, 20(sp) ; lw s0, 24(sp) ; lw ra, 28(sp) ; addi sp, sp, 32 ; ret',
        comment: 'Epílogo: restaurar registros y retornar 2',
        explanation: 'Se restauran s1, s0 y ra, se desasigna el marco de 32 bytes y se ejecuta ret con el resultado final 2 en a0.',
        registers: { pc: '0x0040', zero: 0, ra: '0x0040', sp: '0x0140', fp: '0x0160', a0: 2, a1: 0, t0: 1, t1: 1, t2: 2, t3: 0 },
        stack: [
          { addr: '0x0160', offset: '0(fp_caller)', role: 'Marco caller', value: 'caller_ctx' }
        ]
      }
    ]
  },
  {
    id: 'programa-completo-main-arreglos',
    title: 'Programa Completo: Main, Funciones y Arreglos en Heap',
    subtitle: 'Arreglos dinámicos en Heap, loops while, filtros, booleanos y strings',
    badge: 'Main & Arreglos',
    highLevelCode: `// ========================================================
// Programa Integral Completo: Main, Funciones y Arreglos
// ========================================================
class SistemaEstadistico {
    int[] datos;
    int cantidad;
    boolean procesado;

    int calcularSumaFiltrada(int[] arr, int n, int umbral) {
        int suma = 0;
        int i = 0;
        boolean hayValidos = false;

        while (i < n) {
            int elemento = arr[i];
            if (elemento > umbral) {
                suma = suma + elemento;
                hayValidos = true;
            }
            i = i + 1;
        }

        if (hayValidos == true) {
            return suma;
        } else {
            return -1;
        }
    }

    void main() {
        this.cantidad = 5;
        this.procesado = false;
        int[] lista = new int[5]; // En Heap 0x1020
        lista[0] = 10; lista[1] = 25; lista[2] = 5; lista[3] = 40; lista[4] = 15;
        int total = calcularSumaFiltrada(lista, this.cantidad, 12);
        this.procesado = true;
        System.out.println("Procesamiento completado con exito");
    }
}`,
    c3dCode: `// ========================================================
// C3D: calcularSumaFiltrada y main
// ========================================================
calcularSumaFiltrada:
    suma = 0
    i = 0
    hayValidos = false
L_WHILE_TEST:
    if i >= n goto L_WHILE_END
    t0 = i * 4
    t1 = arr + t0
    elemento = Heap[t1]
    if elemento > umbral goto L_FILTRO_TRUE
    goto L_INC
L_FILTRO_TRUE:
    suma = suma + elemento
    hayValidos = true
L_INC:
    i = i + 1
    goto L_WHILE_TEST
L_WHILE_END:
    if hayValidos == true goto L_RET_SUMA
    return -1
L_RET_SUMA:
    return suma`,
    assemblyCode: `.data
str_exito: .string "Procesamiento completado con exito"

.text
.globl main
.globl calcularSumaFiltrada

# 1. Prólogo y Reserva de Marco
calcularSumaFiltrada:
    addi sp, sp, -32
    sw ra, 28(sp)
    sw s0, 24(sp)
    addi s0, sp, 32
    sw a0, -8(s0)       # arr (Heap 0x1020)
    sw a1, -12(s0)      # n = 5
    sw a2, -16(s0)      # umbral = 12

    # 2. Inicialización
    li t0, 0            # suma = 0
    sw t0, -20(s0)
    li t1, 0            # i = 0
    sw t1, -24(s0)

.L_LOOP:
    lw t1, -24(s0)      # t1 = i
    lw a1, -12(s0)      # a1 = n (5)
    bge t1, a1, .L_END  # if i >= n sale

    # Acceso Heap: arr + i*4
    lw a0, -8(s0)
    slli t3, t1, 2      # offset bytes
    add t4, a0, t3
    lw t5, 0(t4)        # t5 = arr[i]

    lw a2, -16(s0)      # umbral (12)
    ble t5, a2, .L_NEXT
    lw t0, -20(s0)
    add t0, t0, t5      # suma += arr[i]
    sw t0, -20(s0)

.L_NEXT:
    addi t1, t1, 1      # i++
    sw t1, -24(s0)
    j .L_LOOP

.L_END:
    lw a0, -20(s0)      # Retorna suma acumulada
    lw s0, 24(sp)
    lw ra, 28(sp)
    addi sp, sp, 32
    ret`,
    frameDescription: 'Marco de 32B con ra, s0, puntero arr en -8(fp), n en -12(fp), umbral en -16(fp) y acumulador suma en -20(fp)',
    steps: [
      {
        pc: '0x0000',
        instruction: 'addi sp, sp, -32 ; sw ra, 28(sp) ; sw s0, 24(sp)',
        comment: 'Prólogo de calcularSumaFiltrada',
        explanation: 'Se reserva el marco de pila de 32 bytes y se ancla el Frame Pointer s0 a sp + 32.',
        registers: { pc: '0x0000', zero: 0, ra: '0x0080', sp: '0x0118', fp: '0x0138', a0: 4128, a1: 5, t0: 0, t1: 0, t2: 0, t3: 0 },
        stack: [
          { addr: '0x0138', offset: '0(fp)', role: 's0 anterior', value: '0x0158' },
          { addr: '0x0134', offset: '-4(fp)', role: 'ra retorno main', value: '0x0080' }
        ],
        heap: [
          { addr: '0x1020', field: 'lista[0]', type: 'int32', value: '10' },
          { addr: '0x1024', field: 'lista[1]', type: 'int32', value: '25' },
          { addr: '0x1028', field: 'lista[2]', type: 'int32', value: '5' },
          { addr: '0x102c', field: 'lista[3]', type: 'int32', value: '40' },
          { addr: '0x1030', field: 'lista[4]', type: 'int32', value: '15' }
        ]
      },
      {
        pc: '0x000C',
        instruction: 'sw a0, -8(s0) ; sw a1, -12(s0) ; sw a2, -16(s0)',
        comment: 'Guardar parámetros: arr (0x1020), n (5), umbral (12)',
        explanation: 'Los parámetros recibidos en registros ABI se guardan en sus ranuras designadas respecto a fp.',
        registers: { pc: '0x000C', zero: 0, ra: '0x0080', sp: '0x0118', fp: '0x0138', a0: 4128, a1: 5, t0: 0, t1: 0, t2: 0, t3: 0 },
        stack: [
          { addr: '0x0138', offset: '0(fp)', role: 's0 anterior', value: '0x0158' },
          { addr: '0x0134', offset: '-4(fp)', role: 'ra retorno', value: '0x0080' },
          { addr: '0x0130', offset: '-8(fp)', role: 'arr base (Heap)', value: '0x1020', highlight: true },
          { addr: '0x012C', offset: '-12(fp)', role: 'tamaño n', value: '5', highlight: true },
          { addr: '0x0128', offset: '-16(fp)', role: 'umbral corte', value: '12', highlight: true }
        ],
        heap: [
          { addr: '0x1020', field: 'lista[0]', type: 'int32', value: '10' },
          { addr: '0x1024', field: 'lista[1]', type: 'int32', value: '25' },
          { addr: '0x1028', field: 'lista[2]', type: 'int32', value: '5' },
          { addr: '0x102c', field: 'lista[3]', type: 'int32', value: '40' },
          { addr: '0x1030', field: 'lista[4]', type: 'int32', value: '15' }
        ]
      },
      {
        pc: '0x0018',
        instruction: 'slli t3, t1, 2 ; add t4, a0, t3 ; lw t5, 0(t4)',
        comment: 'Iteración i=1: cargar lista[1] (25) desde Heap',
        explanation: 'Offset = 1 * 4 = 4 bytes. Dirección = 0x1020 + 4 = 0x1024. Se carga el valor 25 desde el Heap.',
        registers: { pc: '0x0024', zero: 0, ra: '0x0080', sp: '0x0118', fp: '0x0138', a0: 4128, a1: 5, t0: 0, t1: 1, t2: 0, t3: 4 },
        stack: [
          { addr: '0x0130', offset: '-8(fp)', role: 'arr base (Heap)', value: '0x1020' },
          { addr: '0x0124', offset: '-20(fp)', role: 'suma', value: '0' },
          { addr: '0x0120', offset: '-24(fp)', role: 'índice i', value: '1', highlight: true }
        ],
        heap: [
          { addr: '0x1024', field: 'lista[1]', type: 'int32', value: '25' }
        ]
      },
      {
        pc: '0x002C',
        instruction: 'add t0, t0, t5 ; sw t0, -20(s0)',
        comment: 'Filtro: 25 > 12 es TRUE -> suma += 25 (25)',
        explanation: 'El elemento supera el umbral de 12. Se acumula 25 a la suma local y se actualiza en la pila.',
        registers: { pc: '0x0034', zero: 0, ra: '0x0080', sp: '0x0118', fp: '0x0138', a0: 4128, a1: 5, t0: 25, t1: 1, t2: 0, t3: 4 },
        stack: [
          { addr: '0x0124', offset: '-20(fp)', role: 'suma acumulada', value: '25', highlight: true },
          { addr: '0x0120', offset: '-24(fp)', role: 'índice i', value: '1' }
        ]
      },
      {
        pc: '0x0040',
        instruction: 'lw t5, 12(a0) ; add t0, t0, t5 ; lw t5, 16(a0) ; add t0, t0, t5',
        comment: 'Procesar lista[3]=40 y lista[4]=15 -> suma = 25+40+15 = 80',
        explanation: 'Los elementos 40 y 15 superan el umbral 12. La suma total de los elementos filtrados resulta en 80.',
        registers: { pc: '0x004C', zero: 0, ra: '0x0080', sp: '0x0118', fp: '0x0138', a0: 4128, a1: 5, t0: 80, t1: 5, t2: 0, t3: 16 },
        stack: [
          { addr: '0x0124', offset: '-20(fp)', role: 'suma final', value: '80', highlight: true },
          { addr: '0x0120', offset: '-24(fp)', role: 'índice i (fin)', value: '5' }
        ]
      },
      {
        pc: '0x0054',
        instruction: 'lw a0, -20(s0) ; lw s0, 24(sp) ; lw ra, 28(sp) ; addi sp, sp, 32 ; ret',
        comment: 'Epílogo: retornar a0 = 80 al llamador main()',
        explanation: 'Se coloca el resultado final 80 en a0, se destruye el marco de pila y se regresa a main con ret.',
        registers: { pc: '0x005C', zero: 0, ra: '0x0080', sp: '0x0138', fp: '0x0158', a0: 80, a1: 5, t0: 80, t1: 5, t2: 0, t3: 16 },
        stack: [
          { addr: '0x0158', offset: '0(fp_main)', role: 'Marco main()', value: 'main_ctx' }
        ]
      }
    ]
  }
];

