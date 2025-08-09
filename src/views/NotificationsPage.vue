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

        <!-- Notifications Table -->
        <div class="bg-white rounded-lg overflow-hidden border border-gray-300 shadow-lg">
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
                      'text-right': header.id === 'date'
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
                        'justify-end': header.id === 'date'
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
                      'text-right': cell.column.id === 'date'
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

const { t } = useI18n()

interface Notice {
  id: number
  title: string
  date: string
  content?: string
}

// Sample notices data
const notices = ref<Notice[]>([
  {
    id: 1,
    title: '필공지사항 (필독)',
    date: '2023-12-06',
    content: 'Important notice that must be read by all users.'
  },
  {
    id: 2,
    title: '※은행점검시간 및 입출금 규정※',
    date: '2023-10-12',
    content: 'Bank inspection time and deposit/withdrawal regulations.'
  },
  {
    id: 3,
    title: '카지노 및 슬롯 이용규정안내',
    date: '2023-09-11',
    content: 'Casino and slot usage regulations guide.'
  },
  {
    id: 4,
    title: '※입출금 내역 관련 공지※',
    date: '2023-07-28',
    content: 'Notice regarding deposit/withdrawal details.'
  },
  {
    id: 5,
    title: '은행 점검',
    date: '2023-06-10',
    content: 'Bank inspection notice.'
  },
  {
    id: 6,
    title: '※미처리, 환급 안내 ※',
    date: '2022-08-11',
    content: 'Unprocessed and refund guide.'
  },
  {
    id: 7,
    title: '카지노 양방 및 악성배팅 제재안내',
    date: '2022-04-27',
    content: 'Casino two-way betting and malicious betting sanctions guide.'
  }
])

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
    accessorKey: 'date',
    header: t('notifications.columns.date'),
    size: 120
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
  // Add your notice opening logic here
  // This could open a modal, navigate to a detail page, etc.
}
</script>
