import Mqtt from 'mqtt'
import mqttRegex from 'mqtt-regex'
import Logos from '@logosnetwork/logos-rpc-client'

let client = null

const state = {
  connected: false
}

const getters = {

}

const actions = {
  initalize ({ commit, state, dispatch, rootState }, data) {
    if (!state.connected) {
      client = Mqtt.connect(data.url)
      client.on('close', () => {
        console.log('disconnected')
        commit('setConnectionStatus', false)
      })
      const accountMqttRegex = mqttRegex('account/+account').exec
      const requestMqttRegex = mqttRegex('request/+hash').exec
      const requestBlockMqttRegex = mqttRegex('requestBlock/+delegateid').exec
      client.on('message', (topic, message) => {
        message = JSON.parse(message.toString())
        // TODO Eventually validate the signatures of the blocks to be "trustless"
        if (topic === 'delegateChange') {
          commit('settings/setDelegates', message, { root: true })
          commit('settings/setRpcHost', message['0'], { root: true })
          this._vm.$Logos = new Logos({ url: message['0'], proxyURL: rootState.settings.proxyURL, debug: false })
        } else if (topic === 'microEpoch') {
          commit('chains/addMicroEpoch', message, { root: true })
          commit('explorer/setMicroEpoch', message, { root: true })
        } else if (topic === 'epoch') {
          commit('chains/addEpoch', message, { root: true })
          commit('explorer/setEpoch', message, { root: true })
        } else if (requestBlockMqttRegex(topic)) {
          commit('chains/addRequestBlock', message, { root: true })
          commit('explorer/setRequestBlock', message, { root: true })
          if (message.requests && message.requests.length > 0) {
            for (let request of message.requests) {
              dispatch('explorer/addRequest', request, { root: true })
            }
          }
        } else {
          let mqttDestination = accountMqttRegex(topic)
          if (mqttDestination) {
            message.mqttDestination = mqttDestination.account
            dispatch('account/addRequest', message, { root: true })
            dispatch('forge/addRequest', message, { root: true })
          } else if (requestMqttRegex(topic)) {
            dispatch('request/addRequest', message, { root: true })
          }
        }
      })
      client.on('connect', () => {
        console.log('connected')
        commit('setConnectionStatus', true)
        if (data.cb) {
          data.cb()
        }
      })
    } else {
      if (data.cb) {
        data.cb()
      }
    }
  },
  subscribe ({ state }, topic) {
    if (state.connected) {
      client.subscribe(topic, (err) => {
        if (err) {
          console.log(err)
        }
      })
    }
  },
  unsubscribe ({ state }, topic) {
    if (state.connected) {
      client.unsubscribe(topic, (err) => {
        if (err) {
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
