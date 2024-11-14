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
    {
      path: '/transform',
      name: 'transform',
      component: () => import('./../views/transform/Transform.vue'),
    },
    {
      path: '/roobot',
      name: 'roobot',
      component: () => import('./../views/roobot/Roobot.vue'),
    },
    {
      path: '/clip',
      name: 'clip',
      component: () => import('./../views/clip/Clip.vue'),
    },
    {
      path: '/waterMap',
      name: 'waterMap',
      component: () => import('./../views/waterMap/WaterMap.vue'),
    },
    {
      path: '/text',
      name: 'text',
      component: () => import('./../views/text/Text.vue'),
    },
  ],
})

export default router
