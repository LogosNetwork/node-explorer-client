import Vue from 'vue'
import Router from 'vue-router'
import Explore from './views/Explore.vue'
import Governance from './views/Governance.vue'
import Workbench from './views/Workbench.vue'
import Transaction from './views/Transaction.vue'
import microEpoch from './views/MicroEpoch.vue'
import batchBlock from './views/BatchBlock.vue'
import epoch from './views/Epoch.vue'
import notFound from './views/404.vue'
import Account from './views/Account.vue'
import Chains from './views/Chains.vue'

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
      path: '/workbench',
      name: 'workbench',
      component: Workbench
    },
    {
      path: '/:account(xrb_[13456789abcdefghijkmnopqrstuwxyz]{60}|lgs_[13456789abcdefghijkmnopqrstuwxyz]{60})',
      name: 'account',
      component: Account,
      props: true
    },
    {
      path: '/:transaction([0-9a-fA-F]{64})',
      name: 'transaction',
      component: Transaction,
      props: true
    },
    {
      path: '/microEpoch/:hash([0-9a-fA-F]{64})',
      name: 'microEpoch',
      component: microEpoch,
      props: true
    },
    {
      path: '/batchBlock/:hash([0-9a-fA-F]{64})',
      name: 'batchBlock',
      component: batchBlock,
      props: true
    },
    {
      path: '/epoch/:id',
      name: 'epoch',
      component: epoch,
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
