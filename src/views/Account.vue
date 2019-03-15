<template>
  <div id="primary">
    <b-container>
      <div v-if="type === 'LogosAccount'">
        <b-row class="text-left pt-5">
          <b-col cols="12" md="8" class="mb-3">
            <h3 class="text-left" v-t="'account'"></h3>
            <code style="background-color:#FFF;color:#ff3860;padding:6px">{{account}}</code>
            <h3 v-if="!error && balance !== null && selected === 'all' || selected === 'lgs'" class="pt-3" style="color:green">{{balance}} LOGOS</h3>
            <h3 v-if="!error && tokenBalances !== null && selected !== 'all' && selected !== 'lgs'" class="pt-3" style="color:green">
              <span v-if="tokenBalances[selected] && tokenBalances[selected].tokenInfo.pending !== true">
                <span v-if="tokenBalances[selected].balanceInTokens">{{tokenBalances[selected].balanceInTokens}} {{tokenBalances[selected].tokenInfo.symbol}}</span>
                <span v-if="!tokenBalances[selected].balanceInTokens">{{tokenBalances[selected].balance}} {{tokenBalances[selected].tokenInfo.symbol}}</span>
              </span>
              <span v-if="!tokenBalances[selected] || tokenBalances[selected].tokenInfo.pending === true">
                <icon name="spinner" :spin="true" /> Loading Token Info
              </span>
            </h3>
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
      </div>
      <div v-else-if="type === 'TokenAccount'" class="mb-5 pt-5 text-left">
        <div class="mb-3">
          <h3 class="mb-3">
            <token :tokenInfo="token" :inactive="true" size="33" />
          </h3>
          <code style="background-color:#FFF;color:#ff3860;padding:6px">{{account}}</code>
        </div>
        <b-row>
          <b-col lg="6" md="12" class="mb-3">
            <b-card no-body>
              <b-list-group flush>
                <b-list-group-item>
                  <b-row class="justify-content-md-center">
                    <div class="col-md-4 mb-1 mb-md-0">
                      <span class="text-nowrap">
                        Total Supply:
                      </span>
                    </div>
                    <div class="col-md-8 font-weight-bold text-left">
                      <span v-if="typeof token.totalSupplyInTokens !== 'undefined'">{{token.totalSupplyInTokens}} {{token.symbol}}</span>
                      <span v-else>{{token.total_supply}} base units of {{token.symbol}}</span>
                    </div>
                  </b-row>
                </b-list-group-item>
                <b-list-group-item>
                  <b-row class="justify-content-md-center">
                    <div class="col-md-4 mb-1 mb-md-0">
                      <span class="text-nowrap">
                        Circulating Supply:
                      </span>
                    </div>
                    <div class="col-md-8 font-weight-bold text-left">
                      <span v-if="typeof token.circulatingSupplyInTokens !== 'undefined'">{{token.circulatingSupplyInTokens}} {{token.symbol}}</span>
                      <span v-else>{{token.circulating_supply}} base units of {{token.symbol}}</span>
                    </div>
                  </b-row>
                </b-list-group-item>
                <b-list-group-item>
                  <b-row class="justify-content-md-center">
                    <div class="col-md-4 mb-1 mb-md-0">
                      <span class="text-nowrap">
                        Logos Balance:
                      </span>
                    </div>
                    <div class="col-md-8 font-weight-bold text-left">
                      <span>{{balance}} Logos</span>
                    </div>
                  </b-row>
                </b-list-group-item>
              </b-list-group>
            </b-card>
          </b-col>
          <b-col lg="6" md="12" class="mb-3">
            <b-card no-body>
              <b-list-group flush>
                <b-list-group-item>
                  <b-row class="justify-content-md-center">
                    <div class="col-md-4 mb-1 mb-md-0">
                      <span class="text-nowrap">
                        Fee Rate:
                      </span>
                    </div>
                    <div class="col-md-8 font-weight-bold text-left">
                      <span v-if="token.fee_type.toLowerCase() === 'flat' && typeof token.feeInTokens !== 'undefined' && parseInt(token.feeInTokens) > 0">
                        {{token.feeInTokens}} {{token.symbol}}
                      </span>
                      <span v-else-if="token.fee_type.toLowerCase() === 'flat'">
                        {{token.fee_rate}} base units of {{token.symbol}}
                      </span>
                      <span v-else-if="token.fee_type.toLowerCase() === 'percentage'">
                        {{token.fee_rate}}% of each token_send
                      </span>
                    </div>
                  </b-row>
                </b-list-group-item>
                <b-list-group-item>
                  <b-row class="justify-content-md-center">
                    <div class="col-md-4 mb-1 mb-md-0">
                      <span class="text-nowrap">
                        Available Fees:
                      </span>
                    </div>
                    <div class="col-md-8 font-weight-bold text-left">
                      <span v-if="typeof token.feeBalanceInTokens !== 'undefined'">{{token.feeBalanceInTokens}} {{token.symbol}}</span>
                      <span v-else>{{token.token_fee_balance}} {{token.symbol}}</span>
                    </div>
                  </b-row>
                </b-list-group-item>
                <b-list-group-item>
                  <b-row class="justify-content-md-center">
                    <div class="col-md-4 mb-1 mb-md-0">
                      <span class="text-nowrap">
                        Settings:
                      </span>
                    </div>
                    <div class="col-md-8 text-left">
                      <span v-for="setting in Object.keys(token.settings)" :key="'set'+setting">
                        <!-- Stack the Icon lock with the setting icon inside the lock body -->
                        <icon v-if="token.settings[setting] && setting === 'issuance'" name="magic" class="mr-2" v-b-tooltip.hover :title="token.name + ' allows controllers to issue more ' + token.symbol"></icon>
                        <icon v-if="token.settings[setting] && setting === 'revoke'" name="mask" class="mr-2" v-b-tooltip.hover :title="token.name + ' allows controllers to revoke '+ token.symbol +' from token holder\'s accounts'"></icon>
                        <icon v-if="token.settings[setting] && setting === 'freeze'" name="snowflake" class="mr-2" v-b-tooltip.hover :title="`${token.name} allows controllers to freeze accounts`"></icon>
                        <icon v-if="token.settings[setting] && setting === 'adjust_fee'" name="coins" class="mr-2" v-b-tooltip.hover :title="`${token.name} allows controllers to adjust the fee of any token holders`"></icon>
                        <icon v-if="token.settings[setting] && setting === 'whitelist'" name="list-alt" class="mr-2" v-b-tooltip.hover :title="`${token.name} requires accounts to be whitelisted prior to using the ${token.symbol} token`"></icon>
                      </span>
                    </div>
                  </b-row>
                </b-list-group-item>
              </b-list-group>
            </b-card>
          </b-col>
        </b-row>
        <div class="mb-3">
          <h4>Token Controllers</h4>
          <b-card no-body>
            <b-card-body>
              <b-card-text v-for="controller in token.controllers" :key="'controller'+controller.account">
                <LogosAddress :address="controller.account" /><br/>
                <ul>
                  <li v-for="privilege in controller.privileges" :key="controller.account+privilege">
                    {{privilege}}
                  </li>
                </ul>
              </b-card-text>
            </b-card-body>
          </b-card>
        </div>
      </div>
      <div v-infinite-scroll="getMoreRequests" infinite-scroll-distance="500">
        <b-row v-if="requests && requests.length > 0">
          <b-col cols="12" class="mb-3">
            <h4 class="text-left">
              <span v-if="type === 'LogosAccount'">{{requestCount}} </span>
              <span v-if="type === 'TokenAccount'">{{requests.length}} </span>
              <span v-t="'requests'"></span>
              <small v-if='requests.length >= count'> (showing last {{requests.length}})</small>
              <small v-if='requests.length < count'> (showing all {{requests.length}})</small>
            </h4>
            <p class="text-left" v-if="lastModified"><span v-t="'lastUpdated'"></span> <strong> {{ lastModified | moment("MMMM DD, YYYY h:mm:ss A") }}</strong></p>
            <b-row class="mb-3 text-left">
              <b-col>
                <div class="btn-group btn-group-toggle" data-toggle="buttons">
                  <label class="btn btn-outline-secondary" v-bind:class="{ active: selected === 'all' }">
                    <input type="radio" name="tokenFilter" id="all" autocomplete="off" :checked="selected === 'all'" v-on:click="changeSelected('all')"> All
                  </label>
                  <label class="btn btn-outline-secondary" v-bind:class="{ active: selected === 'lgs' }">
                    <input type="radio" name="tokenFilter" id="lgs" autocomplete="off" :checked="selected === 'lgs'" v-on:click="changeSelected('lgs')">
                    <img class="avatar mr-1" src="/favicon-32x32.png">
                    <span>Logos</span>
                  </label>
                  <label v-for="tokenBalance in Object.entries(tokenBalances)" :key="tokenBalance[0]" class="btn btn-outline-secondary" v-bind:class="{ active: selected === tokenBalance[0] }">
                    <input type="radio" name="tokenFilter" :id="tokenBalance[0]" autocomplete="off" :checked="selected === tokenBalance[0]" v-on:click="changeSelected(tokenBalance[0])">
                    <span v-if="tokenBalance[1].tokenInfo.pending !== true">
                      <img v-if="tokenBalance[1].tokenInfo.issuerInfo.image" class="avatar mr-1" :src="tokenBalance[1].tokenInfo.issuerInfo.image">
                      <icon v-if="!tokenBalance[1].tokenInfo.issuerInfo.image" class="mr-1" label="Token Image" name="coins"/>
                      <span>{{tokenBalance[1].tokenInfo.symbol}}</span>
                    </span>
                    <span v-if="tokenBalance[1].tokenInfo.pending === true">
                      <icon name="spinner" :spin="true" />
                    </span>
                  </label>
                </div>
              </b-col>
            </b-row>
            <div name="list" is="transition-group">
              <div v-for="request in requests" :key="request.hash">
                <div v-if="(request.type === 'send' || request.type === 'issuance') && (selected === 'all' || selected ==='lgs')">
                  <request :requestInfo="request" :account="account"/>
                </div>
                <div v-if="request.type !== 'send' &&
                  (selected === 'all' || selected === request.tokenInfo.tokenAccount) &&
                  (request.type !== 'issuance' || (request.type === 'issuance' && selected === request.tokenInfo.tokenAccount))">
                  <request :requestInfo="request" :account="account"/>
                </div>
              </div>
            </div>
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
import request from '@/components/requests/request.vue'
import bCardBody from 'bootstrap-vue/es/components/card/card-body'
import bCardTitle from 'bootstrap-vue/es/components/card/card-title'
import bCardText from 'bootstrap-vue/es/components/card/card-text'
import bListGroup from 'bootstrap-vue/es/components/list-group/list-group'
import bListGroupItem from 'bootstrap-vue/es/components/list-group/list-group-item'
import LogosAddress from '@/components/LogosAddress.vue'
import token from '@/components/requests/token.vue'
import 'vue-awesome/icons/coins'
import 'vue-awesome/icons/spinner'
import 'vue-awesome/icons/magic'
import 'vue-awesome/icons/snowflake'
import 'vue-awesome/icons/mask'
import 'vue-awesome/icons/list-alt'
import 'vue-awesome/icons/lock-open'
import 'vue-awesome/icons/lock'

