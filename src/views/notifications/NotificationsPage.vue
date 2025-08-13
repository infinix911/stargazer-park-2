<template>
  <div class="min-h-screen bg-gradient-to-br from-[#181b28] to-[#11131c]">
    <!-- Notifications Section -->
    <div class="py-12">
      <div class="max-w-[1660px] mx-auto px-4">
        <!-- Section Header -->
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-3xl font-black flex items-center space-x-4">
            <span class="text-white">{{ t('notifications.title') }}</span>
          </h2>
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
              @click="fetchNotices" 
              class="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              {{ t('common.retry') }}
            </button>
          </div>
        </div>

        <!-- Notifications Table -->
        <div v-else class="bg-slate-800/90 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700 shadow-xl">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-slate-700/50">
                  <th 
                    v-for="header in table.getFlatHeaders()" 
                    :key="header.id"
                    class="px-6 py-4 text-left text-sm font-medium text-slate-200 border-b border-slate-600"
                    :class="{
                      'text-left': header.id === 'rowNumber',
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
                        'justify-start': header.id === 'rowNumber',
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
                  class="border-b border-slate-600 hover:bg-slate-700/30 transition-colors"
                  :class="row.index % 2 === 0 ? 'bg-slate-800/30' : 'bg-slate-700/20'"
                >
                  <td 
                    v-for="cell in row.getVisibleCells()" 
                    :key="cell.id"
                    class="px-6 py-4 text-sm text-slate-200 border-b border-slate-600"
                    :class="{
                      'text-left': cell.column.id === 'rowNumber',
                      'text-center': cell.column.id === 'title',
                      'text-right': cell.column.id === 'createdAt'
                    }"
                  >
                    <div 
                      v-if="cell.column.id === 'title'"
                      class="cursor-pointer hover:text-blue-400 transition-colors"
                      @click="openNotice(cell.row.original)"
                    >
                      {{ cell.getValue() }}
                    </div>
                    <div 
                      v-else-if="cell.column.id === 'rowNumber'"
                      class="font-medium text-slate-300"
                    >
                      {{ table.getState().pagination.pageIndex * table.getState().pagination.pageSize + cell.row.index + 1 }}
                    </div>
                    <div 
                      v-else-if="cell.column.id === 'createdAt'"
                      class="text-slate-400"
                    >
                      {{ (() => {
                        const date = cell.getValue() as string
                        const momentDate = moment(date)
                        return momentDate.isValid() ? momentDate.format('YYYY-MM-DD') : date
                      })() }}
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
import moment from 'moment'
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
    id: 'rowNumber',
    header: t('table.Number'),
    size: 80,
    accessorFn: () => '', // Placeholder accessor
    cell: ({ row, table }) => {
      const currentPage = table.getState().pagination.pageIndex
      const pageSize = table.getState().pagination.pageSize
      return currentPage * pageSize + row.index + 1
    }
  },
  {
    accessorKey: 'title',
    header: t('table.Subject'),
    size: 600
  },
  {
    accessorKey: 'createdAt',
    header: t('table.Date'),
    size: 120,
    cell: ({ getValue }) => {
      const date = getValue() as string
      const momentDate = moment(date)
      return momentDate.isValid() ? momentDate.format('YYYY-MM-DD') : date
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
