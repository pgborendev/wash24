<script setup lang="ts">

import ThemeToggle from '@/components/ThemeToggle.vue'
import { useTheme } from '@/composables/useTheme'
import { RouterView } from 'vue-router'

const { isDark } = useTheme()

</script>

<template>
  <Body class="bg-background overscroll-none font-sans antialiased ">
    <!-- <ThemeToggle/> -->
    <div :class="{ dark: isDark }">
      <RouterView />
    </div>
  </Body>
</template>
