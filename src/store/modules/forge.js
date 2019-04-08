import Vue from 'vue'
import cloneDeep from 'lodash/cloneDeep'
import Logos from '@logosnetwork/logos-rpc-client'
import LogosWallet from '@logosnetwork/logos-webwallet-sdk'
import bigInt from 'big-integer'

const state = {
  toasts: [],
  tokens: {},
  walletAccounts: {},
  accounts: {},
  currentAccount: null,
  seed: null
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
    commit('updateToken', tokenInfo)
  })
}

const createToast = (request, rpcClient, commit, state) => {
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

  // Parse Toasts Messages
  let toast = { hash: request.hash }
  if (request.type === 'send') {
    let balanceChange = bigInt(0)
    for (let trans of request.transactions) {
      if (request.origin === request.mqttDestination) {
        balanceChange = balanceChange.minus(trans.amount)
      }
      if (trans.destination === request.mqttDestination) {
        balanceChange = balanceChange.plus(trans.amount)
      }
      trans.amountInLogos = Logos.convert.fromReason(trans.amount, 'LOGOS')
    }
    request.balanceChange = balanceChange.toString()
    request.balanceChangeInLogos = Logos.convert.fromReason(balanceChange.abs().toString(), 'LOGOS')
    if (balanceChange.greater(bigInt('0'))) {
      toast.message = `${request.mqttDestination} recieved ${request.balanceChangeInLogos} Logos`
    } else {
      toast.message = `${request.mqttDestination} sent ${request.balanceChangeInLogos} Logos`
    }
  }
  if (request.type === 'token_send') {
    let balanceChange = bigInt(0)
    for (let trans of request.transactions) {
      if (request.origin === request.mqttDestination) {
        balanceChange = balanceChange.minus(trans.amount)
      }
      if (trans.destination === request.mqttDestination) {
        balanceChange = balanceChange.plus(trans.amount)
      }
      if (request.tokenInfo.issuerInfo && typeof request.tokenInfo.issuerInfo.decimals !== 'undefined') {
        trans.amountInToken = Logos.convert.fromTo(trans.amount, 0, request.tokenInfo.issuerInfo.decimals)
      }
    }
    request.balanceChange = balanceChange.toString()
    if (request.tokenInfo.issuerInfo && typeof request.tokenInfo.issuerInfo.decimals !== 'undefined') {
      request.balanceChangeInToken = Logos.convert.fromTo(balanceChange.abs().toString(), 0, request.tokenInfo.issuerInfo.decimals)
      if (balanceChange.greater(bigInt('0'))) {
        toast.message = `${request.mqttDestination} recieved ${request.balanceChangeInToken} of ${request.tokenInfo.symbol}`
      } else {
        toast.message = `${request.mqttDestination} sent ${request.balanceChangeInToken} of ${request.tokenInfo.symbol}`
      }
    } else {
      if (balanceChange.greater(bigInt('0'))) {
        toast.message = `${request.mqttDestination} recieved ${balanceChange.toString()} base units of ${request.token_id}`
      } else {
        toast.message = `${request.mqttDestination} sent ${balanceChange.abs().toString()} base units of ${request.token_id}`
      }
    }
  }
  commit('addToast', toast)
}

const actions = {
  update ({ commit }, wallet) {
    commit('setAccounts', wallet._accounts)
    commit('setSeed', wallet._seed)
    commit('setCurrentAccount', wallet.account)
  },
  addRequest ({ commit, rootState, state }, request) {
    let requestData = cloneDeep(request)
    let rpcClient = new Logos({ url: rootState.settings.rpcHost, proxyURL: rootState.settings.proxyURL, debug: true })
    createToast(requestData, rpcClient, commit, state)
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
  addToast (state, toast) {
    state.toasts.push(toast)
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
