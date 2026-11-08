<template>
  <div v-if="node" class="flex flex-col items-center my-1 font-mono text-xs">
    <!-- Nodo actual -->
    <div
      :class="getNodeStyle(node.type)"
      class="px-3 py-1.5 rounded-xl border shadow-lg flex items-center gap-1.5 cursor-default transition-all duration-200 hover:scale-105"
    >
      <span class="text-[10px] uppercase tracking-wider opacity-75 font-sans">{{ node.type }}</span>
      <span class="font-bold text-sm">{{ node.value || (node.children ? 'Raíz' : '') }}</span>
    </div>

    <!-- Hijos directos (left y right, o children) -->
    <div v-if="hasChildren" class="flex items-start justify-center gap-4 sm:gap-6 mt-3 relative pt-3 border-t border-slate-700">
      <div v-if="node.left" class="flex flex-col items-center">
        <AstTreeNode :node="node.left" />
      </div>
      <div v-if="node.right" class="flex flex-col items-center">
        <AstTreeNode :node="node.right" />
      </div>
      <div v-if="node.children && node.children.length > 0" class="flex items-start gap-4">
        <AstTreeNode v-for="child in node.children" :key="child.id" :node="child" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ASTNode } from '../../utils/c3dParser';

const props = defineProps<{
  node: ASTNode | null;
}>();

const hasChildren = computed(() => {
  if (!props.node) return false;
  return !!(props.node.left || props.node.right || (props.node.children && props.node.children.length > 0));
});

function getNodeStyle(type: string): string {
  switch (type) {
    case 'BinaryOp':
    case 'LogicalAnd':
    case 'LogicalOr':
    case 'RelationalOp':
      return 'bg-purple-950/90 border-purple-400 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.4)]';
    case 'UnaryOp':
      return 'bg-purple-900/90 border-purple-400/80 text-purple-200';
    case 'Literal':
      return 'bg-cyan-950/90 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.4)]';
    case 'Identifier':
      return 'bg-sky-950/90 border-sky-400 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.4)]';
    case 'Assignment':
      return 'bg-indigo-950/90 border-indigo-400 text-indigo-200';
    case 'ArrayAccess':
      return 'bg-teal-950/90 border-teal-400 text-teal-200';
    default:
      return 'bg-slate-900 border-slate-700 text-slate-200';
  }
}
</script>