Vue.use(infiniteScroll)
Vue.component(VueQrcode.name, VueQrcode)

export default {
  computed: {
    ...mapState('settings', {
      mqttHost: state => state.mqttHost
    }),
    ...mapState('account', {
      account: state => state.account,
      representaive: state => state.representaive,
      error: state => state.error,
      balance: state => state.balance,
      type: state => state.type,
      tokens: state => state.tokens,
      rawBalance: state => state.rawBalance,
      requests: state => state.requests,
      requestCount: state => state.requestCount,
      count: state => state.count,
      lastModified: state => state.lastModified,
      tokenBalances: state => state.tokenBalances,
      orderedRequests: state => state.orderedRequests
    }),
    token: function () {
      if (this.type === 'TokenAccount') {
        return this.tokens[this.account]
      } else {
        return null
      }
    }
  },
  components: {
    request,
    bCardBody,
    bCardTitle,
    bCardText,
    bListGroup,
    LogosAddress,
    bListGroupItem,
    token
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
      'getRequests',
      'reset'
    ]),
    getMoreRequests: function () {
      if (!this.requestsBusy && this.requests && this.requests.length > 0) {
        this.requestsBusy = true
        this.getRequests((response) => {
          if (response === 'out of content') {
            this.requestsBusy = true
          } else if (response === 'success') {
            this.requestsBusy = false
          }
        })
      }
    },
    changeSelected: function (newSelected) {
      this.selected = newSelected
    }
  },
  destroyed: function () {
    this.unsubscribe(`account/${this.account}`)
  },
  data () {
    return {
      requestsBusy: false,
      selected: 'all'
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.unsubscribe(`account/${this.account}`)
    this.reset()
    this.selected = 'all'
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
  .btn:not(:disabled) {
    cursor: pointer;
  }
  .avatar {
    width: 20px;
    height: 20px;
  }
  @media (min-width: 768px) {
    #qrHolder {
      text-align: right;
    }
  }
  .card-body > .card-text > ul,
  .card-body > ul {
    margin-bottom: 0px;
  }
  .list-enter-active, .list-leave-active {
    transition: opacity .5s;
  }
  .list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
