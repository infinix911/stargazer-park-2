<template>
  <div class="absolute inset-0 flex items-start justify-center mt-38 z-[41]">
    <div class="max-w-[1660px] mx-auto px-4 w-full">
      <div class="flex items-center justify-center">
        <!-- Banner 1: Slot Text -->
        <div 
          v-if="props.currentSlide === 0" 
          :class="['max-w-4xl text-left transition-all duration-1000', showText ? 'opacity-100' : 'opacity-0']"
        >
          <h2 class="text-5xl md:text-7xl font-black mb-6 leading-tight text-white font-pretendard-extra-bold">
            {{ t('banner.slot.title') }}<br>{{ t('banner.slot.titleLine2') }}
          </h2>
          <p class="text-xl md:text-2xl font-bold mb-8 opacity-90 text-white font-pretendard">
            {{ t('banner.slot.subtitle') }}
          </p>
        </div>

        <!-- Banner 2: Casino Text -->
        <div 
          v-if="props.currentSlide === 1" 
          :class="['max-w-4xl text-left transition-all duration-1000', showText ? 'opacity-100' : 'opacity-0']"
        >
          <h2 class="text-5xl md:text-7xl font-black mb-6 leading-tight text-white font-pretendard-extra-bold">
            {{ t('banner.casino.title') }}<br>{{ t('banner.casino.titleLine2') }}
          </h2>
          <p class="text-xl md:text-2xl font-bold mb-8 opacity-90 text-white font-pretendard">
            {{ t('banner.casino.subtitle') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Define props
interface Props {
  currentSlide: number
}

const props = defineProps<Props>()

// Reactive state for text visibility
const showText = ref(false)

// Watch for slide changes and reset text visibility
watch(() => props.currentSlide, () => {
  showText.value = false
  setTimeout(() => {
    showText.value = true
  }, 1500) // Show text after 1.5 seconds
})

// Initialize text visibility on mount
onMounted(() => {
  setTimeout(() => {
    showText.value = true
  }, 1500) // Show text after 1.5 seconds
})
</script>

<style scoped>
/* Font face declarations for Pretendard */
@font-face {
  font-family: 'Pretendard';
  src: url('/fonts/Pretendard.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: 'Pretendard';
  src: url('/fonts/Pretendard.ttf') format('truetype');
  font-weight: 800; /* Extra Bold */
  font-style: normal;
}

/* Pretendard font utility classes */
.font-pretendard {
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
}

.font-pretendard-extra-bold {
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
  font-weight: 800 !important; /* Extra Bold */
}
</style>
