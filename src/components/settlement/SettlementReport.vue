<template>
  <div class="space-y-6 w-full">
    <!-- Date Range Picker and Search Section -->
    <div
      class="my-8 flex flex-col sm:flex-row lg:flex-row gap-3 items-stretch sm:items-end lg:items-end justify-end"
    >
      <!-- Search Fields Row -->
      <div class="flex flex-col sm:flex-row gap-3 flex-1 lg:flex-initial">
        <!-- Date Range Picker -->
        <div class="w-full sm:flex-1 sm:min-w-0 sm:max-w-[300px] lg:w-[300px]">
          <DateRangePicker
            class="w-full !h-[40px] date-picker-modern"
            v-model="daterange"
            initial="month"
          />
        </div>
      </div>

      <!-- Quick Date Buttons -->
      <div class="flex gap-2 items-end justify-center sm:justify-end lg:justify-end">
        <button
          type="button"
          class="h-[40px] flex-1 sm:w-16 sm:flex-initial rounded-lg text-xs font-medium text-white/80 bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-200 hover:scale-105"
          @click="
            setSelectedDate({
              start: moment().format('YYYY-MM-DD'),
              end: moment().format('YYYY-MM-DD'),
            })
          "
        >
          {{ t("dateRange.today") }}
        </button>
        <button
          type="button"
          class="h-[40px] flex-1 sm:w-16 sm:flex-initial rounded-lg text-xs font-medium text-white/80 bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-200 hover:scale-105"
          @click="
            setSelectedDate({
              start: moment().subtract(7, 'days').format('YYYY-MM-DD'),
              end: moment().format('YYYY-MM-DD'),
            })
          "
        >
          {{ t("dateRange.lastWeek") }}
        </button>
        <button
          type="button"
          class="h-[40px] flex-1 sm:w-16 sm:flex-initial rounded-lg text-xs font-medium text-white/80 bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-200 hover:scale-105"
          @click="
            setSelectedDate({
              start: moment().subtract(15, 'days').format('YYYY-MM-DD'),
              end: moment().format('YYYY-MM-DD'),
            })
          "
        >
          {{ t("dateRange.fifteenDays") }}
        </button>
        <button
          type="button"
          :disabled="loading"
          class="h-[40px] flex-1 sm:w-20 sm:flex-initial rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          @click="getList()"
        >
          <i v-if="loading" class="fas fa-spinner fa-spin mr-1"></i>
          <i v-else class="fas fa-search mr-1"></i>
          {{ loading ? t("common.loading") : t("search") }}
        </button>
      </div>
    </div>

    <!-- Settlement Data Table -->
    <DataTableCard
      :title="`${game} ${t('partnerMenu.settlementHistory')}`"
      :subtitle="`Details for settlement request`"
      :record-count="tableData.length"
      icon="fas fa-chart-line"
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
          <template v-slot:cell-status="{ row: agent }">
            <span class="badge badge-success" v-if="agent.status === 0">
              {{ t("Status.New") }}
            </span>
            <span class="badge badge-warning" v-else-if="agent.status === 1">
              {{ t("Status.Waiting") }}
            </span>
            <span class="badge badge-primary" v-else-if="agent.status === 2">
              {{ t("Status.Complete") }}
            </span>
            <span class="badge badge-danger" v-else>
              {{ t("Status.AdminCancel") }}
            </span>
          </template>
        </KTDatatable>
      </div>

      <!-- Mobile Cards -->
      <div class="lg:hidden space-y-4">
        <!-- Loading State -->
        <MobileLoadingSkeleton v-if="loading" :count="5" />

        <!-- Empty State -->
        <div v-else-if="!tableData.length" class="text-center py-12">
          <div
            class="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <i class="fas fa-chart-line text-white/40 text-2xl"></i>
          </div>
          <p class="text-white/60 text-sm">{{ t("common.noDataFound") }}</p>
        </div>

        <!-- Settlement Cards -->
        <div
          v-else
          v-for="settlement in tableData"
          :key="settlement.id"
          class="mt-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-200"
        >
          <!-- First Row: Date Range and Status -->
          <div
            class="flex items-center justify-between mb-4 pb-3 border-b border-white/10"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600/20 rounded-lg flex items-center justify-center"
              >
                <i class="fas fa-calendar text-blue-400 text-sm"></i>
              </div>
              <div>
                <h3 class="text-sm font-semibold text-white">
                  {{ moment(settlement.start_date).format("MM/DD/YYYY") }} -
                  {{ moment(settlement.end_date).format("MM/DD/YYYY") }}
                </h3>
                <div class="flex items-center gap-2 text-xs text-gray-400">
                  <span
                    >{{ t("partner.settleStart") }} - {{ t("partner.settleEnd") }}</span
                  >
                </div>
              </div>
            </div>

            <!-- Status Badge - Right Side -->
            <div class="flex-shrink-0">
              <span
                v-if="settlement.status === 0"
                class="inline-flex items-center px-2 py-1 text-xs font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-lg border border-blue-400/30"
              >
                <i class="fas fa-plus mr-1"></i>
                {{ t("Status.New") }}
              </span>
              <span
                v-else-if="settlement.status === 1"
                class="inline-flex items-center px-2 py-1 text-xs font-medium bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-full shadow-lg border border-yellow-400/30"
              >
                <i class="fas fa-clock mr-1"></i>
                {{ t("Status.Waiting") }}
              </span>
              <span
                v-else-if="settlement.status === 2"
                class="inline-flex items-center px-2 py-1 text-xs font-medium bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-lg border border-green-400/30"
              >
                <i class="fas fa-check mr-1"></i>
                {{ t("Status.Complete") }}
              </span>
              <span
                v-else
                class="inline-flex items-center px-2 py-1 text-xs font-medium bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-full shadow-lg border border-red-400/30"
              >
                <i class="fas fa-times mr-1"></i>
                {{ t("Status.AdminCancel") }}
              </span>
            </div>
          </div>

          <!-- Second Row: Request Date and Process Date -->
          <div class="grid grid-cols-2 gap-4 mb-4 pb-3 border-b border-white/10">
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-400">{{ t("partner.reqDate") }}</span>
                <span
                  class="inline-flex items-center px-2 py-1 text-xs font-medium text-white"
                >
                  {{ moment(settlement.createdAt).format("MM/DD/YYYY") }}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-400">{{ t("partner.processDate") }}</span>
                <span
                  class="inline-flex items-center px-2 py-1 text-xs font-medium text-white"
                >
                  {{ moment(settlement.updatedAt).format("MM/DD/YYYY") }}
                </span>
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-400">{{
                  t("partner.settlementAmount")
                }}</span>
                <span
                  class="inline-flex items-center px-2 py-1 text-xs font-medium text-white"
                >
                  {{ n(settlement.amount) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Third Row: Settlement Amount -->
          <div class="flex items-center justify-between pt-3">
            <div class="flex items-center gap-2">
              <span class="text-xs text-gray-400">{{
                t("partner.settlementAmount")
              }}</span>
              <span
                class="inline-flex items-center px-3 py-1 text-sm font-medium bg-blue-500/20 text-blue-300 rounded-lg border border-blue-500/30"
              >
                {{ n(settlement.amount) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </DataTableCard>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import moment from "moment";
import { useI18n } from "vue-i18n";
import ApiService from "@/services/ApiService";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import DateRangePicker from "@/components/kt-date/DateRangePicker.vue";
import DataTableCard from "@/components/ui/DataTableCard.vue";
import MobileLoadingSkeleton from "@/components/ui/MobileLoadingSkeleton.vue";

interface IData {
  id: string;
  start_date: string;
  end_date: string;
  createdAt: string;
  updatedAt: string;
  amount: number;
  status: number;
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

// Reactive data
const tableData = ref<Array<IData>>([]);
const daterange = ref<DateRange>({
  start: moment().startOf("month").format("YYYY-MM-DD"),
  end: moment().format("YYYY-MM-DD"),
});

// Loading state
const loading = ref(false);

// Table headers
const tableHeaders = [
  { key: "start_date", name: t("partner.settleStart"), text: true },
  {
    key: "end_date",
    name: t("partner.settleEnd"),
    text: true,
  },
  { key: "createdAt", name: t("partner.reqDate") },
  { key: "updatedAt", name: t("partner.processDate") },
  { key: "amount", name: t("partner.settlementAmount"), currency: true },
  {
    key: "status",
    name: t("partner.status"),
    customslot: true,
  },
];

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
    const results = await ApiService.get(
      `/partner/settlements/withdraw?game=${props.game}&start=${daterange.value.start}&end=${daterange.value.end}`
    ).then((res) => res.data);

    if (results && results.length > 0) {
      tableData.value.splice(0, tableData.value.length, ...results);
    }
  } catch (error) {
    console.error("Error fetching settlement data:", error);
    tableData.value = [];
  } finally {
    loading.value = false;
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
@import "@/assets/common-dashboard.css";
</style>
