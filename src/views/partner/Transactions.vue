<template>
  <!-- Page Header -->
  <PartnerPageHeader
    v-if="member_id === undefined"
    :title="t('partnerMenu.transaction')"
    subtitle="Member deposit and withdrawal transaction history"
    icon="fas fa-exchange-alt"
    icon-color="blue-indigo"
  />

  <div class="max-w-[1500px] mx-auto">
    <!-- Controls Section -->
    <div class="w-full mx-auto px-4 py-6">
      <div class="flex flex-col sm:flex-row lg:flex-row gap-3 items-stretch sm:items-end lg:items-end justify-end">
        <!-- Search Fields Group -->
        <div class="flex flex-col sm:flex-row gap-3 flex-1 lg:flex-initial">
          <!-- Transaction Type -->
          <div class="w-full sm:w-32 lg:w-32">
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

          <!-- Search Type -->
          <div v-if="member_id === undefined" class="w-full sm:w-32 lg:w-32">
            <select
              v-model="searchType"
              class="w-full bg-white/10 border border-white/20 rounded-lg text-white text-sm px-3 focus:border-blue-500 focus:outline-none h-[40px]"
            >
              <option
                v-for="option in searchTypes"
                :key="option.value"
                :value="option.value"
                class="bg-gray-800 text-white"
              >
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- Search Value -->
          <div v-if="member_id === undefined" class="w-full sm:w-48 lg:w-48">
            <input
              v-model="searchValue"
              type="text"
              placeholder="Search value"
              class="w-full bg-white/10 border border-white/20 rounded-lg text-white text-sm px-3 focus:border-blue-500 focus:outline-none placeholder-gray-400 h-[40px]"
            />
          </div>

          <!-- Include Sub Members -->
          <div class="w-full sm:w-auto lg:w-auto">
            <div
              class="flex items-center bg-white/10 border border-white/20 rounded-lg px-3 h-[40px] w-full sm:w-auto"
            >
              <input
                type="checkbox"
                id="include-sub-check"
                v-model="includeSub"
                class="mr-2 bg-white/10 border-white/20 text-blue-500 focus:ring-blue-500 focus:ring-2"
              />
              <label for="include-sub-check" class="text-white text-sm whitespace-nowrap">
                {{ t("partner.includeSub") }}
              </label>
            </div>
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
            {{ loading ? t("common.loading") : t("search") }}
          </button>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div
      class="w-full px-4 pb-6"
      v-if="tranType === 'DEPOSIT' || tranType === 'WITHDRAW' || tranType === 'ALL'"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Total Deposits -->
        <div
          v-if="tranType === 'DEPOSIT' || tranType === 'ALL'"
          class="bg-gradient-to-r from-green-500/20 to-emerald-600/20 backdrop-blur-sm border border-green-500/30 rounded-xl p-6"
        >
          <div class="flex items-center gap-4">
            <div class="p-3 bg-green-500/30 rounded-lg">
              <i class="fas fa-arrow-down text-green-300 text-xl"></i>
            </div>
            <div>
              <h3 class="text-2xl font-bold text-white">{{ n(sums.deposits) }}</h3>
              <p class="text-sm text-gray-300">
                {{ t("partnerMenu.totalDepositAmount") }}
              </p>
            </div>
          </div>
        </div>

        <!-- Total Withdrawals -->
        <div
          v-if="tranType === 'WITHDRAW' || tranType === 'ALL'"
          class="bg-gradient-to-r from-red-500/20 to-rose-600/20 backdrop-blur-sm border border-red-500/30 rounded-xl p-6"
        >
          <div class="flex items-center gap-4">
            <div class="p-3 bg-red-500/30 rounded-lg">
              <i class="fas fa-arrow-up text-red-300 text-xl"></i>
            </div>
            <div>
              <h3 class="text-2xl font-bold text-white">{{ n(sums.withdrawals) }}</h3>
              <p class="text-sm text-gray-300">
                {{ t("partnerMenu.totalWithdrawalAmount") }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Table Section -->
    <div class="max-w-[1500px] mx-auto px-2 pb-6">
      <DataTableCard :record-count="tableData.length" :loading="loading">
        <!-- Desktop Table -->
        <div class="hidden lg:block">
          <KTDatatable
            :tableHeader="tableHeaders"
            :tableData="tableData"
            :rowsPerPage="50"
            :loading="loading"
          >
            <!-- Transaction Type -->
            <template v-slot:cell-transaction_type="{ row: data }">
              <div class="text-center">
                <span
                  v-if="data.transaction_type === 'DEPOSIT'"
                  class="inline-flex items-center px-3 py-1 text-xs font-medium bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-lg border border-green-400/30"
                >
                  {{ t("transactionHistory.types." + data.transaction_type.toLowerCase()) }}
                </span>
                <span
                   v-if="data.transaction_type === 'WITHDRAW'"
                  class="inline-flex items-center px-3 py-1 text-xs font-medium bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-full shadow-lg border border-red-400/30"
                >
                  {{ t("transactionHistory.types.withdrawal") }}
                </span>
              </div>
            </template>

            <!-- Amount -->
            <template v-slot:cell-depwid="{ row: data }">
              <div class="text-center">
                <span
                  v-if="data.transaction_type === 'DEPOSIT'"
                  class="inline-flex items-center px-3 py-1 text-xs font-medium bg-green-500/20 text-green-300 rounded-lg border border-green-500/30"
                >
                  {{ n(parseInt(data.amount_deposit)) }}
                  <span v-if="data.amount_coupon > 0" class="ml-1 text-yellow-300">
                    (+{{ n(parseInt(data.amount_coupon)) }})
                  </span>
                </span>
                <span
                  v-else
                  class="inline-flex items-center px-3 py-1 text-xs font-medium bg-red-500/20 text-red-300 rounded-lg border border-red-500/30"
                >
                  {{ n(parseInt(data.amount_withdraw)) }}
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
              <i class="fas fa-exchange-alt text-white/40 text-2xl"></i>
            </div>
            <p class="text-white/60 text-sm">{{ t("common.noDataFound") }}</p>
          </div>

          <!-- Transaction Cards -->
          <div
            v-else
            v-for="transaction in tableData"
            :key="`${transaction.member_id}-${transaction.createdAt}`"
            class="mt-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-200"
          >
            <!-- First Row: Member and Transaction Type -->
            <div class="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500/20 rounded-lg flex items-center justify-center">
                  <i class="fas fa-user text-blue-400 text-sm"></i>
                </div>
                <div>
                  <h3 class="text-sm font-semibold text-white">{{ transaction.member }}</h3>
                  <div class="flex items-center gap-2 text-xs text-gray-400">
                    <span>{{ moment(transaction.createdAt).format("MM/DD/YYYY HH:mm") }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Transaction Type Status - Right Side -->
              <div class="flex-shrink-0">
                <span
                  v-if="transaction.transaction_type === 'DEPOSIT'"
                  class="inline-flex items-center px-2 py-1 text-xs font-medium bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-lg border border-green-400/30"
                >
                  {{ t("transactionHistory.types." + transaction.transaction_type.toLowerCase()) }}
                </span>
                <span
                   v-if="transaction.transaction_type === 'WITHDRAW'"
                  class="inline-flex items-center px-2 py-1 text-xs font-medium bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-full shadow-lg border border-red-400/30"
                >
                  {{ t("transactionHistory.types.withdrawal") }}
                </span>
              </div>
            </div>

            <!-- Second Row: Amount -->
            <div class="flex items-center justify-between pt-3 pb-1">
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-400">{{ t("partner.tranAmount") }}</span>
                <span
                  v-if="transaction.transaction_type === 'DEPOSIT'"
                  class="inline-flex items-center px-3 py-1 text-sm font-medium bg-green-500/20 text-green-300 rounded-lg border border-green-500/30"
                >
                  {{ n(parseInt(transaction.amount_deposit)) }}
                  <span v-if="transaction.amount_coupon > 0" class="ml-1 text-yellow-300">
                    (+{{ n(parseInt(transaction.amount_coupon)) }})
                  </span>
                </span>
                <span
                  v-else
                  class="inline-flex items-center px-3 py-1 text-sm font-medium bg-red-500/20 text-red-300 rounded-lg border border-red-500/30"
                >
                  {{ n(parseInt(transaction.amount_withdraw)) }}
                </span>
              </div>
            </div>

            <!-- Third Row: Process Date -->
            <div class="flex items-center justify-between pt-3 border-t border-white/10">
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-400">{{ t("partner.processDate") }}</span>
                <span class="text-xs text-gray-300">
                  {{ transaction.updatedAt ? moment(transaction.updatedAt).format("MM/DD/YYYY HH:mm") : "-" }}
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
import { ref, watch, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import moment from "moment";
import qs from "qs";
import ApiService from "@/services/ApiService";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import DateRangePicker from "@/components/kt-date/DateRangePicker.vue";
import DataTableCard from "@/components/ui/DataTableCard.vue";
import MobileLoadingSkeleton from "@/components/ui/MobileLoadingSkeleton.vue";

// Types
export interface IData {
  member_id: string;
  member: string;
  transaction_type: string;
  amount_deposit: number;
  amount_withdraw: number;
  amount_coupon: number;
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

// Reactive state
const tableData = ref<IData[]>([]);
const includeSub = ref(true);
const tranType = ref("ALL");
const searchType = ref("ID");
const searchValue = ref("");
const loading = ref(false);

// Computed properties
const tableHeaders = [
  { key: "member", name: t("partner.member") },
  { key: "transaction_type", name: t("partner.depWid"), customslot: true },
  { key: "depwid", name: t("partner.tranAmount"), customslot: true },
  { key: "createdAt", name: t("partner.reqDate") },
  { key: "updatedAt", name: t("partner.processDate")},
];

const tranTypes = [
  { label: t("partner.all"), value: "ALL" },
  { label: t("partner.deposit"), value: "DEPOSIT" },
  { label: t("partner.withdrawal"), value: "WITHDRAW" },
];

const searchTypes = [
  { label: t("login.id"), value: "ID" },
  { label: t("partner.nickname"), value: "NICKNAME" },
];

const sums = ref({
  withdrawals: 0,
  deposits: 0,
});

// Date range (reactive, two-way bind with DateRangePicker)
const dateRange = ref({
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

// Methods
const setSelectedDate = (date: DateRange) => {
  if (dateRange.value.start !== date.start || dateRange.value.end !== date.end) {
    dateRange.value.start = date.start;
    dateRange.value.end = date.end;
  }
};

const getList = async () => {
  try {
    loading.value = true;
    let query = qs.stringify({
      start: dateRange.value.start,
      end: dateRange.value.end,
      trantype: tranType.value,
      type: searchType.value,
      typeval: searchValue.value,
      inclsub: includeSub.value,
    });

    if (props.member_id) {
      query = qs.stringify({
        start: dateRange.value.start,
        end: dateRange.value.end,
        trantype: tranType.value,
        type: searchType.value,
        typeval: searchValue.value,
        inclsub: includeSub.value,
        member_id: props.member_id,
      });
    }

    const results = await ApiService.get(`/partner/tran-history?${query}`)
      .then((res) => res.data)
      .catch(() => []);

    tableData.value.splice(0, tableData.value.length, ...results);
    getSums(results);
  } catch (error) {
    console.error("Failed to fetch transaction history:", error);
  } finally {
    loading.value = false;
  }
};

const getSums = (results: Array<IData>) => {
  // Total Withdrawals
  sums.value.withdrawals = results.reduce(
    (total: number, obj) => Number(obj.amount_withdraw) + Number(total),
    0
  );
  sums.value.withdrawals *= -1;

  // Total Deposits
  sums.value.deposits = results.reduce(
    (total: number, obj) => Number(obj.amount_deposit) + Number(total),
    0
  );
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
