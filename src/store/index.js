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
import tokens from './modules/tokens'
import forge from './modules/forge'
import VuexPersistence from 'vuex-persist'
const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  supportCircular: true,
  reducer: (state) => ({ forge: state.forge })
})
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
    request,
    tokens,
    forge
  },
  strict: process.env.NODE_ENV !== 'production',
  plugins: [vuexLocal.plugin]
})
