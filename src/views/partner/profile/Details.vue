<template>
  <div class="space-y-6">
    <!-- Personal Details -->
    <div class="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-white/10">
      <h3 class="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <i class="fas fa-id-card text-blue-400"></i>
        Personal Details
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-3">
          <div class="flex justify-between items-center py-2 border-b border-white/10">
            <span class="text-gray-400">Username</span>
            <span class="text-white font-medium">{{ userdata?.username || 'N/A' }}</span>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-white/10">
            <span class="text-gray-400">Nickname</span>
            <span class="text-white font-medium">{{ userdata?.nickname || 'N/A' }}</span>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-white/10">
            <span class="text-gray-400">Member ID</span>
            <span class="text-white font-medium">{{ userdata?.id || 'N/A' }}</span>
          </div>
        </div>
        <div class="space-y-3">
          <div class="flex justify-between items-center py-2 border-b border-white/10">
            <span class="text-gray-400">Status</span>
            <span :class="[
              'px-3 py-1 rounded-full text-sm font-medium',
              userdata?.status === 1 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            ]">
              {{ userdata?.status === 1 ? 'Active' : 'Inactive' }}
            </span>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-white/10">
            <span class="text-gray-400">Rate</span>
            <span class="text-white font-medium">{{ userdata?.rate || 0 }}%</span>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-white/10">
            <span class="text-gray-400">Phone</span>
            <span class="text-white font-medium">{{ userdata?.telno || 'N/A' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Financial Details -->
    <div class="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-white/10">
      <h3 class="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <i class="fas fa-coins text-green-400"></i>
        Financial Details
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-3">
          <div class="flex justify-between items-center py-2 border-b border-white/10">
            <span class="text-gray-400">Current Money</span>
            <span class="text-white font-medium">{{ formatCurrency(userdata?.money || 0) }}</span>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-white/10">
            <span class="text-gray-400">Points</span>
            <span class="text-white font-medium">{{ formatNumber(userdata?.point || 0) }}</span>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-white/10">
            <span class="text-gray-400">Comp Points</span>
            <span class="text-white font-medium">{{ formatNumber(userdata?.comp || 0) }}</span>
          </div>
        </div>
        <div class="space-y-3">
          <div class="flex justify-between items-center py-2 border-b border-white/10">
            <span class="text-gray-400">Total Deposit</span>
            <span class="text-green-400 font-medium">{{ formatCurrency(userdata?.total_deposit || 0) }}</span>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-white/10">
            <span class="text-gray-400">Total Withdrawal</span>
            <span class="text-red-400 font-medium">{{ formatCurrency(userdata?.total_withdrawal || 0) }}</span>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-white/10">
            <span class="text-gray-400">Net Amount</span>
            <span :class="[
              'font-medium',
              (userdata?.total_depwid || 0) >= 0 ? 'text-green-400' : 'text-red-400'
            ]">
              {{ formatCurrency(userdata?.total_depwid || 0) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Performance Metrics -->
    <div class="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-white/10">
      <h3 class="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <i class="fas fa-chart-bar text-purple-400"></i>
        Performance Metrics
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-3">
          <div class="flex justify-between items-center py-2 border-b border-white/10">
            <span class="text-gray-400">Commission Rate</span>
            <span class="text-white font-medium">{{ userdata?.rate || 0 }}%</span>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-white/10">
            <span class="text-gray-400">Difference</span>
            <span class="text-white font-medium">{{ userdata?.difference || 'N/A' }}</span>
          </div>
        </div>
        <div class="space-y-3">
          <div class="flex justify-between items-center py-2 border-b border-white/10">
            <span class="text-gray-400">Member Level</span>
            <span class="text-white font-medium">Standard</span>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-white/10">
            <span class="text-gray-400">Account Type</span>
            <span class="text-white font-medium">Regular</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
 * Format number values
 */
const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value)
}
</script>
