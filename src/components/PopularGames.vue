<template>
  <section class="py-8 bg-[#101010]">
    <div class="max-w-[1660px] mx-auto px-4">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-3xl font-black flex items-center space-x-4">
          <div class="bg-white rounded-lg p-1">
            <img 
              src="/images/section/popular.svg" 
              alt="Popular Games" 
              class="w-8 h-8 filter brightness-0 invert-1"
            />
          </div>
          <span>{{ t('sections.popular') }}</span>
        </h2>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <GameBannerCard
          v-for="game in popularGames"
          :key="game.id"
          :title="game.title"
          :sub-title="game.koreanTitle"
          :provider="game.provider"
          :image-src="game.imageSrc"
          :video-src="game.videoSrc"

          @click="selectGame(game)"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import GameBannerCard from './GameBannerCard.vue'

const { t } = useI18n()

interface PopularGame {
  id: number
  title: string
  koreanTitle: string
  provider: string
  imageSrc: string
  videoSrc: string
}

// Define emits
const emit = defineEmits<{
  'game-selected': [game: PopularGame]
}>()

// Reactive data
const popularGames = ref<PopularGame[]>([
  { 
    id: 1, 
    title: 'MEGA WHEEL', 
    koreanTitle: '메가휠', 
    provider: 'Pragmatic Play Live',
    imageSrc: '/images/popular/mega-wheel.webp',
    videoSrc: '/images/popular/mega-wheel.webm'
  },
  { 
    id: 2, 
    title: 'SICBO', 
    koreanTitle: '식보', 
    provider: 'Evolution',
    imageSrc: '/images/popular/sicbo.webp',
    videoSrc: '/images/popular/sicbo.webm'
  },
  { 
    id: 3, 
    title: 'MEGA ROULETTE', 
    koreanTitle: '메가룰렛', 
    provider: 'Pragmatic Play Live',
    imageSrc: '/images/popular/mega-roulette.webp',
    videoSrc: '/images/popular/mega-roulette.webm'
  },
  { 
    id: 4, 
    title: 'DRAGON TIGER', 
    koreanTitle: '용호', 
    provider: 'Evolution',
    imageSrc: '/images/popular/dragon-tiger.webp',
    videoSrc: '/images/popular/dragon-tiger.webm'
  },
  { 
    id: 5, 
    title: 'INSTANT ROULETTE', 
    koreanTitle: '인스턴트 룰렛', 
    provider: 'Evolution',
    imageSrc: '/images/popular/instant-roulette.webp',
    videoSrc: '/images/popular/instant-roulette.webm'
  },
  { 
    id: 6, 
    title: 'POWER BALL', 
    koreanTitle: '파워볼', 
    provider: 'Evolution',
    imageSrc: '/images/popular/power-ball.webp',
    videoSrc: '/images/popular/power-ball.webm'
  }
])

// Methods
const selectGame = (game: PopularGame): void => {
  console.log(`Selected popular game: ${game.title}`)
  emit('game-selected', game)
}
</script>

<style scoped>
/* Popular games specific styles */
.popular-glow {
  box-shadow: 0 0 20px rgba(251, 191, 36, 0.4);
}

.popular-card:hover .popular-glow {
  box-shadow: 0 0 30px rgba(251, 191, 36, 0.6);
}
</style> 