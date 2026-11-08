<template>
  <div class="bg-[#0d1527] border border-slate-800 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl text-slate-200">
    <!-- Header del Quiz -->
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="inline-block w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"></span>
          <span class="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">Banco de Evaluación Universitaria</span>
        </div>
        <h3 class="text-xl sm:text-2xl font-bold text-white">
          Autoevaluación Integral de Compiladores
        </h3>
        <p class="text-xs sm:text-sm text-slate-400 mt-1">
          {{ exercises.length }} reactivos de alto nivel académico con retroalimentación explicativa paso a paso según el programa del Ing. Mario Ramírez Tobar.
        </p>
      </div>

      <!-- Acciones de control -->
      <div class="flex items-center gap-2 text-xs font-mono">
        <button
          @click="resetQuiz"
          class="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-rose-500/50 text-slate-300 hover:text-rose-400 transition cursor-pointer flex items-center gap-1.5"
          title="Reiniciar respuestas guardadas"
        >
          <span>↺</span>
          <span>Reiniciar</span>
        </button>
      </div>
    </div>

    <!-- Filtro por Módulo / Categoría en Pills Horizontales -->
    <div class="mb-6">
      <div class="text-xs font-mono text-slate-400 mb-2 flex items-center justify-between">
        <span class="font-bold uppercase tracking-wider">Filtrar por Módulo Académico:</span>
        <span class="text-cyan-400 font-bold">{{ filteredExercises.length }} preguntas en este filtro</span>
      </div>
      <div class="flex flex-wrap gap-1.5 sm:gap-2">
        <button
          v-for="cat in categories"
          :key="cat.value"
          @click="setCategory(cat.value)"
          :class="selectedCategory === cat.value
            ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)] border-transparent'
            : 'bg-[#080d1a] text-slate-300 hover:bg-slate-800 hover:text-cyan-300 border-slate-800'"
          class="px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-mono transition cursor-pointer flex items-center gap-1.5"
        >
          <span>{{ cat.label }}</span>
          <span class="text-[10px] px-1.5 py-0.2 rounded-full bg-black/40 text-slate-300">
            {{ getCategoryCount(cat.value) }}
          </span>
        </button>
      </div>
    </div>

    <!-- Barra de Estado, Estadísticas y Progreso -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-[#080d1a] rounded-xl border border-slate-800 mb-6 text-xs font-mono shadow-inner">
      <div class="flex flex-col">
        <span class="text-slate-500 text-[11px]">Pregunta Actual</span>
        <span class="text-sm font-bold text-white">{{ currentIdx + 1 }} de {{ filteredExercises.length }}</span>
      </div>
      <div class="flex flex-col">
        <span class="text-slate-500 text-[11px]">Respondidas</span>
        <span class="text-sm font-bold text-cyan-300">{{ answeredCount }} / {{ exercises.length }}</span>
      </div>
      <div class="flex flex-col">
        <span class="text-slate-500 text-[11px]">Aciertos</span>
        <span class="text-sm font-bold text-emerald-400">{{ correctCount }} ({{ accuracy }}%)</span>
      </div>
      <div class="flex flex-col">
        <span class="text-slate-500 text-[11px]">Errores</span>
        <span class="text-sm font-bold text-rose-400">{{ incorrectCount }}</span>
      </div>
    </div>

    <!-- Grilla de Navegación Rápida de Preguntas (Question Jumper Grid) -->
    <div class="mb-6 bg-[#080d1a]/80 p-3 rounded-xl border border-slate-800/90">
      <div class="text-[11px] font-mono text-slate-400 mb-2 flex items-center justify-between">
        <span class="font-bold">Navegador directo de preguntas:</span>
        <span class="text-slate-500 text-[10px]">🟢 Correcta | 🔴 Incorrecta | ⚪ Pendiente</span>
      </div>
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="(ex, index) in filteredExercises"
          :key="ex.id"
          @click="jumpTo(index)"
          :class="getJumperButtonClass(ex, index)"
          class="w-7 h-7 rounded-lg text-xs font-mono font-bold transition flex items-center justify-center cursor-pointer border relative"
          :title="`Pregunta ${index + 1}: ${ex.title}`"
        >
          {{ index + 1 }}
          <span
            v-if="index === currentIdx"
            class="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-slate-900"
          ></span>
        </button>
      </div>
    </div>

    <!-- Tarjeta del Ejercicio Actual -->
    <div v-if="currentExercise" class="bg-[#080d1a] rounded-xl border border-slate-800 p-4 sm:p-6 mb-6 shadow-xl relative overflow-hidden">
      <!-- Glow superior sutil -->
      <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-sky-400 opacity-60"></div>

      <!-- Barra superior con metadatos -->
      <div class="flex flex-wrap items-center justify-between gap-2 mb-4 pt-1">
        <div class="flex flex-wrap items-center gap-2">
          <span class="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-purple-950/60 text-purple-300 border border-purple-500/30">
            Módulo {{ currentExercise.moduleNumber }} • {{ currentExercise.category }}
          </span>
          <span
            :class="difficultyBadge(currentExercise.difficulty)"
            class="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider"
          >
            {{ currentExercise.difficulty }}
          </span>
        </div>

        <button
          v-if="!showHint"
          @click="showHint = true"
          class="text-xs text-cyan-400 hover:text-cyan-300 underline cursor-pointer flex items-center gap-1 font-mono transition"
        >
          💡 Ver Pista Teórica
        </button>
      </div>

      <!-- Título y Enunciado -->
      <h4 class="text-base sm:text-lg font-bold text-white mb-2 leading-snug">
        {{ currentExercise.title }}
      </h4>
      <p class="text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed font-sans">
        {{ currentExercise.description }}
      </p>

      <!-- Código de apoyo si existe -->
      <div
        v-if="currentExercise.codeSnippet"
        class="mb-4 p-3.5 sm:p-4 bg-[#0a101f] rounded-xl border border-slate-800 font-mono text-xs sm:text-sm text-cyan-300 overflow-x-auto whitespace-pre leading-relaxed shadow-inner"
      >{{ currentExercise.codeSnippet }}</div>

      <!-- Pista desplegable -->
      <div
        v-if="showHint"
        class="mb-4 p-3.5 bg-cyan-950/30 border border-cyan-500/40 rounded-xl text-xs sm:text-sm text-cyan-200 animate-in fade-in duration-200"
      >
        <strong class="text-cyan-300 font-mono">💡 Pista Teórica:</strong> {{ currentExercise.hint }}
      </div>

      <!-- Opciones de Selección Múltiple -->
      <div v-if="currentExercise.type === 'multiple-choice'" class="space-y-2.5 mb-5">
        <button
          v-for="opt in currentExercise.options"
          :key="opt.id"
          @click="selectAnswer(opt.id)"
          :disabled="selectedAnswer !== null"
          :class="getOptionClass(opt.id)"
          class="w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-sans flex items-start gap-3 transition cursor-pointer group"
        >
          <span
            class="font-mono font-bold px-2 py-0.5 rounded-md bg-[#0a101f] border border-slate-700/80 text-xs shrink-0 mt-0.5 group-hover:border-cyan-400"
          >
            {{ opt.id.toUpperCase() }}
          </span>
          <span class="flex-1 leading-snug">{{ opt.text }}</span>
        </button>
      </div>

      <!-- Retroalimentación y Explicación Académica Detallada -->
      <div
        v-if="selectedAnswer !== null"
        :class="isCorrect ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200' : 'bg-rose-950/40 border-rose-500/60 text-rose-200'"
        class="p-4 sm:p-5 rounded-xl border text-xs sm:text-sm leading-relaxed animate-in fade-in duration-300 shadow-lg"
      >
        <div class="flex items-center gap-2 font-bold text-sm sm:text-base mb-2">
          <span v-if="isCorrect" class="text-emerald-400">✅ ¡Respuesta Correcta! Excelente análisis.</span>
          <span v-else class="text-rose-400">❌ Respuesta Incorrecta. Analicemos el porqué:</span>
        </div>
        <div class="mt-2 text-slate-200 font-sans border-t border-slate-800/80 pt-2 leading-relaxed">
          <strong class="text-white font-mono block mb-1">Fundamento Académico:</strong>
          {{ currentExercise.explanation }}
        </div>
      </div>
    </div>

    <!-- Navegación entre ejercicios -->
    <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
      <button
        @click="prevExercise"
        :disabled="currentIdx === 0"
        :class="currentIdx === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-800 cursor-pointer text-cyan-400 border-slate-700 hover:border-cyan-500/50'"
        class="px-4 py-2.5 bg-slate-900 border rounded-xl text-xs sm:text-sm font-mono transition flex items-center gap-1.5"
      >
        ◀ Anterior
      </button>

      <span class="text-xs text-slate-400 font-mono hidden sm:inline">
        Reactivo {{ currentIdx + 1 }} de {{ filteredExercises.length }}
      </span>

      <button
        @click="nextExercise"
        :disabled="currentIdx === filteredExercises.length - 1"
        :class="currentIdx === filteredExercises.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:opacity-90 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.45)]'"
        class="px-4 py-2.5 bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-500 text-slate-950 font-bold rounded-xl text-xs sm:text-sm font-mono transition flex items-center gap-1.5"
      >
        Siguiente ▶
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { EXERCISES, type ExerciseItem } from '../../data/exercisesData';

const exercises = ref<ExerciseItem[]>(EXERCISES);
const selectedCategory = ref<string>('ALL');
const currentIdx = ref(0);
const selectedAnswer = ref<string | null>(null);
const showHint = ref(false);

const userAnswers = ref<Record<string, string>>({});

const categories = [
  { value: 'ALL', label: 'Todos los Temas' },
  { value: 'Teoría', label: 'M1: Fundamentos' },
  { value: 'Análisis Léxico', label: 'M2: Léxico' },
  { value: 'Análisis Sintáctico', label: 'M3: Sintáctico' },
  { value: 'Análisis Semántico', label: 'M4: Semántico' },
  { value: 'C3D', label: 'M5: C3D / Intermedio' },
  { value: 'Optimización', label: 'M6: Optimización' },
  { value: 'RISC-V', label: 'M7: RISC-V RV32I' },
  { value: 'Paradigmas', label: 'M8: Paradigmas & POO' },
];

function getCategoryCount(catVal: string): number {
  if (catVal === 'ALL') return exercises.value.length;
  return exercises.value.filter(e => e.category === catVal).length;
}

function setCategory(catVal: string) {
  selectedCategory.value = catVal;
  currentIdx.value = 0;
  loadExerciseState();
}

const filteredExercises = computed(() => {
  if (selectedCategory.value === 'ALL') return exercises.value;
  return exercises.value.filter(e => e.category === selectedCategory.value);
});

const currentExercise = computed(() => {
  return filteredExercises.value[currentIdx.value] || filteredExercises.value[0];
});

const isCorrect = computed(() => {
  if (!currentExercise.value || selectedAnswer.value === null) return false;
  return selectedAnswer.value === currentExercise.value.correctAnswer;
});

const answeredCount = computed(() => Object.keys(userAnswers.value).length);

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

const accuracy = computed(() => {
  if (answeredCount.value === 0) return 0;
  return Math.round((correctCount.value / answeredCount.value) * 100);
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

function jumpTo(index: number) {
  if (index >= 0 && index < filteredExercises.value.length) {
    currentIdx.value = index;
    loadExerciseState();
  }
}

function resetQuiz() {
  if (confirm('¿Desea reiniciar todas sus respuestas registradas?')) {
    userAnswers.value = {};
    selectedAnswer.value = null;
    showHint.value = false;
  }
}

function loadExerciseState() {
  if (!currentExercise.value) return;
  const currentId = currentExercise.value.id;
  selectedAnswer.value = userAnswers.value[currentId] || null;
  showHint.value = false;
}

function getJumperButtonClass(ex: ExerciseItem, index: number): string {
  const ans = userAnswers.value[ex.id];
  const isCurrent = index === currentIdx.value;

  if (ans !== undefined) {
    if (ans === ex.correctAnswer) {
      return isCurrent
        ? 'bg-emerald-900 text-emerald-200 border-emerald-400 ring-2 ring-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]'
        : 'bg-emerald-950/80 text-emerald-400 border-emerald-600/60';
    } else {
      return isCurrent
        ? 'bg-rose-900 text-rose-200 border-rose-400 ring-2 ring-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.5)]'
        : 'bg-rose-950/80 text-rose-400 border-rose-600/60';
    }
  }

  if (isCurrent) {
    return 'bg-cyan-950 text-cyan-200 border-cyan-400 ring-2 ring-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.5)]';
  }

  return 'bg-[#0a101f] text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200';
}

function getOptionClass(optId: string): string {
  if (selectedAnswer.value === null) {
    return 'bg-[#0a101f] border-slate-800 hover:border-cyan-400/50 hover:bg-slate-900/60 text-slate-200';
  }
  if (optId === currentExercise.value.correctAnswer) {
    return 'bg-emerald-950/70 border-emerald-400 text-emerald-200 font-bold shadow-[0_0_12px_rgba(52,211,153,0.3)]';
  }
  if (selectedAnswer.value === optId && !isCorrect.value) {
    return 'bg-rose-950/70 border-rose-400 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.3)]';
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
