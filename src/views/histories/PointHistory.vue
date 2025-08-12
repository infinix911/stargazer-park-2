<template>
  <div class="w-full bg-white">
    <!-- Point History Section -->
    <div class="py-12">
      <div class="max-w-[1660px] mx-auto px-4">
        <!-- Section Header -->
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-3xl font-black flex items-center space-x-4">
            <div class="bg-gray-800 rounded-lg p-1">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <span class="text-gray-900">{{ t('pointHistory.title') }}</span>
          </h2>
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
              @click="fetchPointHistory" 
              class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {{ t('common.retry') }}
            </button>
          </div>
        </div>

        <!-- Point History Table -->
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
                      v-if="cell.column.id === 'status'"
                      class="inline-block px-3 py-1 rounded-full text-xs font-medium"
                      :class="{
                        'bg-blue-600 text-white': cell.getValue() === 0,
                        'bg-yellow-600 text-white': cell.getValue() === 1,
                        'bg-green-600 text-white': cell.getValue() === 2,
                        'bg-red-600 text-white': cell.getValue() !== 0 && cell.getValue() !== 1 && cell.getValue() !== 2
                      }"
                    >
                      {{ getStatusTranslation(cell.getValue() as number) }}
                    </div>
                    <div 
                      v-else-if="cell.column.id === 'amount'"
                      class="font-medium text-gray-900"
                    >
                      {{ cell.getValue() ? (locale === 'ko' ? `${Number(cell.getValue()).toLocaleString()}P` : `${Number(cell.getValue()).toLocaleString()}P`) : (locale === 'ko' ? '0P' : '0P') }}
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
          <div v-if="pointHistory.length === 0" class="flex items-center justify-center py-12">
            <p class="text-gray-600 text-lg">{{ t('pointHistory.noResults') }}</p>
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

interface PointTransaction {
  amount: string
  createdAt: string
  status: number
  updatedAt: string
}

// Loading and error states
const loading = ref(false)
const error = ref<string | null>(null)

// Point history data from API
const pointHistory = ref<PointTransaction[]>([])

// Column definitions
const columns = computed<ColumnDef<PointTransaction>[]>(() => [
  {
    accessorKey: 'amount',
    header: t('pointHistory.columns.amount'),
    size: 120
  },
  {
    accessorKey: 'status',
    header: t('pointHistory.columns.status'),
    size: 120
  },
  {
    accessorKey: 'createdAt',
    header: t('pointHistory.columns.createdAt'),
    size: 150
  },
  {
    accessorKey: 'updatedAt',
    header: t('pointHistory.columns.updatedAt'),
    size: 150
  }
])

// Table instance
const table = useVueTable({
  get data() {
    return pointHistory.value
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

// Fetch point history from API
const fetchPointHistory = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await ApiService.get(`/tran/point/history`)
    console.log('Point History API Response:', response)
    
    if (response.data) {
      pointHistory.value = response.data
    } else {
      pointHistory.value = []
    }
  } catch (err: any) {
    console.error('Error fetching point history:', err)
    error.value = 'Failed to load point history'
    
    // Show error message to user
    Swal.fire({
      icon: 'error',
      title: t('common.error'),
      text: t('common.failedToLoad'),
      confirmButtonColor: '#FF0000',
      confirmButtonText: t('common.ok')
    })
    
    pointHistory.value = []
  } finally {
    loading.value = false
  }
}

// Load point history on component mount
onMounted(() => {
  fetchPointHistory()
})

// Helper functions for translations
const getStatusTranslation = (status: number) => {
  const statusMap: Record<number, string> = {
    0: t('pointHistory.status.new'),
    1: t('pointHistory.status.wait'),
    2: t('pointHistory.status.complete')
  }
  return statusMap[status] || t('pointHistory.status.adminCancel')
}
</script>

<style scoped>
/* Point history specific styles */
</style>
