<template>
  <div id="primary">
    <b-container class="pt-5">
      <h2 class="text-left d-block" v-t="'blockchains'"></h2>
      <b-tabs v-model="tabIndex">
        <b-tab :title="$t('batch_blocks')" v-infinite-scroll="getBatchBlocks" infinite-scroll-distance="500" active>
          <b-form-select v-model="selectedDelegate" :options="bsbDelegateLabels" class="mt-3" />
          <div name="list" is="transition-group">
            <div :key="batchBlock.hash + '_' + batchBlock.delegate" v-for="batchBlock in orderedBatchBlocks">
              <b-link class="cardLink" :to="'/batchBlock/'+batchBlock.hash">
                <b-card class="mt-3 mb-3 text-left">
                  <b-row>
                    <b-col>
                      <h3>Batch Block</h3>
                    </b-col>
                    <b-col class="text-right">
                      <small>
                        <span> {{parseInt(batchBlock.timestamp) | moment('ddd, D MMM YYYY h:mm:ssa')}}</span>
                      </small>
                    </b-col>
                  </b-row>
                  <b-row class="mb-2">
                    <b-col class="text-truncate">
                      Hash: <b-link :to="'/batchBlock/'+batchBlock.hash">{{batchBlock.hash}}</b-link>
                    </b-col>
                  </b-row>
                  <b-row v-if="batchBlock.previous && batchBlock.previous !== '0000000000000000000000000000000000000000000000000000000000000000'" class="mb-2">
                    <b-col class="text-truncate">
                      Previous: <b-link :to="'/batchBlock/'+batchBlock.previous">{{batchBlock.previous}}</b-link>
                    </b-col>
                  </b-row>
                  <b-row v-if="batchBlock.prevHash && batchBlock.prevHash !== '0000000000000000000000000000000000000000000000000000000000000000'" class="mb-2">
                    <b-col class="text-truncate">
                      Previous: <b-link :to="'/batchBlock/'+batchBlock.prevHash">{{batchBlock.prevHash}}</b-link>
                    </b-col>
                  </b-row>
                  <b-row class="mb-2">
                    <b-col class="text-truncate">
                      Proposed by Delegate {{batchBlock.delegate}}
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col>
                      Contains {{batchBlock.block_count}} Transactions
                    </b-col>
                  </b-row>
                </b-card>
              </b-link>
              <icon v-if="batchBlock.previous !== '0000000000000000000000000000000000000000000000000000000000000000' && selectedDelegate !== -1" scale="2" name="chevron-down"></icon>
            </div>
          </div>
        </b-tab>
        <b-tab :title="$t('micro_epochs')" v-infinite-scroll="getMicroEpochs" infinite-scroll-distance="500">
          <div :key="microEpoch.hash" v-for="microEpoch in microEpochs">
            <b-link class="cardLink" :to="'/microEpoch/'+microEpoch.hash">
              <b-card class="mt-3 mb-3 text-left">
                <b-row>
                  <b-col>
                    <h3 v-if="microEpoch.timestamp !== '0'">Micro Epoch #{{microEpoch.sequence}}</h3>
                    <h3 v-if="microEpoch.timestamp === '0'">Genesis Micro Epoch</h3>
                  </b-col>
                  <b-col class="text-right">
                    <small>
                      <span v-if="microEpoch.timestamp !== '0'"> {{parseInt(microEpoch.timestamp) | moment('ddd, D MMM YYYY h:mm:ssa')}}</span>
                      <span v-if="microEpoch.timestamp === '0'"> Genesis Micro Epoch</span>
                    </small>
                  </b-col>
                </b-row>
                <b-row class="mb-2">
                  <b-col class="text-truncate">
                    Hash: <b-link :to="'/microEpoch/'+microEpoch.hash">{{microEpoch.hash}}</b-link>
                  </b-col>
                </b-row>
                <b-row v-if="microEpoch.previous !== '0000000000000000000000000000000000000000000000000000000000000000'" class="mb-2">
                  <b-col class="text-truncate">
                    Previous: <b-link :to="'/microEpoch/'+microEpoch.previous">{{microEpoch.previous}}</b-link>
                  </b-col>
                </b-row>
                <b-row class="mb-2">
                  <b-col class="text-truncate">
                    Proposed by delegate: <b-link :to="'/delegate/'+microEpoch.delegate">{{microEpoch.delegate}}</b-link>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    Contains {{microEpoch.number_batch_blocks}} Batch Blocks
                  </b-col>
                </b-row>
              </b-card>
            </b-link>
            <icon v-if="microEpoch.previous !== '0000000000000000000000000000000000000000000000000000000000000000'" scale="2" name="chevron-down"></icon>
          </div>
        </b-tab>
        <b-tab :title="$t('epochs')" v-infinite-scroll="getEpochs" infinite-scroll-distance="500">
          <div :key="epoch.hash" v-for="epoch in epochs">
            <b-link class="cardLink" :to="'/epoch/'+epoch.hash">
              <b-card class="mt-3 mb-3 text-left">
                <b-row>
                  <b-col>
                    <h3 v-if="epoch.timestamp !== '0'">Epoch #{{epoch.epoch_number}}</h3>
                    <h3 v-if="epoch.timestamp === '0'">Genesis Epoch</h3>
                  </b-col>
                  <b-col class="text-right">
                    <small>
                      <span v-if="epoch.timestamp !== '0'"> {{parseInt(epoch.timestamp) | moment('ddd, D MMM YYYY h:mm:ssa')}}</span>
                      <span v-if="epoch.timestamp === '0'"> Genesis Epoch</span>
                    </small>
                  </b-col>
                </b-row>
                <b-row class="mb-2">
                  <b-col class="text-truncate">
                    Hash: <b-link :to="'/epoch/'+epoch.hash">{{epoch.hash}}</b-link>
                  </b-col>
                </b-row>
                <b-row v-if="epoch.previous !== '0000000000000000000000000000000000000000000000000000000000000000'" class="mb-2">
                  <b-col class="text-truncate">
                    Previous: <b-link :to="'/epoch/'+epoch.previous">{{epoch.previous}}</b-link>
                  </b-col>
                </b-row>
                <b-row class="mb-2">
                  <b-col class="text-truncate">
                    Proposed by delegate: <b-link :to="'/delegate/'+epoch.delegate">{{epoch.delegate}}</b-link>
                  </b-col>
                </b-row>
              </b-card>
            </b-link>
            <icon v-if="epoch.previous !== '0000000000000000000000000000000000000000000000000000000000000000'" scale="2" name="chevron-down"></icon>
          </div>
        </b-tab>
      </b-tabs>
    </b-container>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import infiniteScroll from 'vue-infinite-scroll'
