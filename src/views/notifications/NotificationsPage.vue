<template>
  <div class="min-h-screen bg-white">
    <!-- Notifications Section -->
    <div class="py-12">
      <div class="max-w-[1660px] mx-auto px-4">
        <!-- Section Header -->
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-3xl font-black flex items-center space-x-4">
            <div class="bg-white rounded-lg p-1">
              <svg class="w-8 h-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM4 19h6a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <span class="text-gray-900">{{ t('notifications.title') }}</span>
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
              @click="fetchNotices" 
              class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {{ t('common.retry') }}
            </button>
          </div>
        </div>

        <!-- Notifications Table -->
        <div v-else class="bg-white rounded-lg overflow-hidden border border-gray-300 shadow-lg">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-gray-100">
                  <th 
                    v-for="header in table.getFlatHeaders()" 
                    :key="header.id"
                    class="px-6 py-4 text-left text-sm font-medium text-gray-900 border-b border-gray-300"
                    :class="{
                      'text-left': header.id === 'id',
                      'text-center': header.id === 'title',
                      'text-right': header.id === 'createdAt'
                    }"
                  >
                    <div 
                      v-if="header.isPlaceholder" 
                      class="h-4"
                    />
                    <div
                      v-else
                      class="flex items-center justify-between"
                      :class="{
                        'justify-start': header.id === 'id',
                        'justify-center': header.id === 'title',
                        'justify-end': header.id === 'createdAt'
                      }"
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
                    class="px-6 py-4 text-sm text-gray-900 border-b border-gray-200"
                    :class="{
                      'text-left': cell.column.id === 'id',
                      'text-center': cell.column.id === 'title',
                      'text-right': cell.column.id === 'createdAt'
                    }"
                  >
                    <div 
                      v-if="cell.column.id === 'title'"
                      class="cursor-pointer hover:text-blue-600 transition-colors"
                      @click="openNotice(cell.row.original)"
                    >
                      {{ cell.getValue() }}
                    </div>
                    <div v-else>
                      {{ cell.getValue() }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="flex items-center justify-end gap-2 px-6 py-4 bg-gray-50 border-t border-gray-200">
            <button
              @click="table.previousPage()"
              :disabled="!table.getCanPreviousPage()"
              class="px-3 py-2 text-sm font-medium text-gray-700 bg-transparent border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  : 'text-gray-700 bg-transparent border border-gray-300 hover:bg-gray-100'
              ]"
            >
              {{ page }}
            </button>
            <button
              @click="table.nextPage()"
              :disabled="!table.getCanNextPage()"
              class="px-3 py-2 text-sm font-medium text-gray-700 bg-transparent border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              »
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Notifications Modal -->
    <NotificationsModal 
      v-model:open="showModal" 
      :notice="selectedNotice" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import ApiService from '@/services/ApiService'
import NotificationsModal from './NotificationsModal.vue'
import {
  useVueTable,
  getCoreRowModel,
  getPaginationRowModel,
  type ColumnDef
} from '@tanstack/vue-table'

const { t } = useI18n()

interface Notice {
  id: string
  title: string
  body: {}
  createdAt: string
  imgsrc: string
  popup: boolean
  type: string
}

// Notices data from API
const notices = ref<Notice[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// Modal state
const showModal = ref(false)
const selectedNotice = ref<Notice | null>(null)

// Fetch notices
const fetchNotices = async (): Promise<void> => {
  try {
    loading.value = true
    error.value = null
    const response = await ApiService.get('/site/notices')
    notices.value = response.data || []
  } catch (err) {
    console.error('Error fetching notices:', err)
    error.value = 'Failed to load notices'
    // Fallback
    notices.value = []
  } finally {
    loading.value = false
  }
}

// Column definitions
const columns = computed<ColumnDef<Notice>[]>(() => [
  {
    accessorKey: 'id',
    header: t('notifications.columns.number'),
    size: 80
  },
  {
    accessorKey: 'title',
    header: t('notifications.columns.title'),
    size: 600
  },
  {
    accessorKey: 'createdAt',
    header: t('notifications.columns.date'),
    size: 120,
    cell: ({ getValue }) => {
      const date = getValue() as string
      return new Date(date).toLocaleDateString()
    }
  }
])

// Table instance
const table = useVueTable({
  get data() {
    return notices.value
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

// Handle notice click
const openNotice = (notice: Notice) => {
  console.log('Opening notice:', notice)
  selectedNotice.value = notice
  showModal.value = true
}

// Fetch notices on component mount
onMounted(() => {
  fetchNotices()
})
</script>
