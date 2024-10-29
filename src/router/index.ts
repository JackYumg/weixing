import { createRouter, createWebHistory } from 'vue-router'
import Weixing from '../views/weixing/Weixing.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/home' },
    {
      path: '/home',
      name: 'home',
      component: Weixing,
    },
    {
      path: '/water',
      name: 'water',
      component: () => import('../views/water/Water.vue'), //
    },
    {
      path: '/seed',
      name: 'seed',
      component: () => import('./../views/seed/Seed.vue'),
    },
  ],
})

export default router
