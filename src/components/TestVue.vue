<template>
  <div class="p-4 bg-emerald-900/40 rounded border border-emerald-500/30 text-emerald-300">
    <p>Vue 3 Island Test: Counter: {{ count }}</p>
    <button @click="count++" class="px-3 py-1 bg-emerald-700 text-white rounded mt-2">Incrementar</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const count = ref(0);
</script>

