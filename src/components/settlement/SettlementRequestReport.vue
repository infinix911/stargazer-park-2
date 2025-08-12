<template>
  <div class="space-y-6">
    <!-- Header Section with Date Picker and Actions -->
      <div class="my-8 flex flex-col lg:flex-row gap-4 items-stretch lg:items-end lg:justify-between w-full">
        <!-- Request Withdrawal Button - Left Side -->
        <div class="flex justify-center lg:justify-start items-end">
          <button
            @click="requestWithdrawal"
            class="px-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg h-[40px] w-full sm:w-auto"
          >
            <i class="fas fa-paper-plane mr-2"></i>
            {{ t("partnerMenu.settlementRequest") }}
          </button>
        </div>

        <!-- Date Controls - Right Side -->
        <div class="flex flex-col sm:flex-row lg:flex-row gap-3 items-stretch sm:items-end lg:items-end">
          <!-- Date Range Picker -->
          <div class="w-full sm:flex-1 sm:min-w-0 sm:max-w-[300px] lg:w-[300px]">
            <DateRangePicker
              class="w-full !h-[40px] date-picker-modern"
              v-model="daterange"
              initial="month"
            />
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
              class="h-[40px] flex-1 sm:w-20 sm:flex-initial rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i v-if="loading" class="fas fa-spinner fa-spin mr-1"></i>
              <i v-else class="fas fa-search mr-1"></i>
              {{ loading ? t('common.loading') : t('search') }}
            </button>
          </div>
        </div>
      </div>
    <!-- Settlement Data Table -->
    <DataTableCard
      :title="`${game} ${t('partnerMenu.settlementRequest')}`"
      :subtitle="`Details for settlement request`"
      :record-count="tableData.length"
      icon="fas fa-chart-line"
      icon-color="#10b981"
      :loading="loading"
    >
      <!-- Desktop Table -->
      <div class="hidden lg:block">
        <KTDatatable :tableHeader="tableHeaders" :tableData="tableData" :rowsPerPage="50" :loading="loading" />
      </div>

      <!-- Mobile Cards -->
      <div class="lg:hidden space-y-4">
        <!-- Loading State -->
        <MobileLoadingSkeleton v-if="loading" :count="5" />

        <!-- Empty State -->
        <div v-else-if="!tableData.length" class="text-center py-12">
          <div class="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-chart-line text-white/40 text-2xl"></i>
          </div>
          <p class="text-white/60 text-sm">{{ t("common.noDataFound") }}</p>
        </div>

        <!-- Settlement Cards -->
        <div
          v-else
          v-for="settlement in tableData"
          :key="settlement.pdate"
          class="mt-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-200"
        >
          <!-- First Row: Date and Profit -->
          <div class="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500/20 rounded-lg flex items-center justify-center">
                <i class="fas fa-calendar text-green-400 text-sm"></i>
              </div>
              <div>
                <h3 class="text-sm font-semibold text-white">{{ moment(settlement.pdate).format("MM/DD/YYYY") }}</h3>
                <div class="flex items-center gap-2 text-xs text-gray-400">
                  <span>{{ t("date") }}</span>
                </div>
              </div>
            </div>
            
            <!-- Profit Status - Right Side -->
            <div class="flex-shrink-0">
              <span
                v-if="settlement.profit >= 0"
                class="inline-flex items-center px-2 py-1 text-xs font-medium bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-lg border border-green-400/30"
              >
                <i class="fas fa-arrow-up mr-1"></i>
                {{ n(settlement.profit) }}
              </span>
              <span
                v-else
                class="inline-flex items-center px-2 py-1 text-xs font-medium bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-full shadow-lg border border-red-400/30"
              >
                <i class="fas fa-arrow-down mr-1"></i>
                {{ n(Math.abs(settlement.profit)) }}
              </span>
            </div>
          </div>

          <!-- Second Row: Bet Amount and Win Amount -->
          <div class="grid grid-cols-2 gap-4 mb-4 pb-3 border-b border-white/10">
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-400">{{ t("partner.betamount") }}</span>
                <span class="inline-flex items-center px-2 py-1 text-xs font-medium text-white">
                  {{ n(settlement.betamt) }}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-400">{{ t("partner.winningAmount") }}</span>
                <span class="inline-flex items-center px-2 py-1 text-xs font-medium text-white">
                  {{ n(settlement.winamt) }}
                </span>
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-400">{{ t("partner.losingAmount") }}</span>
                <span class="inline-flex items-center px-2 py-1 text-xs font-medium text-white">
                  {{ n(settlement.loseamt) }}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-400">{{ t("partner.rollFee") }}</span>
                <span class="inline-flex items-center px-2 py-1 text-xs font-medium text-white">
                  {{ n(settlement.rollamt) }}
                </span>
              </div>
            </div>
          </div>

                     <!-- Third Row: Profit -->
           <div class="flex items-center justify-between pt-3">
             <div class="flex items-center gap-2">
               <span class="text-xs text-gray-400">{{ t("partner.profit") }}</span>
               <span
                 v-if="settlement.profit >= 0"
                 class="inline-flex items-center px-3 py-1 text-sm font-medium bg-green-500/20 text-green-300 rounded-lg border border-green-500/30"
               >
                 +{{ n(settlement.profit) }}
               </span>
               <span
                 v-else
                 class="inline-flex items-center px-3 py-1 text-sm font-medium bg-red-500/20 text-red-300 rounded-lg border border-red-500/30"
               >
                 {{ n(settlement.profit) }}
               </span>
             </div>
           </div>
        </div>
      </div>
    </DataTableCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import moment from "moment";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/stores/auth";
