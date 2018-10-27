import Logos from '@logosnetwork/logos-rpc-client'
const rpcClient = new Logos({ url: 'http://18.212.15.104:55000', debug: true })
const state = {
  count: 50,
  batchBlocks: [],
  microEpochs: [],
  epochs: [],
  error: null
}

const getters = {

}

const actions = {
  getRecentBlocks: ({ state, commit }) => {
    rpcClient.batchBlocks.history(50, 0).then(val => {
      if (val) {
        if (!val.error) {
          commit('setBatchBlocks', val.batch_blocks)
        } else {
          commit('setError', val.error)
        }
      } else {
        commit('setError', 'null')
      }
    })
    rpcClient.microEpochs.history(null, 0).then(val => {
      if (val) {
        if (!val.error) {
          commit('setMicroEpochs', val.micro_blocks)
        } else {
          commit('setError', val.error)
        }
      } else {
        commit('setError', 'null')
      }
    })
    rpcClient.epochs.history(50, 0).then(val => {
      if (val) {
        if (!val.error) {
          commit('setEpochs', val.epochs)
        } else {
          commit('setError', val.error)
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
  setBatchBlocks (state, batchBlocks) {
    state.batchBlocks = batchBlocks
  },
  setMicroEpochs (state, microEpochs) {
    state.microEpochs = microEpochs
  },
  setEpochs (state, epochs) {
    state.epochs = epochs
  },
  reset (state) {
    state.count = 50
    state.batchBlocks = []
    state.microEpochs = []
    state.epochs = []
  },
  addBatchBlock (state, data) {
    state.batchBlocks.unshift(data.message)
  },
  addMicroEpoch (state, data) {
    state.microEpochs.unshift(data.message)
  },
  addEpoch (state, data) {
    state.Epochs.unshift(data.message)
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
