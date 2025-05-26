// ~/middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth()
  
  if (to.path === '/login') return
  
  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }
})