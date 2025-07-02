<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Icon } from '@iconify/vue';

</script>

<template>     
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon" class="rounded-full absolute top-3 right-3 p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
        <Icon icon="lucide:more-vertical" class="h-5 w-5" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="absolute right-0 mt-1 w-48 rounded-lg shadow-lg border bg-background z-50">
      <DropdownMenuItem class="px-4 py-2 hover:bg-muted cursor-pointer transition-colors">
        <Icon icon="lucide:pencil" class="h-4 w-4 mr-2" />
        Edit
      </DropdownMenuItem>
      <DropdownMenuItem class="px-4 py-2 text-red-500 hover:bg-red-500/10 cursor-pointer transition-colors">
        <Icon icon="lucide:trash-2" class="h-4 w-4 mr-2" />
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>