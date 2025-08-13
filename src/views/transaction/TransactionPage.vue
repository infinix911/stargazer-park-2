<template>
  <div class="min-h-screen bg-gradient-to-br from-[#181b28] to-[#11131c]">
    <div class="py-12">
      <div class="max-w-[1660px] mx-auto px-4">
        <!-- Page Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-black text-white mb-4">{{ t('transaction.title') }}</h1>
        </div>

        <!-- Tabs -->
        <Tabs default-value="trans-history" class="w-full">
          <TabsList class="grid w-full grid-cols-2 bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl p-1">
            <TabsTrigger 
              value="trans-history" 
              class="cursor-pointer text-slate-200 data-[state=active]:bg-[#142868] data-[state=active]:text-white py-4 px-6 text-base font-medium rounded-lg transition-all duration-200"
              style="height: 56px !important; min-height: 56px !important; display: flex !important; align-items: center !important; justify-content: center !important;"
            >
              {{ t('transaction.tabs.transHistory') }}
            </TabsTrigger>
            <TabsTrigger 
              value="point-history" 
              class="cursor-pointer text-slate-200 data-[state=active]:bg-[#142868] data-[state=active]:text-white py-4 px-6 text-base font-medium rounded-lg transition-all duration-200"
              style="height: 56px !important; min-height: 56px !important; display: flex !important; align-items: center !important; justify-content: center !important;"
            >
              {{ t('transaction.tabs.pointHistory') }}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="trans-history" class="mt-2 bg-gradient-to-br from-[#11131d]/95 to-[#101010]/90 rounded-xl">
            <TransactionHistory />
          </TabsContent>
          
          <TabsContent value="point-history" class="mt-2 bg-gradient-to-br from-[#11131d]/95 to-[#101010]/90 rounded-xl">
            <PointHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import TransactionHistory from '../histories/TransactionHistory.vue'
import PointHistory from '../histories/PointHistory.vue'

const { t } = useI18n()
</script>

<style scoped>
/* Override default tab styles to ensure consistent height and dark theme */
:deep([data-state="active"]) {
  height: 56px !important;
  min-height: 56px !important;
  padding: 12px 24px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  background-color: #142868 !important;
  color: white !important;
  border-radius: 0.5rem !important;
}

:deep([data-state="inactive"]) {
  height: 56px !important;
  min-height: 56px !important;
  padding: 12px 24px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  background-color: transparent !important;
  color: rgb(226 232 240) !important; /* slate-200 */
  border-radius: 0.5rem !important;
  transition: all 0.2s ease-in-out !important;
}

:deep([data-state="inactive"]:hover) {
  background-color: rgb(71 85 105 / 0.3) !important; /* slate-600/30 */
}

:deep([role="tablist"]) {
  height: auto !important;
  min-height: auto !important;
  background-color: rgb(30 41 59 / 0.9) !important; /* slate-800/90 */
  backdrop-filter: blur(4px) !important;
  border: 1px solid rgb(71 85 105) !important; /* slate-700 */
  border-radius: 0.75rem !important;
  padding: 0.25rem !important;
}
</style>