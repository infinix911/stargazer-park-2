<template>
  <!-- Page Header -->
  <div class="relative z-10 bg-black/20 backdrop-blur-md border-b border-white/10">
    <div class="max-w-[1800px] mx-auto px-4 py-6">
      <div class="flex items-center gap-3">
        <div class="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
          <i class="fas fa-users text-white text-xl"></i>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-white">{{ t("partnerMenu.member") }}</h1>
          <p class="text-sm text-gray-400">Member Management and Analytics</p>
        </div>
      </div>
    </div>
  </div>

  <div class="max-w-[1800px] mx-auto">
    <!-- Controls Section -->
    <div class="w-full mx-auto px-4 py-6">
      <div class="flex flex-col lg:flex-row gap-4 items-stretch lg:items-end lg:justify-between w-full">
        <!-- Add Member Button - Left Side -->
        <div class="flex items-end">
          <button 
            @click="openModal('AddSubMember')"
            class="px-6 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg"
            style="height: 40px;"
          >
            <i class="fas fa-user-plus mr-2"></i>
            {{ t("partner.tab.addSubMember") }}
          </button>
        </div>
        
        <!-- Search Controls - Right Side -->
        <div class="flex flex-col lg:flex-row gap-4 items-stretch lg:items-end">
          <!-- Search Type -->
          <div class="flex-shrink-0">
            <label class="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
              Search Type
            </label>
            <select 
              v-model="searchType" 
              class="w-32 bg-white/10 border border-white/20 rounded-lg text-white text-sm px-3 focus:border-blue-500 focus:outline-none"
              style="height: 40px;"
            >
              <option v-for="option in searchTypes" :key="option.value" :value="option.value" class="bg-gray-800 text-white">
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- Search Value -->
          <div class="flex-shrink-0">
            <label class="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
              Search Value
            </label>
            <input 
              v-model="searchValue" 
              :placeholder="t('SearchKeyword')" 
              type="text"
              class="w-48 bg-white/10 border border-white/20 rounded-lg text-white text-sm px-3 focus:border-blue-500 focus:outline-none placeholder-gray-400"
              style="height: 40px;"
            />
          </div>

          <!-- Date Range Picker -->
          <div class="flex-1 min-w-0 max-w-[300px]">
            <label class="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
              Date Range
            </label>
            <DateRangePicker
              class="w-full h-10 date-picker-modern"
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

    <!-- Content Area -->
    <div class="relative z-10 pb-6">
      <div class="w-full mx-auto px-2">
        <div class="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <!-- Member Tree Sidebar -->
          <div class="xl:col-span-1">
            <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden">
              <div class="px-6 py-4 border-b border-white/10 bg-gradient-to-r from-white/5 to-white/10">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-purple-500/20 rounded-lg">
                    <i class="fas fa-sitemap text-purple-400 text-sm"></i>
                  </div>
                  <div>
                    <h2 class="text-lg font-semibold text-white">Member Tree</h2>
                    <p class="text-xs text-gray-400">Organization Structure</p>
                  </div>
                </div>
              </div>
              <div class="p-4">
                <MemberTree />
              </div>
            </div>
          </div>

          <!-- Member Table -->
          <div class="xl:col-span-3">
            <DataTableCard
              title="Member List"
              subtitle="Member Management"
              :record-count="tableData.length"
              icon="fas fa-users"
              icon-color="#3b82f6"
            >
                <KTDatatable :tableHeader="tableHeaders" :tableData="tableData" :rowsPerPage="50">
                  <!-- Member -->
                  <template v-slot:cell-member="{ row: data }">
                    <span> ({{ data.nickname }})</span>
                  </template>
                  <!-- Level -->
                  <template v-slot:cell-level="{ row: data }">
                    <span>{{ t(`partner.level${data.level}`) }}</span>
                  </template>
                  <!-- Wallet -->
                  <template v-slot:cell-wallet="{ row: data }">
                    <div class="space-y-1">
                      <div class="text-white">{{ n(Number(data.wallet)) }}</div>
                      <button 
                        type="button" 
                        class="px-2 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                        @click="refreshWalletBalance(data.member_id)"
                      >
                        <i class="fas fa-sync-alt"></i>
                      </button>
                    </div>
                  </template>
                  <!-- Shop Transaction -->
                  <template v-slot:cell-settle="{ row: data }">
                    <div v-if="data.shoplevel === 2 && data.member_id !== authStore.user.id" class="flex gap-1">
                      <button 
                        type="button" 
                        class="px-3 py-2 text-xs font-medium bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border border-green-400/30 whitespace-nowrap"
                        @click="onShopTransact(data.member_id, data.member, data.wallet, 'ADD')"
                      >
                        <i class="fas fa-plus mr-1.5"></i>
                        {{ t("partner.add") }}
                      </button>
                      <button 
                        type="button" 
                        class="px-3 py-2 text-xs font-medium bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border border-red-400/30 whitespace-nowrap"
                        @click="onShopTransact(data.member_id, data.member, data.wallet, 'DEDUCT')"
                      >
                        <i class="fas fa-minus mr-1.5"></i>
                        {{ t("partner.subtract") }}
                      </button>
                    </div>
                    <div v-else></div>
                  </template>
                  <!-- Game Money Dep Wid -->
                  <template v-slot:cell-game_money="{ row: data }">
                    <div class="space-y-1">
                      <button 
                        v-if="data.game_bal <= 0" 
                        type="button" 
                        class="px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                        @click="onGameMoneyWithdraw(data.member_id)"
                      >
                        {{ t("partner.subtract") }}
                      </button>
                      <div v-if="data.game_bal" class="text-white">{{ n(Number(data.game_bal)) }}</div>
                    </div>
                  </template>
                  <!-- Slot Money -->
                  <template v-slot:cell-slot_money="{ row: data }">
                    <div v-if="data.wallet_game > 0" class="space-y-1">
                      <button 
                        type="button" 
                        class="px-2 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
                        @click="slotMoney(data.member_id)"
                      >
                        <i class="fas fa-check-circle mr-1"></i>
                        {{ t("partner.slotButton") }}
                      </button>
                      <div class="text-white">{{ n(Number(data.wallet_game)) }}</div>
                    </div>
                    <div v-else></div>
                  </template>
                  <!-- Point Transfer -->
                  <template v-slot:cell-point_transfer="{ row: data }">
                    <button 
                      type="button" 
                      class="px-3 py-2 text-xs font-medium bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border border-blue-400/30 whitespace-nowrap"
                      @click="onPointTransfer(data.member_id, data.member, 'ADD')"
                    >
                      <i class="fas fa-exchange-alt mr-1.5"></i>
                      {{ t("partner.addPoint") }}
                    </button>
                  </template>
                  <template v-slot:cell-bonus="{ }">
                    <span></span>
                  </template>
            </KTDatatable>
            </DataTableCard>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modals -->
  <!-- <ShopMoneyTransaction 
    v-if="selectedModal === 'ShopMoneyTransaction'" 
    :receiver="shop.receiver" 
    :type="shop.type"
    @refresh="getList" 
  />
  <PointMoneyTransfer 
    v-if="selectedModal === 'PointMoneyTransfer'" 
    :receiver="pointTransfer.receiver"
    :type="pointTransfer.type" 
    @refresh="getList" 
  /> -->
