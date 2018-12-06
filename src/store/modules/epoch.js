import Logos from '@logosnetwork/logos-rpc-client'

const state = {
  hash: null,
  epoch: null,
  error: null
}

const getters = {

}

const actions = {
  getEpoch: ({ commit, rootState }, hash) => {
    let rpcClient = new Logos({ url: rootState.settings.rpcHost, proxyURL: rootState.settings.proxyURL, debug: true })
    commit('setHash', hash)
    let searchHashes = null
    if (hash.indexOf(',') !== -1) {
      searchHashes = hash.split(',')
    } else {
      searchHashes = [hash]
    }
    rpcClient.epochs.get(searchHashes).then(val => {
      if (val) {
        if (!val.error) {
          commit('setEpoch', val.blocks[0])
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
  setEpoch (state, epoch) {
    state.epoch = epoch
  },
  setHash (state, hash) {
    state.hash = hash
  },
  reset (state) {
    state.epoch = null
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
