<template>
  <div class="w-full">
    <!-- Transaction History Section -->
    <div class="py-2">
      <div class="max-w-[1660px] mx-auto px-4">
        <!-- Section Header -->
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-3xl font-black flex items-center space-x-4">
            <span class="text-white">{{ t('transactionHistory.title') }}</span>
          </h2>
        </div>

        <!-- Search/Filter Bar -->
        <div class="bg-slate-800/90 backdrop-blur-sm rounded-sm border border-slate-700 p-6 mb-6">
          <div class="flex flex-col lg:flex-row gap-4 items-center">
            <!-- Type Filter -->
            <div class="flex items-center space-x-2">
              <select
                v-model="filters.type"
                class="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">ALL</option>
                <option value="DEPOSIT">DEPOSIT</option>
                <option value="WITHDRAWAL">WITHDRAWAL</option>
              </select>
            </div>

            <!-- Search Button -->
            <button
              @click="fetchTransactions"
              class="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md text-white font-medium transition-colors shadow-lg"
            >
              {{ t('transactionHistory.search') }}
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="bg-slate-800/90 backdrop-blur-sm rounded-xl border border-slate-700 shadow-xl p-8">
          <div class="flex items-center justify-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            <span class="ml-3 text-slate-300">{{ t('common.loading') }}</span>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-slate-800/90 backdrop-blur-sm rounded-xl border border-slate-700 shadow-xl p-8">
          <div class="text-center text-red-400">
            <p>{{ error }}</p>
            <button 
              @click="fetchTransactions" 
              class="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              {{ t('common.retry') }}
            </button>
          </div>
        </div>

        <!-- Transaction Table -->
        <div v-else class="bg-slate-800/90 backdrop-blur-sm rounded-sm overflow-hidden border border-slate-700 shadow-xl">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-[#141722]">
                  <th 
                    v-for="header in table.getFlatHeaders()" 
                    :key="header.id"
                    class="px-6 py-6 text-center text-sm font-medium text-slate-200 border-b border-slate-600"
                  >
                    <div 
                      v-if="header.isPlaceholder" 
                      class="h-4"
                    />
                    <div
                      v-else
                      class="flex items-center justify-center"
                    >
                      {{ header.column.columnDef.header }}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="row in table.getRowModel().rows" 
                  :key="row.id"
                  class="border-b border-slate-600 hover:bg-slate-700/30 transition-colors"
                  :class="row.index % 2 === 0 ? 'bg-slate-800/30' : 'bg-slate-700/20'"
                >
                  <td 
                    v-for="cell in row.getVisibleCells()" 
                    :key="cell.id"
                    class="px-6 py-4 text-sm border-b border-slate-600 text-center text-slate-200"
                  >
                    <div 
                      v-if="cell.column.id === 'type'"
                      class="inline-block px-3 py-1 rounded-full text-xs font-medium"
                      :class="{
                        'bg-blue-600 text-white': cell.getValue() === 'DEPOSIT',
                        'bg-red-600 text-white': cell.getValue() === 'WITHDRAWAL'
                      }"
                    >
                      {{ getTypeTranslation(cell.getValue() as string) }}
                    </div>
                    <div 
                      v-else-if="cell.column.id === 'status'"
                      class="inline-block px-3 py-1 rounded-full text-xs font-medium"
                      :class="{
                        'bg-green-600 text-white': cell.getValue() === 2 || cell.getValue() === 3,
                        'bg-yellow-600 text-white': cell.getValue() === 0 || cell.getValue() === 1,
                        'bg-red-600 text-white': cell.getValue() === 4,
                        'bg-gray-600 text-white': cell.getValue() === 5
                      }"
                    >
                      {{ getStatusTranslation(cell.getValue() as number) }}
                    </div>
                    <div 
                      v-else-if="cell.column.id === 'amount'"
                      class="font-medium"
                      :class="{
                        'text-blue-600': row.original.type === 'DEPOSIT',
                        'text-red-600': row.original.type === 'WITHDRAWAL'
                      }"
                    >
                      {{ cell.getValue() ? (locale === 'ko' ? `₩${Number(cell.getValue()).toLocaleString()}` : Number(cell.getValue()).toLocaleString()) : (locale === 'ko' ? '₩0' : '0') }}
                    </div>
                    <div v-else class="text-slate-200">
                      {{ cell.getValue() }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- No Results Message -->
          <div v-if="transactions.length === 0" class="flex items-center justify-center py-12">
            <p class="text-slate-300 text-lg">{{ t('transactionHistory.noResults') }}</p>
          </div>

          <!-- Pagination -->
          <div class="flex items-center justify-end gap-2 px-6 py-4 bg-slate-700/30 border-t border-slate-600">
            <button
              @click="table.previousPage()"
              :disabled="!table.getCanPreviousPage()"
              class="px-3 py-2 text-sm font-medium text-slate-300 bg-transparent border border-slate-600 rounded-lg hover:bg-slate-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              «
            </button>
            <button
              v-for="page in table.getPageCount()"
              :key="page"
              @click="table.setPageIndex(page - 1)"
              :class="[
                'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                table.getState().pagination.pageIndex === page - 1
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 bg-transparent border border-slate-600 hover:bg-slate-600 hover:text-white'
              ]"
            >
              {{ page }}
            </button>
            <button
              @click="table.nextPage()"
              :disabled="!table.getCanNextPage()"
              class="px-3 py-2 text-sm font-medium text-slate-300 bg-transparent border border-slate-600 rounded-lg hover:bg-slate-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              »
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  useVueTable,
  getCoreRowModel,
  getPaginationRowModel,
  type ColumnDef
} from '@tanstack/vue-table'
import ApiService from '@/services/ApiService'
import Swal from 'sweetalert2'

