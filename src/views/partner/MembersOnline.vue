<template>
  <!-- Page Header -->
  <PartnerPageHeader 
    :title="t('partnerMenu.memberOnline')"
    subtitle="Currently active members and their session details"
    icon="fas fa-circle"
    icon-color="green-blue"
  />

  <div class="max-w-[1500px] mx-auto">
    <!-- Controls Section -->
    <div class="w-full mx-auto px-4 py-6">
      <div class="flex items-end justify-end">
        <button
          @click="refreshData"
          :disabled="loading"
          class="px-6 py-2 rounded-lg text-xs font-semibold text-black bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-300 hover:to-emerald-400 transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i v-if="loading" class="fas fa-spinner fa-spin mr-1"></i>
          <i v-else class="fas fa-sync-alt mr-1"></i>
          {{ loading ? t('common.loading') : t('common.refresh') }}
        </button>
      </div>
    </div>

    <!-- Data Table Section -->
    <div class="max-w-[1500px] mx-auto px-2 pb-6">
      <DataTableCard
        :title="t('partnerMenu.memberOnline')"
        subtitle="Currently active members and their session details"
        :record-count="tableData.length"
        icon="fas fa-circle"
        icon-color="#10b981"
        :loading="loading"
      >
        <!-- Desktop Table -->
        <div class="hidden lg:block">
          <KTDatatable 
            :tableHeader="tableHeaders" 
            :tableData="tableData" 
            :rowsPerPage="50" 
            :loading="loading"
          >
            <template v-slot:cell-location="{ row: data }">
              <div class="text-center">
                <a
                  :href="getIpLookupUrl(data.last_ip)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center px-3 py-1 text-xs font-medium bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border border-blue-400/30 whitespace-nowrap"
                >
                  <i class="fas fa-external-link-alt mr-1.5"></i>
                  {{ data.last_ip }}
                </a>
              </div>
            </template>
            
            <template v-slot:cell-status="{ row: data }">
              <div class="text-center">
                <span class="inline-flex items-center px-2 py-1 text-xs font-medium bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-lg border border-green-400/30">
                  <i class="fas fa-circle mr-1 text-green-300 animate-pulse"></i>
                  {{ t('partner.online') }}
                </span>
              </div>
            </template>
          </KTDatatable>
        </div>

                 <!-- Mobile Cards -->
         <div class="lg:hidden space-y-4">
           <!-- Loading State -->
           <MobileLoadingSkeleton v-if="loading" :count="3" />

          <!-- Empty State -->
          <div v-else-if="!tableData.length" class="text-center py-12">
            <div class="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-circle text-white/40 text-2xl"></i>
            </div>
            <p class="text-white/60 text-sm">{{ t("common.noDataFound") }}</p>
          </div>

          <!-- Member Cards -->
          <div
            v-else
            v-for="member in tableData"
            :key="member.member_id"
            class="mt-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-200"
          >
            <!-- First Row: member, name, level, last_login -->
            <div class="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500/20 rounded-lg flex items-center justify-center">
                  <i class="fas fa-circle text-green-400 text-sm animate-pulse"></i>
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="text-sm font-semibold text-white">{{ member.member }}</h3>
                    <span class="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full">
                      {{ t(`partner.level${member.level}`) }}
                    </span>
                  </div>
                  <div class="flex items-center gap-2 text-xs text-gray-400">
                    <span>{{ member.name || t("partner.nickname") }}</span>
                    <span>•</span>
                    <span>{{ moment(member.last_login).format("MM/DD/YYYY HH:mm") }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Second Row: wallet, wallet_point -->
            <div class="flex items-center justify-between pb-3 border-b border-white/10 w-full">
              <div class="flex justify-between gap-4 w-full">
                <div class="flex items-center gap-2">
                  <span class="text-xs text-gray-400">{{ t("partner.wallet") }}</span>
                  <span class="text-sm font-bold text-white">
                    {{ member.wallet?.toLocaleString() || "0" }}
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-xs text-gray-400">{{ t("partner.walletPoint") }}</span>
                  <span class="text-sm font-bold text-yellow-300">
                    {{ member.wallet_point?.toLocaleString() || "0" }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Third Row: IP Address and Status -->
            <div class="flex items-center justify-between pt-3">
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-400">{{ t("partner.ip") }}</span>
                <a
                  :href="getIpLookupUrl(member.last_ip)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center px-2 py-1 text-xs font-medium bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white rounded shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border border-blue-400/30"
                >
                  <i class="fas fa-external-link-alt mr-1"></i>
                  {{ member.last_ip }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </DataTableCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import moment from "moment";
import ApiService from "@/services/ApiService";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import DataTableCard from "@/components/ui/DataTableCard.vue";
import PartnerPageHeader from "@/components/partner/PartnerPageHeader.vue";
import MobileLoadingSkeleton from "@/components/ui/MobileLoadingSkeleton.vue";

// Types
export interface IData {
  last_ip: string;
  last_login: string;
  level: number;
  member: string;
  member_id: string;
  name: string;
  wallet: number;
  wallet_game: number;
  wallet_point: number;
}

// Composables
const { t } = useI18n();

// Reactive state
const tableData = ref<Array<IData>>([]);
const loading = ref(false);

// Computed properties
const tableHeaders = computed(() => [
  { key: "member", name: t("partner.member") },
  { key: "name", name: t("partner.nickname"), text: true },
  { key: "level", name: t("partner.level"), text: true },
  { key: "last_login", name: t("partner.lastLogin"), text: true },
  { key: "wallet", name: t("partner.wallet"), currency: true },
  { key: "wallet_point", name: t("partner.walletPoint"), currency: true },
  { key: "location", name: t("partner.ip"), customslot: true },
]);

// Methods
const getIpLookupUrl = (ip: string): string => {
  return `https://whatismyipaddress.com/ip/${ip}`;
};

const fetchOnlineMembers = async (): Promise<IData[]> => {
  try {
    const response = await ApiService.get('/partner/members/online');
    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch online members:', error);
    return [];
  }
};

const refreshData = async (): Promise<void> => {
  try {
    loading.value = true;
    const results = await fetchOnlineMembers();
    tableData.value = results;
  } finally {
    loading.value = false;
  }
};

// Lifecycle
onMounted(refreshData);
</script>

<style scoped>
@import '@/assets/common-dashboard.css';
</style>