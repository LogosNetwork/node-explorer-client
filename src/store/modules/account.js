import Logos from '@logosnetwork/logos-rpc-client'
import bigInt from 'big-integer'
import cloneDeep from 'lodash/cloneDeep'
const state = {
  account: null,
  frontier: null,
  openBlock: null,
  representaive: null,
  error: null,
  balance: null,
  rawBalance: null,
  count: 50,
  transactions: [],
  blockCount: 0,
  lastModified: 0
}

const getters = {

}

const actions = {
  getTransactions ({ commit, rootState }, cb) {
    let rpcClient = new Logos({ url: rootState.settings.rpcHost, proxyURL: rootState.settings.proxyURL, debug: true })
    let savedTransactions = [...state.transactions]
    if (savedTransactions && savedTransactions.length > 0) {
      let lastHash = savedTransactions[savedTransactions.length - 1].hash
      if (lastHash !== null) {
        rpcClient.accounts.history(state.account, state.count, false, lastHash).then(val => {
          if (val) {
            if (!val.error) {
              if (val.length > 1) {
                val.splice(0, 1)
                for (let transactionRequests of val) {
                  transactionRequests.timestamp = parseInt(transactionRequests.timestamp)
                  if (transactionRequests.transaction_type === 'send') {
                    for (let trans of transactionRequests.transactions) {
                      trans.amountInLogos = parseFloat(Number(rpcClient.convert.fromReason(trans.amount, 'LOGOS')).toFixed(5))
                    }
                  }
                }
                commit('addTransactions', val)
                if (val.length !== 49) {
                  let status = 'out of content'
                  cb(status)
                } else {
                  let status = 'success'
                  cb(status)
                }
              } else {
                let status = 'out of content'
                cb(status)
              }
            } else {
              commit('setError', val.error)
            }
          } else {
            commit('setError', 'null')
          }
        })
      }
    }
  },
  getAccountInfo: ({ state, commit, rootState }, account) => {
    let rpcClient = new Logos({ url: rootState.settings.rpcHost, proxyURL: rootState.settings.proxyURL, debug: true })
    commit('setAccount', account)
    rpcClient.accounts.info(account).then(val => {
      if (val) {
        if (!val.error) {
          commit('setFrontier', val.frontier)
          commit('setOpenBlock', val.open_block)
          commit('setRawBalance', val.balance)
          commit('setBalance', parseFloat(Number(rpcClient.convert.fromReason(val.balance, 'LOGOS')).toFixed(5)))
          commit('setBlockCount', val.block_count)
          commit('setLastModified', parseInt(val.modified_timestamp))
          rpcClient.accounts.toAddress(val.representative_block).then(val => {
            if (val.account) {
              commit('setRepresentative', val.account)
            }
          })
        } else {
          commit('setError', val.error)
        }
      } else {
        commit('setError', 'null')
      }
    })
    rpcClient.accounts.history(account, state.count).then(val => {
      if (val) {
        if (!val.error) {
          for (let transactionRequests of val) {
            transactionRequests.timestamp = parseInt(transactionRequests.timestamp)
            if (transactionRequests.transaction_type === 'send') {
              for (let trans of transactionRequests.transactions) {
                trans.amountInLogos = parseFloat(Number(rpcClient.convert.fromReason(trans.amount, 'LOGOS')).toFixed(5))
              }
            }
          }
          commit('setTransactions', val)
        } else {
          commit('setError', val.error)
        }
      } else {
        commit('setError', 'null')
      }
    })
  },
  addBlock ({ state, commit, rootState }, block) {
    let blockData = cloneDeep(block)
    let rpcClient = new Logos({ url: rootState.settings.rpcHost, proxyURL: rootState.settings.proxyURL, debug: true })
    if (blockData.account === state.account) {
      blockData.timestamp = parseInt(blockData.timestamp)
      let newRawBalance = bigInt(0)
      if (state.rawBalance) newRawBalance = bigInt(state.rawBalance)
      for (let trans of blockData.transactions) {
        newRawBalance = bigInt(newRawBalance).minus(bigInt(trans.amount))
        trans.amountInLogos = parseFloat(Number(rpcClient.convert.fromReason(trans.amount, 'LOGOS')).toFixed(5))
      }
      commit('setError', null)
      commit('setRawBalance', newRawBalance.toString())
      commit('setBalance', parseFloat(Number(rpcClient.convert.fromReason(state.rawBalance, 'LOGOS')).toFixed(5)))
      commit('incrementBlockCount')
      commit('setFrontier', blockData.hash)
      commit('setLastModified', blockData.timestamp)
      commit('unshiftTransaction', blockData)
    } else if (blockData.account !== state.account) {
      blockData.timestamp = parseInt(blockData.timestamp)
      let newRawBalance = bigInt(0)
      if (state.rawBalance) newRawBalance = bigInt(state.rawBalance)
      for (let trans of blockData.transactions) {
        if (trans.target === state.account) {
          newRawBalance = newRawBalance.add(bigInt(trans.amount))
        }
        trans.amountInLogos = parseFloat(Number(rpcClient.convert.fromReason(trans.amount, 'LOGOS')).toFixed(5))
      }
      commit('setError', null)
      commit('incrementBlockCount')
      commit('setFrontier', blockData.hash)
      commit('setRawBalance', newRawBalance.toString())
      commit('setBalance', parseFloat(Number(rpcClient.convert.fromReason(state.rawBalance, 'LOGOS')).toFixed(5)))
      commit('setLastModified', blockData.timestamp)
      commit('unshiftTransaction', blockData)
    }
  },
  reset: ({ commit }) => {
    commit('reset')
  }
}

const mutations = {
  setFrontier (state, frontier) {
    state.frontier = frontier
  },
  setOpenBlock (state, openBlock) {
    state.openBlock = openBlock
  },
  setRepresentative (state, rep) {
    state.rep = rep
  },
  setBalance (state, balance) {
    state.balance = balance
  },
  setRawBalance (state, balance) {
    state.rawBalance = balance
  },
  setBlockCount (state, blockCount) {
    state.blockCount = blockCount
  },
  incrementBlockCount (state) {
    state.blockCount++
  },
  setCount (state, count) {
    state.count = count
  },
  setLastModified (state, lastModified) {
    state.lastModified = lastModified
  },
  setError (state, error) {
    state.error = error
  },
  setTransactions (state, transactions) {
    state.transactions = transactions
  },
  unshiftTransaction (state, transaction) {
    state.transactions.unshift(transaction)
  },
  addTransactions (state, transactions) {
    state.transactions = state.transactions.concat(transactions)
  },
  setAccount (state, account) {
    state.account = account
  },
  reset (state) {
    state.account = null
    state.frontier = null
    state.openBlock = null
    state.representaive = null
    state.error = null
    state.balance = null
    state.count = 50
    state.transactions = []
    state.blockCount = 0
    state.lastModified = 0
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
