<template>
  <Dialog :open="open" @update:open="$emit('close')">
    <DialogContent class="w-full max-w-4xl bg-white p-0 overflow-hidden">
      <!-- Modal Header -->
      <DialogHeader class="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
        <DialogTitle class="text-2xl font-bold flex items-center space-x-3">
          <MessageSquare class="w-7 h-7 text-white" />
          <span>{{ t('viewInquiry.title') }}</span>
        </DialogTitle>
        <DialogDescription class="text-purple-100 mt-2">
          {{ t('viewInquiry.description') }}
        </DialogDescription>
      </DialogHeader>

      <!-- Inquiry Details -->
      <div v-if="props.inquiry" class="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
        <!-- Title Section -->
        <div class="space-y-3">
          <div class="flex items-center space-x-2">
            <FileText class="w-5 h-5 text-purple-600" />
            <label class="text-gray-700 font-semibold text-lg">{{ t('viewInquiry.fields.title') }}</label>
          </div>
          <div class="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 shadow-sm">
            <p class="text-gray-900 font-semibold text-lg">{{ props.inquiry.title }}</p>
          </div>
        </div>

        <!-- Status Section -->
        <div class="space-y-3">
          <div class="flex items-center space-x-2">
            <Circle class="w-5 h-5 text-purple-600" />
            <label class="text-gray-700 font-semibold text-lg">{{ t('viewInquiry.fields.status') }}</label>
          </div>
          <div class="inline-block px-4 py-2 rounded-full text-sm font-semibold shadow-sm"
               :class="{
                 'bg-gradient-to-r from-blue-500 to-blue-600 text-white': props.inquiry.state === 3,
                 'bg-gradient-to-r from-gray-500 to-gray-600 text-white': props.inquiry.state === 0,
                 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white': props.inquiry.state === 1,
                 'bg-gradient-to-r from-green-500 to-green-600 text-white': props.inquiry.state === 2,
                 'bg-gradient-to-r from-purple-500 to-purple-600 text-white': props.inquiry.state === 4 || props.inquiry.state === 9,
                 'bg-gradient-to-r from-red-500 to-red-600 text-white': props.inquiry.state === 8
               }">
            {{ t(`viewInquiry.states.${props.inquiry.state}`) }}
          </div>
        </div>

        <!-- Date Section -->
        <div class="space-y-3">
          <div class="flex items-center space-x-2">
            <Calendar class="w-5 h-5 text-purple-600" />
            <label class="text-gray-700 font-semibold text-lg">{{ t('viewInquiry.fields.date') }}</label>
          </div>
          <div class="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-4 shadow-sm">
            <p class="text-gray-900 font-medium">{{ formatDate(props.inquiry.createdAt) }}</p>
          </div>
        </div>

        <!-- Message Section -->
        <div class="space-y-3">
          <div class="flex items-center space-x-2">
            <MessageSquare class="w-5 h-5 text-purple-600" />
            <label class="text-gray-700 font-semibold text-lg">{{ t('viewInquiry.fields.message') }}</label>
          </div>
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 shadow-sm">
            <QuillEditor
              v-if="messageContent"
              v-model:content="messageContent"
              :options="editorOptions"
              contentType="html"
              theme="snow"
              toolbar="false"
              readOnly
              class="bg-transparent text-gray-900"
            />
            <div v-else class="text-gray-500 italic text-center py-4">
              {{ t('viewInquiry.messages.noMessage') }}
            </div>
          </div>
        </div>

        <!-- Reply Section -->
        <div class="space-y-3">
          <div class="flex items-center space-x-2">
            <Reply class="w-5 h-5 text-green-600" />
            <label class="text-gray-700 font-semibold text-lg">{{ t('viewInquiry.fields.reply') }}</label>
          </div>
          <div v-if="props.inquiry.reply && replyContent" class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 shadow-sm">
            <QuillEditor
              v-model:content="replyContent"
              :options="editorOptions"
              contentType="html"
              theme="snow"
              toolbar="false"
              readOnly
              class="bg-transparent text-gray-900"
            />
          </div>
          <div v-else class="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-4 shadow-sm">
            <div class="text-gray-500 italic text-center py-4">
              {{ t('viewInquiry.messages.noReply') }}
            </div>
          </div>
        </div>

        <!-- Last Updated Section -->
        <div class="space-y-3">
          <div class="flex items-center space-x-2">
            <Clock class="w-5 h-5 text-purple-600" />
            <label class="text-gray-700 font-semibold text-lg">{{ t('viewInquiry.fields.lastUpdated') }}</label>
          </div>
          <div class="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-4 shadow-sm">
            <p class="text-gray-900 font-medium">{{ formatDate(props.inquiry.updatedAt) }}</p>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else-if="loading" class="flex items-center justify-center py-16">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <span class="ml-3 text-gray-600 text-lg mt-4 block">{{ t('viewInquiry.messages.loading') }}</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-16">
        <div class="text-red-600">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <p class="text-lg font-medium mb-4">{{ t('viewInquiry.messages.error') }}</p>
          <button 
            @click="$emit('close')" 
            class="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            {{ t('viewInquiry.buttons.close') }}
          </button>
        </div>
      </div>

            <!-- Action Buttons -->
      <DialogFooter class="bg-gray-50 border-t border-gray-200 p-6">
        <Button
          variant="outline"
          @click="$emit('close')"
          class="cursor-pointer px-8 py-3 text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200"
        >
          {{ t('viewInquiry.buttons.close') }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
// @ts-ignore
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import Button from '@/components/ui/Button.vue'
import {
  FileText,
  MessageSquare,
  Circle,
  Calendar,
  Reply,
  Clock
} from 'lucide-vue-next'

const { t } = useI18n()

interface Inquiry {
  id: number;
  title: string;
  body: string;
  reply: {};
  state: number;
  createdAt: string;
  updatedAt: string;
}

// Props
interface Props {
  open: boolean
  inquiry?: Inquiry | null
}

const props = defineProps<Props>()

// Emits
defineEmits<{
  'close': []
}>()

// State
const loading = ref(false)
const error = ref<string | null>(null)

// QuillEditor content
const messageContent = ref('')
const replyContent = ref('')

// QuillEditor options
const editorOptions = {
  readOnly: true,
  theme: 'snow',
  modules: {
    toolbar: false
  }
}

// Methods
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString()
}

