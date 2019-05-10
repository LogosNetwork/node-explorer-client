<template>
  <div id="primary">
    <b-container class="pt-5">
      <h2 class="text-left d-block" v-t="'blockchains'"></h2>
      <b-tabs v-model="tabIndex">
        <b-tab :title="$t('request_blocks')" v-infinite-scroll="getRequestBlocks" infinite-scroll-distance="500" active>
          <b-form-select v-model="selectedDelegate" :options="rbDelegateLabels" class="mt-3" />
          <div :key="requestBlock.hash + '_' + requestBlock.delegate" v-for="requestBlock in orderedRequestBlocks">
            <b-link class="cardLink shadow-sm" :to="'/requestBlock/'+requestBlock.hash">
              <b-card class="mt-3 mb-3 text-left">
                <b-row>
                  <b-col>
                    <h3>Request Block</h3>
                  </b-col>
                  <b-col class="text-right">
                    <small>
                      <span> {{parseInt(requestBlock.timestamp) | moment('calendar')}}</span>
                    </small>
                  </b-col>
                </b-row>
                <b-row class="mb-2">
                  <b-col class="text-truncate">
                    Hash: <b-link :to="'/requestBlock/'+requestBlock.hash">{{requestBlock.hash}}</b-link>
                  </b-col>
                </b-row>
                <b-row v-if="requestBlock.previous && requestBlock.previous !== '0000000000000000000000000000000000000000000000000000000000000000'" class="mb-2">
                  <b-col class="text-truncate">
                    Previous: <b-link :to="'/requestBlock/'+requestBlock.previous">{{requestBlock.previous}}</b-link>
                  </b-col>
                </b-row>
                <b-row v-if="requestBlock.prevHash && requestBlock.prevHash !== '0000000000000000000000000000000000000000000000000000000000000000'" class="mb-2">
                  <b-col class="text-truncate">
                    Previous: <b-link :to="'/requestBlock/'+requestBlock.prevHash">{{requestBlock.prevHash}}</b-link>
                  </b-col>
                </b-row>
                <b-row class="mb-2">
                  <b-col class="text-truncate">
                    Proposed by Delegate {{requestBlock.delegate}}
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    Contains {{requestBlock.request_count}} Requests
                  </b-col>
                </b-row>
              </b-card>
            </b-link>
            <font-awesome-icon size="lg" :icon="faChevronDown" v-if="requestBlock.previous !== '0000000000000000000000000000000000000000000000000000000000000000' && selectedDelegate !== -1"/>
          </div>
        </b-tab>
        <b-tab :title="$t('micro_epochs')" v-infinite-scroll="getMicroEpochs" infinite-scroll-distance="500">
          <div :key="microEpoch.hash" v-for="microEpoch in microEpochs">
            <b-link class="cardLink shadow-sm" :to="'/microEpoch/'+microEpoch.hash">
              <b-card class="mt-3 mb-3 text-left">
                <b-row>
                  <b-col>
                    <h3 v-if="microEpoch.timestamp !== '0'">Micro Epoch #{{microEpoch.sequence}}</h3>
                    <h3 v-if="microEpoch.timestamp === '0'">Genesis Micro Epoch</h3>
                  </b-col>
                  <b-col class="text-right">
                    <small>
                      <span v-if="microEpoch.timestamp !== '0'"> {{parseInt(microEpoch.timestamp) | moment('calendar')}}</span>
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
                    Contains {{microEpoch.number_batch_blocks}} Request Blocks
                  </b-col>
                </b-row>
              </b-card>
            </b-link>
            <font-awesome-icon size="lg" :icon="faChevronDown" v-if="microEpoch.previous !== '0000000000000000000000000000000000000000000000000000000000000000'"/>
          </div>
        </b-tab>
        <b-tab :title="$t('epochs')" v-infinite-scroll="getEpochs" infinite-scroll-distance="500">
          <div :key="epoch.hash" v-for="epoch in epochs">
            <b-link class="cardLink shadow-sm" :to="'/epoch/'+epoch.hash">
              <b-card class="mt-3 mb-3 text-left">
                <b-row>
                  <b-col>
                    <h3 v-if="epoch.timestamp !== '0'">Epoch #{{epoch.epoch_number}}</h3>
                    <h3 v-if="epoch.timestamp === '0'">Genesis Epoch</h3>
                  </b-col>
                  <b-col class="text-right">
                    <small>
                      <span v-if="epoch.timestamp !== '0'"> {{parseInt(epoch.timestamp) | moment('calendar')}}</span>
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
            <font-awesome-icon size="lg" :icon="faChevronDown" v-if="epoch.previous !== '0000000000000000000000000000000000000000000000000000000000000000'"/>
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
import orderBy from 'lodash.orderby'
import { faChevronDown } from '@fortawesome/pro-light-svg-icons'
import VueMoment from 'vue-moment'
Vue.use(VueMoment)
Vue.use(infiniteScroll)
export default {
  name: 'explore',
  components: {
    'codepad': () => import(/* webpackChunkName: "Codepad" */ '@/components/codepad.vue'),
    'b-tabs': () => import(/* webpackChunkName: "b-tabs" */'bootstrap-vue/es/components/tabs/tabs'),
    'b-tab': () => import(/* webpackChunkName: "b-tab" */'bootstrap-vue/es/components/tabs/tab'),
    'b-form-select': () => import(/* webpackChunkName: "b-form-select" */'bootstrap-vue/es/components/form-select/form-select')
  },
  computed: {
    ...mapState('settings', {
      mqttHost: state => state.mqttHost,
      delegates: state => state.delegates
    }),
    ...mapState('chains', {
      requestBlocks: state => state.requestBlocks,
      microEpochs: state => state.microEpochs,
      epochs: state => state.epochs
    }),
    orderedRequestBlocks: function () {
      return orderBy(this.requestBlocks, 'timestamp', 'desc')
    }
  },
  data () {
    return {
      faChevronDown,
      requestBlocksBusy: true,
      microEpochsBusy: true,
      epochsBusy: true,
      rbDelegateLabels: [
        { value: -1, text: 'All Request Blocks' }
      ],
      tabIndex: 0,
      selectedDelegate: -1
    }
  },
  created: function () {
    this.reset()
    this.initalize({ url: this.mqttHost,
      cb: () => {
        this.subscribe(`requestBlock/#`)
        this.subscribe(`microEpoch`)
        this.subscribe(`epoch`)
      } })
    this.getRequestBlocks(true)
    this.getMicroEpochs(true)
    this.getEpochs(true)
    if (this.delegates) {
      for (let i = 0; i < Object.keys(this.delegates).length; i++) {
        this.rbDelegateLabels.push({ value: i, text: `Request Blocks for delegate ${i}: ${this.delegates[i]}` })
      }
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
      'loadRequestBlocks',
      'loadEpochs',
      'clearRequestBlocks',
      'reset'
    ]),
    getRequestBlocks: function (force = false) {
      if ((!this.requestBlocksBusy && this.tabIndex === 0) || force) {
        this.requestBlocksBusy = true
        this.loadRequestBlocks({
          index: this.selectedDelegate,
          cb: (err) => {
            if (err === 'out of content') {
              this.requestBlocksBusy = true
            } else if (err === 'success') {
              this.requestBlocksBusy = false
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
        this.unsubscribe(`requestBlock/#`)
      } else {
        this.unsubscribe(`requestBlock/${oldDelegate}`)
      }
      if (newDelegate === -1) {
        this.subscribe(`requestBlock/#`)
      } else {
        this.subscribe(`requestBlock/${newDelegate}`)
      }
      this.clearRequestBlocks()
      this.getRequestBlocks(true)
    }
  },
  destroyed: function () {
    this.unsubscribe(`requestBlock/#`)
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
  .cardLink.shadow-sm {
    display: block
  }
  .cardLink > .card {
    -webkit-transition: all .3s;
    -o-transition: all .3s;
    transition: all .3s;
    border: 0px;
  }
  .cardLink:hover > .card {
    box-shadow: 0 10px 30px -5px rgba(10,16,34,.2);
  }
</style>
