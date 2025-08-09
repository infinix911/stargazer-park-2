<template>
  <!-- Page Header -->
  <PartnerPageHeader 
    :title="$t('partnerMenu.statistics')"
    subtitle="Game statistics and performance analytics"
    icon="fas fa-chart-bar"
    icon-color="yellow-orange"
  />

  <div class="max-w-[1500px] mx-auto">
    <!-- Game Type Tabs -->
    <div class="w-full mx-auto px-4 py-6">
      <div class="border-b border-white/20">
        <nav class="flex space-x-8">
          <button
            v-for="tab in gameTabs"
            :key="tab.key"
            @click="setActiveTab(tab.key)"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-base transition-colors duration-200',
              activeTab === tab.key 
                ? 'border-blue-500 text-blue-400' 
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
            ]"
          >
            <i :class="`${tab.icon} mr-2`"></i>
            {{ $t(tab.label) }}
          </button>
        </nav>
      </div>
    </div>

    <!-- Game Content -->
    <div class="w-full mx-auto px-4 pb-8">
      <Statistics 
        v-if="activeTab"
        :game="activeTab.toUpperCase()" 
        :key="activeTab"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Statistics from "@/components/partner/game-statistics/Statistics.vue";

export default defineComponent({
  name: "GameStatistics",
  components: {
    Statistics,
  },
  setup() {
    const activeTab = ref("all");
    
    const gameTabs = [
      {
        key: "all",
        label: "partner.all",
        icon: "fas fa-chart-line"
      },
      {
        key: "casino",
        label: "partner.casino",
        icon: "fas fa-coins"
      },
      {
        key: "hotel",
        label: "partner.hotel", 
        icon: "fas fa-building"
      },
      {
        key: "slot",
        label: "partner.slot",
        icon: "fas fa-gamepad"
      },
      {
        key: "sport",
        label: "partner.sport",
        icon: "fas fa-futbol"
      }
    ];

    const setActiveTab = (tab: string) => {
      activeTab.value = tab;
    };

    return {
      activeTab,
      gameTabs,
      setActiveTab,
    };
  },
});
</script>

<style scoped>
@import '@/assets/common-dashboard.css';
</style>