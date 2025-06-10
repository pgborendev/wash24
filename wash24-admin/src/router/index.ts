
import { createWebHistory, createRouter, type RouteRecordRaw } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import HelloWorld from '@/views/HelloWorld.vue'
import AppLayout from '@/layouts/AppLayout.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'

import ForgetPassword from '@/views/auth/ForgetPassword.vue'
import { useUserStore } from '@/store/user'
import SigninView from '@/views/auth/Signin.vue'


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: AppLayout,
    redirect: "/dashboards",
    meta: { isBlankLayout: false },
    children: [
      {  path: "/dashboards", name: 'Dashboard', component: Dashboard, meta: {
            requiresAuth: true,
          } },
      { path: '/hello', name: 'HelloWorld', component: HelloWorld, meta: {
            requiresAuth: true,
          } },
    ],
  },
  {
  path: '/login',
 
  component: BlankLayout,
  meta: { isBlankLayout: true },
  children: [
    { path: '', name: 'LOGIN',  component: SigninView },
  ],
},
{
  path: '/forgot-password',
 
  component: BlankLayout,
  meta: { isBlankLayout: true },
  children: [
    { path: '', name: 'ForgotPassword', component: ForgetPassword },
  ],
}
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore(); // Assuming useUserStore is a Vue Composition API function
  // We have to add check the access token if it is expired
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/login'); // Redirect to login page if not logged in
  } else {
    next(); // Continue navigation
  }
});

export default router
