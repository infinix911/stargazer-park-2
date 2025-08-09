<template>
  <div class="bg-[#07102e] py-2 text-sm border-b border-[#0c2b5f]">
    <div class="max-w-[1660px] mx-auto px-4">
      <div class="flex items-center justify-end gap-2">
        <!-- Left side - Login and Sign Up buttons -->
        <div class="flex items-center">
          <!-- Login Button -->
          <button class="flex items-center space-x-1 px-2 py-1.5 rounded text-gray-300 hover:text-white transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
            <span class="text-sm font-medium">{{ t('topBar.login') }}</span>
          </button>
          
          <!-- Sign Up Button -->
          <button class="flex items-center space-x-1 px-2 py-1.5 rounded text-gray-300 hover:text-white transition-colors">
            <div class="relative">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <svg class="w-3 h-3 absolute -bottom-1 -right-1 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4v16m8-8H4"></path>
              </svg>
            </div>
            <span class="text-sm font-medium">{{ t('topBar.signup') }}</span>
          </button>
        </div>
        
        <!-- Right side - Language Switcher and User Menu -->
        <div class="flex items-center space-x-4 text-gray-300">
          <!-- Language Switcher -->
          <div class="flex items-center space-x-2">
            <button 
              @click="setLanguage('ko')" 
              :class="[
                'px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer',
                locale === 'ko' 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              ]"
            >
              한국어
            </button>
            <button 
              @click="setLanguage('en')" 
              :class="[
                'px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer',
                locale === 'en' 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
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
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import UserDropdown from './UserDropdown.vue'

const { locale, t } = useI18n()

// Language switching function
const setLanguage = (lang: 'ko' | 'en') => {
  locale.value = lang
}
</script>

<style scoped>
/* Top bar specific styles */
</style>