<template>
  <div class="bg-[#0d1527] border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl text-slate-200 space-y-4">
    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
      <div>
        <h3 class="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <span class="inline-block w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse"></span>
          Analizador de Expresiones & Visualizador de Árbol Sintáctico (AST)
        </h3>
        <p class="text-xs text-slate-400 mt-0.5">Tokenización léxica en vivo y renderizado jerárquico del árbol sintáctico con ramas y conectores</p>
      </div>

      <!-- Presets de prueba -->
      <div class="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
        <span class="text-slate-400 font-mono font-bold">Casos:</span>
        <button
          v-for="(sample, idx) in samples"
          :key="idx"
          @click="loadSample(sample.code)"
          class="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 rounded-lg transition cursor-pointer text-xs font-mono font-semibold"
        >
          {{ sample.label }}
        </button>
      </div>
    </div>

    <!-- Entrada del usuario con soporte de Tabulación -->
    <div>
      <div class="flex items-center justify-between text-xs font-mono mb-1">
        <label class="uppercase tracking-wider text-slate-400 font-bold flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-purple-400"></span>
          Expresión o Sentencia (Presione Tab para indentar):
        </label>
        <button
          v-if="inputCode"
          @click="clearInput"
          class="text-xs text-slate-400 hover:text-rose-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 cursor-pointer transition"
        >
          Limpiar
        </button>
      </div>
      <div class="relative rounded-xl border border-slate-700/80 bg-[#080d1a] overflow-hidden shadow-inner focus-within:border-cyan-400 transition">
        <textarea
          v-model="inputCode"
          @input="analyze"
          @keydown="onKeydown"
          rows="2"
          spellcheck="false"
          class="w-full bg-transparent p-3 font-mono text-sm text-cyan-200 leading-relaxed focus:outline-none resize-y selection:bg-cyan-500 selection:text-slate-950"
          placeholder="Ej: (25 + 12) * a - 4 o x =  5 + 1 > y * 2;"
        ></textarea>
      </div>
    </div>

    <!-- Errores si existen -->
    <div v-if="result.errors.length > 0" class="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-rose-300 text-xs font-mono flex items-center gap-2">
      <span>⚠️</span>
      <span>{{ result.errors[0] }}</span>
    </div>

    <!-- Pestañas de Vista: Tokens vs Árbol AST -->
    <div class="flex border-b border-slate-800 text-xs font-mono gap-1">
      <button
        @click="activeTab = 'ast'"
        :class="activeTab === 'ast' ? 'border-b-2 border-cyan-400 text-cyan-300 font-bold bg-cyan-950/20' : 'text-slate-400 hover:text-white'"
        class="px-4 py-2 rounded-t-lg cursor-pointer transition flex items-center gap-1.5"
      >
        <span>🌳 1. Árbol Sintáctico (AST)</span>
      </button>
      <button
        @click="activeTab = 'tokens'"
        :class="activeTab === 'tokens' ? 'border-b-2 border-cyan-400 text-cyan-300 font-bold bg-cyan-950/20' : 'text-slate-400 hover:text-white'"
        class="px-4 py-2 rounded-t-lg cursor-pointer transition flex items-center gap-1.5"
      >
        <span>🔍 2. Tokens Léxicos</span>
        <span class="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">{{ result.tokens.length }}</span>
      </button>
    </div>

    <!-- Vista de Árbol Sintáctico AST -->
    <div v-if="activeTab === 'ast'" class="space-y-3">
      <!-- Barra de herramientas del visor de árbol -->
      <div class="flex flex-wrap items-center justify-between gap-3 bg-[#0a101f] p-2.5 rounded-xl border border-slate-800 text-xs font-mono">
        <div class="flex items-center gap-2">
          <span class="text-slate-400">Modo de visualización:</span>
          <button
            @click="treeViewMode = 'graph'"
            :class="treeViewMode === 'graph' ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold' : 'bg-slate-900 border-slate-700 text-slate-400'"
            class="px-2.5 py-1 rounded-lg border transition cursor-pointer"
          >
            🌿 Árbol Gráfico
          </button>
          <button
            @click="treeViewMode = 'ascii'"
            :class="treeViewMode === 'ascii' ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold' : 'bg-slate-900 border-slate-700 text-slate-400'"
            class="px-2.5 py-1 rounded-lg border transition cursor-pointer"
          >
            📋 Notación Jerárquica ASCII
          </button>
        </div>

        <div v-if="treeViewMode === 'graph'" class="flex items-center gap-1.5">
          <span class="text-slate-400">Zoom:</span>
          <button
            @click="zoom = Math.max(0.7, zoom - 0.1)"
            class="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-slate-300 cursor-pointer"
          >
            -
          </button>
          <span class="text-cyan-300 w-10 text-center">{{ Math.round(zoom * 100) }}%</span>
          <button
            @click="zoom = Math.min(1.4, zoom + 0.1)"
            class="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-slate-300 cursor-pointer"
          >
            +
          </button>
          <button
            @click="zoom = 1"
            class="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-slate-400 hover:text-white cursor-pointer ml-1"
          >
            Reset
          </button>
        </div>
      </div>

      <!-- Contenedor del Árbol Gráfico -->
      <div v-if="result.ast && treeViewMode === 'graph'" class="p-6 bg-[#080d1a] rounded-2xl border border-slate-800 overflow-x-auto min-h-64 flex justify-center items-start shadow-inner">
        <div
          class="transition-transform duration-200 origin-top flex justify-center w-full"
          :style="{ transform: `scale(${zoom})` }"
        >
          <AstTreeNode :node="result.ast" />
        </div>
      </div>

      <!-- Contenedor del Árbol ASCII -->
      <div v-else-if="result.ast && treeViewMode === 'ascii'" class="p-4 bg-[#080d1a] rounded-2xl border border-slate-800 overflow-x-auto font-mono text-xs sm:text-sm text-cyan-300 shadow-inner">
        <pre class="leading-relaxed whitespace-pre font-mono">{{ asciiTreeOutput }}</pre>
      </div>

      <div v-else class="text-center py-8 text-slate-500 text-xs font-mono bg-[#080d1a] rounded-xl border border-slate-800">
        No se ha podido generar el AST. Ingrese una expresión o sentencia sintácticamente válida.
      </div>

      <!-- Leyenda de colores del árbol -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono pt-1">
        <div class="p-2 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span>
          <span class="text-purple-300">Operadores (Nodos)</span>
        </div>
        <div class="p-2 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
          <span class="text-cyan-300">Constantes (Hojas)</span>
        </div>
        <div class="p-2 rounded-xl bg-sky-950/40 border border-sky-500/30 flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]"></span>
          <span class="text-sky-300">Identificadores</span>
        </div>
        <div class="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
          <span class="text-emerald-300">Arreglos / Heap</span>
        </div>
      </div>
    </div>

    <!-- Vista de Tokens -->
    <div v-if="activeTab === 'tokens'" class="space-y-2">
      <div class="overflow-x-auto max-h-72 overflow-y-auto border border-slate-800 rounded-xl bg-[#080d1a]">
        <table class="w-full text-left text-xs font-mono min-w-[500px]">
          <thead class="bg-[#0a101f] text-slate-300 sticky top-0 border-b border-slate-800">
            <tr>
              <th class="p-2.5">#</th>
              <th class="p-2.5">Token Abstracto</th>
              <th class="p-2.5">Lexema</th>
              <th class="p-2.5">Categoría</th>
              <th class="p-2.5">Posición</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60">
            <tr v-for="(tok, idx) in result.tokens" :key="idx" class="hover:bg-slate-900/50">
              <td class="p-2.5 text-slate-500">{{ idx + 1 }}</td>
              <td class="p-2.5 font-bold text-cyan-400">&lt;{{ tok.type }}, "{{ tok.value }}"&gt;</td>
              <td class="p-2.5"><span class="text-purple-300 bg-slate-900 border border-purple-500/30 rounded px-2 py-0.5">{{ tok.value }}</span></td>
              <td class="p-2.5 text-slate-300">{{ formatTokenType(tok.type) }}</td>
              <td class="p-2.5 text-slate-500">L{{ tok.line }}:C{{ tok.col }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="text-[11px] text-slate-400 italic">
        * Cada lexema es clasificado según el patrón léxico en una tupla abstracta &lt;nombre-token, atributo&gt;.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { compileToC3D, type TranslationResult, type ASTNode } from '../../utils/c3dParser';
import { handleTabIndent } from '../../utils/editorUtils';
import AstTreeNode from './AstTreeNode.vue';

const inputCode = ref('(25 + 12) * a - 4');
const activeTab = ref<'tokens' | 'ast'>('ast');
const treeViewMode = ref<'graph' | 'ascii'>('graph');
const zoom = ref(1);

const samples = [
  { label: '1. Aritmética Jerárquica', code: '(25 + 12) * a - 4' },
  { label: '2. Relacional x = 5+1 > y*2;', code: 'x =  5 + 1 > y * 2;' },
  { label: '3. Lógica Cortocircuito', code: 'a > 0 && b < 10' },
  { label: '4. Arreglo 2D matriz[i][j]', code: 'matriz[i][j] + 5' },
  { label: '5. Asignación Arreglo', code: 'matriz[i][j] = val + 5;' }
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

function analyze() {
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
  analyze();
}

function clearInput() {
  inputCode.value = '';
  analyze();
}

function onKeydown(e: KeyboardEvent) {
  handleTabIndent(e, () => inputCode.value, (val) => {
    inputCode.value = val;
    analyze();
  });
}

function renderAscii(node: ASTNode | null, prefix = '', isLast = true): string {
  if (!node) return '';
  const branch = isLast ? '└── ' : '├── ';
  let text = prefix + branch + `${node.type}${node.value ? ` (${node.value})` : ''}\n`;
  const nextPrefix = prefix + (isLast ? '    ' : '│   ');
  
  const children: ASTNode[] = [];
  if (node.left) children.push(node.left);
  if (node.right) children.push(node.right);
  if (node.children) children.push(...node.children);

  for (let i = 0; i < children.length; i++) {
    text += renderAscii(children[i], nextPrefix, i === children.length - 1);
  }
  return text;
}

const asciiTreeOutput = computed(() => {
  if (!result.value.ast) return '';
  return renderAscii(result.value.ast);
});

function formatTokenType(type: string): string {
  switch (type) {
    case 'NUMBER': return 'Constante Numérica';
    case 'IDENTIFIER': return 'Identificador';
    case 'KEYWORD': return 'Palabra Reservada';
    case 'OPERATOR': return 'Operador Aritmético';
    case 'RELOP': return 'Operador Relacional';
    case 'LOGOP': return 'Operador Lógico';
    case 'ASSIGN': return 'Asignación';
    case 'DELIMITER': return 'Delimitador';
    default: return type;
  }
}

onMounted(() => {
  analyze();
});
</script>
