import config from '../../../config'

const state = {
  rpcHost: config.rpcHost,
  delegates: config.delegates,
  proxyURL: config.rpcProxy,
  mqttHost: config.mqttHost,
  requestURL: config.requestURL
}

const getters = {

}

const actions = {

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
