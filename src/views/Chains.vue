<template>
  <div id="primary">
    <b-container class="pt-5">
      <h2 class="text-left d-block" v-t="'blockchains'"></h2>
      <b-card no-body>
        <b-tabs card>
          <b-tab :title="$t('batch_blocks')" active>
            <b-table style="background:#FFF" bordered small fixed :fields="batchBlockFields" :items="batchBlocks">
              <template slot="time" slot-scope="data">
                <div class="text-truncate" v-if="data.item.timestamp !== '0'">{{ parseInt(data.item.timestamp) | moment("MM/DD/YY h:mm:ssa") }}</div>
                <div class="text-truncate" v-if="data.item.timestamp === '0'">Genesis</div>
              </template>
              <template slot="hash" slot-scope="data">
                <div class="text-truncate">{{data.item.hash}}</div>
              </template>
              <template slot="transactions" slot-scope="data">
                <div class="text-truncate">{{data.item.block_count}}</div>
              </template>
            </b-table>
          </b-tab>
          <b-tab :title="$t('micro_epoch_blocks')">
            <b-table style="background:#FFF" bordered small fixed :fields="microEpochFields" :items="microEpochs">
              <template slot="time" slot-scope="data">
                <div class="text-truncate" v-if="data.item.timestamp !== '0'">{{ parseInt(data.item.timestamp) | moment("MM/DD/YY h:mm:ssa") }}</div>
                <div class="text-truncate" v-if="data.item.timestamp === '0'">Genesis</div>
              </template>
              <template slot="hash" slot-scope="data">
                <div class="text-truncate">{{data.item.hash}}</div>
              </template>
              <template slot="batches" slot-scope="data">
                <div class="text-truncate">{{data.item.number_batch_blocks}}</div>
              </template>
            </b-table>
          </b-tab>
          <b-tab :title="$t('epoch_blocks')">
            <b-table style="background:#FFF" bordered small fixed :fields="epochFields" :items="epochs">
              <template slot="time" slot-scope="data">
                <div class="text-truncate" v-if="data.item.timestamp !== '0'">{{ parseInt(data.item.timestamp) | moment("MM/DD/YY h:mm:ssa") }}</div>
                <div class="text-truncate" v-if="data.item.timestamp === '0'">Genesis</div>
              </template>
              <template slot="hash" slot-scope="data">
                <div class="text-truncate">{{data.item.hash}}</div>
              </template>
              <template slot="height" slot-scope="data">
                <div class="text-truncate">{{data.item.epoch_number}}</div>
              </template>
            </b-table>
          </b-tab>
        </b-tabs>
      </b-card>
    </b-container>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
let batchBlockFields = [
  { key: 'time', label: 'Time' },
  { key: 'hash', label: 'Hash' },
  { key: 'transactions', label: '# Transactions' }
]
let microEpochFields = [
  { key: 'time', label: 'Time' },
  { key: 'hash', label: 'Hash' },
  { key: 'batches', label: '# Batches' }
]
let epochFields = [
  { key: 'time', label: 'Time' },
  { key: 'hash', label: 'Hash' },
  { key: 'height', label: 'Height' }
]
export default {
  name: 'explore',
  components: {},
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
  },
  data () {
    return {
      epochFields,
      microEpochFields,
      batchBlockFields
    }
  }
}
</script>

<style scoped lang="scss">

</style>