const { t, locale } = useI18n()

interface Transaction {
  type: 'DEPOSIT' | 'WITHDRAWAL'
  status: number
  bank_name: string
  bank_account_name: string
  bank_account: string
  amount: number
  coupon_id: number | null
  coupon: string | null
  coupon_amount: number | null
  createdAt: string
}

// Loading and error states
const loading = ref(false)
const error = ref<string | null>(null)

// Transactions data from API
const transactions = ref<Transaction[]>([])

// Filters
const filters = ref({
  type: 'ALL'
})

// Column definitions
const columns = computed<ColumnDef<Transaction>[]>(() => [
  {
    accessorKey: 'type',
    header: t('depWid.Type'),
    size: 100
  },
  {
    accessorKey: 'bank_name',
    header: t('register.bankName'),
    size: 150
  },
  {
    accessorKey: 'bank_account_name',
    header: t('register.bankAccountName'),
    size: 150
  },
  {
    accessorKey: 'bank_account',
    header: t('register.bankAccount'),
    size: 150
  },
  {
    accessorKey: 'amount',
    header: t('depWid.Amount'),
    size: 120,
    cell: ({ getValue }) => {
      const amount = getValue() as number
      return amount ? `₩${amount.toLocaleString()}` : '₩0'
    }
  },
  {
    accessorKey: 'status',
    header: t('depWid.State'),
    size: 120
  },
  {
    accessorKey: 'createdAt',
    header: t('depWid.Date'),
    size: 150
  }
])

// Table instance
const table = useVueTable({
  get data() {
    return transactions.value
  },
  get columns() {
    return columns.value
  },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  initialState: {
    pagination: {
      pageSize: 10
    }
  }
})

// Store original transactions data
const originalTransactions = ref<Transaction[]>([])

// Fetch transactions from API
const fetchTransactions = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await ApiService.get("/tran/depwid/history")
    console.log('API Response:', response)
    
    if (response.data) {
      originalTransactions.value = response.data
      applyFilters()
    } else {
      originalTransactions.value = []
      transactions.value = []
    }
  } catch (err: any) {
    console.error('Error fetching transactions:', err)
    error.value = 'Failed to load transaction history'
    
    // Show error message to user
    Swal.fire({
      icon: 'error',
      title: t('common.error'),
      text: t('common.failedToLoad'),
      confirmButtonColor: '#FF0000',
      confirmButtonText: t('common.ok')
    })
    
    originalTransactions.value = []
    transactions.value = []
  } finally {
    loading.value = false
  }
}

// Apply filters to transactions
const applyFilters = () => {
  let filteredData = [...originalTransactions.value]
  
  // Filter by type
  if (filters.value.type !== 'ALL') {
    filteredData = filteredData.filter(transaction => 
      transaction.type === filters.value.type
    )
  }
  
  transactions.value = filteredData
}

// Watch for filter changes and apply filters automatically
watch(() => filters.value.type, () => {
  if (originalTransactions.value.length > 0) {
    applyFilters()
  }
})

// Load transactions on component mount
onMounted(() => {
  fetchTransactions()
})

// Helper functions for translations
const getTypeTranslation = (type: string) => {
  const typeMap: Record<string, string> = {
    'DEPOSIT': t('transactionHistory.types.deposit'),
    'WITHDRAWAL': t('transactionHistory.types.withdrawal')
  }
  return typeMap[type] || type
}

const getStatusTranslation = (status: number) => {
  const statusMap: Record<number, string> = {
    0: t('transactionHistory.status.pending'),
    1: t('transactionHistory.status.processing'),
    2: t('transactionHistory.status.completed'),
    3: t('transactionHistory.status.completed'),
    4: t('transactionHistory.status.failed'),
    5: t('transactionHistory.status.cancelled')
  }
  return statusMap[status] || `Status ${status}`
}
</script>

<style scoped>
/* Transaction history specific styles */
</style>
