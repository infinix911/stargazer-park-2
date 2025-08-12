<template>
  <div class="space-y-6 w-full">
    <!-- Date Range Picker and Search Section -->
    <div class="my-8 flex flex-col sm:flex-row lg:flex-row gap-3 items-stretch sm:items-end lg:items-end justify-end">
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
          {{ loading ? t('common.loading') : t('search') }}
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
      <KTDatatable :tableHeader="tableHeaders" :tableData="tableData" :rowsPerPage="50" :loading="loading" />
    </DataTableCard>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import moment from "moment";
import { useI18n } from "vue-i18n";
import ApiService from "@/services/ApiService";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import DateRangePicker from "@/components/kt-date/DateRangePicker.vue";
import DataTableCard from "@/components/ui/DataTableCard.vue";

interface IData {
  1: string;
  2: number;
  3: number;
  4: number;
  5: number;
  6: number;
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
const { t } = useI18n();

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

    tableData.value.splice(0, tableData.value.length, ...results);
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
getList();
</script>
