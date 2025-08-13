<template>
  <Button 
    variant="ghost"
    size="sm"
    @click="$emit('click')"
    class="cursor-pointer flex items-center hover:text-blue-400 transition-colors group h-auto p-1 lg:p-2"
  >
    <span class="text-xs lg:text-sm font-medium text-[#45443f] group-hover:text-blue-400">
      {{ label }}
    </span>
  </Button>
</template>

<script setup lang="ts">
// Navigation item component with TypeScript
import Button from '../ui/Button.vue'

interface Props {
  label: string
}

defineProps<Props>()

// Define emits
defineEmits<{
  click: []
}>()
</script>

<style scoped>
/* NavItem specific styles handled by shadcn Button component */
</style>