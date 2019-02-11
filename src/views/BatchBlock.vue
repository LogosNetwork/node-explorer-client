<template>
  <div id="primary">
    <b-container v-if="batchBlock">
      <b-row class="text-left pt-5">
        <b-col cols="12">
          <h3 class="text-left" v-t="'batch_block'"></h3>
          <code style="background-color:#FFF;color:#ff3860;padding:6px">{{batchBlock.hash}}</code>
          <h4 v-if="error" class="pt-3" style="color:red">This batch block does not exist</h4>
        </b-col>
      </b-row>
      <b-row v-if="!error && batchBlock.previous !== '0000000000000000000000000000000000000000000000000000000000000000'" class="mt-3">
        <b-col cols="12" class="text-left">
            <div>
              <h4>
                Previous Batch Block for Delegate {{batchBlock.delegate}}
              </h4>
              <p class="text-truncate"><router-link :to="'/batchBlock/'+batchBlock.previous">{{batchBlock.previous}}</router-link></p>
            </div>
        </b-col>
      </b-row>
      <b-row v-if="!error && batchBlock.next !== '0000000000000000000000000000000000000000000000000000000000000000'" class="mt-3">
        <b-col cols="12" class="text-left">
            <div>
              <h4>
                Next Batch Block for Delegate {{batchBlock.delegate}}
              </h4>
              <p class="text-truncate"><router-link :to="'/batchBlock/'+batchBlock.next">{{batchBlock.next}}</router-link></p>
            </div>
        </b-col>
      </b-row>
      <b-row v-if="batchBlock.blocks && batchBlock.blocks.length > 0">
        <b-col cols="12" class="mb-3">
          <h4 class="text-left">
            <span>{{batchBlock.block_count}} </span>
            <span v-t="'transactions'"></span>
          </h4>
          <p class="text-left"><span v-t="'batchCreatedOn'"></span> <strong> {{parseInt(batchBlock.timestamp) | moment('ddd, D MMM YYYY h:mm:ssa')}}</strong></p>
          <b-table style="background:#FFF" bordered small fixed :fields="fields" :items="batchBlock.blocks">
            <template slot="from" slot-scope="data">
              <div class="text-truncate"><router-link :to="'/'+data.item.account">{{data.item.account}}</router-link></div>
            </template>
            <template slot="to" slot-scope="data">
              <div v-for="(transaction, index) in data.item.transactions" :key='index+"address"' class="text-truncate">
                <router-link :to="'/'+transaction.target">{{transaction.target}}</router-link>
              </div>
            </template>
            <template slot="amount" slot-scope="data">
              <div v-for="(transaction, index) in data.item.transactions" :key='index+"amount"' class="text-truncate">
                <span>{{transaction.fakeLogosAmount}}</span>
              </div>
            </template>
            <template slot="hash" slot-scope="data">
              <div class="text-truncate"><router-link :to="'/'+data.item.hash">{{data.item.hash}}</router-link></div>
            </template>
          </b-table>
        </b-col>
      </b-row>
    <b-row v-if="!error">
        <b-col cols="12" class="text-left">
          <h4 class="text-left" v-t="'batchJSON'"></h4>
          <codepad id='editor' class="text-left" :code="JSON.stringify(batchBlock, null, ' ')"/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import codepad from '@/components/codepad.vue'
let fields = [
  { key: 'from', label: 'From' },
  { key: 'to', label: 'To' },
  { key: 'amount', label: 'Amount' },
  { key: 'hash', label: 'Hash' }
]
export default {
  components: {
    codepad
  },
  computed: {
    ...mapState('batchBlock', {
      hash: state => state.hash,
      batchBlock: state => state.batchBlock,
      error: state => state.error
    })
  },
  created: function () {
    this.reset()
    this.getBatchBlock(this.$route.params.hash)
  },
  methods: {
    ...mapActions('batchBlock', [
      'getBatchBlock',
      'reset'
    ])
  },
  data () {
    return {
      fields: fields
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.reset()
    this.getBatchBlock(to.params.hash)
    next()
  }
}
</script>

<style scoped lang="scss">
</style>
