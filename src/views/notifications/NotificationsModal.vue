<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="w-[95vw] max-w-2xl sm:max-w-3xl lg:max-w-4xl bg-white p-0 overflow-hidden max-h-[90vh] flex flex-col">
      <!-- Header -->
      <DialogHeader class="bg-gradient-to-r from-[#00c990] to-[#3b959c] text-white p-4 sm:p-6 flex-shrink-0">
        <DialogTitle class="text-lg sm:text-xl lg:text-2xl font-bold flex items-center justify-start space-x-3">
          <span>{{ notice?.title }}</span>
        </DialogTitle>
        <DialogDescription class="text-white/80 mt-2 text-left text-sm sm:text-base">
          {{ formatDate(notice?.createdAt) }}
        </DialogDescription>
      </DialogHeader>

      <!-- Content -->
      <div class="p-4 sm:p-6 space-y-4 sm:space-y-6 flex-1 overflow-y-auto custom-scrollbar">
        <!-- Notice Image -->
        <div v-if="notice?.imgsrc" class="space-y-2 sm:space-y-3">
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <label class="text-gray-700 font-semibold text-base sm:text-lg">{{ t('notifications.image') }}</label>
          </div>
          <div class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3 sm:p-4 shadow-sm">
            <img 
              :src="notice.imgsrc" 
              :alt="notice.title"
              class="w-full max-h-48 sm:max-h-64 object-contain rounded-lg"
            />
          </div>
        </div>

        <!-- Notice Content -->
        <div class="space-y-2 sm:space-y-3">
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <label class="text-gray-700 font-semibold text-base sm:text-lg">{{ t('notifications.content') }}</label>
          </div>
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 sm:p-4 shadow-sm">
            <QuillEditor
              v-if="noticeContent"
              v-model:content="noticeContent"
              :options="editorOptions"
              contentType="html"
              theme="snow"
              toolbar="false"
              readOnly
              class="bg-transparent text-gray-900"
            />
            <div v-else class="text-gray-500 italic text-center py-6 sm:py-8 text-sm sm:text-base">
              {{ t('notifications.noContent') }}
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <DialogFooter class="p-4 sm:p-6 bg-gray-50 border-t border-gray-200 flex-shrink-0">
        <DialogClose as-child>
          <Button 
            variant="outline" 
            class="px-6 sm:px-8 py-2.5 sm:py-3 text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 text-sm sm:text-base"
          >
            {{ t('common.close') }}
          </Button>
        </DialogClose>
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog'
import Button from '@/components/ui/Button.vue'

const { t } = useI18n()

interface Notice {
  id: string
  title: string
  body: {}
  createdAt: string
  imgsrc: string
  popup: boolean
  type: string
}

interface Props {
  open: boolean
  notice: Notice | null
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:open': [value: boolean] }>()

// QuillEditor content
const noticeContent = ref('')

// QuillEditor options
const editorOptions = {
  readOnly: true,
  theme: 'snow',
  modules: {
    toolbar: false
  }
}

// Format date for display
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  // If it's today
  if (diffDays === 0) {
    return t('notifications.dateFormat.today')
  }
  
  // If it's yesterday
  if (diffDays === 1) {
    return t('notifications.dateFormat.yesterday')
  }
  
  // If it's within the last week
  if (diffDays <= 7) {
    return `${diffDays} ${t('notifications.dateFormat.daysAgo')}`
  }
  
  // For older dates, use full date format
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  
  return date.toLocaleDateString('en-US', options)
}

// Watch for notice changes and update content
watch(() => props.notice, (newNotice) => {
  if (newNotice && newNotice.body) {
    // Convert body object to HTML string for QuillEditor
    if (typeof newNotice.body === 'string') {
      noticeContent.value = newNotice.body
    } else {
      // If body is an object, try to extract content
      const bodyObj = newNotice.body as any
      if (bodyObj.ops && Array.isArray(bodyObj.ops)) {
        // Handle Quill Delta format
        const delta = bodyObj.ops
        let htmlContent = ''
        delta.forEach((op: any) => {
          if (op.insert) {
            if (typeof op.insert === 'string') {
              htmlContent += op.insert.replace(/\n/g, '<br>')
            }
          }
        })
        noticeContent.value = htmlContent
      } else if (bodyObj.content) {
        noticeContent.value = bodyObj.content
      } else if (bodyObj.html) {
        noticeContent.value = bodyObj.html
      } else {
        noticeContent.value = JSON.stringify(bodyObj, null, 2)
      }
    }
  } else {
    noticeContent.value = ''
  }
}, { immediate: true })
</script>

<style scoped>
/* Custom styles for QuillEditor in modal */
:deep(.ql-editor) {
  background: transparent !important;
  color: #374151 !important; /* text-gray-700 */
  font-size: 14px;
  line-height: 1.6;
  padding: 0 !important;
}

@media (min-width: 640px) {
  :deep(.ql-editor) {
    font-size: 16px;
  }
}

:deep(.ql-container) {
  border: none !important;
  background: transparent !important;
}

:deep(.ql-toolbar) {
  display: none !important;
}

/* Smooth transitions */
* {
  transition: all 0.2s ease-in-out;
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

/* Hover effects for content containers */
.bg-gradient-to-r:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
