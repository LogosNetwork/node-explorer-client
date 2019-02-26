import Logos from '@logosnetwork/logos-rpc-client'

const state = {
  hash: null,
  requestBlock: null,
  prettyDetails: null,
  error: null
}

const getters = {

}

const actions = {
  getRequestBlock: ({ commit, rootState }, hash) => {
    let rpcClient = new Logos({ url: rootState.settings.rpcHost, proxyURL: rootState.settings.proxyURL, debug: true })
    commit('setHash', hash)
    let searchHashes = null
    if (hash.indexOf(',') !== -1) {
      searchHashes = hash.split(',')
    } else {
      searchHashes = [hash]
    }
    rpcClient.requestBlocks.get(searchHashes).then(requestBlock => {
      if (requestBlock) {
        if (!requestBlock.error) {
          if (requestBlock.blocks.length > 0) {
            let prettyDetails = null
            prettyDetails = JSON.stringify(requestBlock.blocks[0], null, ' ')
            commit('setPrettyDetails', prettyDetails)
            for (let request of requestBlock.blocks[0].requests) {
              if (request.type === 'send' && request.transactions && request.transactions.length > 0) {
                for (let trans of request.transactions) {
                  trans.fakeLogosAmount = parseFloat(Number(rpcClient.convert.fromReason(trans.amount, 'LOGOS')).toFixed(5))
                }
              }
            }
            commit('setRequestBlock', requestBlock.blocks[0])
          }
        } else {
          commit('setError', requestBlock.error)
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
  setRequestBlock (state, requestBlock) {
    state.requestBlock = requestBlock
  },
  setHash (state, hash) {
    state.hash = hash
  },
  reset (state) {
    state.requestBlock = null
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
