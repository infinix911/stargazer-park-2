<template>
  <div class="max-w-[1500px] mx-auto">

    <!-- Compact Header with Integrated Controls -->
    <div class="">
      <div class="w-full mx-auto px-4 py-6">
        <!-- Header Row -->
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
          <div class="flex items-center gap-3">
            <div class="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <i class="fas fa-chart-line text-white text-xl"></i>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-white">{{ $t("PartnerMenu.home") }}</h1>
              <p class="text-sm text-gray-400">Analytics Dashboard</p>
            </div>
          </div>
          
          <!-- Quick Stats Cards -->
          <div class="flex gap-4">
            <!-- <div class="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
              <div class="text-xs text-gray-400 uppercase tracking-wide">Active</div>
              <div class="text-lg font-semibold text-green-400">{{ tableData.length }}</div>
            </div> -->
            <div class="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
              <div class="text-xs text-gray-400 uppercase tracking-wide">Period</div>
              <div class="text-lg font-semibold text-blue-400">{{ formatDateRange }}</div>
            </div>
          </div>
        </div>

        <!-- Integrated Controls -->
        <div class="bg-white/5 backdrop-blur-md p-8 border border-white/10">
          <div class="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
            <!-- Date Picker -->
            <div class="flex-1 min-w-0">
              <label class="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">Date Range</label>
              <DateRangePicker
                class="w-full h-10 date-picker-modern"
                @changedate="setSelectedDate"
                initial="month"
              />
            </div>

            <!-- Quick Actions -->
            <div class="flex gap-2 lg:min-w-0 lg:flex-shrink-0">
              <button
                @click="setSelectedDate({ start: moment().format('YYYY-MM-DD'), end: moment().format('YYYY-MM-DD') })"
                class="px-3 py-2 rounded-lg text-xs font-medium text-white/80 bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-200 hover:scale-105"
              >
                Today
              </button>
              <button
                @click="setSelectedDate({ start: moment().subtract(7, 'days').format('YYYY-MM-DD'), end: moment().format('YYYY-MM-DD') })"
                class="px-3 py-2 rounded-lg text-xs font-medium text-white/80 bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-200 hover:scale-105"
              >
                7D
              </button>
              <button
                @click="setSelectedDate({ start: moment().subtract(15, 'days').format('YYYY-MM-DD'), end: moment().format('YYYY-MM-DD') })"
                class="px-3 py-2 rounded-lg text-xs font-medium text-white/80 bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-200 hover:scale-105"
              >
                15D
              </button>
              <button
                @click="getList"
                class="px-4 py-2 rounded-lg text-xs font-semibold text-black bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <i class="fas fa-search mr-1"></i>
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="relative z-10 py-6">
      <div class="w-full mx-auto px-2">
        <!-- Data Table Section -->
        <div class="w-full bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden">
          <!-- Table Header -->
          <div class="px-6 py-4 border-b border-white/10 bg-gradient-to-r from-white/5 to-white/10">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-blue-500/20 rounded-lg">
                  <i class="fas fa-exchange-alt text-blue-400 text-sm"></i>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-white">{{ $t("partner.totalDepWid") }}</h2>
                  <p class="text-xs text-gray-400">Transaction Overview</p>
                </div>
              </div>
              <div class="text-xs text-gray-400">
                <i class="fas fa-table mr-1"></i>
                {{ tableData.length }} records
              </div>
            </div>
          </div>
          <!-- Table Content -->
          <div class="w-full">
            <KTDatatable
              :tableHeader="tableHeaders"
              :tableData="tableData"
              :rowsPerPage="50"
            />
          </div>
        </div>

        <!-- Game Summary Section -->
        <div class="w-full mt-6 bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden">
          <!-- Table Header -->
          <div class="px-6 py-4 border-b border-white/10 bg-gradient-to-r from-white/5 to-white/10">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-green-500/20 rounded-lg">
                  <i class="fas fa-gamepad text-green-400 text-sm"></i>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-white">{{ $t("partner.gameBetTotal") }}</h2>
                  <p class="text-xs text-gray-400">Game Statistics</p>
                </div>
              </div>
              <div class="text-xs text-gray-400">
                <i class="fas fa-table mr-1"></i>
                {{ gameTableData.length }} records
              </div>
            </div>
          </div>

          <!-- Table Content -->
          <div class="w-full">
            <KTDatatable
              :tableHeader="gameTableHeaders"
              :tableData="gameTableData"
              :rowsPerPage="50"
              :isAccordion="true"
            >
              <!-- Casino Sub Table -->
              <template v-slot:table-sub0="{}">
                <KTDatatable
                  :tableHeader="gameTableHeaders"
                  :tableData="gameTableData[0]?.games || []"
                  :rowsPerPage="50"
                >
                  <template v-slot:cell-game="{ row: data }">
                    <span>{{ $t(data.game) }}</span>
                  </template>
                </KTDatatable>
              </template>

              <!-- Slot Sub Table -->
              <template v-slot:table-sub1="{}">
                <KTDatatable
                  :tableHeader="gameTableHeaders"
                  :tableData="gameTableData[1]?.games || []"
                  :rowsPerPage="50"
                >
                  <template v-slot:cell-game="{ row: data }">
                    <span>{{ $t(data.game) }}</span>
                  </template>
                </KTDatatable>
              </template>

              <!-- Hotel Sub Table -->
              <template v-slot:table-sub2="{}">
                <KTDatatable
                  :tableHeader="gameTableHeaders"
                  :tableData="gameTableData[2]?.games || []"
                  :rowsPerPage="50"
                >
                  <template v-slot:cell-game="{ row: data }">
                    <span>{{ $t(data.game) }}</span>
                  </template>
                </KTDatatable>
              </template>

              <!-- Sports Sub Table -->
              <template v-slot:table-sub3="{}">
                <KTDatatable
                  :tableHeader="gameTableHeaders"
                  :tableData="gameTableData[3]?.games || []"
                  :rowsPerPage="50"
                >
                  <template v-slot:cell-game="{ row: data }">
                    <span>{{ $t(data.game) }}</span>
                  </template>
                </KTDatatable>
              </template>

              <!-- Game Type -->
              <template v-slot:cell-game="{ row: data }">
                <span>{{ $t(data.game_type) }}</span>
              </template>
            </KTDatatable>
          </div>
        </div>
      </div>
    </div>
  </div>
  </template>

