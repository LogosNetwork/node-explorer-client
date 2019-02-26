<template>
  <div id="primary">
    <b-container v-if="requestBlock">
      <b-row class="text-left pt-5">
        <b-col cols="12">
          <h3 class="text-left" v-t="'request_block'"></h3>
          <code style="background-color:#FFF;color:#ff3860;padding:6px">{{requestBlock.hash}}</code>
          <h4 v-if="error" class="pt-3" style="color:red">This request block does not exist</h4>
        </b-col>
      </b-row>
      <b-row v-if="!error && requestBlock.previous !== '0000000000000000000000000000000000000000000000000000000000000000'" class="mt-3">
        <b-col cols="12" class="text-left">
            <div>
              <h4>
                Previous Request Block for Delegate {{requestBlock.delegate}}
              </h4>
              <p class="text-truncate"><router-link :to="'/requestBlock/'+requestBlock.previous">{{requestBlock.previous}}</router-link></p>
            </div>
        </b-col>
      </b-row>
      <b-row v-if="!error && requestBlock.next !== '0000000000000000000000000000000000000000000000000000000000000000'" class="mt-3">
        <b-col cols="12" class="text-left">
            <div>
              <h4>
                Next Request Block for Delegate {{requestBlock.delegate}}
              </h4>
              <p class="text-truncate"><router-link :to="'/requestBlock/'+requestBlock.next">{{requestBlock.next}}</router-link></p>
            </div>
        </b-col>
      </b-row>
      <b-row v-if="requestBlock.requests && requestBlock.requests.length > 0">
        <b-col cols="12" class="mb-3">
          <h4 class="text-left">
            <span>{{requestBlock.request_count}} </span>
            <span v-t="'requests'"></span>
          </h4>
          <p class="text-left"><span v-t="'requestBlockCreatedOn'"></span> <strong> {{parseInt(requestBlock.timestamp) | moment('ddd, D MMM YYYY h:mm:ssa')}}</strong></p>
          <b-table style="background:#FFF" bordered small fixed :fields="fields" :items="requestBlock.requests">
            <template slot="from" slot-scope="data">
              <div class="text-truncate"><router-link :to="'/'+data.item.origin">{{data.item.origin}}</router-link></div>
            </template>
            <template slot="to" slot-scope="data">
              <div v-for="(transaction, index) in data.item.transactions" :key='index+"address"' class="text-truncate">
                <router-link :to="'/'+transaction.destination">{{transaction.destination}}</router-link>
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
          <h4 class="text-left" v-t="'requestBlockJSON'"></h4>
          <codepad id='editor' class="text-left" :code="JSON.stringify(requestBlock, null, ' ')"/>
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
    ...mapState('requestBlock', {
      hash: state => state.hash,
      requestBlock: state => state.requestBlock,
      error: state => state.error
    })
  },
  created: function () {
    this.reset()
    this.getRequestBlock(this.$route.params.hash)
  },
  methods: {
    ...mapActions('requestBlock', [
      'getRequestBlock',
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
    this.getRequestBlock(to.params.hash)
    next()
  }
}
</script>

<style scoped lang="scss">
</style>
