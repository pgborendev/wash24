<script setup lang="ts">
import Avatar from '@/components/ui/avatar/Avatar.vue';
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue';
import AvatarImage from '@/components/ui/avatar/AvatarImage.vue';
import type ShopModel from '@/models/ShopModel';
import { Icon } from '@iconify/vue';
import apiEndpoints from '@/config/config';




defineProps<{
  data: ShopModel;
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
      <Avatar class="w-15 h-15    
        xs:w-18 xs:h-18 
        sm:w-16 sm:h-16 
        md:w-16 md:h-16 
        lg:w-14 lg:h-14  
        xl:w-18 xl:h-18
        rounded-full 
        border-1 border-gray-200 dark:border-accent
        flex items-center justify-center
        bg-gray-100 dark:bg-background">
        <AvatarImage :src="apiEndpoints.base + data.logo" class="object-contain" alt="@unovue" v-if="data.logo" />
        <AvatarFallback class="
          w-5 h-5    
          xs:w-5 xs:h-5 
          sm:w-4 sm:h-4 
          md:w-5 md:h-5 
          lg:w-5 lg:h-5 
          xl:w-6 xl:h-6 
          bg-transparent
          dark:text-gray-300" v-else>CN</AvatarFallback>
      </Avatar> 
      <!-- Shop Info -->
      <div class="flex-1 min-w-0 space-y-0 sm:space-y-1.5">
        <h3 class="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-100 truncate">{{ data.name }}</h3>
        <p class="text-xs sm:text-xs text-gray-600 dark:text-gray-300">{{ data.address }}</p>
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