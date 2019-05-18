import Logos from '@logosnetwork/logos-rpc-client'
import LogosWallet from '@logosnetwork/logos-webwallet-sdk'
import bigInt from 'big-integer'

const state = {
  toasts: [],
  lookups: [],
  issuerInfo: '',
  tempInfo: '',
  accounts: [],
  currentAccountAddress: null,
  walletData: null
}

const getters = {
  walletData: state => state.walletData,
  currentAccountAddress: state => state.currentAccountAddress
}

const parseToast = (request, address, vm, commit) => {
  request = JSON.parse(request.toJSON())
  let tokenInfo = null
  let issuerInfo = null
  if (request.token_id) {
    tokenInfo = vm.$wallet.tokenAccounts[LogosWallet.Utils.accountFromHexKey(request.token_id)]
    try {
      issuerInfo = JSON.parse(tokenInfo.issuerInfo)
    } catch (e) {
      issuerInfo = null
    }
  }

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
      if (request.origin === address) {
        balanceChange = balanceChange.minus(trans.amount)
      }
      if (trans.destination === address) {
        balanceChange = balanceChange.plus(trans.amount)
      }
      trans.amountInLogos = Logos.convert.fromReason(trans.amount, 'LOGOS')
    }
    request.balanceChange = balanceChange.toString()
    request.balanceChangeInLogos = Logos.convert.fromReason(balanceChange.abs().toString(), 'LOGOS')
    if (balanceChange.greater(bigInt('0'))) {
      toast.message = `${address} recieved ${request.balanceChangeInLogos} Logos`
    } else {
      toast.message = `${address} sent ${request.balanceChangeInLogos} Logos`
    }
  } else if (request.type === 'token_send') {
    let balanceChange = bigInt(0)
    for (let trans of request.transactions) {
      if (request.origin === address) {
        balanceChange = balanceChange.minus(trans.amount)
      }
      if (trans.destination === address) {
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
        toast.message = `${address} recieved ${request.balanceChangeInToken} ${tokenInfo.symbol}`
      } else {
        toast.message = `${address} sent ${request.balanceChangeInToken} ${tokenInfo.symbol}`
      }
    } else {
      if (balanceChange.greater(bigInt('0'))) {
        toast.message = `${address} recieved ${balanceChange.toString()} base units of ${request.token_id}`
      } else {
        toast.message = `${address} sent ${balanceChange.abs().toString()} base units of ${request.token_id}`
      }
    }
  } else if (request.type === 'issuance') {
    toast.message = `${address} Issued a new token ${request.name} - (${request.symbol})`
  } else if (request.type === 'distribute') {
    if (request.origin === address) {
      if (issuerInfo && typeof issuerInfo.decimals !== 'undefined') {
        toast.message = `${address} distributed ${Logos.convert.fromTo(request.transaction.amount, 0, issuerInfo.decimals)} ${tokenInfo.symbol} to ${request.transaction.destination}`
      } else {
        toast.message = `${address} distributed ${request.transaction.amount} base units of ${tokenInfo.symbol} to ${request.transaction.destination}`
      }
    } else {
      if (issuerInfo && typeof issuerInfo.decimals !== 'undefined') {
        toast.message = `${request.transaction.destination} received a token distribution of ${Logos.convert.fromTo(request.transaction.amount, 0, issuerInfo.decimals)} ${tokenInfo.symbol}`
      } else {
        toast.message = `${request.transaction.destination} received a token distribution of ${request.transaction.amount} base units of ${tokenInfo.symbol}`
      }
    }
  } else if (request.type === 'adjust_user_status') {
    if (request.origin === address) {
      toast.message = `${address} set the status of ${request.account} to ${request.status}`
    } else {
      toast.message = `${request.account} status was set to ${request.status}`
    }
  } else if (request.type === 'issue_additional') {
    if (request.amountInToken) {
      toast.message = `${address} minted an additional ${request.amountInToken} ${tokenInfo.symbol}`
    } else {
      toast.message = `${address} minted an additional ${request.amount} base units of ${tokenInfo.symbol}`
    }
  } else if (request.type === 'change_setting') {
    toast.message = `${address} changed the ${request.setting} setting of ${tokenInfo.name} to ${request.value}`
  } else if (request.type === 'immute_setting') {
    toast.message = `${address} has locked the ${request.setting} setting to ${tokenInfo.settings[request.setting]} for ${tokenInfo.name}`
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
  setCurrentAccountAddress ({ commit }, address) {
    commit('setCurrentAccountAddress', address)
  },
  setAccounts ({ commit }, accounts) {
    commit('setAccounts', accounts)
  },
  addAccount ({ commit }, account) {
    commit('addAccount', account)
  },
  addLookup ({ commit }, lookup) {
    commit('addLookup', lookup)
  },
  createToast ({ commit }, request) {
    parseToast(request.request, request.address, this._vm, commit)
  }
}

const mutations = {
  setAccounts (state, accounts) {
    state.accounts = accounts
  },
  addAccount (state, account) {
    state.accounts.push(account)
  },
  setIssuerInfo (state, info) {
    state.issuerInfo = info
  },
  setTempInfo (state, info) {
    state.tempInfo = info
  },
  setWalletData (state, data) {
    state.walletData = data
  },
  setCurrentAccountAddress (state, address) {
    state.currentAccountAddress = address
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
