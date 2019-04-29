import config from '../../../config'
import axios from 'axios'

const state = {
  rpcHost: config.rpcHost,
  delegates: null,
  proxyURL: config.rpcProxy,
  mqttHost: config.mqttHost,
  requestURL: config.requestURL
}

const getters = {
  rpcHost: state => state.rpcHost,
  delegates: state => state.delegates,
  proxyURL: state => state.proxyURL,
  mqttHost: state => state.mqttHost,
  requestURL: state => state.requestURL
}

const actions = {
  loadDelegates ({ commit, state }) {
    if (!state.delegates) {
      axios.get(`${state.requestURL}/delegates`).then(res => {
        commit('setDelegates', res.data)
        commit('setRpcHost', `http://${res.data['0']}:55000`)
      })
    }
  }
}

const mutations = {
  setRpcHost (state, address) {
    state.rpcHost = address
  },
  setProxyURL (state, address) {
    state.proxyURL = address
  },
  setDelegates (state, delegates) {
    state.delegates = delegates
  },
  setMqttHost (state, address) {
    state.mqttHost = address
  },
  setRequestURL (state, url) {
    state.requestURL = url
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
