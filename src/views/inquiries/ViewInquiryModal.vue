<template>
  <Dialog :open="open" @update:open="$emit('close')">
    <DialogContent class="w-[95vw] max-w-2xl sm:max-w-3xl lg:max-w-4xl bg-[#2c334a] border border-[#2d334b] p-0 overflow-hidden max-h-[90vh] flex flex-col">
      <!-- Modal Header -->
      <DialogHeader class="bg-gradient-to-r from-[#00c990] to-[#3b959c] text-white p-4 sm:p-6 flex-shrink-0">
        <DialogTitle class="text-lg sm:text-xl lg:text-2xl font-bold flex items-center space-x-3">
          <span>{{ t('viewInquiry.title') }}</span>
        </DialogTitle>
        <DialogDescription class="text-white/80 mt-2 text-sm sm:text-base">
          <!-- {{ t('viewInquiry.description') }} -->
        </DialogDescription>
      </DialogHeader>

      <!-- Inquiry Details -->
      <div v-if="props.inquiry" class="p-4 sm:p-6 space-y-4 sm:space-y-6 flex-1 overflow-y-auto">
        <!-- Title Section -->
        <div class="space-y-2 sm:space-y-3">
          <div class="flex items-center space-x-2">
            <FileText class="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" />
            <label class="text-white font-semibold text-lg">{{ t('inquiries.Title') }}</label>
          </div>
          <div class="bg-slate-700/50 border border-slate-600 rounded-lg p-3 sm:p-4 shadow-sm">
            <p class="text-white font-semibold text-lg">{{ props.inquiry.title === 'DEPOSIT_ACCOUNT_REQUEST' ? t('inquiries.DepositAccReq') : props.inquiry.title }}</p>
          </div>
        </div>

        <!-- Message Section -->
        <div class="space-y-2 sm:space-y-3">
          <div class="flex items-center space-x-2">
            <MessageSquare class="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" />
            <label class="text-white font-semibold text-lg">{{ t('inquiries.Body') }}</label>
          </div>
          <div class="bg-slate-700/50 border border-slate-600 rounded-lg p-3 sm:p-4 shadow-sm">
            <QuillEditor
              v-if="processedBody"
              :content="processedBody"
              :readOnly="true"
              :key="props.inquiry.id"
              :options="editorOptions"
              contentType="html"
              theme="snow"
              toolbar="false"
              class="bg-transparent text-white"
            />
            <div v-else class="text-slate-400 italic text-center py-3 sm:py-4 text-lg">
              {{ t('viewInquiry.messages.noMessage') }}
            </div>
          </div>
        </div>

        <!-- Reply Section -->
        <div class="space-y-2 sm:space-y-3">
          <div class="flex items-center space-x-2">
            <Reply class="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" />
            <label class="text-white font-semibold text-lg">{{ t('inquiries.Resp') }}</label>
          </div>
          <div v-if="props.inquiry.reply" class="bg-slate-700/50 border border-slate-600 rounded-lg p-3 sm:p-4 shadow-sm">
            <QuillEditor
              :content="processedReply"
              :readOnly="true"
              :key="props.inquiry.id"
              :options="editorOptions"
              contentType="html"
              theme="snow"
              toolbar="false"
              class="bg-transparent text-white"
            />
          </div>
          <div v-else class="bg-slate-700/50 border border-slate-600 rounded-lg p-3 sm:p-4 shadow-sm">
            <div class="text-slate-400 italic text-center py-3 sm:py-4 text-lg">
              {{ t('viewInquiry.messages.noReply') }}
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else-if="loading" class="flex items-center justify-center py-12 sm:py-16 flex-1">
        <div class="text-center">
          <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-teal-400 mx-auto"></div>
          <span class="ml-3 text-slate-300 text-base sm:text-lg mt-4 block">{{ t('viewInquiry.messages.loading') }}</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12 sm:py-16 flex-1">
        <div class="text-red-400">
          <div class="w-12 h-12 sm:w-16 sm:h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6 sm:w-8 sm:h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <p class="text-base sm:text-lg font-medium mb-4">{{ t('viewInquiry.messages.error') }}</p>
          <button 
            @click="$emit('close')" 
            class="px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm sm:text-base"
          >
            {{ t('viewInquiry.buttons.close') }}
          </button>
        </div>
      </div>

            <!-- Action Buttons -->
      <DialogFooter class="bg-[#2c334a] border-t border-slate-600 p-4 sm:p-6 flex-shrink-0">
        <button
          type="button"
          @click="$emit('close')"
          class="cursor-pointer px-6 sm:px-8 py-2.5 sm:py-3 bg-slate-600 text-white border border-slate-500 hover:bg-slate-700 hover:border-slate-400 transition-all duration-200 text-sm sm:text-base font-medium rounded-lg inline-flex items-center justify-center"
        >
          {{ t('viewInquiry.buttons.close') }}
        </button>
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
  Reply
} from 'lucide-vue-next'

const { t } = useI18n()

