import config from '../../../config'

const state = {
  rpcHost: config.rpcHost,
  rpcPort: config.rpcPort,
  proxyURL: config.rpcProxy,
  mqttHost: config.mqttHost,
  requestURL: config.requestURL
}

const getters = {
  rpcHost: state => state.rpcHost,
  rpcPort: state => state.rpcPort,
  proxyURL: state => state.proxyURL,
  mqttHost: state => state.mqttHost,
  requestURL: state => state.requestURL
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
  setRpcPort (state, port) {
    state.rpcPort = port
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
