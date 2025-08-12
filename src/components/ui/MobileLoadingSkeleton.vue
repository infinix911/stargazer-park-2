<template>
  <div class="lg:hidden space-y-4">
    <div
      v-for="i in count"
      :key="i"
      class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 animate-pulse"
    >
      <div class="flex items-center justify-between mb-3">
        <div class="w-24 h-4 bg-white/10 rounded"></div>
        <div class="w-16 h-4 bg-white/10 rounded"></div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <div class="w-16 h-3 bg-white/10 rounded"></div>
          <div class="w-20 h-4 bg-white/10 rounded"></div>
        </div>
        <div class="space-y-2">
          <div class="w-16 h-3 bg-white/10 rounded"></div>
          <div class="w-20 h-4 bg-white/10 rounded"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  count?: number;
}

withDefaults(defineProps<Props>(), {
  count: 3,
});
</script> 