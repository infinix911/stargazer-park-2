<template>
  <Dialog :open="isOpen" @update:open="handleOpenChange">
    <DialogContent class="w-full max-w-md bg-white p-8">
      <!-- Form Title -->
      <DialogHeader class="text-center mb-8">
        <DialogTitle class="text-3xl font-orbitron font-bold text-gray-900">
          {{ $t('changePassword.title') }}
        </DialogTitle>
        <DialogDescription class="text-gray-600 mt-2">
          {{ $t('changePassword.description') }}
        </DialogDescription>
      </DialogHeader>

      <!-- Change Password Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Current Password -->
        <div class="space-y-2">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <label class="text-gray-700 font-medium">{{ $t('changePassword.currentPassword') }}</label>
          </div>
          <div class="relative">
            <Input
              v-model="form.currentPassword"
              :type="showCurrentPassword ? 'text' : 'password'"
              :placeholder="$t('changePassword.currentPasswordPlaceholder')"
              :class="{ 'border-red-500': errors.currentPassword }"
              class="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500"
            />
            <button
              type="button"
              @click="showCurrentPassword = !showCurrentPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg v-if="showCurrentPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
          <p v-if="errors.currentPassword" class="text-red-400 text-sm">{{ errors.currentPassword }}</p>
        </div>

        <!-- New Password -->
        <div class="space-y-2">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <label class="text-gray-700 font-medium">{{ $t('changePassword.newPassword') }}</label>
          </div>
          <div class="relative">
            <Input
              v-model="form.newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              :placeholder="$t('changePassword.newPasswordPlaceholder')"
              :class="{ 'border-red-500': errors.newPassword }"
              class="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500"
            />
            <button
              type="button"
              @click="showNewPassword = !showNewPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg v-if="showNewPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
          <p v-if="errors.newPassword" class="text-red-400 text-sm">{{ errors.newPassword }}</p>
        </div>

        <!-- Verify Password -->
        <div class="space-y-2">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <label class="text-gray-700 font-medium">{{ $t('changePassword.verifyPassword') }}</label>
          </div>
          <div class="relative">
            <Input
              v-model="form.verifyPassword"
              :type="showVerifyPassword ? 'text' : 'password'"
              :placeholder="$t('changePassword.verifyPasswordPlaceholder')"
              :class="{ 'border-red-500': errors.verifyPassword }"
              class="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500"
            />
            <button
              type="button"
              @click="showVerifyPassword = !showVerifyPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg v-if="showVerifyPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
          <p v-if="errors.verifyPassword" class="text-red-400 text-sm">{{ errors.verifyPassword }}</p>
        </div>

        <!-- Action Buttons -->
        <div class="flex space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            @click="handleOpenChange(false)"
            class="flex-1 bg-gray-500 hover:bg-gray-600 text-white border-gray-500 hover:border-gray-600"
          >
            {{ $t('changePassword.cancel') }}
          </Button>
          <Button
            type="submit"
            :disabled="isSubmitting"
            class="flex-1 bg-[#075d4f] hover:bg-[#064e42] disabled:bg-gray-400 text-white border-[#075d4f] hover:border-[#064e42]"
          >
            {{ isSubmitting ? $t('changePassword.changingPassword') : $t('changePassword.changePassword') }}
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
  currentPassword: '',
  newPassword: '',
  verifyPassword: ''
})

// Password visibility toggles
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showVerifyPassword = ref(false)

// Form state
const isSubmitting = ref(false)
const errors = reactive({
  currentPassword: '',
  newPassword: '',
  verifyPassword: ''
})

// Reactive validation schema
const passwordSchema = computed(() => z.object({
  currentPassword: z.string().min(1, t('changePassword.errors.currentPasswordRequired')),
  newPassword: z.string()
    .min(8, t('changePassword.errors.newPasswordMinLength'))
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, t('changePassword.errors.newPasswordFormat')),
  verifyPassword: z.string().min(1, t('changePassword.errors.verifyPasswordRequired'))
}).refine((data) => data.newPassword === data.verifyPassword, {
  message: t('changePassword.errors.passwordsDontMatch'),
  path: ["verifyPassword"]
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
  form.currentPassword = ''
  form.newPassword = ''
  form.verifyPassword = ''
  showCurrentPassword.value = false
  showNewPassword.value = false
  showVerifyPassword.value = false
  errors.currentPassword = ''
  errors.newPassword = ''
  errors.verifyPassword = ''
}

const validateForm = () => {
  try {
    const result = passwordSchema.value.parse(form)
    // Clear any existing errors
    errors.currentPassword = ''
    errors.newPassword = ''
    errors.verifyPassword = ''
    return true
  } catch (error: any) {
    // Clear previous errors
    errors.currentPassword = ''
    errors.newPassword = ''
    errors.verifyPassword = ''
    
    if (error && error.constructor.name === 'ZodError') {
      error.issues.forEach((err: any) => {
        const field = err.path[0]
        if (field === 'currentPassword') {
          errors.currentPassword = err.message
        }
        if (field === 'newPassword') {
          errors.newPassword = err.message
        }
        if (field === 'verifyPassword') {
          errors.verifyPassword = err.message
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
    
    // Close modal and reset form
    emit('update:open', false)
    resetForm()
    
    // You can add a success notification here
  } catch (error) {
    console.error('Failed to change password:', error)
    // You can add an error notification here
  } finally {
    isSubmitting.value = false
  }
}
</script>
