<template>
  <div v-if="node" class="flex flex-col items-center relative font-mono text-xs">
    
    <!-- Línea conectora superior (si no es raíz) -->
    <div v-if="isChild" class="w-0.5 h-4 bg-slate-600/90 -mt-1 mb-1"></div>

    <!-- Etiqueta de Rama (izq / der) si corresponde -->
    <span
      v-if="branchLabel"
      class="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded-full mb-1 tracking-wider shadow-sm"
      :class="branchLabel === 'izq' ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40' : 'bg-purple-950/80 text-purple-300 border border-purple-500/40'"
    >
      {{ branchLabel }}
    </span>

    <!-- Nodo Visual del Árbol -->
    <div
      :class="getNodeStyle(node.type)"
      class="relative z-10 px-3.5 py-2 rounded-2xl border shadow-xl flex items-center gap-2 cursor-default transition-all duration-300 hover:scale-110 hover:shadow-cyan-500/20"
    >
      <!-- Icono o badge del tipo de nodo -->
      <span class="w-2 h-2 rounded-full" :class="getNodeDotColor(node.type)"></span>
      <div class="flex flex-col items-start leading-tight">
        <span class="text-[9px] uppercase tracking-wider font-sans font-bold opacity-75">
          {{ formatNodeType(node.type) }}
        </span>
        <span class="font-extrabold text-sm sm:text-base font-mono">
          {{ node.value || (node.children ? 'Programa' : '') }}
        </span>
      </div>
    </div>

    <!-- Tallo vertical inferior si tiene descendientes -->
    <div v-if="hasChildren" class="w-0.5 h-4 bg-gradient-to-b from-slate-600 to-cyan-500/60 mt-1"></div>

    <!-- Contenedor de Ramas Hijas con Barra Horizontal de Conexión -->
    <div v-if="hasChildren" class="relative flex items-start justify-center pt-2">
      <!-- Barra horizontal transversal que une a los hermanos -->
      <div
        v-if="childrenList.length > 1"
        class="absolute top-0 h-0.5 bg-slate-600/90"
        :style="{
          left: '25%',
          right: '25%'
        }"
      ></div>

      <!-- Ramas hijas -->
      <div class="flex items-start justify-center gap-6 sm:gap-10">
        <div
          v-for="(child, idx) in childrenList"
          :key="child.node.id || idx"
          class="flex flex-col items-center relative"
        >
          <!-- Conector vertical desde la barra transversal -->
          <div v-if="childrenList.length > 1" class="w-0.5 h-2 bg-slate-600/90 -mt-2 mb-1"></div>
          
          <AstTreeNode
            :node="child.node"
            :is-child="true"
            :branch-label="child.label"
          />
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ASTNode } from '../../utils/c3dParser';

const props = withDefaults(
  defineProps<{
    node: ASTNode | null;
    isChild?: boolean;
    branchLabel?: string;
  }>(),
  {
    isChild: false,
    branchLabel: ''
  }
);

interface ChildEntry {
  node: ASTNode;
  label: string;
}

const childrenList = computed<ChildEntry[]>(() => {
  if (!props.node) return [];
  const list: ChildEntry[] = [];
  if (props.node.left && props.node.right) {
    list.push({ node: props.node.left, label: 'izq' });
    list.push({ node: props.node.right, label: 'der' });
  } else if (props.node.left) {
    list.push({ node: props.node.left, label: 'izq' });
  } else if (props.node.right) {
    list.push({ node: props.node.right, label: 'der' });
  } else if (props.node.children && props.node.children.length > 0) {
    props.node.children.forEach((c, idx) => {
      list.push({ node: c, label: `op ${idx + 1}` });
    });
  }
  return list;
});

const hasChildren = computed(() => childrenList.value.length > 0);

function formatNodeType(type: string): string {
  const map: Record<string, string> = {
    BinaryOp: 'Op. Binaria',
    UnaryOp: 'Op. Unaria',
    RelationalOp: 'Op. Relacional',
    LogicalAnd: 'Lógico AND',
    LogicalOr: 'Lógico OR',
    Literal: 'Constante',
    Identifier: 'Identificador',
    Assignment: 'Asignación',
    ArrayAccess: 'Acceso Arreglo',
    FieldAccess: 'Campo Objeto',
    FunctionCall: 'Llamada Función'
  };
  return map[type] || type;
}

function getNodeStyle(type: string): string {
  switch (type) {
    case 'BinaryOp':
    case 'RelationalOp':
    case 'LogicalAnd':
    case 'LogicalOr':
      return 'bg-purple-950/95 border-purple-500/80 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.35)] ring-1 ring-purple-500/30';
    case 'UnaryOp':
      return 'bg-purple-900/90 border-purple-400 text-purple-200';
    case 'Literal':
      return 'bg-cyan-950/95 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.35)] ring-1 ring-cyan-500/30';
    case 'Identifier':
      return 'bg-sky-950/95 border-sky-400 text-sky-200 shadow-[0_0_15px_rgba(56,189,248,0.35)] ring-1 ring-sky-500/30';
    case 'Assignment':
      return 'bg-indigo-950/95 border-indigo-400 text-indigo-200 shadow-md';
    case 'ArrayAccess':
    case 'FieldAccess':
      return 'bg-emerald-950/95 border-emerald-400 text-emerald-200 shadow-md';
    default:
      return 'bg-slate-900/95 border-slate-700 text-slate-200 shadow-md';
  }
}

function getNodeDotColor(type: string): string {
  switch (type) {
    case 'BinaryOp':
    case 'RelationalOp':
    case 'LogicalAnd':
    case 'LogicalOr':
      return 'bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.9)]';
    case 'Literal':
      return 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)]';
    case 'Identifier':
      return 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.9)]';
    case 'ArrayAccess':
    case 'FieldAccess':
      return 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]';
    default:
      return 'bg-slate-400';
  }
}
</script>
