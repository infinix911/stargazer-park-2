<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-4xl max-h-[80vh] overflow-hidden bg-white border border-gray-300">
      <DialogHeader>
        <DialogTitle class="text-gray-900 text-xl font-bold">
          {{ notice?.title }}
        </DialogTitle>
        <DialogDescription class="text-gray-600">
          {{ formatDate(notice?.createdAt) }}
        </DialogDescription>
      </DialogHeader>

      <div class="py-4 overflow-y-auto max-h-[60vh]">
        <!-- Notice Image -->
        <div v-if="notice?.imgsrc" class="mb-4">
          <img 
            :src="notice.imgsrc" 
            :alt="notice.title"
            class="w-full max-h-64 object-contain rounded-lg border border-gray-200"
          />
        </div>

        <!-- Notice Content -->
        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <QuillEditor
            v-model:content="noticeContent"
            :options="editorOptions"
            contentType="html"
            theme="snow"
            toolbar="false"
            readOnly
            class="bg-transparent text-gray-900"
          />
        </div>
      </div>

      <DialogFooter>
        <DialogClose as-child>
          <Button variant="outline" class="text-gray-700 border-gray-300 hover:bg-gray-50">
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
  return new Date(dateString).toLocaleDateString()
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
  font-size: 16px;
  line-height: 1.6;
}

:deep(.ql-container) {
  border: none !important;
  background: transparent !important;
}

:deep(.ql-toolbar) {
  display: none !important;
}
</style>
