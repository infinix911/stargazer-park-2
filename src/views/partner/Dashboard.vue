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
      <div class="w-full lg:flex-1 lg:min-w-0 lg:max-w-[300px]">
        <DateRangePicker
          class="w-full !h-[40px] date-picker-modern"
          v-model="dateRange"
          initial="month"
        />
      </div>

      <!-- Quick Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-2 lg:min-w-0 lg:flex-shrink-0 items-stretch sm:items-end justify-center lg:justify-end">
        <!-- Date buttons row for mobile, inline for larger screens -->
        <div class="flex gap-2 flex-1 sm:flex-initial">
          <button
            v-for="dateButton in dateButtons"
            :key="dateButton.key"
            @click="setSelectedDate(dateButton.range)"
            class="h-[40px] flex-1 sm:w-16 sm:flex-initial py-2 rounded-lg text-xs font-medium text-white/80 bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-200 hover:scale-105"
          >
            {{ t(dateButton.label) }}
          </button>
        </div>
        <!-- Search button -->
        <button
          @click="getList"
          :disabled="loading"
          class="h-[40px] w-full sm:w-20 py-2 rounded-lg text-xs font-semibold text-black bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i v-if="loading" class="fas fa-spinner fa-spin mr-1"></i>
          <i v-else class="fas fa-search mr-1"></i>
          {{ loading ? t('common.loading') : t('search') }}
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
      :loading="loading"
    >
      <!-- Desktop Table -->
      <div class="hidden lg:block">
        <KTDatatable :tableHeader="tableHeaders" :tableData="tableData" :rowsPerPage="50" :loading="loading" />
      </div>

      <!-- Mobile Cards -->
      <div class="lg:hidden space-y-4">
        <!-- Loading State -->
        <div v-if="loading" class="space-y-4">
          <div v-for="i in 3" :key="i" class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 animate-pulse">
            <div class="flex items-center justify-between mb-3">
              <div class="w-24 h-4 bg-white/10 rounded"></div>
              <div class="w-16 h-4 bg-white/10 rounded"></div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <div class="w-16 h-3 bg-white/10 rounded"></div>
                <div class="w-20 h-4 bg-white/10 rounded"></div>
              </div>
              <div class="space-y-2">
                <div class="w-16 h-3 bg-white/10 rounded"></div>
                <div class="w-20 h-4 bg-white/10 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="tableData.length === 0" class="text-center py-12">
          <div class="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-exchange-alt text-white/40 text-2xl"></i>
          </div>
          <p class="text-white/60 text-sm">{{ t('common.noDataFound') }}</p>
        </div>

        <!-- Transaction Cards -->
        <div v-else v-for="transaction in tableData" :key="transaction.deposits" class="mt-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-200">
          <!-- First Row: Title and Date -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <i class="fas fa-exchange-alt text-white text-sm"></i>
              </div>
              <div>
                <h3 class="text-sm font-semibold text-white">{{ t('partner.transaction') }}</h3>
              </div>
            </div>
          </div>

          <!-- Second Row: Main Values -->
          <div class="grid grid-cols-2 gap-4 mb-4">
            <!-- Deposits & Withdrawals -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-400">{{ t('partner.deposit') }}</span>
                <span class="text-sm font-bold text-green-400">{{ transaction.deposits?.toLocaleString() || '0' }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-400">{{ t('partner.withdrawal') }}</span>
                <span class="text-sm font-bold text-red-400">{{ transaction.withdrawals?.toLocaleString() || '0' }}</span>
              </div>
            </div>
            
            <!-- Net & Wallet -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-400">{{ t('partner.depWid') }}</span>
                <span class="text-sm font-bold text-blue-300">{{ transaction.depwid?.toLocaleString() || '0' }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-400">{{ t('partner.wallet') }}</span>
                <span class="text-sm font-bold text-white">{{ transaction.wallet?.toLocaleString() || '0' }}</span>
              </div>
            </div>
          </div>

          <!-- Third Row: Additional Info -->
          <div class="pt-3 border-t border-white/10">
            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-400">{{ t('partner.walletPoint') }}</span>
              <span class="text-sm font-medium text-yellow-300">{{ transaction.wallet_point?.toLocaleString() || '0' }}</span>
            </div>
          </div>
        </div>
      </div>
    </DataTableCard>

    <!-- Game Summary Table -->
    <DataTableCard
      :title="t('partner.gameBetTotal')"
      subtitle="Game Statistics"
      :record-count="gameTableData.length"
      icon="fas fa-gamepad"
      icon-color="#10b981"
      :loading="loading"
    >
      <!-- Desktop Table -->
      <div class="hidden lg:block">
        <KTDatatable
          :tableHeader="gameTableHeaders"
          :tableData="gameTableData"
          :rowsPerPage="50"
          :isAccordion="true"
          :loading="loading"
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
            <span>{{ t('common.' + data.game_type) }}</span>
          </template>
        </KTDatatable>
      </div>

      <!-- Mobile Cards -->
      <div class="lg:hidden space-y-4">
        <!-- Loading State -->
        <div v-if="loading" class="space-y-4">
          <div v-for="i in 3" :key="i" class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 animate-pulse">
            <div class="flex items-center justify-between mb-3">
              <div class="w-24 h-4 bg-white/10 rounded"></div>
              <div class="w-16 h-4 bg-white/10 rounded"></div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <div class="w-16 h-3 bg-white/10 rounded"></div>
                <div class="w-20 h-4 bg-white/10 rounded"></div>
              </div>
              <div class="space-y-2">
                <div class="w-16 h-3 bg-white/10 rounded"></div>
                <div class="w-20 h-4 bg-white/10 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="gameTableData.length === 0" class="text-center py-12">
          <div class="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-gamepad text-white/40 text-2xl"></i>
          </div>
          <p class="text-white/60 text-sm">{{ t('common.noDataFound') }}</p>
        </div>

        <!-- Game Summary Cards -->
        <div v-else v-for="game in gameTableData" :key="game.game_type" class="mt-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-200">
          <!-- First Row: Game Type and Expand Button -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <i class="fas fa-gamepad text-white text-sm"></i>
              </div>
              <div>
                <h3 class="text-sm font-semibold text-white">{{ t('common.' + game.game_type) }}</h3>
                <p class="text-xs text-gray-400">{{ t('partner.gameType') }}</p>
              </div>
            </div>
            
            <!-- Expand Button -->
            <button
              @click="toggleGameExpand(game.game_type)"
              class="!w-[100px] flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 text-gray-300 hover:text-white"
            >
              <span class="text-xs">{{ expandedGames.includes(game.game_type) ? t('common.showLess') : t('common.showMore') }}</span>
              <i
                class="fas fa-chevron-down transition-transform text-xs"
                :class="{
                  'rotate-180': expandedGames.includes(game.game_type),
                }"
              ></i>
            </button>
          </div>

          <!-- Second Row: Main Statistics -->
          <div class="grid grid-cols-2 gap-4 mb-4">
            <!-- Bet & Win Amounts -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-400">{{ t('partner.totalBetAmount') }}</span>
                <span class="text-sm font-bold text-blue-400">{{ Number(game.betamt) || 0 }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-400">{{ t('partner.totalWinAmount') }}</span>
                <span class="text-sm font-bold text-green-400">{{ Number(game.winamt) || 0 }}</span>
              </div>
            </div>
            
            <!-- Rolling & Profit -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-400">{{ t('partner.rollAmount') }}</span>
                <span class="text-sm font-bold text-yellow-300">{{ Number(game.rollamt) || 0 }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-400">{{ t('partner.totalProfit') }}</span>
                                  <span class="text-sm font-bold" :class="Number(game.total_profit) >= 0 ? 'text-green-400' : 'text-red-400'">
                    {{ Number(game.total_profit) >= 0 ? '+' : '' }}{{ Number(game.total_profit) || 0 }}
                  </span>
              </div>
            </div>
          </div>

          <!-- Expandable Details: Sub Games -->
          <div
            v-if="expandedGames.includes(game.game_type)"
            class="mt-4 pt-4 border-t border-white/10 animate-in slide-in-from-top duration-200"
          >
            <div class="space-y-3">
              <h4 class="text-xs font-medium text-gray-300 mb-3">{{ t('partner.subGames') }}</h4>
              
              <!-- Sub Game Cards -->
              <div v-if="game.games && game.games.length > 0" class="space-y-3">
                <div v-for="subGame in game.games" :key="subGame.game" class="bg-white/5 rounded-lg p-3">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-medium text-white">{{ t(subGame.game) }}</span>
                  </div>
                  <div class="grid grid-cols-2 gap-3 text-xs">
                    <div class="flex items-center justify-between">
                      <span class="text-gray-400">{{ t('partner.betAmount') }}</span>
                      <span class="text-white">{{ Number(subGame.betamt) || 0 }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-gray-400">{{ t('partner.winAmount') }}</span>
                      <span class="text-white">{{ Number(subGame.winamt) || 0 }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-gray-400">{{ t('partner.profit') }}</span>
                                              <span class="text-white" :class="Number(subGame.profit) >= 0 ? 'text-green-400' : 'text-red-400'">
                          {{ Number(subGame.profit) >= 0 ? '+' : '' }}{{ Number(subGame.profit) || 0 }}
                        </span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-gray-400">{{ t('partner.rollAmount') }}</span>
                      <span class="text-white">{{ Number(subGame.rollamt) || 0 }}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- No Sub Games -->
              <div v-else class="text-center py-4">
                <p class="text-xs text-gray-400">{{ t('common.noDataFound') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
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
import qs from "qs";

export interface IData {
  deposit: number;
  bonus: number;
  withdrawal: number;
  depwid: number;
  wallet: number;
  wallet_point: number;
  wallet_rolling: number;
  deposits: number;
  withdrawals: number;
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
    const loading = ref(false);
    
    // Mobile state
    const expandedGames = ref<string[]>([]);
    
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
    const toggleGameExpand = (gameType: string) => {
      const index = expandedGames.value.indexOf(gameType);
      if (index > -1) {
        expandedGames.value.splice(index, 1);
      } else {
        expandedGames.value.push(gameType);
      }
    };

    // setSelectedDate is now only used by dateButtons
    const setSelectedDate = (date: DateRange) => {
      if (dateRange.value.start !== date.start || dateRange.value.end !== date.end) {
        dateRange.value.start = date.start;
        dateRange.value.end = date.end;
      }
    };

    const getList = async () => {
      try {
        loading.value = true;
        // Build query parameters using qs
        const query = qs.stringify(
          {
            start: dateRange.value.start,
            end: dateRange.value.end,
            member_id: props.memberId || undefined,
          },
          { addQueryPrefix: true, skipNulls: true }
        );

        // Fetch transaction data
        const results = await ApiService.get(
          `/partner/dashboard${query}`
        ).then((res) => res.data);

        // Clear and update table data without triggering watchers
        tableData.value.length = 0;
        tableData.value.push(...results);

        // Fetch game summary data
        const gameResults = await ApiService.get(
          `/partner/dashboard/summary${query}`
        ).then((res) => res.data);

        // Clear and update game table data without triggering watchers
        gameTableData.value.length = 0;
        gameTableData.value.push(...gameResults);
      } catch (error) {
        console.error("Dashboard API error:", error);
      } finally {
        loading.value = false;
      }
    };

    const formatDateRange = computed(() => {
      if (dateRange.value.start && dateRange.value.end) {
        const start = moment(dateRange.value.start).format("MM/DD/YYYY");
        const end = moment(dateRange.value.end).format("MM/DD/YYYY");
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
      expandedGames,
      setSelectedDate,
      toggleGameExpand,
      getList,
      formatDateRange,
      loading,
    };
  },
});
</script>
