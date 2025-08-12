<template>
  <div v-if="isAuthenticated && notices.length > 0" class="notice-popup-container">
    <div
      v-for="(notice, index) in notices"
      :key="notice.id"
      :id="`popup-${notice.id}`"
      class="notice-popup"
      :class="`popup-${index}`"
    >
      <!-- Popup Header -->
      <div class="notice-popup-header">
        <div class="notice-popup-title">
          <div class="logo-container">
            <!-- Logo placeholder -->
          </div>
          <h3 
            class="title-text"
            :class="{ 'urgent': index === notices.length - 1 }"
          >
            {{ notice.title }}
          </h3>
        </div>
        <button
          type="button"
          class="close-button"
          @click="closePopup(index, notice.id, false)"
          :aria-label="t('common.close')"
        >
          <svg class="close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Popup Body -->
      <div class="notice-popup-body">
                           <!-- Text Content -->
          <div v-if="notice.type === 'TEXT'" class="text-content">
            <QuillEditor
              v-if="getTextContent(notice.body)"
              :content="getTextContent(notice.body)"
              :options="editorOptions"
              contentType="html"
              theme="snow"
              readOnly
              class="quill-editor"
            />
            <div v-else class="text-gray-500 italic text-center py-8">
              {{ t('notifications.noContent') }}
            </div>
          </div>
        
        <!-- Image Content -->
        <div v-else-if="notice.type === 'IMAGE'" class="image-container">
          <img
            :src="notice.imgsrc"
            :alt="notice.title"
            class="notice-image"
            @error="handleImageError"
          />
        </div>
      </div>

      <!-- Popup Footer -->
      <div class="notice-popup-footer">
        <button
          type="button"
          class="close-today-button"
          @click="closePopup(index, notice.id, true)"
        >
          {{ t("notice.CloseToday") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import moment from 'moment'
import ApiService from '@/services/ApiService'
import { useAuthStore } from '@/stores/auth'
// @ts-ignore
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

// Types
interface Notice {
  id: number
  title: string
  body?: { ops: any[] }
  type: 'TEXT' | 'IMAGE'
  imgsrc?: string
  popup: boolean
}

interface HiddenNotice {
  id: number
}

// Composables
const { t } = useI18n()
const authStore = useAuthStore()

// Reactive state
const notices = ref<Notice[]>([])
const hiddenNotices = ref<HiddenNotice[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

// Computed
const isAuthenticated = computed(() => authStore.isAuthenticated)

// Constants
const STORAGE_KEYS = {
  HIDDEN_NOTICES: 'noticePopup',
  HIDDEN_DATE: 'noticePopupDate'
} as const

// Quill Editor options
const editorOptions = {
  readOnly: true,
  theme: 'snow',
  modules: {
    toolbar: null
  }
}

// Methods
const initializeHiddenNotices = () => {
  const today = moment().format('L')
  const storedDate = localStorage.getItem(STORAGE_KEYS.HIDDEN_DATE)
  
  if (storedDate !== today) {
    localStorage.setItem(STORAGE_KEYS.HIDDEN_NOTICES, JSON.stringify([]))
    hiddenNotices.value = []
  } else {
    const stored = localStorage.getItem(STORAGE_KEYS.HIDDEN_NOTICES)
    if (stored) {
      try {
        hiddenNotices.value = JSON.parse(stored)
      } catch {
        hiddenNotices.value = []
      }
    }
  }
}

const fetchNotices = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    const response = await ApiService.get('/site/notices')
    const allNotices: Notice[] = response.data
    
    // Filter notices that should be shown as popups
    const popupNotices = allNotices.filter(notice => notice.popup)
    
    // Remove notices that are hidden today
    notices.value = popupNotices.filter(notice => 
      !hiddenNotices.value.some(hidden => hidden.id === notice.id)
    )
    
  } catch (err: any) {
    console.error('Failed to fetch notices:', err)
    error.value = err.response?.data?.message || 'Failed to load notices'
  } finally {
    isLoading.value = false
  }
}

const closePopup = (index: number, noticeId: number, hideToday: boolean) => {
  if (hideToday) {
    // Add to hidden notices for today
    const isAlreadyHidden = hiddenNotices.value.some(notice => notice.id === noticeId)
    
    if (!isAlreadyHidden) {
      hiddenNotices.value.push({ id: noticeId })
      
      // Save to localStorage
      localStorage.setItem(STORAGE_KEYS.HIDDEN_DATE, moment().format('L'))
      localStorage.setItem(STORAGE_KEYS.HIDDEN_NOTICES, JSON.stringify(hiddenNotices.value))
    }
  }
  
  // Remove from current notices
  removeNotice(noticeId)
}

const removeNotice = (noticeId: number) => {
  const index = notices.value.findIndex(notice => notice.id === noticeId)
  if (index > -1) {
    notices.value.splice(index, 1)
  }
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
  console.warn('Failed to load notice image:', img.src)
}

const getTextContent = (body: any) => {
  if (!body) return ''
  
  // If body is a string, return it directly
  if (typeof body === 'string') {
    return body
  }
  
  // If body is an object with ops (Quill Delta format)
  if (body.ops && Array.isArray(body.ops)) {
    const delta = body.ops
    let htmlContent = ''
    delta.forEach((op: any) => {
      if (op.insert) {
        if (typeof op.insert === 'string') {
          htmlContent += op.insert.replace(/\n/g, '<br>')
        }
      }
    })
    return htmlContent
  }
  
  // If body has other properties, try to extract content
  if (body.content) {
    return body.content
  }
  
  if (body.html) {
    return body.html
  }
  
  // Fallback to JSON string
  return JSON.stringify(body, null, 2)
}

// Lifecycle
onMounted(() => {
  initializeHiddenNotices()
  fetchNotices()
})

// Cleanup on unmount
onUnmounted(() => {
  notices.value = []
  hiddenNotices.value = []
})
</script>

<style scoped>
.notice-popup-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.notice-popup {
  background: #1a1a1a;
  border: 2px solid #3b82f6;
  border-radius: 8px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
  max-width: 90vw;
  max-height: 90vh;
  width: 500px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.notice-popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #3b82f6;
  background: #2d2d2d;
  color: white;
}

.notice-popup-title {
  display: flex;
  align-items: center;
  flex: 1;
}

.logo-container {
  width: 32px;
  height: 32px;
  margin-right: 0.75rem;
}

.title-text {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.5;
  color: white;
}

.title-text.urgent {
  color: #ef4444;
}

.close-button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.close-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.notice-popup-body {
  height: 500px;
  padding: 1.5rem;
  overflow-y: auto;
  background: #1a1a1a;
  color: white;
}

.quill-editor {
  border: none;
  background: transparent;
}

/* Custom styles for QuillEditor in dark theme */
:deep(.ql-editor) {
  background: transparent !important;
  color: white !important;
  font-size: 0.875rem;
  line-height: 1.6;
  padding: 0 !important;
}

:deep(.ql-container) {
  border: none !important;
  background: transparent !important;
}

:deep(.ql-toolbar) {
  display: none !important;
}

.text-content {
  color: white;
  font-size: 0.875rem;
  line-height: 1.6;
}

.text-content :deep(strong) {
  color: #3b82f6;
  font-weight: 600;
}

.text-content :deep(em) {
  color: #fbbf24;
  font-style: italic;
}

.text-content :deep(u) {
  color: #10b981;
  text-decoration: underline;
}

.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  height: 100%;
}

.notice-image {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
  border-radius: 0.5rem;
}

.notice-popup-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #3b82f6;
  background-color: #2d2d2d;
  display: flex;
  justify-content: center;
}

.close-today-button {
  background: #3b82f6;
  color: white;
  border: 1px solid #3b82f6;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 120px;
}

.close-today-button:hover {
  background: #2563eb;
  border-color: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
}

.close-today-button:active {
  transform: translateY(0);
}

/* Responsive design */
@media (max-width: 768px) {
  .notice-popup {
    width: 95vw;
    max-height: 95vh;
  }
  
  .notice-popup-header {
    padding: 0.75rem 1rem;
  }
  
  .notice-popup-body {
    padding: 1rem;
  }
  
  .notice-popup-footer {
    padding: 0.75rem 1rem;
  }
  
  .title-text {
    font-size: 1rem;
  }
}

/* Animation */
.notice-popup {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
