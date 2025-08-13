<template>
  <Dialog :open="open" @update:open="$emit('close')">
    <DialogContent class="w-[95vw] max-w-md sm:max-w-lg lg:max-w-2xl bg-[#2c334a] border border-[#2d334b] p-0 overflow-hidden max-h-[90vh] flex flex-col">
      <!-- Form Title -->
      <DialogHeader class="bg-gradient-to-r from-[#00c990] to-[#3b959c] text-white p-4 sm:p-6 flex-shrink-0">
        <DialogTitle class="text-lg sm:text-xl lg:text-2xl font-bold flex items-center justify-start space-x-3">
          <span>{{ t('contactUs.title') }}</span>
        </DialogTitle>
        <DialogDescription class="text-white/80 mt-2 text-left text-sm sm:text-base">
          <!-- {{ t('contactUs.description') }} -->
        </DialogDescription>
      </DialogHeader>

      <!-- Contact Form -->
      <form @submit.prevent="handleSubmit" class="p-4 sm:p-6 space-y-4 sm:space-y-6 flex-1 overflow-y-auto">
        <!-- Title Field -->
        <div class="space-y-2 sm:space-y-3">
          <div class="flex items-center space-x-2">
            <FileText class="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" />
            <label class="text-white font-semibold text-lg">{{ t('contactUs.fields.title') }}</label>
          </div>
          <div class="bg-slate-700/50 border border-slate-600 rounded-lg p-3 sm:p-4 shadow-sm">
            <Input
              v-model="form.title"
              type="text"
              :placeholder="t('contactUs.fields.titlePlaceholder')"
              class="bg-transparent border-none text-white placeholder-slate-400 focus:outline-none focus:ring-0 text-lg"
              required
              @input="errors.title = ''"
            />
          </div>
          <div v-if="errors.title" class="text-red-400 text-sm mt-1 flex items-center">
            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
            {{ errors.title }}
          </div>
        </div>

        <!-- Body Field -->
        <div class="space-y-2 sm:space-y-3">
          <div class="flex items-center space-x-2">
            <MessageSquare class="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" />
            <label class="text-white font-semibold text-lg">{{ t('contactUs.fields.message') }}</label>
          </div>
          <div class="bg-slate-700/50 border border-slate-600 rounded-lg p-3 sm:p-4 shadow-sm">
            <textarea
              v-model="form.body"
              :placeholder="t('contactUs.fields.messagePlaceholder')"
              :rows="4"
              class="w-full bg-transparent border-none text-white placeholder-slate-400 focus:outline-none focus:ring-0 resize-none text-lg leading-relaxed"
              required
              @input="errors.body = ''"
            ></textarea>
          </div>
          <div v-if="errors.body" class="text-red-400 text-sm mt-1 flex items-center">
            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
            {{ errors.body }}
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="pt-3 sm:pt-4 flex flex-row justify-end space-x-2 sm:space-x-3">
          <button
            type="button"
            @click="$emit('close')"
            class="cursor-pointer px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 bg-slate-600 text-white border border-slate-500 hover:bg-slate-700 hover:border-slate-400 transition-all duration-200 text-sm sm:text-base font-medium rounded-lg inline-flex items-center justify-center"
          >
            {{ t('contactUs.cancel') }}
          </button>
          <button
            type="submit"
            class="cursor-pointer px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 bg-[#95b1f8] hover:bg-[#95b1f8]/80 text-black font-semibold rounded-lg shadow-lg transition-all duration-200 text-sm sm:text-base inline-flex items-center justify-center"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting" class="flex items-center justify-center">
              <div class="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-black mr-2"></div>
              {{ t('contactUs.submitting') }}
            </span>
            <span v-else>{{ t('contactUs.submit') }}</span>
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import Button from '@/components/ui/Button.vue'
import {
  FileText,
  MessageSquare
} from 'lucide-vue-next'
import ApiService from '@/services/ApiService'
import Swal from 'sweetalert2'

const { t } = useI18n()

// Zod validation schema
const contactFormSchema = z.object({
  title: z.string()
    .min(1, t('contactUs.validation.titleRequired'))
    .min(3, t('contactUs.validation.titleMinLength')),
  body: z.string()
    .min(1, t('contactUs.validation.messageRequired'))
    .min(10, t('contactUs.validation.messageMinLength'))
})

type ContactFormData = z.infer<typeof contactFormSchema>

// Props
interface Props {
  open: boolean
}

defineProps<Props>()

// Emits
const emit = defineEmits<{
  'close': []
}>()

// Form data
const form = reactive<ContactFormData>({
  title: '',
  body: ''
})

// Form errors
const errors = reactive({
  title: '',
  body: ''
})

// Loading state
const isSubmitting = ref(false)

// Methods
const validateForm = (): boolean => {
  // Clear previous errors
  errors.title = ''
  errors.body = ''
  
  const result = contactFormSchema.safeParse({
    title: form.title.trim(),
    body: form.body.trim()
  })
  
  if (!result.success) {
    const zodError = result.error as any
    if (zodError.errors) {
      zodError.errors.forEach((err: any) => {
        if (err.path.includes('title')) {
          errors.title = err.message
        }
        if (err.path.includes('body')) {
          errors.body = err.message
        }
      })
    }
    return false
  }
  
  return true
}

const clearErrors = () => {
  errors.title = ''
  errors.body = ''
}

const handleSubmit = async () => {
  // Validate form
  if (!validateForm()) {
    return
  }
  
  isSubmitting.value = true
  
  try {
    const data = {
      title: form.title.trim(),
      body: form.body.trim()
    }
    
    const response = await ApiService.post("/inquiry", data)
    
    // Show success message
    Swal.fire({
      icon: "success",
      title: t("header.Inquiry"),
      text: t("contactUs.successMessage"),
      confirmButtonColor: "#FF0000",
      confirmButtonText: t("notif.Close"),
    })
    
    // Reset form and errors
    form.title = ''
    form.body = ''
    clearErrors()
    
    // Close modal
    emit('close')
    
  } catch (error: any) {
    console.error('Error submitting form:', error)
    
    // Show error message
    Swal.fire({
      icon: "error",
      title: t("header.Inquiry"),
      text: t("notif." + (error.response?.data?.message || "UNKNOWN_ERROR")),
      confirmButtonColor: "#FF0000",
      confirmButtonText: t("notif.Close"),
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* Contact form specific styles */

/* Custom input styling */
:deep(input) {
  background: transparent !important;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}

:deep(input:focus) {
  background: transparent !important;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}

/* Custom textarea styling */
textarea {
  background: transparent !important;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}

textarea:focus {
  background: transparent !important;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}

/* Smooth transitions */
* {
  transition: all 0.2s ease-in-out;
}

/* Hover effects for form containers */
.bg-slate-700\/50:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
</style>
