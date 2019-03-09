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
            <div v-for="request in orderedRequests" :key='request.hash'>
              <send v-if="request.type === 'send'" :requestInfo="request" :account="account"/>
              <burn v-if="request.type === 'burn'" :requestInfo="request"/>
              <issuerInfo v-if="request.type === 'update_issuer_info'" :requestInfo="request"/>
              <tokenSend v-if="request.type === 'token_send'" :requestInfo="request"/>
              <distribute v-if="request.type === 'distribute'" :requestInfo="request"/>
              <adjustFee v-if="request.type === 'adjust_fee'" :requestInfo="request"/>
              <changeSetting v-if="request.type === 'change_setting'" :requestInfo="request"/>
              <adjustUserStatus v-if="request.type === 'adjust_user_status'" :requestInfo="request"/>
              <issuance v-if="request.type === 'issuance'" :requestInfo="request"/>
              <issueAdditional v-if="request.type === 'issue_additional'" :requestInfo="request"/>
              <withdrawFee v-if="request.type === 'withdraw_fee'" :requestInfo="request"/>
              <updateController v-if="request.type === 'update_controller'" :requestInfo="request"/>
              <revoke v-if="request.type === 'revoke'" :requestInfo="request"/>
              <immuteSetting v-if="request.type === 'immute_setting'" :requestInfo="request"/>
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

Vue.use(infiniteScroll)
Vue.component(VueQrcode.name, VueQrcode)

export default {
  computed: {
    ...mapState('settings', {
      mqttHost: state => state.mqttHost
    }),
    ...mapState('account', {
      account: state => state.account,
      frontier: state => state.frontier,
      representaive: state => state.representaive,
      error: state => state.error,
      balance: state => state.balance,
      rawBalance: state => state.rawBalance,
      requests: state => state.requests,
      requestCount: state => state.requestCount,
      count: state => state.count,
      lastModified: state => state.lastModified,
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
    }
  },
  destroyed: function () {
    this.unsubscribe(`account/${this.account}`)
  },
  data () {
    return {
      requestsBusy: false
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