<style scoped>
/* Force table to take full width */
:deep(.dataTables_wrapper) {
  width: 100% !important;
  max-width: none !important;
}

:deep(.table-responsive) {
  width: 100% !important;
  max-width: none !important;
  overflow-x: auto !important;
}

:deep(.table) {
  width: 100% !important;
  max-width: none !important;
  table-layout: auto !important;
  margin: 0 !important;
}

:deep(.table th) {
  min-width: 120px !important;
  max-width: none !important;
  white-space: nowrap !important;
  padding: 12px 8px !important;
}

:deep(.table td) {
  min-width: 120px !important;
  max-width: none !important;
  padding: 12px 8px !important;
}

/* Ensure container takes full width */
:deep(.bg-white\/5) {
  width: 100% !important;
  max-width: none !important;
}

/* Force full width on all container elements */
:deep(.dataTables_wrapper .no-footer) {
  width: 100% !important;
}

/* Ensure tbody takes full width */
:deep(.table tbody) {
  width: 100% !important;
}

:deep(.table thead) {
  width: 100% !important;
}

/* Element Plus DateRangePicker Styling for Dark Theme */
:deep(.el-date-editor) {
  background-color: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: white !important;
  border-radius: 8px !important;
}

:deep(.el-date-editor .el-input__inner) {
  background-color: transparent !important;
  border: none !important;
  color: white !important;
}

:deep(.el-date-editor .el-input__wrapper) {
  background-color: transparent !important;
  box-shadow: none !important;
}

