import { ref, onMounted, onBeforeUnmount } from 'vue';

// Add this composable function

export const useResponsive = () => {
  const isMobile = ref(false);

  const checkScreenSize = () => {
    isMobile.value = window.innerWidth < 768; // 768px is typically tablet breakpoint
  };

  onMounted(() => {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', checkScreenSize);
  });

  return { isMobile };
}