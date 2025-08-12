<template>
  <footer class="bg-[#101010] py-4 border-t border-[#45443f]">
    <div class="max-w-[1660px] mx-auto px-4">
      <!-- Main Navigation -->
      <div class="flex flex-col lg:flex-row items-center justify-between mb-4 space-y-4 lg:space-y-0">
        <!-- Left Side - Company Logo -->
        <div class="text-[#45443f] text-sm text-center lg:text-left">
          <span 
            class="text-[#45443f] font-bold font-orbitron text-2xl lg:text-4xl cursor-pointer hover:text-[#1494dc] transition-colors"
            @click="navigateToHome"
          >
            {{ t('footer.company') }}
          </span>
          <p class="text-xs mt-1">{{ t('footer.copyright') }}</p>
        </div>
        
        <!-- Center - Navigation Icons -->
        <div class="flex flex-wrap items-center justify-center gap-2 lg:gap-4 max-w-full lg:max-w-none">
          <NavItem 
            icon="🎰" 
            :label="t('footer.nav.casino')" 
            @click="handleNavClick('casino')"
          />
          <NavItem 
            icon="🎲" 
            :label="t('footer.nav.slots')" 
            @click="handleNavClick('slots')"
          />
          <NavItem 
            icon="👤" 
            :label="t('footer.nav.wallet')" 
            @click="handleNavClick('wallet')"
          />
          <NavItem 
            icon="📊" 
            :label="t('footer.nav.transactions')" 
            @click="handleNavClick('transactions')"
          />
          <NavItem 
            icon="📢" 
            :label="t('footer.nav.notice')" 
            @click="handleNavClick('notice')"
          />
          <NavItem 
            icon="💳" 
            :label="t('footer.nav.deposit')" 
            @click="handleNavClick('deposit')"
          />
          <NavItem 
            icon="💰" 
            :label="t('footer.nav.withdrawal')" 
            @click="handleNavClick('withdrawal')"
          />
          <NavItem 
            icon="❓" 
            :label="t('footer.nav.inquiry')" 
            @click="handleNavClick('inquiry')"
          />
        </div>
        
        <!-- Right Side - Customer Service -->
        <div class="flex items-center">
          <Button 
            variant="default"
            size="default"
            @click="openCustomerService"
            style="background-color: #142868 !important; color: #1494dc !important;"
            @mouseenter="$event.target.style.backgroundColor = '#0f1e52'"
            @mouseleave="$event.target.style.backgroundColor = '#142868'"
            class="text-xs lg:text-sm"
          >
            <span class="mr-2">
              <img 
                src="/images/section/console.svg" 
                alt="Popular Games" 
                class="w-6 h-6 lg:w-8 lg:h-8"
              />
            </span>
            <span class="text-[#1494dc] hidden sm:inline">{{ t('footer.recentPlayed') }}</span>
          </Button>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Footer component with TypeScript
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'
import NavItem from './NavItem.vue'
import Button from '../ui/Button.vue'

const { t } = useI18n()
const authStore = useAuthStore()

// Define emits
const emit = defineEmits<{
  'open-customer-service': []
  'nav-click': [section: string]
  'show-deposit-modal': []
  'show-withdrawal-modal': []
}>()

// Methods
const openCustomerService = (): void => {
  console.log('Opening customer service...')
  // Open customer service chat or modal
  emit('open-customer-service')
}

const handleNavClick = (section: string): void => {
  console.log(`Navigation clicked: ${section}`)
  
  // Handle navigation for specific sections
  if (section === 'casino') {
    // Navigate to casino page
    window.location.href = '/casino'
    return
  }
  
  if (section === 'slots') {
    // Navigate to slot page
    window.location.href = '/slot'
    return
  }
  
  if (section === 'transactions') {
    // Navigate to transactions page
    window.location.href = '/transaction'
    return
  }
  
  if (section === 'notice') {
    // Navigate to notifications page
    window.location.href = '/notifications'
    return
  }
  
  if (section === 'inquiry') {
    // Navigate to inquiries page
    window.location.href = '/inquiries'
    return
  }
  
  if (section === 'deposit') {
    // Check if user is authenticated using auth store
    if (authStore.isAuthenticated) {
      emit('show-deposit-modal')
    } else {
      // Show SweetAlert for unauthenticated users
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          title: t('auth.loginRequired'),
          text: t('auth.depositLoginRequired'),
          icon: 'warning',
          confirmButtonText: t('common.ok')
        })
      } else {
        alert(t('auth.depositLoginRequired'))
      }
    }
    return
  }
  
  if (section === 'withdrawal') {
    // Check if user is authenticated using auth store
    if (authStore.isAuthenticated) {
      emit('show-withdrawal-modal')
    } else {
      // Show SweetAlert for unauthenticated users
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          title: t('auth.loginRequired'),
          text: t('auth.withdrawalLoginRequired'),
          icon: 'warning',
          confirmButtonText: t('common.ok')
        })
      } else {
        alert(t('auth.withdrawalLoginRequired'))
      }
    }
    return
  }
  
  emit('nav-click', section)
}

const navigateToHome = (): void => {
  console.log('Navigating to home...')
  window.location.href = '/'
}
</script>

<style scoped>
/* Footer specific styles */
.footer-link {
  position: relative;
  overflow: hidden;
}

.footer-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: -100%;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, #ef4444, transparent);
  transition: left 0.5s;
}

.footer-link:hover::after {
  left: 100%;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .text-right {
    text-align: center;
  }
  
  .ml-auto {
    margin: 0 auto;
  }
}
</style>