<template>
  <div id="primary">
    <b-container class="pt-5">
      <h2 class="text-left d-block" v-t="'blockchains'"></h2>
      <b-card no-body>
        <b-tabs card>
          <b-tab :title="$t('batch_state_blocks')" active>
            <b-table style="background:#FFF" bordered small fixed :fields="batchStateBlockFields" :items="batchStateBlocks">
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
let batchStateBlockFields = [
  { key: 'time', label: 'Time' },
  { key: 'hash', label: 'Hash' },
  { key: 'transactions', label: '# Transactions' }
]
let fakeBatchStateBlocks = [
  {
    'time': 1539999610676,
    'hash': 'B785D56473DE6330AC9A2071F19BD44BCAF1DE5C200A826B4BBCC85E588620FB',
    'transactions': '1'
  },
  {
    'time': 1539999910676,
    'hash': 'B785D56473DE6330AC9A2071F19BD44BCAF1DE5C200A826B4BBCC85E588620FB',
    'transactions': '3'
  },
  {
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
