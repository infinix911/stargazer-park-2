<template>
  <div class="min-h-screen bg-gradient-to-br from-[#181b28] to-[#11131c]">
    <!-- Contact Us Modal -->
    <ContactUsModal
      :open="showContactUsModal"
      @close="showContactUsModal = false"
    />
    
    <!-- View Inquiry Modal -->
    <ViewInquiryModal
      :open="showViewInquiryModal"
      :inquiry="selectedInquiry"
      @close="showViewInquiryModal = false"
    />
    
    <!-- Inquiries Section -->
    <div class="py-12">
      <div class="max-w-[1660px] mx-auto px-4">
        <!-- Section Header -->
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-3xl font-black flex items-center space-x-4">
            <span class="text-white">{{ t('inquiries.title') }}</span>
          </h2>
        </div>

        <!-- Management Action Buttons -->
        <div class="flex flex-wrap gap-3 mb-6">
          <button 
            @click="handleDeleteInquiry(false)"
            class="bg-[#ef4444] hover:bg-[#dc2626] px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors"
            :disabled="selectedInquiries.length === 0"
            :class="{ 'opacity-50 cursor-not-allowed': selectedInquiries.length === 0 }"
          >
            {{ t('inquiries.Delete') }}
          </button>
          <button 
            @click="handleDeleteInquiry(true)"
            class="bg-[#ef4444] hover:bg-[#ef4444]/80 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors"
          >
            {{ t('inquiries.DeleteAll') }}
          </button>
          <button 
            @click="handleReadInquiry(false)"
            class="bg-[#dd7c2b] hover:bg-[#ca8a04] px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors"
            :disabled="selectedInquiries.length === 0"
            :class="{ 'opacity-50 cursor-not-allowed': selectedInquiries.length === 0 }"
          >
            {{ t('inquiries.Read') }}
          </button>
          <button 
            @click="handleReadInquiry(true)"
            class="bg-[#dd7c2b] hover:bg-[#dd7c2b]/80 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors"
          >
            {{ t('inquiries.ReadAll') }}
          </button>
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
              @click="getInquiry" 
              class="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              {{ t('common.retry') }}
            </button>
          </div>
        </div>

        <!-- Inquiries Table -->
        <div v-else class="bg-slate-800/90 backdrop-blur-sm rounded-sm overflow-hidden border border-slate-700 shadow-xl">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-slate-700/50">
                  <th class="px-6 py-4 text-left text-sm font-medium text-slate-200 border-b border-slate-600 w-12">
                    <div class="flex items-center justify-center">
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          v-model="selectAll" 
                          @change="toggleSelectAll"
                          class="sr-only"
                        />
                        <div 
                          class="w-5 h-5 border-2 rounded transition-all duration-200 flex items-center justify-center"
                          :class="selectAll ? 'bg-blue-600 border-blue-600' : 'bg-slate-700 border-slate-500'"
                        >
                          <svg 
                            v-if="selectAll"
                            class="w-3 h-3 text-white" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                      </label>
                    </div>
                  </th>
                  <th 
                    v-for="header in table.getFlatHeaders()" 
                    :key="header.id"
                    class="px-6 py-4 text-center text-sm font-medium text-slate-200 border-b border-slate-600"
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
                  <td class="px-6 py-4 text-sm border-b border-slate-600">
                    <div class="flex items-center justify-center">
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          :value="row.original.id"
                          v-model="selectedInquiries"
                          class="sr-only"
                        />
                        <div 
                          class="w-5 h-5 border-2 rounded transition-all duration-200 flex items-center justify-center"
                          :class="selectedInquiries.includes(row.original.id) ? 'bg-blue-600 border-blue-600' : 'bg-slate-700 border-slate-500'"
                        >
                          <svg 
                            v-if="selectedInquiries.includes(row.original.id)"
                            class="w-3 h-3 text-white" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                      </label>
                    </div>
                  </td>
                  <td 
                    v-for="cell in row.getVisibleCells()" 
                    :key="cell.id"
                    class="px-6 py-4 text-sm border-b border-slate-600 text-center"
                    :class="{
                      'text-slate-200': cell.column.id !== 'state',
                      'text-blue-400': cell.column.id === 'state'
                    }"
                  >
                    <div 
                      v-if="cell.column.id === 'title'"
                      class="cursor-pointer hover:text-blue-400 transition-colors"
                      @click="openInquiry(cell.row.original)"
                    >
                      {{ cell.getValue() === 'DEPOSIT_ACCOUNT_REQUEST' ? t('inquiries.DepositAccReq') : cell.getValue() }}
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
                    <div v-else class="text-slate-200">
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

        <!-- New Inquiry Buttons -->
        <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 justify-center px-2 sm:px-0">
          <button 
            @click="handleContactUs"
            class="w-full sm:w-auto sm:max-w-[300px] cursor-pointer sm:flex-1 bg-[#95b1f8] hover:bg-[#95b1f8]/80 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl text-black text-base sm:text-lg font-semibold transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl hover:scale-[1.02] sm:hover:scale-105 flex items-center justify-center space-x-2 sm:space-x-3 active:scale-95"
          >
            <svg class="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
            <span class="whitespace-nowrap">{{ t('inquiries.Write') }}</span>
          </button>
          <button 
            @click="handleBankInquiry"
            class="w-full sm:w-auto sm:max-w-[300px] cursor-pointer sm:flex-1 bg-[#3d455f] hover:bg-[#3d455f]/80 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl text-white text-base sm:text-lg font-semibold transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl hover:scale-[1.02] sm:hover:scale-105 flex items-center justify-center space-x-2 sm:space-x-3 active:scale-95"
          >
            <svg class="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            <span class="whitespace-nowrap">{{ t('inquiries.buttons.bankInquiry') }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import ApiService from '@/services/ApiService'
