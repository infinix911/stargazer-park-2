<template>
  <!-- Page Header -->
  <PartnerPageHeader
    v-if="member_id === undefined"
    :title="t('partnerMenu.transaction')"
    subtitle="Member deposit and withdrawal transaction history"
    icon="fas fa-exchange-alt"
    icon-color="blue-indigo"
  />

  <div class="max-w-[1500px] mx-auto">
    <!-- Controls Section -->
    <div class="w-full mx-auto px-4 py-6">
      <div class="flex items-end justify-end">
        <div class="flex flex-col lg:flex-row gap-4 items-stretch lg:items-end">
          <!-- Transaction Type -->
          <div class="flex-shrink-0">
            <label
              class="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide"
            >
              {{ t("partner.tranType") }}
            </label>
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

          <!-- Search Type -->
          <div v-if="member_id === undefined" class="flex-shrink-0">
            <label
              class="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide"
            >
              Search Type
            </label>
            <select
              v-model="searchType"
              class="w-32 bg-white/10 border border-white/20 rounded-lg text-white text-sm px-3 focus:border-blue-500 focus:outline-none"
              style="height: 40px"
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
          <div v-if="member_id === undefined" class="flex-shrink-0">
            <label
              class="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide"
            >
              Search Value
            </label>
            <input
              v-model="searchValue"
              type="text"
              class="w-48 bg-white/10 border border-white/20 rounded-lg text-white text-sm px-3 focus:border-blue-500 focus:outline-none placeholder-gray-400"
              style="height: 40px"
            />
          </div>

          <!-- Include Sub Members -->
          <div class="flex-shrink-0">
            <label
              class="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide"
            >
              Options
            </label>
            <div
              class="flex items-center bg-white/10 border border-white/20 rounded-lg px-3"
              style="height: 40px"
            >
              <input
                type="checkbox"
                id="include-sub-check"
                v-model="includeSub"
                class="mr-2 bg-white/10 border-white/20 text-blue-500 focus:ring-blue-500 focus:ring-2"
              />
              <label for="include-sub-check" class="text-white text-sm whitespace-nowrap">
                {{ t("partner.includeSub") }}
              </label>
            </div>
          </div>

          <!-- Date Range Picker -->
          <div class="flex-1 min-w-0 max-w-[300px]">
            <label
              class="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide"
            >
              Date Range
            </label>
            <DateRangePicker
              class="w-full date-picker-modern"
              @changedate="setSelectedDate"
              initial="month"
              style="height: 40px"
            />
          </div>

          <!-- Search Button -->
          <div class="flex gap-2 lg:min-w-0 lg:flex-shrink-0 items-end justify-end">
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

    <!-- Statistics Cards -->
    <div
      class="w-full px-4 pb-6"
      v-if="tranType === 'DEPOSIT' || tranType === 'WITHDRAW' || tranType === 'ALL'"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Total Deposits -->
        <div
          v-if="tranType === 'DEPOSIT' || tranType === 'ALL'"
          class="bg-gradient-to-r from-green-500/20 to-emerald-600/20 backdrop-blur-sm border border-green-500/30 rounded-xl p-6"
        >
          <div class="flex items-center gap-4">
            <div class="p-3 bg-green-500/30 rounded-lg">
              <i class="fas fa-arrow-down text-green-300 text-xl"></i>
            </div>
            <div>
              <h3 class="text-2xl font-bold text-white">{{ n(sums.deposits) }}</h3>
              <p class="text-sm text-gray-300">
                {{ t("partnerMenu.totalDepositAmount") }}
              </p>
            </div>
          </div>
        </div>

        <!-- Total Withdrawals -->
        <div
          v-if="tranType === 'WITHDRAW' || tranType === 'ALL'"
          class="bg-gradient-to-r from-red-500/20 to-rose-600/20 backdrop-blur-sm border border-red-500/30 rounded-xl p-6"
        >
          <div class="flex items-center gap-4">
            <div class="p-3 bg-red-500/30 rounded-lg">
              <i class="fas fa-arrow-up text-red-300 text-xl"></i>
            </div>
            <div>
              <h3 class="text-2xl font-bold text-white">{{ n(sums.withdrawals) }}</h3>
              <p class="text-sm text-gray-300">
                {{ t("partnerMenu.totalWithdrawalAmount") }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Table Section -->
    <div class="max-w-[1500px] mx-auto px-2 pb-6">
      <DataTableCard
        :title="t('partnerMenu.transaction')"
        subtitle="Transaction records and history"
        :record-count="tableData.length"
        icon="fas fa-exchange-alt"
        icon-color="#3b82f6"
      >
        <KTDatatable :tableHeader="tableHeaders" :tableData="tableData" :rowsPerPage="50">
          <!-- Transaction Type -->
          <template v-slot:cell-transaction_type="{ row: data }">
            <div class="text-center">
              <span
                v-if="data.transaction_type === 'DEPOSIT'"
                class="inline-flex items-center px-3 py-1 text-xs font-medium bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-lg border border-green-400/30"
              >
                <i class="fas fa-arrow-down mr-1"></i>
                {{ t("transactionHistory.types." + data.transaction_type.toLowerCase()) }}
              </span>
              <span
                v-else
                class="inline-flex items-center px-3 py-1 text-xs font-medium bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-full shadow-lg border border-red-400/30"
              >
                <i class="fas fa-arrow-up mr-1"></i>
                {{ t("transactionHistory.types." + data.transaction_type.toLowerCase()) }}
              </span>
            </div>
          </template>

          <!-- Amount -->
          <template v-slot:cell-depwid="{ row: data }">
            <div class="text-center">
              <span
                v-if="data.transaction_type === 'DEPOSIT'"
                class="inline-flex items-center px-3 py-1 text-xs font-medium bg-green-500/20 text-green-300 rounded-lg border border-green-500/30"
              >
                <i class="fas fa-plus mr-1"></i>
                {{ n(parseInt(data.amount_deposit)) }}
                <span v-if="data.amount_coupon > 0" class="ml-1 text-yellow-300">
                  (+{{ n(parseInt(data.amount_coupon)) }})
                </span>
              </span>
              <span
                v-else
                class="inline-flex items-center px-3 py-1 text-xs font-medium bg-red-500/20 text-red-300 rounded-lg border border-red-500/30"
              >
                <i class="fas fa-minus mr-1"></i>
                {{ n(parseInt(data.amount_withdraw)) }}
              </span>
            </div>
          </template>
        </KTDatatable>
      </DataTableCard>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useI18n } from "vue-i18n";
