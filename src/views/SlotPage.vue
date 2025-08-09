<template>
  <div class="min-h-screen bg-[#101010]">
    <!-- Slot Games Section -->
    <div class="py-12">
      <div class="max-w-[1660px] mx-auto px-4">
        <SlotsGames />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SlotsGames from '../components/SlotsGames.vue'
</script>
