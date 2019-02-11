import Logos from '@logosnetwork/logos-rpc-client'

const state = {
  hash: null,
  batchBlock: null,
  prettyDetails: null,
  error: null
}

const getters = {

}

const actions = {
  getBatchBlock: ({ commit, rootState }, hash) => {
    let rpcClient = new Logos({ url: rootState.settings.rpcHost, proxyURL: rootState.settings.proxyURL, debug: true })
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
          if (val.blocks.length > 0) {
            let prettyDetails = null
            prettyDetails = JSON.stringify(val.blocks[0], null, ' ')
            commit('setPrettyDetails', prettyDetails)
            for (let transactionRequest of val.blocks[0].blocks) {
              if (transactionRequest.transactions && transactionRequest.transactions.length > 0) {
                for (let trans of transactionRequest.transactions) {
                  trans.fakeLogosAmount = parseFloat(Number(rpcClient.convert.fromReason(trans.amount, 'LOGOS')).toFixed(5))
                }
              }
            }
            commit('setBatchBlock', val.blocks[0])
          }
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
  setPrettyDetails (state, prettyDetails) {
    state.prettyDetails = prettyDetails
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
