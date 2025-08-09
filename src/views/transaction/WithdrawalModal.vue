<template>
  <Dialog :open="props.open" @update:open="handleOpenChange">
    <DialogContent class="w-full max-w-md bg-white p-8">
      <!-- Form Title -->
      <DialogHeader class="text-center mb-8">
        <DialogTitle class="text-3xl font-orbitron font-bold text-gray-900">
          {{ t('withdrawal.title') }}
        </DialogTitle>
        <DialogDescription class="text-gray-600 mt-2">
          {{ t('withdrawal.description') }}
        </DialogDescription>
      </DialogHeader>

      <!-- Withdrawal Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Bank Name Field -->
        <div class="space-y-2">
          <div class="flex items-center space-x-2">
            <Building2 class="w-5 h-5 text-gray-700" />
            <label class="text-gray-700 font-medium">{{ t('withdrawal.bankName') }}</label>
          </div>
          <Input
            v-model="form.bankName"
            type="text"
            :placeholder="t('withdrawal.bankNamePlaceholder')"
            :class="{ 'border-red-500': errors.bankName }"
            class="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500"
          />
          <p v-if="errors.bankName" class="text-red-400 text-sm">{{ errors.bankName }}</p>
        </div>

        <!-- Bank Account Name Field -->
        <div class="space-y-2">
          <div class="flex items-center space-x-2">
            <User class="w-5 h-5 text-gray-700" />
            <label class="text-gray-700 font-medium">{{ t('withdrawal.bankAccountName') }}</label>
          </div>
          <Input
            v-model="form.bankAccountName"
            type="text"
            :placeholder="t('withdrawal.bankAccountNamePlaceholder')"
            :class="{ 'border-red-500': errors.bankAccountName }"
            class="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500"
          />
          <p v-if="errors.bankAccountName" class="text-red-400 text-sm">{{ errors.bankAccountName }}</p>
        </div>

        <!-- Bank Account Field -->
        <div class="space-y-2">
          <div class="flex items-center space-x-2">
            <CreditCard class="w-5 h-5 text-gray-700" />
            <label class="text-gray-700 font-medium">{{ t('withdrawal.bankAccount') }}</label>
          </div>
          <Input
            v-model="form.bankAccount"
            type="text"
            :placeholder="t('withdrawal.bankAccountPlaceholder')"
            :class="{ 'border-red-500': errors.bankAccount }"
            class="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500"
          />
          <p v-if="errors.bankAccount" class="text-red-400 text-sm">{{ errors.bankAccount }}</p>
        </div>

        <!-- Balance Field -->
        <div class="space-y-2">
          <div class="flex items-center space-x-2">
            <Wallet class="w-5 h-5 text-gray-700" />
            <label class="text-gray-700 font-medium">{{ t('withdrawal.balance') }}</label>
          </div>
          <Input
            v-model="form.balance"
            type="text"
            :placeholder="t('withdrawal.balancePlaceholder')"
            disabled
            class="bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500"
          />
        </div>

        <!-- Withdrawal Amount Field -->
        <div class="space-y-2">
          <div class="flex items-center space-x-2">
            <DollarSign class="w-5 h-5 text-gray-700" />
            <label class="text-gray-700 font-medium">{{ t('withdrawal.withdrawalAmount') }}</label>
          </div>
          <Input
            v-model="form.withdrawalAmount"
            type="number"
            :placeholder="t('withdrawal.withdrawalAmountPlaceholder')"
            :class="{ 'border-red-500': errors.withdrawalAmount }"
            class="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500"
          />
          <p v-if="errors.withdrawalAmount" class="text-red-400 text-sm">{{ errors.withdrawalAmount }}</p>
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
              {{ t('withdrawal.reset') }}
            </Button>
          </div>
        </div>

        <!-- Submit Button -->
        <Button
          type="submit"
          class="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3"
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
import { ref, reactive } from 'vue'
import { z } from 'zod'
import { useI18n } from 'vue-i18n'
import { Input } from '../../components/ui/input'
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

const { t } = useI18n()

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
const withdrawalSchema = z.object({
  bankName: z.string()
    .min(1, t('withdrawal.errors.bankNameRequired')),
  bankAccountName: z.string()
    .min(1, t('withdrawal.errors.bankAccountNameRequired')),
  bankAccount: z.string()
    .min(1, t('withdrawal.errors.bankAccountRequired'))
    .regex(/^[0-9]+$/, t('withdrawal.errors.bankAccountFormat')),
  balance: z.string()
    .min(1, t('withdrawal.errors.balanceRequired')),
  withdrawalAmount: z.string()
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

type WithdrawalForm = z.infer<typeof withdrawalSchema>

// Form data
const form = reactive<WithdrawalForm>({
  bankName: '',
  bankAccountName: '',
  bankAccount: '',
  balance: '',
  withdrawalAmount: '0'
})

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
const setAmount = (amount: number): void => {
  form.withdrawalAmount = amount.toString()
  errors.withdrawalAmount = undefined
}

// Reset amount
const resetAmount = (): void => {
  form.withdrawalAmount = '0'
  errors.withdrawalAmount = undefined
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
    console.log('Withdrawal request:', form)
    // Add your withdrawal logic here
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
    console.log('Withdrawal request successful')
    // Close modal or show success message
    emit('close')
  } catch (error) {
    console.error('Withdrawal request failed:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* Withdrawal modal specific styles */
</style>
