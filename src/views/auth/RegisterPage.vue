<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-20">
    <div class="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
      <!-- Logo/Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-orbitron font-black text-gray-900">{{ t('register.title') }}</h1>
        <div class="text-gray-400 text-sm mt-1 flex flex-col items-center">
          <span class="mt-3 font-bold text-xl text-gray-800">{{ t('register.subtitleLine1') }}</span>
          <span class="mt-1 text-md">{{ t('register.subtitleLine2') }}</span>
        </div>
      </div>

      <!-- Registration Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Basic Information Section -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 border-b border-gray-300 pb-2">{{ t('register.basicInformation') }}</h3>
          
          <!-- Username Field -->
          <div class="space-y-2">
            <div class="flex items-center space-x-2">
              <User class="w-5 h-5 text-gray-700" />
              <label class="text-gray-700 font-medium">{{ t('register.username') }}</label>
            </div>
            <Input
              v-model="form.username"
              type="text"
              :placeholder="t('register.usernamePlaceholder')"
              :class="{ 'border-red-500': errors.username }"
              class="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500 rounded-[4px] h-12"
            />
            <p v-if="errors.username" class="text-red-400 text-sm">{{ errors.username }}</p>
          </div>

          <!-- Password Field -->
          <div class="space-y-2">
            <div class="flex items-center space-x-2">
              <Lock class="w-5 h-5 text-gray-700" />
              <label class="text-gray-700 font-medium">{{ t('register.password') }}</label>
            </div>
            <div class="relative">
              <Input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                :placeholder="t('register.passwordPlaceholder')"
                :class="{ 'border-red-500': errors.password }"
                class="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500 pr-12 rounded-[4px] h-12"
              />
              <button
                type="button"
                @click="togglePassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <EyeOff v-if="showPassword" class="w-5 h-5" />
                <Eye v-else class="w-5 h-5" />
              </button>
            </div>
            <p v-if="errors.password" class="text-red-400 text-sm">{{ errors.password }}</p>
          </div>

          <!-- Confirm Password Field -->
          <div class="space-y-2">
            <div class="flex items-center space-x-2">
              <Lock class="w-5 h-5 text-gray-700" />
              <label class="text-gray-700 font-medium">{{ t('register.confirmPassword') }}</label>
            </div>
            <div class="relative">
                          <Input
              v-model="form.confirm_pass"
              :type="showConfirmPassword ? 'text' : 'password'"
              :placeholder="t('register.confirmPasswordPlaceholder')"
              :class="{ 'border-red-500': errors.confirm_pass }"
              class="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500 pr-12 rounded-[4px] h-12"
            />
              <button
                type="button"
                @click="toggleConfirmPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <EyeOff v-if="showConfirmPassword" class="w-5 h-5" />
                <Eye v-else class="w-5 h-5" />
              </button>
            </div>
            <p v-if="errors.confirm_pass" class="text-red-400 text-sm">{{ errors.confirm_pass }}</p>
          </div>

          <!-- Name Field -->
          <div class="space-y-2">
            <div class="flex items-center space-x-2">
              <User class="w-5 h-5 text-gray-700" />
              <label class="text-gray-700 font-medium">{{ t('register.name') }}</label>
            </div>
            <Input
              v-model="form.name"
              type="text"
              :placeholder="t('register.namePlaceholder')"
              :class="{ 'border-red-500': errors.name }"
              class="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500 rounded-[4px] h-12"
            />
            <p v-if="errors.name" class="text-red-400 text-sm">{{ errors.name }}</p>
          </div>

          <!-- Mobile Number Field -->
          <div class="space-y-2">
            <div class="flex items-center space-x-2">
              <Phone class="w-5 h-5 text-gray-700" />
              <label class="text-gray-700 font-medium">{{ t('register.mobileNumber') }}</label>
            </div>
            <div class="relative">
            <Input
              v-model="form.mobile"
              type="tel"
              :placeholder="t('register.mobileNumberPlaceholder')"
              :class="{ 'border-red-500': errors.mobile }"
              class="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500 pr-12 rounded-[4px] h-12"
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
            <p v-if="errors.mobile" class="text-red-400 text-sm">{{ errors.mobile }}</p>
          </div>
        </div>

        <!-- Account Information Section -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 border-b border-gray-300 pb-2">{{ t('register.accountInformation') }}</h3>
          
          <!-- Bank Name Field -->
          <div class="space-y-2">
            <div class="flex items-center space-x-2">
              <Building2 class="w-5 h-5 text-gray-700" />
              <label class="text-gray-700 font-medium">{{ t('register.bankName') }}</label>
            </div>
            <Select
              v-model="form.bank_name"
              :class="{ 'border-red-500': errors.bank_name }"
              class="bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-purple-500 rounded-[4px] h-12"
            >
              <option value="" disabled class="bg-white text-gray-500">{{ t('register.bankNamePlaceholder') }}</option>
              <option 
                v-for="bank in banks" 
                :key="bank" 
                :value="bank" 
                class="bg-white text-gray-900"
              >
                {{ bank }}
              </option>
            </Select>
            <p v-if="errors.bank_name" class="text-red-400 text-sm">{{ errors.bank_name }}</p>
          </div>

          <!-- Bank Account Name Field -->
          <div class="space-y-2">
            <div class="flex items-center space-x-2">
              <User class="w-5 h-5 text-gray-700" />
              <label class="text-gray-700 font-medium">{{ t('register.bankAccountName') }}</label>
            </div>
            <Input
              v-model="form.bank_account_name"
              type="text"
              :placeholder="t('register.bankAccountNamePlaceholder')"
              :class="{ 'border-red-500': errors.bank_account_name }"
              class="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500 rounded-[4px] h-12"
            />
            <p v-if="errors.bank_account_name" class="text-red-400 text-sm">{{ errors.bank_account_name }}</p>
          </div>

          <!-- Bank Account Field -->
          <div class="space-y-2">
            <div class="flex items-center space-x-2">
              <CreditCard class="w-5 h-5 text-gray-700" />
              <label class="text-gray-700 font-medium">{{ t('register.bankAccount') }}</label>
            </div>
            <div class="relative">
                          <Input
              v-model="form.bank_account"
              type="text"
              :placeholder="t('register.bankAccountPlaceholder')"
              :class="{ 'border-red-500': errors.bank_account }"
              class="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500 pr-12 rounded-[4px] h-12"
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
            <p v-if="errors.bank_account" class="text-red-400 text-sm">{{ errors.bank_account }}</p>
          </div>
        </div>

        <!-- Referral and Captcha Section -->
        <div class="space-y-4">
          <!-- Referral Code Field -->
          <div class="space-y-2">
            <div class="flex items-center space-x-2">
              <Tag class="w-5 h-5 text-gray-700" />
              <label class="text-gray-700 font-medium">{{ t('register.referralCode') }}</label>
            </div>
            <Input
              v-model="form.recommand"
              type="text"
              :placeholder="t('register.referralCodePlaceholder')"
              class="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500 rounded-[4px] h-12"
            />
          </div>

          <!-- Captcha Field -->
          <div class="space-y-2">
            <!-- Captcha Display -->
            <div class="flex items-center justify-center space-x-2 border border-gray-300 rounded-lg p-4">
              <span v-html="authStore.cvalue"/>
            </div>
            
            <div class="flex items-center space-x-2">
              <Lock class="w-5 h-5 text-gray-700" />
              <label class="text-gray-700 font-medium">{{ t('register.captcha') }}</label>
            </div>
            
            <div class="flex space-x-2">
              <Input
                v-model="form.captcha"
                type="text"
                :placeholder="t('register.captchaPlaceholder')"
                :class="{ 'border-red-500': errors.captcha }"
                class="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500 rounded-[4px] h-12"
              />
              <Button
                type="button"
                @click="refreshServerCaptcha"
                variant="outline"
                size="icon"
                class="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 h-12"
              >
                <RefreshCw class="w-4 h-4" />
              </Button>
            </div>
            <p v-if="errors.captcha" class="text-red-400 text-sm">{{ errors.captcha }}</p>
          </div>
        </div>

        <!-- Create Account Button -->
        <Button
          type="submit"
          class="cursor-pointer w-full text-white font-medium h-[66px] !transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg register-button"
          :disabled="isSubmitting"
        >
          <span class="text-xl" v-if="isSubmitting">{{ t('register.creatingAccount') }}</span>
          <span class="text-xl" v-else>{{ t('register.createAccountButton') }}</span>
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
import { ref, reactive, onMounted, computed } from 'vue'
import { z } from 'zod'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { Input } from '../../components/ui/input'
import Button from '../../components/ui/Button.vue'
import Select from '../../components/ui/select.vue'
import { useAuthStore } from '../../stores/auth'
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Phone, 
  Building2, 
  CreditCard, 
  Tag, 
  RefreshCw 
} from 'lucide-vue-next'

