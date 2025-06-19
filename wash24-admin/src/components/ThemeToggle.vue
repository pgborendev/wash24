<!-- ThemeToggle.vue -->
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { Icon } from '@iconify/vue';
import Button from './ui/button/Button.vue';

// Define theme types
type Theme = 'light' | 'dark' | 'system';

// Reactive theme state
const currentTheme = ref<Theme>('system');
const displayTheme = ref<'light' | 'dark'>('light');

// Initialize theme
onMounted(() => {
  const storedTheme = localStorage.getItem('theme') as Theme | null;
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Set initial theme
  currentTheme.value = storedTheme || 'system';
  updateTheme();

  // Watch system preference changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    if (currentTheme.value === 'system') {
      displayTheme.value = e.matches ? 'dark' : 'light';
    }
  });
});

// Update theme based on selection
const updateTheme = () => {
  let themeToApply: 'light' | 'dark';

  if (currentTheme.value === 'system') {
    themeToApply = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } else {
    themeToApply = currentTheme.value;
  }

  // Update DOM
  displayTheme.value = themeToApply;
  document.documentElement.classList.toggle('dark', themeToApply === 'dark');

  // Save preference
  localStorage.setItem('theme', currentTheme.value);
};

// Toggle through themes
const toggleTheme = () => {
  const themes: Theme[] = ['light', 'dark', 'system'];
  const currentIndex = themes.indexOf(currentTheme.value);
  currentTheme.value = themes[(currentIndex + 1) % themes.length];
  updateTheme();
};

// Watch for theme changes
watch(currentTheme, updateTheme);
</script>

<template>

  <Button variant="ghost" size="icon" @click="toggleTheme" class="h-7 w-7 relative font-medium">

    <!-- Light theme icon -->
    <Icon icon="lucide:sun" class="w-5 h-5  transition-all duration-300 absolute inset-0 m-auto" :class="{
      'opacity-100 scale-100': displayTheme === 'light',
      'opacity-0 scale-0': displayTheme !== 'light'
    }" />

    <!-- Dark theme icon -->
    <Icon icon="lucide:moon" class="w-5 h-5 text-indigo-300 transition-all duration-300 absolute inset-0 m-auto" :class="{
      'opacity-100 scale-100': displayTheme === 'dark',
      'opacity-0 scale-0': displayTheme !== 'dark'
    }" />

  </Button>

</template>