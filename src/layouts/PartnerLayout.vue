<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 relative overflow-hidden text-white">
    <!-- TopBar -->
    <TopBar />
    
    <!-- Header with Partner Navigation -->
    <Header :is-partner="true" />
    
    <!-- Animated Background Pattern -->
    <div class="absolute inset-0 opacity-20 pointer-events-none">
      <div class="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
      <div class="absolute top-0 right-0 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
      <div class="absolute bottom-0 left-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
    </div>

    <!-- Main Content Area -->
    <main class="relative z-10 flex-1">
      <router-view :key="route.fullPath" />
    </main>

    <!-- Footer -->
    <Footer 
      @open-customer-service="handleCustomerService"
      @nav-click="handleNavClick"
    />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
// Import layout components
import TopBar from '../components/topbar/TopBar.vue'
import Header from '../components/Header.vue'
import Footer from '../components/footer/Footer.vue'

const route = useRoute()

// Event handlers for layout interactions
const handleCustomerService = (): void => {
  console.log('Opening customer service...')
}

const handleNavClick = (section: string): void => {
  console.log('Footer navigation clicked:', section)
}
</script>

<style scoped>
/* Custom scrollbar for content */
main {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

main::-webkit-scrollbar {
  width: 6px;
}

main::-webkit-scrollbar-track {
  background: transparent;
}

main::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

main::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* Smooth transitions */
* {
  transition-property: color, background-color, border-color, transform, opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Animation for dropdowns */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Mobile menu animation */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  transform-origin: top;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: scaleY(0);
}

/* Focus styles for accessibility */
button:focus-visible,
a:focus-visible {
  outline: 2px solid rgba(59, 130, 246, 0.8);
  outline-offset: 2px;
}

/* Router link exact active state */
.router-link-exact-active {
  background-color: rgba(255, 255, 255, 0.2) !important;
  color: white !important;
}

/* Animation keyframes for background */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.2;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.3;
  }
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>