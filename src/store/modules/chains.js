import Logos from '@logosnetwork/logos-rpc-client'

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
  getRecentBlocks: ({ commit, rootState }, cb) => {
    let rpcClient = new Logos({ url: rootState.settings.rpcHost, proxyURL: rootState.settings.proxyURL, debug: true })
    let count = 0
    rpcClient.batchBlocks.history(50, 0).then(val => {
      count++
      if (val) {
        if (!val.error) {
          commit('setBatchBlocks', val.batch_blocks)
          if (count === 3) cb()
        } else {
          commit('setError', val.error)
        }
      } else {
        commit('setError', 'null')
      }
    })
    rpcClient.microEpochs.history(50).then(val => {
      count++
      if (val) {
        if (!val.error) {
          commit('setMicroEpochs', val.micro_blocks)
          if (count === 3) cb()
        } else {
          commit('setError', val.error)
        }
      } else {
        commit('setError', 'null')
      }
    })
    rpcClient.epochs.history(50).then(val => {
      count++
      if (val) {
        if (!val.error) {
          commit('setEpochs', val.epochs)
          if (count === 3) cb()
        } else {
          commit('setError', val.error)
        }
      } else {
        commit('setError', 'null')
      }
    })
  },
  loadMicroEpochs: ({ state, commit, rootState }, cb) => {
    let rpcClient = new Logos({ url: rootState.settings.rpcHost, proxyURL: rootState.settings.proxyURL, debug: true })
    let savedMicroEpochs = [...state.microEpochs]
    let status = 'success'
    if (savedMicroEpochs && savedMicroEpochs.length > 0) {
      let lastHash = savedMicroEpochs[savedMicroEpochs.length - 1].hash
      rpcClient.microEpochs.history(50, lastHash).then(val => {
        if (val) {
          if (!val.error) {
            for (let microEpoch of val.micro_blocks) {
              if (microEpoch.hash !== lastHash) { commit('pushMicroEpoch', microEpoch) }
            }
            if (val.micro_blocks.length <= 1) {
              status = 'out of content'
              cb(status)
            } else {
              cb(status)
            }
          } else {
            commit('setError', val.error)
          }
        } else {
          commit('setError', 'null')
        }
      })
    } else {
      status = 'out of content'
      cb(status)
    }
  },
  loadEpochs: ({ state, commit, rootState }, cb) => {
    let rpcClient = new Logos({ url: rootState.settings.rpcHost, proxyURL: rootState.settings.proxyURL, debug: true })
    let savedEpochs = [...state.epochs]
    let status = 'success'
    if (savedEpochs && savedEpochs.length > 0) {
      let lastHash = savedEpochs[savedEpochs.length - 1].hash
      rpcClient.epochs.history(50, lastHash).then(val => {
        if (val) {
          if (!val.error) {
            for (let epoch of val.epochs) {
              if (epoch.hash !== lastHash) { commit('pushEpoch', epoch) }
            }
            if (val.epochs.length <= 1) {
              status = 'out of content'
              cb(status)
            } else {
              cb(status)
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
      status = 'out of content'
      cb(status)
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
  pushEpoch (state, data) {
    state.epochs.push(data)
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
