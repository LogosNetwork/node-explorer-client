import Logos from '@logosnetwork/logos-rpc-client'
import axios from 'axios'
import cloneDeep from 'lodash/cloneDeep'
const rpcClient = new Logos({ url: 'http://34.230.59.175:55000', debug: true })
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
    axios.get('/blocks/transactions')
      .then((res) => {
        for (var i = 0; i < res.data.data.transactions.length; i++) {
          res.data.data.transactions[i].timestamp = parseInt(res.data.data.transactions[i].timestamp)
          res.data.data.transactions[i].amount = parseFloat(Number(rpcClient.convert.fromReason(res.data.data.transactions[i].amount, 'LOGOS')).toFixed(5))
          if (i === res.data.data.transactions.length - 1) {
            commit('setTransactions', res.data.data.transactions)
          }
        }
      })
      .catch((err) => {
        commit('setError', err)
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
  addBlock (state, block) {
    let blockData = cloneDeep(block)
    if (blockData.type === 'send') {
      blockData.amount = parseFloat(Number(rpcClient.convert.fromReason(blockData.amount, 'LOGOS')).toFixed(5))
      blockData.account = blockData.account
      blockData.timestamp = parseInt(blockData.timestamp)
      blockData.link_as_account = blockData.link_as_account
      state.transactions.unshift(blockData)
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
