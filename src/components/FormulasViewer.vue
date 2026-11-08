<template>
  <div class="space-y-6">
    <!-- Selector Principal de Modo: Fórmulas Matemáticas vs Palabras Reservadas RISC-V -->
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-2 bg-[#090e1a] rounded-2xl border border-slate-800 shadow-xl">
      <div class="grid grid-cols-2 gap-2 w-full sm:w-auto">
        <button
          @click="activeMainTab = 'formulas'"
          :class="activeMainTab === 'formulas'
            ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 font-extrabold shadow-[0_0_15px_rgba(6,182,212,0.45)]'
            : 'bg-[#0d1527] text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'"
          class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-bold transition cursor-pointer"
        >
          <span>📐</span>
          <span>Fórmulas Matemáticas</span>
          <span class="text-[10px] px-1.5 py-0.5 rounded-full bg-black/30 text-white font-bold">{{ FORMULAS.length }}</span>
        </button>

        <button
          @click="activeMainTab = 'riscv'"
          :class="activeMainTab === 'riscv'
            ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-slate-950 font-extrabold shadow-[0_0_15px_rgba(168,85,247,0.45)]'
            : 'bg-[#0d1527] text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'"
          class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-bold transition cursor-pointer"
        >
          <span>⚡</span>
          <span>Palabras Reservadas RISC-V</span>
          <span class="text-[10px] px-1.5 py-0.5 rounded-full bg-black/30 text-white font-bold">{{ RISCV_RESERVED_WORDS.length }}</span>
        </button>
      </div>

      <!-- Buscador Global para la pestaña activa -->
      <div class="w-full sm:w-72 relative">
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="activeMainTab === 'formulas' ? 'Buscar regla, FIRST, arrays...' : 'Buscar addi, lw, sp, .text...'"
          class="w-full bg-[#0d1527] border border-slate-700/80 rounded-xl pl-8 pr-8 py-2 text-xs sm:text-sm text-white font-mono placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 shadow-inner"
        />
        <span class="absolute left-2.5 top-2.5 text-xs text-slate-500">🔍</span>
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-white font-bold cursor-pointer"
          title="Limpiar búsqueda"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- PESTAÑA 1: FÓRMULAS MATEMÁTICAS & ALGORITMOS -->
    <!-- ========================================== -->
    <div v-if="activeMainTab === 'formulas'" class="space-y-6">
      <!-- Filtro de Categorías de Fórmulas -->
      <div class="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-[#0d1527] rounded-2xl border border-slate-800 shadow-lg">
        <div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            v-for="cat in formulaCategories"
            :key="cat"
            @click="selectedFormulaCategory = cat"
            :class="selectedFormulaCategory === cat
              ? 'bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800 hover:border-slate-700'"
            class="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-mono transition cursor-pointer"
          >
            {{ cat }}
          </button>
        </div>
        <div class="text-xs font-mono text-slate-400">
          Mostrando <span class="text-cyan-300 font-bold">{{ filteredFormulas.length }}</span> de {{ FORMULAS.length }} fórmulas
        </div>
      </div>

      <!-- Lista de Fórmulas -->
      <div v-if="filteredFormulas.length === 0" class="p-8 text-center bg-[#0d1527] rounded-2xl border border-slate-800 text-slate-400 font-mono text-sm">
        No se encontraron fórmulas que coincidan con "{{ searchQuery }}".
      </div>

      <div class="space-y-6">
        <div
          v-for="formula in filteredFormulas"
          :key="formula.id"
          :id="formula.id"
          class="bg-gradient-to-b from-[#0d162a] to-[#090e1a] rounded-2xl border border-slate-800/90 hover:border-cyan-500/40 p-4 sm:p-6 shadow-xl space-y-5 scroll-mt-20 transition-all duration-200 relative overflow-hidden group"
        >
          <!-- Brillo de acento superior sutil -->
          <div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent group-hover:via-cyan-400 transition-all"></div>

          <!-- Encabezado de Fórmula -->
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
              <span class="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-950/60 text-purple-300 border border-purple-500/30 font-bold">
                {{ formula.category }}
              </span>
              <h3 class="text-base sm:text-lg font-bold text-white font-sans">{{ formula.name }}</h3>
            </div>
            <span class="text-xs font-mono text-cyan-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">ID: {{ formula.id }}</span>
          </div>

          <!-- Renderizado de la Expresión Matemática -->
          <div class="p-4 sm:p-5 bg-gradient-to-b from-[#070b16] to-[#040710] rounded-xl border border-slate-800/80 overflow-x-auto text-center shadow-inner">
            <div class="inline-block text-cyan-200 text-sm sm:text-base" v-html="renderLatexDisplay(formula.latex)"></div>
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
            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed bg-[#080d1a] p-3 rounded-xl border border-slate-800/70">
              {{ formula.whenToUse }}
            </p>
          </div>

          <!-- Procedimiento Sistemático -->
          <div class="space-y-1">
            <h4 class="text-xs font-mono uppercase tracking-wider text-sky-400 font-bold flex items-center gap-1.5">
              <span>📋</span> Procedimiento Paso a Paso
            </h4>
            <ol class="space-y-1.5 text-xs sm:text-sm text-slate-300 bg-[#080d1a] p-3 sm:p-4 rounded-xl border border-slate-800/70 font-sans">
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
            <p class="text-xs sm:text-sm font-bold text-cyan-300">{{ formula.example.statement }}</p>
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
            <p class="text-slate-200 font-bold text-xs sm:text-sm">{{ formula.practiceExercise.question }}</p>
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

    <!-- ========================================== -->
    <!-- PESTAÑA 2: PALABRAS RESERVADAS & FICHA RISC-V -->
    <!-- ========================================== -->
    <div v-else class="space-y-6">
      <!-- Barra Informativa de Resumen y Filtro de Categorías -->
      <div class="p-4 bg-[#0d1527] rounded-2xl border border-slate-800 shadow-lg space-y-4">
        <!-- Banner pedagógico superior -->
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-1 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold">
              RV32I Base + Ext. M
            </span>
            <span class="text-xs text-slate-300">
              Conjunto canónico de instrucciones, registros ABI, directivas del ensamblador y llamadas al sistema.
            </span>
          </div>
          <div class="flex items-center gap-3 text-xs font-mono">
            <span class="text-slate-400">Total catalogado: <strong class="text-cyan-300">{{ filteredRiscv.length }}</strong></span>
            <!-- Botón de Modo de Vista -->
            <div class="flex items-center bg-[#080d1a] p-1 rounded-lg border border-slate-800">
              <button
                @click="riscvViewMode = 'cards'"
                :class="riscvViewMode === 'cards' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'"
                class="px-2 py-0.5 rounded text-[11px] transition cursor-pointer"
                title="Vista de Tarjetas Detalladas"
              >
                🎴 Tarjetas
              </button>
              <button
                @click="riscvViewMode = 'table'"
                :class="riscvViewMode === 'table' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'"
                class="px-2 py-0.5 rounded text-[11px] transition cursor-pointer"
                title="Vista de Tabla Resumen"
              >
                📑 Tabla Compacta
              </button>
            </div>
          </div>
        </div>

        <!-- Filtros de Categorías RISC-V -->
        <div class="flex flex-wrap items-center gap-2">
          <button
            v-for="cat in riscvCategories"
            :key="cat"
            @click="selectedRiscvCategory = cat"
            :class="selectedRiscvCategory === cat
              ? 'bg-gradient-to-r from-purple-400 to-cyan-400 text-slate-950 font-bold shadow-[0_0_12px_rgba(168,85,247,0.4)]'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800 hover:border-slate-700'"
            class="px-3 py-1.5 rounded-xl text-xs font-mono transition cursor-pointer flex items-center gap-1.5"
          >
            <span>{{ getCategoryIcon(cat) }}</span>
            <span>{{ cat }}</span>
            <span class="text-[10px] opacity-80">({{ getRiscvCountByCategory(cat) }})</span>
          </button>
        </div>
      </div>

      <!-- Cuadro Rápido de Formatos de Instrucción (siempre visible cuando se filtran formatos o Todas) -->
      <div v-if="selectedRiscvCategory === 'Todas' || selectedRiscvCategory === 'Formato'" class="p-4 bg-[#0a101f] rounded-2xl border border-cyan-500/20 shadow-lg space-y-3">
        <div class="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300">
          <span>📐</span>
          <span>DISTRIBUCIÓN DE BITS EN INSTRUCCIONES RV32I (32 BITS FIJOS)</span>
        </div>
        <p class="text-xs text-slate-300">
          Todas las instrucciones en RISC-V miden exactamente 32 bits (4 bytes) y deben estar alineadas en memoria. La arquitectura divide los bits en 6 formatos regulares para simplificar la decodificación por hardware:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-mono">
          <div class="p-2.5 bg-[#080d1a] rounded-xl border border-slate-800">
            <span class="text-cyan-400 font-bold block mb-1">Tipo-R (Registro-Registro)</span>
            <code class="text-[10px] text-slate-300 block bg-slate-900 p-1.5 rounded">[funct7 7b][rs2 5b][rs1 5b][funct3 3b][rd 5b][opcode 7b]</code>
            <span class="text-[11px] text-slate-400 mt-1 block">add, sub, mul, and, or, xor, sll, slt</span>
          </div>
          <div class="p-2.5 bg-[#080d1a] rounded-xl border border-slate-800">
            <span class="text-sky-400 font-bold block mb-1">Tipo-I (Inmediato / Cargas)</span>
            <code class="text-[10px] text-slate-300 block bg-slate-900 p-1.5 rounded">[imm 12b][rs1 5b][funct3 3b][rd 5b][opcode 7b]</code>
            <span class="text-[11px] text-slate-400 mt-1 block">addi, andi, ori, lw, lb, jalr (imm: -2048 a +2047)</span>
          </div>
          <div class="p-2.5 bg-[#080d1a] rounded-xl border border-slate-800">
            <span class="text-purple-400 font-bold block mb-1">Tipo-S (Guardado en Memoria)</span>
            <code class="text-[10px] text-slate-300 block bg-slate-900 p-1.5 rounded">[imm 7b][rs2 5b][rs1 5b][funct3 3b][imm 5b][opcode 7b]</code>
            <span class="text-[11px] text-slate-400 mt-1 block">sw, sh, sb (divide el offset en dos campos)</span>
          </div>
          <div class="p-2.5 bg-[#080d1a] rounded-xl border border-slate-800">
            <span class="text-amber-400 font-bold block mb-1">Tipo-B (Saltos Condicionales)</span>
            <code class="text-[10px] text-slate-300 block bg-slate-900 p-1.5 rounded">[imm 7b][rs2 5b][rs1 5b][funct3 3b][imm 5b][opcode 7b]</code>
            <span class="text-[11px] text-slate-400 mt-1 block">beq, bne, blt, bge (salto relativo ±4KB, bit 0 implícito 0)</span>
          </div>
          <div class="p-2.5 bg-[#080d1a] rounded-xl border border-slate-800">
            <span class="text-emerald-400 font-bold block mb-1">Tipo-U (Inmediato Superior 20b)</span>
            <code class="text-[10px] text-slate-300 block bg-slate-900 p-1.5 rounded">[imm 20b][rd 5b][opcode 7b]</code>
            <span class="text-[11px] text-slate-400 mt-1 block">lui (bits 31:12), auipc</span>
          </div>
          <div class="p-2.5 bg-[#080d1a] rounded-xl border border-slate-800">
            <span class="text-rose-400 font-bold block mb-1">Tipo-J (Salto Largo Incondicional)</span>
            <code class="text-[10px] text-slate-300 block bg-slate-900 p-1.5 rounded">[imm 20b][rd 5b][opcode 7b]</code>
            <span class="text-[11px] text-slate-400 mt-1 block">jal (salto relativo ±1MB y guarda retorno en rd)</span>
          </div>
        </div>
      </div>

      <!-- VISTA 1: TARJETAS DETALLADAS -->
      <div v-if="riscvViewMode === 'cards'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="item in filteredRiscv"
          :key="item.id"
          class="bg-[#0d1527] rounded-2xl border border-slate-800 hover:border-cyan-500/40 p-4 sm:p-5 shadow-lg flex flex-col justify-between space-y-3 transition duration-200"
        >
          <div class="space-y-2">
            <!-- Barra superior del ítem -->
            <div class="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
              <div class="flex items-center gap-2">
                <span class="text-xs font-mono font-black text-cyan-300 px-2.5 py-0.5 rounded-lg bg-cyan-950/80 border border-cyan-500/30">
                  {{ item.name }}
                </span>
                <span
                  :class="getCategoryBadgeClass(item.category)"
                  class="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold border"
                >
                  {{ item.category }}
                </span>
              </div>
              <span v-if="item.format" class="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                {{ item.format }}
              </span>
            </div>

            <!-- Sintaxis canónica -->
            <div class="bg-[#080d1a] p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between">
              <code class="text-xs sm:text-sm font-mono text-cyan-200 font-bold overflow-x-auto">{{ item.syntax }}</code>
              <button
                @click="copySnippet(item.syntax, item.id + '-syntax')"
                class="ml-2 text-slate-500 hover:text-cyan-300 text-xs shrink-0 cursor-pointer"
                :title="copiedId === item.id + '-syntax' ? '¡Copiado!' : 'Copiar sintaxis'"
              >
                {{ copiedId === item.id + '-syntax' ? '✓ Copiado' : '📋' }}
              </button>
            </div>

            <!-- Expansión si es Pseudoinstrucción -->
            <div v-if="item.expansion" class="bg-purple-950/20 border border-purple-500/30 p-2.5 rounded-xl text-xs font-mono">
              <span class="text-purple-300 font-bold block text-[11px]">Equivalente en hardware real:</span>
              <code class="text-purple-200 font-bold text-xs">{{ item.expansion }}</code>
            </div>

            <!-- Explicación pedagógica clara -->
            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans pt-1">
              {{ item.description }}
            </p>
          </div>

          <!-- Ejemplo de código en uso -->
          <div class="pt-2 border-t border-slate-800/80">
            <div class="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
              <span>Ejemplo de uso:</span>
              <button
                @click="copySnippet(item.example, item.id + '-ex')"
                class="hover:text-cyan-300 text-[10px] cursor-pointer"
              >
                {{ copiedId === item.id + '-ex' ? '✓ Copiado' : 'Copiar ejemplo' }}
              </button>
            </div>
            <pre class="bg-[#080d1a] p-2.5 rounded-xl border border-slate-800 text-xs font-mono text-emerald-300/90 whitespace-pre-wrap overflow-x-auto"><code>{{ item.example }}</code></pre>
          </div>
        </div>
      </div>

      <!-- VISTA 2: TABLA RESUMEN COMPACTA -->
      <div v-else class="bg-[#0d1527] rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs font-mono">
            <thead class="bg-[#080d1a] border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
              <tr>
                <th class="p-3">Nombre</th>
                <th class="p-3">Categoría</th>
                <th class="p-3">Sintaxis Canónica</th>
                <th class="p-3">Formato / Detalle</th>
                <th class="p-3">Descripción Pedagógica</th>
                <th class="p-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60">
              <tr
                v-for="item in filteredRiscv"
                :key="item.id"
                class="hover:bg-slate-800/30 transition duration-150"
              >
                <td class="p-3 font-bold text-cyan-300 font-mono">{{ item.name }}</td>
                <td class="p-3">
                  <span
                    :class="getCategoryBadgeClass(item.category)"
                    class="text-[10px] px-2 py-0.5 rounded-full font-bold border inline-block"
                  >
                    {{ item.category }}
                  </span>
                </td>
                <td class="p-3 text-cyan-200">
                  <code class="bg-[#080d1a] px-2 py-1 rounded border border-slate-800">{{ item.syntax }}</code>
                </td>
                <td class="p-3 text-slate-400">
                  <span v-if="item.format" class="text-purple-300">{{ item.format }}</span>
                  <span v-else-if="item.expansion" class="text-amber-300 font-mono text-[10px]">{{ item.expansion }}</span>
                  <span v-else class="text-slate-600">—</span>
                </td>
                <td class="p-3 text-slate-300 font-sans max-w-md text-xs leading-relaxed">
                  {{ item.description }}
                </td>
                <td class="p-3 text-right">
                  <button
                    @click="copySnippet(item.example, item.id + '-table')"
                    class="px-2 py-1 bg-[#080d1a] hover:bg-cyan-500/20 hover:text-cyan-300 text-slate-400 border border-slate-800 rounded text-[10px] transition cursor-pointer"
                    :title="copiedId === item.id + '-table' ? '¡Copiado!' : 'Copiar ejemplo de código'"
                  >
                    {{ copiedId === item.id + '-table' ? '✓' : 'Copiar' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { FORMULAS, type FormulaItem } from '../data/formulasData';
import { RISCV_RESERVED_WORDS, type RiscvKeywordItem } from '../data/riscvReservedData';
import katex from 'katex';

// Modos principales
const activeMainTab = ref<'formulas' | 'riscv'>('formulas');
const riscvViewMode = ref<'cards' | 'table'>('cards');
const searchQuery = ref('');
const copiedId = ref<string | null>(null);

// Fórmulas Matemáticas
const formulaCategories = ['Todas', 'Léxico', 'Sintáctico', 'Semántico', 'Código Intermedio', 'RISC-V'];
const selectedFormulaCategory = ref('Todas');
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
    const matchCat = selectedFormulaCategory.value === 'Todas' || f.category === selectedFormulaCategory.value;
    const q = searchQuery.value.trim().toLowerCase();
    const matchQuery =
      !q ||
      f.name.toLowerCase().includes(q) ||
      f.id.toLowerCase().includes(q) ||
      f.whenToUse.toLowerCase().includes(q);
    return matchCat && matchQuery;
  });
});

