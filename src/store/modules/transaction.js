import Logos from '@logosnetwork/logos-rpc-client'
const state = {
  transaction: null,
  details: null,
  prettyDetails: null,
  error: null
}

const getters = {

}

const actions = {
  getTransactionInfo: ({ commit, rootState }, transaction) => {
    commit('setTransaction', transaction)
    let rpcClient = new Logos({ url: rootState.settings.rpcHost, proxyURL: rootState.settings.proxyURL, debug: true })
    rpcClient.transactions.info(transaction).then(val => {
      if (val && !val.error) {
        let details = val
        let prettyDetails = null
        if (details.type === 'receive') {
          rpcClient.transactions.info(details.link).then(val => {
            prettyDetails = JSON.stringify(details, null, ' ')
            commit('setPrettyDetails', prettyDetails)
            details.link_as_account = val.account
            details.amount = parseFloat(Number(rpcClient.convert.fromReason(details.amount, 'LOGOS')).toFixed(5))
            commit('setDetails', details)
          })
        } else {
          prettyDetails = JSON.stringify(details, null, ' ')
          commit('setPrettyDetails', prettyDetails)
          details.amount = parseFloat(Number(rpcClient.convert.fromReason(details.amount, 'LOGOS')).toFixed(5))
          commit('setDetails', details)
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
  addBlock ({ commit, rootState }, block) {
    let details = block
    let prettyDetails = null
    let rpcClient = new Logos({ url: rootState.settings.rpcHost, proxyURL: rootState.settings.proxyURL, debug: true })
    prettyDetails = JSON.stringify(details, null, ' ')
    commit('setPrettyDetails', prettyDetails)
    details.amount = parseFloat(Number(rpcClient.convert.fromReason(details.amount, 'LOGOS')).toFixed(5))
    commit('setDetails', details)
    commit('setError', null)
  },
  reset: ({ commit }) => {
    commit('reset')
  }
}

const mutations = {
  setTransaction (state, transaction) {
    state.transaction = transaction
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
    state.transaction = null
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
