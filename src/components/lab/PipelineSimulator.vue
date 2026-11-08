<template>
  <div class="bg-[#0d1527] border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl text-slate-200">
    <div class="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3">
      <div>
        <h3 class="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <span class="inline-block w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
          Simulador de Traducción Multi-Etapa
        </h3>
        <p class="text-xs text-slate-400 mt-0.5">Visualización del flujo de transformación del programa a través de las 6 fases</p>
      </div>

      <!-- Presets -->
      <div class="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
        <span class="text-slate-400">Casos:</span>
        <button
          v-for="(caseItem, idx) in cases"
          :key="idx"
          @click="selectCase(idx)"
          :class="selectedCaseIdx === idx
            ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold shadow-[0_0_12px_rgba(168,85,247,0.4)]'
            : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700'"
          class="px-2.5 py-1 rounded-lg text-xs font-mono transition cursor-pointer"
        >
          {{ caseItem.title }}
        </button>
      </div>
    </div>

    <!-- Barra de progreso de fases del compilador -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-6">
      <button
        v-for="(stage, idx) in stages"
        :key="idx"
        @click="currentStage = idx"
        :class="[
          currentStage === idx ? 'bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)] ring-2 ring-cyan-400 scale-[1.02]' :
          currentStage > idx ? 'bg-purple-950/50 text-purple-300 border border-purple-500/40' : 'bg-slate-900 text-slate-400 border border-slate-800',
          'px-2 py-2.5 rounded-xl text-xs flex flex-col items-center justify-center transition cursor-pointer text-center'
        ]"
      >
        <span class="text-[10px] uppercase tracking-wider opacity-80 font-mono">Fase {{ idx + 1 }}</span>
        <span class="truncate w-full font-sans text-xs">{{ stage.name }}</span>
      </button>
    </div>

    <!-- Contenido de la fase activa -->
    <div class="bg-[#080d1a] border border-slate-800 rounded-xl p-4 sm:p-5 mb-4 min-h-64 shadow-inner">
      <div class="flex flex-wrap items-center justify-between gap-2 mb-3 border-b border-slate-800 pb-2.5">
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            Fase {{ currentStage + 1 }}: {{ stages[currentStage].name }}
          </span>
          <span class="text-xs text-slate-400 hidden sm:inline">{{ stages[currentStage].subtitle }}</span>
        </div>
        <div class="text-xs font-mono text-purple-300">
          Estructura: <strong class="text-white">{{ stages[currentStage].structure }}</strong>
        </div>
      </div>

      <!-- Explicación conceptual de la etapa -->
      <div class="mb-4 text-xs text-slate-300 leading-relaxed bg-slate-900/70 p-3.5 rounded-xl border border-slate-800">
        {{ currentCaseData.stageExplanations[currentStage] }}
      </div>

      <!-- Representación visual del código / datos en esta fase -->
      <div class="overflow-x-auto">
        <pre
          v-if="currentStage === 0"
          v-html="highlightCode(currentCaseData.stageArtifacts[currentStage], 'c')"
          class="font-mono text-xs sm:text-sm p-4 bg-[#0a101f] rounded-xl border border-slate-800 leading-relaxed whitespace-pre-wrap"
        ></pre>
        <pre
          v-else-if="currentStage === 4"
          v-html="highlightC3D(currentCaseData.stageArtifacts[currentStage])"
          class="font-mono text-xs sm:text-sm p-4 bg-[#0a101f] rounded-xl border border-slate-800 leading-relaxed whitespace-pre-wrap"
        ></pre>
        <pre
          v-else-if="currentStage === 5"
          v-html="highlightRiscv(currentCaseData.stageArtifacts[currentStage])"
          class="font-mono text-xs sm:text-sm p-4 bg-[#0a101f] rounded-xl border border-slate-800 leading-relaxed whitespace-pre-wrap"
        ></pre>
        <pre
          v-else
          class="font-mono text-xs sm:text-sm p-4 bg-[#0a101f] rounded-xl border border-slate-800 text-cyan-200 leading-relaxed whitespace-pre-wrap"
        >{{ currentCaseData.stageArtifacts[currentStage] }}</pre>
      </div>
    </div>

    <!-- Controles de Navegación -->
    <div class="flex items-center justify-between gap-2">
      <button
        @click="prevStage"
        :disabled="currentStage === 0"
        :class="currentStage === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-800 cursor-pointer text-cyan-400'"
        class="px-3 sm:px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono flex items-center gap-1.5 transition"
      >
        ◀ Fase Anterior
      </button>

      <span class="text-xs font-mono text-slate-400">
        Paso {{ currentStage + 1 }} de {{ stages.length }}
      </span>

      <button
        @click="nextStage"
        :disabled="currentStage === stages.length - 1"
        :class="currentStage === stages.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:opacity-90 cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.4)]'"
        class="px-3 sm:px-4 py-2 bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 font-bold rounded-xl text-xs font-mono flex items-center gap-1.5 transition"
      >
        Siguiente Fase ▶
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { highlightCode, highlightC3D, highlightRiscv } from '../../utils/syntaxHighlight';