// Palabras Reservadas RISC-V
const riscvCategories = ['Todas', 'Opcode', 'Pseudoinstrucción', 'Registro', 'Directiva', 'Syscall', 'Formato'] as const;
const selectedRiscvCategory = ref<string>('Todas');

function getCategoryIcon(cat: string): string {
  switch (cat) {
    case 'Opcode': return '⚙️';
    case 'Pseudoinstrucción': return '🪄';
    case 'Registro': return '📦';
    case 'Directiva': return '🏷️';
    case 'Syscall': return '📞';
    case 'Formato': return '📐';
    default: return '🌟';
  }
}

function getRiscvCountByCategory(cat: string): number {
  if (cat === 'Todas') return RISCV_RESERVED_WORDS.length;
  return RISCV_RESERVED_WORDS.filter(w => w.category === cat).length;
}

function getCategoryBadgeClass(category: RiscvKeywordItem['category']): string {
  switch (category) {
    case 'Opcode':
      return 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40';
    case 'Pseudoinstrucción':
      return 'bg-purple-950/80 text-purple-300 border-purple-500/40';
    case 'Registro':
      return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
    case 'Directiva':
      return 'bg-amber-950/80 text-amber-300 border-amber-500/40';
    case 'Syscall':
      return 'bg-rose-950/80 text-rose-300 border-rose-500/40';
    case 'Formato':
      return 'bg-sky-950/80 text-sky-300 border-sky-500/40';
    default:
      return 'bg-slate-900 text-slate-300 border-slate-700';
  }
}

const filteredRiscv = computed(() => {
  return RISCV_RESERVED_WORDS.filter((item) => {
    const matchCat = selectedRiscvCategory.value === 'Todas' || item.category === selectedRiscvCategory.value;
    const q = searchQuery.value.trim().toLowerCase();
    const matchQuery =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.syntax.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      (item.format && item.format.toLowerCase().includes(q)) ||
      (item.expansion && item.expansion.toLowerCase().includes(q));
    return matchCat && matchQuery;
  });
});

async function copySnippet(text: string, id: string) {
  try {
    await navigator.clipboard.writeText(text);
    copiedId.value = id;
    setTimeout(() => {
      if (copiedId.value === id) copiedId.value = null;
    }, 2000);
  } catch (err) {
    console.error('Error al copiar al portapapeles:', err);
  }
}
</script>
