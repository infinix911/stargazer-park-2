<template>
  <div>
    <!-- Page Header -->
    <PartnerPageHeader
      :title="t('partnerMenu.settlementRequest')"
      subtitle="Manage game settlement requests and records"
      icon="fas fa-paper-plane"
      iconColor="yellow-orange"
    />

    <!-- Main Content -->
    <div class="relative z-10 mx-auto px-4 py-6 w-full max-w-[1500px]">
      <!-- Game Type Tabs -->
      <div class="border-b border-white/20">
        <nav class="flex space-x-2 lg:space-x-8">
          <button
            v-for="tab in gameTabs"
            :key="tab.key"
            @click="setActiveTab(tab.key)"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-base transition-colors duration-200 text-xs lg:text-base',
              activeTab === tab.key
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300',
            ]"
          >
            <i :class="`${tab.icon} mr-2`"></i>
            {{ t(tab.label) }}
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="tab-content">
        <SettlementRequestReport v-if="activeTab" :game="activeTab.toUpperCase()" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import PartnerPageHeader from "@/components/partner/PartnerPageHeader.vue";
import SettlementRequestReport from "@/components/settlement/SettlementRequestReport.vue";

const { t } = useI18n();

// Game tabs configuration
const gameTabs = [
  {
    key: "casino",
    label: "partner.casino",
    icon: "fas fa-dice-five",
  },
  {
    key: "hotel",
    label: "partner.hotel",
    icon: "fas fa-building",
  },
  {
    key: "slot",
    label: "partner.slot",
    icon: "fas fa-coins",
  },
  {
    key: "sport",
    label: "partner.sport",
    icon: "fas fa-futbol",
  },
];

// Active tab state
const activeTab = ref("casino");

// Set active tab
const setActiveTab = (tab: string) => {
  activeTab.value = tab;
};
</script>