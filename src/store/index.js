import Vue from 'vue'
import Vuex from 'vuex'
import mqtt from './modules/mqtt'
import account from './modules/account'
import explorer from './modules/explorer'
import chains from './modules/chains'
import batchBlock from './modules/batchBlock'
import microEpoch from './modules/microEpoch'
import epoch from './modules/epoch'
import settings from './modules/settings'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    mqtt,
    explorer,
    account,
    chains,
    batchBlock,
    microEpoch,
    epoch,
    settings
  },
  strict: true
})
