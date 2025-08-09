<template>
  <div class="relative w-[1660px] mx-auto z-0">
		<span :class="['floating-bg casino', props.currentSlide === 1 ? 'active' : '']"></span>
		<span :class="['floating-bg slot', props.currentSlide === 0 ? 'active' : '']"></span>
	</div>
</template>

<script setup lang="ts">
import { watch } from 'vue'

// Define props
interface Props {
  currentSlide: number
}

const props = defineProps<Props>()

// Watch for prop changes to debug
watch(() => props.currentSlide, (newSlide) => {
  console.log('HotBrandBackground: currentSlide changed to:', newSlide)
})
</script>

<style scoped>
.floating-bg {
	position: absolute;
	display: block;
	right: 0;
	width: 1114px;
	height: 840px;
	background-image: linear-gradient(to bottom, rgba(19, 146, 125, .6), rgba(19, 146, 125, 0));
	transform: skew(27deg);
	transition: all 10s ease;
	opacity: 0;
	z-index: -1;
	transition: opacity 2s ease;
	transition-delay: .3s;
}

.floating-bg.active {
	opacity: 1;
}

.floating-bg.casino {
    background-image: linear-gradient(to bottom, rgba(207, 72, 252, .6), rgba(207, 72, 252, 0));
}

.floating-bg.slot {
    background-image: linear-gradient(to bottom, #fc4848, rgba(252, 72, 72, 0));
}
</style>