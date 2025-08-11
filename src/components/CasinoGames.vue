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
          <span>{{ t('sections.casino') }}</span>
        </h2>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <GameMediaCard
          v-for="casino in casinoGames"
          :key="casino.id"
          :title="casino.title"
          :sub-title="casino.subTitle"
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
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import GameMediaCard from './GameMediaCard.vue'

const { t } = useI18n()

interface Game {
  code: string;
  provider: string;
  sort: number;
  type: string;
}

interface CasinoGame {
  id: number
  title: string
  subTitle: string
  provider: string
  type: string
  code: string
  imageSrc: string
  videoSrc: string
  isLive: boolean
}

// Define props
interface Props {
  games?: Game[]
}

const props = withDefaults(defineProps<Props>(), {
  games: () => []
})

// Define emits
const emit = defineEmits<{
  'casino-selected': [casino: CasinoGame]
}>()

// Use props data
const casinoGames = computed(() => {
  if (props.games && props.games.length > 0) {
    // Transform Game data to CasinoGame format
    return props.games.map((game, index) => ({
      id: index + 1,
      title: t(`games.${game.code}`) || game.code,
      subTitle: t(`games.${game.code}`) || game.code,
      provider: game.provider,
      type: game.type,
      code: game.code,
      imageSrc: `/images/casino/${game.code.toLowerCase()}.webp`,
      videoSrc: `/images/casino/${game.code.toLowerCase()}.webm`,
      isLive: true
    }))
  }
  return []
})

// Select casino
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