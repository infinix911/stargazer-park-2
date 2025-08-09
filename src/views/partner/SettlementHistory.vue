<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-white mb-4">{{ $t('partnerMenu.settlementHistory') }}</h1>
    <p class="text-gray-400">정산 내역 페이지입니다.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SettlementHistory'
});
</script>