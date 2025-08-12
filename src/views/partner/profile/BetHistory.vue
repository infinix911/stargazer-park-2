<template>
  <div class="space-y-6">
    <!-- Betting History Header -->
    <div class="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-white/10">
      <h3 class="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <i class="fas fa-dice text-yellow-400"></i>
        Betting History
      </h3>
      <p class="text-gray-400 text-sm">Recent betting activities and game results</p>
    </div>

    <!-- Betting Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-gradient-to-r from-blue-600/20 to-blue-800/20 rounded-xl p-6 border border-blue-500/20">
        <div class="flex items-center gap-3 mb-3">
          <div class="p-2 bg-blue-500/20 rounded-lg">
            <i class="fas fa-coins text-blue-400"></i>
          </div>
          <div>
            <h4 class="text-white font-medium">Total Bet Amount</h4>
            <p class="text-blue-400 text-2xl font-bold">{{ formatCurrency(bettingStats.totalBet || 0) }}</p>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-r from-green-600/20 to-green-800/20 rounded-xl p-6 border border-green-500/20">
        <div class="flex items-center gap-3 mb-3">
          <div class="p-2 bg-green-500/20 rounded-lg">
            <i class="fas fa-trophy text-green-400"></i>
          </div>
          <div>
            <h4 class="text-white font-medium">Total Win Amount</h4>
            <p class="text-green-400 text-2xl font-bold">{{ formatCurrency(bettingStats.totalWin || 0) }}</p>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-r from-purple-600/20 to-purple-800/20 rounded-xl p-6 border border-purple-500/20">
        <div class="flex items-center gap-3 mb-3">
          <div class="p-2 bg-purple-500/20 rounded-lg">
            <i class="fas fa-chart-line text-purple-400"></i>
          </div>
          <div>
            <h4 class="text-white font-medium">Net Profit</h4>
            <p :class="[
              'text-2xl font-bold',
              (bettingStats.netProfit || 0) >= 0 ? 'text-green-400' : 'text-red-400'
            ]">
              {{ formatCurrency(bettingStats.netProfit || 0) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Bets Table -->
    <div class="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 overflow-hidden">
      <div class="p-6 border-b border-white/10">
        <h3 class="text-lg font-semibold text-white">Recent Bets</h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-white/5">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Game</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Bet Amount</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Win Amount</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Result</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/10">
            <tr v-if="recentBets.length === 0" class="bg-white/5">
              <td colspan="5" class="px-6 py-4 text-center text-gray-400">
                No betting history available
              </td>
            </tr>
            <tr 
              v-for="bet in recentBets" 
              :key="bet.id" 
              class="hover:bg-white/5 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <i class="fas fa-gamepad text-white text-sm"></i>
                  </div>
                  <span class="text-white font-medium">{{ bet.game }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-white">
                {{ formatCurrency(bet.betAmount) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'font-medium',
                  bet.winAmount > 0 ? 'text-green-400' : 'text-gray-400'
                ]">
                  {{ formatCurrency(bet.winAmount) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  bet.result === 'win' ? 'bg-green-500/20 text-green-400' : 
                  bet.result === 'lose' ? 'bg-red-500/20 text-red-400' : 
                  'bg-yellow-500/20 text-yellow-400'
                ]">
                  {{ bet.result }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-400 text-sm">
                {{ formatDate(bet.date) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface IMember {
  id: string
  username: string
  status: number
  rate: number
  difference: string
  money: number
  point: number
  comp: number
  total_deposit: number
  total_withdrawal: number
  total_depwid: number
  nickname: string
  telno: number
}

interface Props {
  userdata: IMember
}

defineProps<Props>()

// Mock data for demonstration - replace with actual API data
const recentBets = ref([
  {
    id: 1,
    game: 'Slot Machine',
    betAmount: 100,
    winAmount: 0,
    result: 'lose',
    date: new Date('2024-01-15')
  },
  {
    id: 2,
    game: 'Roulette',
    betAmount: 50,
    winAmount: 150,
    result: 'win',
    date: new Date('2024-01-14')
  },
  {
    id: 3,
    game: 'Blackjack',
    betAmount: 75,
    winAmount: 0,
    result: 'lose',
    date: new Date('2024-01-13')
  }
])

// Computed betting statistics
const bettingStats = computed(() => {
  const totalBet = recentBets.value.reduce((sum, bet) => sum + bet.betAmount, 0)
  const totalWin = recentBets.value.reduce((sum, bet) => sum + bet.winAmount, 0)
  const netProfit = totalWin - totalBet

  return {
    totalBet,
    totalWin,
    netProfit
  }
})

/**
 * Format currency values
 */
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(value)
}

/**
 * Format date values
 */
const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}
</script> 