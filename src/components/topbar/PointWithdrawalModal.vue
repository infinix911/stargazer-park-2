<template>
  <Dialog :open="isOpen" @update:open="handleOpenChange">
    <DialogContent class="w-[95vw] max-w-md sm:max-w-lg lg:max-w-xl bg-[#2c334a] border border-[#2d334b] p-0 overflow-hidden max-h-[90vh] flex flex-col">
      <!-- Form Title -->
      <DialogHeader class="text-center p-3 sm:p-4 flex-shrink-0 bg-gradient-to-r from-[#00c990] to-[#3b959c]">
        <DialogTitle class="text-xl sm:text-2xl lg:text-3xl font-orbitron font-bold text-white">
          {{ t('pointWithdrawal.title') }}
        </DialogTitle>
        <DialogDescription class="text-white/80 mt-1 text-sm sm:text-base">
          <!-- {{ t('pointWithdrawal.description') }} -->
        </DialogDescription>
      </DialogHeader>

      <!-- Point Withdrawal Form -->
      <form @submit.prevent="handleSubmit" class="p-3 sm:p-4 space-y-3 sm:space-y-4 flex-1 overflow-y-auto">
        <!-- Current and After Sections -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <!-- Current Section -->
          <div class="space-y-1.5 sm:space-y-2">
            <h3 class="text-base sm:text-lg font-semibold text-white text-left">{{ t('pointWithdrawal.current') }}</h3>
            
            <!-- Current Point -->
            <div class="space-y-1.5">
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <label class="text-white font-medium text-base">{{ t('pointWithdrawal.point') }}</label>
              </div>
              <div class="bg-slate-700/50 border border-slate-600 rounded-lg p-2 sm:p-3">
                <Input
                  v-model="walletPoint.current"
                  readonly
                  class="bg-transparent border-none text-white cursor-not-allowed"
                  disabled
                  tabindex="-1"
                />
              </div>
            </div>

            <!-- Current Balance -->
            <div class="space-y-1.5">
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <label class="text-white font-medium text-base">{{ t('pointWithdrawal.balance') }}</label>
              </div>
              <div class="bg-slate-700/50 border border-slate-600 rounded-lg p-2 sm:p-3">
                <Input
                  v-model="wallet.current"
                  readonly
                  class="bg-transparent border-none text-white cursor-not-allowed"
                  disabled
                  tabindex="-1"
                />
              </div>
            </div>
          </div>

          <!-- After Section -->
          <div class="space-y-1.5 sm:space-y-2">
            <h3 class="text-base sm:text-lg font-semibold text-white text-left">{{ t('pointWithdrawal.after') }}</h3>
            
            <!-- After Point -->
            <div class="space-y-1.5">
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <label class="text-white font-medium text-base">{{ t('pointWithdrawal.point') }}</label>
              </div>
              <div class="bg-slate-700/50 border border-slate-600 rounded-lg p-2 sm:p-3">
                <Input
                  v-model="walletPoint.new"
                  readonly
                  class="bg-transparent border-none text-white cursor-not-allowed"
                  disabled
                  tabindex="-1"
                />
              </div>
            </div>

            <!-- After Balance -->
            <div class="space-y-1.5">
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <label class="text-white font-medium text-base">{{ t('pointWithdrawal.balance') }}</label>
              </div>
              <div class="bg-slate-700/50 border border-slate-600 rounded-lg p-2 sm:p-3">
                <Input
                  v-model="wallet.new"
                  readonly
                  class="bg-transparent border-none text-white cursor-not-allowed"
                  disabled
                  tabindex="-1"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Point Amount Input -->
        <div class="space-y-1.5">
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <label class="text-white font-medium text-base">{{ t('pointWithdrawal.pointAmount') }}</label>
          </div>
          <div class="flex space-x-2">
            <div class="bg-slate-700/50 border border-slate-600 rounded-lg p-2 sm:p-3 flex-1">
              <Input
                v-model="form.pointAmount"
                type="number"
                :placeholder="t('pointWithdrawal.pointAmountPlaceholder')"
                :class="{ 'border-red-500': errors.pointAmount }"
                class="bg-transparent border-none text-white placeholder-slate-400 focus:ring-0 focus:border-none text-sm sm:text-base"
              />
            </div>
            <button
              type="button"
              @click="setMaxAmount"
              class="bg-[#95b1f8] hover:bg-[#95b1f8]/80 text-black font-medium px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center"
            >
              {{ t('pointWithdrawal.maxAmount') }}
            </button>
          </div>
          <p v-if="errors.pointAmount" class="text-red-400 text-sm">{{ errors.pointAmount }}</p>
        </div>

        <!-- Quick Amount Buttons -->
        <div class="space-y-1.5 sm:space-y-2">
          <div class="grid grid-cols-3 gap-1.5 sm:gap-2">
            <button
              type="button"
              @click="setAmount(10000)"
              class="bg-[#00c990] hover:bg-[#00c990]/80 text-white font-medium py-2 px-2 sm:px-3 text-xs sm:text-sm rounded-md transition-colors cursor-pointer inline-flex items-center justify-center"
            >
              10,000
            </button>
            <button
              type="button"
              @click="setAmount(50000)"
              class="bg-[#00c990] hover:bg-[#00c990]/80 text-white font-medium py-2 px-2 sm:px-3 text-xs sm:text-sm rounded-md transition-colors cursor-pointer inline-flex items-center justify-center"
            >
              50,000
            </button>
            <button
              type="button"
              @click="setAmount(100000)"
              class="bg-[#00c990] hover:bg-[#00c990]/80 text-white font-medium py-2 px-2 sm:px-3 text-xs sm:text-sm rounded-md transition-colors cursor-pointer inline-flex items-center justify-center"
            >
              100,000
            </button>
            <button
              type="button"
              @click="setAmount(500000)"
              class="bg-[#00c990] hover:bg-[#00c990]/80 text-white font-medium py-2 px-2 sm:px-3 text-xs sm:text-sm rounded-md transition-colors cursor-pointer inline-flex items-center justify-center"
            >
              500,000
            </button>
            <button
              type="button"
              @click="setAmount(1000000)"
              class="bg-[#00c990] hover:bg-[#00c990]/80 text-white font-medium py-2 px-2 sm:px-3 text-xs sm:text-sm rounded-md transition-colors cursor-pointer inline-flex items-center justify-center"
            >
              1M
            </button>
            <button
              type="button"
              @click="resetAmount"
              class="bg-slate-600 hover:bg-slate-700 text-white font-medium py-2 px-2 sm:px-3 text-xs sm:text-sm rounded-md transition-colors cursor-pointer inline-flex items-center justify-center"
            >
              {{ t('pointWithdrawal.reset') }}
            </button>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex space-x-2 sm:space-x-3 pt-3 sm:pt-4">
          <button
            type="button"
            @click="handleOpenChange(false)"
            class="flex-1 bg-slate-600 text-white border border-slate-500 hover:bg-slate-700 hover:border-slate-400 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center"
          >
            {{ t('pointWithdrawal.cancel') }}
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="flex-1 bg-[#95b1f8] hover:bg-[#95b1f8]/80 text-black font-medium py-2 sm:py-2.5 text-sm sm:text-base rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center disabled:bg-gray-400 disabled:text-gray-600"
          >
            {{ isSubmitting ? t('pointWithdrawal.transferring') : t('pointWithdrawal.transfer') }}
          </button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { z } from 'zod'
