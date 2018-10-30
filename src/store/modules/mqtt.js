import Mqtt from 'mqtt'
import mqttRegex from 'mqtt-regex'

let client = null

const state = {
  connected: false
}

const getters = {

}

const actions = {
  initalize ({ commit, state }, data) {
    if (!state.connected) {
      client = Mqtt.connect(data.url)
      client.on('close', () => {
        console.log('disconnected')
        commit('setConnectionStatus', false)
      })
      const accountMqttRegex = mqttRegex('account/+account').exec
      client.on('message', (topic, message) => {
        message = message.toString()
        console.log(topic)
        console.log(message)
        // TODO Eventually validate the signatures of the blocks to be "trustless"
        if (topic === 'microEpoch') {
          // Type is Micro Epoch
          commit('chains/addMicroEpoch', JSON.parse(message), { root: true })
          commit('explorer/setMicroEpoch', JSON.parse(message), { root: true })
        } else if (topic === 'epoch') {
          // Type is Epoch
          commit('chains/addEpoch', JSON.parse(message), { root: true })
          commit('explorer/setEpoch', JSON.parse(message), { root: true })
        } else if (topic === 'batchStateBlock') {
          // Type is BSB
          commit('chains/addBatchStateBlock', JSON.parse(message), { root: true })
          commit('explorer/setBatchBlock', JSON.parse(message), { root: true })
        } else {
          // Type is Transactional
          let params = accountMqttRegex(topic)
          if (params) {
            commit('account/addBlock', { account: params.account, message: message }, { root: true })
            commit('explorer/addBlock', { message: message }, { root: true })
          }
        }
      })
      client.on('connect', () => {
        console.log('connected')
        commit('setConnectionStatus', true)
        data.cb()
      })
    } else {
      data.cb()
    }
  },
  subscribe ({ state }, topic) {
    if (state.connected) {
      client.subscribe(topic, (err) => {
        if (!err) {
          console.log(`subscribed to ${topic}`)
        } else {
          console.log(err)
        }
      })
    }
  },
  unsubscribe ({ state }, topic) {
    if (state.connected) {
      client.unsubscribe(topic, (err) => {
        if (!err) {
          console.log(`unsubscribed from ${topic}`)
        } else {
          console.log(err)
        }
      })
    }
  }
}

const mutations = {
  setConnectionStatus (state, status) {
    state.connected = status
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
