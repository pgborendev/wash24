<script setup lang="ts">
import AppUserNav from '@/components/layout/AppUserNav.vue'
import SidebarTrigger from '../ui/sidebar/SidebarTrigger.vue';
import AppViewTitle from './AppViewTitle.vue';
import Separator from '../ui/separator/Separator.vue';
import Search from './Search.vue';
import AppBreadcrumb from './AppBreadcrumb.vue';
import ThemeToggle from '../ThemeToggle.vue';

withDefaults(defineProps<{
  title?: string
}>(), {
  title: ''
})

</script>

<template>
  <header class="sticky top-0 z-10 h-53px flex items-center gap-4 border-b bg-background backdrop-blur">
    <div class="w-full flex items-center gap-2 px-4 h-13">
      <SidebarTrigger  class="-ml-1"/>
      <Separator orientation="vertical" class="!h-4" />
      <AppViewTitle class="justify-self-stretch" :text="title" />
      <div class="ml-auto flex items-center gap-2 pr-1">
        <!-- <Search /> -->
        <AppUserNav />
        <!-- <ThemeToggle /> -->
      </div>
    </div>
  </header>
</template>
