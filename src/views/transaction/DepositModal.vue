<template>
  <Dialog :open="props.open" @update:open="handleOpenChange">
    <DialogContent class="w-full max-w-md bg-white p-8">
      <!-- Form Title -->
      <DialogHeader class="text-center mb-8">
        <DialogTitle class="text-3xl font-orbitron font-bold text-gray-900">
          {{ t('deposit.title') }}
        </DialogTitle>
        <DialogDescription class="text-gray-600 mt-2">
          {{ t('deposit.description') }}
        </DialogDescription>
      </DialogHeader>

      <!-- Deposit Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Name Field -->
        <div class="space-y-2">
          <div class="flex items-center space-x-2">
            <User class="w-5 h-5 text-gray-700" />
            <label class="text-gray-700 font-medium">{{ t('deposit.name') }}</label>
          </div>
          <Input
            v-model="form.name"
            type="text"
            :placeholder="t('deposit.namePlaceholder')"
            class="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500"
            readonly
          />
        </div>

        <!-- Bank Account Name Field -->
        <div class="space-y-2">
          <div class="flex items-center space-x-2">
            <CreditCard class="w-5 h-5 text-gray-700" />
            <label class="text-gray-700 font-medium">{{ t('deposit.bankAccountName') }}</label>
          </div>
          <Input
            v-model="form.bankAccountName"
            type="text"
            :placeholder="t('deposit.bankAccountNamePlaceholder')"
            class="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500"
            readonly
          />
        </div>

        <!-- Mobile Number Field -->
        <div class="space-y-2">
          <div class="flex items-center space-x-2">
            <Phone class="w-5 h-5 text-gray-700" />
            <label class="text-gray-700 font-medium">{{ t('deposit.mobileNumber') }}</label>
          </div>
          <Input
            v-model="form.mobileNumber"
            type="tel"
            :placeholder="t('deposit.mobileNumberPlaceholder')"
            class="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500"
            readonly
          />
        </div>

        <!-- Deposit Amount Field -->
        <div class="space-y-2">
          <div class="flex items-center space-x-2">
            <DollarSign class="w-5 h-5 text-gray-700" />
            <label class="text-gray-700 font-medium">{{ t('deposit.depositAmount') }}</label>
          </div>
          <Input
            v-model="displayAmount"
            type="text"
            :placeholder="t('deposit.depositAmountPlaceholder')"
            :class="{ 'border-red-500': errors.amount }"
            class="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500"
            @input="handleNumberInput"
          />
          <p v-if="errors.amount" class="text-red-400 text-sm">{{ errors.amount }}</p>
        </div>

        <!-- Coupon Field -->
        <div class="space-y-2" v-if="couponList.length > 0">
          <div class="flex items-center space-x-2">
            <label class="text-gray-700 font-medium">{{ t('deposit.coupon') }}</label>
          </div>
          <Select v-model="form.couponId">
            <SelectTrigger class="w-full">
              <SelectValue :placeholder="t('deposit.couponPlaceholder')" />
            </SelectTrigger>
            <SelectContent class="w-full">
              <SelectItem v-for="c in couponList" :key="c.id" :value="String(c.id)">
                {{ c.code }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Quick Amount Buttons -->
        <div class="space-y-3">
          <div class="grid grid-cols-3 gap-2">
            <Button
              type="button"
              @click="setAmount(10000)"
              variant="outline"
              :class="'!bg-[#075d4f] hover:!bg-[#064e42] !text-white !border-[#075d4f] hover:!border-[#064e42] py-2 px-3 text-sm font-medium rounded-md transition-colors'"
            >
              10,000
            </Button>
            <Button
              type="button"
              @click="setAmount(50000)"
              variant="outline"
              :class="'!bg-[#075d4f] hover:!bg-[#064e42] !text-white !border-[#075d4f] hover:!border-[#064e42] py-2 px-3 text-sm font-medium rounded-md transition-colors'"
            >
              50,000
            </Button>
            <Button
              type="button"
              @click="setAmount(100000)"
              variant="outline"
              :class="'!bg-[#075d4f] hover:!bg-[#064e42] !text-white !border-[#075d4f] hover:!border-[#064e42] py-2 px-3 text-sm font-medium rounded-md transition-colors'"
            >
              100,000
            </Button>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <Button
              type="button"
              @click="setAmount(500000)"
              variant="outline"
              :class="'!bg-[#075d4f] hover:!bg-[#064e42] !text-white !border-[#075d4f] hover:!border-[#064e42] py-2 px-3 text-sm font-medium rounded-md transition-colors'"
            >
              500,000
            </Button>
            <Button
              type="button"
              @click="setAmount(1000000)"
              variant="outline"
              :class="'!bg-[#075d4f] hover:!bg-[#064e42] !text-white !border-[#075d4f] hover:!border-[#064e42] py-2 px-3 text-sm font-medium rounded-md transition-colors'"
            >
              1M
            </Button>
            <Button
              type="button"
              @click="resetAmount"
              variant="outline"
              :class="'!bg-gray-500 hover:!bg-gray-600 !text-white !border-gray-500 hover:!border-gray-600 py-2 px-3 text-sm font-medium rounded-md transition-colors'"
            >
              {{ t('deposit.reset') }}
            </Button>
          </div>
        </div>

        <!-- Submit Button -->
        <Button
          type="submit"
          class="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting">{{ t('deposit.submitting') }}</span>
          <span v-else>{{ t('deposit.submit') }}</span>
        </Button>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { z } from 'zod'
import { useI18n } from 'vue-i18n'
import { Input } from '../../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import Button from '../../components/ui/Button.vue'
import { useAuthStore } from '../../stores/auth'
import Swal from 'sweetalert2'
import ApiService from '../../services/ApiService'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../components/ui/dialog'
import {
  User,
  CreditCard,
  Phone,
  DollarSign
} from 'lucide-vue-next'

const { t, n } = useI18n()
const authStore = useAuthStore()
const user = computed(() => authStore.user)

// Coupons
const couponList = ref<any[]>([])
const getCoupons = async (): Promise<void> => {
  const resp = await ApiService.get('/tran/coupons')
  couponList.value = resp.data
}

// Display value for the input field
const displayAmount = ref('0')

// Watch for changes in display amount and update form
watch(displayAmount, () => {
  updateFormAmount()
})

// Handle number input - only allow digits
const handleNumberInput = (event: Event): void => {
  const target = event.target as HTMLInputElement
  const value = target.value.replace(/[^\d]/g, '') // Remove all non-digits
  displayAmount.value = value
}

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

// Form validation schema
const depositSchema = z.object({
  amount: z.number()
    .min(1, t('deposit.errors.depositAmountRequired'))
    .min(10000, t('deposit.errors.depositAmountMinimum'))
})

type DepositForm = {
  name: string;
  bankAccountName: string;
  mobileNumber: string;
  amount: number;
  couponId: string;
}

// Form data
const form = reactive<DepositForm>({
  name: user.value?.name || '',
  bankAccountName: user.value?.bank_account_name?.includes('[')
    ? user.value.bank_account_name.substring(
        0,
        user.value.bank_account_name.indexOf('['),
      )
    : user.value?.bank_account_name || '',
  mobileNumber: String(user.value?.mobile || ''),
  amount: 0,
  couponId: ''
})

// Form state
type FieldErrors<T> = Partial<Record<keyof T, string>>
const errors = reactive<FieldErrors<DepositForm>>({})
const isSubmitting = ref(false)

// Handle dialog open/close
const handleOpenChange = (open: boolean): void => {
  if (!open) {
    emit('close')
  }
}

// Set amount from quick buttons
const setAmount = (amt: number): void => {
  form.amount += amt
  displayAmount.value = n(form.amount)
  errors.amount = undefined
}

// Reset amount
const resetAmount = (): void => {
  form.amount = 0
  displayAmount.value = '0'
  errors.amount = undefined
}

// Watch for changes in display amount and update form
const updateFormAmount = (): void => {
  const cleanValue = displayAmount.value.replace(/[^\d]/g, '')
  form.amount = cleanValue ? parseInt(cleanValue) : 0
  errors.amount = undefined
}

// Validate form
const validateForm = (): boolean => {
  try {
    depositSchema.parse(form)
    Object.keys(errors).forEach(key => {
      delete errors[key as keyof DepositForm]
    })
    return true
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zodError = error as z.ZodError
      zodError.issues.forEach((issue) => {
        const field = issue.path[0] as keyof DepositForm
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
    const payload = {
      amount: form.amount,
      couponId: form.couponId,
    }
    await ApiService.post('/tran/deposit', payload)
    await Swal.fire({
      icon: 'success',
      title: t('deposit.successTitle'),
      text: t('deposit.successMessage'),
      timer: 1000,
      showConfirmButton: false
    })
    emit('close')
  } catch (error) {
    console.error('Deposit request failed:', error)
    await Swal.fire({
      icon: 'error',
      title: t('deposit.errorTitle'),
      text: t('deposit.errorMessage'),
      timer: 1000,
      showConfirmButton: false
    })
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  getCoupons()
})
</script>

<style scoped>
/* Deposit modal specific styles */
</style>
