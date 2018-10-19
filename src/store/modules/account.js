import Logos from 'logos-rpc-client'
const rpcClient = new Logos({ url: 'http://18.212.15.104:55000', debug: true })
const state = {
  account: null,
  frontier: null,
  openBlock: null,
  representaive: null,
  error: null,
  balance: 0,
  count: 50,
  transactions: [],
  blockCount: 0,
  lastModified: 0
}

const getters = {

}

const actions = {
  getAccountInfo: ({ state, commit }, account) => {
    account = account.replace('lgs_', 'xrb_')
    commit('setAccount', account)
    rpcClient.accounts.info(account).then(val => {
      if (val) {
        if (!val.error) {
          commit('setFrontier', val.frontier)
          commit('setOpenBlock', val.open_block)
          commit('setBalance', parseFloat(Number(rpcClient.convert.fromReason(val.balance, 'LOGOS')).toFixed(5)))
          commit('setBlockCount', val.block_count)
          commit('setLastModified', parseInt(val.modified_timestamp))
          rpcClient.accounts.toAddress(val.representative_block).then(val => {
            if (val.account) {
              commit('setRepresentative', val.account.replace('xrb_', 'lgs_'))
            }
          })
        } else {
          commit('setError', val.error)
        }
      } else {
        commit('setError', 'null')
      }
    })
    rpcClient.accounts.history(account, state.count).then(val => {
      if (val) {
        if (!val.error) {
          for (let trans of val) {
            trans.amount = parseFloat(Number(rpcClient.convert.fromReason(trans.amount, 'LOGOS')).toFixed(5))
            trans.timestamp = parseInt(trans.timestamp)
            trans.account = trans.account.replace('xrb_', 'lgs_')
          }
          commit('setTransactions', val)
        } else {
          commit('setError', val.error)
        }
      } else {
        commit('setError', 'null')
      }
    })
  }
}

const mutations = {
  setFrontier (state, frontier) {
    state.frontier = frontier
  },
  setOpenBlock (state, openBlock) {
    state.openBlock = openBlock
  },
  setRepresentative (state, rep) {
    state.rep = rep
  },
  setBalance (state, balance) {
    state.balance = balance
  },
  setBlockCount (state, blockCount) {
    state.blockCount = blockCount
  },
  setCount (state, count) {
    state.count = count
  },
  setLastModified (state, lastModified) {
    state.lastModified = lastModified
  },
  setError (state, error) {
    state.error = error
  },
  setTransactions (state, transactions) {
    state.transactions = transactions
  },
  setAccount (state, account) {
    state.account = account.replace('xrb_', 'lgs_')
  },
  addBlock (state, blockData) {
    blockData.message = JSON.parse(blockData.message)
    if (blockData.account.replace('xrb_', 'lgs_') === state.account ||
        blockData.message.link_as_account.replace('xrb_', 'lgs_') === state.account) {
      blockData.message.amount = parseFloat(Number(rpcClient.convert.fromReason(blockData.message.amount, 'LOGOS')).toFixed(5))
      blockData.message.timestamp = parseInt(blockData.message.timestamp)
      blockData.message.account = blockData.message.account.replace('xrb_', 'lgs_')
      state.transactions.unshift(blockData.message)
      state.lastModified = blockData.message.timestamp
      state.blockCount++
      state.frontier = blockData.message.hash
      // TODO HANDLE BALANCE CHANGES
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
