<template>
  <section class="py-2 bg-[#000]">
    <div class="max-w-[1660px] mx-auto px-4">
      <!-- Section Header -->
      <!-- <div class="text-center mb-8">
        <h2 class="text-3xl font-black text-white mb-4">{{ t('providers.title') }}</h2>
        <p class="text-gray-400 text-lg">{{ t('providers.subtitle') }}</p>
      </div> -->

      <!-- Provider Marquee -->
      <div class="relative overflow-hidden">
        <!-- Provider Logos Marquee -->
        <div class="marquee-container py-8">
          <div class="marquee-content">
            <div 
              v-for="provider in providers" 
              :key="provider.id"
              class="flex-shrink-0 bg-gray-800 rounded-lg p-0 h-[80px] w-[131px] flex items-center justify-center hover:bg-gray-700 transition-colors duration-300 mx-1"
            >
              <img 
                :src="provider.logo" 
                :alt="provider.name"
                class="max-h-full max-w-full object-contain filter grayscale brightness-75 hover:brightness-100 transition-all duration-300"
              />
            </div>
            <!-- Duplicate for seamless loop -->
            <div 
              v-for="provider in providers" 
              :key="`duplicate-${provider.id}`"
              class="flex-shrink-0 bg-gray-800 rounded-lg h-[80px] w-[131px] flex items-center justify-center hover:bg-gray-700 transition-colors duration-300 mx-1"
            >
              <img 
                :src="provider.logo" 
                :alt="provider.name"
                class="max-h-full max-w-full object-contain filter grayscale brightness-75 hover:brightness-100 transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Provider data
const providers = [
  {
    id: 1,
    name: 'Evolution Gaming',
    logo: '/images/provider/evolution.svg'
  },
  {
    id: 2,
    name: 'Pragmatic Play',
    logo: '/images/provider/pragmatic.svg'
  },
  {
    id: 3,
    name: 'Microgaming',
    logo: '/images/provider/microgaming.svg'
  },
  {
    id: 4,
    name: 'NetEnt',
    logo: '/images/provider/netent.svg'
  },
  {
    id: 5,
    name: 'No Limit City',
    logo: '/images/provider/nolimit_city.svg'
  },
  {
    id: 6,
    name: 'Red Tiger',
    logo: '/images/provider/red_tiger.svg'
  },
  {
    id: 7,
    name: 'Wazdan',
    logo: '/images/provider/wazdan.svg'
  },
  {
    id: 8,
    name: 'Habanero',
    logo: '/images/provider/habanero.svg'
  },
  {
    id: 9,
    name: 'Play\'n GO',
    logo: '/images/provider/play_go.svg'
  },
  {
    id: 10,
    name: 'Spinomenal',
    logo: '/images/provider/spinomenal.svg'
  },
  {
    id: 11,
    name: 'OneTouch',
    logo: '/images/provider/onetouch.svg'
  },
  {
    id: 12,
    name: 'Playson',
    logo: '/images/provider/playson.svg'
  },
  {
    id: 13,
    name: 'CQ9 Gaming',
    logo: '/images/provider/cq_9.svg'
  },
  {
    id: 14,
    name: 'Evoplay',
    logo: '/images/provider/evoplay.svg'
  },
  {
    id: 15,
    name: 'Genii',
    logo: '/images/provider/genii.svg'
  },
  {
    id: 16,
    name: 'Betsoft',
    logo: '/images/provider/betsoft.svg'
  }
]
</script>

<style scoped>
/* Marquee styles */
.marquee-container {
  overflow: hidden;
  position: relative;
}

.marquee-content {
  display: flex;
  animation: marquee 60s linear infinite;
  width: max-content;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

/* Pause on hover */
.marquee-container:hover .marquee-content {
  animation-play-state: paused;
}

/* Provider logo hover effects */
.provider-logo {
  transition: all 0.3s ease;
}

.provider-logo:hover {
  transform: scale(1.05);
  filter: brightness(1);
}
</style>
