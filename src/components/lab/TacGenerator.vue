<template>
  <div class="bg-[#0d1527] border border-slate-800 rounded-3xl p-4 sm:p-7 shadow-2xl text-slate-200 space-y-5">
    <!-- Encabezado -->
    <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
      <div>
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-950/60 text-purple-300 border border-purple-500/30 mb-2 shadow-[0_0_10px_rgba(168,85,247,0.25)]">
          <span>⚙️</span>
          <span>MOTOR DE GENERACIÓN INTERMEDIA Y RISC-V</span>
        </div>
        <h3 class="text-lg sm:text-2xl font-extrabold text-white flex items-center gap-2.5">
          <span class="inline-block w-3 h-3 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.9)] animate-pulse"></span>
          Generador de C3D, Cuádruplas, Tripletas y RISC-V
        </h3>
        <p class="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
          Escriba expresiones de una o múltiples líneas (operaciones aritméticas, relacionales, arreglos 2D, condicionales, ciclos, POO o recursión).
        </p>
      </div>

      <!-- Presets Complejos y Didácticos -->
      <div class="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
        <span class="text-slate-400 font-mono font-bold">Casos:</span>
        <button
          v-for="(sample, idx) in samples"
          :key="idx"
          @click="loadSample(sample.code)"
          class="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-purple-400 text-slate-300 hover:text-purple-300 rounded-xl transition cursor-pointer text-xs font-mono font-semibold"
        >
          {{ sample.label }}
        </button>
      </div>
    </div>

    <!-- Entrada de Código Multilínea -->
    <div class="space-y-2">
      <div class="flex items-center justify-between text-xs font-mono">
        <label class="uppercase tracking-wider text-slate-300 font-bold flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
          Código Fuente de Entrada (Multilínea / Expresiones / Control)
        </label>
        <span class="text-slate-400">
          {{ inputCode.split('\n').length }} línea(s)
        </span>
      </div>
      <div class="relative rounded-2xl border border-slate-700/80 bg-[#080d1a] overflow-hidden shadow-inner focus-within:border-purple-400 transition">
        <textarea
          v-model="inputCode"
          @input="generate"
          rows="5"
          spellcheck="false"
          class="w-full bg-transparent p-4 font-mono text-sm sm:text-base text-cyan-200 leading-relaxed focus:outline-none resize-y selection:bg-purple-500 selection:text-white"
          placeholder="Ej: x =  5 + 1 > y * 2; o múltiples líneas de código..."
        ></textarea>
      </div>
      <!-- Alerta de Error si ocurre -->
      <div v-if="result.errors.length > 0" class="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-red-300 text-xs font-mono flex items-center gap-2">
        <span>⚠️</span>
        <span>{{ result.errors[0] }}</span>
      </div>
    </div>

    <!-- Pestañas: C3D vs Cuádruplas vs Tripletas vs RISC-V -->
    <div class="flex border-b border-slate-800 text-xs sm:text-sm font-mono overflow-x-auto gap-1">
      <button
        @click="activeTab = 'tac'"
        :class="activeTab === 'tac' ? 'border-b-2 border-purple-400 text-purple-300 font-bold bg-purple-950/20' : 'text-slate-400 hover:text-white'"
        class="px-4 py-2.5 rounded-t-xl transition cursor-pointer shrink-0 flex items-center gap-1.5"
      >
        <span>1. Código Tres Direcciones (C3D)</span>
        <span class="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">{{ result.tacLines.length }}</span>
      </button>
      <button
        @click="activeTab = 'cuadruplas'"
        :class="activeTab === 'cuadruplas' ? 'border-b-2 border-purple-400 text-purple-300 font-bold bg-purple-950/20' : 'text-slate-400 hover:text-white'"
        class="px-4 py-2.5 rounded-t-xl transition cursor-pointer shrink-0 flex items-center gap-1.5"
      >
        <span>2. Cuádruplas / Cuartetos</span>
        <span class="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">{{ result.quadruples.length }}</span>
      </button>
      <button
        @click="activeTab = 'tripletas'"
        :class="activeTab === 'tripletas' ? 'border-b-2 border-purple-400 text-purple-300 font-bold bg-purple-950/20' : 'text-slate-400 hover:text-white'"
        class="px-4 py-2.5 rounded-t-xl transition cursor-pointer shrink-0 flex items-center gap-1.5"
      >
        <span>3. Tripletas</span>
        <span class="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">{{ result.triples.length }}</span>
      </button>
      <button
        @click="activeTab = 'riscv'"
        :class="activeTab === 'riscv' ? 'border-b-2 border-cyan-400 text-cyan-300 font-bold bg-cyan-950/20' : 'text-slate-400 hover:text-white'"
        class="px-4 py-2.5 rounded-t-xl transition cursor-pointer shrink-0 flex items-center gap-1.5"
      >
        <span>4. Ensamblador RV32I</span>
        <span class="text-[10px] bg-cyan-950 px-1.5 py-0.5 rounded text-cyan-300 border border-cyan-500/30">RISC-V</span>
      </button>
    </div>

    <!-- Vista 1: C3D -->
    <div v-if="activeTab === 'tac'" class="space-y-3">
      <div class="p-4 bg-[#080d1a] rounded-2xl border border-slate-800 font-mono text-xs sm:text-sm overflow-x-auto shadow-inner max-h-96 overflow-y-auto">
        <div v-if="result.tacLines.length > 0" class="space-y-1">
          <div
            v-for="(line, idx) in result.tacLines"
            :key="idx"
            class="flex items-center gap-3 py-0.5 hover:bg-slate-900/60 px-2 rounded"
          >
            <span class="text-xs text-slate-500 w-8 select-none text-right font-mono">{{ idx + 1 }}.</span>
            <span v-html="highlightC3DLine(line)" class="font-mono text-xs sm:text-sm"></span>
          </div>
        </div>
        <div v-else class="text-slate-500 text-xs py-4 text-center">No se ha generado C3D aún.</div>
      </div>
      <div class="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-400 leading-relaxed">
        <strong class="text-white">Regla canónica de C3D (Mario Ramírez Tobar):</strong> Ninguna instrucción accede a más de 3 direcciones a la vez (1 destino y 2 operandos). Las expresiones compuestas o anidadas se descomponen secuencialmente usando temporales (<code class="text-cyan-400 font-bold">t1, t2, ...</code>).
      </div>
    </div>

    <!-- Vista 2: Cuádruplas -->
    <div v-if="activeTab === 'cuadruplas'" class="space-y-3">
      <div class="overflow-x-auto max-h-80 overflow-y-auto border border-slate-800 rounded-2xl bg-[#080d1a]">
        <table class="w-full text-left text-xs font-mono min-w-[500px]">
          <thead class="bg-[#0a101f] text-slate-300 sticky top-0 border-b border-slate-800">
            <tr>
              <th class="p-3">#</th>
              <th class="p-3">Operador (op)</th>
              <th class="p-3">Argumento 1 (arg1)</th>
              <th class="p-3">Argumento 2 (arg2)</th>
              <th class="p-3">Resultado / Destino (dest)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60">
            <tr v-for="q in result.quadruples" :key="q.index" class="hover:bg-slate-900/50">
              <td class="p-3 text-slate-500 font-bold">({{ q.index }})</td>
              <td class="p-3 font-bold text-purple-400">{{ q.op }}</td>
              <td class="p-3 text-cyan-300">{{ q.arg1 }}</td>
              <td class="p-3 text-cyan-300">{{ q.arg2 }}</td>
              <td class="p-3"><span class="text-sky-300 font-bold bg-slate-900 border border-sky-500/30 px-2 py-0.5 rounded">{{ q.dest }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="text-xs text-slate-400">
        Las cuádruplas tienen cuatro campos: <code class="text-purple-300">(op, arg1, arg2, dest)</code>. Al tener un destino explícito e independiente, facilitan la reordenación de código, propagación de constantes y eliminación de subexpresiones comunes.
      </p>
    </div>

    <!-- Vista 3: Tripletas -->
    <div v-if="activeTab === 'tripletas'" class="space-y-3">
      <div class="overflow-x-auto max-h-80 overflow-y-auto border border-slate-800 rounded-2xl bg-[#080d1a]">
        <table class="w-full text-left text-xs font-mono min-w-[500px]">
          <thead class="bg-[#0a101f] text-slate-300 sticky top-0 border-b border-slate-800">
            <tr>
              <th class="p-3">Índice</th>
              <th class="p-3">Operador (op)</th>
              <th class="p-3">Argumento 1 (arg1)</th>
              <th class="p-3">Argumento 2 (arg2)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60">
            <tr v-for="t in result.triples" :key="t.index" class="hover:bg-slate-900/50">
              <td class="p-3 text-slate-500 font-bold">({{ t.index }})</td>
              <td class="p-3 font-bold text-purple-400">{{ t.op }}</td>
              <td class="p-3 text-cyan-300">{{ formatTripleArg(t.arg1) }}</td>
              <td class="p-3 text-cyan-300">{{ formatTripleArg(t.arg2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="text-xs text-slate-400">
        Las tripletas omiten el campo de destino explícito: cada operación referencia sus entradas mediante el índice posicional entre paréntesis <code class="text-cyan-400 font-bold">(0), (1), ...</code>, ahorrando memoria en la tabla de símbolos interna del compilador.
      </p>
    </div>

    <!-- Vista 4: RISC-V RV32I -->
    <div v-if="activeTab === 'riscv'" class="space-y-3">
      <div class="p-4 bg-[#080d1a] rounded-2xl border border-slate-800 font-mono text-xs sm:text-sm overflow-x-auto shadow-inner max-h-96 overflow-y-auto">
        <div v-if="result.riscvCode.length > 0" class="space-y-0.5 font-mono text-xs sm:text-sm leading-relaxed">
          <div
            v-for="(rLine, rIdx) in result.riscvCode"
            :key="rIdx"
            class="flex items-start gap-3 hover:bg-slate-900/60 px-2 py-0.5 rounded"
          >
            <span class="text-xs text-slate-500 w-8 select-none text-right shrink-0">{{ rIdx + 1 }}.</span>
            <span v-html="highlightRiscvLine(rLine)" class="whitespace-pre font-mono flex-1"></span>
          </div>
        </div>
        <div v-else class="text-slate-500 text-xs py-4 text-center">No se ha generado código RISC-V aún.</div>
      </div>
      <div class="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-400 leading-relaxed">
        <strong class="text-cyan-300">Generación a RISC-V RV32I:</strong> Las operaciones relacionales (<code class="text-white">&gt;, &lt;, &gt;=, ==</code>) se mapean canónicamente usando <code class="text-pink-400 font-bold">slt</code>, <code class="text-pink-400 font-bold">xori</code>, <code class="text-pink-400 font-bold">seqz</code> y <code class="text-pink-400 font-bold">snez</code>, preservando el ancla de pila <code class="text-purple-300 font-bold">s0/fp</code>.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { compileToC3D, type TranslationResult } from '../../utils/c3dParser';
import { highlightC3DLine, highlightRiscvLine } from '../../utils/syntaxHighlight';

const inputCode = ref('x =  5 + 1 > y * 2;');
const activeTab = ref<'tac' | 'cuadruplas' | 'tripletas' | 'riscv'>('tac');

const samples = [
  { label: '1. Relacional x = 5+1 > y*2;', code: 'x =  5 + 1 > y * 2;' },
  { label: '2. Matriz 2D matriz[i][j]', code: 'matriz[i][j] = val + 5;\nres = matriz[i][j] * 2;' },
  { label: '3. Condicional if-else', code: 'if (a > b) {\n  max = a;\n} else {\n  max = b;\n}' },
  { label: '4. Ciclo while & Arreglo', code: 'while (i < 10) {\n  arr[i] = i * 2;\n  i = i + 1;\n}' },
  { label: '5. POO / Heap con this', code: 'this.saldo = this.saldo + monto;\nreturn this.saldo;' },
  { label: '6. Recursión Factorial', code: 'if (n <= 1) {\n  return 1;\n}\nreturn n * factorial(n - 1);' }
];

const result = ref<TranslationResult>({
  tokens: [],
  ast: null,
  tacLines: [],
  quadruples: [],
  triples: [],
  riscvCode: [],
  errors: []
});

function generate() {
  if (!inputCode.value.trim()) {
    result.value = {
      tokens: [],
      ast: null,
      tacLines: [],
      quadruples: [],
      triples: [],
      riscvCode: [],
      errors: []
    };
    return;
  }
  result.value = compileToC3D(inputCode.value);
}

function loadSample(code: string) {
  inputCode.value = code;
  generate();
}

function formatTripleArg(arg: string): string {
  if (!arg || arg === '_') return '-';
  if (arg.startsWith('t') && !isNaN(Number(arg.slice(1)))) {
    const idx = Number(arg.slice(1)) - 1;
    return `(${idx})`;
  }
  return arg;
}

onMounted(() => {
  generate();
});
</script>