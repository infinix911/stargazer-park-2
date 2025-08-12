<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-4xl max-h-[80vh] overflow-hidden bg-gradient-to-br from-[#fc4848]/95 via-[#fc4848]/85">
      <DialogHeader>
        <DialogTitle class="text-white text-2xl text-shadow-lg font-bold font-orbitron">SLOT GAMES</DialogTitle>
      </DialogHeader>
      
      <!-- Search Bar -->
      <div class="pb-4">
        <div class="relative">
          <Input
            v-model="searchQuery"
            type="text"
            :placeholder="t('common.search')"
            class="w-full pl-10 bg-[#7e0e0e]/20 border-white/20 text-black placeholder-white/60 focus:border-[#1494dc]"
          />
          <Search class="absolute left-3 top-2.5 w-4 h-4 text-black/60" />
        </div>
      </div>
      
      <!-- Game List -->
      <div class="py-4 overflow-y-auto max-h-[60vh]">
        <div v-if="filteredGames.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <GameBannerCard
            v-for="game in filteredGames"
            :key="game.code"
            :title="getGameTitle(game)"
            :sub-title="locale === 'ko' ? game.ko_title : game.eng_title"
            :provider="provider"
            :image-src="game.img_url"
            :video-src="''"
            @click="selectGame(game)"
          />
        </div>
        <div v-else-if="games.length > 0 && searchQuery.trim()" class="text-center py-8">
          <div class="text-white/60">
            <p>{{ t('common.noResults') }}</p>
            <p class="text-sm mt-2">{{ t('common.tryDifferentSearch') }}</p>
          </div>
        </div>
      </div>
      
      <DialogFooter>
        <DialogClose as-child>
          <Button variant="outline">Close</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/input.vue'
import ApiService from '@/services/ApiService'
import { ref, watch, computed } from 'vue'
import { Search } from 'lucide-vue-next'
import GameBannerCard from '@/components/GameBannerCard.vue'
import { useI18n } from 'vue-i18n'

// Define props
interface Props {
  provider: string
  code: string
  open: boolean
}

const props = defineProps<Props>()
const { locale, t } = useI18n()

// Search functionality
const searchQuery = ref('')

// Define emits
const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

// Get the appropriate title based on locale
const getGameTitle = (game: any): string => {
  return locale.value === 'ko' ? game.ko_title : game.eng_title
}

// Filtered games based on search query
const filteredGames = computed(() => {
  if (!searchQuery.value.trim()) {
    return games.value
  }
  
  const query = searchQuery.value.toLowerCase()
  return games.value.filter(game => {
    const title = getGameTitle(game).toLowerCase()
    const provider = game.provider?.toLowerCase() || ''
    const code = game.code?.toLowerCase() || ''
    
    return title.includes(query) || provider.includes(query) || code.includes(query)
  })
})

// Reactive data
const games = ref<any[]>([])

// Get game list function
const getGameList = async (): Promise<void> => {
  try {
    const provider = props.provider === 'KP' ? "SNOW_SLOT" : props.provider
    const response = await ApiService.get(
      `/site/gamelists/${provider}/${props.code}`
    )
    games.value = response.data
  } catch (error) {
    console.error('Error fetching game list:', error)
  }
}

// Watch for changes in provider and code props
watch([() => props.provider, () => props.code], () => {
  getGameList();
});

// Select game
const selectGame = (game: any): void => {  
  window.open(
    `/slot/${props.provider}/${props.code}/${game.code}`,
    "SlotWindow",
    "height=400;width=600"
  );
}
</script>

<style scoped>
/* Modal animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Custom styling for GameBannerCard in modal */
:deep(.game-media-card) {
  height: auto !important;
}

:deep(.game-media-card .relative) {
  aspect-ratio: 3/4 !important;
}
</style>
