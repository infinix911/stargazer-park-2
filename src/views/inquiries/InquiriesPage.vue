<template>
  <div class="min-h-screen bg-white">
    <!-- Contact Us Modal -->
    <ContactUsModal
      :open="showContactUsModal"
      @close="showContactUsModal = false"
      @submit="handleContactUsSubmit"
    />
    
    <!-- Inquiries Section -->
    <div class="py-12">
      <div class="max-w-[1660px] mx-auto px-4">
        <!-- Section Header -->
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-3xl font-black flex items-center space-x-4">
            <div class="bg-white rounded-lg p-1">
              <svg class="w-8 h-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <span class="text-gray-900">{{ t('inquiries.title') }}</span>
          </h2>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap gap-3 mb-6">
          <button 
            @click="handleContactUs"
            class="bg-[#22c55e] hover:bg-[#16a34a] px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors"
          >
            {{ t('inquiries.buttons.contactUs') }}
          </button>
          <button 
            @click="handleBankInquiry"
            class="bg-[#8b5cf6] hover:bg-[#7c3aed] px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors"
          >
            {{ t('inquiries.buttons.bankInquiry') }}
          </button>
          <button 
            @click="handleDelete"
            class="bg-[#ef4444] hover:bg-[#dc2626] px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors"
            :disabled="selectedInquiries.length === 0"
            :class="{ 'opacity-50 cursor-not-allowed': selectedInquiries.length === 0 }"
          >
            {{ t('inquiries.buttons.delete') }}
          </button>
          <button 
            @click="handleDeleteAll"
            class="bg-[#f97316] hover:bg-[#ea580c] px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors"
          >
            {{ t('inquiries.buttons.deleteAll') }}
          </button>
          <button 
            @click="handleRead"
            class="bg-[#eab308] hover:bg-[#ca8a04] px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors"
            :disabled="selectedInquiries.length === 0"
            :class="{ 'opacity-50 cursor-not-allowed': selectedInquiries.length === 0 }"
          >
            {{ t('inquiries.buttons.read') }}
          </button>
          <button 
            @click="handleReadAll"
            class="bg-[#eab308] hover:bg-[#ca8a04] px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors"
          >
            {{ t('inquiries.buttons.readAll') }}
          </button>
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
              @click="getInquiry" 
              class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {{ t('common.retry') }}
            </button>
          </div>
        </div>

        <!-- Inquiries Table -->
        <div v-else class="bg-white rounded-lg overflow-hidden border border-gray-300 shadow-lg">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-gray-100">
                  <th class="px-6 py-4 text-left text-sm font-medium text-gray-900 border-b border-gray-300 w-12">
                    <input 
                      type="checkbox" 
                      v-model="selectAll" 
                      @change="toggleSelectAll"
                      class="rounded border-gray-400 text-blue-600 focus:ring-blue-500 focus:ring-2"
                    />
                  </th>
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
                  <td class="px-6 py-4 text-sm border-b border-gray-200">
                    <input 
                      type="checkbox" 
                      :value="row.original.id"
                      v-model="selectedInquiries"
                      class="rounded border-gray-400 text-blue-600 focus:ring-blue-500 focus:ring-2"
                    />
                  </td>
                  <td 
                    v-for="cell in row.getVisibleCells()" 
                    :key="cell.id"
                    class="px-6 py-4 text-sm border-b border-gray-200 text-center"
                    :class="{
                      'text-gray-900': cell.column.id !== 'state',
                      'text-blue-400': cell.column.id === 'state'
                    }"
                  >
                    <div 
                      v-if="cell.column.id === 'title'"
                      class="cursor-pointer hover:text-blue-300 transition-colors"
                      @click="openInquiry(cell.row.original)"
                    >
                      {{ cell.getValue() }}
                    </div>
                    <div 
                      v-else-if="cell.column.id === 'state'"
                      class="inline-block px-3 py-1 rounded-full text-xs font-medium"
                      :class="{
                        'bg-blue-600 text-white': cell.row.original.state === 3,
                        'bg-gray-600 text-white': cell.row.original.state === 0,
                        'bg-yellow-600 text-white': cell.row.original.state === 1,
                        'bg-green-600 text-white': cell.row.original.state === 2,
                        'bg-purple-600 text-white': cell.row.original.state === 4 || cell.row.original.state === 9,
                        'bg-red-600 text-white': cell.row.original.state === 8
                      }"
                    >
                      {{ getStateText(cell.row.original.state) }}
                    </div>
                    <div v-else class="text-gray-900">
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
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import ApiService from '@/services/ApiService'
import {
  useVueTable,
  getCoreRowModel,
  getPaginationRowModel,
  type ColumnDef
} from '@tanstack/vue-table'
import ContactUsModal from './ContactUsModal.vue'