interface Inquiry {
  id: number;
  title: string;
  body: string;
  reply: string;
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

// QuillEditor options
const editorOptions = {
  readOnly: true,
  theme: 'snow',
  modules: {
    toolbar: false
  }
}

// Computed properties to process content
const processedBody = computed(() => {
  if (!props.inquiry?.body) return ''
    
  if (typeof props.inquiry.body === 'string') {
    // Apply translation for DEPOSIT_ACCOUNT_REQUEST
    if (props.inquiry.body === 'DEPOSIT_ACCOUNT_REQUEST') {
      return t('inquiries.DepositAccReq')
    }
    return props.inquiry.body
  }
  
  // If it's an object (Quill Delta), convert to HTML
  if (typeof props.inquiry.body === 'object' && props.inquiry.body !== null) {
    const bodyObj = props.inquiry.body as any
    
    if (bodyObj.ops && Array.isArray(bodyObj.ops)) {
      let htmlContent = ''
      bodyObj.ops.forEach((op: any) => {
        if (op.insert && typeof op.insert === 'string') {
          let text = op.insert
          const attributes = op.attributes || {}
          
          // Apply formatting
          if (attributes.bold) text = `<strong>${text}</strong>`
          if (attributes.italic) text = `<em>${text}</em>`
          if (attributes.underline) text = `<u>${text}</u>`
          if (attributes.color) text = `<span style="color: ${attributes.color}">${text}</span>`
          
          // Handle newlines
          text = text.replace(/\n/g, '<br>')
          htmlContent += text
        }
      })
      return htmlContent
    }
  }
  
  return ''
})

const processedReply = computed(() => {
  if (!props.inquiry?.reply) return ''
    
  if (typeof props.inquiry.reply === 'string') {
    // Try to parse as JSON first
    try {
      const parsedReply = JSON.parse(props.inquiry.reply)
      
      // If it's a Quill Delta object
      if (parsedReply.ops && Array.isArray(parsedReply.ops)) {
        let htmlContent = ''
        parsedReply.ops.forEach((op: any) => {
          if (op.insert && typeof op.insert === 'string') {
            let text = op.insert
            const attributes = op.attributes || {}
            
            // Apply formatting
            if (attributes.bold) text = `<strong>${text}</strong>`
            if (attributes.italic) text = `<em>${text}</em>`
            if (attributes.underline) text = `<u>${text}</u>`
            if (attributes.color) text = `<span style="color: ${attributes.color}">${text}</span>`
            
            // Handle newlines
            text = text.replace(/\n/g, '<br>')
            htmlContent += text
          }
        })
        return htmlContent
      }
      
      // If it's not Quill Delta, return the parsed object as string
      return JSON.stringify(parsedReply, null, 2)
    } catch (error) {
      // If it's not valid JSON, return as plain string
      return props.inquiry.reply
    }
  }
  
  // If it's already an object
  if (typeof props.inquiry.reply === 'object' && props.inquiry.reply !== null) {
    const replyObj = props.inquiry.reply as any
    if (replyObj.ops && Array.isArray(replyObj.ops)) {
      let htmlContent = ''
      replyObj.ops.forEach((op: any) => {
        if (op.insert && typeof op.insert === 'string') {
          let text = op.insert
          const attributes = op.attributes || {}
          
          // Apply formatting
          if (attributes.bold) text = `<strong>${text}</strong>`
          if (attributes.italic) text = `<em>${text}</em>`
          if (attributes.underline) text = `<u>${text}</u>`
          if (attributes.color) text = `<span style="color: ${attributes.color}">${text}</span>`
          
          // Handle newlines
          text = text.replace(/\n/g, '<br>')
          htmlContent += text
        }
      })
      return htmlContent
    }
  }
  
  return ''
})

// Methods

// Watch for inquiry changes
watch(() => props.inquiry, (newInquiry) => {
  if (newInquiry) {
    //console.log('Inquiry loaded:', newInquiry)
    //console.log('Body type:', typeof newInquiry.body, 'Body content:', newInquiry.body)
    //console.log('Reply type:', typeof newInquiry.reply, 'Reply content:', newInquiry.reply)
  }
}, { immediate: true })

// Watch for modal open state
watch(() => props.open, (isOpen) => {
  if (!isOpen) {
    // Reset state when modal closes
    error.value = null
    loading.value = false
  }
})
</script>

<style scoped>
/* View inquiry modal specific styles */

/* Custom styles for QuillEditor in modal */
:deep(.ql-editor) {
  background: transparent !important;
  color: #ffffff !important; /* white text for dark theme */
  font-size: 18px; /* text-lg */
  line-height: 1.8;
  padding: 0 !important;
  min-height: auto !important;
}

/* Force all text content in QuillEditor to be readable on dark background */
:deep(.ql-editor *) {
  color: #ffffff !important; /* Override any dark text colors */
}

/* Specific overrides for common text colors that might be dark */
:deep(.ql-editor span[style*="color"]) {
  color: #ffffff !important; /* Override inline color styles */
}

:deep(.ql-editor p) {
  color: #ffffff !important;
}

:deep(.ql-editor div) {
  color: #ffffff !important;
}

/* Maintain formatting but ensure readability */
:deep(.ql-editor strong) {
  color: #ffffff !important;
  font-weight: bold;
}

:deep(.ql-editor em) {
  color: #ffffff !important;
  font-style: italic;
}

:deep(.ql-editor u) {
  color: #ffffff !important;
  text-decoration: underline;
}

:deep(.ql-container) {
  border: none !important;
  background: transparent !important;
  font-family: inherit !important;
}

:deep(.ql-toolbar) {
  display: none !important;
}

/* Modal scrollbar styling for dark theme */
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

/* Hover effects for form containers */
.bg-slate-700\/50:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
</style>
