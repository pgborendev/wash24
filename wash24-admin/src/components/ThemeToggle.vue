<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useTheme } from '@/composables/useTheme'
import { Moon, Sun } from 'lucide-vue-next'

const { isDark, toggle } = useTheme()
</script>

<template>
  <Button variant="ghost" size="icon" @click="toggle">
    <Sun v-if="!isDark" class="h-4 w-4" />
    <Moon v-else class="h-4 w-4" />
  </Button>
</template>