interface IRegForm {
  username: string;
  password: string;
  confirm_pass: string;
  name: string;
  mobile: number;
  bank_name: string;
  bank_account_name: string;
  bank_account: number;
  recommand: string;
  captcha: number;
}

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

// Bank list
const banks = [
  "KB국민은행",
  "신한은행",
  "우리은행",
  "KEB하나은행",
  "카카오뱅크",
  "카카오증권",
  "KDB산업은행",
  "IBK기업은행",
  "NH농협은행",
  "수협은행",
  "대구은행",
  "BNK부산은행",
  "BNK경남은행",
  "광주은행",
  "전북은행",
  "제주은행",
  "농·축협",
  "농협",
  "축협",
  "새마을금고",
  "우체국",
  "신용협동조합",
  "산림조합",
  "HSBC은행",
  "한국씨티은행",
  "한국스탠다드차타드은행",
  "미래애셋",
  "SC제일은행",
]

// Form validation schema - computed to be reactive to language changes
const registerSchema = computed(() => z.object({
  username: z.string()
    .min(1, t('register.errors.usernameRequired'))
    .min(3, t('register.errors.usernameMinLength'))
    .max(7, t('register.errors.usernameMaxLength'))
    .regex(/^[a-z0-9]+$/i, t('register.errors.usernameFormat')),
  password: z.string()
    .min(1, t('register.errors.passwordRequired'))
    .min(8, t('register.errors.passwordMinLength'))
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, t('register.errors.passwordFormat')),
  confirm_pass: z.string()
    .min(1, t('register.errors.confirmPasswordRequired')),
  name: z.string()
    .min(1, t('register.errors.nameRequired'))
    .min(2, t('register.errors.nameMinLength'))
    .max(7, t('register.errors.nameMaxLength')),
  mobile: z.string()
    .min(1, t('register.errors.mobileNumberRequired'))
    .min(8, t('register.errors.mobileNumberMinLength'))
    .max(12, t('register.errors.mobileNumberMaxLength'))
    .regex(/^[0-9]+$/i, t('register.errors.mobileNumberFormat')),
  bank_name: z.string()
    .min(1, t('register.errors.bankNameRequired')),
  bank_account_name: z.string()
    .min(1, t('register.errors.bankAccountNameRequired'))
    .regex(/[^0-9.]/g, t('register.errors.bankAccountNameFormat')),
  bank_account: z.string()
    .min(1, t('register.errors.bankAccountRequired'))
    .min(10, t('register.errors.bankAccountMinLength'))
    .regex(/^[0-9]+$/i, t('register.errors.bankAccountFormat')),
  recommand: z.string().optional(),
  captcha: z.string()
    .min(1, t('register.errors.captchaRequired'))
}).refine((data) => data.password === data.confirm_pass, {
  message: t('register.errors.passwordsDontMatch'),
  path: ["confirm_pass"],
}))

