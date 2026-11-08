export interface ReferenceItem {
  id: string;
  type: 'pdf' | 'web' | 'academic';
  title: string;
  author: string;
  year?: string;
  details: string;
  url?: string;
  topicsCovered: string[];
}

export const REFERENCES: ReferenceItem[] = [
  {
    id: 'ref-c3d-pdf',
    type: 'pdf',
    title: 'Generación de código Intermedio',
    author: 'Ing. Mario Ramírez Tobar',
    details: 'Material de cátedra oficial. Desarrolla la teoría de subprogramas, el stack de activación, el principio de 3 direcciones, aplanamiento de arreglos multidimensionales (2D y 3D), expresiones booleanas con cortocircuito, jerarquía lógica, llamadas a funciones y representación en cuartetos y tripletas.',
    topicsCovered: [
      'Subprogramas y pila de activación (pág. 5-115)',
      'Fundamentos y restricciones de C3D (pág. 118-173)',
      'Estructuras if-else y ciclos do-while y for (pág. 182-292)',
      'Arreglos 1D, 2D y 3D en C3D (pág. 293-450)',
      'Expresiones booleanas y saltos condicionales (pág. 452-623)',
      'Llamadas a funciones, I/O en consola y constantes (pág. 624-710)',
      'Cuartetos y Tripletas (pág. 711-733)'
    ]
  },
  {
    id: 'ref-sdd-tipos-pdf',
    type: 'pdf',
    title: 'Traducción Dirigida por la sintaxis y comprobación de tipos',
    author: 'Ing. Mario Ramírez Tobar',
    details: 'Material de cátedra oficial. Contiene la teoría exhaustiva de Definiciones Dirigidas por la Sintaxis (S-atribuidas y L-atribuidas), eliminación de recursividad izquierda tratando acciones como terminales, funcionamiento LIFO del Stack en analizadores LL y LR, comprobaciones semánticas estáticas (tipos, nombres, ámbitos, flujo, unicidad, accesos) y diseño formal de la Tabla de Tipos y Tabla de Símbolos.',
    topicsCovered: [
      'Definiciones Dirigidas por la Sintaxis (DDS) (pág. 63-95)',
      'Atributos Sintetizados y Heredados (pág. 96-222)',
      'Eliminación de recursividad por la izquierda (pág. 310-379)',
      'El Stack en analizadores LL y LR (pág. 380-547)',
      'Esquemas de traducción postfijo y descenso recursivo (pág. 548-705)',
      'Análisis Semántico y Comprobaciones Estáticas (pág. 707-884)',
      'Tabla de Tipos y Tabla de Símbolos con caso Pascal (pág. 885-1375)'
    ]
  },
  {
    id: 'ref-riscv-web',
    type: 'web',
    title: 'De Código 3 Direcciones a RISC-V | Compiladores 2',
    author: 'Ing. Mario Ramírez Tobar',
    url: 'https://marito-website.vercel.app/slides/compiladores-2/risc-v.html',
    details: 'Plataforma web de diapositivas interactivas en Reveal.js con estilo Synthwave Retro Mate. Detalla la arquitectura RV32I, registros ABI, mnemónicos, el rol del Frame Pointer vs Stack Pointer, convención canónica de marco de pila -offset(fp), diferencias j vs jal, matriz de traducción de cuádruplas, separación Heap vs Stack en POO, llamadas recursivas y trazado paso a paso de Factorial, llamadas encadenadas A->B->C y QuickSort.',
    topicsCovered: [
      'Glosario de Registros ABI RV32I (Slides 7-9)',
      'Mnemónicos y regla nemotécnica (Slide 10)',
      'Direccionamiento fijo con -offset(fp) (Slides 11-13)',
      'Traducción de C3D a RISC-V con Frame Pointer (Slides 14-26)',
      'Justificación técnica del Frame Pointer y j vs jal (Slides 27-33)',
      'Caso completo: De Java a RISC-V con Frame Pointer (Slides 34-37)',
      'POO en Assembler: Heap, puntero this y recursión (Slides 38-41)',
      'Matriz de Cuádruplas a RISC-V (Slides 42-44)',
      'Simulaciones paso a paso de Factorial(4), A->B->C y QuickSort (Slides 45-49)'
    ]
  },
  {
    id: 'ref-dragon-book',
    type: 'academic',
    title: 'Compilers: Principles, Techniques, and Tools (Dragon Book)',
    author: 'Alfred V. Aho, Monica S. Lam, Ravi Sethi, Jeffrey D. Ullman',
    year: '2006 (2nd Edition)',
    details: 'Texto canónico de referencia internacional en compiladores. Provee el fundamento formal para la construcción de Thompson, subconjuntos, analizadores LR, grafos de flujo de control (CFG), representaciones intermedias y algoritmos de optimización global.',
    topicsCovered: [
      'Análisis Léxico y Autómatas (Capítulo 3)',
      'Análisis Sintáctico ascendente y descendente (Capítulo 4)',
      'Traducción dirigida por la sintaxis (Capítulo 5)',
      'Comprobación de tipos (Capítulo 6)',
      'Generación de código y optimización (Capítulos 8 y 9)'
    ]
  },
  {
    id: 'ref-riscv-spec',
    type: 'academic',
    title: 'The RISC-V Instruction Set Manual, Volume I: User-Level ISA (RV32I)',
    author: 'Andrew Waterman, Krste Asanović (UC Berkeley)',
    year: '2019',
    details: 'Especificación estándar de la arquitectura de conjunto de instrucciones RISC-V de 32 bits enteros (RV32I) y la convención ABI de registros estándar de llamada y marco.',
    topicsCovered: [
      'Registros de propósito general y registros de control',
      'Formatos de instrucción R, I, S, B, U, J',
      'Convención de llamada estándar (ABI Calling Convention)'
    ]
  }
];

