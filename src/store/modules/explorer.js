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
  getTransactions ({ commit, rootState }, cb) {
    let rpcClient = new Logos({ url: rootState.settings.rpcHost, proxyURL: rootState.settings.proxyURL, debug: true })
    let savedTransactions = [...state.transactions]
    let lastCreatedAt = null
    if (savedTransactions && savedTransactions.length > 0) {
      lastCreatedAt = savedTransactions[savedTransactions.length - 1].createdAt
    }
    axios.get(`${rootState.settings.requestURL}/blocks/transactions`, {
      params: {
        previousDate: lastCreatedAt
      }
    })
      .then((res) => {
        for (let transaction of res.data.data.transactions) {
          for (let trans of transaction.transactions) {
            trans.amountInLogos = parseFloat(Number(rpcClient.convert.fromReason(trans.amount, 'LOGOS')).toFixed(5))
          }
          commit('pushTransaction', transaction)
        }
        if (res.data.data.transactions.length > 0) {
          let status = 'success'
          cb(status)
        } else {
          let status = 'out of content'
          cb(status)
        }
      })
      .catch((err) => {
        commit('setError', err)
      })
  },
  getLatestBatchBlock ({ commit, rootState }) {
    axios.get(`${rootState.settings.requestURL}/blocks/lastBatchBlock`)
      .then((res) => {
        commit('setBatchBlock', res.data.data.batchBlock[0])
      })
      .catch((err) => {
        commit('setError', err)
      })
  },
  getLatestMicroEpoch: ({ commit, rootState }) => {
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
  },
  getLatestEpoch ({ commit, rootState }) {
    let rpcClient = new Logos({ url: rootState.settings.rpcHost, proxyURL: rootState.settings.proxyURL, debug: true })
    rpcClient.epochs.history(1).then(val => {
      if (val) {
        if (!val.error) {
          val.epochs[0].feeInLogos = parseFloat(Number(rpcClient.convert.fromReason(val.epochs[0].transaction_fee_pool, 'LOGOS')).toFixed(5))
          commit('setEpoch', val.epochs[0])
        } else {
          commit('setError', val.error)
        }
      } else {
        commit('setError', 'null')
      }
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
    if (blockData.transaction_type === 'send') {
      let rpcClient = new Logos({ url: rootState.settings.rpcHost, proxyURL: rootState.settings.proxyURL, debug: true })
      for (let trans of blockData.transactions) {
        trans.amountInLogos = parseFloat(Number(rpcClient.convert.fromReason(trans.amount, 'LOGOS')).toFixed(5))
      }
      blockData.createdAt = parseInt(blockData.timestamp)
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
  pushTransaction (state, transaction) {
    state.transactions.push(transaction)
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
