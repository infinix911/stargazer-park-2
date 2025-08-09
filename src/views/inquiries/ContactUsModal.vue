<template>
  <Dialog :open="open" @update:open="$emit('close')">
    <DialogContent class="w-full max-w-md bg-white p-8">
      <!-- Form Title -->
      <DialogHeader class="text-center mb-8">
        <DialogTitle class="text-3xl font-orbitron font-bold text-gray-900">
          {{ t('contactUs.title') }}
        </DialogTitle>
        <DialogDescription class="text-gray-600 mt-2">
          {{ t('contactUs.description') }}
        </DialogDescription>
      </DialogHeader>

      <!-- Contact Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Title Field -->
        <div class="space-y-2">
          <div class="flex items-center space-x-2">
            <FileText class="w-5 h-5 text-gray-700" />
            <label class="text-gray-700 font-medium">{{ t('contactUs.fields.title') }}</label>
          </div>
          <Input
            v-model="form.title"
            type="text"
            :placeholder="t('contactUs.fields.titlePlaceholder')"
            class="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500"
            required
          />
        </div>

        <!-- Body Field -->
        <div class="space-y-2">
          <div class="flex items-center space-x-2">
            <MessageSquare class="w-5 h-5 text-gray-700" />
            <label class="text-gray-700 font-medium">{{ t('contactUs.fields.message') }}</label>
          </div>
          <textarea
            v-model="form.body"
            :placeholder="t('contactUs.fields.messagePlaceholder')"
            rows="4"
            class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
            required
          ></textarea>
        </div>

        <!-- Submit Button -->
        <Button
          type="submit"
          class="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting">{{ t('contactUs.submitting') }}</span>
          <span v-else>{{ t('contactUs.submit') }}</span>
        </Button>
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

const { t } = useI18n()

// Props
interface Props {
  open: boolean
}

const props = defineProps<Props>()

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
    // Emit the form data
    emit('submit', {
      title: form.title.trim(),
      body: form.body.trim()
    })
    
    // Reset form
    form.title = ''
    form.body = ''
    
    // Close modal
    emit('close')
  } catch (error) {
    console.error('Error submitting form:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* Contact form specific styles */
</style>
