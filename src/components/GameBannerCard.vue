<template>
  <div class="game-media-card cursor-pointer group" @click="$emit('click')">
    <!-- Main Card Container -->
    <div class="relative rounded-lg overflow-hidden bg-gray-800">
      <!-- Game Media Container -->
      <div class="relative aspect-[3/4] w-full">
        <!-- Video -->
        <video 
          v-if="videoSrc"
          :src="videoSrc"
          class="absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:blur-sm"
          muted
          loop
          preload="metadata"
          playsinline
          autoplay
        ></video>
        
        <!-- Image -->
        <img 
          v-if="imageSrc"
          :src="imageSrc"
          :alt="title"
          class="absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:blur-sm"
        />

        <!-- Overlay with Game Info -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center">
          <!-- Game Title -->
          <div class="text-center mb-4 px-2">
            <div class="text-white text-sm sm:text-base lg:text-xl font-bold mb-1 truncate">{{ title }}</div>
            <div class="text-white/80 text-xs sm:text-sm truncate">{{ provider }}</div>
          </div>
          
          <!-- Play Button -->
          <div class="flex justify-center">
            <button class="cursor-pointer bg-[#1494dc] hover:bg-[#1494dc]/80 text-black py-1 px-3 sm:py-2 sm:px-6 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1 sm:space-x-2">
              <span>Game Play</span>
              <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Title  -->
    <div class="mt-2 px-1">
      <div class="text-white text-sm sm:text-base lg:text-lg text-left font-bold truncate">{{ subTitle }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">

interface Props {
  title: string
  subTitle: string
  provider: string
  imageSrc: string
  videoSrc?: string
}

defineProps<Props>()

defineEmits<{
  click: []
}>()

</script>

<style scoped>
.game-media-card {
  transition: all 0.3s ease;
}

.game-media-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.game-media-card:hover .relative {
  box-shadow: 0 0 30px rgba(59, 130, 246, 0.3);
}

/* Smooth transitions for all hover effects */
.game-media-card * {
  transition: all 0.3s ease;
}

/* Enhanced button hover effect */
.game-media-card button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}
</style> 