import Logos from '@logosnetwork/logos-rpc-client'
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
  getRequestInfo: ({ commit, rootState }, request) => {
    commit('setRequest', request)
    let rpcClient = new Logos({ url: rootState.settings.rpcHost, proxyURL: rootState.settings.proxyURL, debug: true })
    rpcClient.requests.info(request).then(val => {
      if (val && !val.error) {
        let details = val
        let prettyDetails = null
        if (details.type === 'send') {
          prettyDetails = JSON.stringify(details, null, ' ')
          commit('setPrettyDetails', prettyDetails)
          details.totalAmountInLogos = 0
          for (let trans of details.transactions) {
            let logosVal = parseFloat(Number(rpcClient.convert.fromReason(trans.amount, 'LOGOS')).toFixed(5))
            details.totalAmountInLogos += logosVal
            trans.amountInLogos = logosVal
          }
          commit('setDetails', details)
        } else if (details.type === 'issuance' || details.type === 'update_controller' ||
          details.type === 'issue_additional' || details.type === 'burn' ||
          details.type === 'update_issuer_info' || details.type === 'adjust_fee' ||
          details.type === 'change_setting' || details.type === 'distribute' ||
          details.type === 'adjust_user_status' || details.type === 'token_send') {
          rpcClient.accounts.toAddress(details.token_id).then(val => {
            prettyDetails = JSON.stringify(details, null, ' ')
            details.token_account = val.account
            commit('setPrettyDetails', prettyDetails)
            if (details.type === 'token_send') {
              details.totalAmount = 0
              for (let trans of details.transactions) {
                details.totalAmount = bigInt(details.totalAmount).plus(trans.amount)
              }
            }
            commit('setDetails', details)
          })
        }
      } else {
        if (val && val.error) {
          commit('setError', val.error)
        } else {
          commit('setError', '404')
        }
      }
    })
  },
  addRequest ({ commit, rootState }, request) {
    let details = request
    let prettyDetails = null
    let rpcClient = new Logos({ url: rootState.settings.rpcHost, proxyURL: rootState.settings.proxyURL, debug: true })
    prettyDetails = JSON.stringify(details, null, ' ')
    commit('setPrettyDetails', prettyDetails)
    details.totalAmountInLogos = 0
    for (let trans of details.transactions) {
      let logosVal = parseFloat(Number(rpcClient.convert.fromReason(trans.amount, 'LOGOS')).toFixed(5))
      details.totalAmountInLogos += logosVal
      trans.amountInLogos = logosVal
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
