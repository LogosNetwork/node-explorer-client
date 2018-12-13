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
            <b-card v-highlight="batchBlock.hash">
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
              <b-card v-highlight="microEpoch.hash">
                <b-row>
                  <b-col class="text-truncate">
                    <b-link :to="'/microEpoch/'+microEpoch.hash" v-if="microEpoch.timestamp !== '0'">Micro Epoch #{{microEpoch.sequence}}</b-link>
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
              <b-card v-highlight="epoch.hash">
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
          <table class="table b-table table-bordered table-sm b-table-fixed" style="background:#FFF">
            <thead>
              <tr>
                <th aria-colindex="1">Time</th>
                <th aria-colindex="2">From</th>
                <th aria-colindex="3">To</th>
                <th aria-colindex="4">Amount</th>
                <th aria-colindex="5">Hash</th>
              </tr>
            </thead>
            <tbody name="list" is="transition-group">
              <tr v-for="transaction in transactions" :key="transaction.hash">
                <td aria-colindex="1">
                  <div class="text-truncate" v-if="transaction.timestamp">{{ transaction.timestamp | moment("MM/DD/YY h:mm:ssa") }}</div>
                </td>
                <td aria-colindex="2">
                  <div class="text-truncate"><router-link :to="'/'+transaction.account">{{transaction.account}}</router-link></div>
                </td>
                <td aria-colindex="3">
                  <div class="text-truncate"><router-link :to="'/'+transaction.link_as_account">{{transaction.link_as_account}}</router-link></div>
                </td>
                <td aria-colindex="4">
                  <div class="text-truncate"><span class="text-success">+{{transaction.amount}}</span></div>
                </td>
                <td aria-colindex="5">
                  <div class="text-truncate"><router-link :to="'/'+transaction.hash">{{transaction.hash}}</router-link></div>
                </td>
              </tr>
            </tbody>
          </table>
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
import Vue from 'vue'
let fields = [
  { key: 'timestamp', label: 'Time' },
  { key: 'account', label: 'From' },
  { key: 'link_as_account', label: 'To' },
  { key: 'amount', label: 'Amount' },
  { key: 'hash', label: 'Hash' }
]
const hlCache = new Map()
Vue.directive('highlight', {
  bind (el, { value }) {
    hlCache.set(el, value)
  },
  componentUpdated (el, { value }) {
    if (hlCache.get(el) !== value) {
      hlCache.set(el, value)
      el.classList.remove('highlight')
      el.classList.add('highlight')

      setTimeout(() => {
        el.classList.remove('highlight')
      }, 2000)
    }
  },
  unbind (el) {
    hlCache.remove(el)
  }
})
export default {
  name: 'explore',
  components: {},
  computed: {
    searchState () {
      if (this.address.length === 0) {
        return null
      } else {
        return (
          this.address.match(/^lgs_[13456789abcdefghijkmnopqrstuwxyz]{60}$/) !==
            null || this.address.match(/^[0-9a-fA-F]{64}$/) !== null
        )
      }
    },
    ...mapState('settings', {
      mqttHost: state => state.mqttHost
    }),
    ...mapState('explorer', {
      error: state => state.error,
      transactions: state => state.transactions,
      microEpoch: state => state.microEpoch,
      batchBlock: state => state.batchBlock,
      epoch: state => state.epoch
    })
  },
  created: function () {
    this.initalize({
      url: this.mqttHost,
      cb: () => {
        this.subscribe(`#`)
      }
    })
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
        if (
          this.address.match(/^lgs_[13456789abcdefghijkmnopqrstuwxyz]{60}$/) !==
          null
        ) {
          this.$router.push({
            name: 'account',
            params: { account: this.address }
          })
        } else {
          if (this.address.match(/^[0-9a-fA-F]{64}$/) !== null) {
            this.getBlockType({
              hash: this.address,
              cb: blockType => {
                if (blockType === 'transaction') {
                  this.$router.push({
                    name: 'transaction',
                    params: { transaction: this.address }
                  })
                } else if (blockType === 'batchBlock') {
                  this.$router.push({
                    name: 'batchBlock',
                    params: { hash: this.address }
                  })
                } else if (blockType === 'epoch') {
                  this.$router.push({
                    name: 'epoch',
                    params: { hash: this.address }
                  })
                } else if (blockType === 'microEpoch') {
                  this.$router.push({
                    name: 'microEpoch',
                    params: { hash: this.address }
                  })
                } else {
                  alert('Invalid Block 404')
                }
              }
            })
          }
        }
      }
    },
    ...mapActions('mqtt', ['initalize', 'unsubscribe', 'subscribe']),
    ...mapActions('explorer', ['getRecentTransactions', 'getBlockType'])
  },
  destroyed: function () {
    this.unsubscribe(`#`)
  }
}
</script>

<style scoped lang="scss">
.cardLink {
  color: #525f7f;
}
.cardLink:hover {
  text-decoration: none;
}
.cardLink > .card {
  -webkit-transition: all 0.3s;
  -o-transition: all 0.3s;
  transition: all 0.3s;
}
.cardLink:hover > .card {
  box-shadow: 0 10px 30px -5px rgba(10, 16, 34, 0.2);
}
@keyframes highlight {
  0% {
    background-color: #fff;
  }
  50% {
    background-color: #fff3cd;
  }
  100% {
    background-color: #fff;
  }
}
.highlight {
  animation-name: highlight;
  animation-duration: 2s;
}
.list-enter-active {
  transition: all 2s;
}
.list-enter {
  background: #fff3cd;
}
</style>
