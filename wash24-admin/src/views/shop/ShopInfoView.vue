<script setup lang="ts">
import { Icon } from '@iconify/vue';
import apiEndpoints from '@/config/config';

import Button from '@/components/ui/button/Button.vue';
import Avatar from '@/components/ui/avatar/Avatar.vue';
import AvatarImage from '@/components/ui/avatar/AvatarImage.vue';
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue';



withDefaults(defineProps<{
  shop: any
}>(), {
  shop: {}
})

</script>

<template>

<div class="w-fit overflow-hidden border-b border rounded-2xl p-6 space-y-4">
    <div class="flex items-start space-y-4 space-x-3">
      <Avatar class="h-16 w-16 rounded-lg border">
        <AvatarImage :src="shop.logo ? apiEndpoints.base + shop.logo : ''" class="object-contain" alt="Shop logo"/>
        <AvatarFallback class="
          w-full h-full
          bg-gray-200 dark:bg-gray-700
          text-gray-500 dark:text-gray-300
          flex items-center justify-center">
          <Icon icon="lucide:store" class="w-6 h-6" />
        </AvatarFallback>
      </Avatar>
      <div class="space-y-2">
        <h1 class="text-xl font-semibold">{{ shop.name }}</h1>
        <div class="flex items-center gap-2 text-muted-foreground">
          <Icon icon="lucide:id-card" class="h-4 w-4" />
          <span class="text-sm">Bakong ID: {{ shop.bakongId }}</span>
        </div>
      </div>
    </div>

    <!-- Contact Information -->
    <div class="flex items-start space-y-4">
      <h3 class="font-medium flex items-center gap-2 text-muted-foreground">
        <Icon icon="lucide:contact" class="h-4 w-4" />
        Contact Information
      </h3>
    </div>

    <div class="space-y-4">
        <!-- Address -->
        <div class="flex items-start gap-3">
          <div class="p-1.5 rounded-lg bg-muted">
            <Icon icon="lucide:map-pin" class="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Address</p>
            <p class="font-medium">{{ shop.address }}</p>
          </div>
        </div>
        
        <!-- Phone -->
        <div class="flex items-start gap-3">
          <div class="p-1.5 rounded-lg bg-muted">
            <Icon icon="lucide:phone" class="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Phone</p>
            <p class="font-medium">{{ shop.phone }}</p>
          </div>
        </div>
        
        <!-- Email -->
        <div class="flex items-start gap-3" v-if="shop.email">
          <div class="p-1.5 rounded-lg bg-muted">
            <Icon icon="lucide:mail" class="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Email</p>
            <p class="font-medium">{{ shop.email }}</p>
          </div>
        </div>
      </div>
</div>


</template>