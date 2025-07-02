<script lang="ts" setup>
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Icon } from '@iconify/vue'
import DropdownMenu from '../ui/dropdown-menu/DropdownMenu.vue'
import DropdownMenuTrigger from '../ui/dropdown-menu/DropdownMenuTrigger.vue'
import DropdownMenuContent from '../ui/dropdown-menu/DropdownMenuContent.vue'
import DropdownMenuItem from '../ui/dropdown-menu/DropdownMenuItem.vue'

interface BreadcrumbItem {
  name: string
  href: string
  icon?: string
  active?: boolean
  menus?: {
    id: string
    name: string
    href: string
    icon?: string
    active?: boolean
  }[]
}

withDefaults(defineProps<{
  items: BreadcrumbItem[]
}>(), {
  items: () => []
})


</script>

<template>
  <Breadcrumb>
    <BreadcrumbList>
      <!-- Always show Home first -->
      <BreadcrumbItem>
        <BreadcrumbLink href="/" class="breadcrumb-link">
          <Icon icon="lucide:home" class="h-3.5 w-3.5 mr-1" />
          <span>Home</span>
        </BreadcrumbLink>
        <BreadcrumbSeparator v-if="items.length > 0" />
      </BreadcrumbItem>
      
      <!-- Dynamic items -->
      <template v-for="(item, index) in items" :key="index">
        <BreadcrumbItem>
          <!-- Dropdown for items with menus -->
          <DropdownMenu v-if="item.menus && item.menus.length > 0">
            <DropdownMenuTrigger class="flex items-center gap-1">
              <Icon v-if="item.icon" :icon="item.icon" class="h-3.5 w-3.5 mr-1" />
              <span>{{ item.name }}</span>
              <Icon icon="lucide:chevron-down" class="h-4 w-4 ml-1" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem 
                v-for="menu in item.menus" 
                :key="menu.id"
                :class="{'opacity-100': menu.active, 'opacity-70': !menu.active}">
                <div class="flex items-center gap-2 w-full">
                  <BreadcrumbLink :href="menu.active ? '#' : menu.href"  class="breadcrumb-link flex-1" :class="{'cursor-default': menu.active}">
                    <Icon v-if="menu.icon" :icon="menu.icon" class="mr-1"/>
                    <span>{{ menu.name }}</span>
                  </BreadcrumbLink>
                  <Icon 
                    v-if="menu.active" 
                    icon="lucide:check" 
                    class="h-3.5 w-3.5 text-primary" 
                  />
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <!-- Regular item (no dropdown) -->
          <div v-else class="flex items-center gap-1">
            <Icon 
              v-if="item.active" 
              icon="lucide:check" 
              class="h-3.5 w-3.5 text-primary" 
            />
            <BreadcrumbLink 
              :href="item.active ? '#' : item.href" 
              class="breadcrumb-link"
              :class="{'cursor-default': item.active}">
              <Icon v-if="item.icon" :icon="item.icon" class="h-3.5 w-3.5" />
              <span>{{ item.name }}</span>
            </BreadcrumbLink>
          </div>

          <BreadcrumbSeparator v-if="index < items.length - 1" />
        </BreadcrumbItem>
      </template>
    </BreadcrumbList>
  </Breadcrumb>
</template>

<style scoped>
.breadcrumb-link {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  text-decoration: none;
  font-size: 0.875rem;
  line-height: 1.25rem;
  transition: opacity 0.2s ease;
}

.breadcrumb-link:hover:not(.cursor-default) {
  text-decoration: underline;
  color: hsl(var(--primary));
}

.cursor-default {
  cursor: default;
}
</style>