import Vue from 'vue'
import Vuex from 'vuex'
import mqtt from './modules/mqtt'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    mqtt
  },
  strict: true
})
