<script setup lang="ts">
import { ref } from 'vue'
import SidebarMenuButton from '../ui/sidebar/SidebarMenuButton.vue';
import Button from '../ui/button/Button.vue';
import { Icon } from '@iconify/vue';

const openCommand = ref(false)


function handleSelectLink(link: string) {

  openCommand.value = false
}
</script>


<template>
  <SidebarMenuButton as-child tooltip="Search" class="w-80">
    <Button variant="outline" size="sm" class="text-xs" @click="openCommand = !openCommand">
      <Icon icon="lucide:search" />
      <span class="font-normal group-data-[collapsible=icon]:hidden">Search documentation</span>
      <div class="ml-auto flex items-center space-x-0.5 group-data-[collapsible=icon]:hidden">
      </div>
    </Button>
  </SidebarMenuButton>

  
</template>

<style scoped>

</style>
