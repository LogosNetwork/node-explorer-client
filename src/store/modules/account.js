import Logos from '@logosnetwork/logos-rpc-client'
import bigInt from 'big-integer'
import cloneDeep from 'lodash/cloneDeep'
const state = {
  account: null,
  frontier: null,
  representaive: null,
  error: null,
  balance: null,
  rawBalance: null,
  count: 50,
  requests: [],
  requestCount: 0,
  lastModified: 0
}

const getters = {

}

const actions = {
  getRequests ({ commit, rootState }, cb) {
    let rpcClient = new Logos({ url: rootState.settings.rpcHost, proxyURL: rootState.settings.proxyURL, debug: true })
    let savedRequests = [...state.requests]
    if (savedRequests && savedRequests.length > 0) {
      let lastHash = savedRequests[savedRequests.length - 1].hash
      if (lastHash !== null) {
        rpcClient.accounts.history(state.account, state.count, false, lastHash).then(requests => {
          if (requests) {
            if (!requests.error) {
              if (requests.length > 1) {
                requests.splice(0, 1)
                for (let request of requests) {
                  request.timestamp = parseInt(request.timestamp)
                  if (request.type === 'send') {
                    for (let trans of request.transactions) {
                      trans.amountInLogos = parseFloat(Number(rpcClient.convert.fromReason(trans.amount, 'LOGOS')).toFixed(5))
                    }
                  }
                }
                commit('addRequests', requests)
                if (requests.length !== 49) {
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
              commit('setError', requests.error)
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
          commit('setRawBalance', val.balance)
          commit('setBalance', parseFloat(Number(rpcClient.convert.fromReason(val.balance, 'LOGOS')).toFixed(5)))
          commit('setRequestCount', val.block_count)
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
    rpcClient.accounts.history(account, state.count).then(requests => {
      if (requests) {
        if (!requests.error) {
          for (let request of requests) {
            request.timestamp = parseInt(request.timestamp)
            if (request.type === 'send') {
              for (let trans of request.transactions) {
                trans.amountInLogos = parseFloat(Number(rpcClient.convert.fromReason(trans.amount, 'LOGOS')).toFixed(5))
              }
            }
          }
          commit('setRequests', requests)
        } else {
          commit('setError', requests.error)
        }
      } else {
        commit('setError', 'null')
      }
    })
  },
  addRequest ({ state, commit, rootState }, request) {
    let requestData = cloneDeep(request)
    let rpcClient = new Logos({ url: rootState.settings.rpcHost, proxyURL: rootState.settings.proxyURL, debug: true })
    if (requestData.origin === state.account) {
      requestData.timestamp = parseInt(requestData.timestamp)
      if (requestData.type === 'send') {
        let newRawBalance = bigInt(0)
        if (state.rawBalance) newRawBalance = bigInt(state.rawBalance)
        for (let trans of requestData.transactions) {
          newRawBalance = bigInt(newRawBalance).minus(bigInt(trans.amount))
          trans.amountInLogos = parseFloat(Number(rpcClient.convert.fromReason(trans.amount, 'LOGOS')).toFixed(5))
        }
        commit('setRawBalance', newRawBalance.toString())
        commit('setBalance', parseFloat(Number(rpcClient.convert.fromReason(state.rawBalance, 'LOGOS')).toFixed(5)))
      }
      commit('setError', null)
      commit('incrementRequestCount')
      commit('setFrontier', requestData.hash)
      commit('setLastModified', requestData.timestamp)
      commit('unshiftRequest', requestData)
    } else if (requestData.account !== state.account) {
      requestData.timestamp = parseInt(requestData.timestamp)
      if (requestData.type === 'send') {
        let newRawBalance = bigInt(0)
        if (state.rawBalance) newRawBalance = bigInt(state.rawBalance)
        for (let trans of requestData.transactions) {
          if (trans.target === state.account) {
            newRawBalance = newRawBalance.add(bigInt(trans.amount))
          }
          trans.amountInLogos = parseFloat(Number(rpcClient.convert.fromReason(trans.amount, 'LOGOS')).toFixed(5))
        }
        commit('setRawBalance', newRawBalance.toString())
        commit('setBalance', parseFloat(Number(rpcClient.convert.fromReason(state.rawBalance, 'LOGOS')).toFixed(5)))
      }
      commit('setError', null)
      commit('incrementBlockCount')
      commit('setFrontier', requestData.hash)
      commit('setLastModified', requestData.timestamp)
      commit('unshiftTransaction', requestData)
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
  setRepresentative (state, rep) {
    state.rep = rep
  },
  setBalance (state, balance) {
    state.balance = balance
  },
  setRawBalance (state, balance) {
    state.rawBalance = balance
  },
  setRequestCount (state, requestCount) {
    state.requestCount = requestCount
  },
  incrementRequestCount (state) {
    state.requestCount++
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
  setRequests (state, requests) {
    state.requests = requests
  },
  unshiftRequest (state, request) {
    state.requests.unshift(request)
  },
  addRequests (state, requests) {
    state.requests = state.requests.concat(requests)
  },
  setAccount (state, account) {
    state.account = account
  },
  reset (state) {
    state.account = null
    state.frontier = null
    state.representaive = null
    state.error = null
    state.balance = null
    state.count = 50
    state.requests = []
    state.requestCount = 0
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
