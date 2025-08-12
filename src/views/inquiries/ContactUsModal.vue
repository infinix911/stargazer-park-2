<template>
  <Dialog :open="open" @update:open="$emit('close')">
    <DialogContent class="w-full max-w-2xl bg-white p-0 overflow-hidden">
      <!-- Form Title -->
      <DialogHeader class="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
        <DialogTitle class="text-2xl font-bold flex items-center justify-start space-x-3">
          <MessageSquare class="w-7 h-7 text-white" />
          <span>{{ t('contactUs.title') }}</span>
        </DialogTitle>
        <DialogDescription class="text-purple-100 mt-2 text-left">
          {{ t('contactUs.description') }}
        </DialogDescription>
      </DialogHeader>

      <!-- Contact Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Title Field -->
        <div class="space-y-3">
          <div class="flex items-center space-x-2">
            <FileText class="w-5 h-5 text-purple-600" />
            <label class="text-gray-700 font-semibold text-lg">{{ t('contactUs.fields.title') }}</label>
          </div>
          <div class="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 shadow-sm">
            <Input
              v-model="form.title"
              type="text"
              :placeholder="t('contactUs.fields.titlePlaceholder')"
              class="bg-transparent border-none text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 text-lg"
              required
            />
          </div>
        </div>

        <!-- Body Field -->
        <div class="space-y-3">
          <div class="flex items-center space-x-2">
            <MessageSquare class="w-5 h-5 text-purple-600" />
            <label class="text-gray-700 font-semibold text-lg">{{ t('contactUs.fields.message') }}</label>
          </div>
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 shadow-sm">
            <textarea
              v-model="form.body"
              :placeholder="t('contactUs.fields.messagePlaceholder')"
              rows="6"
              class="w-full bg-transparent border-none text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 resize-none text-lg leading-relaxed"
              required
            ></textarea>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="pt-4 flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            @click="$emit('close')"
            class="px-8 py-3 text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200"
          >
            {{ t('contactUs.cancel') }}
          </Button>
          <Button
            type="submit"
            class="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting" class="flex items-center justify-center">
              <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
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

// Props
interface Props {
  open: boolean
}

defineProps<Props>()

// Emits
const emit = defineEmits<{
  'close': []
  'submit': [data: { title: string; body: string }]
}>()

// Form data
const form = reactive({
  title: '',
  body: ''
})

// Loading state
const isSubmitting = ref(false)

// Methods
const handleSubmit = async () => {
  if (!form.title.trim() || !form.body.trim()) {
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
    
    // Reset form
    form.title = ''
    form.body = ''
    
    // Close modal
    emit('close')
    
    // Emit success event for parent component
    emit('submit', data)
    
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
.bg-gradient-to-r:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
