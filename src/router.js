import Vue from 'vue'
import Router from 'vue-router'
import Explore from './views/Explore.vue'
import Reps from './views/Representatives.vue'
import Workbench from './views/Workbench.vue'
import Account from './views/Account.vue'
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
    },
    {
      path: '/representatives',
      name: 'reps',
      component: Reps
    },
    {
      path: '/workbench',
      name: 'workbench',
      component: Workbench
    },
    {
      path: '/:account(xrb_[13456789abcdefghijkmnopqrstuwxyz]{60}|lgs_[13456789abcdefghijkmnopqrstuwxyz]{60})',
      name: 'account',
      component: Account,
      props: true
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})
