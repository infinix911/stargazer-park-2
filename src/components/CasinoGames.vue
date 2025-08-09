<template>
  <section class="py-8 bg-[#101010]">
    <div class="max-w-[1660px] mx-auto px-4">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-3xl font-black flex items-center space-x-4">
          <div class="bg-white rounded-lg p-1">
            <img 
              src="/images/section/casino.svg" 
              alt="Casino Games" 
              class="w-8 h-8 filter brightness-0 invert-1"
            />
          </div>
          <span>{{ $t('sections.casino') }}</span>
        </h2>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <GameMediaCard
          v-for="casino in casinoGames"
          :key="casino.id"
          :title="casino.title"
          :korean-title="casino.koreanTitle"
          :provider="casino.provider"
          :image-src="casino.imageSrc"
          :video-src="casino.videoSrc"
          :is-live="casino.isLive"
          @click="selectCasino(casino)"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import GameMediaCard from './GameMediaCard.vue'

interface CasinoGame {
  id: number
  title: string
  koreanTitle: string
  provider: string
  imageSrc: string
  videoSrc: string
  isLive: boolean
}

// Define emits
const emit = defineEmits<{
  'casino-selected': [casino: CasinoGame]
}>()

// Reactive data
const casinoGames = ref<CasinoGame[]>([
  { 
    id: 1, 
    title: 'EVOLUTION', 
    koreanTitle: '에볼루션', 
    provider: 'Evolution',
    imageSrc: '/images/casino/evolution.webp',
    videoSrc: '/images/casino/evolution.webm',
    isLive: true
  },
  { 
    id: 2, 
    title: 'PRAGMATICPLAY', 
    koreanTitle: '프라그마틱 라이브', 
    provider: 'Pragmatic Play Live',
    imageSrc: '/images/casino/pragmatic.webp',
    videoSrc: '/images/casino/pragmatic.webm',
    isLive: true
  },
  { 
    id: 3, 
    title: 'MICROGAMING', 
    koreanTitle: '마이크로 게이밍', 
    provider: 'Microgaming',
    imageSrc: '/images/casino/microgaming.webp',
    videoSrc: '/images/casino/microgaming.webm',
    isLive: true
  },
  { 
    id: 4, 
    title: 'ASIA GAMING', 
    koreanTitle: '아시아 게이밍', 
    provider: 'Asia Gaming',
    imageSrc: '/images/casino/asiagaming.webp',
    videoSrc: '/images/casino/asiagaming.webm',
    isLive: true
  },
  { 
    id: 5, 
    title: 'WM CASINO', 
    koreanTitle: 'WM카지노', 
    provider: 'WM Casino',
    imageSrc: '/images/casino/wmcasino.webp',
    videoSrc: '/images/casino/wmcasino.webm',
    isLive: true
  },
  { 
    id: 6, 
    title: 'DREAM GAMING', 
    koreanTitle: '드림카지노', 
    provider: 'Dream Gaming',
    imageSrc: '/images/casino/dreamgaming.webp',
    videoSrc: '/images/casino/dreamgaming.webm',
    isLive: true
  }
])

// Methods
const selectCasino = (casino: CasinoGame): void => {
  console.log(`Selected casino: ${casino.title}`)
  emit('casino-selected', casino)
}
</script>

<style scoped>
/* Casino games specific styles */
.casino-glow {
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
}

.casino-card:hover .casino-glow {
  box-shadow: 0 0 30px rgba(168, 85, 247, 0.6);
}
</style>