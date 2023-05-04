import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

import 'vuetify/dist/vuetify.min.css' 


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/calculadora',
    name: 'calculadora',
    component: () => import(/* webpackChunkName: "calculadora" */ '../views/CalculadoraView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
