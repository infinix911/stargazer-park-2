<template>
  <div>
    <!-- Casino Games Section -->
    <CasinoGames 
      v-if="!showOnlySlots"
      :games="games.casinoGames"
      @casino-selected="handleCasinoSelected"
    />
    
    <!-- Slots Games Section -->
    <SlotsGames 
      v-if="!showOnlyCasino"
      :games="games.slotGames"
      @slot-selected="handleSlotSelected"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '../../stores/app'
import { useAuthStore } from '../../stores/auth'
import ApiService from '../../services/ApiService'
import CasinoGames from '../../components/CasinoGames.vue'
import SlotsGames from '../../components/SlotsGames.vue'

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

interface SlotGame {
  id: number
  title: string
  koreanTitle: string
  provider: string
  imageSrc: string
  videoSrc: string
  isLive: boolean
}

// Define props
interface Props {
  games: {
    slotGames: Game[];
    casinoGames: Game[];
  }
  showOnlyCasino?: boolean
  showOnlySlots?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showOnlyCasino: false,
  showOnlySlots: false
})
const appStore = useAppStore()
const authStore = useAuthStore()
const settings = computed(() => appStore.settings as any);

// Withdraw game money
const withdrawGameMoney = async () => {
  if (settings.value.ENABLE_MONEY_TRANSFER_GAME === "true") {
    const balance = await ApiService.get(`/game/snow/money-transfer/balance`).then(
      (res) => res.data.balance
    );
    if (balance > 0) {
      await ApiService.post(`/game/snow/money-transfer/withdrawal`, null).then(
        (res) => res.data
      );
      authStore.user.wallet_slot = 0;
    }
  }
};

// Open game
const openGame = async (provider: string) => {
  if (
    settings.value.ENABLE_MONEY_TRANSFER_GAME === "true" &&
    (provider === "SNOW_SNOW2" || provider === "KH")
  ) {
    if (Number(authStore.user.wallet) > 0) {
      await ApiService.post(`/game/snow/money-transfer/deposit`, {
        amount: Number(authStore.user.wallet),
      }).then((res: any) => res.data);
      authStore.user.wallet = 0;
    }
  } else {
    withdrawGameMoney();
  }
};

// Launch game
async function launchGame(provider: string, code: string) {
	window.open(
		`/game/${provider}/${code}`,
		"LiveWindow",
		"height=400;width=600"
	);
}

// Event handlers for component interactions
const handleCasinoSelected = (casino: CasinoGame): void => {
  //console.log('Casino selected:', casino)
  openGame(casino.provider)
  launchGame(casino.provider, casino.code)
}

const handleSlotSelected = (slot: SlotGame): void => {
  //console.log('Slot selected:', slot)
  openGame(slot.provider)
}
</script>

<style scoped>
/* GameList specific styles */
</style>
