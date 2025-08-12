<template>
  <div class="space-y-6 w-full">
    <!-- Header Section -->
    <PartnerPageHeader
      :title="t('deposit.coupon')"
      subtitle="Manage member coupons and bonuses"
      icon="fas fa-ticket-alt"
      icon-color="purple-indigo"
    />

    <!-- Filter Section -->
    <div class="p-4">
      <div class="flex items-center justify-end gap-4">
        <div class="flex items-center gap-2">
          <label class="text-white text-sm font-medium whitespace-nowrap"> 검색키 </label>
          <select
            v-model="searchType"
            class="bg-white/10 border border-white/20 rounded-lg text-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none min-w-[120px]"
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
        <button
          @click="getList"
          class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200 text-sm"
        >
          <i class="fas fa-search mr-2"></i>
          {{ t("search") }}
        </button>
      </div>
    </div>
    <!-- Coupons Table -->

    <div class="w-full px-4 pb-6">
      <DataTableCard
        title=""
        subtitle=""
        :record-count="tableData.length"
        icon="fas fa-dice"
        icon-color="#ef4444"
      >
        <KTDatatable
          :tableHeader="tableHeaders"
          :tableData="tableData"
          :rowsPerPage="50"
        />
      </DataTableCard>
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
import PartnerPageHeader from "@/components/partner/PartnerPageHeader.vue";

interface IData {
  coupon_name: string;
  amount: number;
  expiration: string;
  used_date: string;
  how_to_use: string;
  req_status: number;
  status: number;
}

interface DateRange {
  start: string;
  end: string;
}

export default defineComponent({
  name: "Coupons",
  components: {
    KTDatatable,
    DateRangePicker,
    PartnerPageHeader,
  },
  props: {
    member_id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    // vue variables
    const { t } = useI18n();
    // table variables
    const tableData: any = ref<Array<IData>>([]);
    const tableHeaders = [
      {
        key: "coupon_name",
        name: t("partner.couponName"),
      },
      {
        key: "amount",
        name: t("transactionHistory.columns.amount"),
      },
      {
        key: "expiration",
        name: t("partner.couponExpired"),
      },
      {
        key: "used_date",
        name: t("partner.usedDate"),
      },
      {
        key: "how_to_use",
        name: t("partner.howToUse"),
      },
      {
        key: "req_status",
        name: t("partner.reqStatus"),
      },
      {
        key: "status",
        name: t("partner.status"),
      },
    ];
    const searchTypes = [
      { label: "전체", value: "0" },
      { label: "사용가능", value: "1" },
      { label: "사용완료", value: "2" },
      { label: "기간만료", value: "3" },
      { label: "회수", value: "4" },
    ];
    const searchType = ref(0);

    /**
     * Get List
     *
     */
    const getList = async () => {
      const results = await ApiService.get(`/tran/coupons/${props.member_id}`)
        .then((res) => res.data)
        .catch(() => []);
      // add data
      tableData.value.splice(0, tableData.value.length, ...results);
    };

    /**
     * On Mounted
     *
     */
    onMounted(() => {
      // get user data
      getList();
    });

    return {
      t,
      tableHeaders,
      tableData,
      searchTypes,
      searchType,
      getList,
    };
  },
});
</script>

<style scoped>
button {
  border-radius: 5px !important;
}
</style>