// Watch for inquiry changes and update content
watch(() => props.inquiry, (newInquiry) => {
  if (newInquiry) {
    // Handle message content
    if (newInquiry.body) {
      if (typeof newInquiry.body === 'string') {
        messageContent.value = newInquiry.body
      } else {
        // If body is an object, try to extract content
        const bodyObj = newInquiry.body as any
        if (bodyObj.ops && Array.isArray(bodyObj.ops)) {
          // Handle Quill Delta format - convert to HTML
          const delta = bodyObj.ops
          let htmlContent = ''
          delta.forEach((op: any) => {
            if (op.insert) {
              if (typeof op.insert === 'string') {
                let text = op.insert
                let attributes = op.attributes || {}
                
                // Apply formatting based on attributes
                if (attributes.bold) {
                  text = `<strong>${text}</strong>`
                }
                if (attributes.italic) {
                  text = `<em>${text}</em>`
                }
                if (attributes.underline) {
                  text = `<u>${text}</u>`
                }
                if (attributes.color) {
                  text = `<span style="color: ${attributes.color}">${text}</span>`
                }
                
                // Handle newlines
                text = text.replace(/\n/g, '<br>')
                htmlContent += text
              }
            }
          })
          messageContent.value = htmlContent
        } else if (bodyObj.content) {
          messageContent.value = bodyObj.content
        } else if (bodyObj.html) {
          messageContent.value = bodyObj.html
        } else {
          // If it's a plain object, try to extract meaningful content
          messageContent.value = JSON.stringify(bodyObj, null, 2)
        }
      }
    } else {
      messageContent.value = ''
    }

    // Handle reply content
    if (newInquiry.reply) {
      if (typeof newInquiry.reply === 'string') {
        replyContent.value = newInquiry.reply
      } else {
        // If reply is an object, try to extract content
        const replyObj = newInquiry.reply as any
        if (replyObj.ops && Array.isArray(replyObj.ops)) {
          // Handle Quill Delta format - convert to HTML
          const delta = replyObj.ops
          let htmlContent = ''
          delta.forEach((op: any) => {
            if (op.insert) {
              if (typeof op.insert === 'string') {
                let text = op.insert
                let attributes = op.attributes || {}
                
                // Apply formatting based on attributes
                if (attributes.bold) {
                  text = `<strong>${text}</strong>`
                }
                if (attributes.italic) {
                  text = `<em>${text}</em>`
                }
                if (attributes.underline) {
                  text = `<u>${text}</u>`
                }
                if (attributes.color) {
                  text = `<span style="color: ${attributes.color}">${text}</span>`
                }
                
                // Handle newlines
                text = text.replace(/\n/g, '<br>')
                htmlContent += text
              }
            }
          })
          replyContent.value = htmlContent
        } else if (replyObj.content) {
          replyContent.value = replyObj.content
        } else if (replyObj.html) {
          replyContent.value = replyObj.html
        } else {
          // If it's a plain object, try to extract meaningful content
          replyContent.value = JSON.stringify(replyObj, null, 2)
        }
      }
    } else {
      replyContent.value = ''
    }
  } else {
    messageContent.value = ''
    replyContent.value = ''
  }
}, { immediate: true })

// Watch for modal open state
watch(() => props.open, (isOpen) => {
  if (!isOpen) {
    // Reset state when modal closes
    error.value = null
    loading.value = false
    messageContent.value = ''
    replyContent.value = ''
  }
})
</script>

<style scoped>
/* View inquiry modal specific styles */

/* Custom styles for QuillEditor in modal */
:deep(.ql-editor) {
  background: transparent !important;
  color: #374151 !important; /* text-gray-700 */
  font-size: 16px;
  line-height: 1.8;
  padding: 0 !important;
  min-height: auto !important;
}

:deep(.ql-container) {
  border: none !important;
  background: transparent !important;
  font-family: inherit !important;
}

:deep(.ql-toolbar) {
  display: none !important;
}

/* Modal scrollbar styling */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
