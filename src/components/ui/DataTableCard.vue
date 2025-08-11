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
    <div class="px-10 pb-5 relative">
      <!-- Loading Overlay -->
      <div 
        v-if="loading" 
        class="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-lg z-10 flex items-center justify-center animate-in fade-in duration-300"
      >
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-3"></div>
          <p class="text-white text-sm font-medium">{{ t('common.loading') }}</p>
        </div>
      </div>
      
      <!-- Content with loading animation -->
      <div :class="{ 'opacity-50': loading, 'transition-all duration-300 ease-in-out': true }">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

export interface Props {
  title: string
  subtitle: string
  recordCount: number
  icon: string
  iconColor?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  iconColor: '#3b82f6', // blue-500 as default
  loading: false
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

<style scoped>
/* Smooth loading transitions */
.animate-in {
  animation: fadeIn 0.3s ease-in-out;
}

.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Smooth opacity transitions */
.transition-all {
  transition: all 0.3s ease-in-out;
}

.transition-opacity {
  transition: opacity 0.3s ease-in-out;
}
</style>