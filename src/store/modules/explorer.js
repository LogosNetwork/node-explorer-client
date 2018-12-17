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
    let rpcClient = new Logos({ url: rootState.settings.rpcHost, proxyURL: rootState.settings.proxyURL, debug: true })
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
    axios.get('/blocks/lastBatchBlock')
      .then((res) => {
        commit('setBatchBlock', res.data.data.batchBlock[0])
      })
      .catch((err) => {
        commit('setError', err)
      })
  },
  getBlockType ({ rootState }, data) {
    let rpcClient = new Logos({ url: rootState.settings.rpcHost, proxyURL: rootState.settings.proxyURL, debug: true })
    rpcClient.transactions.info(data.hash, false).then((val) => {
      if (!val.error) {
        data.cb('transaction')
      } else {
        rpcClient.batchBlocks.get([data.hash]).then((val) => {
          if (!val.error) {
            data.cb('batchBlock')
          } else {
            rpcClient.epochs.get([data.hash]).then((val) => {
              if (!val.error) {
                data.cb('epoch')
              } else {
                rpcClient.microEpochs.get([data.hash]).then((val) => {
                  if (!val.error) {
                    data.cb('microEpoch')
                  } else {
                    data.cb(null)
                  }
                })
              }
            })
          }
        })
      }
    })
  },
  addBlock ({ commit, rootState }, block) {
    let blockData = cloneDeep(block)
    if (blockData.type === 'send') {
      let rpcClient = new Logos({ url: rootState.settings.rpcHost, proxyURL: rootState.settings.proxyURL, debug: true })
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
