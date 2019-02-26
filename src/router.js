import Vue from 'vue'
import Router from 'vue-router'
import Explore from './views/Explore.vue'
import Governance from './views/Governance.vue'
import Tokens from './views/Tokens.vue'
import Workbench from './views/Workbench.vue'
import Request from './views/Request.vue'
import microEpoch from './views/MicroEpoch.vue'
import requestBlock from './views/RequestBlock.vue'
import epoch from './views/Epoch.vue'
import notFound from './views/404.vue'
import Account from './views/Account.vue'
import Chains from './views/Chains.vue'
import Faucet from './views/Faucet.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'explore',
      component: Explore
    },
    {
      path: '/chains',
      name: 'chains',
      component: Chains
    },
    {
      path: '/Governance',
      name: 'governance',
      component: Governance
    },
    {
      path: '/tokens',
      name: 'tokens',
      component: Tokens
    },
    {
      path: '/workbench',
      name: 'workbench',
      component: Workbench
    },
    {
      path: '/:account(lgs_[13456789abcdefghijkmnopqrstuwxyz]{60})',
      name: 'account',
      component: Account,
      props: true
    },
    {
      path: '/:request([0-9a-fA-F]{64})',
      name: 'request',
      component: Request,
      props: true
    },
    {
      path: '/microEpoch/:hash([0-9a-fA-F]{64})',
      name: 'microEpoch',
      component: microEpoch,
      props: true
    },
    {
      path: '/requestBlock/:hash([0-9a-fA-F]{64})',
      name: 'requestBlock',
      component: requestBlock,
      props: true
    },
    {
      path: '/epoch/:hash([0-9a-fA-F]{64})',
      name: 'epoch',
      component: epoch,
      props: true
    },
    {
      path: '/faucet',
      name: 'faucet',
      component: Faucet,
      props: true
    },
    {
      path: '*',
      name: '404',
      component: notFound
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})

export default router
