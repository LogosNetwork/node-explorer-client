import Logos from '@logosnetwork/logos-rpc-client'
const rpcClient = new Logos({ url: 'http://34.230.59.175:55000', debug: true })
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
  getRecentBlocks: ({ commit }) => {
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
    rpcClient.microEpochs.history(50).then(val => {
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
    rpcClient.epochs.history(50).then(val => {
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
  loadMicroEpochs: ({ state, commit }, cb) => {
    let savedMicroEpochs = [...state.microEpochs]
    if (savedMicroEpochs && savedMicroEpochs.length > 0) {
      let lastHash = savedMicroEpochs[savedMicroEpochs.length - 1].hash
      console.log(`Pulling next 50 microEpochs starting from ${lastHash}`)
      rpcClient.microEpochs.history(50, lastHash).then(val => {
        if (val) {
          if (!val.error) {
            for (let microEpoch of val.micro_blocks) {
              commit('pushMicroEpoch', microEpoch)
            }
            cb()
          } else {
            commit('setError', val.error)
          }
        } else {
          commit('setError', 'null')
        }
      })
    } else {
      cb()
    }
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
    state.batchBlocks.unshift(data)
  },
  addMicroEpoch (state, data) {
    state.microEpochs.unshift(data)
  },
  pushMicroEpoch (state, data) {
    state.microEpochs.push(data)
  },
  addEpoch (state, data) {
    state.epochs.unshift(data)
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
