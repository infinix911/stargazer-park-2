<template>
  <DropdownMenu v-if="authStore.isAuthenticated">
    <DropdownMenuTrigger as-child>
      <button class="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors cursor-pointer">
        <div class="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
          </svg>
        </div>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </DropdownMenuTrigger>

    <DropdownMenuContent class="w-64 bg-white border-gray-300">
      <!-- User Level -->
      <DropdownMenuLabel class="p-4 bg-white rounded-t-lg border-b-0">
        <div class="flex items-center space-x-3">
          <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
          </svg>
          <span class="text-gray-600 font-medium">{{ `LV.${user.level}` }}</span>
          <span class="text-gray-600 font-medium">{{ user.name }} 님</span>
        </div>
      </DropdownMenuLabel>

      <!-- Menu Items -->
      <DropdownMenuGroup>
        <!-- Point Withdrawal -->
        <DropdownMenuItem @click="handlePointWithdrawal" class="bg-white hover:bg-gray-50 cursor-pointer">
          <svg class="w-5 h-5 text-gray-700 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          <span class="text-gray-700">Point Withdrawal</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator class="bg-gray-200" />

        <!-- Point History -->
        <DropdownMenuItem @click="handlePointHistory" class="bg-white hover:bg-gray-50 cursor-pointer">
          <svg class="w-5 h-5 text-gray-700 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span class="text-gray-700">Point History</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator class="bg-gray-200" />

        <!-- Change Password -->
        <DropdownMenuItem @click="handleChangePassword" class="bg-white hover:bg-gray-50 cursor-pointer">
          <svg class="w-5 h-5 text-gray-700 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          <span class="text-gray-700">Change Password</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator class="bg-gray-200" />

        <!-- Logout -->
        <DropdownMenuItem @click="handleLogout" class="bg-white hover:bg-gray-50 cursor-pointer rounded-b-lg">
          <svg class="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span class="text-red-600 font-medium">Logout</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>

  <!-- Change Password Modal -->
  <ChangePasswordModal v-model:open="showChangePasswordModal" />
  
  <!-- Point Withdrawal Modal -->
  <PointWithdrawalModal v-model:open="showPointWithdrawalModal" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import ChangePasswordModal from './ChangePasswordModal.vue'
import PointWithdrawalModal from './PointWithdrawalModal.vue'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const user = computed(() => authStore.user);

// Modal state
const showChangePasswordModal = ref(false)
const showPointWithdrawalModal = ref(false)

// Event handlers for menu items
const handlePointWithdrawal = () => {
  showPointWithdrawalModal.value = true
  console.log('Point Withdrawal clicked')
}

const handlePointHistory = () => {
  console.log('Point History clicked')
  // Add navigation logic here
}

const handleChangePassword = () => {
  showChangePasswordModal.value = true
}

const handleLogout = async () => {
  try {
    await authStore.logout()
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>
