<template>
  <header class="bg-[#000000]">
    <!-- Deposit Modal -->
    <DepositModal :open="showDepositModal" @close="showDepositModal = false" />

    <!-- Withdrawal Modal -->
    <WithdrawalModal :open="showWithdrawalModal" @close="showWithdrawalModal = false" />
    <div class="max-w-[1660px] mx-auto px-4 py-2 lg:py-3">
      <div class="flex items-center justify-between">
        <!-- Logo and Navigation -->
        <div class="flex items-center space-x-4 lg:space-x-8">
          <!-- Logo and Mobile Menu -->
          <div class="flex items-center space-x-2 lg:space-x-8">
            <!-- Mobile Menu Sheet -->
            <Sheet v-model:open="isMobileMenuOpen">
              <SheetTrigger as-child>
                <button
                  class="lg:hidden p-2 text-white hover:text-red-400 transition-colors"
                >
                  <svg
                    class="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    ></path>
                  </svg>
                </button>
              </SheetTrigger>
              <SheetContent
                side="left"
                class="bg-[#000000] border-r border-gray-700 w-80 z-[9999]"
              >
                <div class="flex flex-col h-full p-4">
                  <!-- Header -->
                  <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-bold text-white font-orbitron">PRODTEST2</h2>
                    <button
                      @click="isMobileMenuOpen = false"
                      class="text-white hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-gray-800"
                    >
                      <svg
                        class="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M6 18L18 6M6 6l12 12"
                        ></path>
                      </svg>
                    </button>
                  </div>

                  <!-- Navigation -->
                  <nav class="flex flex-col space-y-4 font-orbitron">
                    <!-- Partner Navigation -->
                    <template v-if="isPartner">
                      <template v-for="menuItem in partnerMenuItems" :key="menuItem.key">
                        <!-- Menu items with submenus -->
                        <div v-if="menuItem.submenu" class="space-y-2">
                          <div
                            class="flex items-center space-x-4 text-white font-bold py-3 px-3"
                          >
                            <i :class="menuItem.icon + ' w-6 h-6 text-lg'"></i>
                            <span class="text-xl">{{ t(menuItem.label) }}</span>
                          </div>
                          <div class="ml-6 space-y-2">
                            <router-link
                              v-for="subItem in menuItem.submenu"
                              :key="subItem.key"
                              :to="subItem.path"
                              @click="isMobileMenuOpen = false"
                              class="flex items-center space-x-3 hover:text-red-400 transition-colors py-3 px-3 rounded-lg hover:bg-gray-800 text-gray-300"
                              :class="
                                isActive(subItem.path) ? 'bg-gray-800 text-red-400' : ''
                              "
                            >
                              <i :class="subItem.icon + ' w-5 h-5 text-sm'"></i>
                              <span class="text-lg">{{ t(subItem.label) }}</span>
                            </router-link>
                          </div>
                        </div>

                        <!-- Simple menu items -->
                        <router-link
                          v-else
                          :to="menuItem.path"
                          @click="isMobileMenuOpen = false"
                          class="flex items-center space-x-4 hover:text-red-400 transition-colors font-bold py-4 px-3 rounded-lg hover:bg-gray-800 text-white"
                          :class="
                            isActive(menuItem.path) ? 'bg-gray-800 text-red-400' : ''
                          "
                        >
                          <i :class="menuItem.icon + ' w-6 h-6 text-lg'"></i>
                          <span class="text-xl">{{ t(menuItem.label) }}</span>
                        </router-link>
                      </template>
                    </template>

                    <!-- Regular Navigation -->
                    <template v-else>
                      <router-link
                        to="/casino"
                        class="flex items-center space-x-4 hover:text-red-400 transition-colors font-bold py-4 px-3 rounded-lg hover:bg-gray-800 text-white"
                      >
                        <img
                          src="/images/header/casino.svg"
                          alt="Casino"
                          class="w-6 h-6 filter brightness-0 invert"
                        />
                        <span class="text-xl">{{ t("header.casino") }}</span>
                      </router-link>
                      <router-link
                        to="/slot"
                        class="flex items-center space-x-4 hover:text-red-400 transition-colors font-bold py-4 px-3 rounded-lg hover:bg-gray-800 text-white"
                      >
                        <img
                          src="/images/header/slot.svg"
                          alt="Slots"
                          class="w-6 h-6 filter brightness-0 invert"
                        />
                        <span class="text-xl">{{ t("header.slots") }}</span>
                      </router-link>
                      <a
                        href="#"
                        class="flex items-center space-x-4 hover:text-red-400 transition-colors font-bold py-4 px-3 rounded-lg hover:bg-gray-800 text-white"
                      >
                        <img
                          src="/images/header/holdem.svg"
                          alt="Hold'em"
                          class="w-6 h-6 filter brightness-0 invert"
                        />
                        <span class="text-xl">홀덤</span>
                      </a>
                    </template>
                  </nav>

                  <!-- Footer Actions -->
                  <div class="mt-auto pt-6 border-t border-gray-700" v-if="!isPartner">
                    <div class="flex flex-col space-y-3">
                      <button
                        @click="handleDepositClick"
                        class="bg-[#00a8ff] hover:bg-[#0097e6] px-4 py-3 flex items-center justify-center space-x-2 text-white text-base font-medium transition-colors rounded-lg cursor-pointer"
                      >
                        <img
                          src="/images/header/deposit.svg"
                          alt="Deposit"
                          class="w-5 h-5 filter brightness-0 invert"
                        />
                        <span>{{ t("header.deposit") }}</span>
                      </button>
                      <button
                        @click="handleWithdrawalClick"
                        class="bg-[#00a8ff] hover:bg-[#0097e6] px-4 py-3 flex items-center justify-center space-x-2 text-white text-base font-medium transition-colors rounded-lg cursor-pointer"
                      >
                        <img
                          src="/images/header/withdraw.svg"
                          alt="Withdraw"
                          class="w-5 h-5 filter brightness-0 invert"
                        />
                        <span>{{ t("header.withdraw") }}</span>
                      </button>
                      <button
                        class="bg-white hover:bg-gray-100 px-4 py-3 flex items-center justify-center space-x-2 text-gray-700 text-base font-medium transition-colors rounded-lg"
                      >
                        <img
                          src="/images/header/mylounge.svg"
                          alt="My Lounge"
                          class="w-5 h-5"
                        />
                        <span class="text-[#1494dc]">{{ t("header.myLounge") }}</span>
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
          <nav
            class="hidden lg:flex items-center space-x-4 xl:space-x-8 font-orbitron text-sm lg:text-[1.25rem] text-white"
          >
            <!-- Partner Navigation -->
            <template v-if="isPartner">
              <template v-for="menuItem in partnerMenuItems" :key="menuItem.key">
                <!-- Menu items with submenus -->
                <div v-if="menuItem.submenu" class="relative group">
                  <div
                    class="flex items-center space-x-1 hover:text-red-400 transition-colors font-bold cursor-pointer"
                    :class="isActiveMenu(menuItem) ? 'text-red-400' : ''"
                  >
                    <i :class="menuItem.icon + ' w-4 h-4 lg:w-6 lg:h-6'"></i>
                    <span class="hidden xl:inline">{{ t(menuItem.label) }}</span>
                    <i
                      class="fas fa-chevron-down text-xs ml-1 transition-transform group-hover:rotate-180"
                    ></i>
                  </div>
                  <!-- Dropdown Menu -->
                  <div
                    class="absolute top-full left-0 mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-48"
                  >
                    <router-link
                      v-for="subItem in menuItem.submenu"
                      :key="subItem.key"
                      :to="subItem.path"
                      class="block px-4 py-3 text-sm hover:bg-gray-800 hover:text-red-400 transition-colors border-b border-gray-700 last:border-b-0"
                      :class="
                        isActive(subItem.path)
                          ? 'text-red-400 bg-gray-800'
                          : 'text-gray-300'
                      "
                    >
                      <i :class="subItem.icon + ' mr-2 text-xs'"></i>
                      {{ t(subItem.label) }}
                    </router-link>
                  </div>
                </div>

                <!-- Simple menu items -->
                <router-link
                  v-else
                  :to="menuItem.path"
                  class="flex items-center space-x-1 hover:text-red-400 transition-colors font-bold"
                  :class="isActive(menuItem.path) ? 'text-red-400' : ''"
                >
                  <i :class="menuItem.icon + ' w-4 h-4 lg:w-6 lg:h-6'"></i>
                  <span class="hidden xl:inline">{{ t(menuItem.label) }}</span>
                </router-link>
              </template>
            </template>

            <!-- Regular Navigation -->
            <template v-else>
              <router-link
                to="/casino"
                class="flex items-center space-x-1 hover:text-red-400 transition-colors font-bold"
              >
                <img
                  src="/images/header/casino.svg"
                  alt="Casino"
                  class="w-4 h-4 lg:w-6 lg:h-6 filter brightness-0 invert"
                />
                <span class="hidden xl:inline">{{ t("header.casino") }}</span>
              </router-link>
              <router-link
                to="/slot"
                class="flex items-center space-x-1 hover:text-red-400 transition-colors font-bold"
              >
                <img
                  src="/images/header/slot.svg"
                  alt="Slots"
                  class="w-4 h-4 lg:w-6 lg:h-6 filter brightness-0 invert"
                />
                <span class="hidden xl:inline">{{ t("header.slots") }}</span>
              </router-link>
              <a
                href="#"
                class="flex items-center space-x-1 hover:text-red-400 transition-colors font-bold"
              >
                <img
                  src="/images/header/holdem.svg"
                  alt="Hold'em"
                  class="w-4 h-4 lg:w-6 lg:h-6 filter brightness-0 invert"
                />
                <span class="hidden xl:inline">{{ t("header.holdem") }}</span>
              </a>
              <a
                href="/partner/dashboard"
                class="flex items-center space-x-1 hover:text-red-400 transition-colors font-bold"
              >
                <i class="fas fa-users"></i>
                <span class="hidden xl:inline">{{ t("header.partner") }}</span>
              </a>
            </template>
          </nav>
        </div>

        <!-- User Actions -->
        <div class="flex items-center space-x-2 lg:space-x-0" v-if="!isPartner">
          <!-- Deposit/Withdrawal Section -->
          <div
            class="flex rounded-lg lg:rounded-xl overflow-hidden border border-gray-600"
          >
            <!-- Deposit Button -->
            <button
              @click="handleDepositClick"
              class="bg-[#00a8ff] hover:bg-[#0097e6] px-2 lg:px-6 py-3 lg:py-5 flex items-center space-x-1 text-white text-xs lg:text-base font-medium transition-colors cursor-pointer"
            >
              <img
                src="/images/header/deposit.svg"
                alt="Deposit"
                class="w-4 h-4 lg:w-8 lg:h-8 filter brightness-0 invert"
              />
              <span class="hidden sm:inline">{{ t("header.deposit") }}</span>
            </button>

            <!-- Withdrawal Button -->
            <button
              @click="handleWithdrawalClick"
              class="bg-[#00a8ff] hover:bg-[#0097e6] px-2 lg:px-6 py-3 lg:py-5 flex items-center space-x-1 text-white text-xs lg:text-base font-medium transition-colors border-l border-[#0080cc] cursor-pointer"
            >
              <img
                src="/images/header/withdraw.svg"
                alt="Withdraw"
                class="w-4 h-4 lg:w-8 lg:h-8 filter brightness-0 invert"
              />
              <span class="hidden sm:inline">{{ t("header.withdraw") }}</span>
            </button>

            <!-- My Lounge Button -->
            <button
              class="bg-white hover:bg-gray-100 px-2 lg:px-6 py-3 lg:py-5 flex items-center space-x-1 lg:space-x-2 text-gray-700 text-xs lg:text-base font-medium transition-colors"
            >
              <img
                src="/images/header/mylounge.svg"
                alt="My Lounge"
                class="w-4 h-4 lg:w-8 lg:h-8"
              />
              <span class="text-[#1494dc] hidden sm:inline">{{
                t("header.myLounge")
              }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">

import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'
import Sheet from './ui/sheet/Sheet.vue'
import SheetContent from './ui/sheet/SheetContent.vue'
import SheetTrigger from './ui/sheet/SheetTrigger.vue'
import DepositModal from '../views/transaction/DepositModal.vue'
import WithdrawalModal from '../views/transaction/WithdrawalModal.vue'
import { useAuthStore } from '../stores/auth'

// Props
interface Props {
  isPartner?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isPartner: false,
});

