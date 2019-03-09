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
  requestBlock: null
}

const getters = {

}

const actions = {
  getRequests ({ commit, rootState }, cb) {
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
          if (request.type === 'send' && request.transactions && request.transactions.length > 0) {
            let total = bigInt(0)
            for (let trans of request.transactions) {
              total = total.plus(trans.amount)
              trans.amountInLogos = rpcClient.convert.fromReason(trans.amount, 'LOGOS').replace(/\.0+$/, '')
            }
            request.totalAmountLogos = rpcClient.convert.fromReason(total.toString(), 'LOGOS').replace(/\.0+$/, '')
            commit('pushRequest', request)
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
              commit('pushRequest', request)
            })
          } else {
            commit('pushRequest', request)
          }
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
  addRequest ({ commit, rootState }, request) {
    let requestData = cloneDeep(request)
    if (requestData.type === 'send') {
      let rpcClient = new Logos({ url: rootState.settings.rpcHost, proxyURL: rootState.settings.proxyURL, debug: true })
      for (let trans of requestData.transactions) {
        trans.amountInLogos = parseFloat(Number(rpcClient.convert.fromReason(trans.amount, 'LOGOS')).toFixed(5))
      }
      requestData.createdAt = parseInt(requestData.timestamp)
      commit('unshiftRequest', requestData)
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
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
