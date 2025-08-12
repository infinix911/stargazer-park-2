<template>
  <div>
    <!-- Mobile Filter Toggle -->
    <div class="block md:hidden px-4 py-4">
      <button
        @click="showMobileFilters = !showMobileFilters"
        class="w-full flex items-center justify-between p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200"
      >
        <div class="flex items-center gap-2">
          <i class="fas fa-filter text-blue-400"></i>
          <span class="text-white font-medium">{{ t("common.searchfilters") }}</span>
        </div>
        <i
          class="fas fa-chevron-down transition-transform text-white"
          :class="{ 'rotate-180': showMobileFilters }"
        ></i>
      </button>

      <!-- Mobile Filters -->
      <div
        v-if="showMobileFilters"
        class="mt-3 space-y-3 animate-in slide-in-from-top duration-200"
      >
        <!-- Search Fields for Mobile -->
        <div v-if="memberId === undefined" class="space-y-3">
          <select
            v-model="searchType"
            class="w-full bg-white/10 border border-white/20 rounded-lg text-white text-sm px-3 focus:border-blue-500 focus:outline-none h-[44px]"
          >
            <option
              v-for="option in searchTypes"
              :key="option.value"
              :value="option.value"
              class="bg-gray-800 text-white"
            >
              {{ option.label }}
            </option>
          </select>
          <input
            v-model="searchValue"
            type="text"
            :placeholder="t('common.search')"
            class="w-full bg-white/10 border border-white/20 rounded-lg text-white text-sm px-3 focus:border-blue-500 focus:outline-none placeholder-gray-400 h-[44px]"
          />
        </div>

        <!-- Quick Date Buttons for Mobile -->
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="dateButton in dateButtons"
            :key="dateButton.key"
            @click="setSelectedDate(dateButton.range)"
            class="h-[44px] rounded-lg text-xs font-medium text-white/80 bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-200 active:scale-95"
          >
            {{ t(dateButton.label) }}
          </button>
        </div>

        <!-- Date Range Picker for Mobile -->
        <DateRangePicker
          class="w-full !h-[44px] date-picker-modern"
          v-model="daterange"
          initial="week"
        />

        <!-- Search Button for Mobile -->
        <button
          @click="getHistory"
          :disabled="loading"
          class="w-full h-[44px] rounded-lg text-sm font-semibold text-black bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 transition-all duration-200 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
          <i v-else class="fas fa-search mr-2"></i>
          {{ loading ? t("common.loading") : t("search") }}
        </button>
      </div>
    </div>

    <!-- Desktop Controls Section -->
    <div class="hidden md:block w-full px-4 py-6">
      <div
        class="flex flex-col sm:flex-row lg:flex-row gap-3 items-stretch sm:items-end lg:items-end justify-end"
      >
        <!-- Search Fields Row -->
        <div class="flex flex-col sm:flex-row gap-3 flex-1 lg:flex-initial">
          <!-- Search Type -->
          <div v-if="memberId === undefined" class="w-full sm:w-32 lg:w-32">
            <select
              v-model="searchType"
              class="w-full bg-white/10 border border-white/20 rounded-lg text-white text-sm px-3 focus:border-blue-500 focus:outline-none h-[40px]"
            >
              <option
                v-for="option in searchTypes"
                :key="option.value"
                :value="option.value"
                class="bg-gray-800 text-white"
              >
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
            {{ loading ? t("common.loading") : t("search") }}
          </button>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="w-full px-4 pb-6">
      <div class="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
        <!-- Roll Amount -->
        <div
          class="bg-gradient-to-r from-red-500/20 to-rose-600/20 backdrop-blur-sm border border-red-500/30 rounded-xl p-3 md:p-6"
        >
          <div class="text-center md:flex md:items-center md:gap-4 md:text-left">
            <div
              class="mx-auto md:mx-0 mb-2 md:mb-0 p-2 md:p-3 bg-red-500/30 rounded-lg w-fit"
            >
              <i class="fas fa-chart-line text-red-300 text-lg md:text-xl"></i>
            </div>
            <div>
                              <h3 class="text-lg md:text-2xl font-bold text-white">
                  {{ n(Number(historySums.rollamt)) }}
                </h3>
              <p class="text-xs md:text-sm text-gray-300">
                {{
                  game === "CASINO"
                    ? t("partner.noTieBetAmount")
                    : t("partner.rollAmount")
                }}
              </p>
            </div>
          </div>
        </div>

        <!-- Win Amount -->
        <div
          class="bg-gradient-to-r from-green-500/20 to-emerald-600/20 backdrop-blur-sm border border-green-500/30 rounded-xl p-3 md:p-6"
        >
          <div class="text-center md:flex md:items-center md:gap-4 md:text-left">
            <div
              class="mx-auto md:mx-0 mb-2 md:mb-0 p-2 md:p-3 bg-green-500/30 rounded-lg w-fit"
            >
              <i class="fas fa-trophy text-green-300 text-lg md:text-xl"></i>
            </div>
            <div>
                              <h3 class="text-lg md:text-2xl font-bold text-white">
                  {{ n(Number(historySums.winamt)) }}
                </h3>
              <p class="text-xs md:text-sm text-gray-300">
                {{ t("partner.winningAmount") }}
              </p>
            </div>
          </div>
        </div>

        <!-- Tie Amount (Casino only) -->
        <div
          v-if="game === 'CASINO'"
          class="col-span-2 md:col-span-1 bg-gradient-to-r from-blue-500/20 to-indigo-600/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-3 md:p-6"
        >
          <div class="text-center md:flex md:items-center md:gap-4 md:text-left">
            <div
              class="mx-auto md:mx-0 mb-2 md:mb-0 p-2 md:p-3 bg-blue-500/30 rounded-lg w-fit"
            >
              <i class="fas fa-handshake text-blue-300 text-lg md:text-xl"></i>
            </div>
            <div>
                              <h3 class="text-lg md:text-2xl font-bold text-white">
                  {{ n(Number(historySums.tieamt)) }}
                </h3>
              <p class="text-xs md:text-sm text-gray-300">
                {{ t("partner.tieBetAmount") }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Section -->
    <div class="w-full px-4 pb-6">
      <!-- Mobile Card Layout -->
      <div class="block md:hidden">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-white">
            {{ gameDisplayName }} {{ t("partnerMenu.betHistory") }}
          </h3>
          <span class="text-sm text-gray-400"
            >{{ tableData.length }} {{ t("common.records") }}</span
          >
        </div>

        <!-- Loading State for Mobile -->
        <div v-if="loading" class="space-y-3">
          <div
            v-for="i in 5"
            :key="i"
            class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 animate-pulse"
          >
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <div class="w-16 h-6 bg-white/20 rounded"></div>
                <div class="w-20 h-4 bg-white/10 rounded"></div>
              </div>
              <div class="w-16 h-4 bg-white/10 rounded"></div>
            </div>
            <div class="flex items-center justify-between">
              <div class="w-24 h-6 bg-white/20 rounded"></div>
              <div class="w-20 h-6 bg-white/20 rounded"></div>
            </div>
          </div>
        </div>

        <!-- Mobile Bet Cards -->
        <div v-else-if="tableData.length > 0" class="space-y-3">
          <div
            v-for="bet in tableData"
            :key="`${bet.member_id}-${bet.createdAt}`"
            class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-200 active:scale-[0.98]"
          >
            <!-- First Row: Member, Status, Created At -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <!-- Member -->
                <div class="flex items-center gap-2">
                  <div
                    class="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
                  >
                    <i class="fas fa-user text-white text-xs"></i>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-white">{{ bet.member }}</div>
                    <div class="text-xs text-gray-400">ID: {{ bet.member_id }}</div>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <!-- Status Badge -->
                <div class="flex items-center gap-2">
                  <span
                    v-if="bet.state === 0"
                    class="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded-full"
                  >
                    <div
                      class="w-2 h-2 bg-yellow-400 rounded-full mr-1 animate-pulse"
                    ></div>
                    {{ t("status.0") }}
                  </span>
                  <span
                    v-else-if="bet.state === 1 && bet.winamount > 0"
                    class="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30 rounded-full"
                  >
                    <div class="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                    {{ t("status.win") }}
                  </span>
                  <span
                    v-else-if="bet.state === 1 && bet.winamount <= 0"
                    class="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30 rounded-full"
                  >
                    <div class="w-2 h-2 bg-red-400 rounded-full mr-1"></div>
                    {{ t("status.lose") }}
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-500/20 text-gray-300 border border-gray-500/30 rounded-full"
                  >
                    <div class="w-2 h-2 bg-gray-400 rounded-full mr-1"></div>
                    {{ t("status.2") }}
                  </span>
                </div>

                <!-- Created At -->
                <div class="text-right">
                  <div class="text-xs text-gray-400">{{ formatTime(bet.createdAt) }}</div>
                  <div class="text-xs text-gray-500">
                    {{ moment(bet.createdAt).format("MM/DD") }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Second Row: Game, Room Order, Bet Amount, Win Amount -->
            <div class="grid grid-cols-2 gap-4 mb-4">
              <!-- Game & Room -->
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <div
                    class="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded flex items-center justify-center"
                  >
                    <i class="fas fa-gamepad text-white text-xs"></i>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-white">{{ bet.game }}</div>
                    <div class="text-xs text-gray-400">
                      {{ t("partner.round") }}: {{ bet.roomorder }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Amounts -->
              <div class="space-y-2">
                <div class="text-right">
                  <div class="text-xs text-gray-400 mb-1">
                    {{ t("partner.betamount") }}
                  </div>
                  <div class="text-sm font-bold text-white">{{ n(bet.betamount) }}</div>
                </div>
                <div class="text-right">
                  <div class="text-xs text-gray-400 mb-1">
                    {{ t("partner.winamount") }}
                  </div>
                  <div class="text-sm font-semibold text-blue-300">
                    {{ n(Number(bet.winamount)) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Expand Button -->
            <div class="flex justify-center pt-2 border-t border-white/10">
              <button
                @click="toggleExpand(bet.member_id + bet.createdAt)"
                class="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 text-gray-300 hover:text-white"
              >
                <span class="text-xs">{{
                  expandedCards.includes(bet.member_id + bet.createdAt)
                    ? "Show Less"
                    : "Show More"
                }}</span>
                <i
                  class="fas fa-chevron-down transition-transform text-xs"
                  :class="{
                    'rotate-180': expandedCards.includes(bet.member_id + bet.createdAt),
                  }"
                ></i>
              </button>
            </div>

            <!-- Expandable Details: Third Row Data -->
            <div
              v-if="expandedCards.includes(bet.member_id + bet.createdAt)"
              class="mt-4 pt-4 border-t border-white/10 animate-in slide-in-from-top duration-200"
            >
              <!-- Third Row: Pre_Acc, After_Acc, Profit, Updated At -->
              <div class="grid grid-cols-2 gap-4">
                <!-- Account Balances -->
                <div class="space-y-3">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-400">{{ t("pointWithdrawal.current") }}</span>
                    <span class="text-white font-medium">{{
                      n(Number(bet.pre_acc))
                    }}</span>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-400">{{ t("partner.amountAfter") }}</span>
                    <span class="text-white font-medium">{{
                      n(Number(bet.after_acc))
                    }}</span>
                  </div>
                </div>

                <!-- Profit & Updated At -->
                <div class="space-y-3">
                  <div class="text-right">
                    <div class="text-xs text-gray-400 mb-1">
                      {{ t("partner.betProfit") }}
                    </div>
                    <div
                      class="text-sm font-bold"
                      :class="bet.profit >= 0 ? 'text-green-400' : 'text-red-400'"
                    >
                      {{ bet.profit >= 0 ? "+" : "" }}{{ n(bet.profit) }}
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-xs text-gray-400 mb-1">
                      {{ t("partner.resultDate") }}
                    </div>
                    <div class="text-sm text-gray-300">
                      {{ formatDateTime(bet.updatedAt) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State for Mobile -->
        <div v-else class="text-center py-12">
          <i class="fas fa-inbox text-gray-400 text-4xl mb-4"></i>
          <p class="text-gray-400">{{ t("common.noData") }}</p>
        </div>

        <!-- Mobile Pagination -->
        <div
          v-if="tableData.length > 0 && rowsCount > 50"
          class="mt-6 flex justify-center"
        >
          <div class="flex items-center gap-2">
            <button
              @click="setPage(Math.max(1, currentPage - 1))"
              :disabled="currentPage <= 1"
              class="px-4 py-2 bg-white/10 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i class="fas fa-chevron-left"></i>
            </button>
            <span class="px-4 py-2 text-white text-sm">
              {{ currentPage }} / {{ Math.ceil(rowsCount / 50) }}
            </span>
            <button
              @click="setPage(Math.min(Math.ceil(rowsCount / 50), currentPage + 1))"
              :disabled="currentPage >= Math.ceil(rowsCount / 50)"
              class="px-4 py-2 bg-white/10 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Desktop Table Layout -->
      <div class="hidden md:block">
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
                {{ data.roomno }}
              </div>
            </template>

            <!-- Status -->
            <template v-slot:cell-status="{ row: data }">
              <div class="text-center">
                <span v-if="data.state === 0" class="text-gray-400">
                  {{ t("status.0") }}
                </span>
                <span
                  v-else-if="data.state === 1 && data.winamount > 0"
                  class="text-red-400"
                >
                  {{ t("status.win") }}
                </span>
                <span
                  v-else-if="data.state === 1 && data.winamount <= 0"
                  class="text-blue-400"
                >
                  {{ t("status.lose") }}
                </span>
                <span v-else class="text-gray-400">
                  {{ t("status.2") }}
                </span>
              </div>
            </template>

            <!-- Profit -->
            <template v-slot:cell-profit="{ row: data }">
              <div class="text-center">
                <span v-if="data.state === 0" class="text-gray-400">-</span>
                <span
                  v-else
                  :class="[
                    'inline-flex items-center px-2 py-1 text-xs font-medium rounded-lg border',
                    data.profit > 0
                      ? 'bg-green-500/20 text-green-300 border-green-500/30'
                      : 'bg-red-500/20 text-red-300 border-red-500/30',
                  ]"
                >
                  <i
                    :class="[
                      'mr-1',
                      data.profit > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down',
                    ]"
                  ></i>
                  {{ n(Number(data.profit)) }}
                </span>
              </div>
            </template>

            <!-- After Account -->
            <template v-slot:cell-after_acc="{ row: data }">
              <div class="text-center">
                <span v-if="data.state === 0" class="text-gray-400">-</span>
                <span
                  v-else
                  class="inline-flex items-center px-2 py-1 text-sm font-medium bg-blue-500/20 text-blue-300 rounded-lg border border-blue-500/30"
                >
                  {{ n(Number(data.after_acc)) }}
                </span>
              </div>
            </template>
          </KTDatatable>
        </DataTableCard>
      </div>
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

// DetailRow Component
const DetailRow = defineComponent({
  name: "DetailRow",
  props: {
    label: { type: String, required: true },
    value: { type: [String, Number], required: true },
  },
  template: `
    <div class="flex items-center justify-between">
      <span class="text-gray-400 text-sm">{{ label }}</span>
      <span class="text-white text-sm">{{ value }}</span>
    </div>
  `,
});

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
    DetailRow,
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
      { key: "createdAt", name: t("partner.betDate") },
      { key: "updatedAt", name: t("partner.resultDate") },
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
          start: moment().format("YYYY-MM-DD"),
          end: moment().format("YYYY-MM-DD"),
        },
      },
      {
        key: "week",
        label: "dateRange.lastWeek",
        range: {
          start: moment().subtract(7, "days").format("YYYY-MM-DD"),
          end: moment().format("YYYY-MM-DD"),
        },
      },
      {
        key: "fifteen",
        label: "dateRange.fifteenDays",
        range: {
          start: moment().subtract(15, "days").format("YYYY-MM-DD"),
          end: moment().format("YYYY-MM-DD"),
        },
      },
    ];

    const gameDisplayName = computed(() => {
      const gameNames = {
        CASINO: t("partner.casino"),
        HOTEL: t("partner.hotel"),
        SLOT: t("partner.slot"),
        SPORT: t("partner.sport"),
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

    // Mobile state
    const showMobileFilters = ref(false);
    const expandedCards = ref<string[]>([]);
    const currentPage = ref(1);

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
      currentPage.value = page;
      getHistory();
    };

    // Mobile helper functions
    const toggleExpand = (cardId: string) => {
      const index = expandedCards.value.indexOf(cardId);
      if (index > -1) {
        expandedCards.value.splice(index, 1);
      } else {
        expandedCards.value.push(cardId);
      }
    };

    const formatTime = (dateString: string) => {
      return moment(dateString).format("HH:mm");
    };

    const formatDateTime = (dateString: string) => {
      return moment(dateString).format("MM/DD HH:mm");
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
          .catch(() => ({
            rows: 0,
            sums: { rollamt: 0, tieamt: 0, winamt: 0 },
            data: [],
          }));

        rowsCount.value = Number(results.rows);
        historySums.value = results.sums;
        tableData.value.splice(0, tableData.value.length, ...results.data);
      } catch (error) {
        console.error("Failed to fetch bet history:", error);
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

    // Load data on mount
    getHistory();

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
      // Mobile state
      showMobileFilters,
      expandedCards,
      currentPage,
      // Mobile helpers
      toggleExpand,
      formatTime,
      formatDateTime,
      // moment for template
      moment,
    };
  },
});
</script>

<style scoped>
@import "@/assets/common-dashboard.css";
</style>
