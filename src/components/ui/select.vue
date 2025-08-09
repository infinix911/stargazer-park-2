<template>
  <div class="relative">
    <select
      :value="modelValue"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      :class="selectClasses"
      v-bind="$attrs"
    >
      <slot />
    </select>
    <svg 
      class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: string
  variant?: 'default' | 'outline'
  size?: 'default' | 'sm' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  variant: 'default',
  size: 'default'
})

defineEmits<{
  'update:modelValue': [value: string]
}>()

const selectClasses = computed(() => {
  const baseClasses = [
    'flex',
    'w-full',
    'rounded-md',
    'border',
    'bg-background',
    'text-sm',
    'ring-offset-background',
    'file:border-0',
    'file:bg-transparent',
    'file:text-sm',
    'file:font-medium',
    'placeholder:text-muted-foreground',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-ring',
    'focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed',
    'disabled:opacity-50',
    'appearance-none'
  ]

  const variantClasses = {
    default: [
      'border-input',
      'bg-background',
      'text-foreground'
    ],
    outline: [
      'border-border',
      'bg-background',
      'text-foreground'
    ]
  }

  const sizeClasses = {
    default: ['h-10', 'px-3', 'py-2'],
    sm: ['h-9', 'px-3', 'py-1'],
    lg: ['h-11', 'px-4', 'py-3']
  }

  return [
    ...baseClasses,
    ...variantClasses[props.variant],
    ...sizeClasses[props.size]
  ].join(' ')
})
</script>
