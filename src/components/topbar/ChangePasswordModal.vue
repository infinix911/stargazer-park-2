<template>
  <Dialog :open="isOpen" @update:open="handleOpenChange">
    <DialogContent class="w-[95vw] max-w-md sm:max-w-lg bg-[#2c334a] border border-[#2d334b] p-0 overflow-hidden max-h-[90vh] flex flex-col">
      <!-- Form Title -->
      <DialogHeader class="text-center p-3 sm:p-4 flex-shrink-0 bg-gradient-to-r from-[#00c990] to-[#3b959c]">
        <DialogTitle class="text-xl sm:text-2xl lg:text-3xl font-orbitron font-bold text-white">
          {{ t('changePassword.title') }}
        </DialogTitle>
        <DialogDescription class="text-white/80 mt-1 text-sm sm:text-base">
          <!-- {{ t('changePassword.description') }} -->
        </DialogDescription>
      </DialogHeader>

      <!-- Change Password Form -->
      <form @submit.prevent="handleSubmit" class="p-3 sm:p-4 space-y-3 sm:space-y-4 flex-1 overflow-y-auto">
        <!-- Current Password -->
        <div class="space-y-1.5">
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <label class="text-white font-medium text-base">{{ t('changePassword.currentPassword') }}</label>
          </div>
          <div class="relative">
            <div class="bg-slate-700/50 border border-slate-600 rounded-lg p-2 sm:p-3">
              <Input
                v-model="form.currentPassword"
                :type="showCurrentPassword ? 'text' : 'password'"
                :placeholder="t('changePassword.currentPasswordPlaceholder')"
                :class="{ 'border-red-500': errors.currentPassword }"
                class="bg-transparent border-none text-white placeholder-slate-400 focus:ring-0 focus:border-none text-sm sm:text-base pr-12"
              />
              <button
                type="button"
                @click="showCurrentPassword = !showCurrentPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <svg v-if="showCurrentPassword" class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
                <svg v-else class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>
          <p v-if="errors.currentPassword" class="text-red-400 text-sm">{{ errors.currentPassword }}</p>
        </div>

        <!-- New Password -->
        <div class="space-y-1.5">
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <label class="text-white font-medium text-base">{{ t('changePassword.newPassword') }}</label>
          </div>
          <div class="relative">
            <div class="bg-slate-700/50 border border-slate-600 rounded-lg p-2 sm:p-3">
              <Input
                v-model="form.newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                :placeholder="t('changePassword.newPasswordPlaceholder')"
                :class="{ 'border-red-500': errors.newPassword }"
                class="bg-transparent border-none text-white placeholder-slate-400 focus:ring-0 focus:border-none text-sm sm:text-base pr-12"
              />
              <button
                type="button"
                @click="showNewPassword = !showNewPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <svg v-if="showNewPassword" class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
                <svg v-else class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>
          <p v-if="errors.newPassword" class="text-red-400 text-sm">{{ errors.newPassword }}</p>
        </div>

        <!-- Verify Password -->
        <div class="space-y-1.5">
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <label class="text-white font-medium text-base">{{ t('changePassword.verifyPassword') }}</label>
          </div>
          <div class="relative">
            <div class="bg-slate-700/50 border border-slate-600 rounded-lg p-2 sm:p-3">
              <Input
                v-model="form.verifyPassword"
                :type="showVerifyPassword ? 'text' : 'password'"
                :placeholder="t('changePassword.verifyPasswordPlaceholder')"
                :class="{ 'border-red-500': errors.verifyPassword }"
                class="bg-transparent border-none text-white placeholder-slate-400 focus:ring-0 focus:border-none text-sm sm:text-base pr-12"
              />
              <button
                type="button"
                @click="showVerifyPassword = !showVerifyPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <svg v-if="showVerifyPassword" class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
                <svg v-else class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>
          <p v-if="errors.verifyPassword" class="text-red-400 text-sm">{{ errors.verifyPassword }}</p>
        </div>

        <!-- Action Buttons -->
        <div class="flex space-x-2 sm:space-x-3 pt-3 sm:pt-4">
          <button
            type="button"
            @click="handleOpenChange(false)"
            class="flex-1 bg-slate-600 text-white border border-slate-500 hover:bg-slate-700 hover:border-slate-400 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center"
          >
            {{ t('changePassword.cancel') }}
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="flex-1 bg-[#95b1f8] hover:bg-[#95b1f8]/80 text-black font-medium py-2 sm:py-2.5 text-sm sm:text-base rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center disabled:bg-gray-400 disabled:text-gray-600"
          >
            {{ isSubmitting ? t('changePassword.changingPassword') : t('changePassword.changePassword') }}
          </button>
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
import ApiService from '@/services/ApiService'
import Swal from 'sweetalert2'

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
  currentPassword: z.string().min(5, t('changePassword.errors.currentPasswordMinLength')),
  newPassword: z.string().min(5, t('changePassword.errors.newPasswordMinLength')),
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
    const data = {
      password: form.currentPassword,
      new_pass: form.newPassword,
      confirm_pass: form.verifyPassword
    }

    await ApiService.post("/auth/change-pass", data)
    
    // Show success message
    Swal.fire({
      icon: 'success',
      title: t('changePassword.success.title'),
      text: t('changePassword.success.message'),
      confirmButtonColor: '#075d4f',
      confirmButtonText: t('common.ok')
    })
    
    // Close modal and reset form
    emit('update:open', false)
    resetForm()
    
  } catch (error: any) {
    console.error('Failed to change password:', error)
    
    // Show error message
    Swal.fire({
      icon: 'error',
      title: t('changePassword.error.title'),
      text: error.response?.data?.message || t('changePassword.error.message'),
      confirmButtonColor: '#FF0000',
      confirmButtonText: t('common.ok')
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* Change password modal specific styles */
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
