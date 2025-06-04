// ~/middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth()
  
  if (to.path === '/login') return

  if (to.path === '/forgot-password') return

  if (to.path === '/change-password') return

  if (to.path === '/otp-validation') return
  
  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }
})