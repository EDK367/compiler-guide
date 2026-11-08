<template>
  <div class="bg-[#0d1527] border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl text-slate-200">
    <!-- Cabecera del Simulador -->
    <div class="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3">
      <div>
        <h3 class="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <span class="inline-block w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)] animate-pulse"></span>
          Laboratorio RISC-V RV32I & Pila / Frame Pointer
        </h3>
        <p class="text-xs text-slate-400 mt-0.5">
          Simulador de ejecución paso a paso con arquitectura de registros, memoria de pila (-offset(fp)) y Heap
        </p>
      </div>

      <!-- Selector de Programas de Clase -->
      <div class="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
        <span class="text-slate-400">Programa:</span>
        <button
          v-for="(prog, idx) in programs"
          :key="prog.id"
          @click="selectProgram(idx)"
          :class="selectedProgIdx === idx
            ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold shadow-[0_0_12px_rgba(168,85,247,0.4)]'
            : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700'"
          class="px-2.5 py-1 rounded-lg border text-xs font-mono transition cursor-pointer"
        >
          {{ prog.badge }}
        </button>
      </div>
    </div>

    <!-- Barra de Controles de Ejecución -->
    <div class="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#080d1a] rounded-xl border border-slate-800 mb-4">
      <div class="flex flex-wrap items-center gap-2">
        <button
          @click="prevStep"
          :disabled="currentStepIdx === 0"
          :class="currentStepIdx === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-800 cursor-pointer text-cyan-300'"
          class="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono flex items-center gap-1 transition"
        >
          ⏪ Retroceder
        </button>
        <button
          @click="nextStep"
          :disabled="currentStepIdx === currentProgram.steps.length - 1"
          :class="currentStepIdx === currentProgram.steps.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:opacity-90 cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.4)]'"
          class="px-3 py-1.5 bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 font-bold rounded-lg text-xs font-mono flex items-center gap-1 transition"
        >
          Avanzar Paso ⏩
        </button>
        <button
          @click="toggleAutoPlay"
          :class="isPlaying ? 'bg-purple-600 text-white' : 'bg-slate-900 text-purple-300 hover:bg-slate-800 border border-purple-500/40'"
          class="px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1 transition cursor-pointer"
        >
          {{ isPlaying ? '⏸ Pausa' : '⚡ Auto' }}
        </button>
        <button
          @click="resetSteps"
          class="px-3 py-1.5 bg-slate-900 hover:bg-rose-950/40 border border-slate-700 hover:border-rose-500/40 text-rose-300 rounded-lg text-xs font-mono transition cursor-pointer"
        >
          🔄 Reiniciar
        </button>
      </div>

      <div class="flex items-center gap-3 text-xs font-mono">
        <span class="text-slate-400">
          Paso: <strong class="text-white">{{ currentStepIdx + 1 }}</strong> / {{ currentProgram.steps.length }}
        </span>
        <span class="text-cyan-400 bg-slate-900 px-2.5 py-0.5 rounded-lg border border-cyan-500/30 font-bold">
          PC: {{ currentStep.pc }}
        </span>
      </div>
    </div>

    <!-- Panel de Explicación Didáctica del Paso -->
    <div class="mb-4 p-3.5 bg-slate-900/80 border-l-4 border-cyan-400 rounded-r-xl text-xs leading-relaxed shadow-sm">
      <div class="flex flex-wrap items-center gap-2 mb-1">
        <span v-html="highlightRiscvLine(currentStep.instruction)" class="font-bold font-mono text-sm"></span>
        <span class="text-slate-400 italic font-mono"># {{ currentStep.comment }}</span>
      </div>
      <p class="text-slate-300">{{ currentStep.explanation }}</p>
    </div>

    <!-- Cuadrícula Principal: Código Ensamblador vs Banco de Registros y Pila -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <!-- Columna Izquierda: Código Ensamblador con Línea Activa -->
      <div class="lg:col-span-6 bg-[#080d1a] rounded-xl border border-slate-800 p-4 font-mono text-xs overflow-x-auto shadow-inner">
        <div class="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
          <span class="text-white font-bold flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
            Instrucciones RISC-V RV32I
          </span>
          <span class="text-[11px] text-slate-400">{{ currentProgram.title }}</span>
        </div>
        <div class="space-y-1">
          <div
            v-for="(st, idx) in currentProgram.steps"
            :key="idx"
            :class="[
              currentStepIdx === idx
                ? 'bg-cyan-950/50 border-l-4 border-cyan-400 text-white font-bold pl-2.5 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                : 'text-slate-400 hover:bg-slate-900/40 pl-3',
              'py-1 rounded-r-lg transition flex items-center gap-2 sm:gap-3 text-xs font-mono'
            ]"
          >
            <span class="text-[10px] text-slate-500 w-10 shrink-0 font-mono">{{ st.pc }}</span>
            <span v-html="highlightRiscvLine(st.instruction)" class="flex-1 truncate font-mono"></span>
            <span class="text-[11px] text-slate-400 italic truncate max-w-[140px] hidden sm:inline"># {{ st.comment }}</span>
          </div>
        </div>
      </div>

      <!-- Columna Derecha: Banco de Registros ABI & Visualizador de Pila Real -->
      <div class="lg:col-span-6 space-y-4">
        <!-- Banco de Registros ABI -->
        <div class="bg-[#080d1a] rounded-xl border border-slate-800 p-4 shadow-inner">
          <div class="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
            <span class="text-xs font-mono font-bold text-white">Banco de Registros ABI RV32I</span>
            <span class="text-[10px] font-mono text-cyan-400">Convención de Cátedra</span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div class="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <span class="text-[10px] text-slate-500 block">zero (x0)</span>
              <span class="font-bold text-slate-300">0</span>
            </div>
            <div class="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <span class="text-[10px] text-cyan-400 block">ra (x1) [ret]</span>
              <span class="font-bold text-cyan-300">{{ currentStep.registers.ra }}</span>
            </div>
            <div class="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <span class="text-[10px] text-sky-400 block">sp (x2) [pila]</span>
              <span class="font-bold text-sky-300">{{ currentStep.registers.sp }}</span>
            </div>
            <div class="p-2 rounded-lg bg-slate-900/80 border border-purple-500/30">
              <span class="text-[10px] text-purple-400 block">fp / s0 (x8) [marco]</span>
              <span class="font-bold text-purple-300">{{ currentStep.registers.fp }}</span>
            </div>
            <div class="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <span class="text-[10px] text-emerald-400 block">a0 (x10) [arg/ret]</span>
              <span class="font-bold text-emerald-300">{{ currentStep.registers.a0 }}</span>
            </div>
            <div class="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <span class="text-[10px] text-slate-400 block">a1 (x11) [arg]</span>
              <span class="font-bold text-slate-200">{{ currentStep.registers.a1 }}</span>
            </div>
            <div class="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <span class="text-[10px] text-slate-400 block">t0 (x5) [temp]</span>
              <span class="font-bold text-slate-300">{{ currentStep.registers.t0 }}</span>
            </div>
            <div class="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <span class="text-[10px] text-slate-400 block">t1 (x6) [temp]</span>
              <span class="font-bold text-slate-300">{{ currentStep.registers.t1 }}</span>
            </div>
          </div>
        </div>

        <!-- Visualizador de Pila de Memoria Real (Crece hacia abajo ⬇) -->
        <div class="bg-[#080d1a] rounded-xl border border-slate-800 p-4 shadow-inner">
          <div class="flex flex-wrap items-center justify-between gap-1 border-b border-slate-800 pb-2 mb-3">
            <span class="text-xs font-mono font-bold text-white flex items-center gap-1.5">
              <span>Pila de Memoria Real</span>
              <span class="text-[10px] text-sky-400">(Crece ⬇ hacia direcciones menores)</span>
            </span>
            <span class="text-[10px] font-mono text-slate-400">{{ currentProgram.frameDescription }}</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs font-mono min-w-[440px]">
              <thead class="bg-[#0a101f] text-slate-300 border-b border-slate-800">
                <tr>
                  <th class="p-2">Dirección</th>
                  <th class="p-2">Offset respecto a fp</th>
                  <th class="p-2">Rol en el Marco</th>
                  <th class="p-2">Valor en Pila</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/60">
                <tr
                  v-for="(cell, cIdx) in currentStep.stack"
                  :key="cIdx"
                  :class="cell.highlight ? 'bg-cyan-950/40 text-cyan-200 font-bold border-l-2 border-cyan-400' : 'hover:bg-slate-900/40'"
                >
                  <td class="p-2 text-cyan-400">{{ cell.addr }}</td>
                  <td class="p-2 text-purple-400 font-bold">{{ cell.offset }}</td>
                  <td class="p-2 text-slate-300">{{ cell.role }}</td>
                  <td class="p-2 font-bold text-white">{{ cell.value }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Visualizador de Heap si el programa lo utiliza -->
        <div v-if="currentStep.heap && currentStep.heap.length > 0" class="bg-[#080d1a] rounded-xl border border-indigo-500/30 p-4 shadow-inner">
          <div class="flex items-center justify-between border-b border-indigo-500/20 pb-2 mb-3">
            <span class="text-xs font-mono font-bold text-indigo-300 flex items-center gap-1.5">
              <span>Montículo / Heap (0x1000)</span>
              <span class="text-[10px] text-slate-400">(Instancia de Objeto persistente)</span>
            </span>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs font-mono min-w-[380px]">
              <thead class="bg-indigo-950/50 text-indigo-200 border-b border-indigo-500/20">
                <tr>
                  <th class="p-2">Dir Heap</th>
                  <th class="p-2">Atributo</th>
                  <th class="p-2">Tipo</th>
                  <th class="p-2">Valor</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-indigo-950/30">
                <tr v-for="(h, hIdx) in currentStep.heap" :key="hIdx" class="hover:bg-indigo-950/20">
                  <td class="p-2 text-indigo-400 font-bold">{{ h.addr }}</td>
                  <td class="p-2 text-slate-200">{{ h.field }}</td>
                  <td class="p-2 text-slate-400">{{ h.type }}</td>
                  <td class="p-2 text-cyan-300 font-bold">{{ h.value }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { RISCV_PROGRAMS, type RiscvExampleProgram } from '../../data/riscvExamples';
import { highlightRiscvLine } from '../../utils/syntaxHighlight';

const programs = ref<RiscvExampleProgram[]>(RISCV_PROGRAMS);
const selectedProgIdx = ref(0);
const currentStepIdx = ref(0);
const isPlaying = ref(false);
let playTimer: any = null;

const currentProgram = computed(() => programs.value[selectedProgIdx.value]);
const currentStep = computed(() => currentProgram.value.steps[currentStepIdx.value] || currentProgram.value.steps[0]);

function selectProgram(idx: number) {
  stopAutoPlay();
  selectedProgIdx.value = idx;
  currentStepIdx.value = 0;
}

function nextStep() {
  if (currentStepIdx.value < currentProgram.value.steps.length - 1) {
    currentStepIdx.value++;
  } else {
    stopAutoPlay();
  }
}

function prevStep() {
  if (currentStepIdx.value > 0) {
    currentStepIdx.value--;
  }
}

function resetSteps() {
  stopAutoPlay();
  currentStepIdx.value = 0;
}

function toggleAutoPlay() {
  if (isPlaying.value) {
    stopAutoPlay();
  } else {
    isPlaying.value = true;
    playTimer = setInterval(() => {
      if (currentStepIdx.value < currentProgram.value.steps.length - 1) {
        currentStepIdx.value++;
      } else {
        stopAutoPlay();
      }
    }, 1800);
  }
}

function stopAutoPlay() {
  isPlaying.value = false;
  if (playTimer) {
    clearInterval(playTimer);
    playTimer = null;
  }
}
</script>
