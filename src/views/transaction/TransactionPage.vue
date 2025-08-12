<template>
  <div class="min-h-screen bg-white">
    <div class="py-12">
      <div class="max-w-[1660px] mx-auto px-4">
        <!-- Page Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-black text-gray-900 mb-4">{{ t('transaction.title') }}</h1>
        </div>

        <!-- Tabs -->
        <Tabs default-value="trans-history" class="w-full">
          <TabsList class="grid w-full grid-cols-2 bg-gray-100 p-1">
            <TabsTrigger 
              value="trans-history" 
              class="cursor-pointer text-gray-700 data-[state=active]:bg-[#1494dc] data-[state=active]:text-white py-4 px-6 text-base font-medium"
              style="height: 56px !important; min-height: 56px !important; display: flex !important; align-items: center !important; justify-content: center !important;"
            >
              {{ t('transaction.tabs.transHistory') }}
            </TabsTrigger>
            <TabsTrigger 
              value="point-history" 
              class="cursor-pointer text-gray-700 data-[state=active]:bg-[#1494dc] data-[state=active]:text-white py-4 px-6 text-base font-medium"
              style="height: 56px !important; min-height: 56px !important; display: flex !important; align-items: center !important; justify-content: center !important;"
            >
              {{ t('transaction.tabs.pointHistory') }}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="trans-history" class="mt-6">
            <TransactionHistory />
          </TabsContent>
          
          <TabsContent value="point-history" class="mt-6">
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
/* Override default tab styles to ensure consistent height */
:deep([data-state="active"]) {
  height: 48px !important;
  min-height: 48px !important;
  padding: 12px 24px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

:deep([data-state="inactive"]) {
  height: 72px !important;
  min-height: 72px !important;
  padding: 12px 24px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

:deep([role="tablist"]) {
  height: 72px !important;
  min-height: 72px !important;
}
</style>