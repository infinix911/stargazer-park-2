<template>
  <div class="bg-[#07102e] py-2 text-sm border-b border-[#0c2b5f]">
    <div class="max-w-[1660px] mx-auto px-4">
      <div class="flex items-center justify-between">
        <!-- Left side - can be used for additional content -->
        <div class="flex items-center space-x-4">
          <!-- Add any left-side content here if needed -->
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

const { locale } = useI18n()

// Language switching function
const setLanguage = (lang: 'ko' | 'en') => {
  locale.value = lang
}
</script>

<style scoped>
/* Top bar specific styles */
</style>