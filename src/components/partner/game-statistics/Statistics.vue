<template>
  <div>
    <!-- Controls Section -->
    <div class="w-full px-4 py-6">
      <div class="flex items-end justify-end">
        <div class="flex flex-col lg:flex-row gap-4 items-stretch lg:items-end">
          <!-- Member Select -->
          <div class="flex-shrink-0">
            <label class="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
              Select Member
            </label>
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
            <label class="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
              Date Range
            </label>
            <DateRangePicker
              class="w-full date-picker-modern"
              @changedate="setSelectedDate"
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
              class="w-20 h-10 rounded-lg text-xs font-semibold text-black bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <i class="fas fa-search mr-1"></i>
              Search
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Table Section -->
    <div class="w-full px-4 pb-6">
      <div class="w-full bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden">
        <div class="px-6 py-4 border-b border-white/10 bg-gradient-to-r from-white/5 to-white/10 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-yellow-500/20 rounded-lg">
              <i class="fas fa-chart-bar text-yellow-400 text-sm"></i>
            </div>
            <div>
              <h2 class="text-lg font-semibold text-white">{{ gameDisplayName }} {{ t('partnerMenu.statistics') }}</h2>
              <p class="text-xs text-gray-400">Game performance and analytics overview</p>
            </div>
          </div>
          <div class="text-xs text-gray-400">
            <i class="fas fa-table mr-1"></i>
            {{ tableData.length }} records
          </div>
        </div>
        
        <div class="w-full px-10 pb-5">
          <KTDatatable :tableHeader="tableHeaders" :tableData="tableData" :rowsPerPage="50">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import moment from "moment";
import qs from "qs";
import { useI18n } from "vue-i18n";
import ApiService from "@/services/ApiService";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import DateRangePicker from "@/components/kt-date/DateRangePicker.vue";

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

    let daterange = {
      start: moment().startOf("month").format("YYYY-MM-DD"),
      end: moment().format("YYYY-MM-DD"),
    };

    const setSelectedDate = (date: DateRange) => {
      daterange = date;
      getList();
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
        let query = qs.stringify({
          game: props.game,
          start: daterange.start,
          end: daterange.end,
        });

        if (memberId.value !== "") {
          query = qs.stringify({
            game: props.game,
            start: daterange.start,
            end: daterange.end,
            member_id: memberId.value,
          });
        }

        const results = await ApiService.get(`/partner/game-stats?${query}`)
          .then((res) => res.data)
          .catch(() => []);

        tableData.value.splice(0, tableData.value.length, ...results);
      } catch (error) {
        console.error('Failed to fetch game statistics:', error);
      }
    };

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
      setSelectedDate,
      getList,
      t,
    };
  },
});
</script>

<style scoped>
@import '@/assets/common-dashboard.css';
</style>