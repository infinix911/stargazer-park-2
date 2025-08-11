<template>
  <div class="relative z-10 bg-black/20 backdrop-blur-md border-b border-white/10">
    <div class="max-w-[1500px] mx-auto px-4 py-6">
      <div class="flex items-center gap-3">
        <div class="p-3 bg-gradient-to-r rounded-xl shadow-lg w-12 h-12 flex items-center justify-center" :class="iconGradient">
          <i :class="`${icon} text-white text-xl`"></i>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-white">{{ title }}</h1>
          <p class="text-sm text-gray-400">{{ subtitle }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "PartnerPageHeader",
  props: {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    iconColor: {
      type: String,
      default: "green-blue",
      validator: (value: string) => 
        ["green-blue", "purple-indigo", "blue-indigo", "red-rose", "yellow-orange"].includes(value)
    }
  },
  setup(props) {
    const iconGradient = computed(() => {
      const gradients = {
        "green-blue": "from-green-500 to-blue-600",
        "purple-indigo": "from-purple-500 to-indigo-600", 
        "blue-indigo": "from-blue-500 to-indigo-600",
        "red-rose": "from-red-500 to-rose-600",
        "yellow-orange": "from-yellow-500 to-orange-600"
      };
      return gradients[props.iconColor as keyof typeof gradients];
    });

    return {
      iconGradient
    };
  }
});
</script>