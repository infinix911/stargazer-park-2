<template>
  <div class="space-y-6">
    <!-- Header Section with Date Picker and Actions -->
    <div class="">
      <div class="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-6 mt-10">
        <!-- Request Withdrawal Button -->
        <button
          @click="requestWithdrawal"
          class="px-6 py-3 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <i class="fas fa-paper-plane mr-2"></i>
          {{ t("partnerMenu.settlementRequest") }}
        </button>

        <!-- Date Picker and Search -->
        <div class="flex flex-col lg:flex-row items-start lg:items-end gap-4">
          <div class="min-w-0 max-w-sm">
            <DateRangePicker
              class="w-full"
              v-model="daterange"
              initial="month"
              style="height: 40px"
            />
          </div>
          
          <!-- Quick Date Buttons -->
          <div class="flex gap-2 lg:min-w-0 lg:flex-shrink-0 items-end justify-end">
            <button
              v-for="dateButton in dateButtons"
              :key="dateButton.key"
              @click="setSelectedDate(dateButton.range)"
              class="w-16 h-10 rounded-lg text-xs font-medium text-white/80 bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-200 hover:scale-105"
            >
              {{ t(dateButton.label) }}
            </button>
            <button
              @click="getList"
              :disabled="loading"
              class="px-6 py-3 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl self-end disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
              <i v-else class="fas fa-search mr-2"></i>
              {{ loading ? t('common.loading') : t('search') }}
            </button>
          </div>
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
      <KTDatatable :tableHeader="tableHeaders" :tableData="tableData" :rowsPerPage="50" :loading="loading" />
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
import qs from "qs";

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

    tableData.value.splice(0, tableData.value.length, ...results);
  } catch (error) {
    console.error("Error fetching settlement data:", error);
    tableData.value = [];
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
