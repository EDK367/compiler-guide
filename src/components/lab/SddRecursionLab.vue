<template>
  <div class="bg-[#0d1527] border border-slate-800 rounded-3xl p-4 sm:p-7 shadow-2xl text-slate-200 space-y-6">
    <!-- Encabezado de la Herramienta -->
    <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
      <div>
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-cyan-950/70 text-cyan-300 border border-cyan-500/40 mb-2.5 shadow-[0_0_12px_rgba(34,211,238,0.25)]">
          <span>⚡</span>
          <span>FRONT-END • TRADUCCIÓN DIRIGIDA POR LA SINTAXIS (DDS)</span>
        </div>
        <h3 class="text-xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
          <span class="inline-block w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.9)] animate-pulse"></span>
          Eliminador de Recursividad Izquierda & Grafos de Dependencia Semántica
        </h3>
        <p class="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed max-w-4xl font-sans">
          Basado en la cátedra del <strong class="text-cyan-300">Ing. Mario Ramírez Tobar</strong> (<em class="text-slate-200">"Traducción Dirigida por la sintaxis y comprobación de tipos"</em>, pág. 1-705). Transforme gramáticas eliminando recursividad por la izquierda con acciones semánticas tratadas como terminales, y visualice árboles sintácticos anotados con grafos de dependencias entre atributos sintetizados (<span class="text-emerald-400 font-bold">↑</span>) y heredados (<span class="text-purple-400 font-bold">↓</span>).
        </p>
      </div>

      <!-- Selector de Modo Principal -->
      <div class="flex flex-wrap items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-700/80 text-xs font-mono">
        <button
          @click="activeTab = 'recursion'"
          :class="activeTab === 'recursion' ? 'bg-gradient-to-r from-purple-900/80 to-cyan-900/80 text-white font-bold border border-cyan-500/50 shadow-sm' : 'text-slate-400 hover:text-slate-200'"
          class="px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
        >
          <span>🔄</span>
          <span>1. Eliminador de Recursividad</span>
        </button>
        <button
          @click="activeTab = 'trees'"
          :class="activeTab === 'trees' ? 'bg-gradient-to-r from-cyan-900/80 to-purple-900/80 text-white font-bold border border-cyan-500/50 shadow-sm' : 'text-slate-400 hover:text-slate-200'"
          class="px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
        >
          <span>🌳</span>
          <span>2. Árbol Anotado & Grafo DDS</span>
        </button>
        <button
          @click="activeTab = 'steps'"
          :class="activeTab === 'steps' ? 'bg-slate-800 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm' : 'text-slate-400 hover:text-slate-200'"
          class="px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
        >
          <span>⏱️</span>
          <span>3. Paso a Paso & Orden Topológico</span>
        </button>
        <button
          @click="activeTab = 'theory'"
          :class="activeTab === 'theory' ? 'bg-slate-800 text-purple-300 font-bold border border-purple-500/40 shadow-sm' : 'text-slate-400 hover:text-slate-200'"
          class="px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
        >
          <span>📖</span>
          <span>4. Tabla DDS & Teoría</span>
        </button>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- TAB 1: ELIMINADOR DE RECURSIVIDAD A LA IZQUIERDA -->
    <!-- ============================================================== -->
    <div v-if="activeTab === 'recursion'" class="space-y-6">
      <!-- Barra de Presets Oficiales del PDF -->
      <div class="flex flex-wrap items-center justify-between gap-3 bg-[#080d1a] p-3 rounded-2xl border border-slate-800 text-xs font-mono">
        <div class="flex items-center gap-2 text-slate-300 font-bold">
          <span class="text-cyan-400">Casos Oficiales del PDF:</span>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button
            v-for="(preset, idx) in recursionPresets"
            :key="idx"
            @click="loadRecursionPreset(preset.code)"
            class="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 rounded-xl transition cursor-pointer text-xs font-semibold"
          >
            {{ preset.label }}
          </button>
        </div>
      </div>

      <!-- Editor de Entrada y Botones -->
      <div class="space-y-2">
        <div class="flex items-center justify-between text-xs font-mono">
          <label class="uppercase tracking-wider text-slate-300 font-bold flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
            Gramática Libre de Contexto (Soporta acciones semánticas entre llaves { ... }):
          </label>
          <div class="flex items-center gap-2">
            <button
              @click="recursionInput = ''"
              class="text-xs text-slate-400 hover:text-rose-400 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer transition"
            >
              Limpiar
            </button>
            <button
              @click="runElimination"
              class="text-xs text-slate-950 font-bold bg-cyan-400 hover:bg-cyan-300 px-3.5 py-1 rounded-lg shadow-sm cursor-pointer transition flex items-center gap-1.5"
            >
              <span>⚡</span>
              <span>Transformar</span>
            </button>
          </div>
        </div>

        <div class="relative rounded-2xl border border-slate-700/80 bg-[#080d1a] overflow-hidden shadow-inner focus-within:border-cyan-400 transition">
          <textarea
            v-model="recursionInput"
            @input="runElimination"
            rows="5"
            spellcheck="false"
            class="w-full bg-transparent p-4 font-mono text-sm text-cyan-200 leading-relaxed focus:outline-none resize-y selection:bg-cyan-500 selection:text-slate-950"
            placeholder="Ej: E -> E + T { print('+'); } | T"
          ></textarea>
        </div>
      </div>

      <!-- Alerta Teórica Clave del Ing. Mario Ramírez Tobar -->
      <div class="p-4 bg-gradient-to-r from-amber-950/40 to-slate-900/60 border-l-4 border-amber-400 rounded-r-2xl border-y border-r border-amber-500/30 text-xs font-mono space-y-1.5">
        <div class="flex items-center gap-2 text-amber-300 font-bold uppercase tracking-wider">
          <span>💡</span>
          <span>Principio Canónico de Transformación (Diapositivas 36-38):</span>
        </div>
        <p class="text-slate-300 font-sans leading-relaxed">
          <em>"¿Por qué eliminarlo? Porque ninguna gramática con recursividad por la izquierda puede analizarse sintácticamente en forma determinista: <code>parseE()</code> invocaría a <code>parseE()</code> infinitamente sin avanzar en la entrada. Para eliminarlo, <strong>trate a las acciones como si fueran símbolos terminales</strong> formando parte de los sufijos α."</em>
        </p>
      </div>

      <!-- Desglose Paso a Paso por No-Terminal -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h4 class="text-sm font-bold font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <span>🔍 Desglose Formal de Componentes (α, β y A')</span>
          </h4>
          <span class="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
            {{ recursionResult.totalRecursive }} no terminal(es) recursivo(s) detectado(s)
          </span>
        </div>

        <div class="grid grid-cols-1 gap-4">
          <div
            v-for="(item, idx) in recursionResult.items"
            :key="idx"
            class="p-4 sm:p-5 rounded-2xl border transition"
            :class="item.isRecursive ? 'bg-[#0a1224] border-cyan-500/40 shadow-[0_0_20px_rgba(34,211,238,0.08)]' : 'bg-[#080d1a] border-slate-800/80'"
          >
            <!-- Cabecera del No-Terminal -->
            <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-3">
              <div class="flex items-center gap-2.5">
                <span class="text-base font-extrabold font-mono text-cyan-300 px-2.5 py-1 rounded-lg bg-cyan-950/70 border border-cyan-500/40">
                  {{ item.head }}
                </span>
                <span
                  class="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full"
                  :class="item.isRecursive ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40' : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'"
                >
                  {{ item.isRecursive ? '⚠️ Recursividad Izquierda Directa' : '✓ Sin Recursividad Izquierda' }}
                </span>
              </div>
              <div class="text-xs font-mono text-slate-400">
                Original: <code class="text-slate-200">{{ item.head }} -> {{ item.originalAlts.join(' | ') }}</code>
              </div>
            </div>

            <!-- Si es recursivo: descomposición alpha / beta -->
            <div v-if="item.isRecursive" class="space-y-3 text-xs font-mono">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <!-- Rama recursiva Alpha -->
                <div class="p-3 bg-[#080d1a] rounded-xl border border-rose-500/30 space-y-1">
                  <span class="text-rose-400 font-bold uppercase block tracking-wider">
                    Sufijos Recursivos (α):
                  </span>
                  <div class="space-y-1">
                    <div v-for="(a, aidx) in item.alphas" :key="aidx" class="text-rose-200 font-bold">
                      α<sub>{{ aidx + 1 }}</sub> = <span class="bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/40">{{ a }}</span>
                    </div>
                  </div>
                  <span class="text-[11px] text-slate-400 font-sans block mt-1">
                    Lo que sigue al no-terminal <code>{{ item.head }}</code> en la producción recursiva (acciones semánticas tratadas como terminales).
                  </span>
                </div>

                <!-- Rama base Beta -->
                <div class="p-3 bg-[#080d1a] rounded-xl border border-emerald-500/30 space-y-1">
                  <span class="text-emerald-400 font-bold uppercase block tracking-wider">
                    Casos Base no recursivos (β):
                  </span>
                  <div class="space-y-1">
                    <div v-for="(b, bidx) in item.betas" :key="bidx" class="text-emerald-200 font-bold">
                      β<sub>{{ bidx + 1 }}</sub> = <span class="bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">{{ b }}</span>
                    </div>
                  </div>
                  <span class="text-[11px] text-slate-400 font-sans block mt-1">
                    Producciones alternativas que no inician con <code>{{ item.head }}</code>.
                  </span>
                </div>
              </div>

              <!-- Producciones Transformadas -->
              <div class="p-3.5 bg-gradient-to-r from-cyan-950/40 to-slate-900 rounded-xl border border-cyan-500/30 space-y-1.5">
                <span class="text-cyan-300 font-bold uppercase tracking-wider block">
                  Reglas Equivalentes Transformadas:
                </span>
                <div class="space-y-1 text-sm font-bold text-white">
                  <div v-for="(rule, ridx) in item.transformedRules" :key="ridx" class="text-cyan-200">
                    {{ rule }}
                  </div>
                </div>
              </div>

              <div v-if="item.warning" class="p-2.5 bg-amber-950/50 border border-amber-500/40 rounded-lg text-amber-200 text-xs">
                {{ item.warning }}
              </div>
            </div>

            <!-- Si no es recursivo -->
            <div v-else class="text-xs text-slate-400 font-sans">
              {{ item.explanation }}
            </div>
          </div>
        </div>
      </div>

      <!-- Gramática Completa Transformada -->
      <div class="space-y-2">
        <div class="flex items-center justify-between text-xs font-mono">
          <span class="text-slate-300 font-bold uppercase tracking-wider flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            Gramática Resultante Completa (Sin Recursividad Izquierda):
          </span>
          <button
            @click="copyTransformed"
            class="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-cyan-300 rounded-lg transition cursor-pointer flex items-center gap-1.5"
          >
            <span>📋</span>
            <span>{{ copySuccess ? '¡Copiado!' : 'Copiar Gramática' }}</span>
          </button>
        </div>
        <pre class="p-4 bg-[#080d1a] border border-slate-800 rounded-2xl font-mono text-sm text-emerald-300 overflow-x-auto shadow-inner leading-relaxed">{{ recursionResult.allTransformedText }}</pre>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- TAB 2: ÁRBOL ANOTADO & GRAFO DE DEPENDENCIAS (DDS) -->
    <!-- ============================================================== -->
    <div v-if="activeTab === 'trees'" class="space-y-5">
      <!-- Selector de Casos y Preset Expresiones -->
      <div class="flex flex-wrap items-center justify-between gap-3 bg-[#080d1a] p-3 rounded-2xl border border-slate-800 text-xs font-mono">
        <div class="flex items-center gap-2 text-slate-300 font-bold">
          <span class="text-cyan-400">Ejercicios Oficiales de la Cátedra:</span>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button
            v-for="(sample, idx) in sddSamples"
            :key="idx"
            @click="loadSddSample(sample)"
            :class="currentSampleLabel === sample.label ? 'bg-cyan-950 text-cyan-300 border-cyan-400 font-bold shadow-sm' : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-cyan-300'"
            class="px-3 py-1.5 border rounded-xl transition cursor-pointer text-xs font-semibold"
          >
            {{ sample.label }}
          </button>
        </div>
      </div>

      <!-- Barra de Entrada de Expresión -->
      <div class="flex flex-wrap items-center gap-3">
        <div class="flex-1 min-w-[240px] relative">
          <input
            v-model="expressionInput"
            @keydown.enter="evaluateSdd"
            type="text"
            class="w-full bg-[#080d1a] border border-slate-700/80 rounded-xl px-4 py-2.5 font-mono text-sm text-cyan-200 focus:outline-none focus:border-cyan-400 transition"
            placeholder="Ej: (3 + 4) * (5 + 6) o 3 * 5 * 2"
          />
        </div>
        <button
          @click="evaluateSdd"
          class="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold font-mono text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-2"
        >
          <span>⚡</span>
          <span>Evaluar Árbol & Grafo DDS</span>
        </button>
      </div>

      <!-- Error si la expresión no es válida -->
      <div v-if="sddError" class="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-rose-300 text-xs font-mono flex items-center gap-2">
        <span>⚠️</span>
        <span>{{ sddError }}</span>
      </div>

      <!-- Resumen Estadístico y Leyenda de Atributos -->
      <div v-if="sddTreeData" class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div class="p-3 bg-[#0a1224] rounded-xl border border-cyan-500/40 space-y-1">
          <span class="text-slate-400 uppercase text-[10px] block font-bold">Resultado Semántico Final</span>
          <div class="text-xl sm:text-2xl font-black text-cyan-300">
            {{ sddTreeData.finalResult }}
          </div>
          <span class="text-[11px] text-slate-400">Atributo raíz: <code>L.val</code> o <code>S.total</code></span>
        </div>

        <div class="p-3 bg-[#080d1a] rounded-xl border border-purple-500/30 space-y-1">
          <span class="text-purple-400 uppercase text-[10px] block font-bold flex items-center gap-1">
            <span>↓</span> Atributos Heredados
          </span>
          <div class="text-xl sm:text-2xl font-black text-purple-300">
            {{ countInheritedAttrs }}
          </div>
          <span class="text-[11px] text-slate-400">Pasan valores acumulados hacia la derecha/abajo</span>
        </div>

        <div class="p-3 bg-[#080d1a] rounded-xl border border-emerald-500/30 space-y-1">
          <span class="text-emerald-400 uppercase text-[10px] block font-bold flex items-center gap-1">
            <span>↑</span> Atributos Sintetizados
          </span>
          <div class="text-xl sm:text-2xl font-black text-emerald-300">
            {{ countSynthesizedAttrs }}
          </div>
          <span class="text-[11px] text-slate-400">Suben valores calculados desde los hijos</span>
        </div>

        <div class="p-3 bg-[#080d1a] rounded-xl border border-amber-500/30 space-y-1">
          <span class="text-amber-400 uppercase text-[10px] block font-bold">Total Aristas Grafo</span>
          <div class="text-xl sm:text-2xl font-black text-amber-300">
            {{ sddTreeData.edgesList.length }}
          </div>
          <span class="text-[11px] text-slate-400">Dependencias dirigidas en el DAG</span>
        </div>
      </div>

      <!-- Controles de Visualización del Grafo & Árbol SVG -->
      <div v-if="sddTreeData" class="flex flex-wrap items-center justify-between gap-3 bg-[#080d1a] p-3 rounded-2xl border border-slate-800 text-xs font-mono">
        <div class="flex flex-wrap items-center gap-3">
          <label class="flex items-center gap-1.5 cursor-pointer text-slate-300">
            <input type="checkbox" v-model="showEdges" class="rounded bg-slate-900 border-slate-700 text-cyan-400 focus:ring-0" />
            <span>Ver Aristas de Dependencia</span>
          </label>
          <label class="flex items-center gap-1.5 cursor-pointer text-slate-300">
            <input type="checkbox" v-model="filterSynthesizedOnly" @change="onFilterSynthesized" class="rounded bg-slate-900 border-slate-700 text-emerald-400 focus:ring-0" />
            <span>Solo Sintetizados (↑)</span>
          </label>
          <label class="flex items-center gap-1.5 cursor-pointer text-slate-300">
            <input type="checkbox" v-model="filterInheritedOnly" @change="onFilterInherited" class="rounded bg-slate-900 border-slate-700 text-purple-400 focus:ring-0" />
            <span>Solo Heredados (↓)</span>
          </label>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-slate-400">Zoom:</span>
          <button @click="zoomOut" class="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold transition">-</button>
          <span class="w-12 text-center text-cyan-300 font-bold">{{ Math.round(zoomLevel * 100) }}%</span>
          <button @click="zoomIn" class="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold transition">+</button>
          <button @click="resetZoom" class="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 text-[11px] transition">Reset</button>
        </div>
      </div>

      <!-- Lienzo SVG Interactivo: Árbol Anotado + Grafo de Dependencias -->
      <div v-if="sddTreeData" class="relative rounded-3xl border border-slate-800 bg-[#060a14] overflow-hidden shadow-2xl min-h-[500px]">
        <!-- Leyenda Flotante -->
        <div class="absolute top-3 left-3 z-20 bg-slate-950/80 backdrop-blur-md p-2.5 rounded-xl border border-slate-800 text-[11px] font-mono space-y-1">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
            <span class="text-purple-300 font-bold">Heredado (.her / .valh):</span>
            <span class="text-slate-400">Flujo lateral / descendente</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span class="text-emerald-300 font-bold">Sintetizado (.sin / .val / .total):</span>
            <span class="text-slate-400">Flujo ascendente</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span class="text-amber-300 font-bold">Léxico (.valex):</span>
            <span class="text-slate-400">Constante literal de token</span>
          </div>
        </div>

        <div class="overflow-auto max-h-[650px] p-4 cursor-grab active:cursor-grabbing">
          <svg
            :width="sddTreeData.svgWidth * zoomLevel"
            :height="sddTreeData.svgHeight * zoomLevel"
            :viewBox="`0 0 ${sddTreeData.svgWidth} ${sddTreeData.svgHeight}`"
            class="transition-all duration-150 select-none mx-auto block"
          >
            <defs>
              <!-- Flecha para dependencias sintetizadas (Cyan/Emerald) -->
              <marker
                id="arrow-cyan"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 9 5 L 0 9 z" fill="#22d3ee" />
              </marker>

              <!-- Flecha para dependencias heredadas (Purple/Pink) -->
              <marker
                id="arrow-purple"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 9 5 L 0 9 z" fill="#c084fc" />
              </marker>

              <!-- Filtro de brillo para nodos y aristas activas -->
              <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <!-- 1. RAMAS DEL ÁRBOL SINTÁCTICO (Conectores Padre -> Hijos) -->
            <g class="tree-branches">
              <template v-for="node in sddTreeData.nodesList" :key="'branches-' + node.id">
                <line
                  v-for="child in node.children"
                  :key="'line-' + node.id + '-' + child.id"
                  :x1="node.x"
                  :y1="node.y"
                  :x2="child.x"
                  :y2="child.y"
                  stroke="#334155"
                  stroke-width="1.8"
                  stroke-dasharray="2,2"
                />
              </template>
            </g>

            <!-- 2. ARISTAS DEL GRAFO DE DEPENDENCIAS ENTRE ATRIBUTOS -->
            <g v-if="showEdges" class="dependency-edges">
              <template v-for="edge in visibleEdges" :key="edge.id">
                <path
                  :d="computeCurvedPath(edge.from, edge.to)"
                  :stroke="edge.edgeType === 'inherited' ? '#c084fc' : '#22d3ee'"
                  :marker-end="edge.edgeType === 'inherited' ? 'url(#arrow-purple)' : 'url(#arrow-cyan)'"
                  stroke-width="2.2"
                  fill="none"
                  stroke-opacity="0.85"
                  class="transition-all hover:stroke-width-4 hover:stroke-opacity-100"
                >
                  <title>{{ edge.ruleDesc }} ({{ edge.from.nodeSym }}#{{ edge.from.nodeId }}.{{ edge.from.attrName }} ➔ {{ edge.to.nodeSym }}#{{ edge.to.nodeId }}.{{ edge.to.attrName }})</title>
                </path>
              </template>
            </g>

            <!-- 3. NODOS DEL ÁRBOL SINTÁCTICO -->
            <g class="tree-nodes">
              <template v-for="node in sddTreeData.nodesList" :key="'node-' + node.id">
                <!-- Cápsula del nodo sintáctico -->
                <g
                  @click="selectedNode = node"
                  class="cursor-pointer group"
                >
                  <!-- Círculo base del símbolo -->
                  <circle
                    :cx="node.x"
                    :cy="node.y"
                    :r="node.isTerminal ? 16 : 22"
                    :fill="node.isTerminal ? '#0f172a' : '#1e1b4b'"
                    :stroke="selectedNode?.id === node.id ? '#38bdf8' : (node.isTerminal ? '#64748b' : '#818cf8')"
                    :stroke-width="selectedNode?.id === node.id ? 3 : 2"
                    class="transition-all duration-200 group-hover:scale-110"
                  />
                  <!-- Texto del símbolo sintáctico -->
                  <text
                    :x="node.x"
                    :y="node.y + 5"
                    text-anchor="middle"
                    :font-size="node.isTerminal ? '11px' : '14px'"
                    font-family="monospace"
                    font-weight="bold"
                    :fill="node.isTerminal ? '#94a3b8' : '#e0e7ff'"
                    pointer-events="none"
                  >
                    {{ node.sym }}
                  </text>

                  <!-- Etiqueta con el ID del nodo (ej #1) -->
                  <text
                    :x="node.x"
                    :y="node.y - (node.isTerminal ? 20 : 26)"
                    text-anchor="middle"
                    font-size="9px"
                    font-family="monospace"
                    fill="#64748b"
                    pointer-events="none"
                  >
                    #{{ node.id }}
                  </text>
                </g>
              </template>
            </g>

            <!-- 4. PASTILLAS DE ATRIBUTOS ANOTADOS EN CADA NODO -->
            <g class="attribute-badges">
              <template v-for="attr in sddTreeData.attributesList" :key="'attr-' + attr.nodeId + '-' + attr.attrName">
                <g class="cursor-pointer group">
                  <!-- Fondo de la píldora de atributo -->
                  <rect
                    :x="attr.x - 32"
                    :y="attr.y - 10"
                    width="64"
                    height="20"
                    rx="8"
                    :fill="getAttrBadgeFill(attr.attrType)"
                    :stroke="getAttrBadgeStroke(attr.attrType)"
                    stroke-width="1.2"
                    class="transition-all duration-150 group-hover:stroke-width-2"
                  />
                  <!-- Texto del atributo y valor: ej her=7 o val=77 -->
                  <text
                    :x="attr.x"
                    :y="attr.y + 3.5"
                    text-anchor="middle"
                    font-size="9px"
                    font-family="monospace"
                    font-weight="bold"
                    :fill="getAttrTextColor(attr.attrType)"
                    pointer-events="none"
                  >
                    {{ attr.attrName }}={{ attr.value }}
                  </text>
                </g>
              </template>
            </g>
          </svg>
        </div>
      </div>

      <!-- Panel Inspector del Nodo Seleccionado -->
      <div v-if="selectedNode" class="p-4 bg-[#0a1224] rounded-2xl border border-cyan-500/40 text-xs font-mono space-y-2">
        <div class="flex items-center justify-between border-b border-slate-800 pb-2">
          <span class="text-cyan-300 font-bold text-sm">
            Inspector de Nodo: <span class="text-white">{{ selectedNode.sym }} (Nodo #{{ selectedNode.id }})</span>
          </span>
          <button @click="selectedNode = null" class="text-slate-400 hover:text-white">✕ Cerrar</button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <span class="text-slate-400 block mb-1">Atributos calculados en este nodo:</span>
            <div v-if="Object.keys(selectedNode.attrs).length > 0" class="flex flex-wrap gap-2">
              <span
                v-for="(val, name) in selectedNode.attrs"
                :key="name"
                class="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-cyan-200"
              >
                <strong>{{ name }}</strong> = {{ val }}
              </span>
            </div>
            <span v-else class="text-slate-500 italic">Sin atributos semánticos.</span>
          </div>
          <div>
            <span class="text-slate-400 block mb-1">Hijos directos en la derivación:</span>
            <span class="text-slate-200">
              {{ selectedNode.children.map(c => `${c.sym} (#${c.id})`).join(', ') || 'Ninguno (hoja)' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- TAB 3: PASO A PASO & ORDEN TOPOLÓGICO -->
    <!-- ============================================================== -->
    <div v-if="activeTab === 'steps'" class="space-y-5">
      <div v-if="sddTreeData" class="space-y-4">
        <!-- Barra de Reproducción y Control de Pasos -->
        <div class="flex flex-wrap items-center justify-between gap-4 bg-[#080d1a] p-4 rounded-2xl border border-slate-800 text-xs font-mono">
          <div class="flex items-center gap-3">
            <span class="text-slate-300 font-bold">
              Paso {{ currentStepIdx + 1 }} de {{ sddTreeData.stepsList.length }}
            </span>
            <span class="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold">
              Orden Topológico Formal
            </span>
          </div>

          <div class="flex items-center gap-1.5">
            <button
              @click="currentStepIdx = 0"
              :disabled="currentStepIdx === 0"
              class="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 disabled:opacity-40 hover:text-white transition"
            >
              ⏮
            </button>
            <button
              @click="prevStep"
              :disabled="currentStepIdx === 0"
              class="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 disabled:opacity-40 hover:text-white transition"
            >
              ◀ Anterior
            </button>
            <button
              @click="togglePlay"
              class="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition flex items-center gap-1"
            >
              <span>{{ isPlaying ? '⏸ Pausa' : '▶ Play' }}</span>
            </button>
            <button
              @click="nextStep"
              :disabled="currentStepIdx >= sddTreeData.stepsList.length - 1"
              class="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 disabled:opacity-40 hover:text-white transition"
            >
              Siguiente ▶
            </button>
            <button
              @click="currentStepIdx = sddTreeData.stepsList.length - 1"
              :disabled="currentStepIdx >= sddTreeData.stepsList.length - 1"
              class="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 disabled:opacity-40 hover:text-white transition"
            >
              ⏭
            </button>
          </div>
        </div>

        <!-- Tarjeta del Paso Activo -->
        <div v-if="currentStep" class="p-5 bg-gradient-to-r from-purple-950/40 via-slate-900 to-cyan-950/40 rounded-2xl border border-cyan-500/50 shadow-xl space-y-2 font-mono text-xs">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
            <div class="flex items-center gap-2">
              <span class="text-sm font-extrabold text-cyan-300">
                Paso {{ currentStep.stepNumber }}: Evaluación en {{ currentStep.targetSym }}#{{ currentStep.targetNodeId }}.{{ currentStep.targetAttr }}
              </span>
              <span
                class="px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                :class="currentStep.attrType === 'inherited' ? 'bg-purple-950 text-purple-300 border border-purple-500/50' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'"
              >
                {{ currentStep.attrType === 'inherited' ? '↓ Atributo Heredado' : '↑ Atributo Sintetizado' }}
              </span>
            </div>
            <span class="text-slate-400">Regla: <code class="text-white">{{ currentStep.ruleTitle }}</code></span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div class="space-y-1">
              <span class="text-slate-400 uppercase tracking-wider text-[10px] block font-bold">Fórmula Semántica Formal:</span>
              <div class="text-base font-bold text-cyan-200 bg-[#080d1a] p-2.5 rounded-xl border border-slate-800">
                {{ currentStep.ruleFormula }}
              </div>
            </div>
            <div class="space-y-1">
              <span class="text-slate-400 uppercase tracking-wider text-[10px] block font-bold">Cálculo & Valores Sustituidos:</span>
              <div class="text-base font-bold text-emerald-300 bg-[#080d1a] p-2.5 rounded-xl border border-slate-800">
                {{ currentStep.calculationStr }} = <span class="text-white underline">{{ currentStep.value }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabla Completa de Evaluación Topológica -->
        <div class="rounded-2xl border border-slate-800 bg-[#080d1a] overflow-hidden">
          <div class="p-3 bg-slate-900 border-b border-slate-800 text-xs font-mono font-bold text-slate-300 flex items-center justify-between">
            <span>Secuencia de Evaluación Canónica (DAG sin Ciclos)</span>
            <span class="text-slate-400 text-[11px] font-normal">Haga clic en cualquier fila para saltar a ese paso</span>
          </div>
          <div class="overflow-x-auto max-h-96">
            <table class="w-full text-left text-xs font-mono">
              <thead class="bg-slate-950/80 text-slate-400 border-b border-slate-800 text-[11px] uppercase">
                <tr>
                  <th class="p-3">#</th>
                  <th class="p-3">Nodo</th>
                  <th class="p-3">Atributo</th>
                  <th class="p-3">Tipo</th>
                  <th class="p-3">Regla Semántica</th>
                  <th class="p-3">Cálculo</th>
                  <th class="p-3">Valor</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/60">
                <tr
                  v-for="(st, sidx) in sddTreeData.stepsList"
                  :key="sidx"
                  @click="currentStepIdx = sidx"
                  :class="currentStepIdx === sidx ? 'bg-cyan-950/50 font-bold text-white' : 'hover:bg-slate-900/60 text-slate-300 cursor-pointer'"
                  class="transition"
                >
                  <td class="p-3 text-cyan-400 font-bold">{{ st.stepNumber }}</td>
                  <td class="p-3">{{ st.targetSym }} (#{{ st.targetNodeId }})</td>
                  <td class="p-3">{{ st.targetAttr }}</td>
                  <td class="p-3">
                    <span
                      class="px-2 py-0.5 rounded text-[10px] font-bold"
                      :class="st.attrType === 'inherited' ? 'bg-purple-950/70 text-purple-300 border border-purple-500/40' : 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/40'"
                    >
                      {{ st.attrType === 'inherited' ? '↓ Her' : '↑ Sin' }}
                    </span>
                  </td>
                  <td class="p-3 font-mono text-slate-200">{{ st.ruleFormula }}</td>
                  <td class="p-3 font-mono text-slate-300">{{ st.calculationStr }}</td>
                  <td class="p-3 font-bold text-cyan-300">{{ st.value }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-10 text-slate-400 font-mono text-xs">
        Presione "Evaluar Árbol & Grafo DDS" en la pestaña 2 para generar la secuencia de pasos.
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- TAB 4: TABLA DDS & TEORÍA (MARIO RAMÍREZ TOBAR) -->
    <!-- ============================================================== -->
    <div v-if="activeTab === 'theory'" class="space-y-6 text-xs font-sans">
      <!-- Tabla Canónica de la DDS de la Cátedra (Diapositiva 31) -->
      <div class="space-y-3">
        <div class="flex items-center justify-between border-b border-slate-800 pb-2">
          <h4 class="text-sm font-bold font-mono uppercase tracking-wider text-cyan-300 flex items-center gap-2">
            <span>📋</span>
            <span>Definición Dirigida por la Sintaxis Oficial (Diapositiva 31 del PDF)</span>
          </h4>
          <span class="text-xs font-mono text-slate-400">Gramática L-Atribuida sin recursividad</span>
        </div>

        <div class="rounded-2xl border border-slate-800 bg-[#080d1a] overflow-hidden">
          <table class="w-full text-left font-mono text-xs">
            <thead class="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px] uppercase">
              <tr>
                <th class="p-3">#</th>
                <th class="p-3">Producción</th>
                <th class="p-3">Reglas Semánticas Asociadas</th>
                <th class="p-3">Tipo de Atributos</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/80 text-slate-300">
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-cyan-400">1</td>
                <td class="p-3 text-white font-bold">L → E</td>
                <td class="p-3 text-emerald-300">L.val = E.val</td>
                <td class="p-3 text-emerald-400">↑ Sintetizado</td>
              </tr>
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-cyan-400">2</td>
                <td class="p-3 text-white font-bold">E → T E'</td>
                <td class="p-3 space-y-1">
                  <div class="text-purple-300">E'.her = T.val</div>
                  <div class="text-emerald-300">E.val = E'.sin</div>
                </td>
                <td class="p-3 space-y-1">
                  <div class="text-purple-400">↓ Heredado</div>
                  <div class="text-emerald-400">↑ Sintetizado</div>
                </td>
              </tr>
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-cyan-400">3</td>
                <td class="p-3 text-white font-bold">E' → + T E'<sub>1</sub></td>
                <td class="p-3 space-y-1">
                  <div class="text-purple-300">E'<sub>1</sub>.her = E'.her + T.val</div>
                  <div class="text-emerald-300">E'.sin = E'<sub>1</sub>.sin</div>
                </td>
                <td class="p-3 space-y-1">
                  <div class="text-purple-400">↓ Heredado</div>
                  <div class="text-emerald-400">↑ Sintetizado</div>
                </td>
              </tr>
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-cyan-400">4</td>
                <td class="p-3 text-white font-bold">E' → ε</td>
                <td class="p-3 text-emerald-300">E'.sin = E'.her</td>
                <td class="p-3 text-emerald-400">↑ Sintetizado desde Heredado</td>
              </tr>
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-cyan-400">5</td>
                <td class="p-3 text-white font-bold">T → F T'</td>
                <td class="p-3 space-y-1">
                  <div class="text-purple-300">T'.her = F.val</div>
                  <div class="text-emerald-300">T.val = T'.sin</div>
                </td>
                <td class="p-3 space-y-1">
                  <div class="text-purple-400">↓ Heredado</div>
                  <div class="text-emerald-400">↑ Sintetizado</div>
                </td>
              </tr>
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-cyan-400">6</td>
                <td class="p-3 text-white font-bold">T' → * F T'<sub>1</sub></td>
                <td class="p-3 space-y-1">
                  <div class="text-purple-300">T'<sub>1</sub>.her = T'.her * F.val</div>
                  <div class="text-emerald-300">T'.sin = T'<sub>1</sub>.sin</div>
                </td>
                <td class="p-3 space-y-1">
                  <div class="text-purple-400">↓ Heredado</div>
                  <div class="text-emerald-400">↑ Sintetizado</div>
                </td>
              </tr>
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-cyan-400">7</td>
                <td class="p-3 text-white font-bold">T' → ε</td>
                <td class="p-3 text-emerald-300">T'.sin = T'.her</td>
                <td class="p-3 text-emerald-400">↑ Sintetizado desde Heredado</td>
              </tr>
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-cyan-400">8</td>
                <td class="p-3 text-white font-bold">F → ( E )</td>
                <td class="p-3 text-emerald-300">F.val = E.val</td>
                <td class="p-3 text-emerald-400">↑ Sintetizado</td>
              </tr>
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-cyan-400">9</td>
                <td class="p-3 text-white font-bold">F → digito</td>
                <td class="p-3 text-emerald-300">F.val = digito.valex</td>
                <td class="p-3 text-emerald-400">↑ Sintetizado desde Léxico</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Cuadros Comparativos: S-Atribuidas vs L-Atribuidas -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-5 bg-[#0a1224] rounded-2xl border border-cyan-500/40 space-y-2">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-cyan-400"></span>
            <h5 class="font-mono font-bold text-cyan-300 text-sm uppercase">Definiciones S-Atribuidas</h5>
          </div>
          <p class="text-slate-300 leading-relaxed">
            Contienen <strong>únicamente atributos sintetizados</strong>. El valor de cada atributo se computa exclusivamente a partir de los atributos de sus nodos hijos.
          </p>
          <ul class="list-disc pl-5 space-y-1 text-slate-400 font-mono text-[11px]">
            <li>Orden de recorrido: <em>Post-orden</em> (abajo hacia arriba).</li>
            <li>Compatibilidad nativa con analizadores ascendentes (LR / LALR).</li>
            <li>Las acciones se ejecutan justo al momento de la reducción en la pila.</li>
          </ul>
        </div>

        <div class="p-5 bg-[#0a1224] rounded-2xl border border-purple-500/40 space-y-2">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-purple-400"></span>
            <h5 class="font-mono font-bold text-purple-300 text-sm uppercase">Definiciones L-Atribuidas</h5>
          </div>
          <p class="text-slate-300 leading-relaxed">
            Permiten <strong>atributos heredados</strong> además de sintetizados. La regla clave es que un atributo heredado solo puede depender de los atributos de los hermanos situados <em>estrictamente a su izquierda</em> o del encabezado padre.
          </p>
          <ul class="list-disc pl-5 space-y-1 text-slate-400 font-mono text-[11px]">
            <li>Orden de recorrido: <em>Pre-orden</em> y DFS (izquierda a derecha).</li>
            <li>Compatibilidad nativa con analizadores descendentes (LL(1) y descenso recursivo).</li>
            <li>Son obligatorias cuando se elimina la recursividad por la izquierda en expresiones.</li>
          </ul>
        </div>
      </div>

      <!-- ¿Por qué la eliminación de recursividad fuerza el uso de atributos heredados? -->
      <div class="p-5 bg-[#080d1a] rounded-2xl border border-slate-800 space-y-2">
        <h5 class="font-mono font-bold text-amber-300 text-sm uppercase">
          💡 El Vínculo Crucial: ¿Por qué la Eliminación de Recursividad Izquierda Crea Atributos Heredados?
        </h5>
        <p class="text-slate-300 leading-relaxed">
          En la gramática recursiva izquierda original: <code>E → E + T</code>, la asociatividad por la izquierda se resolvía naturalmente de abajo hacia arriba mediante reducciones ascendentes (S-atribuida).
        </p>
        <p class="text-slate-300 leading-relaxed">
          Al eliminar la recursividad para permitir análisis descendente determinista (LL), la producción se convierte en <code>E → T E'</code> y <code>E' → + T E'<sub>1</sub> | ε</code>. El primer término evaluado es <code>T</code>, pero el resto de las sumas se derivan hacia la derecha en la cola recursiva. Para que la evaluación no invierta la asociatividad, el valor acumulado debe pasarse hacia abajo y hacia la derecha: esto da origen de forma obligatoria al <strong>atributo heredado <code>E'.her</code></strong>. Al llegar al final de la expresión (<code>E' → ε</code>), el acumulador se convierte en el <strong>atributo sintetizado <code>E'.sin</code></strong> que regresa el resultado a la raíz.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  eliminateLeftRecursion,
  parseArithmeticSdd,
  parseMultiplicationSdd,
  type LeftRecursionResult,
  type SddTreeResult,
  type SddNode,
  type SddAttributeRef,
  type DependencyEdge
} from '../../utils/sddParser';

// Pestaña activa
const activeTab = ref<'recursion' | 'trees' | 'steps' | 'theory'>('recursion');

// -------------------------------------------------------------
// ESTADO Y MÉTODOS: ELIMINADOR DE RECURSIVIDAD IZQUIERDA
// -------------------------------------------------------------
const recursionPresets = [
  {
    label: 'Diap. 39: E -> E + T { print(+) } | T',
    code: "E -> E + T { print('+'); } | T"
  },
  {
    label: 'Diap. 41: E + T | E - T | ( E ) | T',
    code: `E -> E + T | E - T | ( E ) | T\nT -> numero`
  },
  {
    label: 'Aritmética Estándar: E, T, F',
    code: `E -> E + T | T\nT -> T * F | F\nF -> ( E ) | digito`
  },
  {
    label: 'Secuencia de Sentencias: S -> S ; A | A',
    code: `S -> S ; A | A\nA -> id = E`
  },
  {
    label: 'Caso Genérico: A -> A a | A b | c | d',
    code: 'A -> A a | A b | c | d'
  }
];

const recursionInput = ref("E -> E + T { print('+'); } | T");
const recursionResult = ref<LeftRecursionResult>({
  items: [],
  allTransformedText: '',
  totalRecursive: 0
});
const copySuccess = ref(false);

function runElimination() {
  recursionResult.value = eliminateLeftRecursion(recursionInput.value);
}

function loadRecursionPreset(code: string) {
  recursionInput.value = code;
  runElimination();
}

function copyTransformed() {
  navigator.clipboard.writeText(recursionResult.value.allTransformedText);
  copySuccess.value = true;
  setTimeout(() => {
    copySuccess.value = false;
  }, 2000);
}

// -------------------------------------------------------------
// ESTADO Y MÉTODOS: ÁRBOLES ANOTADOS & GRAFOS DE DEPENDENCIA
// -------------------------------------------------------------
interface SddSample {
  label: string;
  type: 'arithmetic' | 'multiplication';
  expr: string;
}

const sddSamples: SddSample[] = [
  {
    label: '⭐ Diap. 28 & 34: (3 + 4) * (5 + 6)',
    type: 'arithmetic',
    expr: '(3 + 4) * (5 + 6)'
  },
  {
    label: '⭐ Diap. 28: (9 + 8 * (7 + 6) + 5) * 4',
    type: 'arithmetic',
    expr: '(9 + 8 * (7 + 6) + 5) * 4'
  },
  {
    label: '⭐ Diap. 24 & 25: 3 * 5 * 2 (valh)',
    type: 'multiplication',
    expr: '3 * 5 * 2'
  },
  {
    label: 'Básico: 2 + 3 * 4',
    type: 'arithmetic',
    expr: '2 + 3 * 4'
  },
  {
    label: 'Paréntesis: (2 + 3) * (4 + 5)',
    type: 'arithmetic',
    expr: '(2 + 3) * (4 + 5)'
  }
];

const currentSampleLabel = ref(sddSamples[0].label);
const currentGrammarType = ref<'arithmetic' | 'multiplication'>('arithmetic');
const expressionInput = ref('(3 + 4) * (5 + 6)');
const sddTreeData = ref<SddTreeResult | null>(null);
const sddError = ref<string | null>(null);
const selectedNode = ref<SddNode | null>(null);

// Filtros visuales
const showEdges = ref(true);
const filterSynthesizedOnly = ref(false);
const filterInheritedOnly = ref(false);
const zoomLevel = ref(1.0);

function onFilterSynthesized() {
  if (filterSynthesizedOnly.value) filterInheritedOnly.value = false;
}

function onFilterInherited() {
  if (filterInheritedOnly.value) filterSynthesizedOnly.value = false;
}

function zoomIn() {
  if (zoomLevel.value < 2.0) zoomLevel.value += 0.15;
}
function zoomOut() {
  if (zoomLevel.value > 0.4) zoomLevel.value -= 0.15;
}
function resetZoom() {
  zoomLevel.value = 1.0;
}

function evaluateSdd() {
  sddError.value = null;
  try {
    if (currentGrammarType.value === 'multiplication') {
      sddTreeData.value = parseMultiplicationSdd(expressionInput.value);
    } else {
      sddTreeData.value = parseArithmeticSdd(expressionInput.value);
    }
    selectedNode.value = sddTreeData.value.root;
    currentStepIdx.value = sddTreeData.value.stepsList.length - 1;
  } catch (err: any) {
    sddError.value = err?.message || 'Error al analizar la expresión con la DDS.';
  }
}

function loadSddSample(sample: SddSample) {
  currentSampleLabel.value = sample.label;
  currentGrammarType.value = sample.type;
  expressionInput.value = sample.expr;
  evaluateSdd();
}

const visibleEdges = computed(() => {
  if (!sddTreeData.value) return [];
  if (filterSynthesizedOnly.value) {
    return sddTreeData.value.edgesList.filter(e => e.edgeType === 'synthesized');
  }
  if (filterInheritedOnly.value) {
    return sddTreeData.value.edgesList.filter(e => e.edgeType === 'inherited');
  }
  return sddTreeData.value.edgesList;
});

const countInheritedAttrs = computed(() => {
  if (!sddTreeData.value) return 0;
  return sddTreeData.value.attributesList.filter(a => a.attrType === 'inherited').length;
});

const countSynthesizedAttrs = computed(() => {
  if (!sddTreeData.value) return 0;
  return sddTreeData.value.attributesList.filter(a => a.attrType === 'synthesized').length;
});

function computeCurvedPath(from: SddAttributeRef, to: SddAttributeRef): string {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const cx1 = from.x + dx * 0.25;
  const cy1 = from.y + dy * 0.5 - 25;
  const cx2 = to.x - dx * 0.25;
  const cy2 = to.y - dy * 0.5 - 25;
  return `M ${from.x} ${from.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${to.x} ${to.y}`;
}

function getAttrBadgeFill(type: 'inherited' | 'synthesized' | 'lexical'): string {
  if (type === 'inherited') return '#3b0764'; // purple-950
  if (type === 'synthesized') return '#022c22'; // emerald-950
  return '#451a03'; // amber-950
}

function getAttrBadgeStroke(type: 'inherited' | 'synthesized' | 'lexical'): string {
  if (type === 'inherited') return '#c084fc'; // purple-400
  if (type === 'synthesized') return '#34d399'; // emerald-400
  return '#f59e0b'; // amber-500
}

function getAttrTextColor(type: 'inherited' | 'synthesized' | 'lexical'): string {
  if (type === 'inherited') return '#e9d5ff'; // purple-200
  if (type === 'synthesized') return '#a7f3d0'; // emerald-200
  return '#fef3c7'; // amber-100
}

// -------------------------------------------------------------
// ESTADO Y MÉTODOS: PASO A PASO Y ORDEN TOPOLÓGICO
// -------------------------------------------------------------
const currentStepIdx = ref(0);
const isPlaying = ref(false);
let playTimer: any = null;

const currentStep = computed(() => {
  if (!sddTreeData.value || sddTreeData.value.stepsList.length === 0) return null;
  return sddTreeData.value.stepsList[currentStepIdx.value] || null;
});

function nextStep() {
  if (!sddTreeData.value) return;
  if (currentStepIdx.value < sddTreeData.value.stepsList.length - 1) {
    currentStepIdx.value++;
  } else {
    stopPlay();
  }
}

function prevStep() {
  if (currentStepIdx.value > 0) {
    currentStepIdx.value--;
  }
}

function togglePlay() {
  if (isPlaying.value) {
    stopPlay();
  } else {
    startPlay();
  }
}

function startPlay() {
  if (!sddTreeData.value) return;
  if (currentStepIdx.value >= sddTreeData.value.stepsList.length - 1) {
    currentStepIdx.value = 0;
  }
  isPlaying.value = true;
  playTimer = setInterval(() => {
    nextStep();
  }, 1200);
}

function stopPlay() {
  isPlaying.value = false;
  if (playTimer) {
    clearInterval(playTimer);
    playTimer = null;
  }
}

onMounted(() => {
  runElimination();
  evaluateSdd();
});
</script>
