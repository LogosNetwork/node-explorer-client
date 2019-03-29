import Logos from '@logosnetwork/logos-rpc-client'
import bigInt from 'big-integer'
import cloneDeep from 'lodash/cloneDeep'
import LogosWallet from '@logosnetwork/logos-webwallet-sdk'
import Vue from 'vue'

const state = {
  account: null,
  representaive: null,
  error: null,
  balance: '0',
  rawBalance: '0',
  count: 50,
  requests: [],
  type: null,
  hashes: {},
  lastHash: null,
  tokens: {},
  tokenBalances: {},
  requestCount: 0,
  lastModified: 0
}
// Should token information be globally stored in its own vuex?
// Pros: Less API requests | Caching which means faster page switching on slower internet connectiosn
// Cons: Data might be outdated or I have to write a lot of code for MQTT handling for token accounts
// Conclustion: Yes but thats a lot of work and code

const updateTokenBalance = (raw, tokenAccount, rpcClient, commit, state) => {
  if (state.tokenBalances[tokenAccount]) {
    commit('setRawTokenBalance', { tokenAccount: tokenAccount, rawTokenBalance: raw })
    if (state.tokenBalances[tokenAccount].tokenInfo.pending !== true &&
      typeof state.tokenBalances[tokenAccount].tokenInfo.issuerInfo.decimals !== 'undefined') {
      let tokenBalance = Logos.convert.fromTo(raw, 0, state.tokenBalances[tokenAccount].tokenInfo.issuerInfo.decimals)
      commit('setTokenBalance', {
        tokenAccount: tokenAccount,
        tokenBalance: tokenBalance
      })
    }
  } else {
    if (state.tokens[tokenAccount]) {
      let info = {
        balance: raw,
        tokenInfo: state.tokens[tokenAccount]
      }
      commit('addTokenBalance', { tokenAccount: tokenAccount, info: info })
    } else {
      let info = {
        balance: raw,
        tokenInfo: {
          pending: true,
          tokenAccount: tokenAccount
        }
      }
      commit('addTokenBalance', { tokenAccount: tokenAccount, info: info })
      commit('addToken', tokenAccount)
      pullTokenInfo(tokenAccount, rpcClient, commit)
    }
  }
}

// This will parse and append the MQTT request with additional information
const handleRequest = (request) => {
  if (request.type === 'send') {
    let total = bigInt(0)
    for (let trans of request.transactions) {
      total = total.plus(trans.amount)
      trans.amountInLogos = Logos.convert.fromReason(trans.amount, 'LOGOS')
    }
    request.totalAmountLogos = Logos.convert.fromReason(total.toString(), 'LOGOS')
  }
  if (request.type === 'withdraw_logos') {
    request.transaction.amountInLogos = Logos.convert.fromReason(request.transaction.amount, 'LOGOS')
  }
  if (request.type === 'burn' || request.type === 'issue_additional') {
    if (request.tokenInfo.issuerInfo && typeof request.tokenInfo.issuerInfo.decimals !== 'undefined') {
      request.amountInToken = Logos.convert.fromTo(request.amount, 0, request.tokenInfo.issuerInfo.decimals)
    }
  }
  if (request.type === 'distribute' || request.type === 'withdraw_fee' || request.type === 'revoke') {
    if (request.tokenInfo.issuerInfo && typeof request.tokenInfo.issuerInfo.decimals !== 'undefined') {
      request.transaction.amountInToken = Logos.convert.fromTo(request.transaction.amount, 0, request.tokenInfo.issuerInfo.decimals)
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
        trans.amountInToken = Logos.convert.fromTo(trans.amount, 0, request.tokenInfo.issuerInfo.decimals)
      }
    }
    request.totalAmount = total
    if (request.tokenInfo.issuerInfo && typeof request.tokenInfo.issuerInfo.decimals !== 'undefined') {
      request.totalAmountInToken = Logos.convert.fromTo(total, 0, request.tokenInfo.issuerInfo.decimals)
    }
  }
  if (request.type === 'issuance') {
    if (request.tokenInfo.issuerInfo && typeof request.tokenInfo.issuerInfo.decimals !== 'undefined') {
      request.totalSupplyInToken = Logos.convert.fromTo(request.total_supply, 0, request.tokenInfo.issuerInfo.decimals)
    }
    try {
      request.prettyInfo = JSON.stringify(JSON.parse(request.issuer_info), null, ' ')
    } catch (e) {
      request.prettyInfo = request.issuer_info
    }
  }
  return request
}

