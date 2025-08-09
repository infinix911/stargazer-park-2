<template>
  <section class="relative min-h-screen overflow-hidden hero-section">
    <!-- Banner Navigation -->
    <BannerNavigation :current-slide="currentSlide" />
    <!-- Banner Heading -->
    <BannerHeading :current-slide="currentSlide" />
    <!-- Dark gradient overlay at bottom -->
    <div class="absolute bottom-0 left-0 right-0 h-32 z-10" style="background-image: linear-gradient(to bottom, rgba(17, 17, 19, 0) 0%, #111113 100%);"></div>
    <!-- Carousel Container -->
    <Carousel 
      ref="carouselRef" 
      class="w-full h-screen" 
      :opts="{ loop: true }"
      @slide-change="handleSlideChange"
    >
      <CarouselContent class="h-screen !-ml-0">
        <!-- Banner 1: Slot -->
        <CarouselItem class="!pl-0 h-screen">
          <div class="relative w-full h-full bg-gradient-to-r from-red-900 via-red-700 to-orange-600">
            <img 
              src="/images/banner/slot.webp" 
              alt="Slot Games Banner"
              :class="['w-full h-full object-cover', currentSlide === 0 ? 'banner-zoom' : '']"
              @error="handleImageError"
              @load="handleImageLoad"
              style="display: block;"
            />
            <!-- Slot Machine Image -->
            <div 
              v-if="currentSlide === 0"
              :key="`slot-machine-${currentSlide}`"
              class="absolute -left-30 top-3/4 transform -translate-y-1/2 left-image-slide"
            >
              <img 
                src="/images/banner/slot-machine.webp" 
                alt="Slot Machine"
                class="h-[985px] w-auto object-contain"
              />
            </div>
          </div>
        </CarouselItem>

        <!-- Banner 2: Casino -->
        <CarouselItem class="!pl-0 h-screen">
          <div class="relative w-full h-full bg-gradient-to-r from-blue-900 via-blue-700 to-green-600">
            <img 
              src="/images/banner/casino.webp" 
              alt="Casino Games Banner"
              :class="['w-full h-full object-cover', currentSlide === 1 ? 'banner-zoom' : '']"
              @error="handleImageError"
              @load="handleImageLoad"
              style="display: block;"
            />
            <!-- Roulette Image -->
            <div 
              v-if="currentSlide === 1"
              :key="`roulette-${currentSlide}`"
              class="absolute -left-30 top-3/4 transform -translate-y-1/2 left-image-slide"
            >
              <img 
                src="/images/banner/roulette.webp" 
                alt="Roulette"
                class="h-[832px] w-auto object-contain"
              />
            </div>
          </div>
        </CarouselItem>
      </CarouselContent>

      <!-- Navigation Arrows -->
      <CarouselPrevious class="carousel-nav-btn absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-500/50 hover:bg-opacity-90 border-0 z-20 rounded-[20px] shadow-lg transition-all duration-200 w-20 h-20" />
      <CarouselNext class="carousel-nav-btn absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-500/50 hover:bg-opacity-90 border-0 z-20 rounded-[20px] shadow-lg transition-all duration-200 w-20 h-20" />
    </Carousel>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
// Import carousel components
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel'
// Import BannerNavigation component
import BannerNavigation from './banner/BannerNavigation.vue'
// Import BannerHeading component
import BannerHeading from './banner/BannerHeading.vue'


// Carousel ref for autoplay
const carouselRef = ref()

// Current slide tracking
const currentSlide = ref(0)

// Autoplay interval
let autoplayInterval: number | null = null

// Image event handlers
const handleImageError = (event: Event): void => {
  console.error('Image failed to load:', event)
}

const handleImageLoad = (event: Event): void => {
  console.log('Image loaded successfully:', event)
}

// Define emits
const emit = defineEmits<{
  'slide-change': [slideIndex: number]
}>()

// Handle slide change
const handleSlideChange = (slideIndex: number): void => {
  console.log('HeroSection: Slide changed to:', slideIndex)
  currentSlide.value = slideIndex
  emit('slide-change', slideIndex)
}

// Autoplay functionality
const startAutoplay = (): void => {
  autoplayInterval = setInterval(() => {
    if (carouselRef.value?.scrollNext) {
      carouselRef.value.scrollNext()
      // Update current slide and emit change
      const newSlide = (currentSlide.value + 1) % 2
      currentSlide.value = newSlide
      emit('slide-change', newSlide)
    }
  }, 5000) // Change slide every 5 seconds
}

const stopAutoplay = (): void => {
  if (autoplayInterval) {
    clearInterval(autoplayInterval)
    autoplayInterval = null
  }
}

// Lifecycle hooks
onMounted(() => {
  startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()
})
</script>

<style scoped>
/* Hero specific animations */
.float-animation {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

/* Carousel navigation button icons */
.carousel-nav-btn :deep(svg) {
  width: 32px !important;
  height: 32px !important;
  color: #000000 !important; /* dark gray */
}

/* Banner zoom effect */
.banner-zoom {
  animation: bannerZoom 8s ease-in-out infinite;
  transform-origin: center center;
}

@keyframes bannerZoom {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.1);
  }
}

/* Slot machine slide animation */
.left-image-slide {
  animation: slideInFromLeft 2s ease-out forwards;
  transform: translateX(-100%);
}

@keyframes slideInFromLeft {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
}

</style>