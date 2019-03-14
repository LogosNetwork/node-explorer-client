import Logos from '@logosnetwork/logos-rpc-client'
import LogosWallet from '@logosnetwork/logos-webwallet-sdk'
import axios from 'axios'
const state = {
  tokens: [],
  error: null
}

const getters = {

}

const actions = {
  getTokens ({ commit, state, rootState }, cb) {
    let rpcClient = new Logos({ url: rootState.settings.rpcHost, proxyURL: rootState.settings.proxyURL, debug: true })
    let savedTokens = [...state.tokens]
    let lastCreatedAt = null
    if (savedTokens && savedTokens.length > 0) {
      lastCreatedAt = savedTokens[savedTokens.length - 1].createdAt
    }
    axios.get(`${rootState.settings.requestURL}/tokens/`, {
      params: {
        previousDate: lastCreatedAt
      }
    })
      .then((res) => {
        for (let token of res.data.data.tokens) {
          token.tokenAccount = LogosWallet.LogosUtils.accountFromHexKey(token.token_id)
          try {
            token.issuerInfo = JSON.parse(token.issuer_info)
          } catch (e) {
            token.issuerInfo = {}
          }
          if (token.issuerInfo && typeof token.issuerInfo.decimals !== 'undefined') {
            token.totalSupplyInToken = rpcClient.convert.fromTo(token.total_supply, 0, token.issuerInfo.decimals)
          }
          try {
            token.prettyInfo = JSON.stringify(JSON.parse(token.issuer_info), null, ' ')
          } catch (e) {
            token.prettyInfo = token.issuer_info
          }
          commit('addToken', token)
        }
        if (res.data.data.tokens.length > 0) {
          let status = 'success'
          cb(status)
        } else {
          let status = 'out of content'
          cb(status)
        }
      })
      .catch((err) => {
        commit('setError', err)
      })
  },
  reset: ({ commit }) => {
    commit('reset')
  }
}

const mutations = {
  setTokens (state, tokens) {
    state.tokens = tokens
  },
  addToken (state, token) {
    state.tokens.push(token)
  },
  setPrettyDetails (state, prettyDetails) {
    state.prettyDetails = prettyDetails
  },
  setError (state, error) {
    state.error = error
  },
  reset (state) {
    state.tokens = []
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
