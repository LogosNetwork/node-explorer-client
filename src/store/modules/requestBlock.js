import Logos from '@logosnetwork/logos-rpc-client'
import LogosWallet from '@logosnetwork/logos-webwallet-sdk'
import bigInt from 'big-integer'

const state = {
  hash: null,
  requestBlock: null,
  prettyDetails: null,
  error: null
}

const getters = {

}

const actions = {
  getRequestBlock: ({ commit, rootState }, hash) => {
    let rpcClient = new Logos({ url: rootState.settings.rpcHost, proxyURL: rootState.settings.proxyURL, debug: true })
    commit('setHash', hash)
    let searchHashes = null
    if (hash.indexOf(',') !== -1) {
      searchHashes = hash.split(',')
    } else {
      searchHashes = [hash]
    }
    rpcClient.requestBlocks.get(searchHashes).then(requestBlock => {
      if (requestBlock) {
        if (!requestBlock.error) {
          if (requestBlock.blocks.length > 0) {
            let prettyDetails = null
            prettyDetails = JSON.stringify(requestBlock.blocks[0], null, ' ')
            commit('setPrettyDetails', prettyDetails)
            for (let request of requestBlock.blocks[0].requests) {
              request.timestamp = requestBlock.blocks[0].timestamp
              if (request.type === 'send' && request.transactions && request.transactions.length > 0) {
                let total = bigInt(0)
                for (let trans of request.transactions) {
                  total = total.plus(trans.amount)
                  trans.amountInLogos = rpcClient.convert.fromReason(trans.amount, 'LOGOS').replace(/\.0+$/, '')
                }
                request.totalAmountLogos = rpcClient.convert.fromReason(total.toString(), 'LOGOS').replace(/\.0+$/, '')
                commit('setRequestBlock', requestBlock.blocks[0])
              } else if (request.type === 'burn' || request.type === 'update_issuer_info' ||
                request.type === 'token_send') {
                let tokenAddress = LogosWallet.LogosUtils.accountFromHexKey(request.token_id)
                rpcClient.accounts.info(tokenAddress).then(data => {
                  data.tokenAccount = tokenAddress
                  try {
                    data.issuerInfo = JSON.parse(data.issuer_info)
                  } catch (e) {
                    data.issuerInfo = {}
                  }
                  request.tokenInfo = data
                  if (request.type === 'burn') {
                    if (data.issuerInfo.decimals !== null) {
                      request.amountInToken = rpcClient.convert.fromTo(request.amount, 0, data.issuerInfo.decimals).replace(/\.0+$/, '')
                    }
                  }
                  if (request.type === 'update_issuer_info') {
                    try {
                      request.prettyInfo = JSON.stringify(JSON.parse(request.new_info), null, ' ')
                    } catch (e) {
                      request.prettyInfo = request.new_info
                    }
                  }
                  if (request.type === 'token_send') {
                    let total = bigInt(0)
                    for (let trans of request.transactions) {
                      total = total.plus(trans.amount)
                      if (data.issuerInfo.decimals !== null) {
                        trans.amountInToken = rpcClient.convert.fromTo(trans.amount, 0, data.issuerInfo.decimals).replace(/\.0+$/, '')
                        console.log(trans.amountInToken)
                      }
                    }
                    request.totalAmount = total
                    if (data.issuerInfo.decimals !== null) {
                      request.totalAmountInToken = rpcClient.convert.fromTo(total, 0, data.issuerInfo.decimals)
                    }
                  }
                  commit('setRequestBlock', requestBlock.blocks[0])
                })
              } else {
                commit('setRequestBlock', requestBlock.blocks[0])
              }
            }
          }
        } else {
          commit('setError', requestBlock.error)
        }
      } else {
        commit('setError', 'null')
      }
    })
  },
  reset: ({ commit }) => {
    commit('reset')
  }
}

const mutations = {
  setRequestBlock (state, requestBlock) {
    state.requestBlock = requestBlock
  },
  setHash (state, hash) {
    state.hash = hash
  },
  reset (state) {
    state.requestBlock = null
  },
  setPrettyDetails (state, prettyDetails) {
    state.prettyDetails = prettyDetails
  },
  setError (state, error) {
    state.error = error
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
