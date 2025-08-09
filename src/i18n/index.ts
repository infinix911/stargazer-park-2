import { createI18n } from 'vue-i18n'
import ko from './locales/ko'
import en from './locales/en'

// Create i18n instance
const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: 'ko', // Default language
  fallbackLocale: 'en', // Fallback language
  messages: {
    ko,
    en
  }
})

export default i18n 