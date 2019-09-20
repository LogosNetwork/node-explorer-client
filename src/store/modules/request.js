import Logos from '@logosnetwork/logos-rpc-client'
import { Utils } from '@logosnetwork/logos-webwallet-sdk'
import bigInt from 'big-integer'
const state = {
  request: null,
  details: null,
  prettyDetails: null,
  error: null
}

const getters = {

}

const actions = {
  getRequestInfo: ({ commit, rootState }, hash) => {
    commit('setRequest', hash)
    let rpcClient = new Logos({ url: `http://${rootState.settings.rpcHost}:${rootState.settings.rpcPort}`, proxyURL: rootState.settings.proxyURL, debug: true })
    rpcClient.requests.info(hash).then(request => {
      if (request && !request.error) {
        commit('setPrettyDetails', JSON.stringify(request, null, ' '))
        request.inactive = true
        if (request.type === 'send' && request.transactions && request.transactions.length > 0) {
          let total = bigInt(0)
          for (let trans of request.transactions) {
            total = total.plus(trans.amount)
            trans.amountInLogos = Logos.convert.fromReason(trans.amount, 'LOGOS').replace(/\.0+$/, '')
          }
          request.totalAmountLogos = Logos.convert.fromReason(total.toString(), 'LOGOS').replace(/\.0+$/, '')
          commit('setDetails', request)
        } else if (request.type === 'burn' || request.type === 'update_issuer_info' ||
          request.type === 'token_send' || request.type === 'distribute' ||
          request.type === 'adjust_fee' || request.type === 'change_setting' ||
          request.type === 'adjust_user_status' || request.type === 'issuance' ||
          request.type === 'issue_additional' || request.type === 'withdraw_fee' ||
          request.type === 'update_controller' || request.type === 'revoke' ||
          request.type === 'immute_setting' || request.type === 'withdraw_logos') {
          let tokenAddress = Utils.accountFromHexKey(request.token_id)
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
                request.amountInToken = Logos.convert.fromTo(request.amount, 0, data.issuerInfo.decimals).replace(/\.0+$/, '')
              }
            }
            if (request.type === 'distribute' || request.type === 'withdraw_fee' || request.type === 'revoke') {
              if (typeof data.issuerInfo.decimals !== 'undefined') {
                request.transaction.amountInToken = Logos.convert.fromTo(request.transaction.amount, 0, data.issuerInfo.decimals).replace(/\.0+$/, '')
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
                if (typeof data.issuerInfo.decimals !== 'undefined') {
                  trans.amountInToken = Logos.convert.fromTo(trans.amount, 0, data.issuerInfo.decimals).replace(/\.0+$/, '')
                }
              }
              request.totalAmount = total
              if (typeof data.issuerInfo.decimals !== 'undefined') {
                request.totalAmountInToken = Logos.convert.fromTo(total, 0, data.issuerInfo.decimals)
              }
            }
            if (request.type === 'issuance') {
              if (typeof data.issuerInfo.decimals !== 'undefined') {
                request.totalSupplyInToken = Logos.convert.fromTo(request.total_supply, 0, data.issuerInfo.decimals)
              }
              try {
                request.prettyInfo = JSON.stringify(JSON.parse(request.issuer_info), null, ' ')
              } catch (e) {
                request.prettyInfo = request.issuer_info
              }
            }
            commit('setDetails', request)
          })
        } else {
          commit('setDetails', request)
        }
      } else {
        if (request && request.error) {
          commit('setError', request.error)
        } else {
          commit('setError', '404')
        }
      }
    })
  },
  addRequest ({ commit }, request) {
    let details = request
    let prettyDetails = null
    prettyDetails = JSON.stringify(details, null, ' ')
    commit('setPrettyDetails', prettyDetails)
    details.totalAmountInLogos = 0
    if (details.transactions) {
      for (let trans of details.transactions) {
        let logosVal = Logos.convert.fromReason(trans.amount, 'LOGOS')
        details.totalAmountInLogos += logosVal
        trans.amountInLogos = logosVal
      }
    }
    commit('setDetails', details)
    commit('setError', null)
  },
  reset: ({ commit }) => {
    commit('reset')
  }
}

const mutations = {
  setRequest (state, request) {
    state.request = request
  },
  setDetails (state, details) {
    state.details = details
  },
  setPrettyDetails (state, prettyDetails) {
    state.prettyDetails = prettyDetails
  },
  setError (state, error) {
    state.error = error
  },
  reset (state) {
    state.details = null
    state.prettyDetails = null
    state.request = null
    state.error = null
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