const { t } = useI18n()
const authStore = useAuthStore()
const route = useRoute();

// Partner Menu Configuration
const partnerMenuItems = [
  {
    key: "home",
    label: "partnerMenu.home",
    path: "/partner/dashboard",
    icon: "fas fa-home",
  },
  {
    key: "member",
    label: "partnerMenu.member",
    icon: "fas fa-users",
    submenu: [
      {
        key: "memberList",
        label: "partnerMenu.memberList",
        path: "/partner/members",
        icon: "fas fa-list",
      },
      {
        key: "memberOnline",
        label: "partnerMenu.memberOnline",
        path: "/partner/members/online",
        icon: "fas fa-circle",
      },
      {
        key: "shopTranHistory",
        label: "partnerMenu.shopTranHistory",
        path: "/partner/shop-transactions",
        icon: "fas fa-store",
      },
    ],
  },
  {
    key: "betting",
    label: "partnerMenu.betting",
    path: "/partner/betting",
    icon: "fas fa-dice",
  },
  {
    key: "transaction",
    label: "partnerMenu.transaction",
    path: "/partner/transactions",
    icon: "fas fa-exchange-alt",
  },
  {
    key: "statistics",
    label: "partnerMenu.statistics",
    path: "/partner/statistics",
    icon: "fas fa-chart-bar",
  },
  {
    key: "settlement",
    label: "partnerMenu.settlement",
    icon: "fas fa-calculator",
    submenu: [
      {
        key: "settlementRequest",
        label: "partnerMenu.settlementRequest",
        path: "/partner/settlement/request",
        icon: "fas fa-paper-plane",
      },
      {
        key: "settlementHistory",
        label: "partnerMenu.settlementHistory",
        path: "/partner/settlement/history",
        icon: "fas fa-history",
      },
    ],
  },
];

// Check if route is active
const isActive = (path: string): boolean => {
  return route.path === path || route.path.startsWith(path + "/");
};

// Check if menu item (with submenus) is active
const isActiveMenu = (menuItem: any): boolean => {
  if (menuItem.path) {
    return isActive(menuItem.path);
  }
  if (menuItem.submenu) {
    return menuItem.submenu.some((subItem: any) => isActive(subItem.path));
  }
  return false;
};

// Mobile menu state
const isMobileMenuOpen = ref(false);

// Modal states
const showDepositModal = ref(false);
const showWithdrawalModal = ref(false);

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
