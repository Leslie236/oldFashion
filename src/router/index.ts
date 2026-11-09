import { createRouter, createWebHistory } from 'vue-router'
import PixelTest from '../views/PixelTest.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/PixelTest' },
    { path: '/PixelTest', name: 'PixelTest', component: PixelTest },
  ],
})

export default router
