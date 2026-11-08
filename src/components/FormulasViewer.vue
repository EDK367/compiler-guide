<template>
  <div class="space-y-6">
    <!-- Barra de control y filtrado -->
    <div class="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 bg-[#0d1527] rounded-2xl border border-slate-800 shadow-lg">
      <div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <button
          v-for="cat in categories"
          :key="cat"
          @click="selectedCategory = cat"
          :class="selectedCategory === cat
            ? 'bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
            : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800 hover:border-slate-700'"
          class="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-mono transition cursor-pointer"
        >
          {{ cat }}
        </button>
      </div>

      <div class="w-full sm:w-auto">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Filtrar por nombre o símbolo..."
          class="w-full sm:w-64 bg-[#080d1a] border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
        />
      </div>
    </div>

    <!-- Lista de Fórmulas -->
    <div class="space-y-6">
      <div
        v-for="formula in filteredFormulas"
        :key="formula.id"
        :id="formula.id"
        class="bg-[#0d1527] rounded-2xl border border-slate-800 hover:border-cyan-500/30 p-4 sm:p-6 shadow-xl space-y-5 scroll-mt-20 transition duration-200"
      >
        <!-- Encabezado de Fórmula -->
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
            <span class="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-950/60 text-purple-300 border border-purple-500/30 font-bold">
              {{ formula.category }}
            </span>
            <h3 class="text-base sm:text-lg font-bold text-white font-sans">{{ formula.name }}</h3>
          </div>
          <span class="text-xs font-mono text-cyan-400">ID: {{ formula.id }}</span>
        </div>

        <!-- Renderizado de la Expresión Matemática -->
        <div class="p-3 sm:p-4 bg-[#080d1a] rounded-xl border border-slate-800/80 overflow-x-auto text-center shadow-inner">
          <div class="inline-block text-cyan-200" v-html="renderLatexDisplay(formula.latex)"></div>
        </div>

        <!-- Significado de Símbolos -->
        <div class="space-y-2">
          <h4 class="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
            <span>🏷️</span> Significado de cada Símbolo
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            <div
              v-for="(sym, sIdx) in formula.symbols"
              :key="sIdx"
              class="p-2.5 bg-[#080d1a] rounded-xl border border-slate-800/70 flex items-start gap-2 text-xs"
            >
              <code class="text-cyan-300 font-bold shrink-0 bg-slate-900 border border-cyan-500/30 px-1.5 py-0.5 rounded" v-html="renderLatex(sym.symbol)"></code>
              <span class="text-slate-300 leading-tight">{{ sym.meaning }}</span>
            </div>
          </div>
        </div>

        <!-- Cuándo se Aplica -->
        <div class="space-y-1">
          <h4 class="text-xs font-mono uppercase tracking-wider text-purple-400 font-bold flex items-center gap-1.5">
            <span>🎯</span> Cuándo se Aplica
          </h4>
          <p class="text-xs text-slate-300 leading-relaxed bg-[#080d1a] p-3 rounded-xl border border-slate-800/70">
            {{ formula.whenToUse }}
          </p>
        </div>

        <!-- Procedimiento Sistemático -->
        <div class="space-y-1">
          <h4 class="text-xs font-mono uppercase tracking-wider text-sky-400 font-bold flex items-center gap-1.5">
            <span>📋</span> Procedimiento Paso a Paso
          </h4>
          <ol class="space-y-1.5 text-xs text-slate-300 bg-[#080d1a] p-3 sm:p-4 rounded-xl border border-slate-800/70 font-sans">
            <li v-for="(st, stIdx) in formula.procedure" :key="stIdx" class="flex items-start gap-2">
              <span class="text-cyan-400 font-mono font-bold shrink-0">{{ stIdx + 1 }}.</span>
              <span>{{ st }}</span>
            </li>
          </ol>
        </div>

        <!-- Ejemplo Resuelto -->
        <div v-if="formula.example" class="space-y-2 bg-slate-900/40 p-3 sm:p-4 rounded-xl border border-slate-800">
          <h4 class="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center gap-1.5">
            <span>✨</span> Ejemplo Resuelto Paso a Paso
          </h4>
          <p class="text-xs font-bold text-cyan-300">{{ formula.example.statement }}</p>
          <div class="text-xs text-slate-300 font-mono bg-[#080d1a] p-3 rounded-lg border border-slate-800/80 whitespace-pre-wrap leading-relaxed overflow-x-auto">
            {{ formula.example.steps.join('\n') }}
          </div>
          <div class="mt-2 pt-2 border-t border-slate-800 flex flex-wrap items-center gap-2 text-xs font-mono">
            <span class="text-purple-300 font-bold">Resultado Final:</span>
            <span class="text-slate-200 bg-[#080d1a] px-2 py-0.5 rounded border border-purple-500/30" v-html="renderLatex(formula.example.result)"></span>
          </div>
        </div>

        <!-- Errores Comunes -->
        <div v-if="formula.commonErrors && formula.commonErrors.length > 0" class="p-3 sm:p-4 bg-rose-950/20 border border-rose-500/30 rounded-xl space-y-1 text-xs">
          <h4 class="font-mono uppercase tracking-wider text-rose-400 font-bold flex items-center gap-1.5">
            <span>⚠️</span> Errores Frecuentes de Estudiantes
          </h4>
          <ul class="list-disc list-inside space-y-1 text-rose-200/90 pl-1">
            <li v-for="(err, eIdx) in formula.commonErrors" :key="eIdx">{{ err }}</li>
          </ul>
        </div>

        <!-- Ejercicio Propuesto con Solución Desplegable -->
        <div v-if="formula.practiceExercise" class="p-3 sm:p-4 bg-purple-950/20 border border-purple-500/30 rounded-xl space-y-3 text-xs">
          <div class="flex items-center justify-between gap-2">
            <h4 class="font-mono uppercase tracking-wider text-purple-300 font-bold flex items-center gap-1.5">
              <span>✍️</span> Ejercicio Propuesto
            </h4>
            <button
              @click="toggleSolution(formula.id)"
              class="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
            >
              {{ showSolution[formula.id] ? 'Ocultar solución ▲' : 'Ver solución explicada ▼' }}
            </button>
          </div>
          <p class="text-slate-200 font-bold">{{ formula.practiceExercise.question }}</p>
          <p v-if="formula.practiceExercise.hint" class="text-slate-400 italic">Pista: {{ formula.practiceExercise.hint }}</p>
          
          <div
            v-if="showSolution[formula.id]"
            class="p-3 bg-[#080d1a] rounded-lg border border-purple-500/40 text-purple-200 font-mono text-xs leading-relaxed animate-in fade-in duration-150 overflow-x-auto"
          >
            {{ formula.practiceExercise.solution }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { FORMULAS, type FormulaItem } from '../data/formulasData';
import katex from 'katex';

const categories = ['Todas', 'Léxico', 'Sintáctico', 'Semántico', 'Código Intermedio', 'RISC-V'];
const selectedCategory = ref('Todas');
const searchQuery = ref('');
const showSolution = ref<Record<string, boolean>>({});

function toggleSolution(id: string) {
  showSolution.value[id] = !showSolution.value[id];
}

function renderLatex(tex: string): string {
  try {
    return katex.renderToString(tex, { throwOnError: false, displayMode: false, strict: false });
  } catch {
    return tex;
  }
}

function renderLatexDisplay(tex: string): string {
  try {
    return katex.renderToString(tex, { throwOnError: false, displayMode: true, strict: false });
  } catch {
    return tex;
  }
}

const filteredFormulas = computed(() => {
  return FORMULAS.filter((f) => {
    const matchCat = selectedCategory.value === 'Todas' || f.category === selectedCategory.value;
    const q = searchQuery.value.trim().toLowerCase();
    const matchQuery =
      !q ||
      f.name.toLowerCase().includes(q) ||
      f.id.toLowerCase().includes(q) ||
      f.whenToUse.toLowerCase().includes(q);
    return matchCat && matchQuery;
  });
});
</script>