:deep(.el-date-editor .el-range-separator) {
  color: rgba(255, 255, 255, 0.6) !important;
}

:deep(.el-date-editor .el-range-input) {
  background-color: transparent !important;
  color: white !important;
}

:deep(.el-date-editor.is-active) {
  border-color: rgba(59, 130, 246, 0.5) !important;
}

:deep(.el-date-editor:hover) {
  border-color: rgba(255, 255, 255, 0.4) !important;
}

/* Element Plus DateRangePicker Popover/Dropdown Styling */
:deep(.el-picker-panel) {
  background-color: rgba(30, 41, 59, 0.95) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: 12px !important;
  backdrop-filter: blur(12px) !important;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8) !important;
  color: white !important;
  z-index: 9999 !important;
}

:deep(.el-picker-panel .el-date-range-picker__header) {
  color: white !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}

:deep(.el-picker-panel .el-date-table td) {
  color: rgba(255, 255, 255, 0.8) !important;
}

:deep(.el-picker-panel .el-date-table td.current:not(.disabled)) {
  color: #409eff !important;
  font-weight: bold !important;
}

:deep(.el-picker-panel .el-date-table td:hover) {
  background-color: rgba(64, 158, 255, 0.1) !important;
  color: white !important;
}

:deep(.el-picker-panel .el-date-table td.in-range) {
  background-color: rgba(64, 158, 255, 0.2) !important;
  color: white !important;
}

:deep(.el-picker-panel .el-date-table td.start-date) {
  background-color: #409eff !important;
  color: white !important;
}

:deep(.el-picker-panel .el-date-table td.end-date) {
  background-color: #409eff !important;
  color: white !important;
}

:deep(.el-picker-panel .el-date-table th) {
  color: rgba(255, 255, 255, 0.6) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}

:deep(.el-picker-panel .el-date-range-picker__time-header) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}

:deep(.el-picker-panel .el-button) {
  background-color: rgba(64, 158, 255, 0.8) !important;
  border-color: rgba(64, 158, 255, 0.8) !important;
  color: white !important;
}

:deep(.el-picker-panel .el-button:hover) {
  background-color: #409eff !important;
  border-color: #409eff !important;
}

/* Ensure popover appears above other elements */
.el-picker-panel {
  z-index: 9999 !important;
}

/* Fix for Element Plus popper positioning */
:deep(.el-popper) {
  z-index: 9999 !important;
}

