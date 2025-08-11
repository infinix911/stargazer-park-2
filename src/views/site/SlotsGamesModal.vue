<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-4xl max-h-[80vh] overflow-hidden bg-gradient-to-br from-[#fc4848]/95 via-[#fc4848]/85">
      <DialogHeader>
        <DialogTitle class="text-white text-2xl text-shadow-lg font-bold font-orbitron">SLOT GAMES</DialogTitle>
      </DialogHeader>
      
      <!-- Game List -->
      <div class="py-4 overflow-y-auto max-h-[60vh]">
        <div v-if="games.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <GameBannerCard
            v-for="game in games"
            :key="game.code"
            :title="getGameTitle(game)"
            :sub-title="locale === 'ko' ? game.ko_title : game.eng_title"
            :provider="provider"
            :image-src="game.img_url"
            :video-src="''"
            :is-live="false"
            @click="selectGame(game)"
          />
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
import ApiService from '@/services/ApiService'
import { ref, watch } from 'vue'
import GameBannerCard from '@/components/GameBannerCard.vue'
import { useI18n } from 'vue-i18n'

// Define props
interface Props {
  provider: string
  code: string
  open: boolean
}

const props = defineProps<Props>()
const { locale } = useI18n()

// Define emits
const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

// Get the appropriate title based on locale
const getGameTitle = (game: any): string => {
  return locale.value === 'ko' ? game.ko_title : game.eng_title
}

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