const { t } = useI18n()

interface Inquiry {
  id: number;
  title: string;
  body: string;
  reply: string;
  state: number;
  createdAt: string;
  updatedAt: string;
}

// Inquiries data from API
const inquiries = ref<Inquiry[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// Fetch inquiries from API
const getInquiry = async (): Promise<void> => {
  try {
    loading.value = true
    error.value = null
    const response = await ApiService.get('/inquiry')
    inquiries.value = response.data || []
  } catch (err) {
    console.error('Error fetching inquiries:', err)
    error.value = 'Failed to load inquiries'
    // Fallback
    inquiries.value = []
  } finally {
    loading.value = false
  }
}

// Selection state
const selectedInquiries = ref<number[]>([])
const selectAll = ref(false)

// Modal state
const showContactUsModal = ref(false)

// State mapping function
const getStateText = (state: number): string => {
  return t(`inquiries.states.${state}`) || `State ${state}`
}

// Column definitions
const columns = computed<ColumnDef<Inquiry>[]>(() => [
  {
    accessorKey: 'title',
    header: t('inquiries.columns.title'),
    size: 400
  },
  {
    accessorKey: 'createdAt',
    header: t('inquiries.columns.date'),
    size: 180,
    cell: ({ getValue }) => {
      const date = getValue() as string
      return new Date(date).toLocaleDateString()
    }
  },
  {
    accessorKey: 'state',
    header: t('inquiries.columns.status'),
    size: 120,
    cell: ({ row }) => {
      return getStateText(row.original.state)
    }
  }
])

// Table instance
const table = useVueTable({
  get data() {
    return inquiries.value
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

// Selection handlers
const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedInquiries.value = inquiries.value.map(inquiry => inquiry.id)
  } else {
    selectedInquiries.value = []
  }
}

// Action handlers
const handleContactUs = () => {
  console.log('Opening contact us modal')
  showContactUsModal.value = true
}

const handleContactUsSubmit = (data: { title: string; body: string }) => {
  console.log('Contact us form submitted:', data)
  // Here you would typically send the data to your backend
  // For now, we'll add it to the inquiries list
  const newInquiry: Inquiry = {
    id: inquiries.value.length + 1,
    title: data.title,
    body: data.body,
    reply: '',
    state: 0,
    createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
    updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
  }
  inquiries.value.unshift(newInquiry)
  showContactUsModal.value = false
}

const handleBankInquiry = () => {
  console.log('Opening bank inquiry modal/page')
  // Implement bank inquiry functionality
}

const handleDelete = () => {
  console.log('Deleting selected inquiries:', selectedInquiries.value)
  // Implement delete functionality
  inquiries.value = inquiries.value.filter(inquiry => !selectedInquiries.value.includes(inquiry.id))
  selectedInquiries.value = []
  selectAll.value = false
}

const handleDeleteAll = () => {
  console.log('Deleting all inquiries')
  // Implement delete all functionality
  if (confirm('Are you sure you want to delete all inquiries?')) {
    inquiries.value = []
    selectedInquiries.value = []
    selectAll.value = false
  }
}

const handleRead = () => {
  console.log('Marking selected inquiries as read:', selectedInquiries.value)
  // Implement mark as read functionality
  inquiries.value = inquiries.value.map(inquiry => {
    if (selectedInquiries.value.includes(inquiry.id)) {
      return { ...inquiry, state: 3 } // Member Confirmed
    }
    return inquiry
  })
  selectedInquiries.value = []
  selectAll.value = false
}

const handleReadAll = () => {
  console.log('Marking all inquiries as read')
  // Implement mark all as read functionality
  inquiries.value = inquiries.value.map(inquiry => ({
    ...inquiry,
    state: 3 // Member Confirmed
  }))
  selectedInquiries.value = []
  selectAll.value = false
}

// Handle inquiry click
const openInquiry = (inquiry: Inquiry) => {
  console.log('Opening inquiry:', inquiry)
  // Add your inquiry opening logic here
  // This could open a modal, navigate to a detail page, etc.
}

// Fetch inquiries on component mount
onMounted(() => {
  getInquiry()
})
</script>
