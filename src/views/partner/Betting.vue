<template>
  <!-- Page Header -->
  <PartnerPageHeader 
    :title="t('partnerMenu.betHistory')"
    subtitle="Betting history and game analytics"
    icon="fas fa-dice"
    icon-color="red-rose"
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
              'py-4 px-1 border-b-2 font-medium text-base transition-colors duration-200 text-xs lg:text-base',
              activeTab === tab.key 
                ? 'border-blue-500 text-blue-400' 
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
            ]"
          >
            <i :class="`${tab.icon} mr-2`"></i>
            {{ t(tab.label) }}
          </button>
        </nav>
      </div>
    </div>

    <!-- Game Content -->
    <div class="w-full mx-auto xl:px-4 pb-8">
      <GameBetHistory 
          v-if="activeTab"
          :game="activeTab.toUpperCase()" 
          :member-id="effectiveMemberId"
          :key="activeTab"
        />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import GameBetHistory from "@/components/bet-history/GameBetHistory.vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "BetHistory",
  components: {
    GameBetHistory,
  },
  props: {
    memberId: {
      type: String,
      default: null
    }
  },
  setup(props) {
    const { t } = useI18n();
    const activeTab = ref("casino");
    
    // Get memberId from props only
    const effectiveMemberId = computed(() => {
      return props.memberId || undefined;
    });
    
    const gameTabs = [
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
      t,
      activeTab,
      gameTabs,
      setActiveTab,
      effectiveMemberId,
    };
  },
});
</script>

<style scoped>
@import '@/assets/common-dashboard.css';
</style>