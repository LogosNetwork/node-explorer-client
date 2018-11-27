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
import Faucet from './views/Faucet.vue'
import Password from './views/Password.vue'
import axios from 'axios'
import config from '../config'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'explore',
      component: Explore,
      meta: { requiresAuth: true }
    },
    {
      path: '/chains',
      name: 'chains',
      component: Chains,
      meta: { requiresAuth: true }
    },
    {
      path: '/Governance',
      name: 'governance',
      component: Governance,
      meta: { requiresAuth: true }
    },
    {
      path: '/workbench',
      name: 'workbench',
      component: Workbench,
      meta: { requiresAuth: true }
    },
    {
      path: '/:account(lgs_[13456789abcdefghijkmnopqrstuwxyz]{60})',
      name: 'account',
      component: Account,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/:transaction([0-9a-fA-F]{64})',
      name: 'transaction',
      component: Transaction,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/microEpoch/:hash([0-9a-fA-F]{64})',
      name: 'microEpoch',
      component: microEpoch,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/batchBlock/:hash([0-9a-fA-F]{64})',
      name: 'batchBlock',
      component: batchBlock,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/epoch/:hash([0-9a-fA-F]{64})',
      name: 'epoch',
      component: epoch,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/password',
      name: 'password',
      component: Password
    },
    {
      path: '/faucet',
      name: 'faucet',
      component: Faucet
    },
    {
      path: '*',
      name: '404',
      component: notFound,
      meta: { requiresAuth: true }
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth) && config.requiresAuth === true) {
    let token = localStorage.getItem('authtoken')
    if (token) {
      axios.post('/verify', {
        token: token
      })
        .then((res) => {
          if (res.data.authenticated) {
            next()
          } else {
            next({
              path: '/password',
              query: {
                redirect: to.fullPath
              }
            })
          }
        })
        .catch((err) => {
          alert(err)
          next({
            path: '/password',
            query: {
              redirect: to.fullPath
            }
          })
        })
    } else {
      next({
        path: '/password',
        query: {
          redirect: to.fullPath
        }
      })
    }
  } else {
    next()
  }
})

export default router
