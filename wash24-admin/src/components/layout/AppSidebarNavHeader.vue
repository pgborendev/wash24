<script setup lang="ts">
import { ref } from 'vue';
import SidebarMenu from '../ui/sidebar/SidebarMenu.vue';
import SidebarMenuItem from '../ui/sidebar/SidebarMenuItem.vue';
import DropdownMenu from '../ui/dropdown-menu/DropdownMenu.vue';
import DropdownMenuTrigger from '../ui/dropdown-menu/DropdownMenuTrigger.vue';
import SidebarMenuButton from '../ui/sidebar/SidebarMenuButton.vue';
import DropdownMenuContent from '../ui/dropdown-menu/DropdownMenuContent.vue';
import DropdownMenuLabel from '../ui/dropdown-menu/DropdownMenuLabel.vue';
import DropdownMenuItem from '../ui/dropdown-menu/DropdownMenuItem.vue';
import DropdownMenuShortcut from '../ui/dropdown-menu/DropdownMenuShortcut.vue';
import DropdownMenuSeparator from '../ui/dropdown-menu/DropdownMenuSeparator.vue';
import { Icon } from '@iconify/vue';
  
const props = defineProps<{
  teams: {
    name: string
    logo: string
    plan: string
  }[]
}>();

const isMobile = false;

const activeTeam = ref(props.teams[0]);

</script>

<template>
  
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
            <div class="aspect-square size-8 flex items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Icon :icon="activeTeam.logo" class="size-4"  />
            </div>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-semibold">
                {{ activeTeam.name }}
              </span>
              <span class="truncate text-xs">{{ activeTeam.plan }}</span>
            </div>
            <Icon icon="lucide:chevrons-up-down" class="ml-auto"/>
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="min-w-56 w-[--radix-dropdown-menu-trigger-width] rounded-lg"
          align="start"
          :side="isMobile ? 'bottom' : 'right'">
          <DropdownMenuLabel class="text-xs text-muted-foreground">
            Teams
          </DropdownMenuLabel>
          <DropdownMenuItem
            v-for="(team, index) in teams"
            :key="team.name"
            class="gap-2 p-2"
            @click="activeTeam = team">
            <div class="size-6 flex items-center justify-center border rounded-sm">
              <Icon :icon="team.logo" class="size-4 shrink-0" />
            </div>
            {{ team.name }}
            <DropdownMenuShortcut>⌘{{ index + 1 }}</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem class="gap-2 p-2">
            <div class="size-6 flex items-center justify-center border rounded-md bg-background">
              <Icon icon="lucide:plus" class="size-4" />
            </div>
            <div class="text-muted-foreground font-medium">
              Add New Shop
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
  
</template>

<style scoped>

</style>
