<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-20">
    <div class="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
      <!-- Logo/Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-orbitron font-bold text-gray-900">{{ t('login.title') }}</h1>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Username Field -->
        <div class="space-y-2">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            <label class="text-gray-700 font-medium">{{ t('login.username') }}</label>
          </div>
          <Input
            v-model="form.username"
            type="text"
            :placeholder="t('login.usernamePlaceholder')"
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
            <label class="text-gray-700 font-medium">{{ t('login.password') }}</label>
          </div>
          <div class="relative">
            <Input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              :placeholder="t('login.passwordPlaceholder')"
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

        <!-- Captcha Field -->
        <div class="space-y-2">
          <!-- Captcha Display -->
          <div class="flex items-center justify-center space-x-2 border border-gray-300 rounded-lg p-4">
            <span v-html="authStore.cvalue"/>
          </div>

          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            <label class="text-gray-700 font-medium">{{ t('login.captcha') }}</label>
          </div>
          
          <div class="flex space-x-2">
            <Input
              v-model="form.captcha"
              type="text"
              :placeholder="t('login.captchaPlaceholder')"
              :class="{ 'border-red-500': errors.captcha }"
              class="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500"
            />
            <Button
              type="button"
              @click="refreshServerCaptcha"
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

        <!-- Login Button -->
        <Button
          type="submit"
          class="cursor-pointer w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-3"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting">{{ t('login.loggingIn') }}</span>
          <span v-else>{{ t('login.loginButton') }}</span>
        </Button>
      </form>

      <!-- Sign Up Link -->
      <div class="text-center mt-6">
        <p class="text-gray-600 text-sm">
          {{ t('login.noAccount') }} 
          <a href="/register" class="text-purple-600 hover:text-purple-700 font-medium">
            {{ t('login.signupLink') }}
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { z } from 'zod'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { Input } from '../../components/ui/input'
import Button from '../../components/ui/Button.vue'
import { useAuthStore } from '../../stores/auth'
import { useAppStore } from "../../stores/app";

interface ILoginForm {
  username: string;
  password: string;
  captcha: string;
}

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

// Form validation schema
const loginSchema = z.object({
  username: z.string().min(1, t('login.errors.usernameRequired')).min(3, t('login.errors.usernameMinLength')),
  password: z.string().min(1, t('login.errors.passwordRequired')).min(6, t('login.errors.passwordMinLength')),
  captcha: z.string().min(1, t('login.errors.captchaRequired'))
})

type LoginForm = z.infer<typeof loginSchema>

// Form data
const form = reactive<LoginForm>({
  username: '',
  password: '',
  captcha: ''
})

// Form state
const errors = reactive<Partial<LoginForm>>({})
const isSubmitting = ref(false)
const showPassword = ref(false)

// Refresh server captcha
const refreshServerCaptcha = async (): Promise<void> => {
  try {
    await authStore.getCaptcha()
    form.captcha = ''
    errors.captcha = undefined
  } catch (error) {
    console.error(t('login.refreshCaptchaError'), error)
  }
}

// Toggle password visibility
const togglePassword = (): void => {
  showPassword.value = !showPassword.value
}

// Validate form
const validateForm = (): boolean => {
  try {
    loginSchema.parse(form)
    Object.keys(errors).forEach(key => {
      delete errors[key as keyof LoginForm]
    })
    return true
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zodError = error as z.ZodError
      zodError.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LoginForm
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
  if (!form.captcha) {
    errors.captcha = t('login.errors.captchaRequired')
    return
  }

  isSubmitting.value = true

  try {
    const resp = await authStore.login(form as ILoginForm);

    if (resp.success) {
      await Swal.fire({
        icon: 'success',
        title: t('login.successTitle'),
        text: t('login.successMessage'),
        timer: 1000,
        showConfirmButton: false
      })
      router.push("/");
      console.log('Login successful')
    }

  } catch (error) {
    console.error('Login failed:', error)
  } finally {
    isSubmitting.value = false
  }
}

// Get captcha from server on mount
onMounted(() => {
  authStore.getCaptcha()
})
</script>

<style scoped>
/* Login page specific styles */
</style> 