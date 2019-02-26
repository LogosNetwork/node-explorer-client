import Vue from 'vue'
import Vuex from 'vuex'
import mqtt from './modules/mqtt'
import account from './modules/account'
import explorer from './modules/explorer'
import chains from './modules/chains'
import requestBlock from './modules/requestBlock'
import microEpoch from './modules/microEpoch'
import epoch from './modules/epoch'
import settings from './modules/settings'
import request from './modules/request'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    mqtt,
    explorer,
    account,
    chains,
    requestBlock,
    microEpoch,
    epoch,
    settings,
    request
  },
  strict: process.env.NODE_ENV !== 'production'
})
