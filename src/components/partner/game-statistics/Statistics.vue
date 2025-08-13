<template>
  <div>
    <!-- Controls Section -->
    <div class="w-full px-4 py-6">
      <div class="flex flex-col sm:flex-row lg:flex-row gap-3 items-stretch sm:items-end lg:items-end justify-end">
        <!-- Search Fields Row -->
        <div class="flex flex-col sm:flex-row gap-3 flex-1 lg:flex-initial">
          <!-- Member Select -->
          <div class="w-full sm:w-48 lg:w-48">
            <select 
              v-model="memberId" 
              class="w-full bg-white/10 border border-white/20 rounded-lg text-white text-sm px-3 focus:border-blue-500 focus:outline-none h-[40px]"
            >
              <option value="" class="bg-gray-800 text-white">{{ t("partner.all") }}</option>
              <option v-for="mem in members" :key="mem.member_id" :value="mem.member_id" class="bg-gray-800 text-white">
                {{ mem.member }}
              </option>
            </select>
          </div>

          <!-- Date Range Picker -->
          <div class="w-full sm:flex-1 sm:min-w-0 sm:max-w-[300px] lg:w-[300px]">
            <DateRangePicker
              class="w-full !h-[40px] date-picker-modern"
              v-model="dateRange"
              initial="month"
            />
          </div>
        </div>

        <!-- Quick Date Buttons -->
        <div class="flex gap-2 items-end justify-center sm:justify-end lg:justify-end">
          <button
            v-for="dateButton in dateButtons"
            :key="dateButton.key"
            @click="setSelectedDate(dateButton.range)"
            class="h-[40px] flex-1 sm:w-16 sm:flex-initial rounded-lg text-xs font-medium text-white/80 bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-200 hover:scale-105"
          >
            {{ t(dateButton.label) }}
          </button>
          <button
            @click="getList"
            :disabled="loading"
            class="h-[40px] flex-1 sm:w-20 sm:flex-initial rounded-lg text-xs font-semibold text-black bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin mr-1"></i>
            <i v-else class="fas fa-search mr-1"></i>
            {{ loading ? t('common.loading') : t('search') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Data Table Section -->
    <div class="w-full px-4 pb-6">
      <DataTableCard
        :title="`${gameDisplayName} ${t('partnerMenu.statistics')}`"
        subtitle="Game performance and analytics overview"
        :record-count="tableData.length"
        icon="fas fa-chart-bar"
        icon-color="#eab308"
        :loading="loading"
      >
        <!-- Desktop Table -->
        <div class="hidden lg:block">
          <KTDatatable :tableHeader="tableHeaders" :tableData="tableData" :rowsPerPage="50" :loading="loading">
            <!-- Tie Amount (always 0 for now) -->
            <template v-slot:cell-tieamt="{}">
              <div class="text-center">
                <span class="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-500/20 text-gray-300 rounded-lg border border-gray-500/30">
                  <i class="fas fa-minus mr-1"></i>
                  0
                </span>
              </div>
            </template>
          </KTDatatable>
        </div>

        <!-- Mobile Cards -->
        <div class="lg:hidden space-y-4">
          <!-- Loading State -->
          <MobileLoadingSkeleton v-if="loading" :count="5" />

          <!-- Empty State -->
          <div v-else-if="!tableData.length" class="text-center py-12">
            <div class="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-chart-bar text-white/40 text-2xl"></i>
            </div>
            <p class="text-white/60 text-sm">{{ t("common.noDataFound") }}</p>
          </div>

          <!-- Statistics Cards -->
          <div
            v-else
            v-for="stat in tableData"
            :key="stat.pdate"
            class="mt-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-200"
          >
            <!-- First Row: Date and Profit -->
            <div class="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500/20 rounded-lg flex items-center justify-center">
                  <i class="fas fa-calendar text-yellow-400 text-sm"></i>
                </div>
                <div>
                  <h3 class="text-sm font-semibold text-white">{{ moment(stat.pdate).format("MM/DD/YYYY") }}</h3>
                  <div class="flex items-center gap-2 text-xs text-gray-400">
                    <span>{{ t("partner.date") }}</span>
                  </div>
                </div>
              </div>
              
                             <!-- Profit Status - Right Side -->
               <div class="flex-shrink-0">
                 <span
                   v-if="stat.profit >= 0"
                   class="inline-flex items-center px-2 py-1 text-xs font-medium bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-lg border border-green-400/30"
                 >
                   <i class="fas fa-arrow-up mr-1"></i>
                   {{ n(stat.profit) }}
                 </span>
                 <span
                   v-else
                   class="inline-flex items-center px-2 py-1 text-xs font-medium bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-full shadow-lg border border-red-400/30"
                 >
                   <i class="fas fa-arrow-down mr-1"></i>
                   {{ n(Math.abs(stat.profit)) }}
                 </span>
               </div>
            </div>

            <!-- Second Row: Deposits and Withdrawals -->
            <div class="grid grid-cols-2 gap-4 mb-4 pb-3 border-b border-white/10">
                             <div class="space-y-2">
                 <div class="flex items-center gap-2">
                   <span class="text-xs text-gray-400">{{ t("partner.depAmount") }}</span>
                   <span class="inline-flex items-center px-2 py-1 text-xs font-medium text-white">
                     <i class="fas fa-arrow-down mr-1"></i>
                     {{ n(stat.deposits) }}
                   </span>
                 </div>
                 <div class="flex items-center gap-2">
                   <span class="text-xs text-gray-400">{{ t("partner.widAmount") }}</span>
                   <span class="inline-flex items-center px-2 py-1 text-xs font-medium text-white">
                     <i class="fas fa-arrow-up mr-1"></i>
                     {{ n(stat.withdrawals) }}
                   </span>
                 </div>
               </div>
               <div class="space-y-2">
                 <div class="flex items-center gap-2">
                   <span class="text-xs text-gray-400">{{ t("partner.depWidProfit") }}</span>
                   <span class="inline-flex items-center px-2 py-1 text-xs font-medium text-white">
                     {{ n(stat.sonic) }}
                   </span>
                 </div>
                 <div class="flex items-center gap-2">
                   <span class="text-xs text-gray-400">{{ t("partner.betamount") }}</span>
                   <span class="inline-flex items-center px-2 py-1 text-xs font-medium text-white">
                     {{ n(stat.betamt) }}
                   </span>
                 </div>
               </div>
            </div>

            <!-- Third Row: Win Amount and Rolling -->
            <div class="grid grid-cols-2 gap-4 pt-3">
                             <div class="space-y-2">
                 <div class="flex items-center gap-2">
                   <span class="text-xs text-gray-400">{{ t("partner.winamount") }}</span>
                   <span class="inline-flex items-center px-2 py-1 text-xs font-medium text-white">
                     {{ n(stat.winamt) }}
                   </span>
                 </div>
                 <div class="flex items-center gap-2">
                   <span class="text-xs text-gray-400">{{ t("partner.rolling") }}</span>
                   <span class="inline-flex items-center px-2 py-1 text-xs font-medium text-white">
                     {{ n(stat.rollamt) }}
                   </span>
                 </div>
               </div>
               <div class="space-y-2">
                 <div class="flex items-center gap-2">
                   <span class="text-xs text-gray-400">{{ t("partner.subRolling") }}</span>
                   <span class="inline-flex items-center px-2 py-1 text-xs font-medium text-white">
                     {{ n(stat.rollamtsub) }}
                   </span>
                 </div>
                 <div class="flex items-center gap-2">
                   <span class="text-xs text-gray-400">{{ t("partner.betProfit") }}</span>
                   <span
                     v-if="stat.profit >= 0"
                     class="inline-flex items-center px-2 py-1 text-xs font-medium text-white"
                   >
                     +{{ n(stat.profit) }}
                   </span>
                   <span
                     v-else
                     class="inline-flex items-center px-2 py-1 text-xs font-medium text-white"
                   >
                     {{ n(stat.profit) }}
                   </span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </DataTableCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import moment from "moment";
import qs from "qs";
import { useI18n } from "vue-i18n";
import ApiService from "@/services/ApiService";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import DateRangePicker from "@/components/kt-date/DateRangePicker.vue";
import DataTableCard from "@/components/ui/DataTableCard.vue";
import MobileLoadingSkeleton from "@/components/ui/MobileLoadingSkeleton.vue";

// Types
export interface IMember {
  member: string;
  member_id: string;
}

export interface IData {
  betamt: number;
  deposits: number;
  loseamt: number;
  loseamtsub: number;
  pdate: string;
  profit: number;
  rollamt: number;
  rollamtsub: number;
  sonic: number;
  winamt: number;
  withdrawals: number;
}

export interface DateRange {
  start: string;
  end: string;
}

// Props
interface Props {
  game: string;
}

const props = defineProps<Props>();

// Composables
const { t, n } = useI18n();

// Reactive state
const tableData = ref<IData[]>([]);
const memberId = ref("");
const members = ref<IMember[]>([]);
const loading = ref(false);

// Computed properties
const tableHeaders = [
  { key: "pdate", name: t("partner.date"), text: true },
  { key: "deposits", name: t("partner.depAmount"), currency: true },
  { key: "withdrawals", name: t("partner.widAmount"), currency: true },
  { key: "sonic", name: t("partner.depWidProfit"), currency: true },
  { key: "betamt", name: t("partner.betamount"), currency: true },
  { key: "winamt", name: t("partner.winamount"), currency: true },
  { key: "profit", name: t("partner.betProfit"), currency: true },
  { key: "rollamtsub", name: t("partner.subRolling"), currency: true },
  { key: "rollamt", name: t("partner.rolling"), currency: true },
];

const dateButtons = [
  {
    key: "today",
    label: "dateRange.today",
    range: {
      start: moment().format('YYYY-MM-DD'),
      end: moment().format('YYYY-MM-DD'),
    }
  },
  {
    key: "week",
    label: "dateRange.lastWeek",
    range: {
      start: moment().subtract(7, 'days').format('YYYY-MM-DD'),
      end: moment().format('YYYY-MM-DD'),
    }
  },
  {
    key: "fifteen",
    label: "dateRange.fifteenDays",
    range: {
      start: moment().subtract(15, 'days').format('YYYY-MM-DD'),
      end: moment().format('YYYY-MM-DD'),
    }
  }
];

const gameDisplayName = computed(() => {
  const gameNames = {
    'ALL': t('partner.all'),
    'CASINO': t('partner.casino'),
    'HOTEL': t('partner.hotel'),
    'SLOT': t('partner.slot'),
    'SPORT': t('partner.sport'),
  };
  return gameNames[props.game as keyof typeof gameNames] || props.game;
});

// Date range (reactive, two-way bind with DateRangePicker)
const dateRange = ref({
  start: moment().startOf("month").format("YYYY-MM-DD"),
  end: moment().format("YYYY-MM-DD"),
});

// Methods
const setSelectedDate = (date: DateRange) => {
  if (dateRange.value.start !== date.start || dateRange.value.end !== date.end) {
    dateRange.value.start = date.start;
    dateRange.value.end = date.end;
  }
};

const getMembers = async () => {
  try {
    const mems: IMember[] = await ApiService.get("/partner/members/select")
      .then((res) => res.data)
      .catch(() => []);
    members.value.splice(0, members.value.length, ...mems);
  } catch (error) {
    console.error('Failed to fetch members:', error);
  }
};

const getList = async () => {
  try {
    loading.value = true;
    let query = qs.stringify({
      game: props.game,
      start: dateRange.value.start,
      end: dateRange.value.end,
    });

    if (memberId.value !== "") {
      query = qs.stringify({
        game: props.game,
        start: dateRange.value.start,
        end: dateRange.value.end,
        member_id: memberId.value,
      });
    }

    const results = await ApiService.get(`/partner/game-stats?${query}`)
      .then((res) => res.data)
      .catch(() => []);

    tableData.value.splice(0, tableData.value.length, ...results);
  } catch (error) {
    console.error('Failed to fetch game statistics:', error);
  } finally {
    loading.value = false;
  }
};

// Watchers
watch(
  dateRange,
  (newVal, oldVal) => {
    if (newVal.start !== oldVal.start || newVal.end !== oldVal.end) {
      getList();
    }
  },
  { deep: true }
);

// Lifecycle
onMounted(() => {
  getMembers();
});
</script>

<style scoped>
@import '@/assets/common-dashboard.css';
</style>