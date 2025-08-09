<template>
  <div>
    <!-- Popular Games Section -->
    <PopularGames 
      @game-selected="handlePopularGameSelected"
    />
    
    <!-- Casino Games Section -->
    <CasinoGames 
      @casino-selected="handleCasinoSelected"
    />
    
    <!-- Slots Games Section -->
    <SlotsGames 
      @slot-selected="handleSlotSelected"
    />
  </div>
</template>

<script setup lang="ts">
// Import game components
import PopularGames from '../components/PopularGames.vue'
import CasinoGames from '../components/CasinoGames.vue'
import SlotsGames from '../components/SlotsGames.vue'

// Define interfaces to match component data structures
interface CasinoGame {
  id: number
  title: string
  koreanTitle: string
  provider: string
  imageSrc: string
  videoSrc: string
  isLive: boolean
}

interface SlotGame {
  id: number
  title: string
  koreanTitle: string
  provider: string
  imageSrc: string
  videoSrc: string
  isLive: boolean
}

// Event handlers for component interactions
const handlePopularGameSelected = (game: any): void => {
  console.log('Popular game selected:', game)
}

const handleCasinoSelected = (casino: CasinoGame): void => {
  console.log('Casino selected:', casino)
}

const handleSlotSelected = (slot: SlotGame): void => {
  console.log('Slot selected:', slot)
}
</script>

<style scoped>
/* HomePage specific styles */
</style>
