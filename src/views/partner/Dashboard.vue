<template>
  <!-- Page Header -->
  <PartnerPageHeader 
    :title="t('PartnerMenu.dashboard')"
    subtitle="Transactions Overview and Game Summary"
    icon="fas fa-users"
    icon-color="green-blue"
  />

  <div class="max-w-[1500px] mx-auto">
    <!-- Controls Section -->
    <div class="w-full mx-auto px-4 py-6">
      <div class="flex items-end justify-end mt-5">
        <div class="flex flex-col lg:flex-row gap-4 items-stretch lg:items-end">
          <!-- Date Range Picker -->
          <div class="flex-1 min-w-0 max-w-[300px]">
            <label class="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
              Date Range
            </label>
            <DateRangePicker
              class="w-full h-10 date-picker-modern"
              @changedate="setSelectedDate"
              initial="month"
            />
          </div>

          <!-- Quick Action Buttons -->
          <div class="flex gap-2 lg:min-w-0 lg:flex-shrink-0 items-end justify-end">
            <button
              v-for="dateButton in dateButtons"
              :key="dateButton.key"
              @click="setSelectedDate(dateButton.range)"
              class="w-16 py-2 rounded-lg text-xs font-medium text-white/80 bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-200 hover:scale-105"
            >
              {{ t(dateButton.label) }}
            </button>
            <button
              @click="getList"
              class="w-20 py-2 rounded-lg text-xs font-semibold text-black bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <i class="fas fa-search mr-1"></i>
              Search
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Area -->
    <div class="relative z-10 pb-6">
      <div class="w-full mx-auto px-2 space-y-6">
        <!-- Transaction Table -->
        <div class="w-full bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden">
          <div class="px-6 py-4 border-b border-white/10 bg-gradient-to-r from-white/5 to-white/10">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-blue-500/20 rounded-lg">
                  <i class="fas fa-exchange-alt text-blue-400 text-sm"></i>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-white">{{ t("partner.totalDepWid") }}</h2>
                  <p class="text-xs text-gray-400">Transaction Overview</p>
                </div>
              </div>
              <div class="text-xs text-gray-400">
                <i class="fas fa-table mr-1"></i>
                {{ tableData.length }} records
              </div>
            </div>
          </div>
          <div class="w-full px-10 pb-5">
            <KTDatatable :tableHeader="tableHeaders" :tableData="tableData" :rowsPerPage="50" />
          </div>
        </div>

        <!-- Game Summary Table -->
        <div class="w-full bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden">
          <div class="px-6 py-4 border-b border-white/10 bg-gradient-to-r from-white/5 to-white/10">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-green-500/20 rounded-lg">
                  <i class="fas fa-gamepad text-green-400 text-sm"></i>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-white">{{ t("partner.gameBetTotal") }}</h2>
                  <p class="text-xs text-gray-400">Game Statistics</p>
                </div>
              </div>
              <div class="text-xs text-gray-400">
                <i class="fas fa-table mr-1"></i>
                {{ gameTableData.length }} records
              </div>
            </div>
          </div>
          <div class="w-full px-10 pb-5">
            <KTDatatable
              :tableHeader="gameTableHeaders"
              :tableData="gameTableData"
              :rowsPerPage="50"
              :isAccordion="true"
            >
              <!-- Dynamic Sub Tables -->
              <template v-for="(gameType, index) in gameTableData" :key="index" #[`table-sub${index}`]>
                <KTDatatable
                  :tableHeader="gameTableHeaders"
                  :tableData="gameType?.games || []"
                  :rowsPerPage="50"
                >
                  <template #cell-game="{ row: data }">
                    <span>{{ t(data.game) }}</span>
                  </template>
                </KTDatatable>
              </template>
              <!-- Main Game Type Cell -->
              <template #cell-game="{ row: data }">
                <span>{{ t(data.game_type) }}</span>
              </template>
            </KTDatatable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, ref } from "vue";
import moment from "moment";
import { useI18n } from "vue-i18n";
import ApiService from "@/services/ApiService";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import DateRangePicker from "@/components/kt-date/DateRangePicker.vue";

interface IData {
  deposit: number;
  bonus: number;
  withdrawal: number;
  depwid: number;
  wallet: number;
  wallet_point: number;
  wallet_rolling: number;
}

interface ISummaryTable {
  game_type: string;
  betamt: string;
  winamt: string;
  profit: string;
  total_profit: string;
  rollamt: string;
  rollamtsub: string;
  loseamt: string;
  loseamtsub: string;
  games: Array<any>;
}

interface DateRange {
  start: string;
  end: string;
}

export default defineComponent({
  name: "PartnerDashboard",
  components: {
    KTDatatable,
    DateRangePicker,
  },
  setup() {
    const { t } = useI18n();
    
    // Data
    const tableData = ref<Array<IData>>([]);
    const gameTableData = ref<Array<ISummaryTable>>([]);
    
    // Table Headers
    const tableHeaders = [
      { key: "deposits", name: t("partner.deposit"), currency: true },
      { key: "withdrawals", name: t("partner.withdrawal"), currency: true },
      { key: "depwid", name: t("partner.depWid"), currency: true },
      { key: "wallet", name: t("partner.wallet"), currency: true },
      { key: "wallet_point", name: t("partner.walletPoint"), currency: true },
    ];
    
    const gameTableHeaders = [
      { key: "game", name: t("partner.game"), customslot: true },
      { key: "betamt", name: t("partner.totalBetAmount"), currency: true },
      { key: "winamt", name: t("partner.totalWinAmount"), currency: true },
      { key: "rollamtsub", name: t("partner.subRolling"), currency: true },
      { key: "rollamt", name: t("partner.rollAmount"), currency: true },
      { key: "total_profit", name: t("partner.totalProfit"), currency: true },
    ];

    // Date Range
    let range = {
      start: moment().startOf("month").format("YYYY-MM-DD"),
      end: moment().format("YYYY-MM-DD"),
    };

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
      range = date;
      getList();
    };

    const getList = async () => {
      try {
        // Fetch transaction data
        const results = await ApiService.get(
          `/partner/dashboard?start=${range.start}&end=${range.end}`
        ).then((res) => res.data);
        tableData.value.splice(0, tableData.value.length, ...results);

        // Fetch game summary data
        const gameResults = await ApiService.get(
          `/partner/dashboard/summary?start=${range.start}&end=${range.end}`
        ).then((res) => res.data);
        gameTableData.value.splice(0, gameTableData.value.length, ...gameResults);
      } catch (error) {
        console.error("Dashboard API error:", error);
      }
    };

    const formatDateRange = computed(() => {
      if (range.start && range.end) {
        const start = moment(range.start).format("MMM DD");
        const end = moment(range.end).format("MMM DD");
        return start === end ? start : `${start} - ${end}`;
      }
      return "Month";
    });

    onMounted(() => {
      getList();
    });

    return {
      t,
      tableHeaders,
      tableData,
      gameTableHeaders,
      gameTableData,
      dateButtons,
      setSelectedDate,
      getList,
      formatDateRange,
    };
  },
});
</script>
