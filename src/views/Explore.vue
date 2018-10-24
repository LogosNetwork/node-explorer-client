<template>
  <div id="primary">
    <b-container class="pt-5">
      <h5 class="text-left d-block d-sm-none" v-t="'explore_cta'"></h5>
      <h2 class="d-none d-sm-block" v-t="'explore_cta'"></h2>
      <b-form id="addressForm" class="mb-2">
        <label class="sr-only" for="address" v-t="'searchPlaceholder'"></label>
        <b-input @keydown.native="submitSearch" id="address" type="text" :state="searchState" aria-describedby="inputLiveFeedback" :placeholder="$t('searchPlaceholder')" v-model="address" />
        <b-form-invalid-feedback id="inputLiveFeedback">
          Enter a Logos address or a transactions hash.
        </b-form-invalid-feedback>
      </b-form>
      <b-row class="text-left pt-5">
        <b-col cols="12" class="mb-5">
          <h5 class="text-left" v-t="'recent_transactions'"></h5>
          <b-table style="background:#FFF" bordered small fixed :fields="fields" :items="transactions">
            <template slot="account" slot-scope="data">
              <div class="text-truncate"><router-link :to="'/'+data.item.account">{{data.item.account}}</router-link></div>
            </template>
            <template slot="hash" slot-scope="data">
              <div class="text-truncate"><router-link :to="'/'+data.item.hash">{{data.item.hash}}</router-link></div>
            </template>
            <template slot="amount" slot-scope="data">
              <div class="text-truncate"><span class="text-success">+{{data.item.amount}}</span></div>
            </template>
          </b-table>
        </b-col>
        <b-col v-if="false" cols="12" md="6" class="mb-5">
          <h5 class="text-left" v-t="'network_stats.title'"></h5>
          <b-row>
            <b-col cols="6">
              <div class="text-center">
                <small class="heading text-uppercase" v-t="'network_stats.tx-sec-1m'"></small>
                <p class="title text-dark font-weight-bold">4.33</p>
              </div>
            </b-col>
            <b-col cols="6">
              <div class="text-center">
                <small class="heading text-uppercase" v-t="'network_stats.tx-sec-30m'"></small>
                <p class="title text-dark font-weight-bold">2.34</p>
              </div>
            </b-col>
            <b-col cols="6">
              <div class="text-center">
                <small class="heading text-uppercase" v-t="'network_stats.market-cap'"></small>
                <p class="title text-dark font-weight-bold">$640M</p>
              </div>
            </b-col>
            <b-col cols="6">
              <div class="text-center">
                <small class="heading text-uppercase" v-t="'network_stats.change24hr'"></small>
                <p class="title font-weight-bold text-success">4.33%</p>
              </div>
            </b-col>
            <b-col cols="6">
              <div class="text-center">
                <small class="heading text-uppercase" v-t="'network_stats.change7d'"></small>
                <p class="title font-weight-bold text-success">1.16%</p>
              </div>
            </b-col>
            <b-col cols="6">
              <div class="text-center">
                <small class="heading text-uppercase" v-t="'network_stats.price-local'"></small>
                <p class="title text-dark font-weight-bold">$3.22</p>
              </div>
            </b-col>
            <b-col cols="6">
              <div class="text-center">
                <small class="heading text-uppercase" v-t="'network_stats.price-satoshi'"></small>
                <p class="title text-dark font-weight-bold">50.19K</p>
              </div>
            </b-col>
            <b-col cols="6">
              <div class="text-center">
                <small class="heading text-uppercase" v-t="'network_stats.volume24h'"></small>
                <p class="title text-dark font-weight-bold">$20.34M</p>
              </div>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
let fields = [
  { key: 'account', label: 'Account' },
  { key: 'hash', label: 'Hash' },
  { key: 'amount', label: 'Amount' }
]
export default {
  name: 'explore',
  components: {},
  computed: {
    searchState () {
      if (this.address.length === 0) {
        return null
      } else {
        return this.address.match(/xrb_[13456789abcdefghijkmnopqrstuwxyz]{60}|lgs_[13456789abcdefghijkmnopqrstuwxyz]{60}/) !== null || this.address.match(/[0-9a-fA-F]{64}/) !== null
      }
    },
    ...mapState('explorer', {
      error: state => state.error,
      transactions: state => state.transactions
    })
  },
  created: function () {
    this.initalize({ url: 'mqtt:127.0.0.1:8883/mqtt',
      cb: () => {
        this.subscribe(`account/+`)
      } })
    // this.getRecentTransactions()
  },
  data () {
    return {
      address: '',
      fields: fields
    }
  },
  methods: {
    submitSearch (event) {
      if (event.which === 13) {
        event.preventDefault()
        if (this.address.match(/xrb_[13456789abcdefghijkmnopqrstuwxyz]{60}|lgs_[13456789abcdefghijkmnopqrstuwxyz]{60}/) !== null || this.address.match(/[0-9a-fA-F]{64}/) !== null) {
          window.location.href = '/' + this.address
        }
      }
    },
    ...mapActions('mqtt', [
      'initalize',
      'unsubscribe',
      'subscribe'
    ]),
    ...mapActions('explorer', [
      'getRecentTransactions'
    ])
  },
  destroyed: function () {
    this.unsubscribe(`account/+`)
  }
}
</script>

<style scoped lang="scss">

</style>