const currentStage = ref(0);
const selectedCaseIdx = ref(0);

const stages = [
  { name: 'Código Fuente', subtitle: 'Entrada en alto nivel', structure: 'Texto crudo / Streams' },
  { name: 'Análisis Léxico', subtitle: 'Escaneo de tokens', structure: 'Tuplas <Token, Lexema>' },
  { name: 'Análisis Sintáctico', subtitle: 'Construcción jerárquica', structure: 'AST (Abstract Syntax Tree)' },
  { name: 'Análisis Semántico', subtitle: 'Tipos y ámbitos', structure: 'Tabla de Símbolos Decorada' },
  { name: 'Código Intermedio', subtitle: 'Aplanado y temporales', structure: 'C3D / Cuádruplas' },
  { name: 'RISC-V RV32I', subtitle: 'Emisión de ensamble', structure: 'Instrucciones Máquina' }
];

const cases = [
  {
    title: 'Aritmética & Asignación',
    stageExplanations: [
      'El programador escribe una asignación aritmética compuesta en lenguaje fuente con precedencia de operadores.',
      'El escáner convierte el flujo de caracteres en tokens clasificados, reconociendo números, variables y delimitadores.',
      'El parser valida las producciones de la gramática libre de contexto y construye el Árbol Sintáctico Abstracto.',
      'El comprobador de tipos verifica que las variables estén declaradas en el ámbito actual y que los tipos sean compatibles.',
      'Se descompone la expresión respetando la regla del Ing. Mario Ramírez Tobar: máximo 3 accesos a memoria por instrucción.',
      'El generador mapea los temporales a registros temporales (t0-t6) e instrucciones RV32I con offsets canónicos.'
    ],
    stageArtifacts: [
      '// Código Fuente Original\nint x;\nx = (10 + 5) * 3 - 2;',
      '// Flujo de Tokens Léxicos\n<KW_INT, "int"> <ID, "x"> <SEMICOLON, ";">\n<ID, "x"> <ASSIGN, "="> <LPAREN, "("> <NUM, "10"> <OP_ADD, "+">\n<NUM, "5"> <RPAREN, ")"> <OP_MUL, "*"> <NUM, "3"> <OP_SUB, "-"> <NUM, "2"> <SEMICOLON, ";">',
      '// Árbol Sintáctico Abstracto (AST)\nAssignment (=)\n ├── Target: ID(x)\n └── Value: BinaryOp (-)\n      ├── Left: BinaryOp (*)\n      │    ├── Left: BinaryOp (+)\n      │    │    ├── Left: Num(10)\n      │    │    └── Right: Num(5)\n      │    └── Right: Num(3)\n      └── Right: Num(2)',
      '// Comprobación Semántica & Tabla de Símbolos\n--------------------------------------------------------\nNombre   | Categoría | Tipo  | Ámbito | Offset / Dirección\n--------------------------------------------------------\nx        | Variable  | int32 | Local  | -12(fp)\n\nComprobación de Tipos:\n  (10 + 5) => int + int = int\n  (int) * 3 => int * int = int\n  (int) - 2 => int - int = int\n  x = int   => Compatibilidad estricta: CORRECTA',
      '// Código de Tres Direcciones (C3D) & Temporales\nt1 = 10 + 5\nt2 = t1 * 3\nt3 = t2 - 2\nx = t3',
      '# Código Objeto Ensamblador RISC-V (RV32I)\n  li t0, 10\n  li t1, 5\n  add t2, t0, t1      # t2 = 10 + 5 = 15\n  li t3, 3\n  mul t4, t2, t3      # t4 = 15 * 3 = 45\n  li t5, 2\n  sub t6, t4, t5      # t6 = 45 - 2 = 43\n  sw t6, -12(fp)      # Almacena en la variable local x'
    ]
  },
  {
    title: 'Condicional If-Else',
    stageExplanations: [
      'Sentencia condicional con salto alternativo.',
      'Reconocimiento de palabras reservadas "if", "else" y operadores de comparación.',
      'AST con nodo IfElse que contiene la condición, rama verdadera y rama falsa.',
      'Verificación semántica: la condición debe evaluar estrictamente a tipo booleano.',
      'Traducción C3D con etiquetas de salto condicional (L_VERDADERO, L_FALSO, L_FIN).',
      'Traducción a saltos condicionales RISC-V con bgt, beq y saltos incondicionales j.'
    ],
    stageArtifacts: [
      '// Código Fuente Original\nif (a > b) {\n    max = a;\n} else {\n    max = b;\n}',
      '<KW_IF, "if"> <LPAREN, "("> <ID, "a"> <OP_GT, ">"> <ID, "b"> <RPAREN, ")">\n<LBRACE, "{"> <ID, "max"> <ASSIGN, "="> <ID, "a"> <SEMICOLON, ";"> <RBRACE, "}">\n<KW_ELSE, "else"> <LBRACE, "{"> <ID, "max"> <ASSIGN, "="> <ID, "b"> <SEMICOLON, ";"> <RBRACE, "}">',
      'IfElseNode\n ├── Condition: RelOp (>)\n │    ├── Left: ID(a)\n │    └── Right: ID(b)\n ├── TrueBranch:\n │    └── Assignment(max = a)\n └── FalseBranch:\n      └── Assignment(max = b)',
      'Tabla de Símbolos:\n  a   : int (-12(fp))\n  b   : int (-16(fp))\n  max : int (-20(fp))\n\nComprobación Semántica:\n  Condition: (a > b) -> bool (válida para if)',
      '// C3D con Etiquetas de Flujo\n  if a > b goto L1\n  goto L2\nL1:\n  max = a\n  goto L3\nL2:\n  max = b\nL3:\n  // Fin de bloque',
      '# Ensamble RISC-V RV32I\n  lw t0, -12(fp)      # t0 = a\n  lw t1, -16(fp)      # t1 = b\n  bgt t0, t1, .L1     # Salta si a > b\n  j .L2\n.L1:\n  sw t0, -20(fp)      # max = a\n  j .L3\n.L2:\n  sw t1, -20(fp)      # max = b\n.L3:\n  # continúa ejecución'
    ]
  }
];

const currentCaseData = computed(() => cases[selectedCaseIdx.value]);

function selectCase(idx: number) {
  selectedCaseIdx.value = idx;
  currentStage.value = 0;
}

function nextStage() {
  if (currentStage.value < stages.length - 1) {
    currentStage.value++;
  }
}

function prevStage() {
  if (currentStage.value > 0) {
    currentStage.value--;
  }
}
</script>