import Vue from 'vue'
import codepad from '@/components/codepad.vue'
import orderBy from 'lodash/orderBy'
Vue.use(infiniteScroll)
export default {
  name: 'explore',
  components: {
    codepad
  },
  computed: {
    ...mapState('settings', {
      mqttHost: state => state.mqttHost,
      delegates: state => state.delegates
    }),
    ...mapState('chains', {
      batchBlocks: state => state.batchBlocks,
      microEpochs: state => state.microEpochs,
      epochs: state => state.epochs
    }),
    orderedBatchBlocks: function () {
      return orderBy(this.batchBlocks, 'timestamp', 'desc')
    }
  },
  data: function () {
    return {
      batchBlocksBusy: true,
      microEpochsBusy: true,
      epochsBusy: true,
      bsbDelegateLabels: [
        { value: -1, text: 'All Batch Blocks' }
      ],
      tabIndex: 0,
      selectedDelegate: -1
    }
  },
  created: function () {
    this.reset()
    this.initalize({ url: this.mqttHost,
      cb: () => {
        this.subscribe(`batchBlock/#`)
        this.subscribe(`microEpoch`)
        this.subscribe(`epoch`)
      } })
    this.getBatchBlocks(true)
    this.getMicroEpochs(true)
    this.getEpochs(true)
    for (let i = 0; i < Object.keys(this.delegates).length; i++) {
      this.bsbDelegateLabels.push({ value: i, text: `Batch Blocks for delegate ${i}: ${this.delegates[i]}` })
    }
  },
  methods: {
    ...mapActions('mqtt', [
      'initalize',
      'unsubscribe',
      'subscribe'
    ]),
    ...mapActions('chains', [
      'loadMicroEpochs',
      'loadBatchBlocks',
      'loadEpochs',
      'clearBatchBlocks',
      'reset'
    ]),
    getBatchBlocks: function (force = false) {
      if ((!this.batchBlocksBusy && this.tabIndex === 0) || force) {
        this.batchBlocksBusy = true
        this.loadBatchBlocks({
          index: this.selectedDelegate,
          cb: (err) => {
            if (err === 'out of content') {
              this.batchBlocksBusy = true
            } else if (err === 'success') {
              this.batchBlocksBusy = false
            }
          }
        })
      }
    },
    getMicroEpochs: function (force = false) {
      if ((!this.microEpochsBusy && this.tabIndex === 1) || force) {
        this.microEpochsBusy = true
        this.loadMicroEpochs((err) => {
          if (err === 'out of content') {
            this.microEpochsBusy = true
          } else if (err === 'success') {
            this.microEpochsBusy = false
          }
        })
      }
    },
    getEpochs: function (force = false) {
      if ((!this.epochsBusy && this.tabIndex === 2) || force) {
        this.epochsBusy = true
        this.loadEpochs((err) => {
          if (err === 'out of content') {
            this.epochsBusy = true
          } else if (err === 'success') {
            this.epochsBusy = false
          }
        })
      }
    }
  },
  watch: {
    selectedDelegate: function (newDelegate, oldDelegate) {
      if (oldDelegate === -1) {
        this.unsubscribe(`batchBlock/#`)
      } else {
        this.unsubscribe(`batchBlock/${oldDelegate}`)
      }
      if (newDelegate === -1) {
        this.subscribe(`batchBlock/#`)
      } else {
        this.subscribe(`batchBlock/${newDelegate}`)
      }
      this.clearBatchBlocks()
      this.getBatchBlocks(true)
    }
  },
  destroyed: function () {
    this.unsubscribe(`batchBlock/#`)
    this.unsubscribe(`microEpoch`)
    this.unsubscribe(`epoch`)
  }
}
</script>

<style scoped lang="scss">
  .cardLink {
    color:#525f7f;
  }
  .cardLink:hover {
    text-decoration: none;
  }
  .cardLink > .card {
    -webkit-transition: all .3s;
    -o-transition: all .3s;
    transition: all .3s;
  }
  .cardLink:hover > .card {
    box-shadow: 0 10px 30px -5px rgba(10,16,34,.2);
  }
  .list-enter-active > .cardLink > .card {
    animation-name: highlight;
    animation-duration: 2s;
  }
</style>
