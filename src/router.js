import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'explore',
      component: () => import('./views/Explore.vue')
    },
    {
      path: '/chains',
      name: 'chains',
      component: () => import('./views/Chains.vue')
    },
    {
      path: '/Governance',
      name: 'governance',
      component: () => import('./views/Governance.vue')
    },
    {
      path: '/tokens',
      name: 'tokens',
      component: () => import('./views/Tokens.vue')
    },
    {
      path: '/workbench',
      name: 'workbench',
      component: () => import('./views/Workbench.vue')
    },
    {
      path: '/forge',
      name: 'forge',
      component: () => import('./views/Forge.vue')
    },
    {
      path: '/:account(lgs_[13456789abcdefghijkmnopqrstuwxyz]{60})',
      name: 'account',
      component: () => import('./views/Account.vue'),
      props: true
    },
    {
      path: '/:request([0-9a-fA-F]{64})',
      name: 'request',
      component: () => import('./views/Request.vue'),
      props: true
    },
    {
      path: '/microEpoch/:hash([0-9a-fA-F]{64})',
      name: 'microEpoch',
      component: () => import('./views/MicroEpoch.vue'),
      props: true
    },
    {
      path: '/requestBlock/:hash([0-9a-fA-F]{64})',
      name: 'requestBlock',
      component: () => import('./views/RequestBlock.vue'),
      props: true
    },
    {
      path: '/epoch/:hash([0-9a-fA-F]{64})',
      name: 'epoch',
      component: () => import('./views/Epoch.vue'),
      props: true
    },
    {
      path: '/faucet',
      name: 'faucet',
      component: () => import('./views/Faucet.vue'),
      props: true
    },
    {
      path: '*',
      name: '404',
      component: () => import('./views/404.vue')
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})

export default router
