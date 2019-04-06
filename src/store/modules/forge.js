import Vue from 'vue'
import cloneDeep from 'lodash/cloneDeep'
import Logos from '@logosnetwork/logos-rpc-client'

const state = {
  tokens: {},
  walletAccounts: {},
  accounts: {},
  currentAccount: null,
  seed: null
}

const getters = {
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
    commit('setSeed', wallet._seed)
    commit('setCurrentAccount', wallet.account)
  }
}

const mutations = {
  setAccounts (state, accounts) {
    state.walletAccounts = cloneDeep(accounts)
    for (let account in state.walletAccounts) {
      let applicationAccount = {
        address: account,
        label: state.walletAccounts[account].label,
        balance: state.walletAccounts[account].balance,
        logosBalance: Logos.convert.fromReason(state.walletAccounts[account].balance, 'LOGOS')
      }
      Vue.set(state.accounts, account, applicationAccount)
    }
  },
  setCurrentAccount (state, account) {
    if (account) {
      state.currentAccount = state.accounts[account.address]
    }
  },
  setSeed (state, seed) {
    state.seed = cloneDeep(seed)
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
