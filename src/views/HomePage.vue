<template>
  <!-- Game List Section -->
  <GameList 
    :games="games"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ApiService from '../services/ApiService'
import GameList from './site/GameList.vue'

interface Game {
  code: string;
  provider: string;
  sort: number;
  type: string;
}

const games = ref({
  slotGames: [] as Game[],
  casinoGames: [] as Game[],
});

const lobbies = ref<Game[]>([])

// Function to fetch games
const getGames = async (): Promise<void> => {
  try {
    const response = await ApiService.get("/site/games")
    lobbies.value = response.data

    if (lobbies.value.length > 0) {
      games.value.slotGames = lobbies.value.filter(g => g.type === 'SLOT')
      games.value.casinoGames = lobbies.value.filter(g => g.type === 'CASINO' || g.type === "HOTEL")
    }
    
  } catch (error) {
    console.error('Failed to fetch games:', error)
  }
}

// Fetch games on component mount
onMounted(() => {
  getGames()
})

</script>

