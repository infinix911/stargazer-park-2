<template>
  <div class="space-y-6 w-full">
    <!-- Date Range Picker and Search Section -->
    <div class="flex flex-col lg:flex-row lg:items-end justify-end gap-4 w-full">
      <!-- Date Range Picker -->
      <div class="min-w-0 max-w-sm">
        <DateRangePicker
          class="w-full"
          v-model="daterange"
          initial="month"
          style="height: 40px"
        />
      </div>

      <!-- Quick Date Buttons -->
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-200"
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
          class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-200"
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
          class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-200"
          @click="
            setSelectedDate({
              start: moment().subtract(15, 'days').format('YYYY-MM-DD'),
              end: moment().format('YYYY-MM-DD'),
            })
          "
        >
          {{ t("dateRange.fifteenDays") }}
        </button>
      </div>

      <!-- Search Button -->
      <button
        type="button"
        :disabled="loading"
        class="px-6 py-3 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
        @click="getList()"
      >
        <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
        <i v-else class="fas fa-search mr-2"></i>
        {{ loading ? t('common.loading') : t('search') }}
      </button>
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
