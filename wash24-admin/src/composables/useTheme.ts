import { ref, onMounted, watch } from 'vue'

export function useTheme() {
  const isDark = ref(false)

  onMounted(() => {
    // Check localStorage or system preference
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      isDark.value = savedTheme === 'dark'
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      isDark.value = true
    }
    applyTheme()
  })

  watch(isDark, () => {
    applyTheme()
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  })

  function applyTheme() {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return { isDark, toggle: () => (isDark.value = !isDark.value) }
}