</template>
<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import moment from "moment";
import qs from "qs";
import ApiService from "@/services/ApiService";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import DateRangePicker from "@/components/kt-date/DateRangePicker.vue";
// import ShopMoneyTransaction from "@/components/partner/shop/ShopMoneyTransaction.vue";
// import PointMoneyTransfer from "@/components/partner/point/PointMoneyTransfer.vue";
import { useAppStore } from "@/stores/app";
import { useAuthStore } from "@/stores/auth";
import MemberTree from "@/components/partner/member/MemberTree.vue";
import DataTableCard from "@/components/ui/DataTableCard.vue";
import Swal from "sweetalert2";


export interface IData {
  createdAt: string;
  deposits: number;
  last_login: string;
  level: number;
  member: string;
  member_count: number;
  member_id: string;
  nickname: string;
  payment_collection: string;
  profit: number;
  sonic: number;
  wallet: number;
  wallet_point: number;
  winamt: number;
  withdrawals: number;
  shop_add: number;
  shop_deduct: number;
}

export interface DateRange {
  start: string;
  end: string;
}

export default defineComponent({
  name: "MemberList",
  components: {
    KTDatatable,
    DateRangePicker,
    // ShopMoneyTransaction,
    // PointMoneyTransfer,
    MemberTree,
    DataTableCard,
  },
  setup() {
    // vue variables
    const { t, n } = useI18n();
    const appStore = useAppStore();
    const authStore = useAuthStore();
    const openModal = (modal: string) => appStore.openModal(modal);
    const setActiveTab = (tab: string) => appStore.setTab(tab);
    const selectedModal = computed(() => appStore.activeModal);
    // table variables
    const tableData: any = ref<Array<IData>>([]);
    const tableHeaders = [
      {
        key: "member_count",
        name: t("partner.lowerUserCount"),
        text: true
      },
      {
        key: "level",
        name: t("partner.level"),
        customslot: true
      },
      {
        key: "member",
        name: t("partner.member"),
        customslot: true
      },
      {
        key: "createdAt",
        name: t("partner.regdate")
      },
      {
        key: "last_login",
        name: t("partner.lastLogin"),
        text: true
      },
      {
        key: "wallet",
        name: t("partner.wallet"),
        currency: true,
      },
      {
        key: "wallet_point",
        name: t("partner.walletPoint"),
        currency: true,
      },
      {
        key: "settle",
        name: t("partner.settle"),
        customslot: true,
      },
      {
        key: "slot_money",
        name: t("partner.slotMoney"),
        customslot: true,
      },
      {
        key: "point_transfer",
        name: t("partner.pointTransfer"),
        customslot: true,
      },
      {
        key: "deposits",
        name: t("partner.depAmount"),
        currency: true,
      },
      {
        key: "bonus",
        name: t("partner.depBonus"),
        customslot: true,
      },
      {
        key: "withdrawals",
        name: t("partner.widAmount"),
        currency: true,
      },
      {
        key: "sonic",
        name: t("partner.depWidProfit"),
        currency: true,
      },
      {
        key: "winamt",
        name: t("partner.winamount"),
        currency: true,
      },
      {
        key: "profit",
        name: t("partner.betProfit"),
        currency: true,
      },
    ];

    const searchType = ref("ID");
    const searchValue = ref("");
    const searchTypes = [
      { label: t("auth.ID"), value: "ID" },
      { label: t("partner.nickname"), value: "NICKNAME" },
    ];

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

    /**
     * Filters
     */
    let daterange = {
      start: moment().startOf("month").format("YYYY-MM-DD"),
      end: moment().format("YYYY-MM-DD"),
    };
    const setSelectedDate = (date: DateRange) => {
      daterange = date;
      getList();
    };

    /**
     * Get List
     *
     */
    const getList = async () => {
      const query = qs.stringify({
        start: daterange.start,
        end: daterange.end,
        type: searchType.value,
        typeval: searchValue.value,
      });

      const results = await ApiService.get(`/partner/members?${query}`)
        .then((res) => res.data)
        .catch(() => []);
      // add data
      tableData.value.splice(0, tableData.value.length, ...results);
      if (tableData.value.length > 0) {
        for (const row of tableData.value) {
          await new Promise(r => setTimeout(r, 100));
          const gameBalance = await ApiService.post(`/partner/member/game/balance/${row.member_id}`, {})
            .then((res) => res.data.balance)
          row.game_bal = gameBalance;
        }
      }
    };

    const slotMoney = async (memberId: string) => {
      await ApiService.post(`/partner/member/game/withdrawal/${memberId}`, {})
        .then(() => {
          Swal.fire(
            t(`partner.slotMoney`),
            t("notif.StoreMoneySuccess"),
            "success"
          );
          getList();
        })
        .catch((e) =>
          Swal.fire(
            t(`partner.slotMoney`),
            t(`notif.${e.response.data.message}`),
            "error"
          )
        );
    }

    const refreshWalletBalance = async (member_id: string) => {
      if (tableData.value.length > 0) {
        for (const row of tableData.value) {
          if (row.member_id === member_id) {
            const balance = await ApiService.get(`/partner/member/game/balance/${row.member_id}`)
            .then((res) => res.data.balance)

            if(balance !== 0) {
              row.wallet = balance;
            }
          }
        }
      }
    }

    const shop = ref({ receiver: { id: "", username: "", wallet: "" }, type: "" });
    const onShopTransact = (memberId: string, member: string, wallet: string, type: string) => {
      shop.value.receiver = { id: memberId, username: member, wallet: wallet };
      shop.value.type = type;

      openModal("ShopMoneyTransaction");
    };

    /**
     * Point Transfer
     *
     */
    const pointTransfer = ref({ receiver: { id: "", username: "" }, type: "" });
    const onPointTransfer = (memberId: string, member: string, type: string) => {
      pointTransfer.value.receiver = { id: memberId, username: member };
      pointTransfer.value.type = type;

      openModal("PointMoneyTransfer");
    };

    const onGameMoneyWithdraw = async (memberId: string) => {
      await ApiService.post(`/partner/member/game/withdrawal/${memberId}`, {
      })
        .then(() =>
          Swal.fire(
            t("partner.gameWid"),
            t("notif.GameWidSuccess"),
            "success"
          )
        )
        .catch((e) =>
          Swal.fire(
            t("partner.gameWid"),
            t("notif.GameWidFail"),
            "error"
          )
        );
    }

    return { 
      t, n,
      tableHeaders,
      tableData,
      searchType,
      searchTypes,
      searchValue,
      dateButtons,
      // Date Picker
      setSelectedDate,
      setActiveTab,
      daterange,
      openModal,
      selectedModal,
      getList,
      moment,
      // Shop Transaction
      onShopTransact,
      shop,
      // Point Transfer
      onPointTransfer,
      pointTransfer,
      authStore,
      onGameMoneyWithdraw,
      refreshWalletBalance,
      slotMoney
    };
  },
});
</script>
