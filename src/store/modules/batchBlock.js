import Logos from '@logosnetwork/logos-rpc-client'
const rpcClient = new Logos({ url: 'http://18.212.15.104:55000', debug: true })
const state = {
  hash: null,
  batchBlock: null
}

const getters = {

}

const actions = {
  getBatchBlock: ({ state, commit }, hash) => {
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
            trans.amount = parseFloat(Number(rpcClient.convert.fromReason(trans.amount, 'LOGOS')).toFixed(5))
            trans.timestamp = parseInt(trans.timestamp)
            trans.account = trans.account.replace('xrb_', 'lgs_')
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
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
