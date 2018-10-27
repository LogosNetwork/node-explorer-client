<template>
  <div id="primary">
    <b-container class="pt-5">
      <h2 class="text-left d-block" v-t="'blockchains'"></h2>
      <b-tabs>
        <b-tab :title="$t('batch_blocks')" active>
          <div :key="batchBlock.hash" v-for="batchBlock in batchBlocks">
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
                <b-row v-if="batchBlock.previous !== '0000000000000000000000000000000000000000000000000000000000000000'" class="mb-2">
                  <b-col class="text-truncate">
                    Previous: <b-link :to="'/batchBlock/'+batchBlock.previous">{{batchBlock.previous}}</b-link>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    Contains {{batchBlock.block_count}} Transactions
                  </b-col>
                </b-row>
              </b-card>
            </b-link>
            <icon v-if="batchBlock.previous !== '0000000000000000000000000000000000000000000000000000000000000000'" scale="2" name="chevron-down"></icon>
          </div>
        </b-tab>
        <b-tab :title="$t('micro_epochs')">
          <div :key="microEpoch.hash" v-for="microEpoch in microEpochs">
            <b-link class="cardLink" :to="'/microEpoch/'+microEpoch.hash">
              <b-card class="mt-3 mb-3 text-left">
                <b-row>
                  <b-col>
                    <h3 v-if="microEpoch.timestamp !== '0'">Micro Epoch #{{microEpoch.micro_block_number}}</h3>
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
        <b-tab :title="$t('epochs')">
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
                    Proposed by delegate: <b-link :to="'/delegate/'+epoch.account">{{epoch.account}}</b-link>
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
import codepad from '@/components/codepad.vue'
export default {
  name: 'explore',
  components: {
    codepad
  },
  computed: {
    ...mapState('chains', {
      batchBlocks: state => state.batchBlocks,
      microEpochs: state => state.microEpochs,
      epochs: state => state.epochs
    })
  },
  created: function () {
    this.reset()
    this.initalize({ url: `mqtt:${window.location.hostname}:8883/mqtt`,
      cb: () => {
        this.subscribe(`batchBlocks/+`)
        this.subscribe(`microEpochs/+`)
        this.subscribe(`epochs/+`)
      } })
    this.getRecentBlocks()
  },
  methods: {
    ...mapActions('mqtt', [
      'initalize',
      'unsubscribe',
      'subscribe'
    ]),
    ...mapActions('chains', [
      'getRecentBlocks',
      'reset'
    ])
  },
  destroyed: function () {
    this.unsubscribe(`batchBlocks/+`)
    this.unsubscribe(`microEpochs/+`)
    this.unsubscribe(`epochs/+`)
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
</style>
