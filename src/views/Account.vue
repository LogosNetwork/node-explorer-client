<template>
  <div id="primary">
    <b-container>
      <b-row class="text-left pt-5">
        <b-col cols="12" md="8" class="mb-3">
          <h4 class="text-left" v-t="'account'"></h4>
          <code style="background-color:#FFF;color:#ff3860;padding:6px">{{account}}</code>
          <h3 v-if="!error" class="pt-3" style="color:green">{{balance}} LOGOS</h3>
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
              <p class="text-truncate"><a :href="'/'+representaive">{{representaive}}</a></p>
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
              <div class="text-truncate"><a :href="'/'+data.item.account">{{data.item.account}}</a></div>
            </template>
            <template slot="hash" slot-scope="data">
              <div class="text-truncate"><a :href="'/'+data.item.hash">{{data.item.hash}}</a></div>
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
import Logos from '../api/rpc'
import Mqtt from '../api/mqtt'
import VueQrcode from '@xkeshi/vue-qrcode'
Vue.use(Logos, { url: 'https://18.212.15.104:55000', debug: true })
Vue.use(Mqtt)
Vue.component(VueQrcode.name, VueQrcode)
let frontier = null
let openBlock = null
let representaive = null
let balance = 0
let count = 50
let transactions = null
let fields = [
  { key: 'timestamp', label: 'Time' },
  { key: 'account', label: 'Account' },
  { key: 'amount', label: 'Amount' },
  { key: 'hash', label: 'Hash' },
  { key: 'type', label: 'Type' }
]
let account = null
let error = null
let client = null
let blockCount = 0
let lastModified = 0
export default {
  name: 'account',
  components: {},
  created: function () {
    this.client = this.$Mqtt.connect('mqtt:127.0.0.1:8883/mqtt')
    this.client.on('connect', () => {
      console.log('connected')
    })
    this.client.subscribe(`broadcast/${account.replace('xrb_', 'lgs_')}`, (err) => {
      if (!err) {
        console.log(`subscribed to broadcast/${account.replace('xrb_', 'lgs_')}`)
      } else {
        console.log(err)
      }
    })
    this.client.on('message', function (topic, message) {
      console.log(message.toString())
    })
    this.$Logos.accounts.info(account.replace('lgs_', 'xrb_')).then(val => {
      if (!val.error) {
        this.frontier = val.frontier
        this.openBlock = val.open_block
        this.$Logos.accounts.toAddress(val.representative_block).then(val => {
          if (val.account) {
            this.representaive = val.account.replace('xrb_', 'lgs_')
          }
        })
        this.balance = parseFloat(Number(this.$Logos.convert.fromReason(val.balance, 'LOGOS')).toFixed(5))
        this.blockCount = val.block_count
        this.lastModified = parseInt(val.modified_timestamp)
      } else {
        this.error = val.error
      }
    })
    this.$Logos.accounts.history(account.replace('lgs_', 'xrb_'), this.count).then(val => {
      if (!val.error) {
        for (let trans of val) {
          trans.amount = parseFloat(Number(this.$Logos.convert.fromReason(trans.amount, 'LOGOS')).toFixed(5))
          trans.timestamp = parseInt(trans.timestamp)
          trans.account = trans.account.replace('xrb_', 'lgs_')
        }
        this.transactions = val
      } else {
        this.error = val.error
      }
    })
  },
  destroyed: function () {
    this.client.end()
  },
  data () {
    account = this.$route.params.account.replace('xrb_', 'lgs_')
    return {
      frontier: frontier,
      error: error,
      openBlock: openBlock,
      representaive: representaive,
      balance: balance,
      transactions: transactions,
      fields: fields,
      count: count,
      blockCount: blockCount,
      lastModified: lastModified,
      client: client,
      account: account
    }
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
