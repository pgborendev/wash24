import { createWebHistory, createRouter, type RouteRecordRaw } from 'vue-router'
import ShopListView from '@/views/shop/ShopListView.vue'

import AppLayout from '@/layouts/AppLayout.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'
import ForgetPassword from '@/views/auth/ForgetPassword.vue'
import SigninView from '@/views/auth/Signin.vue'
import OtpVerify from '@/views/auth/OtpVerify.vue'
import ChangePassword from '@/views/auth/ChangePassword.vue'
import { authDataStore } from '@/store/authDataStore'
import ShopAdd from '@/views/shop/ShopAddNew.vue'
import ShopDetailView from '@/views/shop/ShopDetailView.vue'


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: AppLayout,
    redirect: "/",
    meta: { isBlankLayout: false },
    children: [
      {  
        path: "/", 
        name: 'Home', 
        component: ShopListView, 
        meta: { requiresAuth: true }
      },
      { 
        path: '/:id', 
        name: 'SHOP_DETAIL_VIEW', 
        component: ShopDetailView, 
        meta: { requiresAuth: true } 
      },
      { 
        path: '/new_shop', 
        name: 'SHOP_ADD_NEW', 
        component: ShopAdd, 
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
  
  const isLogin = authDataStore().isLoggedIn;
  if (to.meta.requiresAuth && !isLogin) {
    next('/login'); // Redirect to login page if route requires auth and user is not authenticated
  } else if (to.path === '/login' && isLogin) {
    next('/'); // Redirect away from login if user is already authenticated
  } else {
    next(); // Continue navigation
  }
})

export default router