<template>
  <Dialog :open="props.open" @update:open="handleOpenChange">
    <DialogContent class="w-[95vw] max-w-md sm:max-w-lg bg-white p-4 sm:p-6 md:p-8 max-h-[90vh] overflow-y-auto">
      <!-- Form Title -->
      <DialogHeader class="text-center mb-6 sm:mb-8">
        <DialogTitle class="text-2xl sm:text-3xl font-orbitron font-bold text-gray-900">
          {{ t('withdrawal.title') }}
        </DialogTitle>
        <DialogDescription class="text-gray-600 mt-2 text-sm sm:text-base">
          {{ t('withdrawal.description') }}
        </DialogDescription>
      </DialogHeader>

      <!-- Withdrawal Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4 sm:space-y-6">
        <!-- Bank Name Field -->
        <div class="space-y-2">
          <div class="flex items-center space-x-2">
            <Building2 class="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            <label class="text-gray-700 font-medium text-sm sm:text-base">{{ t('withdrawal.bankName') }}</label>
          </div>
          <Input
            v-model="form.bankName"
            type="text"
            :placeholder="t('withdrawal.bankNamePlaceholder')"
            class="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500"
            readonly
          />
        </div>

        <!-- Bank Account Name Field -->
        <div class="space-y-2">
          <div class="flex items-center space-x-2">
            <User class="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            <label class="text-gray-700 font-medium text-sm sm:text-base">{{ t('withdrawal.bankAccountName') }}</label>
          </div>
          <Input
            v-model="form.bankAccountName"
            type="text"
            :placeholder="t('withdrawal.bankAccountNamePlaceholder')"
            class="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500"
            readonly
          />
        </div>

        <!-- Bank Account Field -->
        <div class="space-y-2">
          <div class="flex items-center space-x-2">
            <CreditCard class="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            <label class="text-gray-700 font-medium text-sm sm:text-base">{{ t('withdrawal.bankAccount') }}</label>
          </div>
          <Input
            v-model="form.bankAccount"
            type="text"
            :placeholder="t('withdrawal.bankAccountPlaceholder')"
            class="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500"
            readonly
          />
        </div>

        <!-- Balance Field -->
        <div class="space-y-2">
          <div class="flex items-center space-x-2">
            <Wallet class="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            <label class="text-gray-700 font-medium text-sm sm:text-base">{{ t('withdrawal.balance') }}</label>
          </div>
          <Input
            v-model="form.balance"
            type="text"
            :placeholder="t('withdrawal.balancePlaceholder')"
            readonly
            class="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        <!-- Withdrawal Amount Field -->
        <div class="space-y-2">
          <div class="flex items-center space-x-2">
            <DollarSign class="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            <label class="text-gray-700 font-medium text-sm sm:text-base">{{ t('withdrawal.withdrawalAmount') }}</label>
          </div>
          <Input
            v-model="displayAmount"
            type="text"
            :placeholder="t('withdrawal.withdrawalAmountPlaceholder')"
            :class="{ 'border-red-500': errors.amount }"
            class="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500"
            @input="handleNumberInput"
          />
          <p v-if="errors.amount" class="text-red-400 text-sm">{{ errors.amount }}</p>
        </div>

        <!-- Quick Amount Buttons -->
        <div class="space-y-2 sm:space-y-3">
          <div class="grid grid-cols-3 gap-1.5 sm:gap-2">
            <Button
              type="button"
              @click="setAmount(10000)"
              variant="outline"
              :class="'!bg-[#075d4f] hover:!bg-[#064e42] !text-white !border-[#075d4f] hover:!border-[#064e42] py-2 px-2 sm:px-3 text-xs sm:text-sm font-medium rounded-md transition-colors'"
            >
              10,000
            </Button>
            <Button
              type="button"
              @click="setAmount(50000)"
              variant="outline"
              :class="'!bg-[#075d4f] hover:!bg-[#064e42] !text-white !border-[#075d4f] hover:!border-[#064e42] py-2 px-2 sm:px-3 text-xs sm:text-sm font-medium rounded-md transition-colors'"
            >
              50,000
            </Button>
            <Button
              type="button"
              @click="setAmount(100000)"
              variant="outline"
              :class="'!bg-[#075d4f] hover:!bg-[#064e42] !text-white !border-[#075d4f] hover:!border-[#064e42] py-2 px-2 sm:px-3 text-xs sm:text-sm font-medium rounded-md transition-colors'"
            >
              100,000
            </Button>
          </div>
          <div class="grid grid-cols-3 gap-1.5 sm:gap-2">
            <Button
              type="button"
              @click="setAmount(500000)"
              variant="outline"
              :class="'!bg-[#075d4f] hover:!bg-[#064e42] !text-white !border-[#075d4f] hover:!border-[#064e42] py-2 px-2 sm:px-3 text-xs sm:text-sm font-medium rounded-md transition-colors'"
            >
              500,000
            </Button>
            <Button
              type="button"
              @click="setAmount(1000000)"
              variant="outline"
              :class="'!bg-[#075d4f] hover:!bg-[#064e42] !text-white !border-[#075d4f] hover:!border-[#064e42] py-2 px-2 sm:px-3 text-xs sm:text-sm font-medium rounded-md transition-colors'"
            >
              1M
            </Button>
            <Button
              type="button"
              @click="resetAmount"
              variant="outline"
              :class="'!bg-gray-500 hover:!bg-gray-600 !text-white !border-gray-500 hover:!border-gray-600 py-2 px-2 sm:px-3 text-xs sm:text-sm font-medium rounded-md transition-colors'"
            >
              {{ t('withdrawal.reset') }}
            </Button>
          </div>
        </div>

        <!-- Submit Button -->
        <Button
          type="submit"
          class="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 sm:py-3 text-sm sm:text-base"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting">{{ t('withdrawal.withdrawing') }}</span>
          <span v-else>{{ t('withdrawal.withdraw') }}</span>
        </Button>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { z } from 'zod'
