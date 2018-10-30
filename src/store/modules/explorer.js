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
          commit('setBatchBlock', val.batch_blocks[0])
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
          commit('setMicroEpoch', val.micro_blocks[0])
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
          commit('setEpoch', val.epochs[0])
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
  setBatchBlock (state, batchBlock) {
    state.batchBlock = batchBlock
  },
  setMicroEpoch (state, microEpoch) {
    state.microEpoch = microEpoch
  },
  setEpoch (state, epoch) {
    state.epoch = epoch
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
