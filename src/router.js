import Vue from 'vue'
import Router from 'vue-router'
import Explore from './views/Explore.vue'
import Node from './views/Node.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'explore',
      component: Explore
    },
    {
      path: '/node',
      name: 'node',
      component: Node
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})