import Swal from "sweetalert2";
import ApiService from "@/services/ApiService";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import DateRangePicker from "@/components/kt-date/DateRangePicker.vue";
import DataTableCard from "@/components/ui/DataTableCard.vue";
import MobileLoadingSkeleton from "@/components/ui/MobileLoadingSkeleton.vue";
import qs from "qs";

interface IData {
  pdate: string;
  betamt: number;
  winamt: number;
  loseamt: number;
  rollamt: number;
  profit: number;
}

interface DateRange {
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
const authStore = useAuthStore();

// Reactive data
const tableData = ref<Array<IData>>([]);
const daterange = ref<DateRange>({
  start: moment().startOf("month").format("YYYY-MM-DD"),
  end: moment().format("YYYY-MM-DD"),
});

// Date Button Configuration
const dateButtons = [
  {
    key: "today",
    label: "dateRange.today",
    range: {
      start: moment().format("YYYY-MM-DD"),
      end: moment().format("YYYY-MM-DD"),
    },
  },
  {
    key: "lastWeek",
    label: "dateRange.lastWeek",
    range: {
      start: moment().subtract(7, "days").format("YYYY-MM-DD"),
      end: moment().format("YYYY-MM-DD"),
    },
  },
  {
    key: "fifteenDays",
    label: "dateRange.fifteenDays",
    range: {
      start: moment().subtract(15, "days").format("YYYY-MM-DD"),
      end: moment().format("YYYY-MM-DD"),
    },
  },
];

// Loading state
const loading = ref(false);

// Table headers
const tableHeaders = [
  { key: "pdate", name: t("date"), text: true },
  {
    key: "betamt",
    name: t("partner.betamount"),
    currency: true,
  },
  { key: "winamt", name: t("partner.winningAmount"), currency: true },
  { key: "loseamt", name: t("partner.losingAmount"), currency: true },
  { key: "rollamt", name: t("partner.rollFee"), currency: true },
  {
    key: "profit",
    name: t("partner.profit"),
    currency: true,
  },
];

// Computed
const user = computed(() => authStore.user);

// Methods
const setSelectedDate = (date: DateRange) => {
  if (daterange.value.start !== date.start || daterange.value.end !== date.end) {
    daterange.value.start = date.start;
    daterange.value.end = date.end;
  }
};

const getList = async () => {
  try {
    loading.value = true;
    
    const query = qs.stringify({
      game: props.game,
      start: daterange.value.start,
      end: daterange.value.end,
    });

    const results = await ApiService.get(
      `/partner/settlements/request?${query}`
    ).then((res) => res.data);

    if (results && results.length > 0) {
      tableData.value.splice(0, tableData.value.length, ...results);
    }
  } catch (error) {
    console.error("Error fetching settlement data:", error);
  } finally {
    loading.value = false;
  }
};

const requestWithdrawal = async () => {
  try {
    await ApiService.post("/partner/settlements/request", {
      game: props.game,
    });

    Swal.fire({
      title: t("partnerMenu.settlementRequest"),
      text: t("partner.settlemetRequestSuccess"),
      icon: "success",
      confirmButtonColor: "#10b981",
    });

    getList();
  } catch (error: any) {
    Swal.fire({
      title: t("partnerMenu.settlementRequest"),
      text: t("Error." + (error.response?.data?.message || "Unknown error")),
      icon: "error",
      confirmButtonColor: "#ef4444",
    });
  }
};

// Auto-refresh list when daterange changes
watch(
  daterange,
  (newVal, oldVal) => {
    if (newVal.start !== oldVal.start || newVal.end !== oldVal.end) {
      getList();
    }
  },
  { deep: true }
);

// Lifecycle
onMounted(() => {
  getList();
});
</script>

<style scoped>
@import '@/assets/common-dashboard.css';
</style>
