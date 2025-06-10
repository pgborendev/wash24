<script setup lang="ts">
  import AppUserNav from '@/components/layout/AppUserNav.vue'
import SidebarTrigger from '../ui/sidebar/SidebarTrigger.vue';
import AppBreadcrumb from './AppBreadcrumb.vue';
import Separator from '../ui/separator/Separator.vue';
import Search from './Search.vue';
</script>

<template>


 <header class="sticky top-0 z-10 h-53px flex items-center gap-4 border-b bg-background backdrop-blur px-4 md:px-6">
    <div class="w-full flex items-center gap-4 h-12">
      <SidebarTrigger />
      <Separator orientation="vertical" class="!h-4" />
      <AppBreadcrumb class="justify-self-stretch"/>
      <div class="ml-auto flex items-center space-x-4">
        <Search />
        <AppUserNav/>
      </div>
    </div>
  </header>

</template>
