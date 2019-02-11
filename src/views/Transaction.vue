<template>
  <div id="primary">
    <b-container>
      <b-row class="text-left pt-5">
        <b-col cols="12" md="8" class="mb-5">
          <h3 class="text-left" v-t="'transaction'"></h3>
          <code style="background-color:#FFF;color:#ff3860;padding:6px">{{transaction}}</code>
        </b-col>
      </b-row>
      <b-row v-if="!error && details !== null" class="mb-5">
        <b-col cols="12" class="text-left">
          <h4 class="text-left" v-t="'from'"></h4>
          <p v-if="details.transaction_type === 'send'"><router-link :to="details.account">{{details.account}}</router-link></p>
          <p v-if="details.transaction_type === 'receive'"><router-link :to="details.link_as_account">{{details.link_as_account}}</router-link></p>
          <h4 class="text-left" v-t="'amount'"></h4>
          <p>{{details.totalAmountInLogos}} Logos</p>
          <h4 class="text-left" v-t="'to'"></h4>
          <p v-if="details.transaction_type === 'receive'"><router-link :to="details.account">{{details.account}}</router-link></p>
          <div v-if="details.transaction_type === 'send'">
            <b-table style="background:#FFF" bordered small fixed :fields="fields" :items="details.transactions">
              <template slot="account" slot-scope="data">
                <div class="text-truncate"><router-link :to="'/'+data.item.target">{{data.item.target}}</router-link></div>
              </template>
              <template slot="amount" slot-scope="data">
                <div class="text-truncate"><span>{{data.item.amountInLogos}}</span></div>
              </template>
            </b-table>
          </div>
          <div v-if="details.previous !== '0000000000000000000000000000000000000000000000000000000000000000' && details.transaction_type === 'send'">
            <h4 class="text-left" v-t="'prevSend'"></h4>
            <p><router-link :to="details.previous">{{details.previous}}</router-link></p>
          </div>
          <div v-if="details.previous !== '0000000000000000000000000000000000000000000000000000000000000000' && details.transaction_type === 'receive'">
            <h4 class="text-left" v-t="'prevReceive'"></h4>
            <p><router-link :to="details.previous">{{details.previous}}</router-link></p>
          </div>
          <div v-if="details.next && details.next !== '0000000000000000000000000000000000000000000000000000000000000000' && details.transaction_type === 'send'">
            <h4 class="text-left" v-t="'nextSend'"></h4>
            <p><router-link :to="details.next">{{details.next}}</router-link></p>
          </div>
          <div v-if="details.next && details.next !== '0000000000000000000000000000000000000000000000000000000000000000' && details.transaction_type === 'receive'">
            <h4 class="text-left" v-t="'nextReceive'"></h4>
            <p><router-link :to="details.next">{{details.next}}</router-link></p>
          </div>
          <div v-if="details.batch_hash">
            <h4 class="text-left">Contained in Batch Block</h4>
            <p><router-link :to="'/batchBlock/'+details.batch_hash">{{details.batch_hash}}</router-link></p>
          </div>
        </b-col>
      </b-row>
      <b-row v-if="!error && details !== null">
        <b-col cols="12" class="text-left">
          <h4 class="text-left" v-t="'prettyTransaction'"></h4>
          <codepad id='editor' class="text-left mb-3" v-if='details' :code='prettyDetails'/>
        </b-col>
      </b-row>
      <b-row v-if="error">
        <b-col cols="12" class="text-left">
          <h4 style="color:red">This transaction does not exist yet.</h4>
          <br>
          <small>If you have just sent this transaction it will appear here when confirmed.</small>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import codepad from '@/components/codepad.vue'
let fields = [
  { key: 'account', label: 'Account' },
  { key: 'amount', label: 'Amount' }
]
export default {
  components: {
    codepad
  },
  computed: {
    ...mapState('settings', {
      mqttHost: state => state.mqttHost
    }),
    ...mapState('transaction', {
      transaction: state => state.transaction,
      details: state => state.details,
      prettyDetails: state => state.prettyDetails,
      error: state => state.error
    })
  },
  methods: {
    ...mapActions('mqtt', [
      'initalize',
      'unsubscribe',
      'subscribe'
    ]),
    ...mapActions('transaction', [
      'getTransactionInfo',
      'reset'
    ])
  },
  created: function () {
    this.getTransactionInfo(this.$route.params.transaction)
    this.initalize({ url: this.mqttHost,
      cb: () => {
        this.subscribe(`transaction/${this.$route.params.transaction}`)
      }
    })
  },
  destroyed: function () {
    this.unsubscribe(`transaction/${this.transaction}`)
  },
  beforeRouteUpdate (to, from, next) {
    this.unsubscribe(`transaction/${this.transaction}`)
    this.reset()
    this.initalize({ url: this.mqttHost,
      cb: () => {
        this.subscribe(`transaction/${to.params.transaction}`)
      }
    })
    this.getTransactionInfo(to.params.transaction)
    next()
  },
  data () {
    return {
      fields: fields
    }
  }
}
</script>

<style scoped lang="scss">
</style>
