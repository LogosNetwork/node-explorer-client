import Vue from 'vue'
import cloneDeep from 'lodash.clonedeep'
import Logos from '@logosnetwork/logos-rpc-client'
import LogosWallet from '@logosnetwork/logos-webwallet-sdk'
import bigInt from 'big-integer'

const state = {
  toasts: [],
  lookups: [],
  tokens: {},
  issuerInfo: '',
  tempInfo: '',
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
  } else if (request.type === 'adjust_user_status') {
    if (request.origin === request.mqttDestination) {
      toast.message = `${request.mqttDestination} set the status of ${request.account} to ${request.status}`
    } else {
      toast.message = `${request.mqttDestination} status was set to ${request.status}`
    }
  } else if (request.type === 'issue_additional') {
    if (request.origin === request.mqttDestination) {
      if (request.amountInToken) {
        toast.message = `${request.mqttDestination} minted an additional ${request.amountInToken} ${request.tokenInfo.symbol}`
      } else {
        toast.message = `${request.mqttDestination} minted an additional ${request.amount} base units of ${request.tokenInfo.symbol}`
      }
    }
  } else if (request.type === 'change_setting') {
    toast.message = `${request.mqttDestination} changed the ${request.setting} setting of ${request.tokenInfo.name} to ${request.value}`
  } else if (request.type === 'immute_setting') {
    toast.message = `${request.mqttDestination} has locked the ${request.setting} setting to ${request.tokenInfo.settings.includes(request.setting)} for ${request.tokenInfo.name}`
  } else if (request.type === 'revoke') {
    if (request.amountInToken) {
      toast.message = `${request.origin} revoked ${request.amountInToken} ${request.tokenInfo.symbol} from ${request.source} to ${request.transaction.destination}`
    } else {
      toast.message = `${request.origin} revoked ${request.transaction.amount} base units of ${request.tokenInfo.symbol} from ${request.source} to ${request.transaction.destination}`
    }
  } else if (request.type === 'adjust_fee') {
    toast.message = `${request.origin} changed the fee of ${request.tokenInfo.name} to ${request.fee_type} with a fee rate of ${request.fee_type === 'percentage' ? `${request.fee_rate}% of the transaction amount` : `${request.fee_rate} base units of ${request.tokenInfo.symbol}`}`
  } else if (request.type === 'burn') {
    if (request.amountInToken) {
      toast.message = `${request.origin} burned ${request.amountInToken} ${request.tokenInfo.symbol}`
    } else {
      toast.message = `${request.origin} burned ${request.amount} base units of ${request.tokenInfo.symbol}`
    }
  } else if (request.type === 'withdraw_fee') {
    if (request.transaction.amountInToken) {
      toast.message = `${request.origin} withdrew ${request.transaction.amountInToken} ${request.tokenInfo.symbol} to ${request.transaction.destination}`
    } else {
      toast.message = `${request.origin} withdrew ${request.amount} base units of ${request.tokenInfo.symbol} to ${request.transaction.destination}`
    }
  } else if (request.type === 'withdraw_logos') {
    toast.message = `${request.origin} withdrew ${request.transaction.amountInLogos} Logos to ${request.transaction.destination}`
  } else if (request.type === 'update_issuer_info') {
    toast.message = `${request.origin} updated the token information of ${request.tokenInfo.name}`
  } else if (request.type === 'update_controller') {
    toast.message = `${request.origin} updated ${request.controller.account} controller privileges for ${request.tokenInfo.name}`
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
  setIssuerInfo ({ commit }, info) {
    commit('setIssuerInfo', info)
  },
  setTempInfo ({ commit }, info) {
    commit('setTempInfo', info)
  },
  addLookup ({ commit }, lookup) {
    commit('addLookup', lookup)
  },
  addRequest ({ commit, rootState, state }, request) {
    let requestData = cloneDeep(request)
    let rpcClient = new Logos({ url: rootState.settings.rpcHost, proxyURL: rootState.settings.proxyURL, debug: true })
    createToast(requestData, rpcClient, commit, state)
  }
}

const mutations = {
  setAccounts (state, accounts) {
    state.accounts = {}
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
  setIssuerInfo (state, info) {
    state.issuerInfo = info
  },
  setTempInfo (state, info) {
    state.tempInfo = info
  },
  addToken (state, tokenAccount) {
    Vue.set(state.tokens, tokenAccount, {
      pending: true,
      tokenAccount: tokenAccount
    })
  },
  addLookup (state, lookup) {
    state.lookups.unshift(lookup)
    state.toasts.push({
      hash: null,
      message: `Queried the RPC for ${lookup.title}`
    })
  },
  addToast (state, toast) {
    state.toasts.push(toast)
  },
  updateToken (state, tokenInfo) {
    Vue.set(state.tokens, tokenInfo.tokenAccount, tokenInfo)
  },
  updateTokenData (state, newTokenData) {
    if (state.tokens[newTokenData.address]) {
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
      tokenInfo.settings = LogosWallet.Utils.convertObjectToArray(newTokenData.settings)
      tokenInfo.token_balance = newTokenData.tokenBalance
      tokenInfo.token_fee_balance = newTokenData.tokenFeeBalance
      tokenInfo.total_supply = newTokenData.totalSupply
      tokenInfo.controllers = LogosWallet.Utils.serializeControllers(newTokenData.controllers)
      Vue.set(state.tokens, tokenInfo.tokenAccount, tokenInfo)
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
