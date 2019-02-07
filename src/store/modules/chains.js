import Logos from '@logosnetwork/logos-rpc-client'
import axios from 'axios'

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
  clearBatchBlocks: ({ commit }) => {
    commit('setBatchBlocks', [])
  },
  loadBatchBlocks: ({ state, commit, rootState }, data) => {
    let index = data.index
    let cb = data.cb
    let rpcClient = new Logos({ url: rootState.settings.rpcHost, proxyURL: rootState.settings.proxyURL, debug: true })
    let savedBatchBlocks = [...state.batchBlocks]
    let status = 'success'
    let lastCreatedAt = null
    if (savedBatchBlocks && savedBatchBlocks.length > 0) {
      lastCreatedAt = savedBatchBlocks[savedBatchBlocks.length - 1].createdAt
    }
    let lastHash
    if (savedBatchBlocks && savedBatchBlocks.length > 0) {
      lastHash = savedBatchBlocks[savedBatchBlocks.length - 1].hash
    } else {
      lastHash = undefined
    }
    if (index !== -1) {
      rpcClient.batchBlocks.history(50, index, lastHash).then(val => {
        if (val) {
          if (!val.error) {
            for (let batchBlock of val.batch_blocks) {
              batchBlock.delegate = index
              if (lastHash) {
                if (batchBlock.hash !== lastHash) commit('pushBatchBlock', batchBlock)
              } else {
                commit('pushBatchBlock', batchBlock)
              }
            }
            if (val.batch_blocks.length <= 1) {
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
      axios.get('/blocks/batchBlocks', {
        params: {
          previousDate: lastCreatedAt
        }
      })
        .then((res) => {
          for (let batchBlock of res.data.data.batchBlock) {
            commit('pushBatchBlock', batchBlock)
          }
          if (res.data.data.batchBlock.length > 0) {
            cb(status)
          } else {
            status = 'out of content'
            cb(status)
          }
        })
        .catch((err) => {
          commit('setError', err)
        })
    }
  },
  loadMicroEpochs: ({ state, commit, rootState }, cb) => {
    let rpcClient = new Logos({ url: rootState.settings.rpcHost, proxyURL: rootState.settings.proxyURL, debug: true })
    let savedMicroEpochs = [...state.microEpochs]
    let status = 'success'
    let lastHash = null
    if (savedMicroEpochs && savedMicroEpochs.length > 0) {
      lastHash = savedMicroEpochs[savedMicroEpochs.length - 1].hash
    } else {
      lastHash = undefined
    }
    rpcClient.microEpochs.history(50, lastHash).then(val => {
      if (val) {
        if (!val.error) {
          for (let microEpoch of val.micro_blocks) {
            if (lastHash) {
              if (microEpoch.hash !== lastHash) { commit('pushMicroEpoch', microEpoch) }
            } else {
              commit('pushMicroEpoch', microEpoch)
            }
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
  },
  loadEpochs: ({ state, commit, rootState }, cb) => {
    let rpcClient = new Logos({ url: rootState.settings.rpcHost, proxyURL: rootState.settings.proxyURL, debug: true })
    let savedEpochs = [...state.epochs]
    let status = 'success'
    let lastHash = null
    if (savedEpochs && savedEpochs.length > 0) {
      lastHash = savedEpochs[savedEpochs.length - 1].hash
    } else {
      lastHash = undefined
    }
    rpcClient.epochs.history(50, lastHash).then(val => {
      if (val) {
        if (!val.error) {
          for (let epoch of val.epochs) {
            if (lastHash) {
              if (epoch.hash !== lastHash) { commit('pushEpoch', epoch) }
            } else {
              commit('pushEpoch', epoch)
            }
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
  pushBatchBlock (state, data) {
    state.batchBlocks.push(data)
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
