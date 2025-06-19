<script setup lang="ts">
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from '@/components/ui/sidebar'
    import AppSidebarNavHeader from './AppSidebarNavHeader.vue';
import SidebarGroupLabel from '../ui/sidebar/SidebarGroupLabel.vue';
import SidebarGroupContent from '../ui/sidebar/SidebarGroupContent.vue';
import SidebarMenu from '../ui/sidebar/SidebarMenu.vue';
import SidebarMenuItem from '../ui/sidebar/SidebarMenuItem.vue';
import SidebarMenuButton from '../ui/sidebar/SidebarMenuButton.vue';
import { Icon } from '@iconify/vue';

const items = [
    {
      title: "Home",
      url: "/",
      icon: "lucide:home",
    },
    {
      title: "Shops",
      url: "/shop",
      icon: "lucide:store",
    }
  ];
</script>

<template>
    <Sidebar>
    <SidebarHeader>
      <AppSidebarNavHeader :teams="[
        { name: 'Team A', logo: 'lucide:washing-machine', plan: 'Pro' },
        { name: 'Team B', logo: 'lucide:washing-machine', plan: 'Basic' }
      ]"/>
    </SidebarHeader>
    <SidebarContent>
         <SidebarGroup>
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
              <SidebarMenuItem v-for="item in items" :key="item.title">
                <SidebarMenuButton asChild>
                    <RouterLink :to="item.url">
                       <Icon :icon="item.icon" class="size-4" aria-hidden="true"/>
                      <span>{{item.title}}</span>
                    </RouterLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
    </SidebarFooter>
    
  </Sidebar>
</template>