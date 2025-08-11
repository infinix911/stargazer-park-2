<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 to-black">
    <!-- Page Header -->
    <div class="relative z-10 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div class="max-w-[1500px] mx-auto px-4 py-6">
        <div class="flex items-center gap-3">
          <div
            class="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg"
          >
            <i class="fas fa-user text-white text-xl"></i>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-white">
              {{ memberData?.member || "Member Profile" }}
            </h1>
            <p class="text-sm text-gray-400">Member ID: {{ memberId }}</p>
          </div>
          <div class="ml-auto">
            <button
              @click="$emit('close')"
              class="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all duration-200 border border-white/20"
            >
              <i class="fas fa-arrow-left mr-2"></i>
              Back to Members
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Area -->
    <div class="max-w-[1500px] mx-auto px-4 py-6 w-full">
      <!-- SummaryProfile -->
      <div v-if="userdata" class="mb-8">
        <SummaryProfile :userdata="userdata" />
      </div>

      <!-- Tabs -->
      <div class="mb-6 w-full">
        <div class="flex space-x-1 border-b border-white/10 w-full">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="setActiveTab(tab.key)"
            :class="[
              'flex-1 px-6 py-3 text-sm font-medium rounded-t-lg transition-all duration-200 whitespace-nowrap',
              activeTab === tab.key
                ? 'text-blue-400 bg-white/5 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white hover:bg-white/5',
            ]"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="space-y-6 w-full">
        <div v-if="activeTab === 'details'" class="space-y-6 w-full">
          <!-- <div class="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-white/10 w-full"> -->
          <Dashboard :member-id="memberId" />
        </div>

        <div v-else-if="activeTab === 'betHistory'" class="space-y-6 w-full">
          <Betting :member-id="memberId" />
        </div>

        <div v-else-if="activeTab === 'rateSettings'" class="space-y-6 w-full">
          <RateSettings :userdata="userdata || {}" @refresh="getData" />
        </div>

        <div v-else-if="activeTab === 'coupons'" class="space-y-6 w-full">
          <Coupons :member_id="memberId" />
        </div>

        <div v-else-if="activeTab === 'depWidHistory'" class="space-y-6 w-full">
          <div
            class="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-white/10 w-full"
          >
            <h3 class="text-xl font-semibold text-white mb-4">
              Deposit/Withdrawal History Tab
            </h3>
            <p class="text-gray-400">This tab will contain transaction history.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import ApiService from "@/services/ApiService";
import SummaryProfile from "./SummaryProfile.vue";
import Dashboard from "../Dashboard.vue";
import Betting from "../Betting.vue";
import Coupons from "./Coupons.vue";
import RateSettings from "./RateSettings.vue";
import type { IMember } from "@/interface/IMember";

// Removed IMember interface, now imported from shared interface file

interface Props {
  memberData?: any;
}

interface Emits {
  (e: "close"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const route = useRoute();
const { t } = useI18n();

// Get memberId from route params
const memberId = computed(() => route.params.memberId as string);

// Reactive variables
const activeTab = ref("details");
const userdata = ref<IMember | null>(null); // Changed type to any
const loading = ref(false);

// Tab configuration
const tabs = [
  { key: "details", label: t("partner.tab.details") },
  { key: "betHistory", label: t("partnerMenu.betting") },
  { key: "rateSettings", label: t("partner.tab.rateSettings") },
  { key: "coupons", label: t("deposit.coupon") },
  // { key: 'depWidHistory',  label: t('partner.tab.transactionHistory') }
];

/**
 * Set Active Tab
 */
const setActiveTab = (tab: string) => {
  activeTab.value = tab;
};

/**
 * Get member info from API
 */
const getData = async () => {
  if (!memberId.value) return;

  try {
    loading.value = true;
    const response = await ApiService.get(`/partner/member/info/${memberId.value}`);
    console.log(response);

    userdata.value = response.data;
  } catch (error) {
    console.error("Error fetching member data:", error);
    // You could show a toast notification here
  } finally {
    loading.value = false;
  }
};

/**
 * Watch for memberId changes and fetch data
 */
watch(
  () => memberId.value,
  (newId) => {
    if (newId) {
      getData();
    }
  },
  { immediate: true }
);

/**
 * On component mount, fetch data if memberId is available
 */
onMounted(() => {
  if (memberId.value) {
    getData();
  }
});

/**
 * Close page
 */
const closePage = () => {
  emit("close");
};
</script>

<style scoped>
/* Custom scrollbar for tab content */
.overflow-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-auto::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.overflow-auto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.overflow-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
