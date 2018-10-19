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
      const broadcastMqttRegex = mqttRegex('account/+account').exec
      client.on('message', (topic, message) => {
        let params = broadcastMqttRegex(topic)
        message = message.toString()
        if (params) {
          // TODO anyway to optimize this delivery?
          commit('account/addBlock', { account: params.account, message: message }, { root: true })
          commit('explorer/addBlock', { message: message }, { root: true })
        }
      })
      client.on('connect', () => {
        console.log('connected')
        commit('setConnectionStatus', true)
        if (data.topic) { dispatch('subscribe', data.topic) }
      })
    } else if (data.topic) {
      dispatch('subscribe', data.topic)
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
