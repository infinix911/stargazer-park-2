<template>
  <!-- Page Header -->
  <PartnerPageHeader
    :title="t('partnerMenu.member')"
    subtitle="Member Management and Analytics"
    icon="fas fa-users"
    icon-color="green-blue"
  />

  <div class="max-w-[1800px] mx-auto">
    <!-- Controls Section -->
    <div class="w-full mx-auto px-4 py-6">
      <div
        class="flex flex-col lg:flex-row gap-4 items-stretch lg:items-end lg:justify-between w-full"
      >
        <!-- Add Member Button - Left Side -->
        <div class="flex justify-center lg:justify-start items-end">
          <button
            @click="openModal('AddSubMember')"
            class="px-6 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg h-[40px] w-full sm:w-auto"
          >
            <i class="fas fa-user-plus mr-2"></i>
            {{ t("partner.tab.addSubMember") }}
          </button>
        </div>

        <!-- Search Controls - Right Side -->
        <div
          class="flex flex-col sm:flex-row lg:flex-row gap-3 items-stretch sm:items-end lg:items-end"
        >
          <!-- Search Type -->
          <div class="w-full sm:w-32 lg:w-32">
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
          <div class="w-full sm:w-48 lg:w-48">
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
              v-model="dateRange"
              initial="month"
            />
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
              @click="getList"
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
    </div>

    <!-- Content Area -->
    <div class="relative z-10 pb-6">
      <div class="w-full mx-auto px-2">
        <div class="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <!-- Member Tree Sidebar -->
          <div class="xl:col-span-1">
            <div
              class="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden"
            >
              <div
                class="px-6 py-4 border-b border-white/10 bg-gradient-to-r from-white/5 to-white/10"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-purple-500/20 rounded-lg">
                      <i class="fas fa-sitemap text-purple-400 text-sm"></i>
                    </div>
                    <div>
                      <h2 class="text-lg font-semibold text-white">Member Tree</h2>
                      <p class="text-xs text-gray-400">Organization Structure</p>
                    </div>
                  </div>

                  <!-- Mobile Accordion Toggle -->
                  <div class="lg:hidden">
                    <button
                      @click="toggleMemberTreeAccordion"
                      class="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <i
                        class="fas fa-chevron-down transition-transform duration-200"
                        :class="{
                          'rotate-180': isMemberTreeExpanded,
                        }"
                      ></i>
                    </button>
                  </div>
                </div>

                <!-- Add Accordion in Mobile -->
              </div>
              <div class="p-4" :class="{ hidden: !isMemberTreeExpanded }">
                <MemberTree />
              </div>
            </div>
          </div>

          <!-- Member Table -->
          <div class="xl:col-span-3">
            <DataTableCard
              :title="t('partnerMenu.memberList')"
              subtitle="Members Management"
              :record-count="tableData.length"
              icon="fas fa-users"
              icon-color="#3b82f6"
              :loading="loading"
            >
              <!-- Desktop Table -->
              <div class="hidden lg:block">
                <KTDatatable
                  :tableHeader="tableHeaders"
                  :tableData="tableData"
                  :rowsPerPage="50"
                  :loading="loading"
                >
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
                    <div
                      v-if="data.shoplevel === 2 && data.member_id !== authStore.user.id"
                      class="flex gap-1"
                    >
                      <button
                        type="button"
                        class="px-3 py-2 text-xs font-medium bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border border-green-400/30 whitespace-nowrap"
                        @click="
                          onShopTransact(data.member_id, data.member, data.wallet, 'ADD')
                        "
                      >
                        <i class="fas fa-plus mr-1.5"></i>
                        {{ t("partner.add") }}
                      </button>
                      <button
                        type="button"
                        class="px-3 py-2 text-xs font-medium bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border border-red-400/30 whitespace-nowrap"
                        @click="
                          onShopTransact(
                            data.member_id,
                            data.member,
                            data.wallet,
                            'DEDUCT'
                          )
                        "
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
                      <div v-if="data.game_bal" class="text-white">
                        {{ n(Number(data.game_bal)) }}
                      </div>
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
                  <template v-slot:cell-bonus="{}">
                    <span></span>
                  </template>
                  <!-- Member -->
                  <template v-slot:cell-member="{ row: data }">
                    <button
                      @click="openMemberPopup(data)"
                      class="text-left text-blue-400 hover:text-blue-300 cursor-pointer transition-colors"
                    >
                      {{ data.member }}
                    </button>
                  </template>
                </KTDatatable>
              </div>

              <!-- Mobile Cards -->
              <div class="lg:hidden space-y-4">
                <!-- Loading State -->
                <MobileLoadingSkeleton v-if="loading" :count="3" />

                <!-- Empty State -->
                <div v-else-if="tableData.length === 0" class="text-center py-12">
                  <div
                    class="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <i class="fas fa-users text-white/40 text-2xl"></i>
                  </div>
                  <p class="text-white/60 text-sm">{{ t("common.noDataFound") }}</p>
                </div>

                <!-- Member Cards -->
                <div
                  v-else
                  v-for="member in tableData"
                  :key="member.member_id"
                  class="mt-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-200"
                >
                  <!-- First Row: member_count, level, member, createdAt -->
                  <div
                    class="flex items-center justify-between mb-4 pb-3 border-b border-white/10"
                  >
                    <div class="flex items-center gap-3">
                      <div
                        class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500/5 rounded-lg flex items-center justify-center"
                      >
                        <i class="fas fa-user text-white text-sm"></i>
                      </div>
                      <div>
                        <div class="flex items-center gap-2">
                          <button
                            @click="openMemberPopup(member)"
                            class="text-sm font-semibold text-blue-400 hover:text-blue-300 cursor-pointer transition-colors text-left hover:underline"
                          >
                            {{ member.member }}
                          </button>
                          <span
                            class="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full"
                            >{{ t(`partner.level${member.level}`) }}</span
                          >
                        </div>
                        <div class="flex items-center gap-2 text-xs text-gray-400">
                          <span
                            >{{ t("partner.lowerUserCount") }}:
                            {{ member.member_count }}</span
                          >
                          <span>•</span>
                          <span class="text-gray-400">{{ t("partner.nickname") }}</span>
                          <span class="text-gray-300">{{ member.nickname || "-" }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Second Row: wallet, wallet_point -->
                  <div
                    class="flex items-center justify-between pb-3 border-b border-white/10 w-full"
                  >
                    <div class="flex justify-between gap-4 w-full">
                      <div class="flex items-center gap-2">
                        <span class="text-xs text-gray-400">{{
                          t("partner.wallet")
                        }}</span>
                        <div class="inline-flex items-center gap-2">
                          <span class="text-sm font-bold text-white">{{
                            n(Number(member.wallet))
                          }}</span>
                          <button
                            type="button"
                            class="p-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                            @click="refreshWalletBalance(member.member_id)"
                          >
                            <i class="fas fa-sync-alt"></i>
                          </button>
                        </div>
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="text-xs text-gray-400">{{
                          t("partner.walletPoint")
                        }}</span>
                        <span class="text-sm font-bold text-yellow-300">{{
                          n(Number(member.wallet_point))
                        }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Third Row: slot_money, slot_money -->
                  <div
                    class="grid grid-cols-3 gap-2 mb-4 pb-3 border-b border-white/10 pt-3"
                  >
                    <!-- Settle Actions -->
                    <div class="space-y-3">
                      <div class="text-right">
                        <span class="text-xs text-gray-400 text-nowrap">{{
                          t("partner.settle")
                        }}</span>
                        <div
                          v-if="
                            member.shoplevel === 2 &&
                            member.member_id !== authStore.user.id
                          "
                          class="flex flex-col gap-1 mt-1 justify-end"
                        >
                          <button
                            type="button"
                            class="px-2 py-1 text-xs font-medium bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white rounded shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border border-green-400/30"
                            @click="
                              onShopTransact(
                                member.member_id,
                                member.member,
                                member.wallet.toString(),
                                'ADD'
                              )
                            "
                          >
                            <i class="fas fa-plus mr-1"></i>
                            {{ t("partner.add") }}
                          </button>
                          <button
                            type="button"
                            class="px-2 py-1 text-xs font-medium bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white rounded shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border border-red-400/30"
                            @click="
                              onShopTransact(
                                member.member_id,
                                member.member,
                                member.wallet.toString(),
                                'DEDUCT'
                              )
                            "
                          >
                            <i class="fas fa-minus mr-1"></i>
                            {{ t("partner.subtract") }}
                          </button>
                        </div>
                      </div>
                    </div>
                    <!-- Slot Money -->
                    <div class="space-y-2">
                      <div class="text-center">
                        <span class="text-xs text-gray-400">{{
                          t("partner.slotMoney")
                        }}</span>
                        <div
                          v-if="member.wallet_game && member.wallet_game > 0"
                          class="mt-1"
                        >
                          <button
                            type="button"
                            class="h-[26px] px-3 py-1 text-xs font-medium bg-green-500 hover:bg-green-600 text-white rounded shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border border-green-400/30"
                            @click="slotMoney(member.member_id)"
                          >
                            <i class="fas fa-check-circle mr-1"></i>
                            {{ t("partner.slotButton") }}
                          </button>
                          <div class="text-sm font-bold text-white mt-1">
                            {{ n(Number(member.wallet_game)) }}
                          </div>
                        </div>
                        <div v-else class="text-xs text-gray-500 mt-1">-</div>
                      </div>
                    </div>

                    <!-- Point Transfer -->
                    <div class="space-y-2">
                      <div class="text-center">
                        <span class="text-xs text-gray-400">{{
                          t("partner.pointTransfer")
                        }}</span>
                        <div class="mt-1">
                          <button
                            type="button"
                            class="px-3 w-full py-1 text-xs font-medium bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white rounded shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border border-blue-400/30"
                            @click="
                              onPointTransfer(member.member_id, member.member, 'ADD')
                            "
                          >
                            <i class="fas fa-exchange-alt mr-1"></i>
                            {{ t("partner.addPoint") }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Expand Button -->
                  <div class="flex justify-center">
                    <button
                      @click="toggleMemberExpand(member.member_id)"
                      class="flex justify-center items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 text-gray-300 hover:text-white"
                    >
                      <span class="text-xs">{{
                        expandedMembers.includes(member.member_id)
                          ? t("common.showLess")
                          : t("common.showMore")
                      }}</span>
                      <i
                        class="fas fa-chevron-down transition-transform text-xs"
                        :class="{
                          'rotate-180': expandedMembers.includes(member.member_id),
                        }"
                      ></i>
                    </button>
                  </div>

                  <!-- Expandable Details: Fourth Row Data -->
                  <div
                    v-if="expandedMembers.includes(member.member_id)"
                    class="mt-4 pt-4 border-t border-white/10 animate-in slide-in-from-top duration-200"
                  >
                    <!-- Fourth Row: deposits, bonus, withdrawals, sonic, winamt, profit -->
                    <div class="grid grid-cols-2 gap-4">
                      <!-- Money Details -->
                      <div class="space-y-3">
                        <div class="flex items-center justify-between text-sm">
                          <span class="text-gray-400">{{ t("partner.depAmount") }}</span>
                          <span class="text-white font-medium">{{
                            n(Number(member.deposits || 0))
                          }}</span>
                        </div>
                        <div class="flex items-center justify-between text-sm">
                          <span class="text-gray-400">{{ t("partner.depBonus") }}</span>
                          <span class="text-white font-medium">{{
                            n(Number(member.bonus || 0))
                          }}</span>
                        </div>
                        <div class="flex items-center justify-between text-sm">
                          <span class="text-gray-400">{{ t("partner.widAmount") }}</span>
                          <span class="text-white font-medium">{{
                            n(Number(member.withdrawals || 0))
                          }}</span>
                        </div>
                      </div>

                      <!-- Profit & Win Details -->
                      <div class="space-y-3">
                        <div class="flex items-center justify-between text-sm">
                          <span class="text-gray-400">{{
                            t("partner.depWidProfit")
                          }}</span>
                          <span class="text-white font-medium">{{
                            n(Number(member.sonic || 0))
                          }}</span>
                        </div>
                        <div class="flex items-center justify-between text-sm">
                          <span class="text-gray-400">{{ t("partner.winamount") }}</span>
                          <span class="text-white font-medium">{{
                            n(Number(member.winamt || 0))
                          }}</span>
                        </div>
                        <div class="flex items-center justify-between text-sm">
                          <span class="text-gray-400">{{ t("partner.betProfit") }}</span>
                          <span
                            class="text-sm font-bold"
                            :class="
                              member.profit >= 0 ? 'text-green-400' : 'text-red-400'
                            "
                          >
                            {{ Number(member.profit) >= 0 ? "+" : ""
                            }}{{ n(Number(member.profit || 0)) }}
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- Additional Member Info -->
                    <div class="mt-4 pt-3 border-t border-white/10">
                      <div class="grid grid-cols-2 gap-4 text-xs">
                        <div class="flex items-center justify-between">
                          <span class="text-gray-400">{{ t("partner.regdate") }}</span>
                          <span class="text-gray-300">{{
                            member.createdAt &&
                            member.createdAt !== "null" &&
                            member.createdAt !== "undefined"
                              ? moment(member.createdAt).format("MM/DD/YYYY HH:mm")
                              : "-"
                          }}</span>
                        </div>
                        <div class="flex items-center justify-between">
                          <span class="text-gray-400">{{ t("partner.lastLogin") }}</span>
                          <span>{{
                            member.last_login
                              ? moment(member.last_login).format("MM/DD/YYYY HH:mm")
                              : "-"
                          }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DataTableCard>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modals -->
  <ShopMoneyTransactionModal
    v-if="selectedModal === 'ShopMoneyTransaction'"
    :receiver="shop.receiver"
    :type="shop.type"
    @refresh="getList"
  />

  <!-- Add Sub Member Modal -->
  <AddSubMember
    v-if="selectedModal === 'AddSubMember'"
    @close="closeModal"
    @refresh="getList"
  />

  <PointMoneyTransfer
    v-if="selectedModal === 'PointMoneyTransfer'"
    :receiver="pointTransfer.receiver"
    :type="pointTransfer.type"
    @refresh="getList"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import moment from "moment";
import qs from "qs";
import ApiService from "@/services/ApiService";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import DateRangePicker from "@/components/kt-date/DateRangePicker.vue";
import ShopMoneyTransactionModal from "@/components/partner/ShopMoneyTransactionModal.vue";
import PointMoneyTransfer from "@/components/partner/PointMoneyTransfer.vue";
import { useAppStore } from "@/stores/app";
import { useAuthStore } from "@/stores/auth";
import MemberTree from "@/components/partner/member/MemberTree.vue";
import DataTableCard from "@/components/ui/DataTableCard.vue";
import AddSubMember from "@/views/partner/profile/AddSubMember.vue";
import Swal from "sweetalert2";
import PartnerPageHeader from "@/components/partner/PartnerPageHeader.vue";
import MobileLoadingSkeleton from "@/components/ui/MobileLoadingSkeleton.vue";

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
  game_bal?: number;
  wallet_game?: number;
  shoplevel?: number;
  bonus?: number;
}

export interface DateRange {
  start: string;
  end: string;
}

// Composables
const { t, n } = useI18n();
const appStore = useAppStore();
const authStore = useAuthStore();

// Computed
const selectedModal = computed(() => appStore.activeModal);

// Mobile state
const expandedMembers = ref<string[]>([]);
const isMemberTreeExpanded = ref(true); // Start expanded on mobile

// Loading state
const loading = ref(false);

// Methods
const openModal = (modal: string) => appStore.openModal(modal);
const closeModal = () => appStore.openModal("");
const setActiveTab = (tab: string) => appStore.setTab(tab);

// Table data
const tableData = ref<Array<IData>>([]);
const tableHeaders = [
  {
    key: "member_count",
    name: t("partner.lowerUserCount"),
    text: true,
  },
  {
    key: "level",
    name: t("partner.level"),
    customslot: true,
  },
  {
    key: "member",
    name: t("partner.member"),
  },
  {
    key: "createdAt",
    name: t("partner.regdate"),
  },
  {
    key: "last_login",
    name: t("partner.lastLogin"),
    text: true,
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
  { label: t("login.id"), value: "ID" },
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

// Date range (reactive, two-way bind with DateRangePicker)
const dateRange = ref({
  start: moment().startOf("month").format("YYYY-MM-DD"),
  end: moment().format("YYYY-MM-DD"),
});

const setSelectedDate = (date: DateRange) => {
  if (dateRange.value.start !== date.start || dateRange.value.end !== date.end) {
    dateRange.value.start = date.start;
    dateRange.value.end = date.end;
  }
};

// Get List
const getList = async () => {
  try {
    loading.value = true;
    const query = qs.stringify({
      start: dateRange.value.start,
      end: dateRange.value.end,
      type: searchType.value,
      typeval: searchValue.value,
    });

    const results = await ApiService.get(`/partner/members?${query}`)
      .then((res) => res.data)
      .catch(() => []);

    tableData.value.splice(0, tableData.value.length, ...results);

    if (tableData.value.length > 0) {
      for (const row of tableData.value) {
        await new Promise((r) => setTimeout(r, 100));
        const gameBalance = await ApiService.post(
          `/partner/member/game/balance/${row.member_id}`,
          {}
        ).then((res) => res.data.balance);
        row.game_bal = gameBalance;
      }
    }
  } catch (error) {
    console.error("Error fetching members:", error);
  } finally {
    loading.value = false;
  }
};

// Auto-refresh list when dateRange changes (align with Dashboard.vue)
watch(
  dateRange,
  (newVal, oldVal) => {
    if (newVal.start !== oldVal.start || newVal.end !== oldVal.end) {
      getList();
    }
  },
  { deep: true }
);

const slotMoney = async (memberId: string) => {
  await ApiService.post(`/partner/member/game/withdrawal/${memberId}`, {})
    .then(() => {
      Swal.fire(t(`partner.slotMoney`), t("notif.StoreMoneySuccess"), "success");
      getList();
    })
    .catch((e) =>
      Swal.fire(t(`partner.slotMoney`), t(`notif.${e.response.data.message}`), "error")
    );
};

const refreshWalletBalance = async (member_id: string) => {
  if (tableData.value.length > 0) {
    for (const row of tableData.value) {
      if (row.member_id === member_id) {
        const balance = await ApiService.get(
          `/partner/member/game/balance/${row.member_id}`
        ).then((res) => res.data.balance);

        if (balance !== 0) {
          row.wallet = balance;
        }
      }
    }
  }
};

const shop = ref<{
  receiver: { id: string; username: string; wallet: string };
  type: "ADD" | "DEDUCT";
}>({
  receiver: { id: "", username: "", wallet: "" },
  type: "ADD",
});

const onShopTransact = (
  memberId: string,
  member: string,
  wallet: string,
  type: "ADD" | "DEDUCT"
) => {
  shop.value.receiver = { id: memberId, username: member, wallet: wallet };
  shop.value.type = type;
  openModal("ShopMoneyTransaction");
};

const openMemberPopup = (memberData: any) => {
  // Open member popup in a new window for both desktop and mobile
  const popupWindow = window.open(
    `/partner/member/${memberData.member_id}`,
    `member_${memberData.member_id}`,
    "width=1000,height=700,scrollbars=yes,resizable=yes,menubar=no,toolbar=no,location=no,status=no,centerscreen=yes"
  );

  // Focus the new window
  if (popupWindow) {
    popupWindow.focus();
  } else {
    // If popup is blocked, show a message to the user
    Swal.fire({
      icon: "warning",
      title: t("common.popupBlocked"),
      text: t("common.popupBlockedMessage"),
      confirmButtonText: t("common.ok"),
    });
  }
};

// Mobile helpers
const toggleMemberExpand = (memberId: string) => {
  console.log("toggleMemberExpand called with:", memberId);
  console.log("Current expandedMembers:", expandedMembers.value);

  const index = expandedMembers.value.indexOf(memberId);
  if (index > -1) {
    expandedMembers.value.splice(index, 1);
    console.log("Removed member, new array:", expandedMembers.value);
  } else {
    expandedMembers.value.push(memberId);
    console.log("Added member, new array:", expandedMembers.value);
  }
};

const toggleMemberTreeAccordion = () => {
  isMemberTreeExpanded.value = !isMemberTreeExpanded.value;
};

// Point Transfer
const pointTransfer = ref({
  receiver: { id: "", username: "" },
  type: "ADD" as "ADD" | "SUBTRACT",
});
const onPointTransfer = (memberId: string, member: string, type: "ADD" | "SUBTRACT") => {
  pointTransfer.value.receiver = { id: memberId, username: member };
  pointTransfer.value.type = type;
  openModal("PointMoneyTransfer");
};

const onGameMoneyWithdraw = async (memberId: string) => {
  await ApiService.post(`/partner/member/game/withdrawal/${memberId}`, {})
    .then(() => Swal.fire(t("partner.gameWid"), t("notif.GameWidSuccess"), "success"))
    .catch((e) => Swal.fire(t("partner.gameWid"), t("notif.GameWidFail"), "error"));
};

// Initialize
getList();
</script>
