import { createWebHistory, createRouter, type RouteRecordRaw } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import HelloWorld from '@/views/HelloWorld.vue'
import AppLayout from '@/layouts/AppLayout.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'
import ForgetPassword from '@/views/auth/ForgetPassword.vue'
import SigninView from '@/views/auth/Signin.vue'
import apiEndpoints from '@/config/config'
import OtpVerify from '@/views/auth/OtpVerify.vue'
import ChangePassword from '@/views/auth/ChangePassword.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: AppLayout,
    redirect: "/dashboards",
    meta: { isBlankLayout: false },
    children: [
      {  
        path: "/dashboards", 
        name: 'Dashboard', 
        component: Dashboard, 
        meta: { requiresAuth: true }
      },
      { 
        path: '/hello', 
        name: 'HelloWorld', 
        component: HelloWorld, 
        meta: { requiresAuth: true } 
      },
    ],
  },
  {
    path: '/login',
    component: BlankLayout,
    meta: { isBlankLayout: true },
    children: [
      { path: '', name: 'LOGIN', component: SigninView },
    ],
  },
  {
    path: '/forgot_password',
    component: BlankLayout,
    meta: { isBlankLayout: true },
    children: [
      { path: '', name: 'ForgotPassword', component: ForgetPassword },
    ],
  },
  {
    path: '/otp_verify',
    component: BlankLayout,
    meta: { isBlankLayout: true },
    children: [
      { path: '', name: 'OtpVerify', component: OtpVerify },
    ],
  },
  {
    path: '/change_password',
    component: BlankLayout,
    meta: { isBlankLayout: true },
    children: [
      { path: '', name: 'ChangePassword', component: ChangePassword },
    ],
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  // Lazy import the AuthenticationService to ensure Pinia is initialized
  const { default: AuthenticationService } = await import('@/services/AuthenticationService')
  const authService = new AuthenticationService(apiEndpoints)
  
  // await authService.signOut();
  const checkAuth = await authService.checkAuth();
  
  if (to.meta.requiresAuth && !checkAuth.isAuthenticated) {
    next('/login'); // Redirect to login page if route requires auth and user is not authenticated
  } else if (to.path === '/login' && checkAuth.isAuthenticated) {
    next('/'); // Redirect away from login if user is already authenticated
  } else {
    next(); // Continue navigation
  }
})

export default router