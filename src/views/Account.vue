<template>
  <div id="primary">
    <b-container>
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
      <div v-infinite-scroll="getMoreRequests" infinite-scroll-distance="500">
        <b-row v-if="requests && requests.length > 0">
          <b-col cols="12" class="mb-3">
            <h4 class="text-left">
              <span>{{requestCount}} </span>
              <span v-t="'requests'"></span>
              <small v-if='requests.length === count'> (showing last {{count}})</small>
              <small v-if='requests.length > count'> (showing last {{requests.length}})</small>
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
            <div v-for="request in orderedRequests" :key='request.hash'>
              <send v-if="request.type === 'send' && (selected === 'all' || selected ==='lgs')" :requestInfo="request" :account="account"/>
              <burn v-if="request.type === 'burn' && (selected === 'all' || selected === request.tokenInfo.tokenAccount)" :requestInfo="request"/>
              <issuerInfo v-if="request.type === 'update_issuer_info' && (selected === 'all' || selected === request.tokenInfo.tokenAccount)" :requestInfo="request"/>
              <tokenSend v-if="request.type === 'token_send' && (selected === 'all' || selected === request.tokenInfo.tokenAccount)" :requestInfo="request" :account="account"/>
              <distribute v-if="request.type === 'distribute' && (selected === 'all' || selected === request.tokenInfo.tokenAccount)" :requestInfo="request"/>
              <adjustFee v-if="request.type === 'adjust_fee' && (selected === 'all' || selected === request.tokenInfo.tokenAccount)" :requestInfo="request"/>
              <changeSetting v-if="request.type === 'change_setting' && (selected === 'all' || selected === request.tokenInfo.tokenAccount)" :requestInfo="request"/>
              <adjustUserStatus v-if="request.type === 'adjust_user_status' && (selected === 'all' || selected === request.tokenInfo.tokenAccount)" :requestInfo="request"/>
              <issuance v-if="request.type === 'issuance' && (selected === 'all' || selected === request.tokenInfo.tokenAccount)" :requestInfo="request"/>
              <issueAdditional v-if="request.type === 'issue_additional' && (selected === 'all' || selected === request.tokenInfo.tokenAccount)" :requestInfo="request"/>
              <withdrawFee v-if="request.type === 'withdraw_fee' && (selected === 'all' || selected === request.tokenInfo.tokenAccount)" :requestInfo="request"/>
              <updateController v-if="request.type === 'update_controller' && (selected === 'all' || selected === request.tokenInfo.tokenAccount)" :requestInfo="request"/>
              <revoke v-if="request.type === 'revoke' && (selected === 'all' || selected === request.tokenInfo.tokenAccount)" :requestInfo="request"/>
              <immuteSetting v-if="request.type === 'immute_setting' && (selected === 'all' || selected === request.tokenInfo.tokenAccount)" :requestInfo="request"/>
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
import send from '@/components/requests/send.vue'
import burn from '@/components/requests/burn.vue'
import issuerInfo from '@/components/requests/issuerInfo.vue'
import distribute from '@/components/requests/distribute.vue'
import adjustFee from '@/components/requests/adjustFee.vue'
import changeSetting from '@/components/requests/changeSetting.vue'
import adjustUserStatus from '@/components/requests/adjustUserStatus.vue'
import issuance from '@/components/requests/issuance.vue'
import issueAdditional from '@/components/requests/issueAdditional.vue'
import withdrawFee from '@/components/requests/withdrawFee.vue'
import updateController from '@/components/requests/updateController.vue'
import revoke from '@/components/requests/revoke.vue'
import immuteSetting from '@/components/requests/immuteSetting.vue'
import tokenSend from '@/components/requests/tokenSend.vue'
import 'vue-awesome/icons/coins'
import 'vue-awesome/icons/spinner'

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
      rawBalance: state => state.rawBalance,
      requests: state => state.requests,
      requestCount: state => state.requestCount,
      count: state => state.count,
      lastModified: state => state.lastModified,
      tokenBalances: state => state.tokenBalances,
      orderedRequests: state => state.orderedRequests
    })
  },
  components: {
    send,
    burn,
    issuerInfo,
    distribute,
    adjustFee,
    changeSetting,
    adjustUserStatus,
    issuance,
    issueAdditional,
    withdrawFee,
    updateController,
    revoke,
    immuteSetting,
    tokenSend
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
</style>
