import Logos from '@logosnetwork/logos-rpc-client'
const rpcClient = new Logos({ url: 'http://18.212.15.104:55000', debug: true })
const state = {
  transactions: [],
  error: null
}

const getters = {

}

const actions = {
  getRecentTransactions: ({ commit }) => {
    rpcClient.rpc('confirmation_history').then(val => {
      if (!val.error) {
        console.log(val)
      } else {
        commit('setError', val.error)
      }
    })
  },
  reset: ({ commit }) => {
    commit('reset')
  }
}

const mutations = {
  setError (state, error) {
    state.error = error
  },
  setTransactions (state, transactions) {
    state.transactions = transactions
  },
  addBlock (state, blockData) {
    blockData.message = JSON.parse(blockData.message)
    if (blockData.message.type === 'send') {
      blockData.message.amount = parseFloat(Number(rpcClient.convert.fromReason(blockData.message.amount, 'LOGOS')).toFixed(5))
      blockData.message.account = blockData.message.account.replace('xrb_', 'lgs_')
      state.transactions.unshift(blockData.message)
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
