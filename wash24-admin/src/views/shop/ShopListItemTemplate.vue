
<script setup lang="ts">
  import Avatar from '@/components/ui/avatar/Avatar.vue';
  import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue';
  import AvatarImage from '@/components/ui/avatar/AvatarImage.vue';
  import type ShopModel from '@/models/ShopModel';
  import { Icon } from '@iconify/vue';
  import apiEndpoints from '@/config/config';

  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu'
  import Button from '@/components/ui/button/Button.vue';

  // Store the props in a variable
  const props = defineProps<{
    data: ShopModel;
  }>();

  const emit = defineEmits<{
    (e: 'view', shop: ShopModel): void
    (e: 'edit', shop: ShopModel): void
    (e: 'delete', shop: ShopModel): void
  }>()

  const handleView = () => emit('view', props.data);
  const handleEdit = () => emit('edit', props.data);
  const handleDelete = () => emit('delete', props.data);
</script>

<template>
  <div class="bg-muted
    rounded-lg shadow-md 
    overflow-hidden 
    hover:shadow-lg 
    transition-all duration-300 
    border border-gray-200 dark:border-accent
    relative
    p-4">

    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" class="rounded-full absolute top-0 right-0 p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <Icon icon="lucide:more-vertical" class="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent class="absolute right-0 w-fit rounded-lg shadow-lg border bg-background z-50">
        <DropdownMenuItem class="px-4 py-1.5 hover:bg-muted cursor-pointer transition-colors"
          @select="handleView">
          <Icon icon="lucide:eye" class="h-4 w-4 mr-2" />
          View
        </DropdownMenuItem>
        <DropdownMenuItem class="px-4 py-1.5 hover:bg-muted cursor-pointer transition-colors"
          @select="handleEdit">
          <Icon icon="lucide:pencil" class="h-4 w-4 mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem class="px-4 py-1.5 text-red-500 hover:bg-red-500/10 cursor-pointer transition-colors"
          @select="handleDelete">
          <Icon icon="lucide:trash-2" class="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <!-- Shop Header -->
    <div class="flex items-start gap-4">
      <!-- Shop Logo -->
      <Avatar class="
        w-16 h-16
        rounded-lg 
        border-1 border-gray-200 dark:border-accent
        flex items-center justify-center
        bg-gray-100 dark:bg-background
        flex-shrink-0">
        <AvatarImage :src="apiEndpoints.base + data.logo" class="object-contain" alt="Shop logo" v-if="data.logo" />
        <AvatarFallback class="
          w-full h-full
          bg-gray-200 dark:bg-gray-700
          text-gray-500 dark:text-gray-300
          flex items-center justify-center">
          <Icon icon="lucide:store" class="w-6 h-6" />
        </AvatarFallback>
      </Avatar>
      
      <!-- Shop Info -->
      <div class="flex-1 min-w-0">
        
        <div class="flex">
          <h3 class="text-mid font-semibold text-gray-800 dark:text-gray-100">{{ data.name }}</h3>
        </div>
        <div class="flex items-center gap-1 text-sm">
          <div class="p-0.5">
            <Icon icon="lucide:map-pin" class="text-primary w-3 h-3" />
          </div>
          <span class="truncate">{{ data.address }}</span>
        </div>
        
        <div class="flex items-center gap-1 text-sm">
          <div class="p-0.5">
            <Icon icon="lucide:phone" class="text-primary w-3 h-3" />
          </div>
          <span class="truncate">{{ data.phone }}</span>
        </div>

        <div class="flex items-center gap-1 text-sm">
          <div class="p-0.5">
            <Icon icon="lucide:mail" class="text-primary w-3 h-3" />
          </div>
          <span>{{ data.email }}</span>
        </div>
        
        <div class="flex items-center gap-1 text-sm col-span-2">
          <div class="p-0.5">
            <Icon icon="lucide:id-card" class="text-primary w-3 h-3" />
          </div>
          <span class="truncate">{{ data.bakongId || 'Not provided' }}</span>
        </div>
        
      </div>
    </div>
    
  </div>
</template>