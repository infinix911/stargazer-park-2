<template>
  <div>
    <!-- Controls Section -->
    <div class="w-full px-4 py-6">
      <div class="flex items-end justify-end">
        <div class="flex flex-col lg:flex-row gap-4 items-stretch lg:items-end">
          <!-- Member Select -->
          <div class="flex-shrink-0">
            <select 
              v-model="memberId" 
              class="w-48 bg-white/10 border border-white/20 rounded-lg text-white text-sm px-3 focus:border-blue-500 focus:outline-none"
              style="height: 40px;"
            >
              <option value="" class="bg-gray-800 text-white">{{ t("partner.all") }}</option>
              <option v-for="mem in members" :key="mem.member_id" :value="mem.member_id" class="bg-gray-800 text-white">
                {{ mem.member }}
              </option>
            </select>
          </div>

          <!-- Date Range Picker -->
          <div class="flex-1 min-w-0 max-w-[300px]">
            <DateRangePicker
              class="w-full date-picker-modern"
              v-model="dateRange"
              initial="month"
              style="height: 40px;"
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
              class="w-20 h-10 rounded-lg text-xs font-semibold text-black bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
    <div class="w-full px-4 pb-6">
      <DataTableCard
        :title="`${gameDisplayName} ${t('partnerMenu.statistics')}`"
        subtitle="Game performance and analytics overview"
        :record-count="tableData.length"
        icon="fas fa-chart-bar"
        icon-color="#eab308"
        :loading="loading"
      >
          <KTDatatable :tableHeader="tableHeaders" :tableData="tableData" :rowsPerPage="50" :loading="loading">
            <!-- Tie Amount (always 0 for now) -->
            <template v-slot:cell-tieamt="{}">
              <div class="text-center">
                <span class="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-500/20 text-gray-300 rounded-lg border border-gray-500/30">
                  <i class="fas fa-minus mr-1"></i>
                  0
                </span>
              </div>
            </template>
        </KTDatatable>
      </DataTableCard>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, watch } from "vue";
import moment from "moment";
import qs from "qs";
import { useI18n } from "vue-i18n";
import ApiService from "@/services/ApiService";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import DateRangePicker from "@/components/kt-date/DateRangePicker.vue";
import DataTableCard from "@/components/ui/DataTableCard.vue";

export interface IMember {
  member: string;
  member_id: string;
}

export interface IData {
  betamt: number;
  deposits: number;
  loseamt: number;
  loseamtsub: number;
  pdate: string;
  profit: number;
  rollamt: number;
  rollamtsub: number;
  sonic: number;
  winamt: number;
  withdrawals: number;
}

export interface DateRange {
  start: string;
  end: string;
}

export default defineComponent({
  name: "GameStats",
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
  },
  setup(props) {
    const { t } = useI18n();
    
    const tableData = ref<IData[]>([]);
    const tableHeaders = [
      { key: "pdate", name: t("partner.date"), text: true },
      { key: "deposits", name: t("partner.depAmount"), currency: true },
      { key: "withdrawals", name: t("partner.widAmount"), currency: true },
      { key: "sonic", name: t("partner.depWidProfit"), currency: true },
      { key: "betamt", name: t("partner.betamount"), currency: true },
      { key: "winamt", name: t("partner.winamount"), currency: true },
      { key: "profit", name: t("partner.betProfit"), currency: true },
      { key: "rollamtsub", name: t("partner.subRolling"), currency: true },
      { key: "rollamt", name: t("partner.rolling"), currency: true },
    ];

    const memberId = ref("");
    const members = ref<IMember[]>([]);

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
        'ALL': t('partner.all'),
        'CASINO': t('partner.casino'),
        'HOTEL': t('partner.hotel'),
        'SLOT': t('partner.slot'),
        'SPORT': t('partner.sport'),
      };
      return gameNames[props.game as keyof typeof gameNames] || props.game;
    });

    // Date range (reactive, two-way bind with DateRangePicker)
    const dateRange = ref({
      start: moment().startOf("month").format("YYYY-MM-DD"),
      end: moment().format("YYYY-MM-DD"),
    });

    // Loading state
    const loading = ref(false);

    const setSelectedDate = (date: DateRange) => {
      if (dateRange.value.start !== date.start || dateRange.value.end !== date.end) {
        dateRange.value.start = date.start;
        dateRange.value.end = date.end;
      }
    };

    const getMembers = async () => {
      try {
        const mems: IMember[] = await ApiService.get("/partner/members/select")
          .then((res) => res.data)
          .catch(() => []);
        members.value.splice(0, members.value.length, ...mems);
      } catch (error) {
        console.error('Failed to fetch members:', error);
      }
    };

    const getList = async () => {
      try {
        loading.value = true;
        let query = qs.stringify({
          game: props.game,
          start: dateRange.value.start,
          end: dateRange.value.end,
        });

        if (memberId.value !== "") {
          query = qs.stringify({
            game: props.game,
            start: dateRange.value.start,
            end: dateRange.value.end,
            member_id: memberId.value,
          });
        }

        const results = await ApiService.get(`/partner/game-stats?${query}`)
          .then((res) => res.data)
          .catch(() => []);

        tableData.value.splice(0, tableData.value.length, ...results);
      } catch (error) {
        console.error('Failed to fetch game statistics:', error);
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
      getMembers();
    });

    return {
      tableHeaders,
      tableData,
      memberId,
      members,
      dateButtons,
      gameDisplayName,
      dateRange,
      setSelectedDate,
      getList,
      t,
      loading,
    };
  },
});
</script>

<style scoped>
@import '@/assets/common-dashboard.css';
</style>