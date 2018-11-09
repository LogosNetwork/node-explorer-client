import Logos from '@logosnetwork/logos-rpc-client'
import axios from 'axios'
import cloneDeep from 'lodash/cloneDeep'
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
  getRecentTransactions: ({ commit, rootState }) => {
    let rpcClient = new Logos({ url: rootState.settings.rpcHost, debug: true })
    rpcClient.batchBlocks.history(1, 0).then(val => {
      if (val) {
        if (!val.error) {
          commit('setBatchBlock', val.batch_blocks[0])
          // let batchBlock = cloneDeep(val.batch_blocks[0])
          // let cachedTransactions = []
          // for (let i = 0; i < batchBlock.length; i++) {
          //   for (let n = 0; n < batchBlock[i].blocks.length; n++) {
          //     batchBlock[i].blocks[n].type = 'send'
          //     batchBlock[i].blocks[n].amount = parseFloat(Number(rpcClient.convert.fromReason(batchBlock[i].blocks[n].amount, 'LOGOS')).toFixed(5))
          //     batchBlock[i].blocks[n].timestamp = parseInt(batchBlock[i].blocks[n].timestamp)
          //     cachedTransactions.unshift(batchBlock[i].blocks[n])
          //     if (i === batchBlock.length - 1 &&
          //         n === batchBlock[i].blocks.length - 1) {
          //       commit('setTransactions', cachedTransactions)
          //     }
          //   }
          // }
        } else {
          commit('setError', val.error)
        }
      } else {
        commit('setError', 'null')
      }
    })
    rpcClient.microEpochs.history(1).then(val => {
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
    rpcClient.epochs.history(1).then(val => {
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
  addBlock ({ commit, rootState }, block) {
    let blockData = cloneDeep(block)
    if (blockData.type === 'send') {
      let rpcClient = new Logos({ url: rootState.settings.rpcHost, debug: true })
      blockData.amount = parseFloat(Number(rpcClient.convert.fromReason(blockData.amount, 'LOGOS')).toFixed(5))
      blockData.timestamp = parseInt(blockData.timestamp)
      commit('unshiftTransaction', blockData)
    }
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
  unshiftTransaction (state, transaction) {
    state.transactions.unshift(transaction)
  },
  setBatchBlock (state, batchBlock) {
    state.batchBlock = batchBlock
  },
  setMicroEpoch (state, microEpoch) {
    state.microEpoch = microEpoch
  },
  setEpoch (state, epoch) {
    state.epoch = epoch
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
