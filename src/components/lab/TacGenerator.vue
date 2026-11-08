<template>
  <div class="bg-[#0d1527] border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl text-slate-200">
    <!-- Encabezado -->
    <div class="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3">
      <div>
        <h3 class="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <span class="inline-block w-3 h-3 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span>
          Generador de Código Intermedio C3D & Cuádruplas
        </h3>
        <p class="text-xs text-slate-400 mt-0.5">Descomposición en Código de Tres Direcciones, Cuartetos y Tripletas</p>
      </div>

      <!-- Presets -->
      <div class="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
        <span class="text-slate-400">Ejemplos:</span>
        <button
          v-for="(sample, idx) in samples"
          :key="idx"
          @click="loadSample(sample.code)"
          class="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-purple-500/40 text-slate-300 hover:text-purple-300 rounded-lg transition cursor-pointer text-xs font-mono"
        >
          {{ sample.label }}
        </button>
      </div>
    </div>

    <!-- Entrada -->
    <div class="mb-4">
      <label class="block text-xs uppercase tracking-wider text-slate-400 mb-1 font-mono">Expresión matemática o condicional:</label>
      <input
        v-model="inputCode"
        @input="generate"
        type="text"
        class="w-full bg-[#080d1a] border border-slate-700/80 rounded-xl px-4 py-2.5 font-mono text-sm text-white focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
        placeholder="Ej: x = a + b * (c - 8)"
      />
    </div>

    <!-- Pestañas: C3D vs Cuádruplas vs Tripletas -->
    <div class="flex border-b border-slate-800 mb-4 text-xs font-mono overflow-x-auto">
      <button
        @click="activeTab = 'tac'"
        :class="activeTab === 'tac' ? 'border-b-2 border-purple-400 text-purple-300 font-bold' : 'text-slate-400 hover:text-white'"
        class="px-4 py-2 cursor-pointer transition shrink-0"
      >
        Código de Tres Direcciones (C3D)
      </button>
      <button
        @click="activeTab = 'cuadruplas'"
        :class="activeTab === 'cuadruplas' ? 'border-b-2 border-purple-400 text-purple-300 font-bold' : 'text-slate-400 hover:text-white'"
        class="px-4 py-2 cursor-pointer transition shrink-0"
      >
        Cuádruplas / Cuartetos ({{ result.quadruples.length }})
      </button>
      <button
        @click="activeTab = 'tripletas'"
        :class="activeTab === 'tripletas' ? 'border-b-2 border-purple-400 text-purple-300 font-bold' : 'text-slate-400 hover:text-white'"
        class="px-4 py-2 cursor-pointer transition shrink-0"
      >
        Tripletas ({{ result.triples.length }})
      </button>
    </div>

    <!-- Vista C3D -->
    <div v-if="activeTab === 'tac'" class="space-y-3">
      <div class="p-3 sm:p-4 bg-[#080d1a] rounded-xl border border-slate-800 font-mono text-xs sm:text-sm overflow-x-auto">
        <div v-if="result.tacLines.length > 0" class="space-y-1">
          <div
            v-for="(line, idx) in result.tacLines"
            :key="idx"
            class="flex items-center gap-4 py-0.5 hover:bg-slate-900/60 px-2 rounded"
          >
            <span class="text-xs text-slate-500 w-6 select-none">{{ idx + 1 }}.</span>
            <span :class="line.endsWith(':') ? 'text-purple-400 font-bold font-mono' : 'text-slate-200 font-mono'">{{ line }}</span>
          </div>
        </div>
        <div v-else class="text-slate-500 text-xs">No se ha generado C3D aún.</div>
      </div>
      <div class="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-400 leading-relaxed">
        <strong class="text-white">Regla del Ing. Mario Ramírez Tobar:</strong> En Código de Tres Direcciones ninguna instrucción puede acceder a más de 3 posiciones en memoria a la vez (destino, operando 1 y operando 2). Las expresiones compuestas se descomponen usando variables temporales (<code class="text-cyan-400 font-bold">t1, t2, ...</code>).
      </div>
    </div>

    <!-- Vista Cuádruplas -->
    <div v-if="activeTab === 'cuadruplas'" class="space-y-3">
      <div class="overflow-x-auto max-h-72 overflow-y-auto border border-slate-800 rounded-xl bg-[#080d1a]">
        <table class="w-full text-left text-xs font-mono min-w-[500px]">
          <thead class="bg-[#0a101f] text-slate-300 sticky top-0 border-b border-slate-800">
            <tr>
              <th class="p-2.5">#</th>
              <th class="p-2.5">Operador (op)</th>
              <th class="p-2.5">Argumento 1 (arg1)</th>
              <th class="p-2.5">Argumento 2 (arg2)</th>
              <th class="p-2.5">Resultado / Destino (dest)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60">
            <tr v-for="q in result.quadruples" :key="q.index" class="hover:bg-slate-900/50">
              <td class="p-2.5 text-slate-500">({{ q.index }})</td>
              <td class="p-2.5 font-bold text-purple-400">{{ q.op }}</td>
              <td class="p-2.5 text-cyan-400">{{ q.arg1 }}</td>
              <td class="p-2.5 text-cyan-400">{{ q.arg2 }}</td>
              <td class="p-2.5"><span class="text-sky-300 font-bold bg-slate-900 border border-sky-500/30 px-2 py-0.5 rounded">{{ q.dest }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="text-xs text-slate-400">
        Las cuádruplas tienen cuatro campos: <code class="text-purple-300">(op, arg1, arg2, dest)</code>. Facilitan la optimización ya que el destino temporal es explícito e indexable independientemente.
      </p>
    </div>

    <!-- Vista Tripletas -->
    <div v-if="activeTab === 'tripletas'" class="space-y-3">
      <div class="overflow-x-auto max-h-72 overflow-y-auto border border-slate-800 rounded-xl bg-[#080d1a]">
        <table class="w-full text-left text-xs font-mono min-w-[500px]">
          <thead class="bg-[#0a101f] text-slate-300 sticky top-0 border-b border-slate-800">
            <tr>
              <th class="p-2.5">Índice</th>
              <th class="p-2.5">Operador (op)</th>
              <th class="p-2.5">Argumento 1 (arg1)</th>
              <th class="p-2.5">Argumento 2 (arg2)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60">
            <tr v-for="t in result.triples" :key="t.index" class="hover:bg-slate-900/50">
              <td class="p-2.5 text-slate-500">({{ t.index }})</td>
              <td class="p-2.5 font-bold text-purple-400">{{ t.op }}</td>
              <td class="p-2.5 text-cyan-400">{{ formatTripleArg(t.arg1) }}</td>
              <td class="p-2.5 text-cyan-400">{{ formatTripleArg(t.arg2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="text-xs text-slate-400">
        Las tripletas omiten el campo resultado explícito: las referencias a los resultados intermedios se hacen directamente usando el índice de la instrucción previa entre paréntesis <code class="text-cyan-400 font-bold">(0), (1), ...</code>.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { compileToC3D, type TranslationResult } from '../../utils/c3dParser';

const inputCode = ref('x = a + b * (c - 8)');
const activeTab = ref<'tac' | 'cuadruplas' | 'tripletas'>('tac');

const samples = [
  { label: 'Asignación Aritmética', code: 'x = a + b * (c - 8)' },
  { label: 'Expresión Larga', code: 'res = (a + b) * (c + d) / 2' },
  { label: 'Indexación 2D', code: 'arr[i][j] = val + 1' },
  { label: 'Condición Lógica', code: 'x > 0 && y <= 100' }
];

const result = ref<TranslationResult>({
  tokens: [],
  ast: null,
  tacLines: [],
  quadruples: [],
  triples: [],
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
  if (!arg) return '-';
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
