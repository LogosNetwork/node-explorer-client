import Logos from '@logosnetwork/logos-rpc-client'
const rpcClient = new Logos({ url: 'http://18.212.15.104:55000', debug: true })
const state = {
  transactions: [],
  error: null,
  epoch: null,
  microEpoch: null,
  batchBlock: null
}

const getters = {

}

const actions = {
  getRecentTransactions: ({ commit }) => {
    rpcClient.batchBlocks.history(1, 0).then(val => {
      if (val) {
        if (!val.error) {
          commit('setBatchBlock', val.batch_blocks)
        } else {
          commit('setError', val.error)
        }
      } else {
        commit('setError', 'null')
      }
    })
    rpcClient.microEpochs.history(1, 0).then(val => {
      if (val) {
        if (!val.error) {
          commit('setMicroEpoch', val.micro_blocks)
        } else {
          commit('setError', val.error)
        }
      } else {
        commit('setError', 'null')
      }
    })
    rpcClient.epochs.history(1, 0).then(val => {
      if (val) {
        if (!val.error) {
          commit('setEpoch', val.epochs)
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
  setError (state, error) {
    state.error = error
  },
  setTransactions (state, transactions) {
    state.transactions = transactions
  },
  setBatchBlock (state, batchBlocks) {
    state.batchBlock = batchBlocks[0]
  },
  setMicroEpoch (state, microEpochs) {
    state.microEpoch = microEpochs[0]
  },
  setEpoch (state, epochs) {
    state.epoch = epochs[0]
  },
  addBlock (state, blockData) {
    blockData.message = JSON.parse(blockData.message)
    if (blockData.message.type === 'send') {
      blockData.message.amount = parseFloat(Number(rpcClient.convert.fromReason(blockData.message.amount, 'LOGOS')).toFixed(5))
      blockData.message.account = blockData.message.account.replace('xrb_', 'lgs_')
      state.transactions.unshift(blockData.message)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
