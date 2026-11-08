<template>
  <div class="bg-[#0d1527] border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl text-slate-200">
    <div class="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3">
      <div>
        <h3 class="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <span class="inline-block w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
          Analizador de Expresiones & AST
        </h3>
        <p class="text-xs text-slate-400 mt-0.5">Tokenización léxica en tiempo real y árbol sintáctico jerárquico</p>
      </div>

      <!-- Presets de prueba -->
      <div class="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
        <span class="text-slate-400">Ejemplos:</span>
        <button
          v-for="(sample, idx) in samples"
          :key="idx"
          @click="loadSample(sample.code)"
          class="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 rounded-lg transition cursor-pointer text-xs font-mono"
        >
          {{ sample.label }}
        </button>
      </div>
    </div>

    <!-- Entrada del usuario -->
    <div class="mb-4">
      <label class="block text-xs uppercase tracking-wider text-slate-400 mb-1 font-mono">Expresión de entrada:</label>
      <div class="relative">
        <input
          v-model="inputCode"
          @input="analyze"
          type="text"
          class="w-full bg-[#080d1a] border border-slate-700/80 rounded-xl px-4 py-2.5 font-mono text-sm text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 pr-16"
          placeholder="Ej: (25 + 12) * a - 4"
        />
        <button
          v-if="inputCode"
          @click="clearInput"
          class="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-rose-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800"
        >
          Limpiar
        </button>
      </div>
    </div>

    <!-- Errores si existen -->
    <div v-if="result.errors.length > 0" class="mb-4 p-3 bg-rose-950/30 border border-rose-500/40 rounded-xl text-rose-300 text-xs font-mono">
      <p class="font-bold flex items-center gap-1 text-rose-400">⚠ Error detectado:</p>
      <ul class="list-disc list-inside mt-1">
        <li v-for="(err, idx) in result.errors" :key="idx">{{ err }}</li>
      </ul>
    </div>

    <!-- Pestañas de Vista: Tokens vs Árbol AST -->
    <div class="flex border-b border-slate-800 mb-4 text-xs font-mono">
      <button
        @click="activeTab = 'tokens'"
        :class="activeTab === 'tokens' ? 'border-b-2 border-cyan-400 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'"
        class="px-4 py-2 cursor-pointer transition"
      >
        Tokens Léxicos ({{ result.tokens.length }})
      </button>
      <button
        @click="activeTab = 'ast'"
        :class="activeTab === 'ast' ? 'border-b-2 border-cyan-400 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'"
        class="px-4 py-2 cursor-pointer transition"
      >
        Árbol Sintáctico (AST)
      </button>
    </div>

    <!-- Vista de Tokens -->
    <div v-if="activeTab === 'tokens'" class="space-y-2">
      <div class="overflow-x-auto max-h-64 overflow-y-auto border border-slate-800 rounded-xl bg-[#080d1a]">
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

    <!-- Vista de Árbol Sintáctico AST -->
    <div v-if="activeTab === 'ast'" class="space-y-3">
      <div v-if="result.ast" class="p-4 bg-[#080d1a] rounded-xl border border-slate-800 overflow-x-auto min-h-48 flex justify-center items-start">
        <div class="w-full">
          <AstTreeNode :node="result.ast" />
        </div>
      </div>
      <div v-else class="text-center py-8 text-slate-500 text-xs font-mono">
        No se ha podido generar el AST. Ingrese una expresión sintácticamente válida.
      </div>
      <div class="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 text-xs">
        <h4 class="font-bold text-cyan-300 mb-1">Estructura del Árbol de Sintaxis Abstracta (AST)</h4>
        <p class="text-slate-400 leading-relaxed">
          El AST elimina la puntuación irrelevante (paréntesis, separadores) reteniendo los operadores en los nodos interiores y los operandos (constantes e identificadores) como hojas, permitiendo un recorrido recursivo directo para la generación de código.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { compileToC3D, type TranslationResult } from '../../utils/c3dParser';
import AstTreeNode from './AstTreeNode.vue';

const inputCode = ref('(25 + 12) * a - 4');
const activeTab = ref<'tokens' | 'ast'>('ast');

const samples = [
  { label: 'Aritmética', code: '(25 + 12) * a - 4' },
  { label: 'Relacional', code: 'x + 1 > y * 2' },
  { label: 'Lógica Cortocircuito', code: 'a > 0 && b < 10' },
  { label: 'Arreglo 2D', code: 'matriz[i][j] + 5' }
];

const result = ref<TranslationResult>({
  tokens: [],
  ast: null,
  tacLines: [],
  quadruples: [],
  triples: [],
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

function formatTokenType(type: string): string {
  switch (type) {
    case 'NUMBER': return 'Constante Numérica';
    case 'ID': return 'Identificador';
    case 'OP_ADD': case 'OP_SUB': return 'Operador Aditivo';
    case 'OP_MUL': case 'OP_DIV': case 'OP_MOD': return 'Operador Multiplicativo';
    case 'LPAREN': case 'RPAREN': return 'Delimitador de Agrupación';
    case 'LBRACKET': case 'RBRACKET': return 'Indexación de Arreglo';
    case 'OP_REL': return 'Comparación Relacional';
    case 'OP_AND': case 'OP_OR': return 'Operador Lógico';
    case 'OP_NOT': return 'Negación Lógica';
    default: return type;
  }
}

onMounted(() => {
  analyze();
});
</script>
