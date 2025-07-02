<script setup lang="ts">

  import AppSidebar from '@/components/layout/AppSidebar.vue';
  import { SidebarProvider } from '@/components/ui/sidebar'
  import SidebarInset from '@/components/ui/sidebar/SidebarInset.vue';

</script>

<template>
  <SidebarProvider>
      <!-- <AppSidebar/> -->
      <SidebarInset class="min-w-0 w-full h-full flex-1 overflow-x-auto">
      <main>
        <router-view></router-view>
      </main>
      </SidebarInset> 
  </SidebarProvider>
</template>


