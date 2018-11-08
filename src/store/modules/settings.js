const state = {
  rpcHost: 'http://34.230.59.175:55000',
  mqttHost: 'ws:18.235.68.120:8883/mqtt'
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
