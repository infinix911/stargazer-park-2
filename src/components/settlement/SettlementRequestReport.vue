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
          {{ t("partner.requestSettlement") }}
        </button>

        <!-- Date Picker and Search -->
        <div class="flex flex-col lg:flex-row items-start lg:items-end gap-4">
          <div class="min-w-0 max-w-sm">
            <label class="block text-sm font-medium text-gray-400 mb-2">
              {{ t("partner.selectDateRange") }}
            </label>
            <DateRangePicker
              class="w-full"
              v-model="daterange"
              @changedate="setSelectedDate"
              initial="month"
              style="height: 40px"
            />
          </div>
          <button
            @click="getList"
            class="px-6 py-3 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl self-end"
          >
            <i class="fas fa-search mr-2"></i>
            {{ t("search") }}
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
    >
      <KTDatatable :tableHeader="tableHeaders" :tableData="tableData" :rowsPerPage="50" />
    </DataTableCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import moment from "moment";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/stores/auth";
import Swal from "sweetalert2";
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
const authStore = useAuthStore();

// Reactive data
const tableData = ref<Array<IData>>([]);
const daterange = ref<DateRange>({
  start: moment().startOf("month").format("YYYY-MM-DD"),
  end: moment().format("YYYY-MM-DD"),
});

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
  daterange.value = date;
  // getList();
};

const getList = async () => {
  try {
    const results = await ApiService.get(
      `/partner/settlements/request?game=${props.game}&start=${daterange.value.start}&end=${daterange.value.end}`
    ).then((res) => res.data);

    tableData.value.splice(0, tableData.value.length, ...results);
  } catch (error) {
    console.error("Error fetching settlement data:", error);
    tableData.value = [];
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

// Lifecycle
onMounted(() => {
  getList();
});
</script>