type RegisterForm = {
  username: string;
  password: string;
  confirm_pass: string;
  name: string;
  mobile: string;
  bank_name: string;
  bank_account_name: string;
  bank_account: string;
  recommand: string;
  captcha: string;
}

// Form data
const form = reactive({
  username: '',
  password: '',
  confirm_pass: '',
  name: '',
  mobile: '',
  bank_name: '',
  bank_account_name: '',
  bank_account: '',
  recommand: '',
  captcha: ''
})

// Form state
const errors = reactive<Partial<RegisterForm>>({})
const isSubmitting = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Refresh server captcha
const refreshServerCaptcha = async (): Promise<void> => {
  try {
    await authStore.getCaptcha()
    form.captcha = ''
    errors.captcha = undefined
  } catch (error) {
    console.error(t('register.refreshCaptchaError'), error)
  }
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
    registerSchema.value.parse(form)
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
  if (!form.captcha) {
    errors.captcha = t('register.errors.captchaRequired')
    return
  }

  isSubmitting.value = true

  try {    
    const registrationData: IRegForm = {
      username: form.username,
      password: form.password,
      confirm_pass: form.confirm_pass,
      name: form.name,
      mobile: parseInt(form.mobile),
      bank_name: form.bank_name,
      bank_account_name: form.bank_account_name,
      bank_account: parseInt(form.bank_account),
      recommand: form.recommand,
      captcha: parseInt(form.captcha)
    }
    
    const resp = await authStore.register(registrationData)

    if (resp.success) {
      await Swal.fire({
        icon: 'success',
        title: t('register.successTitle'),
        text: t('register.successMessage'),
        timer: 2000,
        showConfirmButton: false
      })
      router.push("/login")
    } else {
      // Handle registration error
      Swal.fire({
        icon: 'error',
        title: t('register.errorTitle'),
        text: resp.msg || t('register.errorMessage'),
        confirmButtonText: t('register.ok')
      })
    }
  } catch (error) {
    console.error('Registration failed:', error)
    Swal.fire({
      icon: 'error',
      title: t('register.errorTitle'),
      text: t('register.errorMessage'),
      confirmButtonText: t('register.ok')
    })
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
/* Register page specific styles */
.register-button {
  background: linear-gradient(90deg, rgb(56, 51, 216) 0%, rgb(26, 22, 141) 100%);
}

.register-button:hover {
  background: linear-gradient(90deg, rgb(67, 56, 202) 0%, rgb(37, 99, 235) 100%);
}
</style>
