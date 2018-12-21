import Mqtt from 'mqtt'
import mqttRegex from 'mqtt-regex'

let client = null

const state = {
  connected: false
}

const getters = {

}

const actions = {
  initalize ({ commit, state, dispatch }, data) {
    if (!state.connected) {
      client = Mqtt.connect(data.url)
      client.on('close', () => {
        console.log('disconnected')
        commit('setConnectionStatus', false)
      })
      const accountMqttRegex = mqttRegex('account/+account').exec
      const transactionMqttRegex = mqttRegex('transaction/+hash').exec
      client.on('message', (topic, message) => {
        message = JSON.parse(message.toString())
        // TODO Eventually validate the signatures of the blocks to be "trustless"
        if (topic === 'microEpoch') {
          commit('chains/addMicroEpoch', message, { root: true })
          commit('explorer/setMicroEpoch', message, { root: true })
        } else if (topic === 'epoch') {
          commit('chains/addEpoch', message, { root: true })
          commit('explorer/setEpoch', message, { root: true })
        } else if (topic === 'batchBlock') {
          commit('chains/addBatchBlock', message, { root: true })
          commit('explorer/setBatchBlock', message, { root: true })
        } else {
          if (accountMqttRegex(topic)) {
            dispatch('account/addBlock', message, { root: true })
            dispatch('explorer/addBlock', message, { root: true })
          } else if (transactionMqttRegex(topic)) {
            dispatch('transction/addBlock', message, { root: true })
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
