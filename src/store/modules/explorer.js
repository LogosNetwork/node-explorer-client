import Logos from '@logosnetwork/logos-rpc-client'
import axios from 'axios'
import cloneDeep from 'lodash/cloneDeep'
import bigInt from 'big-integer'
import LogosWallet from '@logosnetwork/logos-webwallet-sdk'
const state = {
  requests: [],
  error: null,
  epoch: null,
  microEpoch: null,
  requestBlock: null,
  tokens: {}
}

const getters = {

}

const pullTokenInfo = (tokenAccount, rpcClient, commit) => {
  rpcClient.accounts.info(tokenAccount).then(tokenInfo => {
    tokenInfo.tokenAccount = tokenAccount
    try {
      tokenInfo.issuerInfo = JSON.parse(tokenInfo.issuer_info)
    } catch (e) {
      tokenInfo.issuerInfo = {}
    }
    commit('updateToken', {
      rpcClient: rpcClient,
      tokenInfo: tokenInfo,
      commit: commit
    })
  })
}

const handleRequests = (request, rpcClient, commit, state) => {
  if (request.token_id) {
    let tokenAccount = LogosWallet.Utils.accountFromHexKey(request.token_id)
    if (state.tokens[tokenAccount]) {
      request.tokenInfo = state.tokens[tokenAccount]
    } else {
      commit('addToken', tokenAccount)
      request.tokenInfo = {
        pending: true,
        tokenAccount: tokenAccount
      }
      pullTokenInfo(tokenAccount, rpcClient, commit)
    }
  }
  if (request.type === 'send') {
    let total = bigInt(0)
    for (let trans of request.transactions) {
      total = total.plus(trans.amount)
      trans.amountInLogos = Logos.convert.fromReason(trans.amount, 'LOGOS')
    }
    request.totalAmountLogos = Logos.convert.fromReason(total.toString(), 'LOGOS')
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
  if (request.type === 'withdraw_logos') {
    request.transaction.amountInLogos = Logos.convert.fromReason(request.transaction.amount, 'LOGOS')
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

const actions = {
  getRequests ({ commit, rootState, state }, cb) {
    let rpcClient = new Logos({ url: rootState.settings.rpcHost, proxyURL: rootState.settings.proxyURL, debug: true })
    let savedRequests = [...state.requests]
    let lastCreatedAt = null
    if (savedRequests && savedRequests.length > 0) {
      lastCreatedAt = savedRequests[savedRequests.length - 1].createdAt
    }
    axios.get(`${rootState.settings.requestURL}/blocks/requests`, {
      params: {
        previousDate: lastCreatedAt
      }
    })
      .then((res) => {
        for (let request of res.data.data.requests) {
          commit('pushRequest', handleRequests(request, rpcClient, commit, state))
        }
        if (res.data.data.requests.length > 0) {
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
  getLatestRequestBlock ({ commit, rootState }) {
    axios.get(`${rootState.settings.requestURL}/blocks/lastRequestBlock`)
      .then((res) => {
        commit('setRequestBlock', res.data.data.requestBlock[0])
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
          val.epochs[0].feeInLogos = parseFloat(Number(Logos.convert.fromReason(val.epochs[0].transaction_fee_pool, 'LOGOS')).toFixed(5))
          commit('setEpoch', val.epochs[0])
        } else {
          commit('setError', val.error)
        }
      } else {
        commit('setError', 'null')
      }
    })
  },
  getRequestType ({ rootState }, data) {
    let rpcClient = new Logos({ url: rootState.settings.rpcHost, proxyURL: rootState.settings.proxyURL, debug: true })
    rpcClient.requests.info(data.hash, false).then((val) => {
      if (!val.error) {
        data.cb('request')
      } else {
        rpcClient.requestBlocks.get([data.hash]).then((val) => {
          if (!val.error) {
            data.cb('requestBlock')
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
  addRequest ({ commit, rootState, state }, request) {
    let requestData = cloneDeep(request)
    let rpcClient = new Logos({ url: rootState.settings.rpcHost, proxyURL: rootState.settings.proxyURL, debug: true })

    // Add token data
    let tokenAccount = null
    if (requestData.token_id) {
      tokenAccount = LogosWallet.Utils.accountFromHexKey(requestData.token_id)
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
    requestData = handleRequests(requestData, rpcClient, commit, state)
    commit('unshiftRequest', requestData)
  },
  reset: ({ commit }) => {
    commit('reset')
  }
}

const mutations = {
  setError (state, error) {
    state.error = error
  },
  setRequests (state, requests) {
    state.requests = requests
  },
  pushRequest (state, request) {
    state.requests.push(request)
  },
  unshiftRequest (state, request) {
    state.requests.unshift(request)
  },
  setRequestBlock (state, requestBlock) {
    state.requestBlock = requestBlock
  },
  setMicroEpoch (state, microEpoch) {
    state.microEpoch = microEpoch
  },
  setEpoch (state, epoch) {
    state.epoch = epoch
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
        request = handleRequests(request, data.rpcClient, data.commit, state)
      }
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
