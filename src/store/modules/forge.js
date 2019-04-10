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
  } else if (request.type === 'token_send') {
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
        toast.message = `${request.mqttDestination} recieved ${request.balanceChangeInToken} ${request.tokenInfo.symbol}`
      } else {
        toast.message = `${request.mqttDestination} sent ${request.balanceChangeInToken} ${request.tokenInfo.symbol}`
      }
    } else {
      if (balanceChange.greater(bigInt('0'))) {
        toast.message = `${request.mqttDestination} recieved ${balanceChange.toString()} base units of ${request.token_id}`
      } else {
        toast.message = `${request.mqttDestination} sent ${balanceChange.abs().toString()} base units of ${request.token_id}`
      }
    }
  } else if (request.type === 'issuance') {
    toast.message = `${request.mqttDestination} Issued a new token ${request.name} - (${request.symbol})`
  } else if (request.type === 'distribute') {
    if (request.origin === request.mqttDestination) {
      if (request.tokenInfo.issuerInfo && typeof request.tokenInfo.issuerInfo.decimals !== 'undefined') {
        toast.message = `${request.mqttDestination} distributed ${Logos.convert.fromTo(request.transaction.amount, 0, request.tokenInfo.issuerInfo.decimals)} ${request.tokenInfo.symbol} to ${request.transaction.destination}`
      } else {
        toast.message = `${request.mqttDestination} distributed ${request.transaction.amount} base units of ${request.tokenInfo.symbol} to ${request.transaction.destination}`
      }
    } else {
      if (request.tokenInfo.issuerInfo && typeof request.tokenInfo.issuerInfo.decimals !== 'undefined') {
        toast.message = `${request.transaction.destination} received a token distribution of ${Logos.convert.fromTo(request.transaction.amount, 0, request.tokenInfo.issuerInfo.decimals)} ${request.tokenInfo.symbol}`
      } else {
        toast.message = `${request.transaction.destination} received a token distribution of ${request.transaction.amount} base units of ${request.tokenInfo.symbol}`
      }
    }
  }
  toast.request = request
  commit('addToast', toast)
}

const actions = {
  update ({ commit, rootState, state }, wallet) {
    commit('setAccounts', wallet.accountsObject)
    commit('setSeed', wallet.seed)
    if (wallet.account && wallet.account.synced) {
      commit('setCurrentAccount', wallet.account)
    }
    for (let account in wallet.accountsObject) {
      for (let tokenAccount of wallet.accountsObject[account].tokens) {
        if (!state.tokens[tokenAccount]) {
          commit('addToken', tokenAccount)
          let rpcClient = new Logos({ url: rootState.settings.rpcHost, proxyURL: rootState.settings.proxyURL, debug: true })
          pullTokenInfo(tokenAccount, rpcClient, commit)
        }
      }
    }
    for (let tokenAccount in wallet.tokenAccounts) {
      if (wallet.tokenAccounts[tokenAccount].synced) {
        commit('updateTokenData', wallet.tokenAccounts[tokenAccount])
      }
    }
  },
  setSeed ({ commit }, seed) {
    commit('setSeed', seed)
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
        logosBalance: Logos.convert.fromReason(state.walletAccounts[account].balance, 'LOGOS'),
        tokenBalances: state.walletAccounts[account].tokenBalances
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
  },
  updateTokenData (state, newTokenData) {
    let tokenInfo = cloneDeep(state.tokens[newTokenData.address])
    tokenInfo.balance = newTokenData.balance
    tokenInfo.fee_rate = newTokenData.feeRate
    tokenInfo.fee_type = newTokenData.feeType
    tokenInfo.frontier = newTokenData.previous
    tokenInfo.issuer_info = newTokenData.issuerInfo
    try {
      tokenInfo.issuerInfo = JSON.parse(newTokenData.issuerInfo)
    } catch (e) {
      tokenInfo.issuerInfo = {}
    }
    if (newTokenData.receiveChain.length > 0) {
      tokenInfo.receive_tip = newTokenData.receiveChain[0].hash
    }
    tokenInfo.request_count = newTokenData.requestCount + newTokenData.receiveCount
    tokenInfo.sequence = newTokenData.sequence
    tokenInfo.settings = LogosWallet.Utils.getSettingsJSON(newTokenData.settings)
    tokenInfo.token_balance = newTokenData.tokenBalance
    tokenInfo.token_fee_balance = newTokenData.tokenFeeBalance
    tokenInfo.total_supply = newTokenData.totalSupply
    tokenInfo.controllers = LogosWallet.Utils.getControllerJSON(newTokenData.controllers)
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