import { useI18n } from 'vue-i18n'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth'
import ApiService from '@/services/ApiService'
import Swal from 'sweetalert2'

const { t } = useI18n()
const authStore = useAuthStore()
const user = computed(() => authStore.user)

// Props
interface Props {
  open: boolean
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

// Form state
const form = reactive({
  pointAmount: 0
})

// Form state
const isSubmitting = ref(false)
const errors = reactive({
  pointAmount: ''
})

const wallet = computed(() => ({ 
  current: user.value.wallet || 0, 
  new: 0 
}));
const walletPoint = computed(() => ({ 
  current: user.value.wallet_point || 0, 
  new: 0 
}));

// Computed values
const pointAmount = computed(() => {
  return form.pointAmount || 0
})

// Reactive validation schema
const withdrawalSchema = computed(() => z.object({
  pointAmount: z.number()
    .min(1, t('pointWithdrawal.errors.pointAmountRequired'))
    .refine((val) => {
      return val > 0
    }, t('pointWithdrawal.errors.pointAmountPositive'))
    .refine((val) => {
      return val <= walletPoint.value.current
    }, t('pointWithdrawal.errors.pointAmountExceedsPoints'))
    .refine((val) => {
      return val <= wallet.value.current
    }, t('pointWithdrawal.errors.pointAmountExceedsBalance'))
    .refine((val) => {
      return val >= 10000
    }, t('pointWithdrawal.errors.pointAmountMinimum'))
}))

// Watch for point amount changes
watch(
  () => form.pointAmount,
  (value) => {
    
    if (Number(value) > Number(walletPoint.value.current)) {
      walletPoint.value.new = walletPoint.value.current;
      wallet.value.new = wallet.value.current;
    } else {
      walletPoint.value.new =
        Number(walletPoint.value.current) - Number(value);
      wallet.value.new = Number(wallet.value.current) + Number(value);
    }
    
  },
  { immediate: true }
);

// Computed
const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
})

// Methods
const handleOpenChange = (value: boolean) => {
  emit('update:open', value)
  if (!value) {
    resetForm()
  }
}

const resetForm = () => {
  form.pointAmount = 0
  errors.pointAmount = ''
}

const setAmount = (amount: number) => {
  amount > 0
        ? (form.pointAmount = Number(form.pointAmount) + Number(amount))
        : (form.pointAmount = 0)
}

const setMaxAmount = () => {
  form.pointAmount = walletPoint.value.current
}

const resetAmount = () => {
  form.pointAmount = 0
}

const validateForm = () => {
  try {
    withdrawalSchema.value.parse(form)
    return true
  } catch (error: any) {
    errors.pointAmount = ''
    
    if (error && error.constructor.name === 'ZodError') {
      error.issues.forEach((err: any) => {
        const field = err.path[0]
        if (field === 'pointAmount') {
          errors.pointAmount = err.message
        }
      })
    }
    return false
  }
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    const amount = Number(form.pointAmount)
    
    if (amount > Number(walletPoint.value.current)) {
      return Swal.fire(t("point.Title"), t(`point.AMOUNT_GT`), "info")
    }

    await ApiService.post("/tran/point", { amount })
      .then(() => {
        Swal.fire(
          t("point.Title"),
          t("point.TransferSuccess", amount),
          "success"
        )
        
        // Close modal and reset form
        emit('update:open', false)
        resetForm()
      })
      .catch((e) => {
        Swal.fire(
          t("point.Title"),
          t(`point.${e.response.data.message}`),
          "error"
        )
      })
      
  } catch (error) {
    console.error('Failed to withdraw points:', error)
  } finally {
    isSubmitting.value = false
  }
  
  return
}
</script>

<style scoped>
/* Point withdrawal modal specific styles */
.bg-slate-700\/50:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* Custom scrollbar for dark theme */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #1e293b;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
</style>