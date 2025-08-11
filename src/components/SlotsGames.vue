<template>
  <section class="py-8 bg-[#101010]">
    <div class="max-w-[1660px] mx-auto px-4">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-3xl font-black flex items-center space-x-4">
          <div class="bg-white rounded-lg p-1">
            <img 
              src="/images/section/slot.svg" 
              alt="Slot Games" 
              class="w-8 h-8 filter brightness-0 invert-1"
            />
          </div>
          <span>{{ t('sections.slots') }}</span>
        </h2>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <GameMediaCard
          v-for="slot in slotsGames"
          :key="slot.id"
          :title="slot.title"
          :sub-title="slot.koreanTitle"
          :provider="slot.provider"
          :image-src="slot.imageSrc"
          :video-src="slot.videoSrc"
          :is-live="slot.isLive"
          @click="selectSlot(slot)"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import GameMediaCard from './GameMediaCard.vue'

const { t } = useI18n()

interface Game {
  code: string;
  provider: string;
  sort: number;
  type: string;
}

interface SlotGame {
  id: number
  title: string
  koreanTitle: string
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
  'slot-selected': [slot: SlotGame]
}>()

// Use props data or fallback to default data
const slotsGames = computed(() => {
  if (props.games && props.games.length > 0) {
    // Transform Game data to SlotGame format
    return props.games.map((game, index) => ({
      id: index + 1,
      title: game.code,
      koreanTitle: game.code,
      provider: game.provider,
      type: game.type,
      code: game.code,
      imageSrc: `/images/slot/${game.code.toLowerCase()}.webp`,
      videoSrc: `/images/slot/${game.code.toLowerCase()}.webm`,
      isLive: false
    }))
  }
  
  return []
})

// Select slot
const selectSlot = (slot: SlotGame): void => {
  console.log(`Selected slot: ${slot.title}`)
  emit('slot-selected', slot)
}
</script>

<style scoped>
/* Slots games specific styles */
.slots-animation {
  animation: spin 3s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.slots-card:hover .slots-animation {
  animation-duration: 0.5s;
}
</style>