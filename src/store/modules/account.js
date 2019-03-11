import Logos from '@logosnetwork/logos-rpc-client'
import bigInt from 'big-integer'
import cloneDeep from 'lodash/cloneDeep'
import LogosWallet from '@logosnetwork/logos-webwallet-sdk'
import orderBy from 'lodash/orderBy'

const state = {
  account: null,
  frontier: null,
  representaive: null,
  error: null,
  balance: null,
  rawBalance: null,
  count: 50,
  requests: [],
  hashes: {},
  orderedRequests: [],
  lastHash: null,
  tokens: {},
  tokenBalances: {},
  requestCount: 0,
  lastModified: 0
}
// Should token information be globally stored in its own vuex?
// Pros: Less API requests
// Cons: Data might be outdated or I have to write a lot of code for MQTT handling for token accounts

const handleTokenRequests = (request, rpcClient) => {
  if (request.type === 'burn' || request.type === 'issue_additional') {
    if (request.tokenInfo.issuerInfo && typeof request.tokenInfo.issuerInfo.decimals !== 'undefined') {
      request.amountInToken = rpcClient.convert.fromTo(request.amount, 0, request.tokenInfo.issuerInfo.decimals).replace(/\.0+$/, '')
    }
  }
  if (request.type === 'distribute' || request.type === 'withdraw_fee' || request.type === 'revoke') {
    if (request.tokenInfo.issuerInfo && typeof request.tokenInfo.issuerInfo.decimals !== 'undefined') {
      request.transaction.amountInToken = rpcClient.convert.fromTo(request.transaction.amount, 0, request.tokenInfo.issuerInfo.decimals).replace(/\.0+$/, '')
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
      if (request.tokenInfo.issuerInfo && typeof request.tokenInfo.issuerInfo.decimals !== 'undefined') {
        trans.amountInToken = rpcClient.convert.fromTo(trans.amount, 0, request.tokenInfo.issuerInfo.decimals).replace(/\.0+$/, '')
      }
    }
    request.totalAmount = total
    if (request.tokenInfo.issuerInfo && typeof request.tokenInfo.issuerInfo.decimals !== 'undefined') {
      request.totalAmountInToken = rpcClient.convert.fromTo(total, 0, request.tokenInfo.issuerInfo.decimals)
    }
  }
  if (request.type === 'issuance') {
    if (request.tokenInfo.issuerInfo && typeof request.tokenInfo.issuerInfo.decimals !== 'undefined') {
      request.totalSupplyInToken = rpcClient.convert.fromTo(request.total_supply, 0, request.tokenInfo.issuerInfo.decimals)
    }
    try {
      request.prettyInfo = JSON.stringify(JSON.parse(request.issuer_info), null, ' ')
    } catch (e) {
      request.prettyInfo = request.issuer_info
    }
  }
  return request
}

const parseRequests = (request, rpcClient, commit, state) => {
  if (request.type === 'send' && request.transactions && request.transactions.length > 0) {
    let total = bigInt(0)
    for (let trans of request.transactions) {
      total = total.plus(trans.amount)
      trans.amountInLogos = rpcClient.convert.fromReason(trans.amount, 'LOGOS').replace(/\.0+$/, '')
    }
    request.totalAmountLogos = rpcClient.convert.fromReason(total.toString(), 'LOGOS').replace(/\.0+$/, '')
    commit('addRequest', request)
  } else if (request.type === 'burn' || request.type === 'update_issuer_info' ||
    request.type === 'token_send' || request.type === 'distribute' ||
    request.type === 'adjust_fee' || request.type === 'change_setting' ||
    request.type === 'adjust_user_status' || request.type === 'issuance' ||
    request.type === 'issue_additional' || request.type === 'withdraw_fee' ||
    request.type === 'update_controller' || request.type === 'revoke' ||
    request.type === 'immute_setting') {
    let tokenAddress = LogosWallet.LogosUtils.accountFromHexKey(request.token_id)
    if (state.tokens[tokenAddress]) {
      request.tokenInfo = state.tokens[tokenAddress]
      commit('addRequest', handleTokenRequests(request, rpcClient))
    } else {
      commit('addToken', tokenAddress)
      request.tokenInfo = {
        pending: true,
        tokenAccount: tokenAddress
      }
      commit('addRequest', handleTokenRequests(request, rpcClient))
      rpcClient.accounts.info(tokenAddress).then(tokenInfo => {
        tokenInfo.tokenAccount = tokenAddress
        try {
          tokenInfo.issuerInfo = JSON.parse(tokenInfo.issuer_info)
        } catch (e) {
          tokenInfo.issuerInfo = {}
        }
        commit('updateToken', {
          rpcClient: rpcClient,
          tokenInfo: tokenInfo
        })
      })
    }
  } else {
    commit('addRequest', request)
  }
}