:deep(.el-popper.is-dark) {
  background-color: rgba(30, 41, 59, 0.95) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

/* Global Element Plus popover fixes */
body .el-picker-panel {
  z-index: 9999 !important;
  position: fixed !important;
}

body .el-popper {
  z-index: 9999 !important;
}

/* Fix potential overflow issues */
:deep(.date-picker-modern) {
  position: relative !important;
  z-index: 1 !important;
}

/* Ensure parent containers don't clip the popover */
:deep(.bg-white\/5) {
  overflow: visible !important;
}

/* Fix any potential backdrop filter interference */
:deep(.backdrop-blur-md) {
  position: relative !important;
}
</style>
  
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
  games: Object;
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
    // vue variables
    const { t } = useI18n();
    // table variables
    const tableData: any = ref<Array<IData>>([]);
         const tableHeaders = [
       { key: "deposits", name: t("partner.deposit"), currency: true },
       { key: "withdrawals", name: t("partner.withdrawal"), currency: true },
       { key: "depwid", name: t("partner.depWid"), currency: true },

       { key: "wallet", name: t("partner.wallet"), currency: true },
       {
         key: "wallet_point",
         name: t("partner.walletPoint"),
         currency: true,
       },
     ];
    // game table summary
    const gameTableData: any = ref<Array<ISummaryTable>>([]);
         const gameTableHeaders = [
       {
         key: "game",
         name: t("partner.gameType"),
         customslot: true,
       },
       { key: "betamt", name: t("partner.betamt"), currency: true },
       { key: "winamt", name: t("partner.winamt"), currency: true },
       {
         key: "rollamtsub",
         name: t("partner.rollamtsub"),
         currency: true,
       },
       {
         key: "rollamt",
         name: t("partner.rollamt"),
         currency: true,
       },
       { key: "total_profit", name: t("partner.totalProfit"), currency: true },
     ];

    /**
     * Filters
     */
    let range = {
      start: moment().startOf("month").format("YYYY-MM-DD"),
      end: moment().format("YYYY-MM-DD"),
    };

    const setSelectedDate = (date: DateRange) => {
      range = date;
      getList();
    };

    /**
     * Get List
     *
     */
    const getList = async () => {
      const results = await ApiService.get(
        `/partner/dashboard?start=${range.start}&end=${range.end}`
      )
        .then((res) => res.data)
        .catch(() => []);
      // add data
      tableData.value.splice(0, tableData.value.length, ...results);



      // game summary
      const gameResults = await ApiService.get(
        `/partner/dashboard/summary?start=${range.start}&end=${range.end}`
      )
        .then((res) => res.data)
        .catch(() => []);
      // add data
      gameTableData.value.splice(0, gameTableData.value.length, ...gameResults);
    };

    onMounted(()=>{
      // Set background
      var el = document.querySelector('.wrapper-img-container-partner');
      el.style.backgroundImage = "url('')";
      el.style.backgroundColor = "#0c0c0c";
    });

    return {
      tableHeaders,
      tableData,
      gameTableHeaders,
      gameTableData,
      // Date Picker
      setSelectedDate,
      moment,
      getList,
    };
  },
});
</script>

<style scoped>
/* Modern Date Picker Styling */
:deep(.date-picker-modern .el-date-editor) {
  border-radius: 8px !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
  color: white !important;
  transition: all 0.2s ease;
  height: 40px !important;
  font-size: 0.875rem;
}

:deep(.date-picker-modern .el-date-editor:hover) {
  border-color: rgba(59, 130, 246, 0.5) !important;
  background: rgba(255, 255, 255, 0.15) !important;
}

:deep(.date-picker-modern .el-date-editor.is-active) {
  border-color: rgba(59, 130, 246, 0.8) !important;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
}

:deep(.date-picker-modern .el-range-input) {
  color: white !important;
  background: transparent !important;
  font-size: 0.875rem !important;
  padding: 0 12px !important;
}

:deep(.date-picker-modern .el-range-separator) {
  color: rgba(255, 255, 255, 0.7) !important;
  font-weight: 500 !important;
}

:deep(.date-picker-modern .el-input__wrapper) {
  background: transparent !important;
  box-shadow: none !important;
}

:deep(.date-picker-modern input::placeholder) {
  color: rgba(255, 255, 255, 0.6) !important;
  font-size: 0.875rem !important;
}

:deep(.date-picker-modern .el-input__inner) {
  color: white !important;
  font-weight: 500 !important;
}

/* Animation keyframes for background */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.2;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.3;
  }
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

/* Custom scrollbar */
:deep(.table-responsive) {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

:deep(.table-responsive::-webkit-scrollbar) {
  height: 6px;
  width: 6px;
}

:deep(.table-responsive::-webkit-scrollbar-track) {
  background: transparent;
}

:deep(.table-responsive::-webkit-scrollbar-thumb) {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

:deep(.table-responsive::-webkit-scrollbar-thumb:hover) {
  background: rgba(255, 255, 255, 0.5);
}

/* Responsive design */
@media (max-width: 1024px) {
  .flex-col.lg\:flex-row {
    flex-direction: column !important;
  }
  
  .gap-4.lg\:items-center {
    align-items: stretch !important;
  }
}

@media (max-width: 768px) {
  .max-w-7xl {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }
  
  .px-6 {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }
  
  .py-6 {
    padding-top: 1rem !important;
    padding-bottom: 1rem !important;
  }
}
</style>