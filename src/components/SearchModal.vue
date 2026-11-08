<template>
  <div>
    <!-- Botón disparador en la barra superior -->
    <button
      @click="isOpen = true"
      class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-slate-300 hover:text-cyan-300 hover:border-cyan-500/50 transition cursor-pointer shadow-sm group"
      aria-label="Abrir buscador de conceptos"
    >
      <span class="text-cyan-400 group-hover:scale-110 transition-transform">🔍</span>
      <span class="hidden sm:inline">Buscar conceptos...</span>
      <kbd class="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-slate-950 rounded-md border border-slate-700 font-mono text-slate-400">Ctrl+K</kbd>
    </button>

    <!-- Modal emergente -->
    <div
      v-if="isOpen"
      @click.self="isOpen = false"
      class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-20 p-3 sm:p-4 animate-in fade-in duration-200"
    >
      <div class="bg-[#0a101f] border border-cyan-500/30 rounded-2xl w-full max-w-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden flex flex-col max-h-[85vh]">
        <!-- Cabecera de búsqueda -->
        <div class="p-3.5 sm:p-4 border-b border-slate-800 flex items-center gap-3 bg-[#0d1527]">
          <span class="text-lg text-cyan-400">🔍</span>
          <input
            ref="searchInput"
            v-model="query"
            type="text"
            placeholder="Buscar concepto: 'Frame Pointer', 'C3D', 'LR', 'FIRST', 'AST'..."
            class="w-full bg-transparent border-none text-white placeholder-slate-500 text-sm focus:outline-none font-mono"
            @keydown.esc="isOpen = false"
          />
          <button
            @click="isOpen = false"
            class="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 hover:bg-slate-700"
          >
            ✕
          </button>
        </div>

        <!-- Resultados -->
        <div class="p-3 overflow-y-auto divide-y divide-slate-800/60 flex-1 space-y-1">
          <div v-if="filteredResults.length === 0" class="p-8 text-center text-xs text-slate-400 font-mono">
            No se encontraron coincidencias para "<span class="text-cyan-400">{{ query }}</span>".
          </div>

          <a
            v-for="item in filteredResults"
            :key="item.url"
            :href="item.url"
            @click="isOpen = false"
            class="block p-3 rounded-xl hover:bg-cyan-950/30 border border-transparent hover:border-cyan-500/30 transition group"
          >
            <div class="flex items-center justify-between text-xs mb-1 gap-2">
              <span class="font-bold text-cyan-300 group-hover:text-cyan-200 truncate">{{ item.title }}</span>
              <span class="font-mono text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-purple-300 border border-purple-500/20 shrink-0">
                {{ item.category }}
              </span>
            </div>
            <p class="text-xs text-slate-400 line-clamp-2">{{ item.description }}</p>
          </a>
        </div>

        <!-- Pie de modal -->
        <div class="p-3 bg-[#0d1527] border-t border-slate-800 text-[11px] text-slate-400 flex justify-between items-center font-mono">
          <span>Navega con clic directo</span>
          <span>Presione <kbd class="px-1 py-0.5 bg-slate-900 border border-slate-700 rounded text-slate-300">ESC</kbd> para salir</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { MODULES } from '../data/modulesMeta';
import { FORMULAS } from '../data/formulasData';

const isOpen = ref(false);
const query = ref('');
const searchInput = ref<HTMLInputElement | null>(null);

interface SearchEntry {
  title: string;
  category: string;
  description: string;
  url: string;
}

const entries = computed<SearchEntry[]>(() => {
  const list: SearchEntry[] = [];

  // Módulos y temas
  for (const m of MODULES) {
    list.push({
      title: m.title,
      category: `Módulo ${m.number}`,
      description: m.description,
      url: `/modulo/${m.slug}`
    });
    for (const top of m.topics) {
      list.push({
        title: top.title,
        category: `Módulo ${m.number} • Tema`,
        description: `Sección detallada dentro de ${m.shortTitle}`,
        url: `/modulo/${m.slug}#${top.id}`
      });
    }
  }

  // Fórmulas
  for (const f of FORMULAS) {
    list.push({
      title: f.name,
      category: `Formulario • ${f.category}`,
      description: f.whenToUse,
      url: `/formulario#${f.id}`
    });
  }

  // Laboratorio
  list.push({
    title: 'Compilador Interactivo Java a RISC-V (POO & Recursión)',
    category: 'Laboratorio Principal',
    description: 'Pipeline completo: Java a C3D, Cuartetas, RISC-V con Frame Pointer y Heap',
    url: '/laboratorio#compilador-completo'
  });
  list.push({
    title: 'Analizador de Expresiones y Árbol AST',
    category: 'Laboratorio',
    description: 'Tokenizador y visor gráfico interactivo de árbol sintáctico',
    url: '/laboratorio#expresiones'
  });
  list.push({
    title: 'Generador de Código Intermedio C3D',
    category: 'Laboratorio',
    description: 'Generación de temporales, cuádruplas y tripletas',
    url: '/laboratorio#c3d'
  });
  list.push({
    title: 'Simulador de Pipeline del Compilador',
    category: 'Laboratorio',
    description: 'Visualizador de las 6 etapas de transformación del código',
    url: '/laboratorio#pipeline'
  });
  list.push({
    title: 'Máquina Virtual RISC-V y Frame Pointer Stack',
    category: 'Laboratorio',
    description: 'Simulador paso a paso con registros ABI, marco de pila y Heap',
    url: '/laboratorio#riscv'
  });
  list.push({
    title: 'Banco de Ejercicios y Autoevaluación',
    category: 'Laboratorio',
    description: 'Ejercicios de selección múltiple, análisis léxico/sintáctico y RISC-V',
    url: '/laboratorio#ejercicios'
  });

  return list;
});

const filteredResults = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return entries.value.slice(0, 8);
  return entries.value
    .filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q)
    )
    .slice(0, 15);
});

onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      isOpen.value = true;
      nextTick(() => {
        searchInput.value?.focus();
      });
    }
  });
});
</script>
