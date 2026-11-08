<template>
  <div class="bg-[#0d1527] border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl text-slate-200">
    <div class="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3">
      <div>
        <h3 class="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <span class="inline-block w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
          Laboratorio de Ejercicios y Autoevaluación
        </h3>
        <p class="text-xs text-slate-400 mt-0.5">
          Preguntas conceptuales, trazas de código y traducción C3D / RISC-V con retroalimentación inmediata
        </p>
      </div>

      <!-- Filtro por Dificultad / Módulo -->
      <div class="flex items-center gap-2 text-xs">
        <span class="text-slate-400">Filtro:</span>
        <select
          v-model="selectedCategory"
          class="bg-[#080d1a] border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
        >
          <option value="ALL">Todas las Categorías</option>
          <option value="Teoría">Teoría General</option>
          <option value="Análisis Léxico">Análisis Léxico</option>
          <option value="Análisis Sintáctico">Análisis Sintáctico</option>
          <option value="Análisis Semántico">Análisis Semántico</option>
          <option value="C3D">Código Intermedio (C3D)</option>
          <option value="RISC-V">RISC-V y Ensamblador</option>
        </select>
      </div>
    </div>

    <!-- Puntuación y Progreso -->
    <div class="flex flex-wrap items-center justify-between gap-2 p-3 bg-[#080d1a] rounded-xl border border-slate-800 mb-6 text-xs font-mono shadow-inner">
      <div class="flex items-center gap-2 sm:gap-3">
        <span class="text-slate-400">Pregunta:</span>
        <span class="font-bold text-white">{{ currentIdx + 1 }} de {{ filteredExercises.length }}</span>
      </div>
      <div class="flex items-center gap-3 sm:gap-4">
        <span class="text-emerald-400 font-bold">Correctas: {{ correctCount }}</span>
        <span class="text-rose-400 font-bold">Incorrectas: {{ incorrectCount }}</span>
      </div>
    </div>

    <!-- Tarjeta del Ejercicio Actual -->
    <div v-if="currentExercise" class="bg-[#080d1a] rounded-xl border border-slate-800 p-4 sm:p-5 mb-6 shadow-inner">
      <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div class="flex flex-wrap items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-purple-950/60 text-purple-300 border border-purple-500/30">
            Módulo {{ currentExercise.moduleNumber }} • {{ currentExercise.category }}
          </span>
          <span
            :class="difficultyBadge(currentExercise.difficulty)"
            class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider"
          >
            {{ currentExercise.difficulty }}
          </span>
        </div>

        <button
          v-if="!showHint"
          @click="showHint = true"
          class="text-xs text-cyan-400 hover:text-cyan-300 underline cursor-pointer flex items-center gap-1"
        >
          💡 Ver Pista
        </button>
      </div>

      <!-- Título y Enunciado -->
      <h4 class="text-base font-bold text-white mb-2">{{ currentExercise.title }}</h4>
      <p class="text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed">{{ currentExercise.description }}</p>

      <!-- Código de apoyo si existe -->
      <div v-if="currentExercise.codeSnippet" class="mb-4 p-3.5 bg-[#0a101f] rounded-xl border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto whitespace-pre leading-relaxed shadow-inner">
        {{ currentExercise.codeSnippet }}
      </div>

      <!-- Pista desplegable -->
      <div v-if="showHint" class="mb-4 p-3 bg-cyan-950/30 border border-cyan-500/40 rounded-xl text-xs text-cyan-200">
        <strong class="text-cyan-300">Pista:</strong> {{ currentExercise.hint }}
      </div>

      <!-- Opciones de Selección Múltiple -->
      <div v-if="currentExercise.type === 'multiple-choice'" class="space-y-2 mb-4">
        <button
          v-for="opt in currentExercise.options"
          :key="opt.id"
          @click="selectAnswer(opt.id)"
          :disabled="selectedAnswer !== null"
          :class="getOptionClass(opt.id)"
          class="w-full text-left p-3 rounded-xl border text-xs sm:text-sm font-sans flex items-start gap-3 transition cursor-pointer"
        >
          <span class="font-mono font-bold px-2 py-0.5 rounded-md bg-[#0a101f] border border-slate-800 text-xs shrink-0 mt-0.5">
            {{ opt.id.toUpperCase() }}
          </span>
          <span class="flex-1 leading-snug">{{ opt.text }}</span>
        </button>
      </div>

      <!-- Retroalimentación y Explicación Académica -->
      <div
        v-if="selectedAnswer !== null"
        :class="isCorrect ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200' : 'bg-rose-950/40 border-rose-500/50 text-rose-200'"
        class="p-4 rounded-xl border text-xs leading-relaxed"
      >
        <p class="font-bold text-sm mb-1 flex items-center gap-2">
          <span>{{ isCorrect ? '✅ ¡Respuesta Correcta!' : '❌ Respuesta Incorrecta' }}</span>
        </p>
        <p class="mt-2 text-slate-200"><strong class="text-white">Explicación Académica:</strong> {{ currentExercise.explanation }}</p>
      </div>
    </div>

    <!-- Navegación entre ejercicios -->
    <div class="flex items-center justify-between gap-2">
      <button
        @click="prevExercise"
        :disabled="currentIdx === 0"
        :class="currentIdx === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-800 cursor-pointer text-cyan-400'"
        class="px-3 sm:px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono transition"
      >
        ◀ Ejercicio Anterior
      </button>

      <button
        @click="nextExercise"
        :disabled="currentIdx === filteredExercises.length - 1"
        :class="currentIdx === filteredExercises.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:opacity-90 cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.4)]'"
        class="px-3 sm:px-4 py-2 bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 font-bold rounded-xl text-xs font-mono transition"
      >
        Siguiente Ejercicio ▶
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { EXERCISES, type ExerciseItem } from '../../data/exercisesData';