const pullTokenInfo = (tokenAccount, rpcClient, commit) => {
  rpcClient.accounts.info(tokenAccount).then(tokenInfo => {
    tokenInfo.tokenAccount = tokenAccount
    try {
      tokenInfo.issuerInfo = JSON.parse(tokenInfo.issuer_info)
    } catch (e) {
      tokenInfo.issuerInfo = {}
    }
    commit('updateToken', tokenInfo)
  })
}

const parseRequests = (request, rpcClient, commit, state) => {
  if (request.token_id) {
    let tokenAccount = LogosWallet.Utils.accountFromHexKey(request.token_id)
    if (state.tokens[tokenAccount]) {
      request.tokenInfo = state.tokens[tokenAccount]
      commit('addRequest', handleRequest(request))
    } else {
      request.tokenInfo = {
        pending: true,
        tokenAccount: tokenAccount
      }
      if (tokenAccount !== state.account) {
        commit('addToken', tokenAccount)
        pullTokenInfo(tokenAccount, rpcClient, commit)
      }
      commit('addRequest', handleRequest(request))
    }
  } else {
    commit('addRequest', handleRequest(request))
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
      }
    })
  },
  getAccountInfo: ({ state, commit, rootState }, account) => {
    let rpcClient = new Logos({ url: rootState.settings.rpcHost, proxyURL: rootState.settings.proxyURL, debug: true })
    commit('setAccount', account)
    rpcClient.accounts.info(account).then(val => {
      if (val) {
        if (!val.error) {
          if (val.tokens) {
            let balances = {}
            Object.entries(val.tokens).forEach(entry => {
              let tokenID = entry[0]
              let tokenAccountInfo = entry[1]
              let tokenAccount = LogosWallet.Utils.accountFromHexKey(tokenID)
              if (state.tokens[tokenAccount]) {
                tokenAccountInfo.tokenInfo = state.tokens[tokenAccount]
                balances[tokenAccount] = tokenAccountInfo
              } else {
                tokenAccountInfo.tokenInfo = {
                  pending: true,
                  tokenAccount: tokenAccount
                }
                balances[tokenAccount] = tokenAccountInfo
                commit('addToken', tokenAccount)
                pullTokenInfo(tokenAccount, rpcClient, commit)
              }
            })
            commit('setTokenBalances', balances)
          }

          commit('setRawBalance', val.balance)
          commit('setBalance', Logos.convert.fromReason(val.balance, 'LOGOS'))
          commit('setRequestCount', val.request_count)
          commit('setLastModified', parseInt(val.modified_timestamp))
          if (val.type === 'TokenAccount') {
            val.tokenAccount = account
            try {
              val.issuerInfo = JSON.parse(val.issuer_info)
            } catch (e) {
              val.issuerInfo = {}
            }
            val.circulating_supply = bigInt(val.total_supply).minus(bigInt(val.token_balance)).toString()
            if (val.issuerInfo && typeof val.issuerInfo.decimals !== 'undefined') {
              val.balanceInTokens = Logos.convert.fromTo(val.token_balance, 0, val.issuerInfo.decimals)
              val.feeBalanceInTokens = Logos.convert.fromTo(val.token_fee_balance, 0, val.issuerInfo.decimals)
              val.totalSupplyInTokens = Logos.convert.fromTo(val.total_supply, 0, val.issuerInfo.decimals)
              val.circulatingSupplyInTokens = Logos.convert.fromTo(val.circulating_supply, 0, val.issuerInfo.decimals)
              if (val.fee_type.toLowerCase() === 'flat') val.feeInTokens = Logos.convert.fromTo(val.fee_rate, 0, val.issuerInfo.decimals)
            }
            commit('updateToken', val)
          }
          commit('setAccountType', val.type)
          if (val.representative_block && val.representative_block !== '0000000000000000000000000000000000000000000000000000000000000000') {
            commit('setRepresentative', LogosWallet.Utils.accountFromHexKey(val.representative_block))
          }
        } else {
          commit('setError', val.error)
        }
      } else {
        commit('setError', 'Account Info Not Found')
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
      }
    })
  },
  addRequest ({ state, commit, rootState, dispatch }, request) {
    let requestData = cloneDeep(request)
    let rpcClient = new Logos({ url: rootState.settings.rpcHost, proxyURL: rootState.settings.proxyURL, debug: true })

    // Add token data
    let tokenAccount = null
    if (state.type === 'TokenAccount' || requestData.token_id) {
      if (requestData.token_id) {
        tokenAccount = LogosWallet.Utils.accountFromHexKey(requestData.token_id)
      } else {
        tokenAccount = state.account
      }
      if (state.tokens[tokenAccount]) {
        requestData.tokenInfo = state.tokens[tokenAccount]
      } else {
        commit('addToken', tokenAccount)
        requestData.tokenInfo = {
          pending: true,
          tokenAccount: tokenAccount
        }
        pullTokenInfo(tokenAccount, rpcClient, commit)
      }
    }
    requestData = handleRequest(requestData)
    requestData.timestamp = parseInt(requestData.timestamp)

    if (state.type === 'TokenAccount') {
      // Add requests from the MQTT for token accounts
      let val = cloneDeep(state.tokens[tokenAccount])

      // Handle Logos Fees
      if (requestData.type !== 'issuance' &&
        requestData.type !== 'token_send' &&
        requestData.type !== 'send' &&
        tokenAccount === state.account) {
        let newRawBalance = bigInt(val.balance).minus(bigInt(requestData.fee)).toString()
        val.balance = newRawBalance
      }

      // Handle Requests
      if (requestData.type === 'send') {
        let newRawBalance = bigInt(val.balance)
        for (let trans of requestData.transactions) {
          if (trans.destination === state.account) newRawBalance = newRawBalance.add(bigInt(trans.amount))
        }
        val.balance = newRawBalance.toString()
      } else if (requestData.type === 'issuance') {
        val.tokenAccount = tokenAccount
        val.balance = '0'
        val.controllers = requestData.controllers
        val.fee_rate = requestData.fee_rate
        val.fee_type = requestData.fee_type
        val.frontier = null
        val.issuance_request = requestData.hash
        try {
          val.issuerInfo = JSON.parse(requestData.issuer_info)
        } catch (e) {
          val.issuerInfo = {}
        }
        val.issuer_info = requestData.issuer_info
        val.name = requestData.name
        val.receive_tip = requestData.hash
        val.request_count = '1'
        val.sequence = '0'
        val.settings = requestData.settings
        val.symbol = requestData.symbol
        val.tokenAccount = state.account
        val.token_balance = requestData.total_supply
        val.token_fee_balance = '0'
        val.total_supply = requestData.total_supply
        val.type = 'TokenAccount'
        val.circulating_supply = '0'
        if (val.issuerInfo && typeof val.issuerInfo.decimals !== 'undefined') {
          val.balanceInTokens = Logos.convert.fromTo(val.token_balance, 0, val.issuerInfo.decimals)
          val.feeBalanceInTokens = Logos.convert.fromTo(val.token_fee_balance, 0, val.issuerInfo.decimals)
          val.totalSupplyInTokens = Logos.convert.fromTo(val.total_supply, 0, val.issuerInfo.decimals)
          val.circulatingSupplyInTokens = Logos.convert.fromTo(val.circulating_supply, 0, val.issuerInfo.decimals)
          if (val.fee_type.toLowerCase() === 'flat') val.feeInTokens = Logos.convert.fromTo(val.fee_rate, 0, val.issuerInfo.decimals)
        }
        commit('setAccountType', 'TokenAccount')
      } else if (requestData.type === 'issue_additional') {
        let totalSupply = bigInt(val.total_supply).plus(bigInt(requestData.amount)).toString()
        val.total_supply = totalSupply
        if (val.issuerInfo && typeof val.issuerInfo.decimals !== 'undefined') {
          val.totalSupplyInTokens = Logos.convert.fromTo(totalSupply, 0, val.issuerInfo.decimals)
        }
      } else if (requestData.type === 'change_setting') {
        if (requestData.value === 'false') {
          delete val.settings[requestData.setting]
        } else if (requestData.value === 'true') {
          val.settings[requestData.setting] = requestData.value
        }
      } else if (requestData.type === 'immute_setting') {
        delete val.settings['modify_' + requestData.setting]
      } else if (requestData.type === 'revoke') {
        // Does not handle foreign tokens
        if (state.account === requestData.transaction.destination) {
          val.token_balance = bigInt(val.token_balance).plus(bigInt(requestData.transaction.amount)).toString()
        }
        if (state.account === requestData.source) {
          val.token_balance = bigInt(val.token_balance).minus(bigInt(requestData.transaction.amount)).toString()
        }
        val.circulating_supply = bigInt(val.total_supply).minus(bigInt(val.token_balance)).toString()
        if (val.issuerInfo && typeof val.issuerInfo.decimals !== 'undefined') {
          let circulatingSupplyInTokens = Logos.convert.fromTo(val.circulating_supply, 0, val.issuerInfo.decimals)
          val.circulatingSupplyInTokens = circulatingSupplyInTokens
        }
      } else if (requestData.type === 'adjust_user_status') {
        // No reason to handle anything but in future maybe
      } else if (requestData.type === 'adjust_fee') {
        val.fee_rate = requestData.fee_rate
        val.fee_type = requestData.fee_type
        if (val.fee_type.toLowerCase() === 'flat' &&
          val.issuerInfo && typeof val.issuerInfo.decimals !== 'undefined') {
          val.feeInTokens = Logos.convert.fromTo(val.fee_rate, 0, val.issuerInfo.decimals)
        }
      } else if (requestData.type === 'update_issuer_info') {
        try {
          val.issuerInfo = JSON.parse(requestData.new_info)
        } catch (e) {
          val.issuerInfo = {}
        }
        if (val.issuerInfo && typeof val.issuerInfo.decimals !== 'undefined') {
          val.balanceInTokens = Logos.convert.fromTo(val.token_balance, 0, val.issuerInfo.decimals)
          val.feeBalanceInTokens = Logos.convert.fromTo(val.token_fee_balance, 0, val.issuerInfo.decimals)
          val.totalSupplyInTokens = Logos.convert.fromTo(val.total_supply, 0, val.issuerInfo.decimals)
          val.circulatingSupplyInTokens = Logos.convert.fromTo(val.circulating_supply, 0, val.issuerInfo.decimals)
          if (val.fee_type.toLowerCase() === 'flat') val.feeInTokens = Logos.convert.fromTo(val.fee_rate, 0, val.issuerInfo.decimals)
        }
      } else if (requestData.type === 'update_controller') {
        val.controllers = val.controllers.filter(controller => controller.account !== requestData.controller.account)
        if (requestData.action === 'add') val.controllers.push(requestData.controller)
      } else if (requestData.type === 'burn') {
        let totalSupply = bigInt(val.total_supply).minus(bigInt(requestData.amount)).toString()
        val.total_supply = totalSupply
        val.token_balance = bigInt(val.token_balance).minus(bigInt(requestData.amount)).toString()
        if (val.issuerInfo && typeof val.issuerInfo.decimals !== 'undefined') {
          let totalSupplyInTokens = Logos.convert.fromTo(totalSupply, 0, val.issuerInfo.decimals)
          val.totalSupplyInTokens = totalSupplyInTokens
        }
      } else if (requestData.type === 'distribute') {
        // Does not handle foreign tokens
        if (requestData.transaction.destination !== state.account) {
          let circulatingSupply = bigInt(val.circulating_supply).plus(bigInt(requestData.transaction.amount)).toString()
          val.circulating_supply = circulatingSupply
          val.token_balance = bigInt(val.token_balance).minus(bigInt(requestData.transaction.amount)).toString()
          if (val.issuerInfo && typeof val.issuerInfo.decimals !== 'undefined') {
            let circulatingSupplyInTokens = Logos.convert.fromTo(circulatingSupply, 0, val.issuerInfo.decimals)
            val.circulatingSupplyInTokens = circulatingSupplyInTokens
          }
        }
      } else if (requestData.type === 'withdraw_fee') {
        // Receive
        if (requestData.transaction.destination === state.account) {
          val.token_balance = bigInt(val.token_balance).plus(bigInt(requestData.transaction.amount)).toString()
          val.circulating_supply = bigInt(val.circulating_supply).plus(bigInt(requestData.transaction.amount)).toString()
          if (val.issuerInfo && typeof val.issuerInfo.decimals !== 'undefined') {
            val.circulatingSupplyInTokens = Logos.convert.fromTo(val.circulating_supply, 0, val.issuerInfo.decimals)
          }
        }

        // Send
        if (tokenAccount === state.account) {
          let feeBalance = bigInt(val.token_fee_balance).minus(bigInt(requestData.transaction.amount)).toString()
          val.token_fee_balance = feeBalance
          if (val.issuerInfo && typeof val.issuerInfo.decimals !== 'undefined') {
            val.feeBalanceInTokens = Logos.convert.fromTo(feeBalance, 0, val.issuerInfo.decimals)
          }
        }
      } else if (requestData.type === 'withdraw_logos') {
        // Receive
        if (requestData.transaction.destination === state.account) {
          val.balance = bigInt(val.balance).plus(bigInt(requestData.transaction.amount)).toString()
        }
        // Send
        if (tokenAccount === state.account) {
          val.balance = bigInt(val.balance).minus(bigInt(requestData.transaction.amount)).toString()
        }
      } else if (requestData.type === 'token_send') {
        // Does not handle foreign token sends to this account
        let feeBalance = bigInt(val.token_fee_balance).plus(bigInt(requestData.token_fee)).toString()
        val.token_fee_balance = feeBalance
        if (val.issuerInfo && typeof val.issuerInfo.decimals !== 'undefined') {
          val.feeBalanceInTokens = Logos.convert.fromTo(feeBalance, 0, val.issuerInfo.decimals)
        }
      }
      if (val) {
        commit('setRawBalance', val.balance.toString())
        commit('setBalance', Logos.convert.fromReason(val.balance, 'LOGOS'))
        commit('updateToken', val)
      }
      if (requestData.type !== 'token_send') {
        commit('setError', null)
        commit('incrementRequestCount')
        commit('setLastModified', requestData.timestamp)
        commit('unshiftRequest', requestData)
      }
    } else {
      // Handle Logos Account MQTT
      if (requestData.origin === state.account &&
        (requestData.type === 'send' || requestData.type === 'token_send' || requestData.type === 'issuance')) {
        if (requestData.type === 'send') {
          let newRawBalance = bigInt(0)
          if (state.rawBalance) newRawBalance = bigInt(state.rawBalance).minus(bigInt(requestData.fee))
          for (let trans of requestData.transactions) {
            if (trans.destination !== state.account) newRawBalance = bigInt(newRawBalance).minus(bigInt(trans.amount))
          }
          commit('setRawBalance', newRawBalance.toString())
          commit('setBalance', Logos.convert.fromReason(state.rawBalance, 'LOGOS'))
        } else if (requestData.type === 'token_send') {
          let newRawBalance = bigInt(0)
          if (state.rawBalance) newRawBalance = bigInt(state.rawBalance).minus(bigInt(requestData.fee))
          commit('setRawBalance', newRawBalance.toString())
          commit('setBalance', Logos.convert.fromReason(state.rawBalance, 'LOGOS'))
          let newRawTokenBalance = bigInt(0)
          if (state.tokenBalances[tokenAccount]) newRawTokenBalance = bigInt(state.tokenBalances[tokenAccount].balance).minus(bigInt(requestData.token_fee))
          for (let trans of requestData.transactions) {
            if (trans.destination !== state.account) newRawTokenBalance = bigInt(newRawTokenBalance).minus(bigInt(trans.amount))
          }
          updateTokenBalance(newRawTokenBalance.toString(), tokenAccount, rpcClient, commit, state)
        } else if (requestData.type === 'issuance') {
          let newRawBalance = bigInt(0)
          if (state.rawBalance) newRawBalance = bigInt(state.rawBalance).minus(bigInt(requestData.fee))
          commit('setRawBalance', newRawBalance.toString())
          commit('setBalance', Logos.convert.fromReason(state.rawBalance, 'LOGOS'))
        }
        commit('setError', null)
        commit('incrementRequestCount')
        commit('setLastModified', requestData.timestamp)
        commit('unshiftRequest', requestData)
      } else if (requestData.origin !== state.account && (requestData.type === 'send' || requestData.type === 'token_send')) { // Handle Recieves
        if (requestData.type === 'send') {
          let newRawBalance = bigInt(0)
          if (state.rawBalance) newRawBalance = bigInt(state.rawBalance)
          for (let trans of requestData.transactions) {
            if (trans.destination === state.account) newRawBalance = newRawBalance.add(bigInt(trans.amount))
          }
          commit('setRawBalance', newRawBalance.toString())
          commit('setBalance', Logos.convert.fromReason(state.rawBalance, 'LOGOS'))
        } else if (requestData.type === 'token_send') {
          let newRawTokenBalance = bigInt(0)
          if (state.tokenBalances[tokenAccount]) newRawTokenBalance = bigInt(state.tokenBalances[tokenAccount].balance)
          for (let trans of requestData.transactions) {
            if (trans.destination === state.account) newRawTokenBalance = bigInt(newRawTokenBalance).plus(bigInt(trans.amount))
          }
          updateTokenBalance(newRawTokenBalance.toString(), tokenAccount, rpcClient, commit, state)
        }
        if (state.type === 'LogosAccount' || requestData.type === 'send') {
          if (state.requests.length === 0) {
            dispatch('getAccountInfo', state.account)
          }
          commit('setError', null)
          commit('incrementRequestCount')
          commit('setLastModified', requestData.timestamp)
          commit('unshiftRequest', requestData)
        }
      }

      // Handle other block types that may affect token balance of a Logos Account
      if (requestData.type === 'withdraw_fee' || requestData.type === 'distribute') {
        if (state.account === requestData.transaction.destination) {
          let newRawTokenBalance = bigInt(0)
          if (state.tokenBalances[tokenAccount]) newRawTokenBalance = bigInt(state.tokenBalances[tokenAccount].balance).plus(bigInt(requestData.transaction.amount))
          updateTokenBalance(newRawTokenBalance.toString(), tokenAccount, rpcClient, commit, state)
          commit('setError', null)
          commit('incrementRequestCount')
          commit('setLastModified', requestData.timestamp)
          commit('unshiftRequest', requestData)
        }
      } else if (requestData.type === 'revoke') {
        if (state.account === requestData.transaction.destination || state.account === requestData.source) {
          let newRawTokenBalance = bigInt(0)
          let tokenAccount = LogosWallet.Utils.accountFromHexKey(requestData.token_id)
          if (state.tokenBalances[tokenAccount]) newRawTokenBalance = bigInt(state.tokenBalances[tokenAccount].balance)
          if (state.account === requestData.transaction.destination) {
            newRawTokenBalance.plus(bigInt(requestData.transaction.amount))
          }
          if (state.account === requestData.source) {
            newRawTokenBalance.minus(bigInt(requestData.transaction.amount))
          }
          updateTokenBalance(newRawTokenBalance.toString(), tokenAccount, rpcClient, commit, state)
          commit('setError', null)
          commit('incrementRequestCount')
          commit('setLastModified', requestData.timestamp)
          commit('unshiftRequest', requestData)
        }
      } else if (requestData.type === 'withdraw_logos') {
        if (state.account === requestData.transaction.destination) {
          let newRawBalance = bigInt(0)
          if (state.rawBalance) newRawBalance = bigInt(state.rawBalance)
          newRawBalance = newRawBalance.add(bigInt(requestData.transaction.amount))
          commit('setError', null)
          commit('incrementRequestCount')
          commit('setRawBalance', newRawBalance.toString())
          commit('setBalance', Logos.convert.fromReason(state.rawBalance, 'LOGOS'))
          commit('setLastModified', requestData.timestamp)
          commit('unshiftRequest', requestData)
        }
      }
    }
  },
  reset: ({ commit }) => {
    commit('reset')
  }
}

