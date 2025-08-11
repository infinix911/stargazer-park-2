<template>
  <div class="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg p-3 border border-white/10">
    <!-- Header Section -->
    <div class="text-center mb-3">
      <!-- <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg mb-2">
        <i class="fas fa-user-circle text-white text-2xl"></i>
      </div> -->
      <h2 class="text-base font-bold text-white">
        [{{ t("partner.parent" + (userdata.depth || 0)) }}] {{ userdata.username }} / {{ userdata.name }}
      </h2>
    </div>

        <!-- Content Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2">
      <div 
        v-for="item in summaryItems" 
        :key="item.key"
        class="p-1.5 rounded flex items-center justify-between pr-[50%]"
      >
        <div class="flex items-center gap-1.5">
          <i :class="`fa-solid ${item.icon} ${item.iconColor} text-sm`"></i>
          <span class="text-gray-400 text-sm">{{ t(item.label) }}</span>
        </div>
        <div class="text-white font-medium text-sm">{{ item.value }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { IMember } from "@/interface/IMember";

interface Props {
  userdata: IMember
}

const props = defineProps<Props>()
const { t, n } = useI18n()

const summaryItems = computed(() => [
  {
    key: 'status',
    icon: 'fa-wifi',
    iconColor: 'text-blue-400',
    label: 'partner.status',
    value: props.userdata.status
  },
  {
    key: 'rate',
    icon: 'fa-star',
    iconColor: 'text-yellow-400',
    label: 'partner.rate',
    value: `${props.userdata.level}%`
  },
  {
    key: 'difference',
    icon: 'fa-user-plus',
    iconColor: 'text-green-400',
    label: 'partner.difference',
    value: props.userdata.tree
  },
  {
    key: 'money',
    icon: 'fa-dollar-sign',
    iconColor: 'text-green-400',
    label: 'partner.money',
    value: n(Number(props.userdata.wallet) || 0)
  },
  {
    key: 'point',
    icon: 'fa-plus-circle',
    iconColor: 'text-purple-400',
    label: 'partner.point',
    value: n(Number(props.userdata.wallet_point) || 0)
  },
  {
    key: 'totalDeposit',
    icon: 'fa-door-open',
    iconColor: 'text-blue-400',
    label: 'partner.totalDeposit',
    value: n(Number(props.userdata.deposits) || 0)
  },
  {
    key: 'totalWithdraw',
    icon: 'fa-door-open',
    iconColor: 'text-red-400',
    label: 'partner.totalWithdraw',
    value: n(Number(props.userdata.withdrawals) || 0)
  },
  {
    key: 'totalDepNWid',
    icon: 'fa-arrows-split-up-and-left',
    iconColor: 'text-orange-400',
    label: 'partner.totalDepNWid',
    value: n(Number(props.userdata.sonic) || 0)
  },
  {
    key: 'name',
    icon: 'fa-newspaper',
    iconColor: 'text-indigo-400',
    label: 'partner.name',
    value: props.userdata.name
  },
  {
    key: 'telNo',
    icon: 'fa-phone',
    iconColor: 'text-teal-400',
    label: 'partner.telNo',
    value: props.userdata.mobile
  }
])
</script>
  