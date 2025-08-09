<template>
	<div class="w-full absolute top-0 z-[40]">
		<div class="banner-navigations">
			<span :class="['casino', props.currentSlide === 1 ? 'active' : '']">
				<button>카지노</button>
			</span>
			<span :class="['slot', props.currentSlide === 0 ? 'active' : '']">
				<button>슬롯</button>
			</span>
		</div>
	</div>
</template>

<script setup lang="ts">
// Define props
interface Props {
  currentSlide: number
}

const props = defineProps<Props>()
</script>

<style lang="css" scoped>
.banner-navigations {
	display: flex;
	align-items: flex-start;
	position: relative;
	margin: 0 auto;
	left: -35px;
	width: 1660px;
	height: 100%;
	gap: 20px;
}

.banner-navigations span {
	z-index: 1000;
	flex: .2;
	height: 160px;
	background-color: #07a1e3;
	transform: skew(-25deg);
	color: #ffffff4d;
	transition: flex .5s;
	cursor: pointer;
}

.banner-navigations span.casino.active {
	flex: .9;
	cursor: default;
	animation: CASINActived 1s;
	background-color: transparent;
	transform: skew(-25deg) scaleY(5) translate(36px);
	transform-origin: top;
	background-image: linear-gradient(to bottom, #cf48fc, rgba(207, 72, 252, 0));
}

.banner-navigations span.slot.active {
	flex: .8;
	cursor: default;
	animation: SLOTTActived 1s;
	background-color: transparent;
	transform-origin: top;
	transform: skew(-25deg) scaleY(5) translate(30px);
	background-image: linear-gradient(to bottom, #fc4848, rgba(252, 72, 72, 0));
}

.banner-navigations span.slot {
	background-color: #761696;
}

.banner-navigations span.casino {
	background-color: #7e0e0e;
}

/* .banner-navigations span.casino:hover {
	background-color: #761696;
}

.banner-navigations span.slot:hover {
	background-color: #7e0e0e;
} */

@keyframes CASINActived {
	0% {
			flex: .2;
			background-color: #761696;
			transform: skew(-25deg) scaleY(1) translate(36px)
	}

	50% {
			flex: .9;
			transform: skew(-25deg) scaleY(1) translate(36px)
	}

	to {
			flex: .9;
			background-color: transparent;
			background-image: linear-gradient(to bottom,#cf48fc,rgba(207,72,252,0));
			transform: skew(-25deg) scaleY(5) translate(36px)
	}
}

@keyframes SLOTTActived {
	0% {
			flex: .2;
			background-color: #036892;
			transform: skew(-25deg) scaleY(1) translate(30px)
	}

	50% {
			flex: .8;
			transform: skew(-25deg) scaleY(1) translate(30px)
	}

	to {
			flex: .8;
			background-color: transparent;
			background-image: linear-gradient(to bottom,#fc4848,rgba(252,72,72,0));
			transform: skew(-25deg) scaleY(5) translate(30px)
	}
}

.banner-navigations span.casino.active button {
	display: none;
}

.banner-navigations span.slot.active button {
	display: none;
}

.banner-navigations span button {
	display: block;
	position: absolute;
	left: 25px;
	bottom: 20px;
	font-size: 28px;
	font-weight: 600;
	transform: skew(22deg);
}

</style>