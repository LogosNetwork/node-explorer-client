import Logos from '@logosnetwork/logos-rpc-client'
import bigInt from 'big-integer'
import cloneDeep from 'lodash/cloneDeep'
import LogosWallet from '@logosnetwork/logos-webwallet-sdk'
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

const parseRequests = (request, rpcClient) => {
  if (request.type === 'send' && request.transactions && request.transactions.length > 0) {
    let total = bigInt(0)
    for (let trans of request.transactions) {
      total = total.plus(trans.amount)
      trans.amountInLogos = rpcClient.convert.fromReason(trans.amount, 'LOGOS').replace(/\.0+$/, '')
    }
    request.totalAmountLogos = rpcClient.convert.fromReason(total.toString(), 'LOGOS').replace(/\.0+$/, '')
    return request
  } else if (request.type === 'burn' || request.type === 'update_issuer_info' ||
    request.type === 'token_send' || request.type === 'distribute' ||
    request.type === 'adjust_fee' || request.type === 'change_setting' ||
    request.type === 'adjust_user_status' || request.type === 'issuance' ||
    request.type === 'issue_additional' || request.type === 'withdraw_fee' ||
    request.type === 'update_controller' || request.type === 'revoke' ||
    request.type === 'immute_setting') {
    let tokenAddress = LogosWallet.LogosUtils.accountFromHexKey(request.token_id)
    rpcClient.accounts.info(tokenAddress).then(data => {
      data.tokenAccount = tokenAddress
      try {
        data.issuerInfo = JSON.parse(data.issuer_info)
      } catch (e) {
        data.issuerInfo = {}
      }
      request.tokenInfo = data

      // Individual Token Request Handling
      if (request.type === 'burn' || request.type === 'issue_additional') {
        if (typeof data.issuerInfo.decimals !== 'undefined') {
          request.amountInToken = rpcClient.convert.fromTo(request.amount, 0, data.issuerInfo.decimals).replace(/\.0+$/, '')
        }
      }
      if (request.type === 'distribute' || request.type === 'withdraw_fee' || request.type === 'revoke') {
        if (typeof data.issuerInfo.decimals !== 'undefined') {
          request.transaction.amountInToken = rpcClient.convert.fromTo(request.transaction.amount, 0, data.issuerInfo.decimals).replace(/\.0+$/, '')
        }
      }
      if (request.type === 'update_issuer_info') {
        try {
          request.prettyInfo = JSON.stringify(JSON.parse(request.new_info), null, ' ')
        } catch (e) {
          request.prettyInfo = request.new_info
        }
      }
      if (request.type === 'token_send') {
        let total = bigInt(0)
        for (let trans of request.transactions) {
          total = total.plus(trans.amount)
          if (typeof data.issuerInfo.decimals !== 'undefined') {
            trans.amountInToken = rpcClient.convert.fromTo(trans.amount, 0, data.issuerInfo.decimals).replace(/\.0+$/, '')
          }
        }
        request.totalAmount = total
        if (typeof data.issuerInfo.decimals !== 'undefined') {
          request.totalAmountInToken = rpcClient.convert.fromTo(total, 0, data.issuerInfo.decimals)
        }
      }
      if (request.type === 'issuance') {
        if (typeof data.issuerInfo.decimals !== 'undefined') {
          request.totalSupplyInToken = rpcClient.convert.fromTo(request.total_supply, 0, data.issuerInfo.decimals)
        }
        try {
          request.prettyInfo = JSON.stringify(JSON.parse(request.issuer_info), null, ' ')
        } catch (e) {
          request.prettyInfo = request.issuer_info
        }
      }
      return request
    })
  } else {
    return request
  }
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
                  request = parseRequests(request, rpcClient)
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
            request = parseRequests(request, rpcClient)
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
      commit('incrementRequestCount')
      commit('setFrontier', requestData.hash)
      commit('setLastModified', requestData.timestamp)
      commit('unshiftRequest', requestData)
    } else {
      requestData = parseRequests(requestData, rpcClient)
      commit('setError', null)
      commit('incrementRequestCount')
      commit('setFrontier', requestData.hash)
      commit('setLastModified', requestData.timestamp)
      commit('unshiftRequest', requestData)
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
