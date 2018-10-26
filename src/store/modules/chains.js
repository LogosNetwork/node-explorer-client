import Logos from '@logosnetwork/logos-rpc-client'
const rpcClient = new Logos({ url: 'http://18.212.15.104:55000', debug: true })
const state = {
  count: 50,
  batchStateBlocks: [],
  microEpochs: [],
  epochs: []
}

const getters = {

}

const actions = {
  getRecentBlocks: ({ state, commit }) => {
    rpcClient.batchStateBlocks.history(50, 0).then(val => {
      if (val) {
        if (!val.error) {
          console.log(val.batch_state_blocks)
          commit('setBatchStateBlocks', val.batch_state_blocks)
        } else {
          commit('setError', val.error)
        }
      } else {
        commit('setError', 'null')
      }
    })
    rpcClient.microEpochs.history(50, 0).then(val => {
      if (val) {
        if (!val.error) {
          console.log(val)
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
          console.log(val)
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
  setBatchStateBlocks (state, batchStateBlocks) {
    state.batchStateBlocks = batchStateBlocks
  },
  setMicroEpochs (state, microEpochs) {
    state.microEpochs = microEpochs
  },
  setEpochs (state, epochs) {
    state.epochs = epochs
  },
  reset (state) {
    state.count = 50
    state.batchStateBlocks = []
    state.microEpochs = []
    state.epochs = []
  },
  addBatchStateBlock (state, data) {
    state.batchStateBlocks.unshift(data.message)
  },
  addMicroEpoch (state, data) {
    state.microEpochs.unshift(data.message)
  },
  addEpoch (state, data) {
    state.Epochs.unshift(data.message)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
