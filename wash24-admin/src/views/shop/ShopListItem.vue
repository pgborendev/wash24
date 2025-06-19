<script setup lang="ts">
import { Icon } from '@iconify/vue';

interface Shop {
  name: string;
  address: string;
  phone: string;
  email: string;
  bakongId: string;
  logo?: string; // Made optional with ?
}

defineProps<{
  data: Shop;
}>();
</script>

<template>
    <div class="
    
    bg-muted
    rounded-lg shadow-md 
    overflow-hidden 
    hover:shadow-lg 
    transition-all duration-300 
    border border-gray-200 dark:border-accent
    p-2 sm:p-3">

    <div class="flex items-center gap-3 sm:gap-4">
      
      <div class="
        w-15 h-15       /* Default mobile size */
        xs:w-18 xs:h-18 /* Larger phones */
        sm:w-16 sm:h-16 /* Small tablets */
        md:w-16 md:h-16 /* iPad Mini/standard tablets */
        lg:w-14 lg:h-14 /* iPad Pro */
        xl:w-18 xl:h-18 /* Large desktops */
        rounded-full 
        border-1 border-gray-200 dark:border-accent
        flex items-center justify-center
        bg-gray-100 dark:bg-background
      ">
        <Icon icon="lucide:store" class="
          w-5 h-5       /* Default mobile */
          xs:w-5 xs:h-5  /* Larger phones */
          sm:w-4 sm:h-4  /* Small tablets */
          md:w-5 md:h-5  /* Standard tablets */
          lg:w-5 lg:h-5  /* iPad Pro */
          xl:w-6 xl:h-6  /* Large desktops */
          text-gray-600 dark:text-gray-300
        "/>
      </div>
      

      <!-- Shop Info -->
      <div class="flex-1 min-w-0 space-y-0 sm:space-y-1.5">
        
        <h3 class="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-100 truncate">{{ data.name }}</h3>

        <p class="text-xs sm:text-xs text-gray-600 dark:text-gray-300">{{ data.address }}</p>
        <!-- Vertical contact info -->
        <div class="space-y-0">
          <p class="text-xs sm:text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1">
            <Icon icon="lucide:phone" />
            {{ data.phone }}
          </p>
          <p class="text-xs sm:text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1">
            <Icon icon="lucide:mail"/>
            {{ data.email }}
          </p>
          <p class="text-xs sm:text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1">
            <Icon icon="lucide:id-card"/>
            {{ data.bakongId }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>