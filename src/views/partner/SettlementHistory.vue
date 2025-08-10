<template>
  <div class="p-6">
    <PartnerPageHeader 
      :title="t('partnerMenu.settlementHistory')"
      subtitle="정산 내역 페이지입니다."
      icon="fas fa-file-alt"
      icon-color="green-blue"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'SettlementHistory',
  setup() {
    const { t } = useI18n();
    return { t };
  }
});
</script>