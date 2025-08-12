<template>
  <div>
    <!-- Controls Section -->
    <div class="w-full px-4 py-6">
      <div class="flex flex-col sm:flex-row lg:flex-row gap-3 items-stretch sm:items-end lg:items-end justify-end">
        <!-- Search Fields Row -->
        <div class="flex flex-col sm:flex-row gap-3 flex-1 lg:flex-initial">
          <!-- Search Type -->
          <div v-if="memberId === undefined" class="w-full sm:w-32 lg:w-32">
            <select 
              v-model="searchType" 
              class="w-full bg-white/10 border border-white/20 rounded-lg text-white text-sm px-3 focus:border-blue-500 focus:outline-none h-[40px]"
            >
              <option v-for="option in searchTypes" :key="option.value" :value="option.value" class="bg-gray-800 text-white">
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- Search Value -->
          <div v-if="memberId === undefined" class="w-full sm:w-48 lg:w-48">
            <input 
              v-model="searchValue" 
              type="text"
              class="w-full bg-white/10 border border-white/20 rounded-lg text-white text-sm px-3 focus:border-blue-500 focus:outline-none placeholder-gray-400 h-[40px]"
            />
          </div>

          <!-- Date Range Picker -->
          <div class="w-full sm:flex-1 sm:min-w-0 sm:max-w-[300px] lg:w-[300px]">
            <DateRangePicker
              class="w-full !h-[40px] date-picker-modern"
              v-model="daterange"
              initial="week"
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
            @click="getHistory"
            :disabled="loading"
            class="h-[40px] flex-1 sm:w-20 sm:flex-initial rounded-lg text-xs font-semibold text-black bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin mr-1"></i>
            <i v-else class="fas fa-search mr-1"></i>
            {{ loading ? t('common.loading') : t('search') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="w-full px-4 pb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Roll Amount -->
        <div class="bg-gradient-to-r from-red-500/20 to-rose-600/20 backdrop-blur-sm border border-red-500/30 rounded-xl p-6">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-red-500/30 rounded-lg">
              <i class="fas fa-chart-line text-red-300 text-xl"></i>
            </div>
            <div>
              <h3 class="text-2xl font-bold text-white">{{ n(Number(historySums.rollamt)) }}</h3>
              <p class="text-sm text-gray-300">
                {{ game === 'CASINO' ? t('partner.noTieBetAmount') : t('partner.rollAmount') }}
              </p>
            </div>
          </div>
        </div>

        <!-- Win Amount -->
        <div class="bg-gradient-to-r from-green-500/20 to-emerald-600/20 backdrop-blur-sm border border-green-500/30 rounded-xl p-6">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-green-500/30 rounded-lg">
              <i class="fas fa-trophy text-green-300 text-xl"></i>
            </div>
            <div>
              <h3 class="text-2xl font-bold text-white">{{ n(Number(historySums.winamt)) }}</h3>
              <p class="text-sm text-gray-300">{{ t('partner.winningAmount') }}</p>
            </div>
          </div>
        </div>

        <!-- Tie Amount (Casino only) -->
        <div v-if="game === 'CASINO'" class="bg-gradient-to-r from-blue-500/20 to-indigo-600/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-blue-500/30 rounded-lg">
              <i class="fas fa-handshake text-blue-300 text-xl"></i>
            </div>
            <div>
              <h3 class="text-2xl font-bold text-white">{{ n(Number(historySums.tieamt)) }}</h3>
              <p class="text-sm text-gray-300">{{ t('partner.tieBetAmount') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Table Section -->
    <div class="w-full px-4 pb-6">
      <DataTableCard
        :title="`${gameDisplayName} ${t('partnerMenu.betHistory')}`"
        subtitle="Detailed betting records and results"
        :record-count="tableData.length"
        icon="fas fa-dice"
        icon-color="#ef4444"
        :loading="loading"
      >
          <KTDatatable 
            :tableHeader="tableHeaders" 
            :tableData="tableData" 
            :rowsPerPage="50"
            :total="rowsCount"
            :loading="loading"
            @items-per-page-change="setPageLimit"
            @current-change="setPage"
          >
            <!-- Game -->
            <template v-slot:cell-game="{ row: data }">
              <div class="text-center">
                <span class="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-300 rounded-lg border border-blue-500/30">
                  <i class="fas fa-gamepad mr-1"></i>
                  {{ t(data.game) }} - 
                  <span v-if="data.game === 'K_EVO'">{{ t('Evolution.' + data.roomno) }}</span>
                  <span v-else>{{ data.roomno }}</span>
                </span>
              </div>
            </template>

            <!-- Status -->
            <template v-slot:cell-status="{ row: data }">
              <div class="text-center">
                <span v-if="data.state === 0" class="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-500/20 text-yellow-300 rounded-full border border-yellow-500/30">
                  <i class="fas fa-clock mr-1"></i>
                  {{ t("status.0") }}
                </span>
                <span v-else-if="data.state === 1 && data.winamount > 0" class="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-500/20 text-green-300 rounded-full border border-green-500/30">
                  <i class="fas fa-check mr-1"></i>
                  {{ t("status.win") }}
                </span>
                <span v-else-if="data.state === 1 && data.winamount <= 0" class="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-500/20 text-red-300 rounded-full border border-red-500/30">
                  <i class="fas fa-times mr-1"></i>
                  {{ t("status.lose") }}
                </span>
                <span v-else class="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-500/20 text-gray-300 rounded-full border border-gray-500/30">
                  <i class="fas fa-question mr-1"></i>
                  {{ t("status.2") }}
                </span>
              </div>
            </template>

            <!-- Profit -->
            <template v-slot:cell-profit="{ row: data }">
              <div class="text-center">
                <span v-if="data.state === 0" class="text-gray-400">-</span>
                <span v-else :class="[
                  'inline-flex items-center px-2 py-1 text-xs font-medium rounded-lg border',
                  data.profit > 0 
                    ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                    : 'bg-red-500/20 text-red-300 border-red-500/30'
                ]">
                  <i :class="[
                    'mr-1',
                    data.profit > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'
                  ]"></i>
                  {{ n(Number(data.profit)) }}
                </span>
              </div>
            </template>

            <!-- After Account -->
            <template v-slot:cell-after_acc="{ row: data }">
              <div class="text-center">
                <span v-if="data.state === 0" class="text-gray-400">-</span>
                <span v-else class="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-300 rounded-lg border border-blue-500/30">
                  <i class="fas fa-wallet mr-1"></i>
                  {{ n(Number(data.after_acc)) }}
                </span>
              </div>
            </template>
        </KTDatatable>
      </DataTableCard>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from "vue";
import moment from "moment";
import { useI18n } from "vue-i18n";
import qs from "qs";
import ApiService from "@/services/ApiService";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import DateRangePicker from "@/components/kt-date/DateRangePicker.vue";
import DataTableCard from "@/components/ui/DataTableCard.vue";

export interface IData {
  betamount: number;
  createdAt: string;
  game: string;
  game_type: string;
  member: string;
  member_id: string;
  nickname: string;
  profit: number;
  roomno: string;
  roomorder: string;
  state: number;
  updatedAt: string;
  winamount: string;
}

export interface DateRange {
  start: string;
  end: string;
}

export default defineComponent({
  name: "GameBetHistory",
  components: {
    KTDatatable,
    DateRangePicker,
    DataTableCard,
  },
  props: {
    game: {
      type: String,
      required: true,
    },
    memberId: {
      type: String,
      required: false,
    },
  },
  setup(props) {
    const { t, n } = useI18n();
    
    const tableData = ref<IData[]>([]);
    const tableHeaders = [
      { key: "member", name: t("partner.member"), text: true },
      { key: "game", name: t("partner.game"), customslot: true },
      { key: "roomorder", name: t("partner.round"), text: true },
      { key: "status", name: t("partner.status"), customslot: true },
      { key: "betamount", name: t("partner.betamount"), currency: true },
      { key: "winamount", name: t("partner.winamount"), currency: true },
      { key: "profit", name: t("partner.betProfit"), customslot: true },
      { key: "pre_acc", name: t("pointWithdrawal.current"), currency: true },
      { key: "after_acc", name: t("partner.amountAfter"), customslot: true },
      { key: "createdAt", name: t("partner.betDate"), text: true },
      { key: "updatedAt", name: t("partner.resultDate"), text: true },
    ];

    const searchType = ref("ID");
    const searchValue = ref("");
    const searchTypes = [
      { label: t("login.id"), value: "ID" },
      { label: t("partner.nickname"), value: "NICKNAME" },
    ];

    const historySums = ref({
      rollamt: 0,
      tieamt: 0,
      winamt: 0,
    });

    const dateButtons = [
      {
        key: "today",
        label: "dateRange.today",
        range: {
          start: moment().format('YYYY-MM-DD'),
          end: moment().format('YYYY-MM-DD'),
        }
      },
      {
        key: "week",
        label: "dateRange.lastWeek",
        range: {
          start: moment().subtract(7, 'days').format('YYYY-MM-DD'),
          end: moment().format('YYYY-MM-DD'),
        }
      },
      {
        key: "fifteen",
        label: "dateRange.fifteenDays",
        range: {
          start: moment().subtract(15, 'days').format('YYYY-MM-DD'),
          end: moment().format('YYYY-MM-DD'),
        }
      }
    ];

    const gameDisplayName = computed(() => {
      const gameNames = {
        'CASINO': t('partner.casino'),
        'HOTEL': t('partner.hotel'),
        'SLOT': t('partner.slot'),
        'SPORT': t('partner.sport'),
      };
      return gameNames[props.game as keyof typeof gameNames] || props.game;
    });

    // Date range (reactive, two-way bind with DateRangePicker)
    const daterange = ref({
      start: moment().startOf("month").format("YYYY-MM-DD"),
      end: moment().format("YYYY-MM-DD"),
    });

    // Loading state
    const loading = ref(false);

    // Pagination
    const rowsCount = ref(0);
    let pageLimit = 50;
    let pageNumber = 1;

    const setPageLimit = (limit: number) => {
      pageLimit = limit;
      getHistory();
    };

    const setPage = (page: number) => {
      pageNumber = page;
      getHistory();
    };

    // Date range
    const setSelectedDate = (date: DateRange) => {
      if (daterange.value.start !== date.start || daterange.value.end !== date.end) {
        daterange.value.start = date.start;
        daterange.value.end = date.end;
      }
    };

    const getHistory = async () => {
      try {
        loading.value = true;
        let query = qs.stringify({
          game: props.game,
          start: daterange.value.start,
          end: daterange.value.end,
          type: searchType.value,
          typeval: searchValue.value,
          limit: pageLimit,
          page: pageNumber,
        });

        if (props.memberId) {
          query = qs.stringify({
            game: props.game,
            start: daterange.value.start,
            end: daterange.value.end,
            type: searchType.value,
            typeval: searchValue.value,
            member_id: props.memberId,
            limit: pageLimit,
            page: pageNumber,
          });
        }

        const results = await ApiService.get(`/partner/bet-history?${query}`)
          .then((res) => res.data)
          .catch(() => ({ rows: 0, sums: { rollamt: 0, tieamt: 0, winamt: 0 }, data: [] }));

        rowsCount.value = Number(results.rows);
        historySums.value = results.sums;
        tableData.value.splice(0, tableData.value.length, ...results.data);
      } catch (error) {
        console.error('Failed to fetch bet history:', error);
      } finally {
        loading.value = false;
      }
    };

    // Auto-refresh list when daterange changes
    watch(
      daterange,
      (newVal, oldVal) => {
        if (newVal.start !== oldVal.start || newVal.end !== oldVal.end) {
          getHistory();
        }
      },
      { deep: true }
    );

    return {
      t,
      n,
      tableHeaders,
      tableData,
      searchType,
      searchTypes,
      searchValue,
      historySums,
      dateButtons,
      gameDisplayName,
      daterange,
      setPageLimit,
      setPage,
      rowsCount,
      setSelectedDate,
      getHistory,
      loading,
    };
  },
});
</script>

<style scoped>
@import '@/assets/common-dashboard.css';
</style>