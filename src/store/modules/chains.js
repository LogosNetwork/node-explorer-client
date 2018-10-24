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
    // TODO
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
  addBlock (state, blockData) {

  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
