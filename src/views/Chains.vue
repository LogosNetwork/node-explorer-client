<template>
  <div id="primary">
    <b-container class="pt-5">
      <h2 class="text-left d-block" v-t="'blockchains'"></h2>
      <b-card no-body>
        <b-tabs card>
          <b-tab :title="$t('batch_state_blocks')" active>
            <b-table style="background:#FFF" bordered small fixed :fields="batchStateBlockFields" :items="batchStateBlocks">
              <template slot="delegate" slot-scope="data">
                <div class="text-truncate" v-if="data.item.delegate">{{ data.item.delegate }}</div>
              </template>
              <template slot="time" slot-scope="data">
                <div class="text-truncate" v-if="data.item.time">{{ data.item.time | moment("MM/DD/YY h:mm:ssa") }}</div>
              </template>
              <template slot="hash" slot-scope="data">
                <div class="text-truncate">{{data.item.hash}}</div>
              </template>
              <template slot="transactions" slot-scope="data">
                <div class="text-truncate">{{data.item.transactions}}</div>
              </template>
            </b-table>
          </b-tab>
          <b-tab :title="$t('micro_epoch_blocks')">
            <b-table style="background:#FFF" bordered small fixed :fields="microEpochFields" :items="microEpochs">
              <template slot="time" slot-scope="data">
                <div class="text-truncate" v-if="data.item.time">{{ data.item.time | moment("MM/DD/YY h:mm:ssa") }}</div>
              </template>
              <template slot="hash" slot-scope="data">
                <div class="text-truncate">{{data.item.hash}}</div>
              </template>
              <template slot="batches" slot-scope="data">
                <div class="text-truncate">{{data.item.batches}}</div>
              </template>
            </b-table>
          </b-tab>
          <b-tab :title="$t('epoch_blocks')">
            <b-table style="background:#FFF" bordered small fixed :fields="epochFields" :items="epochBlocks">
              <template slot="time" slot-scope="data">
                <div class="text-truncate" v-if="data.item.time">{{ data.item.time | moment("MM/DD/YY h:mm:ssa") }}</div>
              </template>
              <template slot="height" slot-scope="data">
                <div class="text-truncate">{{data.item.height}}</div>
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
let batchStateBlockFields = [
  { key: 'delegate', label: 'Delegate' },
  { key: 'time', label: 'Time' },
  { key: 'hash', label: 'Hash' },
  { key: 'transactions', label: '# Transactions' }
]
let fakeBatchStateBlocks = [
  {
    'delegate': 'lgs_3e3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpiij4txtdo',
    'time': 1539999610676,
    'hash': 'B785D56473DE6330AC9A2071F19BD44BCAF1DE5C200A826B4BBCC85E588620FB',
    'transactions': '1'
  },
  {
    'delegate': 'lgs_3e3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpiij4txtdo',
    'time': 1539999910676,
    'hash': 'B785D56473DE6330AC9A2071F19BD44BCAF1DE5C200A826B4BBCC85E588620FB',
    'transactions': '3'
  },
  {
    'delegate': 'lgs_3e3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpiij4txtdo',
    'time': 1540029610676,
    'hash': 'B785D56473DE6330AC9A2071F19BD44BCAF1DE5C200A826B4BBCC85E588620FB',
    'transactions': '10'
  }
]
let fakeMicroEpochBlocks = [
  {
    'time': 1539999610676,
    'hash': 'B785D56473DE6330AC9A2071F19BD44BCAF1DE5C200A826B4BBCC85E588620FB',
    'batches': '12'
  },
  {
    'time': 1539999910676,
    'hash': 'B785D56473DE6330AC9A2071F19BD44BCAF1DE5C200A826B4BBCC85E588620FB',
    'batches': '400'
  },
  {
    'time': 1540029610676,
    'hash': 'B785D56473DE6330AC9A2071F19BD44BCAF1DE5C200A826B4BBCC85E588620FB',
    'batches': '1000'
  }
]
let fakeEpochBlocks = [
  {
    'time': 1539999610676,
    'height': '3'
  },
  {
    'time': 1539999910676,
    'height': '2'
  },
  {
    'time': 1540029610676,
    'height': '1'
  }
]

let microEpochFields = [
  { key: 'time', label: 'Time' },
  { key: 'hash', label: 'Hash' },
  { key: 'batches', label: '# Batches' }
]
let epochFields = [
  { key: 'time', label: 'Time' },
  { key: 'height', label: 'Height' }
]
export default {
  name: 'explore',
  components: {},
  computed: {
    ...mapState('chains', {
      batchStateBlocks: state => state.batchStateBlocks,
      microEpochs: state => state.microEpochs,
      epochs: state => state.epochs
    })
  },
  created: function () {
    this.reset()
    this.initalize({ url: `mqtt:${window.location.hostname}:8883/mqtt`,
      cb: () => {
        this.subscribe(`batchStateBlocks/+`)
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
    this.unsubscribe(`batchStateBlocks/+`)
    this.unsubscribe(`microEpochs/+`)
    this.unsubscribe(`epochs/+`)
  },
  data () {
    return {
      epochFields,
      microEpochFields,
      batchStateBlockFields,
      batchStateBlocks: fakeBatchStateBlocks,
      microEpochs: fakeMicroEpochBlocks,
      epochBlocks: fakeEpochBlocks
    }
  }
}
</script>

<style scoped lang="scss">

</style>