const mutations = {
  setRepresentative (state, rep) {
    state.representaive = rep
  },
  setBalance (state, balance) {
    state.balance = balance
  },
  setRawBalance (state, balance) {
    state.rawBalance = balance
  },
  setTokenBalance (state, data) {
    state.tokenBalances[data.tokenAccount].balanceInTokens = data.tokenBalance
  },
  setRawTokenBalance (state, data) {
    state.tokenBalances[data.tokenAccount].balance = data.rawTokenBalance
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
  setAccountType (state, type) {
    state.type = type
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
      if (request.origin === state.account) state.lastHash = state.requests[state.requests.length - 1].hash
    }
  },
  unshiftRequest (state, request) {
    if (!state.hashes[request.hash]) {
      state.hashes[request.hash] = request
      state.requests.unshift(request)
      if (request.origin === state.account) state.lastHash = request.hash
    }
  },
  addToken (state, tokenAccount) {
    Vue.set(state.tokens, tokenAccount, {
      pending: true,
      tokenAccount: tokenAccount
    })
  },
  updateToken (state, tokenInfo) {
    Vue.set(state.tokens, tokenInfo.tokenAccount, tokenInfo)
    for (let request of state.requests) {
      if (request.tokenInfo && request.tokenInfo.pending &&
        request.tokenInfo.tokenAccount === tokenInfo.tokenAccount) {
        request.tokenInfo = state.tokens[tokenInfo.tokenAccount]
        request = handleRequest(request)
      }
    }
    for (let tokenBalance of Object.values(state.tokenBalances)) {
      if (tokenBalance && tokenBalance.tokenInfo && tokenBalance.tokenInfo.pending &&
        tokenBalance.tokenInfo.tokenAccount === tokenInfo.tokenAccount) {
        tokenBalance.tokenInfo = state.tokens[tokenInfo.tokenAccount]
        if (tokenBalance.tokenInfo.issuerInfo && typeof tokenBalance.tokenInfo.issuerInfo.decimals !== 'undefined') {
          tokenBalance.balanceInTokens = Logos.convert.fromTo(tokenBalance.balance, 0, tokenBalance.tokenInfo.issuerInfo.decimals)
        }
        Vue.set(state.tokenBalances, tokenInfo.tokenAccount, tokenBalance)
      }
    }
  },
  setTokenBalances (state, balances) {
    state.tokenBalances = balances
  },
  addTokenBalance (state, data) {
    Vue.set(state.tokenBalances, data.tokenAccount, data.info)
  },
  setAccount (state, account) {
    state.account = account
  },
  reset (state) {
    state.account = null
    state.representaive = null
    state.error = null
    state.balance = '0'
    state.rawBalance = '0'
    state.count = 50
    state.requests = []
    state.hashes = {}
    state.lastHash = null
    state.type = null
    state.tokens = {}
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
