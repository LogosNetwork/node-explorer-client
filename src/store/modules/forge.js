import Vue from 'vue'
import cloneDeep from 'lodash/cloneDeep'

const state = {
  tokens: {},
  accounts: {}
}

const getters = {
  accountsArray: state => {
    let result = []
    for (let account in state.accounts) {
      result.push({
        address: account,
        label: state.accounts[account].label
      })
    }
    return result
  }
}

// const pullTokenInfo = (tokenAccount, rpcClient, commit) => {
//   rpcClient.accounts.info(tokenAccount).then(tokenInfo => {
//     tokenInfo.tokenAccount = tokenAccount
//     try {
//       tokenInfo.issuerInfo = JSON.parse(tokenInfo.issuer_info)
//     } catch (e) {
//       tokenInfo.issuerInfo = {}
//     }
//     commit('updateToken', tokenInfo)
//   })
// }

const actions = {
  update ({ commit }, wallet) {
    commit('setAccounts', wallet._accounts)
  }
}

const mutations = {
  setAccounts (state, accounts) {
    state.accounts = cloneDeep(accounts)
  },
  addToken (state, tokenAccount) {
    Vue.set(state.tokens, tokenAccount, {
      pending: true,
      tokenAccount: tokenAccount
    })
  },
  updateToken (state, tokenInfo) {
    Vue.set(state.tokens, tokenInfo.tokenAccount, tokenInfo)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
