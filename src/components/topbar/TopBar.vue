<template>
  <div class="bg-[#07102e] py-2 text-sm border-b border-[#0c2b5f]">
    <div class="max-w-[1660px] mx-auto px-4">
      <div
        class="flex items-center gap-2"
        :class="authStore.isAuthenticated ? 'justify-end md:justify-between' : 'justify-end'"
      >
        <!--Member Details-->
        <div class="hidden md:block" v-if="authStore.isAuthenticated">
          <div
            @click="setRouter('/mypage'), openModal('change')"
            class="cursor-pointer flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div
              class="w-6 h-6 bg-yellow-500 border-2 border-white rounded-full flex items-center justify-center shadow-lg"
            >
              <span class="text-white font-bold text-xs">{{ authStore.user.level }}</span>
            </div>
            <span class="text-sm">
              <span class="user-name font-semibold text-blue-300">{{
                `${authStore.user.name}`
              }}</span>
              님, 환영합니다.
            </span>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2">
          <!-- Left side - Login and Sign Up buttons (Only for non-authenticated users) -->
          <div
            v-if="!authStore.isAuthenticated"
            class="flex items-center space-x-1 md:space-x-2"
          >
            <!-- Login Button -->
            <button
              @click="navigateToLogin"
              class="cursor-pointer flex items-center space-x-1 px-1.5 md:px-2 py-1.5 rounded text-gray-300 hover:text-white transition-colors"
            >
              <svg
                class="w-3 h-3 md:w-4 md:h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                ></path>
              </svg>
              <span class="text-xs md:text-sm font-medium">{{ t("topBar.login") }}</span>
            </button>

            <!-- Sign Up Button -->
            <button
              @click="navigateToSignup"
              class="cursor-pointer flex items-center space-x-1 px-1.5 md:px-2 py-1.5 rounded text-gray-300 hover:text-white transition-colors"
            >
              <div class="relative">
                <svg
                  class="w-3 h-3 md:w-4 md:h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
                <svg
                  class="w-2 h-2 md:w-3 md:h-3 absolute -bottom-1 -right-1 text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 4v16m8-8H4"></path>
                </svg>
              </div>
              <span class="text-xs md:text-sm font-medium">{{ t("topBar.signup") }}</span>
            </button>
          </div>

          <!-- Money and Point (Only for authenticated users) -->
          <div
            v-if="authStore.isAuthenticated"
            class="flex items-center space-x-2 md:space-x-4"
          >
            <!-- M Counter -->
            <div class="flex items-center space-x-1 md:space-x-2">
              <div
                class="w-5 h-5 md:w-6 md:h-6 bg-blue-400 rounded-full flex items-center justify-center border border-blue-500"
              >
                <span class="text-black font-bold text-xs">M</span>
              </div>
              <span class="text-white font-medium text-xs md:text-sm">
                {{ n(Number(user?.wallet || 0) + Number(user?.wallet_slot || 0)) }}
                원
              </span>
            </div>

            <!-- P Counter -->
            <div class="flex items-center space-x-1 md:space-x-2">
              <div
                class="w-5 h-5 md:w-6 md:h-6 bg-blue-400 rounded-full flex items-center justify-center border border-blue-500"
              >
                <span class="text-black font-bold text-xs">P</span>
              </div>
              <span class="text-white font-medium text-xs md:text-sm">{{
                n(Number(user.wallet_point))
              }}</span>
            </div>
          </div>

          <!-- Right side - Language Switcher and User Menu -->
          <div class="flex items-center space-x-2 md:space-x-4 text-gray-300">
            <div
              class="messages cursor-pointer flex items-center space-x-1 md:space-x-2 relative"
              @click="navigateToInquiries"
            >
              <div
                class="w-5 h-5 md:w-6 md:h-6 bg-blue-400 rounded-full flex items-center justify-center border border-blue-500"
              >
                <i class="fa-sharp fa-solid fa-envelope text-black text-xs"></i>
              </div>
              <span class="text-white font-medium text-xs md:text-sm">쪽지 {{ authStore.inquiryCtr }}통</span>
              <img
                v-if="authStore.inquiryCtr > 0"
                src="/images/newinq.webp"
                class="new-inquiry"
              />
            </div>
            <!-- Language Switcher -->
            <div class="flex items-center space-x-1 md:space-x-2">
              <button
                @click="setLanguage('ko')"
                :class="[
                  'px-1.5 md:px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer',
                  locale === 'ko'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600',
                ]"
              >
                한국어
              </button>
              <button
                @click="setLanguage('en')"
                :class="[
                  'px-1.5 md:px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer',
                  locale === 'en'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600',
                ]"
              >
                English
              </button>
            </div>

            <!-- User Dropdown -->
            <UserDropdown />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import UserDropdown from "./UserDropdown.vue";
import { useAuthStore } from "../../stores/auth";

const { locale, t, n } = useI18n();
const router = useRouter();
const authStore = useAuthStore();

// Get user data from auth store
const user = computed(() => authStore.user);

// Language switching function
const setLanguage = (lang: "ko" | "en") => {
  locale.value = lang;
};

// Navigation functions
const navigateToLogin = () => {
  router.push("/login");
};

const navigateToSignup = () => {
  router.push("/register");
};

const navigateToInquiries = () => {
  router.push("/inquiries");
};
</script>

<style scoped>
.new-inquiry {
  position: absolute;
  height: 28px;
  top: -13px;
  right: 56px;
  z-index: 10;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}
</style>
