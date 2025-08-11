<template>
  <!-- Page Header -->
  <PartnerPageHeader 
    :title="t('partnerMenu.dashboard')"
    subtitle="Transactions Overview and Game Summary"
    icon="fas fa-users"
    icon-color="green-blue"
  />

  <!-- Controls Section -->
  <div class="max-w-[1500px] mx-auto px-4 py-6">
    <div class="flex flex-col lg:flex-row gap-4 items-stretch lg:items-end justify-end mt-5">
      <!-- Date Range Picker -->
      <div class="flex-1 min-w-0 max-w-[300px]">
        <label class="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
          Date Range
        </label>
        <DateRangePicker
          class="w-full h-10 date-picker-modern"
          v-model="dateRange"
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

  <!-- Content Area -->
  <div class="max-w-[1500px] mx-auto px-2 pb-6 space-y-6">
    <!-- Transaction Table -->
    <DataTableCard
      :title="t('partner.totalDepWid')"
      subtitle="Transaction Overview"
      :record-count="tableData.length"
      icon="fas fa-exchange-alt"
      icon-color="#3b82f6"
    >
      <KTDatatable :tableHeader="tableHeaders" :tableData="tableData" :rowsPerPage="50" />
    </DataTableCard>

    <!-- Game Summary Table -->
    <DataTableCard
      :title="t('partner.gameBetTotal')"
      subtitle="Game Statistics"
      :record-count="gameTableData.length"
      icon="fas fa-gamepad"
      icon-color="#10b981"
    >
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
    </DataTableCard>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, ref, watch } from "vue";
import moment from "moment";
import { useI18n } from "vue-i18n";
import ApiService from "@/services/ApiService";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import DateRangePicker from "@/components/kt-date/DateRangePicker.vue";
import DataTableCard from "@/components/ui/DataTableCard.vue";

export interface IData {
  deposit: number;
  bonus: number;
  withdrawal: number;
  depwid: number;
  wallet: number;
  wallet_point: number;
  wallet_rolling: number;
}

export interface ISummaryTable {
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

export interface DateRange {
  start: string;
  end: string;
}

export default defineComponent({
  name: "PartnerDashboard",
  components: {
    KTDatatable,
    DateRangePicker,
    DataTableCard,
  },
  props: {
    memberId: {
      type: String,
      default: null
    }
  },
  setup(props) {
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

    // Date Range - reactive ref for v-model
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
    // setSelectedDate is now only used by dateButtons
    const setSelectedDate = (date: DateRange) => {
      if (dateRange.value.start !== date.start || dateRange.value.end !== date.end) {
        dateRange.value.start = date.start;
        dateRange.value.end = date.end;
      }
    };

    const getList = async () => {
      alert('sdf')
      try {
        // Build query parameters
        const queryParams = `start=${dateRange.value.start}&end=${dateRange.value.end}`;
        const memberParam = props.memberId ? `&member_id=${props.memberId}` : '';
        
        // Fetch transaction data
        const results = await ApiService.get(
          `/partner/dashboard?${queryParams}${memberParam}`
        ).then((res) => res.data);
        
        // Clear and update table data without triggering watchers
        tableData.value.length = 0;
        tableData.value.push(...results);

        // Fetch game summary data
        const gameResults = await ApiService.get(
          `/partner/dashboard/summary?${queryParams}${memberParam}`
        ).then((res) => res.data);
        
        // Clear and update game table data without triggering watchers
        gameTableData.value.length = 0;
        gameTableData.value.push(...gameResults);
      } catch (error) {
        console.error("Dashboard API error:", error);
      }
    };

    const formatDateRange = computed(() => {
      if (dateRange.value.start && dateRange.value.end) {
        const start = moment(dateRange.value.start).format("MMM DD");
        const end = moment(dateRange.value.end).format("MMM DD");
        return start === end ? start : `${start} - ${end}`;
      }
      return "Month";
    });

    // Watch for memberId changes only when it's provided as a prop
    if (props.memberId) {
      watch(() => props.memberId, (newMemberId, oldMemberId) => {
        if (newMemberId && newMemberId !== oldMemberId) {
          getList();
        }
      }, { immediate: false });
    }

    // Add watcher for dateRange to trigger getList
    watch(dateRange, (newVal, oldVal) => {
      if (newVal.start !== oldVal.start || newVal.end !== oldVal.end) {
        getList();
      }
    }, { deep: true });

    onMounted(() => {
      getList();
    });

    return {
      t,
      tableHeaders,
      tableData,
      gameTableHeaders,
      gameTableData,
      dateRange,
      dateButtons,
      setSelectedDate,
      getList,
      formatDateRange,
    };
  },
});
</script>
