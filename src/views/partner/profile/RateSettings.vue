<template>
  <div class="space-y-6 w-full">
    <!-- Header Section -->
    <PartnerPageHeader
      :title="t('partner.tab.rateSettings')"
      subtitle="Manage commission rates for different game types"
      icon="fas fa-percent"
      icon-color="purple-indigo"
    />

    <!-- KTDataTable -->
    <form @submit.prevent="updateRate">
      <div class="space-y-4">
        <KTDataTable
          :table-header="tableHeaders"
          :table-data="tableData || []"
          :rows-per-page="10"
          :enable-items-per-page-dropdown="false"
          :loading="!tableData"
        >
          <!-- Game Name Column -->
          <template v-slot:cell-game_name="{ row: game }">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg w-8 h-8 flex items-center justify-center">
                <i :class="getGameIcon(game.game_name)" class="text-white text-sm"></i>
              </div>
              <span class="text-white font-medium">{{ game.game_name }}</span>
            </div>
          </template>

          <!-- Point Type Column -->
          <template v-slot:cell-point_type="{ row: game }">
            <div class="text-center">
              <span class="text-gray-300">{{ game.point_type === 1 ? "단폴" : "다폴" }}</span>
            </div>
          </template>

          <!-- Order Column -->
          <template v-slot:cell-no="{ row: game }">
            <div class="text-center">
              <span class="text-gray-300">{{ game.no }}</span>
            </div>
          </template>

          <!-- Current Rolling Column -->
          <template v-slot:cell-type_rolling="{ row: game }">
            <div class="text-center">
                {{ t("partner.rollingType." + userdata.type_roll) }}
              </div>
          </template>

          <!-- Settings Value Column -->
          <template v-slot:cell-rolling="{ row: game }">
            <div class="flex items-center justify-center">
              <div class="relative">
                <input
                  v-if="authStore.user.id !== member_id"
                  v-model="rates.rolling[game.idx]"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  class="w-20 bg-white/10 border border-white/20 rounded text-white text-center px-2 py-1 focus:border-blue-500 focus:outline-none text-sm"
                  placeholder="0.0"
                />
                <div
                  v-else
                  class="w-20 bg-white/5 border border-white/10 rounded text-white text-center px-2 py-1 text-sm"
                >
                  {{ game.rolling }}
                </div>
              </div>
            </div>
          </template>
        </KTDataTable>

        <!-- Submit Button -->
        <div class="flex justify-end pt-4">
          <button
            v-if="authStore.user.id !== member_id"
            type="submit"
            :disabled="isSubmitting"
            class="inline-flex items-center px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <i v-if="isSubmitting" class="fas fa-spinner fa-spin mr-2"></i>
            <i v-else class="fas fa-save mr-2"></i>
            {{ t("partner.changeRate") }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import Swal from "sweetalert2";
import { useAuthStore } from "@/stores/auth";
import ApiService from "@/services/ApiService";
import KTDataTable from "@/components/kt-datatable/KTDataTable.vue";
import type { TableHeader } from "@/components/kt-datatable/types";
import DateRangePicker from "@/components/kt-date/DateRangePicker.vue";
import PartnerPageHeader from "@/components/partner/PartnerPageHeader.vue";

interface IData {
  idx: number;
  game_name: string;
  point_type: number;
  no: string;
  losing: number;
  rolling: number;
}

export default defineComponent({
  name: "RateSettings",
  components: {
    KTDataTable,
    DateRangePicker,
    PartnerPageHeader,
  },
  props: {
    userdata: {
      type: Object,
      required: true,
    },
  },
  emits: ["refresh"],
  setup(props, { emit }) {
    // vue variables
    const { t } = useI18n();
    const route = useRoute();
    const authStore = useAuthStore();

    // Get member_id from URL path parameter
    const member_id = computed(() => route.params.memberId as string);
    const isSubmitting = ref(false);

    const tableData: any = ref<Array<IData>>();

    watch(
      () => props.userdata,
      () => {
        setTableData();
      },
      { deep: true }
    );

    const setTableData = () => {
      tableData.value = [
        {
          idx: 0,
          game_name: t("header.Casino"),
          point_type: 1,
          no: "#1",
          losing: props.userdata.pct_lose_casino,
          rolling: props.userdata.pct_roll_casino,
        },
        {
          idx: 1,
          game_name: t("header.Slot"),
          point_type: 2,
          no: "#2",
          losing: props.userdata.pct_lose_slot,
          rolling: props.userdata.pct_roll_slot,
        },
        {
          idx: 2,
          game_name: t("header.Hotel"),
          point_type: 3,
          no: "#3",
          losing: props.userdata.pct_lose_hotel,
          rolling: props.userdata.pct_roll_hotel,
        },
        {
          idx: 3,
          game_name: t("header.Sport"),
          point_type: 4,
          no: "#4",
          losing: props.userdata.pct_lose_sport,
          rolling: props.userdata.pct_roll_sport,
        },
      ];
    };

    const tableHeaders: TableHeader[] = [
      {
        key: "game_name",
        name: t("partner.game"),
        customslot: true,
      },
      {
        key: "point_type",
        name: t("partner.points"),
        customslot: true,
      },
      {
        key: "no",
        name: "#",
        customslot: true,
      },
      {
        key: "type_rolling",
        name: t("partner.rollType"),
        customslot: true,
      },
      {
        key: "rolling",
        name:  t("partner.rolling"),
        customslot: true,
      },
    ];

    const rates = ref({
      rolling: [
        props.userdata.pct_roll_casino,
        props.userdata.pct_roll_slot,
        props.userdata.pct_roll_hotel,
        props.userdata.pct_roll_sport,
      ],
      losing: [0, 0, 0, 0],
    });

    // Get game icon based on game name
    const getGameIcon = (gameName: string) => {
      const icons: Record<string, string> = {
        [t("header.Casino")]: "fas fa-coins",
        [t("header.Slot")]: "fas fa-gamepad",
        [t("header.Hotel")]: "fas fa-building",
        [t("header.Sport")]: "fas fa-futbol",
      };
      return icons[gameName] || "fas fa-dice";
    };

    /**
     * Update Rate
     *
     */
     const updateRate = async () => {
      // if (!rates.value?.rolling || !rates.value?.losing) {
      //   Swal.fire(t("partner.changeRate"), t("notif.INVALID_RATE"), "error");
      //   return;
      // }
      if (rates.value?.rolling[0] && rates.value.rolling[0] < 0) {
        Swal.fire(t("partner.changeRate"), t("notif.INVALID_RATE"), "error");
        return;
      }
      if (rates.value?.rolling[1] && rates.value.rolling[1] < 0) {
        Swal.fire(t("partner.changeRate"), t("notif.INVALID_RATE"), "error");
        return;
      }
      if (rates.value?.losing[0] && rates.value.losing[0] < 0) {
        Swal.fire(t("partner.changeRate"), t("notif.INVALID_RATE"), "error");
        return;
      }
      if (rates.value?.losing[1] && rates.value.losing[1] < 0) {
        Swal.fire(t("partner.changeRate"), t("notif.INVALID_RATE"), "error");
        return;
      }
      await ApiService.patch(`/partner/member/rate/${member_id.value}`, {
        pct_roll_casino: rates.value.rolling[0],
        pct_roll_slot: rates.value.rolling[1],
        pct_lose_casino: rates.value.losing[0],
        pct_lose_slot: rates.value.losing[1],

        pct_roll_hotel: rates.value.rolling[2],
        pct_roll_sport:0,
        pct_lose_hotel: rates.value.losing[2],
        pct_lose_sport: 0,
      })
        .then(() => {
          Swal.fire(
            t("partner.changeRate"),
            t("partner.changeRateSuccess"),
            "success"
          );
          setTimeout(() => {
            emit("refresh");
          }, 1000);
        }

        )
        .catch((e) =>
          Swal.fire(
            t("partner.changeRate"),
            t("partner." + e.response.data.message),
            "error"
          )
        );

    };

    onMounted(() => {
      setTableData();
    });

    return {
      t,
      tableHeaders,
      tableData,
      rates,
      updateRate,
      authStore,
      member_id,
      isSubmitting,
      getGameIcon,
    };
  },
});
</script>

<style scoped>
/* Enhanced card hover effects */
.hover\:shadow-xl:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Custom input focus effects */
input:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Animation for form submission */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Enhanced button effects */
button:hover {
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}

/* Custom scrollbar for webkit browsers */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* Gradient animation */
@keyframes gradient-shift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}
</style>
