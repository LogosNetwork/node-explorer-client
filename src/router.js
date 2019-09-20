import Vue from 'vue'
import Router from 'vue-router'
const Home = () => import(/* webpackChunkName: "Home" */ './views/Home.vue')
const Contributors = () => import(/* webpackChunkName: "Home" */ './views/Contributors.vue')
const Explore = () => import(/* webpackChunkName: "Explore" */ './views/Explore.vue')
const Chains = () => import(/* webpackChunkName: "Chains" */ './views/Chains.vue')
const Governance = () => import(/* webpackChunkName: "Governance" */ './views/Governance.vue')
const Tokens = () => import(/* webpackChunkName: "Tokens" */ './views/Tokens.vue')
const Forge = () => import(/* webpackChunkName: "Forge" */ './views/Forge.vue')
const Account = () => import(/* webpackChunkName: "Account" */ './views/Account.vue')
const Request = () => import(/* webpackChunkName: "Request" */ './views/Request.vue')
const MicroEpoch = () => import(/* webpackChunkName: "MicroEpoch" */ './views/MicroEpoch.vue')
const RequestBlock = () => import(/* webpackChunkName: "RequestBlock" */ './views/RequestBlock.vue')
const Epoch = () => import(/* webpackChunkName: "Epoch" */ './views/Epoch.vue')
const Faucet = () => import(/* webpackChunkName: "Faucet" */ './views/Faucet.vue')
const NotFound = () => import(/* webpackChunkName: "404" */ './views/404.vue')
Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/contributors',
      name: 'contributors',
      component: Contributors
    },
    {
      path: '/explore',
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
      path: '/forge',
      name: 'forge',
      component: Forge
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
      component: MicroEpoch,
      props: true
    },
    {
      path: '/requestBlock/:hash([0-9a-fA-F]{64})',
      name: 'requestBlock',
      component: RequestBlock,
      props: true
    },
    {
      path: '/epoch/:hash([0-9a-fA-F]{64})',
      name: 'epoch',
      component: Epoch,
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
      component: NotFound
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})

export default router
