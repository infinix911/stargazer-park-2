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
      <div class="flex items-end justify-end">
        <div class="flex flex-col lg:flex-row gap-4 items-stretch lg:items-end">
          <!-- Transaction Type -->
          <div class="flex-shrink-0">
            <select
              v-model="tranType"
              class="w-32 bg-white/10 border border-white/20 rounded-lg text-white text-sm px-3 focus:border-blue-500 focus:outline-none"
              style="height: 40px"
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
          <div class="flex-shrink-0">
            <input
              v-model="receiver"
              type="text"
              class="w-48 bg-white/10 border border-white/20 rounded-lg text-white text-sm px-3 focus:border-blue-500 focus:outline-none placeholder-gray-400"
              style="height: 40px"
            />
          </div>

          <!-- Date Range Picker -->
          <div class="flex-1 min-w-0 max-w-[300px]">
            <DateRangePicker
              class="w-full date-picker-modern"
              v-model="dateRange"
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
              class="w-20 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              style="height: 40px"
            >
              <i v-if="loading" class="fas fa-spinner fa-spin mr-1"></i>
              <i v-else class="fas fa-search mr-1"></i>
              {{ loading ? t('common.loading') : 'Search' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Table Section -->
    <div class="max-w-[1500px] mx-auto px-2 pb-6">
      <DataTableCard
        :record-count="tableData.length"
        :loading="loading"
      >
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
                <i class="fas fa-plus mr-1"></i>
                {{ t("partner.add") }}
              </span>
              <span
                v-else
                class="inline-flex items-center px-3 py-1 text-xs font-medium bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-full shadow-lg border border-red-400/30"
              >
                <i class="fas fa-minus mr-1"></i>
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
      </DataTableCard>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import moment from "moment";
import qs from "qs";
import ApiService from "@/services/ApiService";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import DateRangePicker from "@/components/kt-date/DateRangePicker.vue";
import DataTableCard from "@/components/ui/DataTableCard.vue";
import { useAuthStore } from "@/stores/auth";

export interface IData {
  member_id: string;
  member: string;
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

export default defineComponent({
  name: "ShopTransactions",
  components: {
    KTDatatable,
    DateRangePicker,
    DataTableCard,
  },
  props: {
    member_id: {
      type: String,
      required: false,
    },
  },
  setup(props) {
    const { t, n } = useI18n();
    const authStore = useAuthStore();
    const user = computed(() => authStore.user);

    const tableData = ref<IData[]>([]);
    const tableHeaderShop = ref([
      { key: "receiver", name: t("partner.storeMember"), text: true },
      { key: "type", name: t("partner.tranType"), customslot: true },
      { key: "amount", name: t("partner.tranAmount"), customslot: true },
      { key: "updatedAt", name: t("partner.date"), text: true },
    ]);

    const tranType = ref("ALL");
    const tranTypes = [
      { label: t("partner.all"), value: "ALL" },
      { label: t("partner.add"), value: "ADD" },
      { label: t("partner.deduct"), value: "DEDUCT" },
    ];

    const receiver = ref("");

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

    // Loading state
    const loading = ref(false);

    const setSelectedDate = (date: DateRange) => {
      if (dateRange.value.start !== date.start || dateRange.value.end !== date.end) {
        dateRange.value.start = date.start;
        dateRange.value.end = date.end;
      }
    };

    const getList = async () => {
      try {
        loading.value = true;
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

        const results = await ApiService.get(apipath)
          .then((res) => res.data)
          .catch(() => []);

        tableData.value.splice(0, tableData.value.length, ...results);
      } catch (error) {
        console.error("Failed to fetch shop transactions:", error);
      } finally {
        loading.value = false;
      }
    };

    // Auto-refresh list when dateRange changes
    watch(
      dateRange,
      (newVal, oldVal) => {
        if (newVal.start !== oldVal.start || newVal.end !== oldVal.end) {
          getList();
        }
      },
      { deep: true }
    );

    onMounted(() => {
      if (user.value.shoplevel === 2 && tableHeaderShop.value.length > 0) {
        tableHeaderShop.value[0]!.key = "sender";
        tableHeaderShop.value[0]!.name = t("partner.sender");
        getList();
      }
    });

    return {
      t,
      n,
      tableHeaderShop,
      tableData,
      tranType,
      tranTypes,
      receiver,
      dateRange,
      dateButtons,
      setSelectedDate,
      getList,
      authStore,
      loading,
    };
  },
});
</script>

<style scoped>
@import "@/assets/common-dashboard.css";
</style>
