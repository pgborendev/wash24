<script setup lang="ts">
import AppUserNav from '@/components/layout/AppUserNav.vue'
import AppViewTitle from './AppViewTitle.vue'
import AppBreadcrumb from './AppBreadcrumb.vue'

interface BreadcrumbItem {
  name: string
  href: string
  icon?: string
  active: boolean
  menus: any[]
}

withDefaults(defineProps<{
  title?: string
  breadcrumbItems?: BreadcrumbItem[]
}>(), {
  title: '',
  breadcrumbItems: () => []
})

</script>

<template>
  <header class="sticky top-0 z-10 h-[53px] flex items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="w-full flex items-center gap-4 px-4 h-full">
      <AppBreadcrumb :items="breadcrumbItems" />
      <AppViewTitle v-if="title" :title="title" />
      <div class="ml-auto flex items-center gap-2">
        <AppUserNav />
      </div>
    </div>
  </header>
  <slot name="actions"/>
</template>