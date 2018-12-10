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
  getRecentBatchBlocks: ({ commit, rootState }, data) => {
    let index = data.index
    let cb = data.cb
    let rpcClient = new Logos({ url: rootState.settings.rpcHost, proxyURL: rootState.settings.proxyURL, debug: true })
    if (index === -1) {
      let count = 0
      let bbs = []
      for (let i = 0; i < Object.keys(rootState.settings.delegates).length; i++) {
        rpcClient.batchBlocks.history(50, i).then(val => {
          count++
          for (let n of val.batch_blocks) {
            n.delegate = i
          }
          if (val) {
            if (!val.error) {
              bbs = bbs.concat(val.batch_blocks)
              if (count === 32) {
                commit('setBatchBlocks', bbs)
                cb()
              }
            } else {
              commit('setError', val.error)
            }
          } else {
            commit('setError', 'null')
          }
        })
      }
    } else {
      rpcClient.batchBlocks.history(50, index).then(val => {
        for (let n of val.batch_blocks) {
          n.delegate = index
        }
        if (val) {
          if (!val.error) {
            commit('setBatchBlocks', val.batch_blocks)
            cb()
          } else {
            commit('setError', val.error)
          }
        } else {
          commit('setError', 'null')
        }
      })
    }
  },
  getRecentBlocks: ({ commit, rootState }, cb) => {
    let rpcClient = new Logos({ url: rootState.settings.rpcHost, proxyURL: rootState.settings.proxyURL, debug: true })
    let count = 0
    let bbs = []
    for (let i = 0; i < Object.keys(rootState.settings.delegates).length; i++) {
      rpcClient.batchBlocks.history(50, i).then(val => {
        count++
        for (let n of val.batch_blocks) {
          n.delegate = i
        }
        if (val) {
          if (!val.error) {
            bbs = bbs.concat(val.batch_blocks)
            if (count >= 34) {
              commit('setBatchBlocks', bbs)
              cb()
            }
          } else {
            commit('setError', val.error)
          }
        } else {
          commit('setError', 'null')
        }
      })
    }
    rpcClient.microEpochs.history(50).then(val => {
      count++
      if (val) {
        if (!val.error) {
          commit('setMicroEpochs', val.micro_blocks)
          if (count >= 34) {
            commit('setBatchBlocks', bbs)
            cb()
          }
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
          if (count >= 34) {
            commit('setBatchBlocks', bbs)
            cb()
          }
        } else {
          commit('setError', val.error)
        }
      } else {
        commit('setError', 'null')
      }
    })
  },
  loadBatchBlocks: ({ state, commit, rootState }, data) => {
    let index = data.index
    let cb = data.cb
    let rpcClient = new Logos({ url: rootState.settings.rpcHost, proxyURL: rootState.settings.proxyURL, debug: true })
    let savedBatchBlocks = [...state.batchBlocks]
    let status = 'success'
    if (savedBatchBlocks && savedBatchBlocks.length > 0) {
      let lastHash = savedBatchBlocks[savedBatchBlocks.length - 1].hash
      rpcClient.batchBlocks.history(50, index, lastHash).then(val => {
        if (val) {
          if (!val.error) {
            for (let batchBlock of val.batch_blocks) {
              batchBlock.delegate = index
              if (batchBlock.hash !== lastHash) { commit('pushBatchBlock', batchBlock) }
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
      status = 'out of content'
      cb(status)
    }
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