import moment from "moment";
import qs from "qs";
import ApiService from "@/services/ApiService";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import DateRangePicker from "@/components/kt-date/DateRangePicker.vue";
import DataTableCard from "@/components/ui/DataTableCard.vue";

interface IData {
  member_id: string;
  member: string;
  transaction_type: string;
  amount_deposit: number;
  amount_withdraw: number;
  amount_coupon: number;
  createdAt: string;
  updatedAt: string;
}

interface DateRange {
  start: string;
  end: string;
}

export default defineComponent({
  name: "Transactions",
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

    const tableData = ref<IData[]>([]);
    const tableHeaders = [
      { key: "member", name: t("partner.member"), text: true },
      { key: "transaction_type", name: t("partner.depWid"), customslot: true },
      { key: "depwid", name: t("partner.tranAmount"), customslot: true },
      { key: "createdAt", name: t("partner.reqDate"), text: true },
      { key: "updatedAt", name: t("partner.processDate"), text: true },
    ];

    const includeSub = ref(true);
    const tranType = ref("ALL");
    const tranTypes = [
      { label: t("partner.all"), value: "ALL" },
      { label: t("partner.deposit"), value: "DEPOSIT" },
      { label: t("partner.withdrawal"), value: "WITHDRAW" },
    ];

    const searchType = ref("ID");
    const searchValue = ref("");
    const searchTypes = [
      { label: t("login.id"), value: "ID" },
      { label: t("partner.nickname"), value: "NICKNAME" },
    ];

    const sums = ref({
      withdrawals: 0,
      deposits: 0,
    });

    let daterange = {
      start: moment().startOf("month").format("YYYY-MM-DD"),
      end: moment().format("YYYY-MM-DD"),
    };

    const setSelectedDate = (date: DateRange) => {
      daterange = date;
      getList();
    };

    const getList = async () => {
      try {
        let query = qs.stringify({
          start: daterange.start,
          end: daterange.end,
          trantype: tranType.value,
          type: searchType.value,
          typeval: searchValue.value,
          inclsub: includeSub.value,
        });

        if (props.member_id) {
          query = qs.stringify({
            start: daterange.start,
            end: daterange.end,
            trantype: tranType.value,
            type: searchType.value,
            typeval: searchValue.value,
            inclsub: includeSub.value,
            member_id: props.member_id,
          });
        }

        const results = await ApiService.get(`/partner/tran-history?${query}`)
          .then((res) => res.data)
          .catch(() => []);

        tableData.value.splice(0, tableData.value.length, ...results);
        getSums(results);
      } catch (error) {
        console.error("Failed to fetch transaction history:", error);
      }
    };

    const getSums = (results: Array<IData>) => {
      // Total Withdrawals
      sums.value.withdrawals = results.reduce(
        (total: number, obj) => Number(obj.amount_withdraw) + Number(total),
        0
      );
      sums.value.withdrawals *= -1;

      // Total Deposits
      sums.value.deposits = results.reduce(
        (total: number, obj) => Number(obj.amount_deposit) + Number(total),
        0
      );
    };

    return {
      tableHeaders,
      tableData,
      includeSub,
      tranType,
      tranTypes,
      searchType,
      searchTypes,
      searchValue,
      setSelectedDate,
      getList,
      sums,
      t,
      n,
    };
  },
});
</script>

<style scoped>
@import "@/assets/common-dashboard.css";
</style>
