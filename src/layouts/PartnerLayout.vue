<template>
  <div class="min-h-screen relative overflow-hidden text-white" style="background-image: linear-gradient(to bottom, #202436, #11131c);">
    <!-- Casino Banner Background Accent -->
    <div 
      class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5 pointer-events-none"
      style="background-image: url('/images/banner/casino.webp')"
    ></div>
    
    <!-- TopBar -->
    <TopBar />
    
    <!-- Header with Partner Navigation -->
    <Header :is-partner="true" />

    <!-- Main Content Area -->
    <main class="relative z-10 flex-1">
      <router-view :key="route.fullPath" />
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
// Import layout components
import TopBar from '../components/topbar/TopBar.vue'
import Header from '../components/Header.vue'
import Footer from '../components/footer/Footer.vue'

const route = useRoute()

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
</style>