<template>
  <div class="bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-white/10 bg-gradient-to-r from-white/5 to-white/10 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="p-2 rounded-lg" :class="iconBgClass" :style="iconBgStyle">
          <i :class="[iconClass, iconColorClass, 'text-sm']" :style="iconColorStyle"></i>
        </div>
        <div>
          <h2 class="text-lg font-semibold text-white">{{ title }}</h2>
          <p class="text-xs text-gray-400">{{ subtitle }}</p>
        </div>
      </div>
      <div class="text-xs text-gray-400">
        <i class="fas fa-table mr-1"></i>
        {{ recordCount }} records
      </div>
    </div>
    
    <!-- Content -->
    <div class="px-10 pb-5">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface Props {
  title: string
  subtitle: string
  recordCount: number
  icon: string
  iconColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  iconColor: '#3b82f6' // blue-500 as default
})

const iconClass = computed(() => props.icon)

// Check if iconColor is a hex value or predefined color name
const isHexColor = computed(() => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(props.iconColor))

const iconColorStyle = computed(() => {
  if (isHexColor.value) {
    return { color: props.iconColor }
  }
  return {}
})

const iconBgStyle = computed(() => {
  if (isHexColor.value) {
    // Convert hex to RGB and add 20% opacity
    const hex = props.iconColor.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    return { backgroundColor: `rgba(${r}, ${g}, ${b}, 0.2)` }
  }
  return {}
})

const iconColorClass = computed(() => {
  if (isHexColor.value) return ''
  
  const colors: Record<string, string> = {
    blue: 'text-blue-400',
    green: 'text-green-400', 
    red: 'text-red-400',
    yellow: 'text-yellow-400',
    purple: 'text-purple-400'
  }
  return colors[props.iconColor] || 'text-blue-400'
})

const iconBgClass = computed(() => {
  if (isHexColor.value) return ''
  
  const bgColors: Record<string, string> = {
    blue: 'bg-blue-500/20',
    green: 'bg-green-500/20',
    red: 'bg-red-500/20', 
    yellow: 'bg-yellow-500/20',
    purple: 'bg-purple-500/20'
  }
  return bgColors[props.iconColor] || 'bg-blue-500/20'
})
</script>