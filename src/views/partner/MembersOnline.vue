<template>
  <!-- Page Header -->
  <PartnerPageHeader 
    :title="t('partnerMenu.memberOnline')"
    subtitle="Currently active members and their session details"
    icon="fas fa-circle"
    icon-color="green-blue"
  />

  <div class="max-w-[1500px] mx-auto">
    <!-- Controls Section -->
    <div class="w-full mx-auto px-4 py-6">
      <div class="flex items-end justify-end">
        <button
          @click="getList"
          class="px-6 py-2 rounded-lg text-xs font-semibold text-black bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-300 hover:to-emerald-400 transition-all duration-200 hover:scale-105 shadow-lg"
        >
          <i class="fas fa-sync-alt mr-1"></i>
          Refresh
        </button>
      </div>
    </div>

    <!-- Data Table Section -->
    <div class="max-w-[1500px] mx-auto px-2 pb-6">
      <DataTableCard
        :title="t('partnerMenu.memberOnline')"
        subtitle="Currently active members and their session details"
        :record-count="tableData.length"
        icon="fas fa-circle"
        icon-color="#10b981"
      >
        <KTDatatable :tableHeader="tableHeaders" :tableData="tableData" :rowsPerPage="50">
              <template v-slot:cell-location="{ row: data }">
                <div class="text-center">
                  <a
                    :href="`https://whatismyipaddress.com/ip/${data.last_ip}`"
                    target="_blank"
                    class="inline-flex items-center px-3 py-1 text-xs font-medium bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border border-blue-400/30 whitespace-nowrap"
                  >
                    <i class="fas fa-external-link-alt mr-1.5"></i>
                    {{ data.last_ip }}
                  </a>
                </div>
              </template>
              
              <template v-slot:cell-status="{ row: data }">
                <div class="text-center">
                  <span class="inline-flex items-center px-2 py-1 text-xs font-medium bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-lg border border-green-400/30">
                    <i class="fas fa-circle mr-1 text-green-300 animate-pulse"></i>
                    Online
                  </span>
                </div>
              </template>
        </KTDatatable>
      </DataTableCard>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import ApiService from "@/services/ApiService";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import DataTableCard from "@/components/ui/DataTableCard.vue";

export interface IData {
  last_ip: string;
  last_login: string;
  level: number;
  member: string;
  member_id: string;
  name: string;
  wallet: number;
  wallet_game: number;
  wallet_point: number;
}

export default defineComponent({
  name: "MemberOnline",
  components: { 
    KTDatatable,
    DataTableCard,
  },
  setup() {
    const { t } = useI18n();
    const tableData = ref<IData[]>([]);
    
    const tableHeaders = [
      { key: "member", name: t("partner.member"), text: true },
      { key: "name", name: t("partner.nickname"), text: true },
      { key: "level", name: t("partner.level"), text: true },
      { key: "last_login", name: t("partner.lastLogin"), text: true },
      { key: "wallet", name: t("partner.wallet"), currency: true },
      { key: "wallet_point", name: t("partner.walletPoint"), currency: true },
      { key: "location", name: t("partner.ip"), customslot: true },
      { key: "status", name: t("partner.status"), customslot: true },
    ];

    const getList = async () => {
      try {
        const results = await ApiService.get(`/partner/members/online`)
          .then((res) => res.data)
          .catch(() => []);
        tableData.value.splice(0, tableData.value.length, ...results);
      } catch (error) {
        console.error('Failed to fetch online members:', error);
      }
    };

    onMounted(getList);

    return { tableHeaders, tableData, getList, t };
  },
});
</script>

<style scoped>
@import '@/assets/common-dashboard.css';
</style>