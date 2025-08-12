<template>
  <div class="w-full bg-white">
    <!-- Transaction History Section -->
    <div class="py-12">
      <div class="max-w-[1660px] mx-auto px-4">
        <!-- Section Header -->
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-3xl font-black flex items-center space-x-4">
            <div class="bg-gray-800 rounded-lg p-1">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <span class="text-gray-900">{{ t('transactionHistory.title') }}</span>
          </h2>
        </div>

        <!-- Search/Filter Bar -->
        <div class="bg-gray-100 rounded-lg p-6 mb-6">
          <div class="flex flex-col lg:flex-row gap-4 items-center">
            <!-- Type Filter -->
            <div class="flex items-center space-x-2">
              <select
                v-model="filters.type"
                class="px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="ALL">ALL</option>
                <option value="DEPOSIT">DEPOSIT</option>
                <option value="WITHDRAWAL">WITHDRAWAL</option>
              </select>
            </div>

            <!-- Search Button -->
            <button
              @click="handleSearch"
              class="bg-[#22c55e] hover:bg-[#16a34a] px-6 py-2 rounded-md text-white font-medium transition-colors"
            >
              {{ t('transactionHistory.search') }}
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="bg-white rounded-lg border border-gray-300 shadow-lg p-8">
          <div class="flex items-center justify-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span class="ml-3 text-gray-600">{{ t('common.loading') }}</span>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-white rounded-lg border border-gray-300 shadow-lg p-8">
          <div class="text-center text-red-600">
            <p>{{ error }}</p>
            <button 
              @click="fetchTransactions" 
              class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {{ t('common.retry') }}
            </button>
          </div>
        </div>

        <!-- Transaction Table -->
        <div v-else class="bg-white rounded-lg overflow-hidden border border-gray-300 shadow-lg">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-gray-100">
                  <th 
                    v-for="header in table.getFlatHeaders()" 
                    :key="header.id"
                    class="px-6 py-4 text-center text-sm font-medium text-gray-900 border-b border-gray-300"
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
                  class="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  :class="row.index % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
                >
                  <td 
                    v-for="cell in row.getVisibleCells()" 
                    :key="cell.id"
                    class="px-6 py-4 text-sm border-b border-gray-200 text-center text-gray-900"
                  >
                    <div 
                      v-if="cell.column.id === 'type'"
                      class="inline-block px-3 py-1 rounded-full text-xs font-medium"
                      :class="{
                        'bg-green-600 text-white': cell.getValue() === 'DEPOSIT',
                        'bg-red-600 text-white': cell.getValue() === 'WITHDRAWAL',
                        'bg-blue-600 text-white': cell.getValue() === 'TRANSFER'
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
                      class="text-gray-900 font-medium"
                    >
                      {{ cell.getValue() ? (locale === 'ko' ? `₩${Number(cell.getValue()).toLocaleString()}` : Number(cell.getValue()).toLocaleString()) : (locale === 'ko' ? '₩0' : '0') }}
                    </div>
                    <div v-else class="text-gray-900">
                      {{ cell.getValue() }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- No Results Message -->
          <div v-if="transactions.length === 0" class="flex items-center justify-center py-12">
            <p class="text-gray-600 text-lg">{{ t('transactionHistory.noResults') }}</p>
          </div>

          <!-- Pagination -->
          <div class="flex items-center justify-end gap-2 px-6 py-4 bg-gray-50 border-t border-gray-200">
            <button
              @click="table.previousPage()"
              :disabled="!table.getCanPreviousPage()"
              class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              «
            </button>
            <button
              v-for="page in table.getPageCount()"
              :key="page"
              @click="table.setPageIndex(page - 1)"
              :class="[
                'px-3 py-2 text-sm font-medium rounded-md',
                table.getState().pagination.pageIndex === page - 1
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-100'
              ]"
            >
              {{ page }}
            </button>
            <button
              @click="table.nextPage()"
              :disabled="!table.getCanNextPage()"
              class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
    header: t('transactionHistory.columns.type'),
    size: 100
  },
  {
    accessorKey: 'bank_name',
    header: t('transactionHistory.columns.bankName'),
    size: 150
  },
  {
    accessorKey: 'bank_account_name',
    header: t('transactionHistory.columns.bankAccountName'),
    size: 150
  },
  {
    accessorKey: 'bank_account',
    header: t('transactionHistory.columns.bankAccount'),
    size: 150
  },
  {
    accessorKey: 'amount',
    header: t('transactionHistory.columns.amount'),
    size: 120,
    cell: ({ getValue }) => {
      const amount = getValue() as number
      return amount ? `₩${amount.toLocaleString()}` : '₩0'
    }
  },
  {
    accessorKey: 'status',
    header: t('transactionHistory.columns.status'),
    size: 120
  },
  {
    accessorKey: 'createdAt',
    header: t('transactionHistory.columns.date'),
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

// Handle search
const handleSearch = () => {
  console.log('Searching with filters:', filters.value)
  applyFilters()
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
