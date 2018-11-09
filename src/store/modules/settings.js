import config from '../../../config'

const state = {
  rpcHost: config.rpcHost,
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
