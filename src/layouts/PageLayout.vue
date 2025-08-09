<template>
  <div class="min-h-screen bg-gray-900 text-white overflow-x-hidden">
    <!-- TopBar -->
    <TopBar />
    
    <!-- Header -->
    <Header />
    
    <!-- Router View for Page Content -->
    <router-view :key="$route.fullPath" />
    
    <!-- Footer -->
    <Footer 
      @open-customer-service="handleCustomerService"
      @nav-click="handleNavClick"
    />
  </div>
</template>

<script setup lang="ts">
// Import layout components
import TopBar from '../components/topbar/TopBar.vue'
import Header from '../components/Header.vue'
import Footer from '../components/footer/Footer.vue'

// Event handlers for layout interactions
const handleCustomerService = (): void => {
  console.log('Opening customer service...')
}

const handleNavClick = (section: string): void => {
  console.log('Footer navigation clicked:', section)
}
</script>

<style scoped>
/* PageLayout specific styles */
</style>
