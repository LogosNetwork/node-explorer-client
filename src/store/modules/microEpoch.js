import Logos from '@logosnetwork/logos-rpc-client'

const state = {
  hash: null,
  microEpoch: null,
  error: null
}

const getters = {

}

const actions = {
  getMicroEpoch: ({ commit, rootState }, hash) => {
    commit('setHash', hash)
    let searchHashes = null
    if (hash.indexOf(',') !== -1) {
      searchHashes = hash.split(',')
    } else {
      searchHashes = [hash]
    }
    let rpcClient = new Logos({ url: `http://${rootState.settings.rpcHost}:${rootState.settings.rpcPort}`, proxyURL: rootState.settings.proxyURL, debug: true })
    rpcClient.microEpochs.get(searchHashes).then(val => {
      if (val) {
        if (!val.error) {
          commit('setMicroEpoch', val.blocks[0])
        } else {
          commit('setError', val.error)
        }
      } else {
        commit('setError', 'null')
      }
    })
  },
  reset: ({ commit }) => {
    commit('reset')
  }
}

const mutations = {
  setMicroEpoch (state, microEpoch) {
    state.microEpoch = microEpoch
  },
  setHash (state, hash) {
    state.hash = hash
  },
  reset (state) {
    state.microEpoch = null
  },
  setError (state, error) {
    state.error = error
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
