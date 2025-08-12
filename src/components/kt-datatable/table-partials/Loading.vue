<template>
  <div class="overlay-layer card-rounded bg-black/20 backdrop-blur-sm flex items-center justify-center">
    <!-- Enhanced Loading Spinner -->
    <div class="text-center">
      <div class="relative">
        <!-- Main Spinner -->
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-white/30 border-t-white mx-auto mb-4"></div>
        <!-- Pulse Ring -->
        <div class="absolute inset-0 rounded-full h-12 w-12 border-2 border-white/20 animate-ping"></div>
      </div>
      <p class="text-white text-sm font-medium animate-pulse">{{ t('common.loading') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<style scoped>
.overlay-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Custom animation for the spinner */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Pulse animation for the ring */
@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* Pulse animation for text */
@keyframes pulse {
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
