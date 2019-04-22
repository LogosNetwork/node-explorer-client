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
      component: () => import(/* webpackChunkName: "Explore" */ './views/Explore.vue')
    },
    {
      path: '/chains',
      name: 'chains',
      component: () => import(/* webpackChunkName: "Chains" */ './views/Chains.vue')
    },
    {
      path: '/Governance',
      name: 'governance',
      component: () => import(/* webpackChunkName: "Governance" */ './views/Governance.vue')
    },
    {
      path: '/tokens',
      name: 'tokens',
      component: () => import(/* webpackChunkName: "Tokens" */ './views/Tokens.vue')
    },
    {
      path: '/forge',
      name: 'forge',
      component: () => import(/* webpackChunkName: "Forge" */ './views/Forge.vue')
    },
    {
      path: '/:account(lgs_[13456789abcdefghijkmnopqrstuwxyz]{60})',
      name: 'account',
      component: () => import(/* webpackChunkName: "Account" */ './views/Account.vue'),
      props: true
    },
    {
      path: '/:request([0-9a-fA-F]{64})',
      name: 'request',
      component: () => import(/* webpackChunkName: "Request" */ './views/Request.vue'),
      props: true
    },
    {
      path: '/microEpoch/:hash([0-9a-fA-F]{64})',
      name: 'microEpoch',
      component: () => import(/* webpackChunkName: "MicroEpoch" */ './views/MicroEpoch.vue'),
      props: true
    },
    {
      path: '/requestBlock/:hash([0-9a-fA-F]{64})',
      name: 'requestBlock',
      component: () => import(/* webpackChunkName: "RequestBlock" */ './views/RequestBlock.vue'),
      props: true
    },
    {
      path: '/epoch/:hash([0-9a-fA-F]{64})',
      name: 'epoch',
      component: () => import(/* webpackChunkName: "Epoch" */ './views/Epoch.vue'),
      props: true
    },
    {
      path: '/faucet',
      name: 'faucet',
      component: () => import(/* webpackChunkName: "Faucet" */ './views/Faucet.vue'),
      props: true
    },
    {
      path: '*',
      name: '404',
      component: () => import(/* webpackChunkName: "404" */ './views/404.vue')
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})

export default router
