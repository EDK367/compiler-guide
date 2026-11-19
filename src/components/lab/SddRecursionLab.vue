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
          Laboratorio de Recursividad Izquierda, Árboles Anotados & Grafos DDS
        </h3>
        <p class="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed max-w-4xl font-sans">
          Basado en la cátedra del <strong class="text-cyan-300">Ing. Mario Ramírez Tobar</strong> (<em class="text-slate-200">"Traducción Dirigida por la sintaxis y comprobación de tipos"</em>, pág. 1-705). Transforme gramáticas eliminando recursividad por la izquierda con acciones semánticas tratadas como terminales, y visualice árboles sintácticos anotados con grafos de dependencias para <strong>expresiones aritméticas</strong> y <strong>expresiones booleanas (AND, OR, NOT)</strong> con atributos sintetizados (<span class="text-emerald-400 font-bold">↑</span>) y heredados (<span class="text-purple-400 font-bold">↓</span>).
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
          <span>4. Tablas DDS & Teoría</span>
        </button>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- TAB 1: ELIMINADOR DE RECURSIVIDAD A LA IZQUIERDA -->
    <!-- ============================================================== -->
    <div v-if="activeTab === 'recursion'" class="space-y-6">
      <!-- Barra de Presets Oficiales del PDF -->
      <div class="bg-[#080d1a] p-3 rounded-2xl border border-slate-800 text-xs font-mono space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-cyan-400 font-bold">Banco de Gramáticas con Recursividad Izquierda:</span>
          <span class="text-[11px] text-slate-400">Seleccione un caso o escriba su propia gramática</span>
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
            rows="6"
            spellcheck="false"
            class="w-full bg-transparent p-4 font-mono text-sm text-cyan-200 leading-relaxed focus:outline-none resize-y selection:bg-cyan-500 selection:text-slate-950"
            placeholder="Ej: B -> B or T | T\nT -> T and F | F\nF -> not F | ( B ) | true | false"
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
      <!-- Selector de Categoría de Gramática -->
      <div class="flex flex-wrap items-center justify-between gap-3 bg-[#080d1a] p-3 rounded-2xl border border-slate-800 text-xs font-mono">
        <div class="flex items-center gap-2">
          <span class="text-slate-400 font-bold">Filtrar Ejercicios:</span>
          <div class="flex items-center gap-1.5">
            <button
              v-for="cat in ['todos', 'boolean', 'arithmetic', 'multiplication']"
              :key="cat"
              @click="selectedCategory = cat"
              :class="selectedCategory === cat ? 'bg-cyan-950 text-cyan-300 border-cyan-400 font-bold' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'"
              class="px-2.5 py-1 rounded-lg border text-xs capitalize transition cursor-pointer"
            >
              {{ cat === 'todos' ? 'Todos' : (cat === 'boolean' ? '🟢 Booleanos' : (cat === 'arithmetic' ? '🔢 Aritmética' : '✖️ Multiplicación')) }}
            </button>
          </div>
        </div>

        <div class="text-[11px] text-slate-400">
          Tipo actual: <span class="font-bold text-cyan-300 uppercase">{{ sddTreeData?.grammarType || currentGrammarType }}</span>
        </div>
      </div>

      <!-- Presets Filtrados -->
      <div class="flex flex-wrap items-center gap-2 bg-[#080d1a] p-3 rounded-2xl border border-slate-800 text-xs font-mono">
        <button
          v-for="(sample, idx) in filteredSamples"
          :key="idx"
          @click="loadSddSample(sample)"
          :class="currentSampleLabel === sample.label ? 'bg-cyan-950 text-cyan-300 border-cyan-400 font-bold shadow-sm' : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-cyan-300'"
          class="px-3 py-1.5 border rounded-xl transition cursor-pointer text-xs font-semibold"
        >
          {{ sample.label }}
        </button>
      </div>

      <!-- Barra de Entrada de Expresión -->
      <div class="space-y-1">
        <div class="flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Escriba una expresión booleana (<code>true</code>, <code>false</code>, <code>and</code>, <code>or</code>, <code>not</code>) o aritmética (<code>+</code>, <code>*</code>, <code>()</code>):</span>
          <span class="text-cyan-400">Detección automática de gramática activada</span>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <div class="flex-1 min-w-[240px] relative">
            <input
              v-model="expressionInput"
              @keydown.enter="evaluateSdd"
              type="text"
              class="w-full bg-[#080d1a] border border-slate-700/80 rounded-xl px-4 py-2.5 font-mono text-sm text-cyan-200 focus:outline-none focus:border-cyan-400 transition"
              placeholder="Ej: true and (false or not false) o (3 + 4) * (5 + 6)"
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
      </div>

      <!-- Error si la expresión no es válida -->
      <div v-if="sddError" class="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-rose-300 text-xs font-mono flex items-center gap-2">
        <span>⚠️</span>
        <span>{{ sddError }}</span>
      </div>

      <!-- Tarjeta de Gramática Utilizada (con Recursividad a la Izquierda ya Eliminada) -->
      <div v-if="sddTreeData" class="p-4 bg-gradient-to-r from-slate-900 via-[#0a1428] to-slate-900 rounded-2xl border border-cyan-500/40 shadow-lg space-y-3 font-mono text-xs">
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span class="text-sm font-bold text-white uppercase tracking-wider">
              Gramática Utilizada (con Recursividad a la Izquierda ya Eliminada)
            </span>
          </div>
          <span class="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold">
            {{ activeTransformedGrammar.badge }}
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Columna 1: Reglas Sintácticas Transformadas -->
          <div class="bg-[#060a14] p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                Reglas Equivalentes Transformadas:
              </span>
              <span class="text-[10px] text-emerald-400 font-bold">✓ Lista para LL(1)</span>
            </div>
            <div class="space-y-1 font-bold text-emerald-300 text-xs">
              <div v-for="(rule, ridx) in activeTransformedGrammar.transformed" :key="ridx" class="py-0.5 px-2 bg-slate-950/60 rounded border border-emerald-950/40">
                {{ rule }}
              </div>
            </div>
          </div>

          <!-- Columna 2: Reglas Semánticas y Atributos SDD -->
          <div class="bg-[#060a14] p-3.5 rounded-xl border border-slate-800 space-y-2">
            <span class="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">
              Esquema de Atributos Semánticos Asociados (SDD):
            </span>
            <div class="space-y-1.5 font-sans text-[11px]">
              <div
                v-for="(info, iidx) in activeTransformedGrammar.attrDetails"
                :key="iidx"
                class="p-2 rounded-lg bg-slate-950/50 border border-slate-800/80 flex items-start gap-2"
              >
                <span class="font-mono font-bold text-xs" :class="info.color">{{ info.icon }}</span>
                <div>
                  <span class="font-bold font-mono" :class="info.color">{{ info.title }}</span>:
                  <span class="text-slate-300 ml-1">{{ info.desc }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Píldora de Criterio: Diferencia entre .val y .sin -->
        <div class="p-3 bg-[#060a14] rounded-xl border border-cyan-500/30 text-[11px] font-sans flex flex-wrap items-center justify-between gap-2 text-slate-300">
          <div class="flex items-center gap-2">
            <span class="text-amber-400 font-bold">💡 Distinción Clave:</span>
            <span>
              <strong class="text-emerald-400 font-mono">.val</strong> es la meta semántica final del no-terminal primario (<code>E.val, B.val, T.val</code>).
              <strong class="text-cyan-400 font-mono ml-2">.sin</strong> es el retorno del acumulador en la cola recursiva (<code>E'.sin, B'.sin</code>) que asciende al llegar a <code class="text-slate-200">ε</code> para entregarlo a <code>E.val = E'.sin</code>.
            </span>
          </div>
          <span class="text-[10px] text-purple-300 font-mono">.her acumula hacia la derecha ➔</span>
        </div>
      </div>

      <!-- Resumen Estadístico y Leyenda de Atributos -->
      <div v-if="sddTreeData" class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div class="p-3 bg-[#0a1224] rounded-xl border border-cyan-500/40 space-y-1">
          <span class="text-slate-400 uppercase text-[10px] block font-bold">Resultado Semántico Final</span>
          <div
            class="text-xl sm:text-2xl font-black"
            :class="typeof sddTreeData.finalResult === 'boolean' ? (sddTreeData.finalResult ? 'text-emerald-400' : 'text-rose-400') : 'text-cyan-300'"
          >
            {{ formatResultValue(sddTreeData.finalResult) }}
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
          <button @click="zoomOut" class="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold transition cursor-pointer">-</button>
          <span class="w-12 text-center text-cyan-300 font-bold">{{ Math.round(zoomLevel * 100) }}%</span>
          <button @click="zoomIn" class="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold transition cursor-pointer">+</button>
          <button @click="resetZoom" class="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 text-[11px] transition cursor-pointer">Reset</button>
        </div>
      </div>

      <!-- Lienzo SVG Interactivo: Árbol Anotado + Grafo de Dependencias -->
      <div v-if="sddTreeData" class="relative rounded-3xl border border-slate-800 bg-[#060a14] overflow-hidden shadow-2xl min-h-[500px]">
        <div class="overflow-auto max-h-[680px] p-4 cursor-grab active:cursor-grabbing">
          <svg
            :width="sddTreeData.svgWidth * zoomLevel"
            :height="sddTreeData.svgHeight * zoomLevel"
            :viewBox="`0 0 ${sddTreeData.svgWidth} ${sddTreeData.svgHeight}`"
            class="transition-all duration-150 select-none mx-auto block"
          >
            <defs>
              <!-- Flecha para ramas de derivación sintáctica (Padre -> Hijo) -->
              <marker
                id="arrow-branch"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto"
              >
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#64748b" />
              </marker>

              <!-- Flecha para dependencias sintetizadas (Cyan/Emerald) -->
              <marker
                id="arrow-cyan"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto"
              >
                <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#22d3ee" stroke="#0891b2" stroke-width="0.8" />
              </marker>

              <!-- Flecha para dependencias heredadas (Purple/Pink) -->
              <marker
                id="arrow-purple"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto"
              >
                <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#c084fc" stroke="#7e22ce" stroke-width="0.8" />
              </marker>
            </defs>

            <!-- 1. RAMAS DEL ÁRBOL SINTÁCTICO (Conectores Padre -> Hijos con Flechas Direccionales) -->
            <g class="tree-branches">
              <template v-for="node in sddTreeData.nodesList" :key="'branches-' + node.id">
                <line
                  v-for="child in node.children"
                  :key="'line-' + node.id + '-' + child.id"
                  :x1="computeBranchLine(node, child).x1"
                  :y1="computeBranchLine(node, child).y1"
                  :x2="computeBranchLine(node, child).x2"
                  :y2="computeBranchLine(node, child).y2"
                  stroke="#475569"
                  stroke-width="1.8"
                  stroke-dasharray="3,3"
                  marker-end="url(#arrow-branch)"
                />
              </template>
            </g>

            <!-- 2. NODOS DEL ÁRBOL SINTÁCTICO (Estacionarios al pasar el mouse, sin desplazamiento) -->
            <g class="tree-nodes">
              <template v-for="node in sddTreeData.nodesList" :key="'node-' + node.id">
                <!-- Cápsula del nodo sintáctico -->
                <g
                  @click="selectedNode = node"
                  class="cursor-pointer group"
                >
                  <!-- Círculo base del símbolo (sin scale-110 para evitar movimiento brusco) -->
                  <circle
                    :cx="node.x"
                    :cy="node.y"
                    :r="node.isTerminal ? 16 : 22"
                    :fill="node.isTerminal ? '#0f172a' : '#1e1b4b'"
                    :stroke="selectedNode?.id === node.id ? '#38bdf8' : (node.isTerminal ? '#64748b' : '#818cf8')"
                    :stroke-width="selectedNode?.id === node.id ? 3.5 : 2"
                    class="transition-colors duration-150 group-hover:stroke-cyan-300"
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

            <!-- 3. PASTILLAS DE ATRIBUTOS ANOTADOS EN CADA NODO -->
            <g class="attribute-badges">
              <template v-for="attr in sddTreeData.attributesList" :key="'attr-' + attr.nodeId + '-' + attr.attrName">
                <g class="cursor-pointer group">
                  <!-- Fondo de la píldora de atributo (ancho 74px para que quepa true/false) -->
                  <rect
                    :x="attr.x - 37"
                    :y="attr.y - 10"
                    width="74"
                    height="20"
                    rx="8"
                    :fill="getAttrBadgeFill(attr.attrType)"
                    :stroke="getAttrBadgeStroke(attr.attrType)"
                    stroke-width="1.2"
                    class="transition-all duration-150 group-hover:stroke-width-2"
                  />
                  <!-- Texto del atributo y valor: ej her=true o val=77 -->
                  <text
                    :x="attr.x"
                    :y="attr.y + 3.5"
                    text-anchor="middle"
                    font-size="9px"
                    font-family="monospace"
                    font-weight="bold"
                    :fill="getAttrTextColor(attr)"
                    pointer-events="none"
                  >
                    {{ attr.attrName }}={{ formatAttrVal(attr.value) }}
                  </text>
                </g>
              </template>
            </g>

            <!-- 4. ARISTAS DEL GRAFO DE DEPENDENCIAS ENTRE ATRIBUTOS (CON FLECHAS DIRECCIONALES) -->
            <g v-if="showEdges" class="dependency-edges">
              <template v-for="edge in visibleEdges" :key="edge.id">
                <path
                  :d="computeCurvedPath(edge.from, edge.to)"
                  :stroke="edge.edgeType === 'inherited' ? '#c084fc' : '#22d3ee'"
                  :marker-end="edge.edgeType === 'inherited' ? 'url(#arrow-purple)' : 'url(#arrow-cyan)'"
                  stroke-width="2.5"
                  fill="none"
                  stroke-opacity="0.9"
                  class="transition-all hover:stroke-width-4 hover:stroke-opacity-100"
                >
                  <title>{{ edge.ruleDesc }} ({{ edge.from.nodeSym }}#{{ edge.from.nodeId }}.{{ edge.from.attrName }} ➔ {{ edge.to.nodeSym }}#{{ edge.to.nodeId }}.{{ edge.to.attrName }})</title>
                </path>
              </template>
            </g>
          </svg>
        </div>
      </div>

      <!-- Leyenda de Atributos y Guía de Uso de .val vs .sin vs .her (Ubicada fuera del árbol en la parte inferior) -->
      <div v-if="sddTreeData" class="space-y-4">
        <!-- Leyenda Clásica de Tipos de Flujo -->
        <div class="bg-[#080d1a] p-4 rounded-2xl border border-slate-800 font-mono text-xs space-y-2.5 shadow-lg">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
            <div class="flex items-center gap-2 text-cyan-300 font-bold">
              <span class="text-base">🏷️</span>
              <span class="text-xs uppercase tracking-wider">Leyenda de Tipos de Atributos y Flujo Semántico</span>
            </div>
            <span class="text-[11px] text-slate-400">
              {{ activeTransformedGrammar.title }}
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="p-3 bg-purple-950/30 rounded-xl border border-purple-500/40 space-y-1">
              <div class="flex items-center gap-2 text-purple-300 font-bold">
                <span class="w-3 h-3 rounded-full bg-purple-400 inline-block shadow-[0_0_8px_rgba(192,132,252,0.8)]"></span>
                <span>Heredado (.her / .valh)</span>
              </div>
              <p class="text-slate-300 text-[11px] leading-relaxed font-sans">
                <strong>Flujo lateral / descendente:</strong> Las flechas moradas (<span class="text-purple-400 font-bold">➔</span>) indican el paso de valores acumulados hacia la derecha o hacia abajo. Obligatorio al eliminar recursividad izquierda.
              </p>
            </div>

            <div class="p-3 bg-emerald-950/30 rounded-xl border border-emerald-500/40 space-y-1">
              <div class="flex items-center gap-2 text-emerald-300 font-bold">
                <span class="w-3 h-3 rounded-full bg-emerald-400 inline-block shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                <span>Sintetizado (.sin / .val / .total)</span>
              </div>
              <p class="text-slate-300 text-[11px] leading-relaxed font-sans">
                <strong>Flujo ascendente:</strong> Las flechas cian (<span class="text-cyan-400 font-bold">➔</span>) indican subida de resultados computados desde los hijos hacia el nodo padre (post-orden) hasta retornar el resultado a la raíz.
              </p>
            </div>

            <div class="p-3 bg-amber-950/30 rounded-xl border border-amber-500/40 space-y-1">
              <div class="flex items-center gap-2 text-amber-300 font-bold">
                <span class="w-3 h-3 rounded-full bg-amber-400 inline-block shadow-[0_0_8px_rgba(245,158,11,0.8)]"></span>
                <span>Léxico / Terminal (.valex / .val)</span>
              </div>
              <p class="text-slate-300 text-[11px] leading-relaxed font-sans">
                <strong>Constante literal de token:</strong> Obtenido directamente del escáner léxico (números enteros, identificadores o booleanos <code>true</code> / <code>false</code>).
              </p>
            </div>
          </div>
        </div>

        <!-- Guía Canónica de Nomenclatura: Cuándo usar .val vs .sin vs .her vs .valex -->
        <div class="p-4 sm:p-5 bg-[#0a1224] rounded-2xl border border-cyan-500/40 font-mono text-xs space-y-3 shadow-xl">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
            <div class="flex items-center gap-2 font-bold text-cyan-300">
              <span class="text-base">🎓</span>
              <span class="text-xs uppercase tracking-wider">Criterio Ramírez Tobar: ¿Cuándo usar .val, .sin, .her o .valex?</span>
            </div>
            <span class="text-[11px] text-slate-400">Guía para el Estudiante de Compiladores</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-sans">
            <div class="p-3 bg-emerald-950/30 rounded-xl border border-emerald-500/40 space-y-1.5">
              <div class="flex items-center gap-2 font-mono font-bold text-emerald-300">
                <span class="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px]">↑ SINTETIZADO</span>
                <span>.val</span>
              </div>
              <p class="text-slate-300 text-[11px] leading-relaxed">
                <strong>¿Cuándo usarlo?</strong> En los no-terminales sintácticos <strong>principales</strong> (<code>E.val, T.val, F.val, B.val, L.val</code>).
              </p>
              <p class="text-slate-400 text-[10px] leading-relaxed">
                <strong>Propósito:</strong> Es la meta final del cálculo. Sube desde los hijos hacia el padre (post-orden) para retornar el resultado semántico evaluado de toda esa regla.
              </p>
            </div>

            <div class="p-3 bg-cyan-950/30 rounded-xl border border-cyan-500/40 space-y-1.5">
              <div class="flex items-center gap-2 font-mono font-bold text-cyan-300">
                <span class="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px]">↑ SINTETIZADO</span>
                <span>.sin</span>
              </div>
              <p class="text-slate-300 text-[11px] leading-relaxed">
                <strong>¿Cuándo usarlo?</strong> <em>Exclusivamente</em> en no-terminales <strong>auxiliares de cola</strong> (<code>E'.sin, T'.sin, B'.sin</code>) creados al eliminar recursividad izquierda.
              </p>
              <p class="text-slate-400 text-[10px] leading-relaxed">
                <strong>¿Por qué no .val?</strong> Porque <code>E'</code> tiene dos flujos opuestos: recibe el acumulador en <code>E'.her</code> y, al llegar a ε (<code>E'.sin = E'.her</code>), <strong>sintetiza hacia arriba</strong> el total acumulado para entregárselo a <code>E.val = E'.sin</code> sin colisión de nombres.
              </p>
            </div>

            <div class="p-3 bg-purple-950/30 rounded-xl border border-purple-500/40 space-y-1.5">
              <div class="flex items-center gap-2 font-mono font-bold text-purple-300">
                <span class="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40 text-[10px]">↓ HEREDADO</span>
                <span>.her / .valh</span>
              </div>
              <p class="text-slate-300 text-[11px] leading-relaxed">
                <strong>¿Cuándo usarlo?</strong> Cuando un nodo necesita un valor que proviene de su <strong>izquierda</strong> o de su <strong>padre</strong> (contexto o acumulador).
              </p>
              <p class="text-slate-400 text-[10px] leading-relaxed">
                <strong>Ejemplos:</strong> Acumulador de sumas/productos (<code>E'.her, T'.valh</code>) o propagación del tipo de datos en declaraciones (<code>L.her = T.tipo</code>). <em>Nunca puede ser el atributo raíz</em>.
              </p>
            </div>

            <div class="p-3 bg-amber-950/30 rounded-xl border border-amber-500/40 space-y-1.5">
              <div class="flex items-center gap-2 font-mono font-bold text-amber-300">
                <span class="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40 text-[10px]">🏷️ LÉXICO</span>
                <span>.valex / .val</span>
              </div>
              <p class="text-slate-300 text-[11px] leading-relaxed">
                <strong>¿Cuándo usarlo?</strong> En los <strong>símbolos terminales / hojas</strong> del árbol léxico (<code>digito.valex, num.val, true, false</code>).
              </p>
              <p class="text-slate-400 text-[10px] leading-relaxed">
                <strong>Propósito:</strong> No se calcula mediante fórmulas gramaticales; es el valor constante entregado por el escáner del compilador.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel Inspector del Nodo Seleccionado -->
      <div v-if="selectedNode" class="p-4 bg-[#0a1224] rounded-2xl border border-cyan-500/40 text-xs font-mono space-y-2">
        <div class="flex items-center justify-between border-b border-slate-800 pb-2">
          <span class="text-cyan-300 font-bold text-sm">
            Inspector de Nodo: <span class="text-white">{{ selectedNode.sym }} (Nodo #{{ selectedNode.id }})</span>
          </span>
          <button @click="selectedNode = null" class="text-slate-400 hover:text-white cursor-pointer">✕ Cerrar</button>
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
                <strong>{{ name }}</strong> = <span :class="typeof val === 'boolean' ? (val ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold') : 'text-white'">{{ String(val) }}</span>
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
        <!-- Tarjeta de Gramática Utilizada arriba de los Pasos (DDS) -->
        <div class="p-4 bg-gradient-to-r from-slate-900 via-[#0a1428] to-slate-900 rounded-2xl border border-cyan-500/40 shadow-lg space-y-3 font-mono text-xs">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span class="text-sm font-bold text-white uppercase tracking-wider">
                Gramática Utilizada en la Evaluación Topológica (Sin Recursividad Izquierda)
              </span>
            </div>
            <span class="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold">
              {{ activeTransformedGrammar.badge }}
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-[#060a14] p-3 rounded-xl border border-slate-800 space-y-1">
              <span class="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Reglas Transformadas:</span>
              <div class="space-y-0.5 font-bold text-emerald-300 text-xs">
                <div v-for="(rule, ridx) in activeTransformedGrammar.transformed" :key="ridx">
                  {{ rule }}
                </div>
              </div>
            </div>
            <div class="bg-[#060a14] p-3 rounded-xl border border-slate-800 space-y-1">
              <span class="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Orden de Evaluación:</span>
              <p class="text-slate-300 text-[11px] leading-relaxed font-sans">
                Las reglas se evalúan estrictamente conforme a las aristas dirigidas del Grafo de Dependencias (DAG). Primero se resuelven las hojas léxicas, luego se propagan los atributos heredados hacia la derecha/abajo y finalmente los sintetizados ascienden hacia la raíz.
              </p>
            </div>
          </div>

          <!-- Píldora de Criterio: Diferencia entre .val y .sin -->
          <div class="p-3 bg-[#060a14] rounded-xl border border-cyan-500/30 text-[11px] font-sans flex flex-wrap items-center justify-between gap-2 text-slate-300">
            <div class="flex items-center gap-2">
              <span class="text-amber-400 font-bold">💡 Distinción Clave:</span>
              <span>
                <strong class="text-emerald-400 font-mono">.val</strong> es la meta semántica final del no-terminal primario (<code>E.val, B.val</code>).
                <strong class="text-cyan-400 font-mono ml-2">.sin</strong> es el retorno del acumulador en la cola recursiva (<code>E'.sin, B'.sin</code>) que asciende al llegar a <code class="text-slate-200">ε</code> para entregarlo a <code>E.val = E'.sin</code>.
              </span>
            </div>
            <span class="text-[10px] text-purple-300 font-mono">.her acumula hacia la derecha ➔</span>
          </div>
        </div>
        <!-- Barra de Reproducción y Control de Pasos -->
        <div class="flex flex-wrap items-center justify-between gap-4 bg-[#080d1a] p-4 rounded-2xl border border-slate-800 text-xs font-mono">
          <div class="flex items-center gap-3">
            <span class="text-slate-300 font-bold">
              Paso {{ currentStepIdx + 1 }} de {{ sddTreeData.stepsList.length }}
            </span>
            <span class="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold">
              Orden Topológico Formal (DAG)
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
                {{ currentStep.calculationStr }} = <span :class="typeof currentStep.value === 'boolean' ? (currentStep.value ? 'text-emerald-400 underline font-extrabold' : 'text-rose-400 underline font-extrabold') : 'text-white underline font-extrabold'">{{ String(currentStep.value) }}</span>
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
                  <td class="p-3 font-bold" :class="typeof st.value === 'boolean' ? (st.value ? 'text-emerald-400' : 'text-rose-400') : 'text-cyan-300'">
                    {{ String(st.value) }}
                  </td>
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
      <!-- Selector de Tabla Teórica (7 Especificaciones DDS) -->
      <div class="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3 font-mono text-xs">
        <span class="text-slate-400 font-bold mr-1">Especificación DDS:</span>
        <button
          @click="theoryTableTab = 'arithmetic'"
          :class="theoryTableTab === 'arithmetic' ? 'bg-cyan-950 text-cyan-300 border-cyan-400 font-bold shadow-sm' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'"
          class="px-3 py-1.5 rounded-xl border transition cursor-pointer"
        >
          🔢 1. Aritmética (Diap. 31)
        </button>
        <button
          @click="theoryTableTab = 'boolean'"
          :class="theoryTableTab === 'boolean' ? 'bg-emerald-950 text-emerald-300 border-emerald-400 font-bold shadow-sm' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'"
          class="px-3 py-1.5 rounded-xl border transition cursor-pointer"
        >
          🟢 2. Booleana (OR, AND, NOT)
        </button>
        <button
          @click="theoryTableTab = 'multiplication'"
          :class="theoryTableTab === 'multiplication' ? 'bg-purple-950 text-purple-300 border-purple-400 font-bold shadow-sm' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'"
          class="px-3 py-1.5 rounded-xl border transition cursor-pointer"
        >
          ✖️ 3. Multiplicación valh (Diap. 24)
        </button>
        <button
          @click="theoryTableTab = 'typeChecking'"
          :class="theoryTableTab === 'typeChecking' ? 'bg-sky-950 text-sky-300 border-sky-400 font-bold shadow-sm' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'"
          class="px-3 py-1.5 rounded-xl border transition cursor-pointer"
        >
          🏷️ 4. Propagación de Tipos (Diap. 4)
        </button>
        <button
          @click="theoryTableTab = 'astBuilding'"
          :class="theoryTableTab === 'astBuilding' ? 'bg-indigo-950 text-indigo-300 border-indigo-400 font-bold shadow-sm' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'"
          class="px-3 py-1.5 rounded-xl border transition cursor-pointer"
        >
          🌲 5. Construcción de AST (Diap. 43-48)
        </button>
        <button
          @click="theoryTableTab = 'postfixSDT'"
          :class="theoryTableTab === 'postfixSDT' ? 'bg-amber-950 text-amber-300 border-amber-400 font-bold shadow-sm' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'"
          class="px-3 py-1.5 rounded-xl border transition cursor-pointer"
        >
          ⚙️ 6. Postfijo & C3D (SDT)
        </button>
        <button
          @click="theoryTableTab = 'circularDAG'"
          :class="theoryTableTab === 'circularDAG' ? 'bg-rose-950 text-rose-300 border-rose-400 font-bold shadow-sm' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'"
          class="px-3 py-1.5 rounded-xl border transition cursor-pointer"
        >
          🔄 7. Ciclos Semánticos vs DAGs
        </button>
      </div>

      <!-- ============================================================== -->
      <!-- TABLA 1: ARITMÉTICA OFICIAL DIAP. 31 -->
      <!-- ============================================================== -->
      <div v-if="theoryTableTab === 'arithmetic'" class="space-y-4">
        <!-- Gramática Utilizada arriba de la tabla -->
        <div class="p-4 bg-[#080d1a] border border-cyan-500/40 rounded-2xl space-y-2 font-mono text-xs shadow-inner">
          <div class="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span class="text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-2">
              <span>📐</span>
              <span>Gramática Aritmética: Original vs Transformada sin Recursividad Izquierda</span>
            </span>
            <span class="text-[10px] text-slate-400">Diapositivas 31 & 34 del PDF</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div class="bg-[#060a14] p-2.5 rounded-xl border border-slate-800 space-y-1">
              <span class="text-rose-400 font-bold text-[10px] uppercase">Original (Recursiva Izquierda):</span>
              <pre class="text-slate-300 leading-tight">E -> E + T | T
T -> T * F | F
F -> ( E ) | digito</pre>
            </div>
            <div class="bg-[#060a14] p-2.5 rounded-xl border border-emerald-500/30 space-y-1">
              <span class="text-emerald-400 font-bold text-[10px] uppercase">Transformada (Sin Recursividad Izquierda - LL(1)):</span>
              <pre class="text-emerald-300 leading-tight">L -> E
E -> T E'      E' -> + T E' | ε
T -> F T'      T' -> * F T' | ε
F -> ( E ) | digito</pre>
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-slate-800 bg-[#080d1a] overflow-hidden">
          <table class="w-full text-left font-mono text-xs">
            <thead class="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px] uppercase">
              <tr>
                <th class="p-3">#</th>
                <th class="p-3">Producción</th>
                <th class="p-3">Reglas Semánticas Asociadas</th>
                <th class="p-3">Tipo de Atributos</th>
                <th class="p-3">Rol en el Compilador</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/80 text-slate-300">
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-cyan-400">1</td>
                <td class="p-3 text-white font-bold">L → E</td>
                <td class="p-3 text-emerald-300">L.val = E.val</td>
                <td class="p-3 text-emerald-400">↑ Sintetizado</td>
                <td class="p-3 text-slate-400 font-sans">Retorna el valor numérico total de la expresión calculada a la raíz.</td>
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
                <td class="p-3 text-slate-400 font-sans">Inicializa el acumulador aditivo de <code>E'</code> con el valor del término <code>T</code>.</td>
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
                <td class="p-3 text-slate-400 font-sans">Efectúa la suma acumulada de izquierda a derecha y la transfiere al siguiente <code>E'<sub>1</sub></code>.</td>
              </tr>
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-cyan-400">4</td>
                <td class="p-3 text-white font-bold">E' → ε</td>
                <td class="p-3 text-emerald-300">E'.sin = E'.her</td>
                <td class="p-3 text-emerald-400">↑ Sintetizado desde Her.</td>
                <td class="p-3 text-slate-400 font-sans">Al alcanzar el fin de la cadena, el acumulador heredado se convierte en el sintetizado <code>.sin</code>.</td>
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
                <td class="p-3 text-slate-400 font-sans">Inicializa el acumulador multiplicativo de <code>T'</code> con el valor del factor <code>F</code>.</td>
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
                <td class="p-3 text-slate-400 font-sans">Efectúa el producto acumulado respetando la mayor precedencia del operador <code>*</code> sobre <code>+</code>.</td>
              </tr>
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-cyan-400">7</td>
                <td class="p-3 text-white font-bold">T' → ε</td>
                <td class="p-3 text-emerald-300">T'.sin = T'.her</td>
                <td class="p-3 text-emerald-400">↑ Sintetizado desde Her.</td>
                <td class="p-3 text-slate-400 font-sans">Caso base multiplicativo: transfiere el producto total hacia <code>T.val</code>.</td>
              </tr>
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-cyan-400">8</td>
                <td class="p-3 text-white font-bold">F → ( E )</td>
                <td class="p-3 text-emerald-300">F.val = E.val</td>
                <td class="p-3 text-emerald-400">↑ Sintetizado</td>
                <td class="p-3 text-slate-400 font-sans">Aislamiento de subexpresiones: propaga el resultado del paréntesis hacia arriba sin alterar operadores externos.</td>
              </tr>
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-cyan-400">9</td>
                <td class="p-3 text-white font-bold">F → digito</td>
                <td class="p-3 text-emerald-300">F.val = digito.valex</td>
                <td class="p-3 text-emerald-400">↑ Sintetizado desde Léx.</td>
                <td class="p-3 text-slate-400 font-sans">Lee el valor numérico literal entregado por el escáner léxico.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ============================================================== -->
      <!-- TABLA 2: LÓGICA BOOLEANA (OR, AND, NOT, TRUE, FALSE) -->
      <!-- ============================================================== -->
      <div v-if="theoryTableTab === 'boolean'" class="space-y-4">
        <!-- Gramática Utilizada arriba de la tabla -->
        <div class="p-4 bg-[#080d1a] border border-emerald-500/40 rounded-2xl space-y-2 font-mono text-xs shadow-inner">
          <div class="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span class="text-emerald-300 font-bold uppercase tracking-wider flex items-center gap-2">
              <span>📐</span>
              <span>Gramática Booleana: Original vs Transformada sin Recursividad Izquierda</span>
            </span>
            <span class="text-[10px] text-slate-400">Precedencia estricta: NOT > AND > OR</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div class="bg-[#060a14] p-2.5 rounded-xl border border-slate-800 space-y-1">
              <span class="text-rose-400 font-bold text-[10px] uppercase">Original (Recursiva Izquierda):</span>
              <pre class="text-slate-300 leading-tight">B -> B or T | T
T -> T and F | F
F -> not F | ( B ) | true | false</pre>
            </div>
            <div class="bg-[#060a14] p-2.5 rounded-xl border border-emerald-500/30 space-y-1">
              <span class="text-emerald-400 font-bold text-[10px] uppercase">Transformada (Sin Recursividad Izquierda - LL(1)):</span>
              <pre class="text-emerald-300 leading-tight">L -> B
B -> T B'      B' -> or T B' | ε
T -> F T'      T' -> and F T' | ε
F -> not F | ( B ) | true | false</pre>
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-slate-800 bg-[#080d1a] overflow-hidden">
          <table class="w-full text-left font-mono text-xs">
            <thead class="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px] uppercase">
              <tr>
                <th class="p-3">#</th>
                <th class="p-3">Producción</th>
                <th class="p-3">Reglas Semánticas Asociadas</th>
                <th class="p-3">Tipo de Atributos</th>
                <th class="p-3">Rol en el Compilador</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/80 text-slate-300">
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-emerald-400">1</td>
                <td class="p-3 text-white font-bold">L → B</td>
                <td class="p-3 text-emerald-300">L.val = B.val</td>
                <td class="p-3 text-emerald-400">↑ Sintetizado</td>
                <td class="p-3 text-slate-400 font-sans">Retorna el valor booleano resultante (<code>true</code> / <code>false</code>) a la raíz del árbol.</td>
              </tr>
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-emerald-400">2</td>
                <td class="p-3 text-white font-bold">B → T B'</td>
                <td class="p-3 space-y-1">
                  <div class="text-purple-300">B'.her = T.val</div>
                  <div class="text-emerald-300">B.val = B'.sin</div>
                </td>
                <td class="p-3 space-y-1">
                  <div class="text-purple-400">↓ Heredado</div>
                  <div class="text-emerald-400">↑ Sintetizado</div>
                </td>
                <td class="p-3 text-slate-400 font-sans">Pasa el valor del primer término conjuntivo <code>T</code> al acumulador disyuntivo <code>B'.her</code>.</td>
              </tr>
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-emerald-400">3</td>
                <td class="p-3 text-white font-bold">B' → or T B'<sub>1</sub></td>
                <td class="p-3 space-y-1">
                  <div class="text-purple-300">B'<sub>1</sub>.her = B'.her || T.val</div>
                  <div class="text-emerald-300">B'.sin = B'<sub>1</sub>.sin</div>
                </td>
                <td class="p-3 space-y-1">
                  <div class="text-purple-400">↓ Heredado</div>
                  <div class="text-emerald-400">↑ Sintetizado</div>
                </td>
                <td class="p-3 text-slate-400 font-sans">Aplica disyunción booleana acumulada de izquierda a derecha y transfiere el resultado a <code>B'<sub>1</sub></code>.</td>
              </tr>
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-emerald-400">4</td>
                <td class="p-3 text-white font-bold">B' → ε</td>
                <td class="p-3 text-emerald-300">B'.sin = B'.her</td>
                <td class="p-3 text-emerald-400">↑ Sintetizado desde Her.</td>
                <td class="p-3 text-slate-400 font-sans">Finaliza la cadena de <code>or</code>; eleva el valor booleano final acumulado hacia <code>B.val</code>.</td>
              </tr>
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-emerald-400">5</td>
                <td class="p-3 text-white font-bold">T → F T'</td>
                <td class="p-3 space-y-1">
                  <div class="text-purple-300">T'.her = F.val</div>
                  <div class="text-emerald-300">T.val = T'.sin</div>
                </td>
                <td class="p-3 space-y-1">
                  <div class="text-purple-400">↓ Heredado</div>
                  <div class="text-emerald-400">↑ Sintetizado</div>
                </td>
                <td class="p-3 text-slate-400 font-sans">Inicializa el acumulador conjuntivo de <code>T'</code> con el valor lógico del factor <code>F</code>.</td>
              </tr>
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-emerald-400">6</td>
                <td class="p-3 text-white font-bold">T' → and F T'<sub>1</sub></td>
                <td class="p-3 space-y-1">
                  <div class="text-purple-300">T'<sub>1</sub>.her = T'.her &amp;&amp; F.val</div>
                  <div class="text-emerald-300">T'.sin = T'<sub>1</sub>.sin</div>
                </td>
                <td class="p-3 space-y-1">
                  <div class="text-purple-400">↓ Heredado</div>
                  <div class="text-emerald-400">↑ Sintetizado</div>
                </td>
                <td class="p-3 text-slate-400 font-sans">Aplica conjunción booleana (<code>and</code>) respetando su mayor precedencia frente a <code>or</code>.</td>
              </tr>
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-emerald-400">7</td>
                <td class="p-3 text-white font-bold">T' → ε</td>
                <td class="p-3 text-emerald-300">T'.sin = T'.her</td>
                <td class="p-3 text-emerald-400">↑ Sintetizado desde Her.</td>
                <td class="p-3 text-slate-400 font-sans">Fin de la cadena de <code>and</code>; eleva el resultado hacia <code>T.val</code>.</td>
              </tr>
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-emerald-400">8</td>
                <td class="p-3 text-white font-bold">F → not F<sub>1</sub></td>
                <td class="p-3 text-emerald-300">F.val = !F<sub>1</sub>.val</td>
                <td class="p-3 text-emerald-400">↑ Sintetizado (Inversión)</td>
                <td class="p-3 text-slate-400 font-sans">Operador unario de mayor precedencia: invierte el valor de verdad de <code>F<sub>1</sub></code>.</td>
              </tr>
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-emerald-400">9</td>
                <td class="p-3 text-white font-bold">F → ( B )</td>
                <td class="p-3 text-emerald-300">F.val = B.val</td>
                <td class="p-3 text-emerald-400">↑ Sintetizado</td>
                <td class="p-3 text-slate-400 font-sans">Paréntesis: encapsula y evalúa con máxima prioridad la subexpresión booleana completa.</td>
              </tr>
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-emerald-400">10</td>
                <td class="p-3 text-white font-bold">F → true</td>
                <td class="p-3 text-emerald-300">F.val = true</td>
                <td class="p-3 text-amber-400">Constante Léxica</td>
                <td class="p-3 text-slate-400 font-sans">Literal booleano verdadero provisto por el analizador léxico.</td>
              </tr>
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-emerald-400">11</td>
                <td class="p-3 text-white font-bold">F → false</td>
                <td class="p-3 text-rose-300">F.val = false</td>
                <td class="p-3 text-amber-400">Constante Léxica</td>
                <td class="p-3 text-slate-400 font-sans">Literal booleano falso provisto por el analizador léxico.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ============================================================== -->
      <!-- TABLA 3: MULTIPLICACIÓN VALH (DIAP. 24 & 25) -->
      <!-- ============================================================== -->
      <div v-if="theoryTableTab === 'multiplication'" class="space-y-4">
        <!-- Gramática Utilizada arriba de la tabla -->
        <div class="p-4 bg-[#080d1a] border border-purple-500/40 rounded-2xl space-y-2 font-mono text-xs shadow-inner">
          <div class="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span class="text-purple-300 font-bold uppercase tracking-wider flex items-center gap-2">
              <span>📐</span>
              <span>Esquema de Multiplicación valh: Original vs Transformada</span>
            </span>
            <span class="text-[10px] text-slate-400">Diapositivas 24 & 25 del PDF (Mario Ramírez Tobar)</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div class="bg-[#060a14] p-2.5 rounded-xl border border-slate-800 space-y-1">
              <span class="text-rose-400 font-bold text-[10px] uppercase">Original (Recursiva Izquierda):</span>
              <pre class="text-slate-300 leading-tight">T -> T * F | F
F -> num</pre>
            </div>
            <div class="bg-[#060a14] p-2.5 rounded-xl border border-purple-500/30 space-y-1">
              <span class="text-purple-400 font-bold text-[10px] uppercase">Transformada (Sin Recursividad Izquierda):</span>
              <pre class="text-purple-300 leading-tight">S -> T
T -> F T'
T' -> * F T' | λ
F -> num</pre>
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-slate-800 bg-[#080d1a] overflow-hidden">
          <table class="w-full text-left font-mono text-xs">
            <thead class="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px] uppercase">
              <tr>
                <th class="p-3">#</th>
                <th class="p-3">Producción</th>
                <th class="p-3">Reglas Semánticas Asociadas</th>
                <th class="p-3">Tipo de Atributos</th>
                <th class="p-3">Rol en el Compilador</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/80 text-slate-300">
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-purple-400">1</td>
                <td class="p-3 text-white font-bold">S → T</td>
                <td class="p-3 text-emerald-300">imprimir(T.total)</td>
                <td class="p-3 text-emerald-400">Efecto Secundario</td>
                <td class="p-3 text-slate-400 font-sans">Emite o imprime el producto final de la multiplicación a la salida estándar.</td>
              </tr>
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-purple-400">2</td>
                <td class="p-3 text-white font-bold">T → F T'</td>
                <td class="p-3 space-y-1">
                  <div class="text-purple-300">T'.valh = F.val</div>
                  <div class="text-emerald-300">T.total = T'.total</div>
                </td>
                <td class="p-3 space-y-1">
                  <div class="text-purple-400">↓ Heredado</div>
                  <div class="text-emerald-400">↑ Sintetizado</div>
                </td>
                <td class="p-3 text-slate-400 font-sans">Pasa el primer factor <code>F.val</code> como valor heredado inicial a <code>T'.valh</code>.</td>
              </tr>
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-purple-400">3</td>
                <td class="p-3 text-white font-bold">T' → * F T'<sub>1</sub></td>
                <td class="p-3 space-y-1">
                  <div class="text-purple-300">T'<sub>1</sub>.valh = T'.valh * F.val</div>
                  <div class="text-emerald-300">T'.total = T'<sub>1</sub>.total</div>
                </td>
                <td class="p-3 space-y-1">
                  <div class="text-purple-400">↓ Heredado</div>
                  <div class="text-emerald-400">↑ Sintetizado</div>
                </td>
                <td class="p-3 text-slate-400 font-sans">Multiplica el valor heredado acumulado por el factor actual y lo envía a la derecha a <code>T'<sub>1</sub></code>.</td>
              </tr>
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-purple-400">4</td>
                <td class="p-3 text-white font-bold">T' → λ</td>
                <td class="p-3 text-emerald-300">T'.total = T'.valh</td>
                <td class="p-3 text-emerald-400">↑ Sintetizado desde Her.</td>
                <td class="p-3 text-slate-400 font-sans">Alcanza el símbolo vacío λ: transforma el producto heredado acumulado en el sintetizado <code>.total</code>.</td>
              </tr>
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-purple-400">5</td>
                <td class="p-3 text-white font-bold">F → num</td>
                <td class="p-3 text-emerald-300">F.val = num.val</td>
                <td class="p-3 text-amber-400">Léxico</td>
                <td class="p-3 text-slate-400 font-sans">Extrae el valor numérico entero del token.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ============================================================== -->
      <!-- TABLA 4: COMPROBACIÓN & PROPAGACIÓN DE TIPOS (DIAP. 4) -->
      <!-- ============================================================== -->
      <div v-if="theoryTableTab === 'typeChecking'" class="space-y-4">
        <!-- Gramática Utilizada arriba de la tabla -->
        <div class="p-4 bg-[#080d1a] border border-sky-500/40 rounded-2xl space-y-2 font-mono text-xs shadow-inner">
          <div class="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span class="text-sky-300 font-bold uppercase tracking-wider flex items-center gap-2">
              <span>🏷️</span>
              <span>Comprobación de Tipos en Declaraciones de Variables (Diapositiva 4 del PDF)</span>
            </span>
            <span class="text-[10px] text-slate-400">Cátedra Mario Ramírez Tobar: Uso Canónico de Atributos Heredados</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div class="bg-[#060a14] p-2.5 rounded-xl border border-slate-800 space-y-1">
              <span class="text-rose-400 font-bold text-[10px] uppercase">Original (Recursiva Izquierda en L):</span>
              <pre class="text-slate-300 leading-tight">D -> T L
T -> int | float
L -> L1 , id | id</pre>
            </div>
            <div class="bg-[#060a14] p-2.5 rounded-xl border border-sky-500/30 space-y-1">
              <span class="text-sky-400 font-bold text-[10px] uppercase">Transformada (Sin Recursividad Izquierda - LL(1)):</span>
              <pre class="text-sky-300 leading-tight">D -> T L
T -> int | float
L -> id L'
L' -> , id L' | ε</pre>
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-slate-800 bg-[#080d1a] overflow-hidden">
          <table class="w-full text-left font-mono text-xs">
            <thead class="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px] uppercase">
              <tr>
                <th class="p-3">#</th>
                <th class="p-3">Producción</th>
                <th class="p-3">Reglas Semánticas Asociadas</th>
                <th class="p-3">Tipo de Atributos</th>
                <th class="p-3">Rol en la Tabla de Símbolos</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/80 text-slate-300">
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-sky-400">1</td>
                <td class="p-3 text-white font-bold">D → T L</td>
                <td class="p-3 text-purple-300">L.her = T.tipo</td>
                <td class="p-3 text-purple-400">↓ Heredado Lateral</td>
                <td class="p-3 text-slate-400 font-sans">El tipo determinado en el no-terminal izquierdo <code>T</code> se pasa horizontalmente como atributo heredado a la lista de identificadores <code>L</code>.</td>
              </tr>
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-sky-400">2</td>
                <td class="p-3 text-white font-bold">T → int</td>
                <td class="p-3 text-emerald-300">T.tipo = 'entero'</td>
                <td class="p-3 text-emerald-400">↑ Sintetizado</td>
                <td class="p-3 text-slate-400 font-sans">Constante de tipo primitivo entero para la verificación semántica.</td>
              </tr>
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-sky-400">3</td>
                <td class="p-3 text-white font-bold">T → float</td>
                <td class="p-3 text-emerald-300">T.tipo = 'flotante'</td>
                <td class="p-3 text-emerald-400">↑ Sintetizado</td>
                <td class="p-3 text-slate-400 font-sans">Constante de tipo primitivo real de punto flotante.</td>
              </tr>
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-sky-400">4</td>
                <td class="p-3 text-white font-bold">L → id L'</td>
                <td class="p-3 space-y-1">
                  <div class="text-cyan-300">agregarTipo(id.entrada, L.her)</div>
                  <div class="text-purple-300">L'.her = L.her</div>
                </td>
                <td class="p-3 space-y-1">
                  <div class="text-amber-400">Acción TS</div>
                  <div class="text-purple-400">↓ Heredado</div>
                </td>
                <td class="p-3 text-slate-400 font-sans">Inserta el tipo recibido en la entrada del primer identificador y propaga el mismo tipo a la cola <code>L'</code>.</td>
              </tr>
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-sky-400">5</td>
                <td class="p-3 text-white font-bold">L' → , id L'<sub>1</sub></td>
                <td class="p-3 space-y-1">
                  <div class="text-cyan-300">agregarTipo(id.entrada, L'.her)</div>
                  <div class="text-purple-300">L'<sub>1</sub>.her = L'.her</div>
                </td>
                <td class="p-3 space-y-1">
                  <div class="text-amber-400">Acción TS</div>
                  <div class="text-purple-400">↓ Heredado</div>
                </td>
                <td class="p-3 text-slate-400 font-sans">Para cada variable separada por coma, registra su tipo en la Tabla de Símbolos y sigue propagando <code>.her</code> hacia <code>L'<sub>1</sub></code>.</td>
              </tr>
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-sky-400">6</td>
                <td class="p-3 text-white font-bold">L' → ε</td>
                <td class="p-3 text-slate-500 italic">/* fin de la lista */</td>
                <td class="p-3 text-slate-500">Base</td>
                <td class="p-3 text-slate-400 font-sans">Finaliza la declaración sin más variables.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Traza Didáctica de Verificación de Tipos: float x, y, z; -->
        <div class="p-4 bg-gradient-to-r from-sky-950/40 via-slate-900 to-[#080d1a] border border-sky-500/30 rounded-2xl space-y-2 text-xs font-mono">
          <div class="flex items-center gap-2 text-sky-300 font-bold">
            <span>🔬</span>
            <span class="uppercase">Caso de Estudio: Declaración <code>float x, y, z;</code> en el Árbol Anotado</span>
          </div>
          <p class="text-slate-300 font-sans leading-relaxed">
            Observe cómo el tipo <code>flotante</code> se sintetiza en el nodo <code>T</code>, y de inmediato se convierte en el atributo heredado <code>L.her = 'flotante'</code>. Al descender por el árbol, <code>L'.her</code> transporta el tipo horizontalmente a través de las comas para poblar la tabla de símbolos de las 3 variables sin necesidad de almacenar variables globales mutables:
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            <div class="p-2.5 bg-slate-950/80 rounded-xl border border-sky-500/30 text-center">
              <span class="text-slate-400 block text-[10px]">1. Identificador 'x'</span>
              <span class="text-sky-300 font-bold">x : float</span>
              <span class="text-[10px] text-slate-500 block">agregarTipo('x', L.her)</span>
            </div>
            <div class="p-2.5 bg-slate-950/80 rounded-xl border border-sky-500/30 text-center">
              <span class="text-slate-400 block text-[10px]">2. Identificador 'y'</span>
              <span class="text-sky-300 font-bold">y : float</span>
              <span class="text-[10px] text-slate-500 block">agregarTipo('y', L'.her)</span>
            </div>
            <div class="p-2.5 bg-slate-950/80 rounded-xl border border-sky-500/30 text-center">
              <span class="text-slate-400 block text-[10px]">3. Identificador 'z'</span>
              <span class="text-sky-300 font-bold">z : float</span>
              <span class="text-[10px] text-slate-500 block">agregarTipo('z', L'1.her)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================================== -->
      <!-- TABLA 5: CONSTRUCCIÓN DE AST CON SDD (DIAP. 43-48) -->
      <!-- ============================================================== -->
      <div v-if="theoryTableTab === 'astBuilding'" class="space-y-4">
        <!-- Gramática Utilizada arriba de la tabla -->
        <div class="p-4 bg-[#080d1a] border border-indigo-500/40 rounded-2xl space-y-2 font-mono text-xs shadow-inner">
          <div class="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span class="text-indigo-300 font-bold uppercase tracking-wider flex items-center gap-2">
              <span>🌲</span>
              <span>Construcción de Árbol Sintáctico Abstracto (AST) con SDD (Diapositivas 43-48 del PDF)</span>
            </span>
            <span class="text-[10px] text-slate-400">Punteros Heredados para Preservar Asociatividad por la Izquierda</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div class="bg-[#060a14] p-2.5 rounded-xl border border-slate-800 space-y-1">
              <span class="text-rose-400 font-bold text-[10px] uppercase">Original (S-Atribuida con Recursividad Izquierda):</span>
              <pre class="text-slate-300 leading-tight">E -> E1 + T   { E.nptr = mknode('+', E1.nptr, T.nptr); }
E -> E1 - T   { E.nptr = mknode('-', E1.nptr, T.nptr); }
E -> T        { E.nptr = T.nptr; }
T -> ( E )    { T.nptr = E.nptr; }
T -> id       { T.nptr = mkleaf(id, id.entry); }
T -> num      { T.nptr = mkleaf(num, num.val); }</pre>
            </div>
            <div class="bg-[#060a14] p-2.5 rounded-xl border border-indigo-500/30 space-y-1">
              <span class="text-indigo-400 font-bold text-[10px] uppercase">Transformada (L-Atribuida con Puntero Heredado in):</span>
              <pre class="text-indigo-300 leading-tight">E -> T E'       { E'.in = T.nptr; E.nptr = E'.syn; }
E' -> + T E'1   { E'1.in = mknode('+', E'.in, T.nptr); E'.syn = E'1.syn; }
E' -> - T E'1   { E'1.in = mknode('-', E'.in, T.nptr); E'.syn = E'1.syn; }
E' -> ε         { E'.syn = E'.in; }
T -> ( E )      { T.nptr = E.nptr; }
T -> id | num</pre>
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-slate-800 bg-[#080d1a] overflow-hidden">
          <table class="w-full text-left font-mono text-xs">
            <thead class="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px] uppercase">
              <tr>
                <th class="p-3">#</th>
                <th class="p-3">Producción</th>
                <th class="p-3">Reglas Semánticas Constructoras de Nodos</th>
                <th class="p-3">Tipo de Atributos</th>
                <th class="p-3">Preservación Semántica</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/80 text-slate-300">
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-indigo-400">1</td>
                <td class="p-3 text-white font-bold">E → T E'</td>
                <td class="p-3 space-y-1">
                  <div class="text-purple-300">E'.in = T.nptr</div>
                  <div class="text-emerald-300">E.nptr = E'.syn</div>
                </td>
                <td class="p-3 space-y-1">
                  <div class="text-purple-400">↓ Heredado (Puntero in)</div>
                  <div class="text-emerald-400">↑ Sintetizado (Puntero syn)</div>
                </td>
                <td class="p-3 text-slate-400 font-sans">El subárbol AST de <code>T</code> entra como hijo izquierdo del operador que se derivará en <code>E'</code>.</td>
              </tr>
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-indigo-400">2</td>
                <td class="p-3 text-white font-bold">E' → + T E'<sub>1</sub></td>
                <td class="p-3 space-y-1">
                  <div class="text-purple-300">E'<sub>1</sub>.in = mknode('+', E'.in, T.nptr)</div>
                  <div class="text-emerald-300">E'.syn = E'<sub>1</sub>.syn</div>
                </td>
                <td class="p-3 space-y-1">
                  <div class="text-purple-400">↓ Heredado</div>
                  <div class="text-emerald-400">↑ Sintetizado</div>
                </td>
                <td class="p-3 text-slate-400 font-sans"><strong>¡Clave de asociatividad izquierda!</strong> El nodo anterior <code>E'.in</code> se encapsula en la rama izquierda del nuevo nodo suma.</td>
              </tr>
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-indigo-400">3</td>
                <td class="p-3 text-white font-bold">E' → - T E'<sub>1</sub></td>
                <td class="p-3 space-y-1">
                  <div class="text-purple-300">E'<sub>1</sub>.in = mknode('-', E'.in, T.nptr)</div>
                  <div class="text-emerald-300">E'.syn = E'<sub>1</sub>.syn</div>
                </td>
                <td class="p-3 space-y-1">
                  <div class="text-purple-400">↓ Heredado</div>
                  <div class="text-emerald-400">↑ Sintetizado</div>
                </td>
                <td class="p-3 text-slate-400 font-sans">Garantiza que <code>a - b - c</code> construya <code>((a - b) - c)</code> y no <code>(a - (b - c))</code>.</td>
              </tr>
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-indigo-400">4</td>
                <td class="p-3 text-white font-bold">E' → ε</td>
                <td class="p-3 text-emerald-300">E'.syn = E'.in</td>
                <td class="p-3 text-emerald-400">↑ Sintetizado desde Heredado</td>
                <td class="p-3 text-slate-400 font-sans">Retorna la raíz del AST completamente construido hacia <code>E.nptr</code>.</td>
              </tr>
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-indigo-400">5</td>
                <td class="p-3 text-white font-bold">T → ( E )</td>
                <td class="p-3 text-emerald-300">T.nptr = E.nptr</td>
                <td class="p-3 text-emerald-400">↑ Sintetizado</td>
                <td class="p-3 text-slate-400 font-sans">Los paréntesis no crean nodos en el AST; únicamente dirigen el agrupamiento de los subárboles.</td>
              </tr>
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-indigo-400">6</td>
                <td class="p-3 text-white font-bold">T → id</td>
                <td class="p-3 text-emerald-300">T.nptr = mkleaf('id', id.entrada)</td>
                <td class="p-3 text-emerald-400">↑ Sintetizado (Hoja AST)</td>
                <td class="p-3 text-slate-400 font-sans">Crea una hoja del AST que apunta a la entrada en la Tabla de Símbolos.</td>
              </tr>
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-indigo-400">7</td>
                <td class="p-3 text-white font-bold">T → num</td>
                <td class="p-3 text-emerald-300">T.nptr = mkleaf('num', num.val)</td>
                <td class="p-3 text-emerald-400">↑ Sintetizado (Hoja AST)</td>
                <td class="p-3 text-slate-400 font-sans">Crea una hoja del AST con el valor constante del número.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ============================================================== -->
      <!-- TABLA 6: TRADUCCIÓN A POSTFIJO Y C3D (SDT) -->
      <!-- ============================================================== -->
      <div v-if="theoryTableTab === 'postfixSDT'" class="space-y-4">
        <!-- Gramática Utilizada arriba de la tabla -->
        <div class="p-4 bg-[#080d1a] border border-amber-500/40 rounded-2xl space-y-2 font-mono text-xs shadow-inner">
          <div class="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span class="text-amber-300 font-bold uppercase tracking-wider flex items-center gap-2">
              <span>⚙️</span>
              <span>Traducción a Postfijo y Código Intermedio (SDT - Diapositiva 38)</span>
            </span>
            <span class="text-[10px] text-slate-400">Acciones Semánticas Tratadas como Símbolos Terminales</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div class="bg-[#060a14] p-2.5 rounded-xl border border-slate-800 space-y-1">
              <span class="text-rose-400 font-bold text-[10px] uppercase">Original con Acciones al Final:</span>
              <pre class="text-slate-300 leading-tight">E -> E + T   { print('+'); }
E -> E - T   { print('-'); }
E -> T
T -> T * F   { print('*'); }
T -> F
F -> ( E )
F -> id      { print(id.lexema); }
F -> num     { print(num.val); }</pre>
            </div>
            <div class="bg-[#060a14] p-2.5 rounded-xl border border-amber-500/30 space-y-1">
              <span class="text-amber-400 font-bold text-[10px] uppercase">Transformada con Acciones en el Sufijo α:</span>
              <pre class="text-amber-300 leading-tight">E -> T E'
E' -> + T { print('+'); } E'
E' -> - T { print('-'); } E'
E' -> ε
T -> F T'
T' -> * F { print('*'); } T'
T' -> ε
F -> ( E ) | id { print(id); } | num { print(num); }</pre>
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-slate-800 bg-[#080d1a] overflow-hidden">
          <table class="w-full text-left font-mono text-xs">
            <thead class="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px] uppercase">
              <tr>
                <th class="p-3">#</th>
                <th class="p-3">Producción con Esquema de Traducción (SDT)</th>
                <th class="p-3">Acción Semántica Ejecutada en Turno</th>
                <th class="p-3">Secuencia de Salida Postfija</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/80 text-slate-300">
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-amber-400">1</td>
                <td class="p-3 text-white font-bold">E → T E'</td>
                <td class="p-3 text-slate-400 font-sans">Deriva el primer operando.</td>
                <td class="p-3 text-slate-500">Sin emisión</td>
              </tr>
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-amber-400">2</td>
                <td class="p-3 text-white font-bold">E' → + T { print('+'); } E'<sub>1</sub></td>
                <td class="p-3 text-emerald-300"><code>print('+')</code> tras analizar el término <code>T</code></td>
                <td class="p-3 text-amber-300 font-bold">Emite '+'</td>
              </tr>
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-amber-400">3</td>
                <td class="p-3 text-white font-bold">E' → - T { print('-'); } E'<sub>1</sub></td>
                <td class="p-3 text-emerald-300"><code>print('-')</code> tras analizar el término <code>T</code></td>
                <td class="p-3 text-amber-300 font-bold">Emite '-'</td>
              </tr>
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-amber-400">4</td>
                <td class="p-3 text-white font-bold">T' → * F { print('*'); } T'<sub>1</sub></td>
                <td class="p-3 text-emerald-300"><code>print('*')</code> tras analizar el factor <code>F</code></td>
                <td class="p-3 text-amber-300 font-bold">Emite '*'</td>
              </tr>
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-amber-400">5</td>
                <td class="p-3 text-white font-bold">F → id { print(id.lexema); }</td>
                <td class="p-3 text-emerald-300"><code>print(id.lexema)</code> de inmediato al reconocer el token</td>
                <td class="p-3 text-cyan-300 font-bold">Emite el identificador</td>
              </tr>
              <tr class="hover:bg-slate-900/60">
                <td class="p-3 font-bold text-amber-400">6</td>
                <td class="p-3 text-white font-bold">F → num { print(num.val); }</td>
                <td class="p-3 text-emerald-300"><code>print(num.val)</code> de inmediato al reconocer el número</td>
                <td class="p-3 text-cyan-300 font-bold">Emite el número literal</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Traza Didáctica de Traducción Postfija -->
        <div class="p-4 bg-gradient-to-r from-amber-950/40 via-slate-900 to-[#080d1a] border border-amber-500/30 rounded-2xl space-y-2 text-xs font-mono">
          <div class="flex items-center gap-2 text-amber-300 font-bold">
            <span>⚡</span>
            <span class="uppercase">Ejemplo de Ejecución: Traducción de <code>(a + b) * (c - d)</code></span>
          </div>
          <p class="text-slate-300 font-sans leading-relaxed">
            Las acciones intercaladas en el análisis descendente LL garantizan que los operadores salgan <strong>después de sus dos operandos</strong>, produciendo exactamente la Notación Polaca Inversa sin necesidad de construir el árbol sintáctico completo en memoria:
          </p>
          <div class="p-3 bg-slate-950 rounded-xl border border-slate-800 text-amber-300 font-bold text-sm">
            Entrada: <code>(a + b) * (c - d)</code> ➔ Emisión Secuencial: <span class="text-emerald-400">a b + c d - *</span>
          </div>
        </div>
      </div>

      <!-- ============================================================== -->
      <!-- TABLA 7: DETECCIÓN DE CICLOS SEMÁNTICOS VS DAGS -->
      <!-- ============================================================== -->
      <div v-if="theoryTableTab === 'circularDAG'" class="space-y-4">
        <!-- Tarjeta de Gramática Utilizada / Principio Teórico -->
        <div class="p-4 bg-[#080d1a] border border-rose-500/40 rounded-2xl space-y-2 font-mono text-xs shadow-inner">
          <div class="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span class="text-rose-300 font-bold uppercase tracking-wider flex items-center gap-2">
              <span>🔄</span>
              <span>Detección de Ciclos Semánticos: ¿Cuándo falla una DDS?</span>
            </span>
            <span class="text-[10px] text-slate-400">Condición Necesaria para Orden Topológico: Grafo Dirigido Acíclico (DAG)</span>
          </div>
          <p class="text-slate-300 font-sans leading-relaxed">
            Un compilador únicamente puede generar código si el Grafo de Dependencias entre los atributos es un <strong>DAG (Directed Acyclic Graph)</strong>. Si dos o más reglas semánticas forman una dependencia circular mutua, ningún orden topológico existe y la traducción es formalmente indefinible.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Ejemplo de Ciclo Inválido -->
          <div class="p-4 bg-[#0a101f] border border-rose-500/40 rounded-2xl space-y-3 font-mono text-xs">
            <div class="flex items-center gap-2 text-rose-300 font-bold text-sm">
              <span class="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></span>
              <span>❌ Esquema Semántico Inválido (Con Ciclo)</span>
            </div>
            <div class="p-3 bg-rose-950/30 rounded-xl border border-rose-500/30 text-rose-200 space-y-1">
              <div><strong>Producción:</strong> <code>A -> B</code></div>
              <div><strong>Regla 1:</strong> <code>A.s = B.i + 1</code> <span class="text-slate-400">(A.s depende de B.i)</span></div>
              <div><strong>Regla 2:</strong> <code>B.i = A.s * 2</code> <span class="text-slate-400">(B.i depende de A.s)</span></div>
            </div>
            <div class="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 text-[11px] font-sans leading-relaxed">
              <strong class="text-rose-400 block mb-1">Grafo de Dependencias Resultante:</strong>
              <code>A.s ➔ B.i ➔ A.s</code> (¡Ciclo dirigido de longitud 2!).
              <p class="mt-1 text-slate-400">
                Consecuencia en el compilador: Intentar evaluar <code>A.s</code> exige primero evaluar <code>B.i</code>, lo cual a su vez exige primero evaluar <code>A.s</code>. Provoca un bucle infinito o desbordamiento de pila (Stack Overflow).
              </p>
            </div>
          </div>

          <!-- Teorema de L-Atribuida -->
          <div class="p-4 bg-[#0a101f] border border-emerald-500/40 rounded-2xl space-y-3 font-mono text-xs">
            <div class="flex items-center gap-2 text-emerald-300 font-bold text-sm">
              <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span>✓ Teorema de Ausencia de Ciclos en L-Atribuidas</span>
            </div>
            <div class="p-3 bg-emerald-950/30 rounded-xl border border-emerald-500/30 text-emerald-200 space-y-1">
              <div><strong>Propiedad Formal:</strong></div>
              <p class="font-sans text-[11px] leading-relaxed">
                Toda gramática <strong>L-Atribuida</strong> garantiza por definición matemática que las aristas de atributos heredados van únicamente de <em>izquierda a derecha</em> (o del padre hacia abajo), y los sintetizados van de <em>abajo hacia arriba</em>.
              </p>
            </div>
            <div class="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 text-[11px] font-sans leading-relaxed">
              <strong class="text-emerald-400 block mb-1">Garantía Matemática de Terminación:</strong>
              Al no existir ninguna arista que regrese de derecha a izquierda ni de abajo hacia arriba en atributos heredados, <strong>el grafo es siempre un DAG acíclico</strong>. Siempre existe al menos un Orden Topológico que evalúa los atributos en una sola pasada hacia delante (Pre-orden / In-orden).
            </div>
          </div>
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
        <h5 class="font-mono font-bold text-amber-300 text-sm uppercase flex items-center gap-2">
          <span>💡</span>
          <span>El Vínculo Crucial: ¿Por qué la Eliminación de Recursividad Izquierda Crea Atributos Heredados?</span>
        </h5>
        <p class="text-slate-300 leading-relaxed">
          En la gramática recursiva izquierda original: <code>E → E + T</code> o <code>B → B or T</code>, la asociatividad por la izquierda se resolvía naturalmente de abajo hacia arriba mediante reducciones ascendentes (S-atribuida).
        </p>
        <p class="text-slate-300 leading-relaxed">
          Al eliminar la recursividad para permitir análisis descendente determinista (LL), la producción se convierte en <code>B → T B'</code> y <code>B' → or T B'<sub>1</sub> | ε</code>. El primer término evaluado es <code>T</code>, pero el resto de las operaciones se derivan hacia la derecha en la cola recursiva. Para que la evaluación no invierta la asociatividad, el valor acumulado debe pasarse hacia abajo y hacia la derecha: esto da origen de forma obligatoria al <strong>atributo heredado <code>B'.her</code></strong>. Al llegar al final de la expresión (<code>B' → ε</code>), el acumulador se convierte en el <strong>atributo sintetizado <code>B'.sin</code></strong> que regresa el resultado a la raíz.
        </p>
      </div>

      <!-- ============================================================== -->
      <!-- CASOS DE ESTUDIO COMPLEJOS (DEEP DIVE MULTI-NIVEL) -->
      <!-- ============================================================== -->
      <div class="p-5 bg-[#0a1224] rounded-3xl border border-cyan-500/40 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <div class="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">Comprensión Avanzada • Casos de Estudio Reales</div>
            <h4 class="text-base font-extrabold text-white flex items-center gap-2">
              <span>🔬</span>
              <span>Análisis Paso a Paso de Expresiones Complejas con Recursividad Eliminada</span>
            </h4>
          </div>
          <span class="text-xs font-mono px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold">
            3 Ejemplos Profundos
          </span>
        </div>

        <div class="space-y-4 font-mono text-xs">
          <!-- Caso 1: Aritmética 4 niveles de paréntesis -->
          <div class="p-4 bg-[#080d1a] rounded-2xl border border-slate-800 space-y-2">
            <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
              <span class="text-cyan-300 font-bold text-sm">
                Caso A (Aritmética Ultra-Compleja): <code>((2 + 3) * (4 + 1)) * (2 + 3 * (1 + 2))</code> = <span class="text-emerald-400 font-extrabold">275</span>
              </span>
              <span class="px-2 py-0.5 rounded text-[10px] bg-slate-900 text-slate-300 border border-slate-700">Profundidad de Árbol: 5 Niveles</span>
            </div>
            <p class="text-slate-300 font-sans leading-relaxed">
              En este ejercicio, la gramática transformada debe resolver tres productos anidados y sumas internas sin perder la precedencia. El desglose semántico formal por etapas es:
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
              <div class="p-2.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span class="text-purple-300 font-bold block">1. Subexpresión Izquierda:</span>
                <div><code>(2 + 3)</code> ➔ <strong>5</strong></div>
                <div><code>(4 + 1)</code> ➔ <strong>5</strong></div>
                <div class="text-cyan-300"><code>5 * 5</code> ➔ <strong>25</strong></div>
                <span class="text-[10px] text-slate-500">Pasa como T'.her al nodo raíz</span>
              </div>
              <div class="p-2.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span class="text-purple-300 font-bold block">2. Subexpresión Derecha:</span>
                <div><code>(1 + 2)</code> ➔ <strong>3</strong></div>
                <div><code>3 * 3</code> ➔ <strong>9</strong> (precedencia de *)</div>
                <div class="text-cyan-300"><code>2 + 9</code> ➔ <strong>11</strong></div>
                <span class="text-[10px] text-slate-500">Segundo factor del producto</span>
              </div>
              <div class="p-2.5 bg-slate-950 rounded-xl border border-emerald-500/30 space-y-1">
                <span class="text-emerald-400 font-bold block">3. Producto Raíz Final:</span>
                <div><code>T'1.valh = 25 * 11</code></div>
                <div><code>T'1.valh = 275</code></div>
                <div class="text-emerald-300 font-bold">L.val = 275 ✓</div>
                <span class="text-[10px] text-slate-500">Propagado hacia la raíz L</span>
              </div>
            </div>
          </div>

          <!-- Caso 2: Booleana con negaciones anidadas -->
          <div class="p-4 bg-[#080d1a] rounded-2xl border border-slate-800 space-y-2">
            <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
              <span class="text-emerald-300 font-bold text-sm">
                Caso B (Booleana Compuesta): <code>not (true or false) and (not (false and true) or not not false)</code> = <span class="text-rose-400 font-extrabold">false</span>
              </span>
              <span class="px-2 py-0.5 rounded text-[10px] bg-slate-900 text-slate-300 border border-slate-700">Precedencia NOT > AND > OR</span>
            </div>
            <p class="text-slate-300 font-sans leading-relaxed">
              Demuestra cómo la regla <code>F → not F<sub>1</sub></code> (sintetizada con inversión lógica) evalúa las subexpresiones antes de que <code>T'</code> (conjunción heredada) opere:
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
              <div class="p-2.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span class="text-purple-300 font-bold block">1. Factor 1:</span>
                <div><code>true or false</code> ➔ <code>true</code></div>
                <div class="text-rose-300"><code>not (true)</code> ➔ <strong>false</strong></div>
                <span class="text-[10px] text-slate-500">T'.her = false</span>
              </div>
              <div class="p-2.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span class="text-purple-300 font-bold block">2. Factor 2:</span>
                <div><code>false and true</code> ➔ <code>false</code></div>
                <div><code>not (false)</code> ➔ <code>true</code></div>
                <div class="text-cyan-300"><code>true or false</code> ➔ <strong>true</strong></div>
                <span class="text-[10px] text-slate-500">Segundo término evaluado</span>
              </div>
              <div class="p-2.5 bg-slate-950 rounded-xl border border-rose-500/30 space-y-1">
                <span class="text-rose-400 font-bold block">3. Conjunción 'and':</span>
                <div><code>T'1.her = false && true</code></div>
                <div><code>T'1.her = false</code></div>
                <div class="text-rose-300 font-bold">L.val = false ✓</div>
                <span class="text-[10px] text-slate-500">Evaluación completa confirmada</span>
              </div>
            </div>
          </div>

          <!-- Caso 3: Declaraciones Múltiples de Tipos -->
          <div class="p-4 bg-[#080d1a] rounded-2xl border border-slate-800 space-y-2">
            <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
              <span class="text-sky-300 font-bold text-sm">
                Caso C (Propagación Múltiple en Tabla de Símbolos): <code>int a, b; float c, d, e;</code>
              </span>
              <span class="px-2 py-0.5 rounded text-[10px] bg-slate-900 text-slate-300 border border-slate-700">Verificación de Tipos Estática</span>
            </div>
            <p class="text-slate-300 font-sans leading-relaxed">
              Muestra el comportamiento en compiladores industriales (GCC, Clang): cada sentencia de declaración <code>D</code> crea una cadena independiente de atributos heredados <code>L.her</code>. La primera declaración propaga <code>'entero'</code> a <code>{a, b}</code>; la segunda propaga <code>'flotante'</code> a <code>{c, d, e}</code>, garantizando aislamiento estricto de tipos entre sentencias consecutivas.
            </p>
          </div>
        </div>
      </div>

      <!-- Guía Canónica de Nomenclatura Formal (Cátedra Mario Ramírez Tobar) -->
      <div class="p-5 sm:p-6 bg-gradient-to-r from-purple-950/40 via-[#0a1224] to-cyan-950/40 rounded-3xl border border-cyan-500/40 space-y-4 shadow-xl">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <div class="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">Norma y Rigor Formal • Cátedra Mario Ramírez Tobar</div>
            <h4 class="text-base font-extrabold text-white flex items-center gap-2">
              <span>🎓</span>
              <span>Guía Definitiva: ¿Cuándo Usar .val, .sin, .her o .valex?</span>
            </h4>
          </div>
          <span class="text-xs font-mono px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold">
            Convención Estándar
          </span>
        </div>

        <p class="text-slate-300 text-xs leading-relaxed font-sans">
          Uno de los aspectos que más confunde a los estudiantes en el curso de Compiladores es por qué en el libro y diapositivas se alternan nombres de atributos como <code>E.val</code> frente a <code>E'.sin</code> o <code>E'.her</code>. La convención formal del Ing. Mario Ramírez Tobar sigue una separación semántica precisa entre <strong>metas principales</strong> y <strong>acumuladores auxiliares</strong>:
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <!-- .val -->
          <div class="p-4 bg-[#080d1a] rounded-2xl border border-emerald-500/40 space-y-2">
            <div class="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span class="text-emerald-300 font-bold flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span>Atributo .val (Valor Sintetizado Principal)</span>
              </span>
              <span class="text-[10px] text-emerald-400">↑ Ascendente</span>
            </div>
            <ul class="text-slate-300 text-[11px] font-sans space-y-1.5 leading-relaxed">
              <li><strong>¿Dónde se usa?</strong> En no-terminales primarios del lenguaje: <code>E.val, T.val, F.val, B.val, L.val</code>.</li>
              <li><strong>Significado conceptual:</strong> Es el resultado semántico final evaluado de toda la construcción gramatical que representa dicho no-terminal.</li>
              <li><strong>Regla de oro:</strong> Si el nodo es el encabezado de la expresión o factor principal, su resultado evaluado siempre se llama <code>.val</code>.</li>
            </ul>
          </div>

          <!-- .sin -->
          <div class="p-4 bg-[#080d1a] rounded-2xl border border-cyan-500/40 space-y-2">
            <div class="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span class="text-cyan-300 font-bold flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                <span>Atributo .sin (Sintetizado de Cola Recursiva)</span>
              </span>
              <span class="text-[10px] text-cyan-400">↑ Ascendente</span>
            </div>
            <ul class="text-slate-300 text-[11px] font-sans space-y-1.5 leading-relaxed">
              <li><strong>¿Dónde se usa?</strong> <em>Únicamente</em> en los símbolos auxiliares con prima: <code>E'.sin, T'.sin, B'.sin</code>.</li>
              <li><strong>¿Por qué no llamarlo .val?</strong> Porque en la cola recursiva entran dos flujos de datos contrarios: el acumulador que baja (<code>E'.her</code>) y el valor que sube (<code>E'.sin</code>). Al llegar al final en ε (<code>E' -> ε => E'.sin = E'.her</code>), <code>.sin</code> asciende el acumulador a la superficie para entregarlo a <code>E.val = E'.sin</code>.</li>
              <li><strong>Regla de oro:</strong> <code>.sin</code> es el canal de retorno exclusivo de las colas recursivas.</li>
            </ul>
          </div>

          <!-- .her / .valh -->
          <div class="p-4 bg-[#080d1a] rounded-2xl border border-purple-500/40 space-y-2">
            <div class="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span class="text-purple-300 font-bold flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
                <span>Atributo .her / .valh (Heredado / Acumulador)</span>
              </span>
              <span class="text-[10px] text-purple-400">↓ Lateral-Descendente</span>
            </div>
            <ul class="text-slate-300 text-[11px] font-sans space-y-1.5 leading-relaxed">
              <li><strong>¿Dónde se usa?</strong> En no-terminales cuyo cómputo depende de lo que ocurrió a su <em>izquierda</em> o en su <em>padre</em>: <code>E'.her, T'.her, B'.her, T'.valh, L.her</code>.</li>
              <li><strong>Significado conceptual:</strong> Acumula sumas/productos hacia la derecha, o propaga tipos de datos desde <code>T</code> hacia <code>L</code> en declaraciones de variables (<code>L.her = T.tipo</code>).</li>
              <li><strong>Regla de oro:</strong> Nunca puede usarse en el nodo raíz como resultado final; siempre viaja hacia abajo o hacia la derecha.</li>
            </ul>
          </div>

          <!-- .valex -->
          <div class="p-4 bg-[#080d1a] rounded-2xl border border-amber-500/40 space-y-2">
            <div class="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span class="text-amber-300 font-bold flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span>Atributo .valex (Léxico Intrínseco de Token)</span>
              </span>
              <span class="text-[10px] text-amber-400">🏷️ Escáner</span>
            </div>
            <ul class="text-slate-300 text-[11px] font-sans space-y-1.5 leading-relaxed">
              <li><strong>¿Dónde se usa?</strong> En las hojas terminales: <code>digito.valex, id.lexema, num.val, true, false</code>.</li>
              <li><strong>Significado conceptual:</strong> Es un valor atómico que no se calcula mediante reglas semánticas; proviene directamente del archivo de código fuente leído por el analizador léxico.</li>
              <li><strong>Regla de oro:</strong> Es el punto de partida (hojas) de todas las aristas dirigidas en el DAG.</li>
            </ul>
          </div>
        </div>
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
  parseBooleanSdd,
  detectGrammarType,
  type LeftRecursionResult,
  type SddTreeResult,
  type SddNode,
  type SddAttributeRef
} from '../../utils/sddParser';

// Pestaña activa
const activeTab = ref<'recursion' | 'trees' | 'steps' | 'theory'>('recursion');
const theoryTableTab = ref<'arithmetic' | 'boolean' | 'multiplication' | 'typeChecking' | 'astBuilding' | 'postfixSDT' | 'circularDAG'>('arithmetic');

// -------------------------------------------------------------
// ESTADO Y MÉTODOS: ELIMINADOR DE RECURSIVIDAD IZQUIERDA
// -------------------------------------------------------------
const recursionPresets = [
  {
    label: '🟢 Booleana: B -> B or T | T',
    code: `B -> B or T | T\nT -> T and F | F\nF -> not F | ( B ) | true | false`
  },
  {
    label: '🟢 Booleana con Acciones { emit }',
    code: `B -> B or T { emit('OR'); } | T\nT -> T and F { emit('AND'); } | F\nF -> not F { emit('NOT'); } | ( B ) | true | false`
  },
  {
    label: '⭐ Diap. 39: E -> E + T { print(+) } | T',
    code: "E -> E + T { print('+'); } | T"
  },
  {
    label: '⭐ Diap. 41: E + T | E - T | ( E ) | T',
    code: `E -> E + T | E - T | ( E ) | T\nT -> numero`
  },
  {
    label: 'Aritmética Estándar: E, T, F',
    code: `E -> E + T | T\nT -> T * F | F\nF -> ( E ) | digito`
  },
  {
    label: 'POO: Acceso a Arreglos y Miembros',
    code: `E -> E [ I ] | E . id | id`
  },
  {
    label: 'Secuencia de Sentencias: S -> S ; A | A',
    code: `S -> S ; A | A\nA -> id = E`
  },
  {
    label: 'Comparaciones Relacionales: R == E | R < E',
    code: `R -> R == E | R != E | R < E | E\nE -> E + T | T`
  },
  {
    label: 'Caso Genérico: A -> A a | A b | c | d',
    code: 'A -> A a | A b | c | d'
  },
  {
    label: '🔥 Completo: 6 Niveles (OR, AND, Relacionales, Suma, Mul, Unarios)',
    code: `E -> E or T | T\nT -> T and R | R\nR -> R == C | R != C | R < C | R > C | C\nC -> C + M | C - M | M\nM -> M * F | M / F | M % F | F\nF -> not F | - F | ( E ) | id | num`
  },
  {
    label: '🔥 C++ / Java: Punteros, Arreglos Multidimensionales y Tipos Base',
    code: `Type -> Type * | Type [ num ] | int | float | char | double`
  },
  {
    label: '🔥 POO Avanzado: Encadenamiento de Métodos, Índices y Argumentos',
    code: `E -> E [ I ] | E . id | E ( args ) | id\nI -> E\nargs -> args , E | E`
  },
  {
    label: '🔥 Compilador C3D: Múltiples Acciones Semánticas con Emisión',
    code: `E -> E + { gen_label(); } T { emit_add(); } | E - { gen_label(); } T { emit_sub(); } | T\nT -> T * { emit_mul(); } F | F\nF -> ( E ) | id { emit_push(id.name); } | num { emit_push(num.val); }`
  },
  {
    label: '🔥 Estructuras de Control: Listas de Sentencias con Bloques Anidados',
    code: `StmtList -> StmtList ; Stmt | Stmt\nStmt -> if ( B ) Stmt | while ( B ) Stmt | { StmtList } | id = E`
  },
  {
    label: '🔥 Diap. 37: Recursividad Indirecta / Mutua (S -> A a | b)',
    code: `S -> A a | b\nA -> S c | d`
  }
];

const recursionInput = ref(`B -> B or T | T\nT -> T and F | F\nF -> not F | ( B ) | true | false`);
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
  category: 'boolean' | 'arithmetic' | 'multiplication';
  type: 'boolean' | 'arithmetic' | 'multiplication';
  expr: string;
}

const sddSamples: SddSample[] = [
  // --- BOOLEANAS ---
  {
    label: '🟢 Bool 1: true and (false or not false)',
    category: 'boolean',
    type: 'boolean',
    expr: 'true and (false or not false)'
  },
  {
    label: '🟢 Bool 2: not (true or false) and not false',
    category: 'boolean',
    type: 'boolean',
    expr: 'not (true or false) and not false'
  },
  {
    label: '🟢 Bool 3: true and false or true and true',
    category: 'boolean',
    type: 'boolean',
    expr: 'true and false or true and true'
  },
  {
    label: '🟢 Bool 4: not false and not (false or false)',
    category: 'boolean',
    type: 'boolean',
    expr: 'not false and not (false or false)'
  },
  {
    label: '🟢 Bool 5: !(!true || false) && !false',
    category: 'boolean',
    type: 'boolean',
    expr: '!(!true || false) && !false'
  },
  {
    label: '🟢 Bool 6 (Complejo): not (true or false) and (not (false and true) or not not false)',
    category: 'boolean',
    type: 'boolean',
    expr: 'not (true or false) and (not (false and true) or not not false)'
  },
  {
    label: '🟢 Bool 7 (Complejo): (true and not (false or false)) or (not true and (true or false))',
    category: 'boolean',
    type: 'boolean',
    expr: '(true and not (false or false)) or (not true and (true or false))'
  },
  {
    label: '🟢 Bool 8 (Negaciones triples): not not not false and (true or false and not true)',
    category: 'boolean',
    type: 'boolean',
    expr: 'not not not false and (true or false and not true)'
  },
  {
    label: '🟢 Bool 9 (Encadenado 3 factores): (true or false) and (false or not false) and not (true and false)',
    category: 'boolean',
    type: 'boolean',
    expr: '(true or false) and (false or not false) and not (true and false)'
  },
  {
    label: '🟢 Bool 10 (Sintaxis C/Java): !(!false && (!true || false)) || !(false || !true)',
    category: 'boolean',
    type: 'boolean',
    expr: '!(!false && (!true || false)) || !(false || !true)'
  },
  {
    label: '🟢 Bool 11 (Disyunciones múltiples): true and false or false and true or not false and true',
    category: 'boolean',
    type: 'boolean',
    expr: 'true and false or false and true or not false and true'
  },

  // --- ARITMÉTICAS ---
  {
    label: '⭐ Diap. 28 & 34: (3 + 4) * (5 + 6)',
    category: 'arithmetic',
    type: 'arithmetic',
    expr: '(3 + 4) * (5 + 6)'
  },
  {
    label: '⭐ Diap. 28: (9 + 8 * (7 + 6) + 5) * 4',
    category: 'arithmetic',
    type: 'arithmetic',
    expr: '(9 + 8 * (7 + 6) + 5) * 4'
  },
  {
    label: 'Aritmética: 2 + 3 * 4',
    category: 'arithmetic',
    type: 'arithmetic',
    expr: '2 + 3 * 4'
  },
  {
    label: 'Aritmética: (2 + 3) * (4 + 5)',
    category: 'arithmetic',
    type: 'arithmetic',
    expr: '(2 + 3) * (4 + 5)'
  },
  {
    label: 'Aritmética: 5 * (2 + 4 * 3) + 10',
    category: 'arithmetic',
    type: 'arithmetic',
    expr: '5 * (2 + 4 * 3) + 10'
  },
  {
    label: '🔢 Aritmética 6 (Ultra-Complejo): ((2 + 3) * (4 + 1)) * (2 + 3 * (1 + 2))',
    category: 'arithmetic',
    type: 'arithmetic',
    expr: '((2 + 3) * (4 + 1)) * (2 + 3 * (1 + 2))'
  },
  {
    label: '🔢 Aritmética 7 (Mixto profundo): 10 + 20 * (3 + 4 * 2) + 5 * (6 + 1)',
    category: 'arithmetic',
    type: 'arithmetic',
    expr: '10 + 20 * (3 + 4 * 2) + 5 * (6 + 1)'
  },
  {
    label: '🔢 Aritmética 8 (Triple producto): (1 + 2) * (3 + 4) * (5 + 6)',
    category: 'arithmetic',
    type: 'arithmetic',
    expr: '(1 + 2) * (3 + 4) * (5 + 6)'
  },
  {
    label: '🔢 Aritmética 9 (Suma de productos): ((1 + 1) * (2 + 2)) + ((3 + 3) * (4 + 4))',
    category: 'arithmetic',
    type: 'arithmetic',
    expr: '((1 + 1) * (2 + 2)) + ((3 + 3) * (4 + 4))'
  },
  {
    label: '🔢 Aritmética 10 (Cascada nivel 4): 2 * (3 + 4 * (5 + 6 * (1 + 2)))',
    category: 'arithmetic',
    type: 'arithmetic',
    expr: '2 * (3 + 4 * (5 + 6 * (1 + 2)))'
  },

  // --- MULTIPLICACIÓN ---
  {
    label: '⭐ Diap. 24 & 25: 3 * 5 * 2 (valh)',
    category: 'multiplication',
    type: 'multiplication',
    expr: '3 * 5 * 2'
  },
  {
    label: 'Multiplicación: 2 * 4 * 6 * 8',
    category: 'multiplication',
    type: 'multiplication',
    expr: '2 * 4 * 6 * 8'
  },
  {
    label: '✖️ Mult 3 (Cadena 5 factores): 2 * 3 * 4 * 5 * 6',
    category: 'multiplication',
    type: 'multiplication',
    expr: '2 * 3 * 4 * 5 * 6'
  },
  {
    label: '✖️ Mult 4 (Factores grandes): 5 * 10 * 20 * 2',
    category: 'multiplication',
    type: 'multiplication',
    expr: '5 * 10 * 20 * 2'
  }
];

const selectedCategory = ref<string>('todos');
const currentSampleLabel = ref(sddSamples[0].label);
const currentGrammarType = ref<'boolean' | 'arithmetic' | 'multiplication'>('boolean');
const expressionInput = ref('true and (false or not false)');
const sddTreeData = ref<SddTreeResult | null>(null);
const sddError = ref<string | null>(null);
const selectedNode = ref<SddNode | null>(null);

const activeTransformedGrammar = computed(() => {
  const type = sddTreeData.value?.grammarType || currentGrammarType.value;
  if (type === 'boolean') {
    return {
      title: 'Expresiones Booleanas (OR, AND, NOT) con Eliminación de Recursividad Izquierda y DDS L-Atribuida',
      shortTitle: 'Lógica Booleana (NOT > AND > OR)',
      badge: 'L-Atribuida • LL(1) / Descenso Recursivo',
      original: [
        'B -> B or T | T',
        'T -> T and F | F',
        'F -> not F | ( B ) | true | false'
      ],
      transformed: [
        'L -> B',
        'B -> T B\'',
        'B\' -> or T B\' | ε',
        'T -> F T\'',
        'T\' -> and F T\' | ε',
        'F -> not F | ( B ) | true | false'
      ],
      attrDetails: [
        {
          icon: '↓',
          color: 'text-purple-400',
          title: 'Heredados (B\'.her, T\'.her)',
          desc: 'Flujo lateral / descendente: Acumulan el valor de verdad hacia la derecha.'
        },
        {
          icon: '↑',
          color: 'text-emerald-400',
          title: 'Sintetizados (B.val, T.val, F.val, B\'.sin, T\'.sin, L.val)',
          desc: 'Flujo ascendente: Retornan el resultado calculado desde las hojas a la raíz.'
        },
        {
          icon: '🏷️',
          color: 'text-amber-400',
          title: 'Léxicos (true, false)',
          desc: 'Constante literal de token provista directamente por el escáner léxico.'
        }
      ]
    };
  } else if (type === 'multiplication') {
    return {
      title: 'Esquema de Multiplicación Pura con Heredados (Diapositivas 24 & 25 del PDF)',
      shortTitle: 'Multiplicación valh (Mario Ramírez Tobar)',
      badge: 'L-Atribuida • Multiplicación Pura',
      original: [
        'T -> T * F | F',
        'F -> num'
      ],
      transformed: [
        'S -> T',
        'T -> F T\'',
        'T\' -> * F T\' | λ',
        'F -> num'
      ],
      attrDetails: [
        {
          icon: '↓',
          color: 'text-purple-400',
          title: 'Heredados (T\'.valh)',
          desc: 'Flujo lateral: Pasa el producto acumulado al factor siguiente a la derecha.'
        },
        {
          icon: '↑',
          color: 'text-emerald-400',
          title: 'Sintetizados (T.total, T\'.total, S.total)',
          desc: 'Flujo ascendente: Al llegar al caso base λ, asciende el producto final a la raíz.'
        },
        {
          icon: '🏷️',
          color: 'text-amber-400',
          title: 'Léxicos (num.val)',
          desc: 'Valor entero o constante extraído por el escáner léxico.'
        }
      ]
    };
  } else {
    return {
      title: 'Expresiones Aritméticas (+, *) con Eliminación de Recursividad Izquierda (Diap. 31 & 34)',
      shortTitle: 'Aritmética (* > +) L-Atribuida',
      badge: 'L-Atribuida • LL(1) / Descenso Recursivo',
      original: [
        'E -> E + T | T',
        'T -> T * F | F',
        'F -> ( E ) | digito'
      ],
      transformed: [
        'L -> E',
        'E -> T E\'',
        'E\' -> + T E\' | ε',
        'T -> F T\'',
        'T\' -> * F T\' | ε',
        'F -> ( E ) | digito'
      ],
      attrDetails: [
        {
          icon: '↓',
          color: 'text-purple-400',
          title: 'Heredados (E\'.her, T\'.her)',
          desc: 'Flujo lateral / descendente: Pasan la suma o producto acumulado hacia la derecha.'
        },
        {
          icon: '↑',
          color: 'text-emerald-400',
          title: 'Sintetizados (E.val, T.val, F.val, E\'.sin, T\'.sin, L.val)',
          desc: 'Flujo ascendente: Suben los resultados parciales y el total a la raíz L.val.'
        },
        {
          icon: '🏷️',
          color: 'text-amber-400',
          title: 'Léxicos (digito.valex)',
          desc: 'Valor numérico literal de los dígitos y operandos terminales.'
        }
      ]
    };
  }
});

const filteredSamples = computed(() => {
  if (selectedCategory.value === 'todos') return sddSamples;
  return sddSamples.filter(s => s.category === selectedCategory.value);
});

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
    const detected = detectGrammarType(expressionInput.value);
    const targetType = detected === 'boolean' ? 'boolean' : (currentGrammarType.value || detected);

    if (targetType === 'boolean' || detected === 'boolean') {
      currentGrammarType.value = 'boolean';
      sddTreeData.value = parseBooleanSdd(expressionInput.value);
    } else if (targetType === 'multiplication') {
      sddTreeData.value = parseMultiplicationSdd(expressionInput.value);
    } else {
      currentGrammarType.value = 'arithmetic';
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

function formatResultValue(val: number | boolean | string | undefined): string {
  if (typeof val === 'boolean') {
    return val ? 'true (VERDADERO)' : 'false (FALSO)';
  }
  return String(val ?? '');
}

function formatAttrVal(val: number | boolean | string | undefined): string {
  return String(val ?? '');
}

function computeBranchLine(parent: SddNode, child: SddNode) {
  const dx = child.x - parent.x;
  const dy = child.y - parent.y;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / dist;
  const uy = dy / dist;

  const parentRadius = parent.isTerminal ? 16 : 22;
  const childRadius = child.isTerminal ? 16 : 22;

  return {
    x1: parent.x + ux * parentRadius,
    y1: parent.y + uy * parentRadius,
    x2: child.x - ux * (childRadius + 3),
    y2: child.y - uy * (childRadius + 3)
  };
}

function computeCurvedPath(from: SddAttributeRef, to: SddAttributeRef): string {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const cx1 = from.x + dx * 0.25;
  const cy1 = from.y + dy * 0.5 - 25;
  const cx2 = to.x - dx * 0.25;
  const cy2 = to.y - dy * 0.5 - 25;

  // Vector de aproximación hacia el badge de destino (to)
  const vx = to.x - cx2;
  const vy = to.y - cy2;
  const distTo = Math.sqrt(vx * vx + vy * vy) || 1;
  const uxTo = vx / distTo;
  const uyTo = vy / distTo;

  // El badge mide 74px de ancho (mitad 37) y 20px de alto (mitad 10)
  const sTo = Math.min(
    Math.abs(uxTo) > 0.001 ? 38 / Math.abs(uxTo) : 999,
    Math.abs(uyTo) > 0.001 ? 12 / Math.abs(uyTo) : 999
  );
  const endX = to.x - uxTo * (sTo + 3);
  const endY = to.y - uyTo * (sTo + 3);

  // Vector de salida desde el badge de origen (from)
  const vfx = cx1 - from.x;
  const vfy = cy1 - from.y;
  const distFrom = Math.sqrt(vfx * vfx + vfy * vfy) || 1;
  const uxFrom = vfx / distFrom;
  const uyFrom = vfy / distFrom;
  const sFrom = Math.min(
    Math.abs(uxFrom) > 0.001 ? 38 / Math.abs(uxFrom) : 999,
    Math.abs(uyFrom) > 0.001 ? 12 / Math.abs(uyFrom) : 999
  );
  const startX = from.x + uxFrom * sFrom;
  const startY = from.y + uyFrom * sFrom;

  return `M ${startX} ${startY} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${endX} ${endY}`;
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

function getAttrTextColor(attr: SddAttributeRef): string {
  if (typeof attr.value === 'boolean') {
    return attr.value ? '#34d399' : '#f87171'; // emerald-400 or rose-400
  }
  if (attr.attrType === 'inherited') return '#e9d5ff';
  if (attr.attrType === 'synthesized') return '#a7f3d0';
  return '#fef3c7';
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
