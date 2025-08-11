<template>
  <div class="min-h-screen bg-gray-900 text-white overflow-x-hidden">
    <!-- Top Bar -->
    <TopBar />
    
    <!-- Header -->
    <Header />
    
    <!-- Hero Section -->
    <HeroSection @slide-change="handleSlideChange" />
    
    <!-- Hot Brands Section -->
    <!-- HotBrandBackground component -->
    <HotBrandBackground :current-slide="currentSlide" />
    
    <!-- Router View for Page Content -->
    <router-view :key="route.fullPath" />
    
    <!-- Provider Section -->
    <ProviderSection />
    
    <!-- Footer -->
    <Footer 
      @open-customer-service="handleCustomerService"
      @nav-click="handleNavClick"
    />
    
    <!-- Scroll to Top Button -->
    <ScrollToTop />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
// Import layout components
import TopBar from '../components/topbar/TopBar.vue'
import Header from '../components/Header.vue'
import HeroSection from '../components/HeroSection.vue'
import HotBrandBackground from '../components/hotbrand/HotBrandBackground.vue'
//import HotBrands from '../components/HotBrands.vue'
import ProviderSection from '../components/ProviderSection.vue'
import Footer from '../components/footer/Footer.vue'
import ScrollToTop from '../components/ScrollToTop.vue'

// Reactive data for current slide
const currentSlide = ref(0)
const route = useRoute()

// Handle slide change from HeroSection
const handleSlideChange = (slideIndex: number): void => {
  //console.log('MainLayout: Slide changed to:', slideIndex)
  currentSlide.value = slideIndex
}

// Event handlers for layout interactions
// const handleGameSelected = (game: GameSelectedEvent): void => {
//   console.log('Hot brand game selected:', game)
// }

const handleCustomerService = (): void => {
  console.log('Opening customer service...')
}

const handleNavClick = (section: string): void => {
  console.log('Footer navigation clicked:', section)
}
</script>