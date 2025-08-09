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
            <!-- Date Range Picker -->
            <DateRangePicker
              v-model="filters.dateRange"
              placeholder="2025-08-01 - 2025-08-01"
            />

            <!-- Type Filter -->
            <div class="flex items-center space-x-2">
              <select
                v-model="filters.type"
                class="px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="ALL">ALL</option>
                <option value="DEPOSIT">DEPOSIT</option>
                <option value="WITHDRAWAL">WITHDRAWAL</option>
                <option value="TRANSFER">TRANSFER</option>
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

        <!-- Transaction Table -->
        <div class="bg-white rounded-lg overflow-hidden border border-gray-300 shadow-lg">
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
                        'bg-green-600 text-white': cell.getValue() === 'COMPLETED',
                        'bg-yellow-600 text-white': cell.getValue() === 'PENDING',
                        'bg-red-600 text-white': cell.getValue() === 'FAILED',
                        'bg-gray-600 text-white': cell.getValue() === 'CANCELLED'
                      }"
                    >
                      {{ getStatusTranslation(cell.getValue() as string) }}
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
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  useVueTable,
  getCoreRowModel,
  getPaginationRowModel,
  type ColumnDef
} from '@tanstack/vue-table'
import DateRangePicker from '@/components/ui/DateRangePicker.vue'

const { t } = useI18n()

interface Transaction {
  id: number
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER'
  bankName: string
  bankAccountName: string
  bankAccount: string
  amount: string
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'CANCELLED'
  date: string
}

// Sample transactions data
const transactions = ref<Transaction[]>([
  {
    id: 1,
    type: 'DEPOSIT',
    bankName: 'Shinhan Bank',
    bankAccountName: '홍길동',
    bankAccount: '110-123-456789',
    amount: '1,000,000',
    status: 'COMPLETED',
    date: '2025-01-22 17:45:44'
  },
  {
    id: 2,
    type: 'WITHDRAWAL',
    bankName: 'KB Kookmin Bank',
    bankAccountName: '김철수',
    bankAccount: '123-456-789012',
    amount: '500,000',
    status: 'PENDING',
    date: '2025-01-21 14:30:22'
  },
  {
    id: 3,
    type: 'TRANSFER',
    bankName: 'Woori Bank',
    bankAccountName: '이영희',
    bankAccount: '1002-123-456789',
    amount: '250,000',
    status: 'COMPLETED',
    date: '2025-01-20 09:15:30'
  }
])

// Filters
const filters = ref({
  dateRange: { from: new Date('2025-08-01'), to: new Date('2025-08-01') },
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
    accessorKey: 'bankName',
    header: t('transactionHistory.columns.bankName'),
    size: 150
  },
  {
    accessorKey: 'bankAccountName',
    header: t('transactionHistory.columns.bankAccountName'),
    size: 150
  },
  {
    accessorKey: 'bankAccount',
    header: t('transactionHistory.columns.bankAccount'),
    size: 150
  },
  {
    accessorKey: 'amount',
    header: t('transactionHistory.columns.amount'),
    size: 120
  },
  {
    accessorKey: 'status',
    header: t('transactionHistory.columns.status'),
    size: 120
  },
  {
    accessorKey: 'date',
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

// Handle search
const handleSearch = () => {
  console.log('Searching with filters:', filters.value)
  // Here you would typically filter the transactions based on the filters
  // For now, we'll just log the search parameters
}

// Helper functions for translations
const getTypeTranslation = (type: string) => {
  const typeMap: Record<string, string> = {
    'DEPOSIT': t('transactionHistory.types.deposit'),
    'WITHDRAWAL': t('transactionHistory.types.withdrawal'),
    'TRANSFER': t('transactionHistory.types.transfer')
  }
  return typeMap[type] || type
}

const getStatusTranslation = (status: string) => {
  const statusMap: Record<string, string> = {
    'COMPLETED': t('transactionHistory.status.completed'),
    'PENDING': t('transactionHistory.status.pending'),
    'FAILED': t('transactionHistory.status.failed'),
    'CANCELLED': t('transactionHistory.status.cancelled')
  }
  return statusMap[status] || status
}
</script>

<style scoped>
/* Transaction history specific styles */
</style>