const actions = {
  getRequests ({ commit, state, rootState }, cb) {
    let rpcClient = new Logos({ url: rootState.settings.rpcHost, proxyURL: rootState.settings.proxyURL, debug: true })
    rpcClient.accounts.history(state.account, state.count, false, state.lastHash).then(requests => {
      if (requests) {
        if (!requests.error) {
          if (requests.length > 1) {
            requests.splice(0, 1)
            for (let request of requests) {
              request = parseRequests(request, rpcClient, commit, state)
            }
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
  },
  getAccountInfo: ({ state, commit, rootState }, account) => {
    let rpcClient = new Logos({ url: rootState.settings.rpcHost, proxyURL: rootState.settings.proxyURL, debug: true })
    commit('setAccount', account)
    rpcClient.accounts.info(account).then(val => {
      if (val) {
        if (!val.error) {
          if (val.tokens) commit('setTokenBalances', { rpcClient: rpcClient, tokens: val.tokens })
          // TODO Dispatch action to request token infos
          commit('setFrontier', val.frontier)
          commit('setRawBalance', val.balance)
          commit('setBalance', parseFloat(Number(rpcClient.convert.fromReason(val.balance, 'LOGOS')).toFixed(5)))
          commit('setRequestCount', val.request_count)
          commit('setLastModified', parseInt(val.modified_timestamp))
          if (val.representative_block !== '0000000000000000000000000000000000000000000000000000000000000000') {
            commit('setRepresentative', LogosWallet.LogosUtils.accountFromHexKey(val.representative_block))
          }
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
            request = parseRequests(request, rpcClient, commit, state)
          }
        } else {
          commit('setError', requests.error)
        }
      } else {
        commit('setError', 'null')
      }
    })
  },
  addRequest ({ state, commit, rootState }, request) {
    // TODO update handling of MQTT messages
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
      commit('addRequest', requestData)
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
      commit('addRequest', requestData)
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
    state.representaive = rep
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
  addRequest (state, request) {
    if (!state.hashes[request.hash]) {
      state.hashes[request.hash] = request
      state.requests.push(request)
      state.orderedRequests = orderBy(state.requests, 'timestamp', 'desc')
      if (request.origin === state.account) state.lastHash = state.orderedRequests[state.orderedRequests.length - 1].hash
    }
  },
  addToken (state, tokenAccount) {
    state.tokens[tokenAccount] = {
      pending: true,
      tokenAccount: tokenAccount
    }
  },
  updateToken (state, data) {
    state.tokens[data.tokenInfo.tokenAccount] = data.tokenInfo
    for (let request of state.requests) {
      if (request.tokenInfo && request.tokenInfo.pending &&
        request.tokenInfo.tokenAccount === data.tokenInfo.tokenAccount) {
        request.tokenInfo = state.tokens[data.tokenInfo.tokenAccount]
        request = handleTokenRequests(request, data.rpcClient)
      }
    }
    for (let tokenBalance of Object.values(state.tokenBalances)) {
      if (tokenBalance.tokenInfo && tokenBalance.tokenInfo.pending &&
        tokenBalance.tokenInfo.tokenAccount === data.tokenInfo.tokenAccount) {
        tokenBalance.tokenInfo = state.tokens[data.tokenInfo.tokenAccount]
        if (tokenBalance.tokenInfo.issuerInfo && typeof tokenBalance.tokenInfo.issuerInfo.decimals !== 'undefined') {
          tokenBalance.balanceInTokens = data.rpcClient.convert.fromTo(tokenBalance.balance, 0, tokenBalance.tokenInfo.issuerInfo.decimals)
        }
        state.tokenBalances[data.tokenInfo.tokenAccount] = tokenBalance
      }
    }
    // TODO UPDATE TOKENS THAT ARE NOT IN THE RECENT REQUESTS
  },
  setTokenBalances (state, data) {
    let balances = {}
    Object.entries(data.tokens).forEach(entry => {
      let tokenID = entry[0]
      let tokenAccountInfo = entry[1]
      let tokenAccount = LogosWallet.LogosUtils.accountFromHexKey(tokenID)
      if (state.tokens[tokenAccount]) {
        tokenAccountInfo.tokenInfo = state.tokens[tokenAccount]
        balances[tokenAccount] = tokenAccountInfo
      } else {
        tokenAccountInfo.tokenInfo = {
          pending: true,
          tokenAccount: tokenAccount
        }
        balances[tokenAccount] = tokenAccountInfo
      }
    })
    state.tokenBalances = balances
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
    state.hash = {}
    state.orderedRequests = []
    state.tokenBalances = {}
    state.requestCount = 0
    state.lastModified = 0
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