import { useI18n } from 'vue-i18n'
import { Input } from '../../components/ui/input'
import ApiService from '../../services/ApiService'
import Swal from 'sweetalert2'
import Button from '../../components/ui/Button.vue'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../components/ui/dialog'
import {
  Building2,
  User,
  CreditCard,
  Wallet,
  DollarSign
} from 'lucide-vue-next'

const { t, n } = useI18n()
import { computed } from 'vue'
import { useAuthStore } from '../../stores/auth'
const authStore = useAuthStore()
const user = computed(() => authStore.user)

// Props
interface Props {
  open?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  open: false
})

// Emits
const emit = defineEmits<{
  close: []
}>()

// Form validation schema (only validate editable amount)
const withdrawalSchema = z.object({
  amount: z.string()
    .min(1, t('withdrawal.errors.withdrawalAmountRequired'))
    .refine((val) => {
      const amount = parseFloat(val)
      return !isNaN(amount) && amount > 0
    }, t('withdrawal.errors.withdrawalAmountPositive'))
    .refine((val) => {
      const amount = parseFloat(val)
      const balance = parseFloat(form.balance.replace(/,/g, ''))
      return !isNaN(amount) && !isNaN(balance) && amount <= balance
    }, t('withdrawal.errors.withdrawalAmountExceedsBalance'))
    .refine((val) => {
      const amount = parseFloat(val)
      return !isNaN(amount) && amount >= 10000
    }, t('withdrawal.errors.withdrawalAmountMinimum'))
})

type WithdrawalForm = {
  bankName: string;
  bankAccountName: string;
  bankAccount: string;
  balance: string;
  amount: string;
}

// Form data
const form = reactive<WithdrawalForm>({
  bankName: String(user.value?.bank_name || ''),
  bankAccountName: user.value?.bank_account_name?.includes('[')
    ? user.value.bank_account_name.substring(
        0,
        user.value.bank_account_name.indexOf('['),
      )
    : user.value?.bank_account_name || '',
  bankAccount: String(user.value?.bank_account || ''),
  balance: n(Number(user.value?.wallet || 0)),
  amount: '0'
})

// Display value for input (formatted)
const displayAmount = ref('0')

// Sync display to form.amount on change
watch(displayAmount, () => {
  const clean = displayAmount.value.replace(/[^\d]/g, '')
  form.amount = clean || '0'
  errors.amount = undefined
})

// Only allow numeric input
const handleNumberInput = (event: Event): void => {
  const target = event.target as HTMLInputElement
  const value = target.value.replace(/[^\d]/g, '')
  displayAmount.value = value
}

// Form state
const errors = reactive<Partial<WithdrawalForm>>({})
const isSubmitting = ref(false)

// Handle dialog open/close
const handleOpenChange = (open: boolean): void => {
  if (!open) {
    emit('close')
  }
}

// Set amount from quick buttons
const setAmount = (amt: number): void => {
  const current = parseInt(form.amount || '0') || 0
  const next = current + amt
  form.amount = next.toString()
  displayAmount.value = n(next)
  errors.amount = undefined
}

// Reset amount
const resetAmount = (): void => {
  form.amount = '0'
  displayAmount.value = '0'
  errors.amount = undefined
}

// Validate form
const validateForm = (): boolean => {
  try {
    withdrawalSchema.parse(form)
    Object.keys(errors).forEach(key => {
      delete errors[key as keyof WithdrawalForm]
    })
    return true
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zodError = error as z.ZodError
      zodError.issues.forEach((issue) => {
        const field = issue.path[0] as keyof WithdrawalForm
        errors[field] = issue.message
      })
    }
    return false
  }
}

// Handle form submission
const handleSubmit = async (): Promise<void> => {
  if (!validateForm()) return

  isSubmitting.value = true

  try {
    await ApiService.post('/tran/withdraw', { amount: form.amount })
    await Swal.fire({
      icon: 'success',
      title: t('withdrawal.successTitle'),
      text: t('withdrawal.successMessage'),
      timer: 1000,
      showConfirmButton: false
    })
    emit('close')
  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: t('withdrawal.errorTitle'),
      text: t('withdrawal.errorMessage'),
      timer: 1000,
      showConfirmButton: false
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* Withdrawal modal specific styles */
</style>
