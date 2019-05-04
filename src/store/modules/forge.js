import cloneDeep from 'lodash.clonedeep'
import Logos from '@logosnetwork/logos-rpc-client'
import LogosWallet from '@logosnetwork/logos-webwallet-sdk'
import bigInt from 'big-integer'

const state = {
  toasts: [],
  lookups: [],
  issuerInfo: '',
  tempInfo: '',
  walletData: null
}

const getters = {
  walletData: state => state.walletData
}

const createToast = (request, commit) => {
  console.log('creating toast')
  let tokenAccount = LogosWallet.Utils.accountFromHexKey(request.token_id)
  let tokenInfo = this._vm.$wallet.tokenAccounts[tokenAccount]
  let issuerInfo = null
  try {
    issuerInfo = JSON.parse(tokenInfo.issuerInfo)
  } catch (e) {
    issuerInfo = null
  }
  console.log(request)
  console.log(tokenAccount)
  console.log(issuerInfo)
  if (request.type === 'burn' || request.type === 'issue_additional') {
    if (issuerInfo && typeof issuerInfo.decimals !== 'undefined') {
      request.amountInToken = Logos.convert.fromTo(request.amount, 0, issuerInfo.decimals)
    }
  }
  if (request.type === 'distribute' || request.type === 'withdraw_fee' || request.type === 'revoke') {
    if (issuerInfo && typeof issuerInfo.decimals !== 'undefined') {
      request.transaction.amountInToken = Logos.convert.fromTo(request.transaction.amount, 0, issuerInfo.decimals)
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
      if (issuerInfo && typeof issuerInfo.decimals !== 'undefined') {
        trans.amountInToken = Logos.convert.fromTo(trans.amount, 0, issuerInfo.decimals)
      }
    }
    request.balanceChange = balanceChange.toString()
    if (issuerInfo && typeof issuerInfo.decimals !== 'undefined') {
      request.balanceChangeInToken = Logos.convert.fromTo(balanceChange.abs().toString(), 0, issuerInfo.decimals)
      if (balanceChange.greater(bigInt('0'))) {
        toast.message = `${request.mqttDestination} recieved ${request.balanceChangeInToken} ${tokenInfo.symbol}`
      } else {
        toast.message = `${request.mqttDestination} sent ${request.balanceChangeInToken} ${tokenInfo.symbol}`
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
      if (issuerInfo && typeof issuerInfo.decimals !== 'undefined') {
        toast.message = `${request.mqttDestination} distributed ${Logos.convert.fromTo(request.transaction.amount, 0, issuerInfo.decimals)} ${tokenInfo.symbol} to ${request.transaction.destination}`
      } else {
        toast.message = `${request.mqttDestination} distributed ${request.transaction.amount} base units of ${tokenInfo.symbol} to ${request.transaction.destination}`
      }
    } else {
      if (issuerInfo && typeof issuerInfo.decimals !== 'undefined') {
        toast.message = `${request.transaction.destination} received a token distribution of ${Logos.convert.fromTo(request.transaction.amount, 0, issuerInfo.decimals)} ${tokenInfo.symbol}`
      } else {
        toast.message = `${request.transaction.destination} received a token distribution of ${request.transaction.amount} base units of ${tokenInfo.symbol}`
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
        toast.message = `${request.mqttDestination} minted an additional ${request.amountInToken} ${tokenInfo.symbol}`
      } else {
        toast.message = `${request.mqttDestination} minted an additional ${request.amount} base units of ${tokenInfo.symbol}`
      }
    }
  } else if (request.type === 'change_setting') {
    toast.message = `${request.mqttDestination} changed the ${request.setting} setting of ${tokenInfo.name} to ${request.value}`
  } else if (request.type === 'immute_setting') {
    toast.message = `${request.mqttDestination} has locked the ${request.setting} setting to ${tokenInfo.settings.includes(request.setting)} for ${tokenInfo.name}`
  } else if (request.type === 'revoke') {
    if (request.amountInToken) {
      toast.message = `${request.origin} revoked ${request.amountInToken} ${tokenInfo.symbol} from ${request.source} to ${request.transaction.destination}`
    } else {
      toast.message = `${request.origin} revoked ${request.transaction.amount} base units of ${tokenInfo.symbol} from ${request.source} to ${request.transaction.destination}`
    }
  } else if (request.type === 'adjust_fee') {
    toast.message = `${request.origin} changed the fee of ${tokenInfo.name} to ${request.fee_type} with a fee rate of ${request.fee_type === 'percentage' ? `${request.fee_rate}% of the transaction amount` : `${request.fee_rate} base units of ${tokenInfo.symbol}`}`
  } else if (request.type === 'burn') {
    if (request.amountInToken) {
      toast.message = `${request.origin} burned ${request.amountInToken} ${tokenInfo.symbol}`
    } else {
      toast.message = `${request.origin} burned ${request.amount} base units of ${tokenInfo.symbol}`
    }
  } else if (request.type === 'withdraw_fee') {
    if (request.transaction.amountInToken) {
      toast.message = `${request.origin} withdrew ${request.transaction.amountInToken} ${tokenInfo.symbol} to ${request.transaction.destination}`
    } else {
      toast.message = `${request.origin} withdrew ${request.amount} base units of ${tokenInfo.symbol} to ${request.transaction.destination}`
    }
  } else if (request.type === 'withdraw_logos') {
    toast.message = `${request.origin} withdrew ${request.transaction.amountInLogos} Logos to ${request.transaction.destination}`
  } else if (request.type === 'update_issuer_info') {
    toast.message = `${request.origin} updated the token information of ${tokenInfo.name}`
  } else if (request.type === 'update_controller') {
    toast.message = `${request.origin} updated ${request.controller.account} controller privileges for ${tokenInfo.name}`
  }
  toast.request = request
  commit('addToast', toast)
}

const actions = {
  setIssuerInfo ({ commit }, info) {
    commit('setIssuerInfo', info)
  },
  setTempInfo ({ commit }, info) {
    commit('setTempInfo', info)
  },
  setWalletData ({ commit }, data) {
    commit('setWalletData', data)
  },
  addLookup ({ commit }, lookup) {
    commit('addLookup', lookup)
  },
  addRequest ({ commit, rootState, state }, request) {
    let requestData = cloneDeep(request)
    let rpcClient = new Logos({ url: rootState.settings.rpcHost, proxyURL: rootState.settings.proxyURL, debug: false })
    createToast(requestData, rpcClient, commit, state)
  }
}

const mutations = {
  setIssuerInfo (state, info) {
    state.issuerInfo = info
  },
  setTempInfo (state, info) {
    state.tempInfo = info
  },
  setWalletData (state, data) {
    state.walletData = data
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
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