import SocketService from '@/services/SocketService'
import Swal from 'sweetalert2'
import {
  useVueTable,
  getCoreRowModel,
  getPaginationRowModel,
  type ColumnDef
} from '@tanstack/vue-table'
import ContactUsModal from './ContactUsModal.vue'
import ViewInquiryModal from './ViewInquiryModal.vue'

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
const showViewInquiryModal = ref(false)
const selectedInquiry = ref<Inquiry | null>(null)

// State mapping function
const getStateText = (state: number): string => {
  return t(`inquiries.states.${state}`) || `State ${state}`
}

// Column definitions
const columns = computed<ColumnDef<Inquiry>[]>(() => [
  {
    accessorKey: 'title',
    header: t('table.Subject'),
    size: 400
  },
  {
    accessorKey: 'createdAt',
    header: t('table.Date'),
    size: 180,
    cell: ({ getValue }) => {
      const date = getValue() as string
      return new Date(date).toLocaleDateString()
    }
  },
  {
    accessorKey: 'state',
    header: t('inquiries.StateColumn'),
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
  showContactUsModal.value = true
}

const handleBankInquiry = async () => {
  try {
    const data = {
      title: "DEPOSIT_ACCOUNT_REQUEST",
      body: "DEPOSIT_ACCOUNT_REQUEST",
    };
    
    const resp = await ApiService.post("/inquiry", data);
    
    if (resp.data.message !== "MESSAGE_SENT") {
      return Swal.fire({
        icon: "error",
        title: t("header.AccountInquiry"),
        text: t("notif." + resp.data.message),
        confirmButtonColor: "#FF0000",
        confirmButtonText: t("notif.Close"),
      });
    }
    
    Swal.fire({
      icon: "success",
      title: t("header.AccountInquiry"),
      text: t("inquiry.InquirySentSuccess"),
      confirmButtonColor: "#FF0000",
      confirmButtonText: t("notif.Close"),
    });
    
    getInquiry();
    return;
  } catch (error: any) {
    
    return Swal.fire({
      icon: "error",
      title: t("header.AccountInquiry"),
      text: t("notif." + (error.response?.data?.message || "UNKNOWN_ERROR")),
      confirmButtonColor: "#FF0000",
      confirmButtonText: t("notif.Close"),
    });
  }
}

const handleDeleteInquiry = async (isAll: boolean) => {
  let ids = inquiries.value.filter((i) => i.state === 3).map((obj) => obj.id);

  if (!isAll) ids = selectedInquiries.value;
  
  await ApiService.patch(`/inquiry`, {
    inquiryIds: ids,
  })
  .then(() => {
    Swal.fire({
      icon: "success",
      title: t("header.Inquiry"),
      text: t("inquiry.InquiryDeletedSuccess"),
      confirmButtonColor: "#FF0000",
      confirmButtonText: t("notif.Close"),
    });
  })
  .catch((e) => {
    Swal.fire({
      icon: "error",
      title: t("header.Inquiry"),
      text: t("notif." + e.response.data.message),
      confirmButtonColor: "#FF0000",
      confirmButtonText: t("notif.Close"),
    });
  });

  getInquiry();
};

const handleReadInquiry = async (isAll: boolean) => {
  let ids = inquiries.value.filter((i) => i.state !== 3).map((obj) => Number(obj.id));

  if (!isAll) ids = selectedInquiries.value;

  if (ids.length === 0) {
    Swal.fire({
      icon: "success",
      title: t("header.Inquiry"),
      text: t("inquiry.InquiryRead"),
      confirmButtonColor: "#FF0000",
      confirmButtonText: t("notif.Close"),
    });
    return;
  }

  await ApiService.patch(`/inquiry/read`, {
    inquiryIds: ids,
  })
  .then(() => {
    Swal.fire({
      icon: "success",
      title: t("header.Inquiry"),
      text: t("inquiry.InquiryRead"),
      confirmButtonColor: "#FF0000",
      confirmButtonText: t("notif.Close"),
    });
    selectedInquiries.value = [];
    SocketService.socket.emit("members_init");
  })
  .catch((e) => {
    Swal.fire({
      icon: "error",
      title: t("header.Inquiry"),
      text: t("notif." + e.response.data.message),
      confirmButtonColor: "#FF0000",
      confirmButtonText: t("notif.Close"),
    });
  });

  getInquiry();
};

// Handle inquiry click
const openInquiry = async (inquiry: Inquiry) => {
  console.log('Opening inquiry:', inquiry)
  selectedInquiry.value = inquiry
  showViewInquiryModal.value = true
  
  // Mark as read if applicable
  await selectInquiry(inquiry)
}

// Select inquiry and mark as read if applicable
const selectInquiry = async (row: any) => {
  if (row.state === 2 || row.state === 4 || row.state === 8) {
    try {
      await ApiService.patch(`/inquiry/read`, {
        inquiryIds: [parseInt(row.id)],
      });
      SocketService.socket.emit("members_init");
    } catch (error: any) {
      console.error('Error marking inquiry as read:', error);
      
      Swal.fire({
        icon: "error",
        title: t("header.Inquiry"),
        text: t("notif." + (error.response?.data?.message || "UNKNOWN_ERROR")),
        confirmButtonColor: "#FF0000",
        confirmButtonText: t("notif.Close"),
      });
    }
  }
}

// Fetch inquiries on component mount
onMounted(() => {
  getInquiry()
})
</script>
