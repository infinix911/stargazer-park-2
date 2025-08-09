<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-20">
    <div class="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
      <!-- Logo/Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-orbitron font-bold text-gray-900">{{ t('register.title') }}</h1>
      </div>

      <!-- Registration Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Basic Information Section -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 border-b border-gray-300 pb-2">{{ t('register.basicInformation') }}</h3>
          
          <!-- Username Field -->
          <div class="space-y-2">
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <label class="text-gray-700 font-medium">{{ t('register.username') }}</label>
            </div>
            <Input
              v-model="form.username"
              type="text"
              :placeholder="t('register.usernamePlaceholder')"
              :class="{ 'border-red-500': errors.username }"
              class="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500"
            />
            <p v-if="errors.username" class="text-red-400 text-sm">{{ errors.username }}</p>
          </div>

          <!-- Password Field -->
          <div class="space-y-2">
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              <label class="text-gray-700 font-medium">{{ t('register.password') }}</label>
            </div>
            <div class="relative">
              <Input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                :placeholder="t('register.passwordPlaceholder')"
                :class="{ 'border-red-500': errors.password }"
                class="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500 pr-12"
              />
              <button
                type="button"
                @click="togglePassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>
            </div>
            <p v-if="errors.password" class="text-red-400 text-sm">{{ errors.password }}</p>
          </div>

          <!-- Confirm Password Field -->
          <div class="space-y-2">
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              <label class="text-gray-700 font-medium">{{ t('register.confirmPassword') }}</label>
            </div>
            <div class="relative">
              <Input
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                :placeholder="t('register.confirmPasswordPlaceholder')"
                :class="{ 'border-red-500': errors.confirmPassword }"
                class="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500 pr-12"
              />
              <button
                type="button"
                @click="toggleConfirmPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg v-if="showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>
            </div>
            <p v-if="errors.confirmPassword" class="text-red-400 text-sm">{{ errors.confirmPassword }}</p>
          </div>

          <!-- Name Field -->
          <div class="space-y-2">
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <label class="text-gray-700 font-medium">{{ t('register.name') }}</label>
            </div>
            <Input
              v-model="form.name"
              type="text"
              :placeholder="t('register.namePlaceholder')"
              :class="{ 'border-red-500': errors.name }"
              class="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500"
            />
            <p v-if="errors.name" class="text-red-400 text-sm">{{ errors.name }}</p>
          </div>

          <!-- Mobile Number Field -->
          <div class="space-y-2">
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              <label class="text-gray-700 font-medium">{{ t('register.mobileNumber') }}</label>
            </div>
            <div class="relative">
              <Input
                v-model="form.mobileNumber"
                type="tel"
                :placeholder="t('register.mobileNumberPlaceholder')"
                :class="{ 'border-red-500': errors.mobileNumber }"
                class="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500 pr-12"
              />
              <div class="absolute right-3 top-1/2 transform -translate-y-1/2 flex flex-col">
                <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                </svg>
                <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
            <p v-if="errors.mobileNumber" class="text-red-400 text-sm">{{ errors.mobileNumber }}</p>
          </div>
        </div>

        <!-- Account Information Section -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 border-b border-gray-300 pb-2">{{ t('register.accountInformation') }}</h3>
          
          <!-- Bank Name Field -->
          <div class="space-y-2">
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <label class="text-gray-700 font-medium">{{ t('register.bankName') }}</label>
            </div>
            <Select
              v-model="form.bankName"
              :class="{ 'border-red-500': errors.bankName }"
              class="bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-purple-500"
            >
              <option value="" disabled class="bg-white text-gray-500">{{ t('register.bankNamePlaceholder') }}</option>
              <option value="KB국민은행" class="bg-white text-gray-900">KB국민은행</option>
              <option value="신한은행" class="bg-white text-gray-900">신한은행</option>
              <option value="우리은행" class="bg-white text-gray-900">우리은행</option>
              <option value="하나은행" class="bg-white text-gray-900">하나은행</option>
              <option value="NH농협은행" class="bg-white text-gray-900">NH농협은행</option>
              <option value="기업은행" class="bg-white text-gray-900">기업은행</option>
            </Select>
            <p v-if="errors.bankName" class="text-red-400 text-sm">{{ errors.bankName }}</p>
          </div>

          <!-- Bank Account Name Field -->
          <div class="space-y-2">
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <label class="text-gray-700 font-medium">{{ t('register.bankAccountName') }}</label>
            </div>
            <Input
              v-model="form.bankAccountName"
              type="text"
              :placeholder="t('register.bankAccountNamePlaceholder')"
              :class="{ 'border-red-500': errors.bankAccountName }"
              class="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500"
            />
            <p v-if="errors.bankAccountName" class="text-red-400 text-sm">{{ errors.bankAccountName }}</p>
          </div>

          <!-- Bank Account Field -->
          <div class="space-y-2">
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              <label class="text-gray-700 font-medium">{{ t('register.bankAccount') }}</label>
            </div>
            <div class="relative">
              <Input
                v-model="form.bankAccount"
                type="text"
                :placeholder="t('register.bankAccountPlaceholder')"
                :class="{ 'border-red-500': errors.bankAccount }"
                class="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500 pr-12"
              />
              <div class="absolute right-3 top-1/2 transform -translate-y-1/2 flex flex-col">
                <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                </svg>
                <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
            <p v-if="errors.bankAccount" class="text-red-400 text-sm">{{ errors.bankAccount }}</p>
          </div>
        </div>

        <!-- Referral and Captcha Section -->
        <div class="space-y-4">
          <!-- Referral Code Field -->
          <div class="space-y-2">
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
              </svg>
              <label class="text-gray-700 font-medium">{{ t('register.referralCode') }}</label>
            </div>
            <Input
              v-model="form.referralCode"
              type="text"
              :placeholder="t('register.referralCodePlaceholder')"
              class="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>

          <!-- Captcha Field -->
          <div class="space-y-2">
            <!-- Captcha Display -->
            <div class="bg-white rounded-lg p-4 text-center border border-gray-300">
              <div class="text-2xl font-bold text-gray-800 relative">
                {{ captcha.num1 }} + {{ captcha.num2 }}
                <div class="absolute inset-0 border-b-2 border-gray-300 transform -rotate-1"></div>
              </div>
            </div>
            
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              <label class="text-gray-700 font-medium">{{ t('register.captcha') }}</label>
            </div>
            
            <div class="flex space-x-2">
              <Input
                v-model="form.captcha"
                type="text"
                :placeholder="t('register.captchaPlaceholder')"
                :class="{ 'border-red-500': errors.captcha }"
                class="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500"
              />
              <Button
                type="button"
                @click="generateCaptcha"
                variant="outline"
                size="icon"
                class="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
              </Button>
            </div>
            <p v-if="errors.captcha" class="text-red-400 text-sm">{{ errors.captcha }}</p>
          </div>
        </div>

        <!-- Create Account Button -->
        <Button
          type="submit"
          class="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-3"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting">{{ t('register.creatingAccount') }}</span>
          <span v-else>{{ t('register.createAccountButton') }}</span>
        </Button>
      </form>

      <!-- Login Link -->
      <div class="text-center mt-6">
        <p class="text-gray-600 text-sm">
          {{ t('register.alreadyHaveAccount') }} 
          <a href="/login" class="text-purple-600 hover:text-purple-700 font-medium">
            {{ t('register.loginHere') }}
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { z } from 'zod'
import { useI18n } from 'vue-i18n'
import { Input } from '../../components/ui/input'
import Button from '../../components/ui/Button.vue'
import Select from '../../components/ui/select.vue'

