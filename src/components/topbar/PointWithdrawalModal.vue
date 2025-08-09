<template>
  <Dialog :open="isOpen" @update:open="handleOpenChange">
    <DialogContent class="w-full max-w-md bg-white p-8">
      <!-- Form Title -->
      <DialogHeader class="text-center mb-8">
        <DialogTitle class="text-3xl font-orbitron font-bold text-gray-900">
          {{ t('pointWithdrawal.title') }}
        </DialogTitle>
        <DialogDescription class="text-gray-600 mt-2">
          {{ t('pointWithdrawal.description') }}
        </DialogDescription>
      </DialogHeader>

      <!-- Point Withdrawal Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Current and After Sections -->
        <div class="grid grid-cols-2 gap-4">
          <!-- Current Section -->
          <div class="space-y-3">
            <h3 class="text-lg font-semibold text-gray-900 text-left">{{ t('pointWithdrawal.current') }}</h3>
            
            <!-- Current Point -->
            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <label class="text-gray-700 font-medium">{{ t('pointWithdrawal.point') }}</label>
              </div>
              <Input
                :value="formatNumber(currentPoint)"
                readonly
                class="bg-gray-100 border-gray-300 text-gray-900"
              />
            </div>

            <!-- Current Balance -->
            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <label class="text-gray-700 font-medium">{{ t('pointWithdrawal.balance') }}</label>
              </div>
              <Input
                :value="formatNumber(currentBalance)"
                readonly
                class="bg-gray-100 border-gray-300 text-gray-900"
              />
            </div>
          </div>

          <!-- After Section -->
          <div class="space-y-3">
            <h3 class="text-lg font-semibold text-gray-900 text-left">{{ t('pointWithdrawal.after') }}</h3>
            
            <!-- After Point -->
            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <label class="text-gray-700 font-medium">{{ t('pointWithdrawal.point') }}</label>
              </div>
              <Input
                :value="formatNumber(afterPoint)"
                readonly
                class="bg-gray-100 border-gray-300 text-gray-900"
              />
            </div>

            <!-- After Balance -->
            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <label class="text-gray-700 font-medium">{{ t('pointWithdrawal.balance') }}</label>
              </div>
              <Input
                :value="formatNumber(afterBalance)"
                readonly
                class="bg-gray-100 border-gray-300 text-gray-900"
              />
            </div>
          </div>
        </div>

        <!-- Point Amount Input -->
        <div class="space-y-2">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <label class="text-gray-700 font-medium">{{ t('pointWithdrawal.pointAmount') }}</label>
          </div>
          <div class="flex space-x-2">
            <Input
              v-model="form.pointAmount"
              type="number"
              :placeholder="t('pointWithdrawal.pointAmountPlaceholder')"
              :class="{ 'border-red-500': errors.pointAmount }"
              class="flex-1 bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500"
            />
            <Button
              type="button"
              @click="setMaxAmount"
              class="bg-purple-600 hover:bg-purple-700 text-white border-purple-600 hover:border-purple-700"
            >
              {{ t('pointWithdrawal.maxAmount') }}
            </Button>
          </div>
          <p v-if="errors.pointAmount" class="text-red-400 text-sm">{{ errors.pointAmount }}</p>
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
              class="!bg-gray-500 hover:!bg-gray-600 !text-white !border-gray-500 hover:!border-gray-600 py-2 px-3 text-sm font-medium rounded-md transition-colors"
            >
              {{ t('pointWithdrawal.reset') }}
            </Button>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            @click="handleOpenChange(false)"
            class="flex-1 bg-gray-500 hover:bg-gray-600 text-white border-gray-500 hover:border-gray-600"
          >
            {{ t('pointWithdrawal.cancel') }}
          </Button>
          <Button
            type="submit"
            :disabled="isSubmitting"
            class="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white border-purple-600 hover:border-purple-700"
          >
            {{ isSubmitting ? t('pointWithdrawal.transferring') : t('pointWithdrawal.transfer') }}
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
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

const { t } = useI18n()

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
  pointAmount: ''
})

// Form state
const isSubmitting = ref(false)
const errors = reactive({
  pointAmount: ''
})

// Sample data (replace with actual data from API)
const currentPoint = ref(3749246)
const currentBalance = ref(78400)

// Computed values
const pointAmount = computed(() => {
  const amount = parseInt(form.pointAmount) || 0
  return amount
})

const afterPoint = computed(() => {
  return Math.max(0, currentPoint.value - pointAmount.value)
})

const afterBalance = computed(() => {
  return Math.max(0, currentBalance.value - pointAmount.value)
})

// Reactive validation schema
const withdrawalSchema = computed(() => z.object({
  pointAmount: z.string()
    .min(1, t('pointWithdrawal.errors.pointAmountRequired'))
    .refine((val) => {
      const amount = parseInt(val)
      return !isNaN(amount) && amount > 0
    }, t('pointWithdrawal.errors.pointAmountPositive'))
    .refine((val) => {
      const amount = parseInt(val)
      return amount <= currentPoint.value
    }, t('pointWithdrawal.errors.pointAmountExceedsPoints'))
    .refine((val) => {
      const amount = parseInt(val)
      return amount <= currentBalance.value
    }, t('pointWithdrawal.errors.pointAmountExceedsBalance'))
    .refine((val) => {
      const amount = parseInt(val)
      return amount >= 10000
    }, t('pointWithdrawal.errors.pointAmountMinimum'))
}))

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
  form.pointAmount = ''
  errors.pointAmount = ''
}

const formatNumber = (num: number): string => {
  return num.toLocaleString()
}

const setAmount = (amount: number) => {
  form.pointAmount = amount.toString()
}

const setMaxAmount = () => {
  const maxAmount = Math.min(currentPoint.value, currentBalance.value)
  form.pointAmount = maxAmount.toString()
}

const resetAmount = () => {
  form.pointAmount = ''
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
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Point withdrawal successful:', {
      pointAmount: form.pointAmount,
      currentPoint: currentPoint.value,
      currentBalance: currentBalance.value
    })
    
    // Close modal and reset form
    emit('update:open', false)
    resetForm()
    
    // You can add a success notification here
  } catch (error) {
    console.error('Failed to withdraw points:', error)
    // You can add an error notification here
  } finally {
    isSubmitting.value = false
  }
}
</script>
