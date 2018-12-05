import Logos from '@logosnetwork/logos-rpc-client'

const state = {
  hash: null,
  batchBlock: null,
  error: null
}

const getters = {

}

const actions = {
  getBatchBlock: ({ commit, rootState }, hash) => {
    let rpcClient = new Logos({ url: rootState.settings.rpcHost, debug: true })
    commit('setHash', hash)
    let searchHashes = null
    if (hash.indexOf(',') !== -1) {
      searchHashes = hash.split(',')
    } else {
      searchHashes = [hash]
    }
    rpcClient.batchBlocks.get(searchHashes).then(val => {
      if (val) {
        if (!val.error) {
          for (let trans of val.blocks[0].blocks) {
            trans.fakeLogosAmount = parseFloat(Number(rpcClient.convert.fromReason(trans.amount, 'LOGOS')).toFixed(5))
            trans.fakeTimestamp = parseInt(trans.timestamp)
          }
          commit('setBatchBlock', val.blocks[0])
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
  setBatchBlock (state, batchBlock) {
    state.batchBlock = batchBlock
  },
  setHash (state, hash) {
    state.hash = hash
  },
  reset (state) {
    state.batchBlock = null
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
