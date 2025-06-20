<script setup lang="ts">

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useRouter } from 'vue-router';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/composables/useAuth';
import Button from '../ui/button/Button.vue';
import { Icon } from '@iconify/vue';

const router = useRouter();

async function handleItemClick(itemName: string) {
  console.log(`${itemName} was clicked`);
  await useAuth().signOut();
  await router.push({ name: 'LOGIN' })
}

</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Avatar>
        <AvatarImage src="https://localhost:8080/public/uploads/profile/avatar.jpeg" alt="@unovue" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56" align="end">
      <DropdownMenuLabel class="font-normal flex">
        <div class="flex flex-col space-y-1 w-full items-center p-2">
          <Avatar>
            <AvatarImage src="https://localhost:8080/public/uploads/profile/avatar.jpeg" alt="@unovue" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <p class="text-sm font-medium leading-none">
            shadcn
          </p>
          <p class="text-xs leading-none text-muted-foreground">
            m@example.com
          </p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <Icon icon="lucide:user" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Icon icon="lucide:settings" />
          Settings
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem @select="handleItemClick('Logout')">
        <Icon icon="lucide:log-out" />
        Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

</template>