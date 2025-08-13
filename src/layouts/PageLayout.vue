<template>
  <div class="min-h-screen bg-gray-900 text-white overflow-x-hidden">
    <!-- TopBar -->
    <TopBar />
    
    <!-- Header -->
    <Header />
    
    <!-- Router View for Page Content -->
    <router-view :key="route.fullPath" />
    
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
/* PageLayout specific styles */
</style>
