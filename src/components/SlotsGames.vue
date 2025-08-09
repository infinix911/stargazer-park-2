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
          :korean-title="slot.koreanTitle"
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
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import GameMediaCard from './GameMediaCard.vue'

const { t } = useI18n()

interface SlotGame {
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
  'slot-selected': [slot: SlotGame]
}>()

// Reactive data
const slotsGames = ref<SlotGame[]>([
  { 
    id: 1, 
    title: 'PRAGMATICPLAY', 
    koreanTitle: '프라그마틱 플레이', 
    provider: 'Pragmatic Play',
    imageSrc: '/images/slot/pragmatic.webp',
    videoSrc: '/images/slot/pragmatic.webm',
    isLive: false
  },
  { 
    id: 2, 
    title: 'BNG', 
    koreanTitle: '분고', 
    provider: 'BNG',
    imageSrc: '/images/slot/bng.webp',
    videoSrc: '/images/slot/bng.webm',
    isLive: false
  },
  { 
    id: 3, 
    title: 'HABANERO', 
    koreanTitle: '하바네로', 
    provider: 'Habanero',
    imageSrc: '/images/slot/habanero.webp',
    videoSrc: '/images/slot/habanero.webm',
    isLive: false
  },
  { 
    id: 4, 
    title: 'BIGTIMEGAMING', 
    koreanTitle: '빅 타임 게이밍', 
    provider: 'Big Time Gaming',
    imageSrc: '/images/slot/bigtimegaming.webp',
    videoSrc: '/images/slot/bigtimegaming.webm',
    isLive: false
  },
  { 
    id: 5, 
    title: 'WAZDAN', 
    koreanTitle: '와즈단', 
    provider: 'Wazdan',
    imageSrc: '/images/slot/wazdan.webp',
    videoSrc: '/images/slot/wazdan.webm',
    isLive: false
  },
  { 
    id: 6, 
    title: 'NOLIMITCITY', 
    koreanTitle: '노리밋 시티', 
    provider: 'Nolimit City',
    imageSrc: '/images/slot/nolimit.webp',
    videoSrc: '/images/slot/nolimit.webm',
    isLive: false
  },
  { 
    id: 7, 
    title: 'REDTIGER', 
    koreanTitle: '레드타이거', 
    provider: 'Red Tiger',
    imageSrc: '/images/slot/redtiger.webp',
    videoSrc: '/images/slot/redtiger.webm',
    isLive: false
  },
  { 
    id: 8, 
    title: 'NETENT', 
    koreanTitle: '넷엔트', 
    provider: 'NetEnt',
    imageSrc: '/images/slot/netent.webp',
    videoSrc: '/images/slot/netent.webm',
    isLive: false
  },
  { 
    id: 9, 
    title: 'PLAYNGO', 
    koreanTitle: '플레이앤고', 
    provider: 'Play\'n GO',
    imageSrc: '/images/slot/playngo.webp',
    videoSrc: '/images/slot/playngo.webm',
    isLive: false
  }
])

// Methods
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