const exercises = ref<ExerciseItem[]>(EXERCISES);
const selectedCategory = ref('ALL');
const currentIdx = ref(0);
const selectedAnswer = ref<string | null>(null);
const showHint = ref(false);

const userAnswers = ref<Record<string, string>>({});

const filteredExercises = computed(() => {
  if (selectedCategory.value === 'ALL') return exercises.value;
  return exercises.value.filter(e => e.category === selectedCategory.value);
});

const currentExercise = computed(() => filteredExercises.value[currentIdx.value] || filteredExercises.value[0]);

const isCorrect = computed(() => {
  if (!currentExercise.value || selectedAnswer.value === null) return false;
  return selectedAnswer.value === currentExercise.value.correctAnswer;
});

const correctCount = computed(() => {
  let count = 0;
  for (const [id, ans] of Object.entries(userAnswers.value)) {
    const ex = exercises.value.find(e => e.id === id);
    if (ex && ex.correctAnswer === ans) count++;
  }
  return count;
});

const incorrectCount = computed(() => {
  let count = 0;
  for (const [id, ans] of Object.entries(userAnswers.value)) {
    const ex = exercises.value.find(e => e.id === id);
    if (ex && ex.correctAnswer !== ans) count++;
  }
  return count;
});

function selectAnswer(optId: string) {
  if (selectedAnswer.value !== null) return;
  selectedAnswer.value = optId;
  userAnswers.value[currentExercise.value.id] = optId;
}

function nextExercise() {
  if (currentIdx.value < filteredExercises.value.length - 1) {
    currentIdx.value++;
    loadExerciseState();
  }
}

function prevExercise() {
  if (currentIdx.value > 0) {
    currentIdx.value--;
    loadExerciseState();
  }
}

function loadExerciseState() {
  const currentId = currentExercise.value.id;
  selectedAnswer.value = userAnswers.value[currentId] || null;
  showHint.value = false;
}

function getOptionClass(optId: string): string {
  if (selectedAnswer.value === null) {
    return 'bg-[#0a101f] border-slate-800 hover:border-cyan-400/50 hover:bg-slate-900/60 text-slate-200';
  }
  if (optId === currentExercise.value.correctAnswer) {
    return 'bg-emerald-950/60 border-emerald-400 text-emerald-200 font-bold shadow-[0_0_12px_rgba(52,211,153,0.3)]';
  }
  if (selectedAnswer.value === optId && !isCorrect.value) {
    return 'bg-rose-950/60 border-rose-400 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.3)]';
  }
  return 'bg-[#0a101f]/40 border-slate-900 opacity-40 text-slate-500';
}

function difficultyBadge(diff: string): string {
  switch (diff) {
    case 'Básico':
      return 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40';
    case 'Intermedio':
      return 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40';
    case 'Avanzado':
      return 'bg-purple-950/80 text-purple-300 border border-purple-500/40';
    default:
      return 'bg-slate-800 text-slate-300';
  }
}
</script>
