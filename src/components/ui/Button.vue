<template>
  <button
    :class="buttonClasses"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  disabled?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  disabled: false,
  class: ''
})

defineEmits<{
  click: []
}>()

const buttonClasses = computed(() => {
  const baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'rounded-md',
    'text-sm',
    'font-medium',
    'ring-offset-background',
    'transition-colors',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-ring',
    'focus-visible:ring-offset-2',
    'disabled:pointer-events-none',
    'disabled:opacity-50'
  ]

  const variantClasses = {
    default: [
      'bg-primary',
      'text-primary-foreground',
      'hover:bg-primary/90',
      'bg-slate-900',
      'text-slate-50',
      'hover:bg-slate-900/90'
    ],
    destructive: [
      'bg-destructive',
      'text-destructive-foreground',
      'hover:bg-destructive/90',
      'bg-red-500',
      'text-slate-50',
      'hover:bg-red-500/90'
    ],
    outline: [
      'border',
      'border-input',
      'bg-background',
      'hover:bg-accent',
      'hover:text-accent-foreground',
      'border-slate-200',
      'bg-white',
      'hover:bg-slate-100',
      'hover:text-slate-900'
    ],
    secondary: [
      'bg-secondary',
      'text-secondary-foreground',
      'hover:bg-secondary/80',
      'bg-slate-100',
      'text-slate-900',
      'hover:bg-slate-100/80'
    ],
    ghost: [
      'hover:bg-accent',
      'hover:text-accent-foreground',
      'hover:bg-slate-100',
      'hover:text-slate-900'
    ],
    link: [
      'text-primary',
      'underline-offset-4',
      'hover:underline',
      'text-slate-900'
    ]
  }

  const sizeClasses = {
    default: ['h-10', 'px-4', 'py-2'],
    sm: ['h-9', 'rounded-md', 'px-3'],
    lg: ['h-11', 'rounded-md', 'px-8'],
    icon: ['h-10', 'w-10']
  }

  return [
    ...baseClasses,
    ...variantClasses[props.variant],
    ...sizeClasses[props.size],
    props.class
  ].join(' ')
})
</script>

<style scoped>
.ring-offset-background {
  --tw-ring-offset-color: white;
}

.focus-visible\:ring-ring:focus-visible {
  --tw-ring-color: rgb(59 130 246);
}

.focus-visible\:ring-offset-2:focus-visible {
  --tw-ring-offset-width: 2px;
}

.focus-visible\:ring-2:focus-visible {
  --tw-ring-width: 2px;
}
</style>