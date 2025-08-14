<template>
  <!-- Page Header -->
  <PartnerPageHeader
    :title="t('partnerMenu.shopTranHistory')"
    subtitle="Shop transaction history and member transfers"
    icon="fas fa-store"
    icon-color="purple-indigo"
  />

  <div class="max-w-[1500px] mx-auto">
    <!-- Controls Section -->
    <div class="w-full mx-auto px-4 py-6" v-if="authStore.user.shoplevel < 2">
      <div class="flex flex-col sm:flex-row lg:flex-row gap-3 items-stretch sm:items-end lg:items-end justify-end">
        <!-- Search Fields Row -->
        <div class="flex flex-col sm:flex-row gap-3 flex-1 lg:flex-initial justify-end items-end">
          <!-- Transaction Type -->
          <div class="w-full sm:w-32 lg:w-32">
            <span class="text-gray-200 text-xs block mb-1">{{ t("partner.tranType") }}</span>
            <select
              v-model="tranType"
              class="w-full bg-white/10 border border-white/20 rounded-lg text-white text-sm px-3 focus:border-blue-500 focus:outline-none h-[40px]"
            >
              <option
                v-for="option in tranTypes"
                :key="option.value"
                :value="option.value"
                class="bg-gray-800 text-white"
              >
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- Store Member -->
          <div class="w-full sm:w-48 lg:w-48">
            <span class="text-gray-200 text-xs block mb-1">{{ t("partner.storeMember") }}</span>
            <input
              v-model="receiver"
              type="text"
              class="w-full bg-white/10 border border-white/20 rounded-lg text-white text-sm px-3 focus:border-blue-500 focus:outline-none placeholder-gray-400 h-[40px]"
            />
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
            class="h-[40px] flex-1 sm:w-20 sm:flex-initial bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin mr-1"></i>
            <i v-else class="fas fa-search mr-1"></i>
            {{ loading ? t('common.loading') : t('search') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Data Table Section -->
    <div class="max-w-[1500px] mx-auto px-2 pb-6">
      <DataTableCard
        :record-count="tableData.length"
        :loading="loading"
      >
        <!-- Desktop Table -->
        <div class="hidden lg:block">
          <KTDatatable
            :tableHeader="tableHeaderShop"
            :tableData="tableData"
            :rowsPerPage="50"
            :loading="loading"
          >
            <!-- Transaction Type -->
            <template v-slot:cell-type="{ row: data }">
              <div class="text-center">
                <span
                  v-if="data.type === 'ADD'"
                  class="inline-flex items-center px-3 py-1 text-xs font-medium bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-lg border border-green-400/30"
                >
                  {{ t("partner.add") }}
                </span>
                <span
                  v-else
                  class="inline-flex items-center px-3 py-1 text-xs font-medium bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-full shadow-lg border border-red-400/30"
                >
                  {{ t("partner.deduct") }}
                </span>
              </div>
            </template>

            <!-- Amount -->
            <template v-slot:cell-amount="{ row: data }">
              <div class="text-center">
                <span
                  v-if="data.type === 'ADD'"
                  class="inline-flex items-center px-3 py-1 text-xs font-medium bg-green-500/20 text-green-300 rounded-lg border border-green-500/30"
                >
                  <i class="fas fa-plus mr-1"></i>
                  {{ n(Number(data.amount)) }}
                </span>
                <span
                  v-else
                  class="inline-flex items-center px-3 py-1 text-xs font-medium bg-red-500/20 text-red-300 rounded-lg border border-red-500/30"
                >
                  <i class="fas fa-minus mr-1"></i>
                  {{ n(Number(data.amount)) }}
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
              <i class="fas fa-store text-white/40 text-2xl"></i>
            </div>
            <p class="text-white/60 text-sm">{{ t("common.noDataFound") }}</p>
          </div>

          <!-- Transaction Cards -->
          <div
            v-else
            v-for="transaction in tableData"
            :key="transaction.id || transaction.member_id + transaction.createdAt"
            class="mt-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-200"
          >
            <!-- First Row: Member/Receiver and Transaction Type -->
            <div class="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500/20 rounded-lg flex items-center justify-center">
                  <i class="fas fa-store text-purple-400 text-sm"></i>
                </div>
                <div>
                  <h3 class="text-sm font-semibold text-white">
                    {{ transaction.receiver || transaction.sender || transaction.member }}
                  </h3>
                  <div class="flex items-center gap-2 text-xs text-gray-400">
                    <span>{{ moment(transaction.updatedAt || transaction.createdAt).format("MM/DD/YYYY HH:mm") }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Transaction Type Status - Right Side -->
              <div class="flex-shrink-0">
                <span
                  v-if="transaction.type === 'ADD'"
                  class="inline-flex items-center px-2 py-1 text-xs font-medium bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-lg border border-green-400/30"
                >
                  {{ t("partner.add") }}
                </span>
                <span
                  v-else
                  class="inline-flex items-center px-2 py-1 text-xs font-medium bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-full shadow-lg border border-red-400/30"
                >
                  {{ t("partner.deduct") }}
                </span>
              </div>
            </div>

            <!-- Second Row: Amount -->
            <div class="flex items-center justify-between pt-3">
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-400">{{ t("partner.tranAmount") }}</span>
                <span
                  v-if="transaction.type === 'ADD'"
                  class="inline-flex items-center px-3 py-1 text-sm font-medium bg-green-500/20 text-green-300 rounded-lg border border-green-500/30"
                >
                  <i class="fas fa-plus mr-1"></i>
                  {{ n(Number(transaction.amount)) }}
                </span>
                <span
                  v-else
                  class="inline-flex items-center px-3 py-1 text-sm font-medium bg-red-500/20 text-red-300 rounded-lg border border-red-500/30"
                >
                  <i class="fas fa-minus mr-1"></i>
                  {{ n(Number(transaction.amount)) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DataTableCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import moment from "moment";
import qs from "qs";
import ApiService from "@/services/ApiService";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import DateRangePicker from "@/components/kt-date/DateRangePicker.vue";
import DataTableCard from "@/components/ui/DataTableCard.vue";
import MobileLoadingSkeleton from "@/components/ui/MobileLoadingSkeleton.vue";
import { useAuthStore } from "@/stores/auth";
import PartnerPageHeader from "@/components/partner/PartnerPageHeader.vue";

// Types
export interface IData {
  id?: string;
  member_id: string;
  member: string;
  receiver?: string;
  sender?: string;
  type: string;
  amount: number;
  transaction_type: string;
  amount_deposit: number;
  amount_withdraw: number;
  createdAt: string;
  updatedAt: string;
}

export interface DateRange {
  start: string;
  end: string;
}

// Props
interface Props {
  member_id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  member_id: undefined,
});

// Composables
const { t, n } = useI18n();
const authStore = useAuthStore();

// Reactive state
const tableData = ref<Array<IData>>([]);
const loading = ref(false);
const tranType = ref("ALL");
const receiver = ref("");

// Computed properties
const user = computed(() => authStore.user);

const tableHeaderShop = computed(() => {
  if (user.value.shoplevel === 2) {
    return [
      { key: "sender", name: t("partner.sender"), text: true },
      { key: "type", name: t("partner.tranType"), customslot: true },
      { key: "amount", name: t("partner.tranAmount"), customslot: true },
      { key: "updatedAt", name: t("partner.date"), text: true },
    ];
  }
  return [
    { key: "receiver", name: t("partner.storeMember"), text: true },
    { key: "type", name: t("partner.tranType"), customslot: true },
    { key: "amount", name: t("partner.tranAmount"), customslot: true },
    { key: "updatedAt", name: t("partner.date"), text: true },
  ];
});

const tranTypes = computed(() => [
  { label: t("partner.all"), value: "ALL" },
  { label: t("partner.add"), value: "ADD" },
  { label: t("partner.deduct"), value: "DEDUCT" },
]);

// Date range (reactive, two-way bind with DateRangePicker)
const dateRange = ref({
  start: moment().startOf("month").format("YYYY-MM-DD"),
  end: moment().format("YYYY-MM-DD"),
});

// Date Button Configuration
const dateButtons = computed(() => [
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
]);

// Methods
const setSelectedDate = (date: DateRange) => {
  if (dateRange.value.start !== date.start || dateRange.value.end !== date.end) {
    dateRange.value.start = date.start;
    dateRange.value.end = date.end;
  }
};

const fetchShopTransactions = async (): Promise<IData[]> => {
  try {
    let apipath = "";
    let query = qs.stringify({
      receiver: receiver.value,
      type: tranType.value,
      start: dateRange.value.start,
      end: dateRange.value.end,
    });

    if (user.value.shoplevel < 2) {
      apipath = `/partner/shop/transactions/sender?${query}`;
    } else if (user.value.shoplevel === 2) {
      apipath = `/partner/shop/transactions/receiver`;
    }

    const response = await ApiService.get(apipath);
    return response.data || [];
  } catch (error) {
    console.error("Failed to fetch shop transactions:", error);
    return [];
  }
};

const getList = async (): Promise<void> => {
  try {
    loading.value = true;
    const results = await fetchShopTransactions();
    tableData.value = results;
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
  getList();
});
</script>

<style scoped>
@import "@/assets/common-dashboard.css";
</style>
