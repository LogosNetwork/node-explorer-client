<template>
  <div id="primary">
    <b-container class="pt-5">
      <h5 class="text-left d-block d-sm-none" v-t="'explore_cta'"></h5>
      <h2 class="d-none d-sm-block" v-t="'explore_cta'"></h2>
      <b-form id="addressForm" class="mb-3">
        <label class="sr-only" for="address" v-t="'searchPlaceholder'"></label>
        <b-input @keydown.native="submitSearch" id="address" type="text" :state="searchState" aria-describedby="inputLiveFeedback" :placeholder="$t('searchPlaceholder')" v-model="address" />
        <b-form-invalid-feedback id="inputLiveFeedback">
          Enter a Logos address or a transactions hash.
        </b-form-invalid-feedback>
      </b-form>
      <b-row class="text-left">
        <b-col cols="12" md="4" class="mb-3">
          <h5>Latest Batch Block</h5>
          <b-link v-if="batchBlock" class="cardLink" :to="'/batchBlock/'+batchBlock.hash">
            <b-card>
              <b-row>
                <b-col class="text-truncate">
                  <b-link :to="'/batchBlock/'+batchBlock.hash">{{batchBlock.hash}}</b-link>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <span> {{parseInt(batchBlock.timestamp) | moment('ddd, D MMM YYYY h:mm:ssa')}}</span>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  Contains {{batchBlock.block_count}} Transactions
                </b-col>
              </b-row>
            </b-card>
          </b-link>
        </b-col>
        <b-col cols="12" md="4" class="mb-3">
          <h5>Current Micro Epoch</h5>
           <b-link v-if="microEpoch" class="cardLink" :to="'/microEpoch/'+microEpoch.hash">
              <b-card>
                <b-row>
                  <b-col class="text-truncate">
                    <b-link :to="'/microEpoch/'+microEpoch.hash" v-if="microEpoch.timestamp !== '0'">Micro Epoch #{{microEpoch.micro_block_number}}</b-link>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <span v-if="microEpoch.timestamp !== '0'"> {{parseInt(microEpoch.timestamp) | moment('ddd, D MMM YYYY h:mma')}}</span>
                    <span v-if="microEpoch.timestamp === '0'"> Genesis Micro Epoch</span>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    Contains {{microEpoch.number_batch_blocks}} Batch Blocks
                  </b-col>
                </b-row>
              </b-card>
            </b-link>
        </b-col>
        <b-col cols="12" md="4" class="mb-3">
          <h5>Current Epoch</h5>
          <b-link v-if="epoch" class="cardLink" :to="'/epoch/'+epoch.hash">
              <b-card>
                <b-row>
                  <b-col class="text-truncate">
                    <b-link :to="'/epoch/'+epoch.hash">Epoch #{{epoch.epoch_number}}</b-link>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <span v-if="epoch.timestamp !== '0'"> {{parseInt(epoch.timestamp) | moment('ddd, D MMM YYYY h:mma')}}</span>
                    <span v-if="epoch.timestamp === '0'"> Genesis Epoch</span>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    Fee Reward: {{epoch.transaction_fee_pool}}
                  </b-col>
                </b-row>
              </b-card>
            </b-link>
        </b-col>
      </b-row>
      <b-row class="text-left">
        <b-col cols="12" class="mb-5">
          <h5 class="text-left" v-t="'recent_transactions'"></h5>
          <b-table style="background:#FFF" bordered small fixed :fields="fields" :items="transactions">
            <template slot="timestamp" slot-scope="data">
              <div class="text-truncate" v-if="data.item.timestamp">{{ data.item.timestamp | moment("MM/DD/YY h:mm:ssa") }}</div>
            </template>
            <template slot="account" slot-scope="data">
              <div class="text-truncate"><router-link :to="'/'+data.item.account">{{data.item.account}}</router-link></div>
            </template>
            <template slot="link_as_account" slot-scope="data">
              <div class="text-truncate"><router-link :to="'/'+data.item.link_as_account">{{data.item.link_as_account}}</router-link></div>
            </template>
            <template slot="amount" slot-scope="data">
              <div class="text-truncate"><span class="text-success">+{{data.item.amount}}</span></div>
            </template>
            <template slot="hash" slot-scope="data">
              <div class="text-truncate"><router-link :to="'/'+data.item.hash">{{data.item.hash}}</router-link></div>
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
  { key: 'timestamp', label: 'Time' },
  { key: 'account', label: 'From' },
  { key: 'link_as_account', label: 'To' },
  { key: 'amount', label: 'Amount' },
  { key: 'hash', label: 'Hash' }
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
      transactions: state => state.transactions,
      microEpoch: state => state.microEpoch,
      batchBlock: state => state.batchBlock,
      epoch: state => state.epoch
    })
  },
  created: function () {
    this.initalize({ url: `mqtt:18.235.68.120:8883/mqtt`,
      cb: () => {
        this.subscribe(`#`)
      } })
    this.getRecentTransactions()
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
    this.unsubscribe(`#`)
  }
}
</script>

<style scoped lang="scss">
  .cardLink {
    color:#525f7f;
  }
  .cardLink:hover {
    text-decoration: none;
  }
  .cardLink > .card {
    -webkit-transition: all .3s;
    -o-transition: all .3s;
    transition: all .3s;
  }
  .cardLink:hover > .card {
    box-shadow: 0 10px 30px -5px rgba(10,16,34,.2);
  }
</style>
