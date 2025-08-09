<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 relative overflow-hidden">
    <!-- Animated Background Pattern -->
    <div class="absolute inset-0 opacity-20">
      <div class="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
      <div class="absolute top-0 right-0 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
      <div class="absolute bottom-0 left-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
    </div>

    <!-- Page Header -->
    <div class="relative z-10 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl shadow-lg">
            <i class="fas fa-users text-white text-xl"></i>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-white">Members Management</h1>
            <p class="text-sm text-gray-400">Manage partner members and registrations</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="relative z-10 py-6">
      <div class="max-w-7xl mx-auto px-4">
        <!-- Coming Soon Card -->
        <div class="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
          <div class="p-12 text-center">
            <div class="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <i class="fas fa-users text-white text-3xl"></i>
            </div>
            <h2 class="text-2xl font-bold text-white mb-4">Members Management</h2>
            <p class="text-gray-400 mb-6 max-w-md mx-auto">
              This feature is coming soon. You'll be able to manage partner members, view registrations, and track member activities.
            </p>
            <div class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg text-white font-medium">
              <i class="fas fa-clock mr-2"></i>
              Coming Soon
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Members'
})
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.2;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.3;
  }
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>