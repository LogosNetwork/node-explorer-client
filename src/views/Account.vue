<template>
  <div id="primary">
    <b-container>
      <b-row class="text-left pt-5">
        <b-col cols="12" md="8" class="mb-3">
          <h3 class="text-left" v-t="'account'"></h3>
          <code style="background-color:#FFF;color:#ff3860;padding:6px">{{account}}</code>
          <h3 v-if="!error && balance !== null" class="pt-3" style="color:green">{{balance}} LOGOS</h3>
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
      <div v-infinite-scroll="getMoreTransactions" infinite-scroll-distance="500">
        <b-row v-if="transactions && transactions.length > 0">
          <b-col cols="12" class="mb-3">
            <h4 class="text-left">
              <span>{{blockCount}} </span>
              <span v-t="'transactions'"></span>
              <small v-if='transactions.length === count'> (showing last {{count}})</small>
              <small v-if='transactions.length > count'> (showing last {{transactions.length}})</small>
              <small v-if='transactions.length < count'> (showing all {{transactions.length}})</small>
            </h4>
            <p class="text-left" v-if="lastModified"><span v-t="'lastUpdated'"></span> <strong> {{ lastModified | moment("MMMM DD, YYYY h:mm:ss A") }}</strong></p>
            <b-table style="background:#FFF" bordered small fixed :fields="fields" :items="transactions">
              <template slot="timestamp" slot-scope="data">
                <div class="text-truncate" v-if="data.item.timestamp">{{ data.item.timestamp | moment("MM/DD/YY h:mm:ssa") }}</div>
              </template>
              <template slot="account" slot-scope="data">
                <div v-if="data.item.account === account">
                  <div v-for="(trans, index) in data.item.transactions" :key='index+"address"' class="text-truncate">
                    <div class="text-truncate"><router-link :to="'/'+trans.target">{{trans.target}}</router-link></div>
                  </div>
                </div>
                <div v-if="data.item.account !== account">
                  <div v-for="(trans, index) in data.item.transactions" :key='index+"address"' class="text-truncate">
                    <div v-if="trans.target === account" class="text-truncate"><router-link :to="'/'+data.item.account">{{data.item.account}}</router-link></div>
                  </div>
                </div>
              </template>
              <template slot="amount" slot-scope="data">
                <div v-for="(trans, index) in data.item.transactions" :key='index+"amount"' class="text-truncate">
                  <span class="text-success" v-if='trans.target === account'>+{{trans.amountInLogos}}</span>
                  <span class="text-danger" v-if='data.item.account === account && trans.target !== account'>-{{trans.amountInLogos}}</span>
                </div>
              </template>
              <template slot="hash" slot-scope="data">
                <div class="text-truncate"><router-link :to="'/'+data.item.hash">{{data.item.hash}}</router-link></div>
              </template>
            </b-table>
          </b-col>
        </b-row>
      </div>
    </b-container>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapState } from 'vuex'
import VueQrcode from '@xkeshi/vue-qrcode'
import infiniteScroll from 'vue-infinite-scroll'
Vue.use(infiniteScroll)
Vue.component(VueQrcode.name, VueQrcode)
let fields = [
  { key: 'timestamp', label: 'Time' },
  { key: 'account', label: 'Account' },
  { key: 'amount', label: 'Amount' },
  { key: 'hash', label: 'Hash' }
]
export default {
  computed: {
    ...mapState('settings', {
      mqttHost: state => state.mqttHost
    }),
    ...mapState('account', {
      account: state => state.account,
      frontier: state => state.frontier,
      openBlock: state => state.openBlock,
      representaive: state => state.representaive,
      error: state => state.error,
      balance: state => state.balance,
      rawBalance: state => state.rawBalance,
      transactions: state => state.transactions,
      blockCount: state => state.blockCount,
      count: state => state.count,
      lastModified: state => state.lastModified
    })

  },
  created: function () {
    this.reset()
    this.initalize({ url: this.mqttHost,
      cb: () => {
        this.subscribe(`account/${this.$route.params.account}`)
      }
    })
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
      'getTransactions',
      'reset'
    ]),
    getMoreTransactions: function () {
      if (!this.txBusy && this.transactions && this.transactions.length > 0) {
        this.txBusy = true
        this.getTransactions((response) => {
          if (response === 'out of content') {
            this.txBusy = true
          } else if (response === 'success') {
            this.txBusy = false
          }
        })
      }
    }
  },
  destroyed: function () {
    this.unsubscribe(`account/${this.account}`)
  },
  data () {
    return {
      fields: fields,
      txBusy: false
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.unsubscribe(`account/${this.account}`)
    this.reset()
    this.initalize({ url: this.mqttHost,
      cb: () => {
        this.subscribe(`account/${to.params.account}`)
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
