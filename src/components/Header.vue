<template>
  <header class="bg-[#000000]">
    <!-- Deposit Modal -->
    <DepositModal
      :open="showDepositModal"
      @close="showDepositModal = false"
    />

    <!-- Withdrawal Modal -->
    <WithdrawalModal
      :open="showWithdrawalModal"
      @close="showWithdrawalModal = false"
    />
    <div class="max-w-[1660px] mx-auto px-4 py-2 lg:py-3">
      <div class="flex items-center justify-between">
        <!-- Logo and Navigation -->
        <div class="flex items-center space-x-4 lg:space-x-8">
          <!-- Logo and Mobile Menu -->
          <div class="flex items-center space-x-2 lg:space-x-8">
            <!-- Mobile Menu Sheet -->
            <Sheet v-model:open="isMobileMenuOpen">
              <SheetTrigger as-child>
                <button class="lg:hidden p-2 text-white hover:text-red-400 transition-colors">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                  </svg>
                </button>
              </SheetTrigger>
              <SheetContent side="left" class="bg-[#000000] border-r border-gray-700 w-80 z-[9999]">
                <div class="flex flex-col h-full p-4">
                  <!-- Header -->
                  <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-bold text-white font-orbitron">PRODTEST2</h2>
                    <button 
                      @click="isMobileMenuOpen = false"
                      class="text-white hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-gray-800"
                    >
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                  
                  <!-- Navigation -->
                  <nav class="flex flex-col space-y-6 font-orbitron">
                    <router-link to="/casino" class="flex items-center space-x-4 hover:text-red-400 transition-colors font-bold py-4 px-3 rounded-lg hover:bg-gray-800 text-white">
                      <img src="/images/header/casino.svg" alt="Casino" class="w-6 h-6 filter brightness-0 invert">
                      <span class="text-xl">{{ t('header.casino') }}</span>
                    </router-link>
                    <router-link to="/slot" class="flex items-center space-x-4 hover:text-red-400 transition-colors font-bold py-4 px-3 rounded-lg hover:bg-gray-800 text-white">
                      <img src="/images/header/slot.svg" alt="Slots" class="w-6 h-6 filter brightness-0 invert">
                      <span class="text-xl">{{ t('header.slots') }}</span>
                    </router-link>
                    <a href="#" class="flex items-center space-x-4 hover:text-red-400 transition-colors font-bold py-4 px-3 rounded-lg hover:bg-gray-800 text-white">
                      <img src="/images/header/holdem.svg" alt="Hold'em" class="w-6 h-6 filter brightness-0 invert">
                      <span class="text-xl">홀덤</span>
                    </a>
                  </nav>
                  
                  <!-- Footer Actions -->
                  <div class="mt-auto pt-6 border-t border-gray-700">
                    <div class="flex flex-col space-y-3">
                      <button 
                        @click="handleDepositClick"
                        class="bg-[#00a8ff] hover:bg-[#0097e6] px-4 py-3 flex items-center justify-center space-x-2 text-white text-base font-medium transition-colors rounded-lg cursor-pointer"
                      >
                        <img src="/images/header/deposit.svg" alt="Deposit" class="w-5 h-5 filter brightness-0 invert">
                        <span>{{ t('header.deposit') }}</span>
                      </button>
                      <button 
                        @click="handleWithdrawalClick"
                        class="bg-[#00a8ff] hover:bg-[#0097e6] px-4 py-3 flex items-center justify-center space-x-2 text-white text-base font-medium transition-colors rounded-lg cursor-pointer"
                      >
                        <img src="/images/header/withdraw.svg" alt="Withdraw" class="w-5 h-5 filter brightness-0 invert">
                        <span>{{ t('header.withdraw') }}</span>
                      </button>
                      <button class="bg-white hover:bg-gray-100 px-4 py-3 flex items-center justify-center space-x-2 text-gray-700 text-base font-medium transition-colors rounded-lg">
                        <img src="/images/header/mylounge.svg" alt="My Lounge" class="w-5 h-5">
                        <span class="text-[#1494dc]">{{ t('header.myLounge') }}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <!-- Logo -->
            <router-link 
              to="/" 
              class="text-xl font-bold text-red-500 font-orbitron text-lg lg:text-[2.25rem] text-white hover:text-red-400 transition-colors cursor-pointer"
            >
              prodtest2
            </router-link>
           </div>
           
           <!-- Desktop Navigation -->
           <nav class="hidden lg:flex items-center space-x-4 xl:space-x-8 font-orbitron text-sm lg:text-[1.25rem] text-white">
             <!-- <a href="#" class="flex items-center space-x-1 hover:text-red-400 transition-colors font-bold">
               <img src="/images/header/sport.svg" alt="Sports" class="w-6 h-6 filter brightness-0 invert">
               <span>{{ t('header.sports') }}</span>
             </a> -->
             <router-link to="/casino" class="flex items-center space-x-1 hover:text-red-400 transition-colors font-bold">
               <img src="/images/header/casino.svg" alt="Casino" class="w-4 h-4 lg:w-6 lg:h-6 filter brightness-0 invert">
               <span class="hidden xl:inline">{{ t('header.casino') }}</span>
             </router-link>
             <router-link to="/slot" class="flex items-center space-x-1 hover:text-red-400 transition-colors font-bold">
               <img src="/images/header/slot.svg" alt="Slots" class="w-4 h-4 lg:w-6 lg:h-6 filter brightness-0 invert">
               <span class="hidden xl:inline">{{ t('header.slots') }}</span>
             </router-link>
             <a href="#" class="flex items-center space-x-1 hover:text-red-400 transition-colors font-bold">
               <img src="/images/header/holdem.svg" alt="Hold'em" class="w-4 h-4 lg:w-6 lg:h-6 filter brightness-0 invert">
               <span class="hidden xl:inline">{{ t('header.holdem') }}</span>
             </a>
           </nav>
         </div>
         
         <!-- User Actions -->
         <div class="flex items-center space-x-2 lg:space-x-0">
          
          <!-- Deposit/Withdrawal Section -->
          <div class="flex rounded-lg lg:rounded-xl overflow-hidden border border-gray-600">
            <!-- Deposit Button -->
            <button 
              @click="handleDepositClick"
              class="bg-[#00a8ff] hover:bg-[#0097e6] px-2 lg:px-6 py-3 lg:py-5 flex items-center space-x-1 text-white text-xs lg:text-base font-medium transition-colors cursor-pointer"
            >
              <img src="/images/header/deposit.svg" alt="Deposit" class="w-4 h-4 lg:w-8 lg:h-8 filter brightness-0 invert">
              <span class="hidden sm:inline">{{ t('header.deposit') }}</span>
            </button>
            
            <!-- Withdrawal Button -->
            <button 
              @click="handleWithdrawalClick"
              class="bg-[#00a8ff] hover:bg-[#0097e6] px-2 lg:px-6 py-3 lg:py-5 flex items-center space-x-1 text-white text-xs lg:text-base font-medium transition-colors border-l border-[#0080cc] cursor-pointer"
            >
              <img src="/images/header/withdraw.svg" alt="Withdraw" class="w-4 h-4 lg:w-8 lg:h-8 filter brightness-0 invert">
              <span class="hidden sm:inline">{{ t('header.withdraw') }}</span>
            </button>
            
            <!-- My Lounge Button -->
            <button class="bg-white hover:bg-gray-100 px-2 lg:px-6 py-3 lg:py-5 flex items-center space-x-1 lg:space-x-2 text-gray-700 text-xs lg:text-base font-medium transition-colors">
              <img src="/images/header/mylounge.svg" alt="My Lounge" class="w-4 h-4 lg:w-8 lg:h-8">
              <span class="text-[#1494dc] hidden sm:inline">{{ t('header.myLounge') }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
// Header component with TypeScript
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Swal from 'sweetalert2'
import Sheet from './ui/sheet/Sheet.vue'
import SheetContent from './ui/sheet/SheetContent.vue'
import SheetTrigger from './ui/sheet/SheetTrigger.vue'
import DepositModal from '../views/transaction/DepositModal.vue'
import WithdrawalModal from '../views/transaction/WithdrawalModal.vue'
import { useAuthStore } from '../stores/auth'

const { t } = useI18n()
const authStore = useAuthStore()

// Mobile menu state
const isMobileMenuOpen = ref(false)

// Modal states
const showDepositModal = ref(false)
const showWithdrawalModal = ref(false)

// Handle deposit button click
const handleDepositClick = (): void => {
  if (!authStore.isAuthenticated) {
    Swal.fire({
      icon: 'warning',
      title: t('auth.loginRequired'),
      text: t('auth.loginRequiredMessage'),
      confirmButtonText: t('auth.loginNow')
    })
    return
  }
  showDepositModal.value = true
  isMobileMenuOpen.value = false // Close mobile menu if open
}

// Handle withdrawal button click
const handleWithdrawalClick = (): void => {
  if (!authStore.isAuthenticated) {
    Swal.fire({
      icon: 'warning',
      title: t('auth.loginRequired'),
      text: t('auth.loginRequiredMessage'),
      confirmButtonText: t('auth.loginNow')
    })
    return
  }
  showWithdrawalModal.value = true
  isMobileMenuOpen.value = false // Close mobile menu if open
}
</script>

<style scoped>
/* Mobile menu styles can be added here if needed */
/* @media (max-width: 768px) {
  nav {
    display: none;
  }
} */
</style>