const { t } = useI18n()

// Form validation schema
const registerSchema = z.object({
  username: z.string()
    .min(1, t('register.errors.usernameRequired'))
    .min(3, t('register.errors.usernameMinLength'))
    .max(20, t('register.errors.usernameMaxLength'))
    .regex(/^[a-zA-Z0-9_]+$/, t('register.errors.usernameFormat')),
  password: z.string()
    .min(1, t('register.errors.passwordRequired'))
    .min(8, t('register.errors.passwordMinLength'))
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, t('register.errors.passwordFormat')),
  confirmPassword: z.string()
    .min(1, t('register.errors.confirmPasswordRequired')),
  name: z.string()
    .min(1, t('register.errors.nameRequired'))
    .min(2, t('register.errors.nameMinLength')),
  mobileNumber: z.string()
    .min(1, t('register.errors.mobileNumberRequired'))
    .regex(/^[0-9+\-\s()]+$/, t('register.errors.mobileNumberFormat')),
  bankName: z.string()
    .min(1, t('register.errors.bankNameRequired')),
  bankAccountName: z.string()
    .min(1, t('register.errors.bankAccountNameRequired')),
  bankAccount: z.string()
    .min(1, t('register.errors.bankAccountRequired'))
    .regex(/^[0-9-]+$/, t('register.errors.bankAccountFormat')),
  referralCode: z.string().optional(),
  captcha: z.string()
    .min(1, t('register.errors.captchaRequired'))
}).refine((data) => data.password === data.confirmPassword, {
  message: t('register.errors.passwordsDontMatch'),
  path: ["confirmPassword"],
})

type RegisterForm = z.infer<typeof registerSchema>

// Form data
const form = reactive<RegisterForm>({
  username: '',
  password: '',
  confirmPassword: '',
  name: '',
  mobileNumber: '',
  bankName: '',
  bankAccountName: '',
  bankAccount: '',
  referralCode: '',
  captcha: ''
})

// Form state
const errors = reactive<Partial<RegisterForm>>({})
const isSubmitting = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Captcha state
const captcha = reactive({
  num1: 3,
  num2: 2,
  answer: 5
})

// Generate new captcha
const generateCaptcha = (): void => {
  captcha.num1 = Math.floor(Math.random() * 10) + 1
  captcha.num2 = Math.floor(Math.random() * 10) + 1
  captcha.answer = captcha.num1 + captcha.num2
  form.captcha = ''
  errors.captcha = undefined
}

// Toggle password visibility
const togglePassword = (): void => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPassword = (): void => {
  showConfirmPassword.value = !showConfirmPassword.value
}

// Validate form
const validateForm = (): boolean => {
  try {
    registerSchema.parse(form)
    Object.keys(errors).forEach(key => {
      delete errors[key as keyof RegisterForm]
    })
    return true
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zodError = error as z.ZodError
      zodError.issues.forEach((issue) => {
        const field = issue.path[0] as keyof RegisterForm
        errors[field] = issue.message
      })
    }
    return false
  }
}

// Handle form submission
const handleSubmit = async (): Promise<void> => {
  if (!validateForm()) return

  // Validate captcha
  if (parseInt(form.captcha) !== captcha.answer) {
    errors.captcha = t('register.errors.captchaIncorrect')
    return
  }

  isSubmitting.value = true

  try {
    console.log('Registration attempt:', form)
    // Add your registration logic here
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
    console.log('Registration successful')
    // Navigate to login or dashboard
  } catch (error) {
    console.error('Registration failed:', error)
  } finally {
    isSubmitting.value = false
  }
}

// Handle close
const handleClose = (): void => {
  console.log('Close registration form')
  // Navigate back to home or login
  window.location.href = '/login'
}

// Generate initial captcha
generateCaptcha()
</script>

<style scoped>
/* Register page specific styles */
</style>
