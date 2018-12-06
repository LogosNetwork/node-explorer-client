import config from '../../../config'

const state = {
  rpcHost: config.rpcHost,
  proxyURL: config.rpcProxy,
  mqttHost: config.mqttHost
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
  setMqttHost (state, address) {
    state.mqttHost = address
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
