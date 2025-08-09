<template>
  <Transition name="scroll-to-top">
    <button
      v-if="showScrollToTop"
      @click="scrollToTop"
      class="fixed bottom-8 right-8 z-50 bg-red-500 hover:bg-red-600 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      aria-label="Scroll to top"
    >
      <svg 
        class="w-6 h-6" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// Reactive state
const showScrollToTop = ref(false)

// Scroll threshold to show the button
const SCROLL_THRESHOLD = 300

// Handle scroll event
const handleScroll = (): void => {
  showScrollToTop.value = window.scrollY > SCROLL_THRESHOLD
}

// Scroll to top function
const scrollToTop = (): void => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// Lifecycle hooks
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* Transition animations */
.scroll-to-top-enter-active,
.scroll-to-top-leave-active {
  transition: all 0.3s ease;
}

.scroll-to-top-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

.scroll-to-top-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

.scroll-to-top-enter-to,
.scroll-to-top-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style> 