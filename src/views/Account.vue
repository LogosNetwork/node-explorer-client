<template>
  <div id="primary">
    <b-container>
      <b-row class="text-left pt-5">
        <b-col cols="12" md="8" class="mb-3">
          <h4 class="text-left" v-t="'account'"></h4>
          <code style="background-color:#FFF;color:#ff3860;padding:6px">{{account}}</code>
          <h3 v-if="!error && balance" class="pt-3" style="color:green">{{balance}} LOGOS</h3>
          <h4 v-if="error" class="pt-3" style="color:red">This account has not been opened yet</h4>
        </b-col>
        <b-col cols="12" md="4" class="mb-3" id="qrHolder">
            <qrcode :value="'lgs:'+account" :options="{ size: 110 }"></qrcode>
        </b-col>
      </b-row>
      <b-row v-if="!error" class="mb-3">
        <b-col v-if="representaive" cols="12" class="text-left">
            <div>
              <h4>
                Representaive
              </h4>
              <p class="text-truncate"><router-link :to="'/'+representaive">{{representaive}}</router-link></p>
            </div>
        </b-col>
      </b-row>
      <b-row v-if="transactions && transactions.length > 0">
        <b-col cols="12" class="mb-3">
          <h4 class="text-left">
            <span>{{blockCount}} </span>
            <span v-t="'transactions'"></span>
            <small v-if='transactions.length === count'> (showing last {{count}})</small>
            <small v-if='transactions.length < count'> (showing all {{transactions.length}})</small>
          </h4>
          <p class="text-left" v-if="lastModified"><span v-t="'lastUpdated'"></span> <strong> {{ lastModified | moment("MMMM DD, YYYY h:mm:ss A") }}</strong></p>
          <b-table style="background:#FFF" bordered small fixed :fields="fields" :items="transactions">
            <template slot="type" slot-scope="data">
              <div class="text-truncate">{{data.item.type}}</div>
            </template>
            <template slot="timestamp" slot-scope="data">
              <div class="text-truncate" v-if="data.item.timestamp">{{ data.item.timestamp | moment("MM/DD/YY h:mm:ssa") }}</div>
            </template>
            <template slot="account" slot-scope="data">
              <div class="text-truncate"><router-link :to="'/'+data.item.account">{{data.item.account}}</router-link></div>
            </template>
            <template slot="hash" slot-scope="data">
              <div class="text-truncate"><router-link :to="'/'+data.item.hash">{{data.item.hash}}</router-link></div>
            </template>
            <template slot="amount" slot-scope="data">
              <div class="text-truncate" v-if='data.item.type === "receive"'><span class="text-success">+{{data.item.amount}}</span></div>
              <div class="text-truncate" v-if='data.item.type === "send"'><span class="text-danger">-{{data.item.amount}}</span></div>
            </template>
          </b-table>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapState } from 'vuex'
import VueQrcode from '@xkeshi/vue-qrcode'
Vue.component(VueQrcode.name, VueQrcode)
let fields = [
  { key: 'timestamp', label: 'Time' },
  { key: 'account', label: 'Account' },
  { key: 'amount', label: 'Amount' },
  { key: 'hash', label: 'Hash' },
  { key: 'type', label: 'Type' }
]
export default {
  computed: {
    ...mapState('account', {
      account: state => state.account,
      frontier: state => state.frontier,
      openBlock: state => state.openBlock,
      representaive: state => state.representaive,
      error: state => state.error,
      balance: state => state.balance,
      transactions: state => state.transactions,
      blockCount: state => state.blockCount,
      count: state => state.count,
      lastModified: state => state.lastModified
    })
  },
  created: function () {
    this.reset()
    this.initalize({ url: 'mqtt:127.0.0.1:8883/mqtt',
      cb: () => {
        this.subscribe(`account/${this.$route.params.account.replace('xrb_', 'lgs_')}`)
      } })
    this.getAccountInfo(this.$route.params.account)
  },
  methods: {
    ...mapActions('mqtt', [
      'initalize',
      'unsubscribe',
      'subscribe'
    ]),
    ...mapActions('account', [
      'getAccountInfo',
      'reset'
    ])
  },
  destroyed: function () {
    this.unsubscribe(`account/${this.account}`)
  },
  data () {
    return {
      fields: fields
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.unsubscribe(`account/${this.account}`)
    this.reset()
    this.initalize({ url: 'mqtt:127.0.0.1:8883/mqtt',
      cb: () => {
        this.subscribe(`account/${to.params.account.replace('xrb_', 'lgs_')}`)
      } })
    this.getAccountInfo(to.params.account)
    next()
  }
}
</script>

<style scoped lang="scss">
  #qrHolder {
    text-align: center;
  }
  @media (min-width: 768px) {
    #qrHolder {
      text-align: right;
    }
  }
</style>
