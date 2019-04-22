<template>
  <div id="primary">
    <b-container>
      <div v-if="error">
        <b-row class="text-left pt-5">
          <b-col cols="12" md="8" class="mb-3">
            <div class="d-flex justify-content-between mb-3">
              <h3 class="text-left">Unopened Account</h3>
              <b-button v-on:click="requestFaucet()" class="fundBtn d-md-none" size="sm" variant="outline-primary">Fund Account</b-button>
            </div>
            <code style="background-color:#FFF;color:#ff3860;padding:6px">{{account}}</code>
            <h4 v-if="error" class="pt-3" style="color:red">This account has not been opened yet</h4>
          </b-col>
          <b-col cols="12" md="4" class="mb-3" id="qrHolder">
            <b-button v-on:click="requestFaucet()" class="fundBtn mb-3 d-none d-md-block" size="sm" variant="outline-primary">Fund Account</b-button>
            <qrcode :value="'lgs:'+account" :options="{ size: 110 }"></qrcode>
          </b-col>
        </b-row>
      </div>
      <div v-else-if="type === 'LogosAccount'">
        <b-row class="text-left pt-5">
          <b-col cols="12" md="8" class="mb-3">
            <div class="d-flex justify-content-between mb-3">
              <h3 class="text-left" v-t="'account'"></h3>
              <b-button v-on:click="requestFaucet()" class="fundBtn d-md-none" size="sm" variant="outline-primary">Fund Account</b-button>
            </div>
            <code style="background-color:#FFF;color:#ff3860;padding:6px">{{account}}</code>
            <h3 v-if="balance !== null && selected === 'all' || selected === 'lgs'" class="pt-3" style="color:green">{{balance}} LOGOS</h3>
            <h3 v-if="tokenBalances !== null && selected !== 'all' && selected !== 'lgs'" class="pt-3" style="color:green">
              <span v-if="tokenBalances[selected] && tokenBalances[selected].tokenInfo.pending !== true">
                <span v-if="tokenBalances[selected].balanceInTokens">{{tokenBalances[selected].balanceInTokens}} {{tokenBalances[selected].tokenInfo.symbol}}</span>
                <span v-if="!tokenBalances[selected].balanceInTokens">{{tokenBalances[selected].balance}} {{tokenBalances[selected].tokenInfo.symbol}}</span>
              </span>
              <span v-if="!tokenBalances[selected] || tokenBalances[selected].tokenInfo.pending === true">
                <font-awesome-icon :icon="faSpinner" spin /> Loading Token Info
              </span>
            </h3>
          </b-col>
          <b-col cols="12" md="4" class="mb-3" id="qrHolder">
            <b-button v-on:click="requestFaucet()" class="fundBtn mb-3 d-none d-md-block" size="sm" variant="outline-primary">Fund Account</b-button>
            <qrcode :value="'lgs:'+account" :options="{ size: 110 }"></qrcode>
          </b-col>
        </b-row>
        <b-row class="mb-3">
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
      <div v-else-if="type === 'TokenAccount'" class="mb-3 pt-5 text-left">
        <div class="mb-3">
          <div class="d-flex justify-content-between mb-3">
            <h3>
              <token :tokenInfo="token" :inactive="true" size="33" />
            </h3>
            <b-button v-on:click="requestFaucet()" class="fundBtn" size="sm" variant="outline-primary">Fund Account</b-button>
          </div>
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
                      <span v-if="token.fee_type.toLowerCase() === 'flat' && typeof token.feeInTokens !== 'undefined' && token.feeInTokens !== '0'">
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
                  <b-row class="justify-content-md-center iconSettings">
                    <div class="col-md-4 mb-1 mb-md-0">
                      <span class="text-nowrap">
                        Settings:
                      </span>
                    </div>
                    <div class="col-md-8 font-weight-bold text-left" style="padding-right:0px">
                      <TokenSettings :token="token"/>
                    </div>
                  </b-row>
                </b-list-group-item>
              </b-list-group>
            </b-card>
          </b-col>
        </b-row>
        <div>
          <div v-for="controller in token.controllers" :key="'controller'+controller.account" class="mb-3 mr-2 tkCtrlContainer">
            <b-button v-b-modal="'controllerModal'" variant="outline-primary" @click="selectedController = controller">
              <b-row class="justify-content-md-center">
                <b-col class="font-weight-bold text-left">
                  <span v-if="controller.privileges.includes('update_controller')" v-b-tooltip.hover :title="`This controller has admin rights of ${token.name}. They can add or remove other controllers and set any privileges.`">
                    <font-awesome-icon :icon="faCrown" class="mr-2"/>
                  </span>
                  <LogosAddress :address="controller.account" :inactive="true" :force="true" /><br/>
                </b-col>
              </b-row>
            </b-button>
          </div>
          <b-modal
            size="lg"
            id="controllerModal"
            scrollable
            :hide-footer="true"
            title="Token Controller Privileges"
            title-tag="h3">
            <span v-if="selectedController">
              <div class="text-break mb-4">
                <h4>Controller Address:</h4>
                <LogosAddress class="font-weight-bold" :address="selectedController.account" :forceExpand="true" />
              </div>
              <div class="content">
                <div v-for="privilege in selectedController.privileges" :key="selectedController.account+privilege">
                  <span v-if="privilege === 'change_issuance' && token.settings.includes('modify_issuance')">
                    <h5>
                      <font-awesome-icon :icon="faMagic" class="mr-2"/>
                      Change Issuance
                    </h5>
                    <p>The controller can change the issuance setting of {{token.name}}. This allows controllers to issue additional {{token.symbol}}.</p>
                  </span>
                  <span v-else-if="privilege === 'change_modify_issuance' && token.settings.includes('modify_issuance')">
                    <h5>
                      <font-awesome-icon :icon="faLockAlt" class="mr-2"/>
                      Immute Issuance
                    </h5>
                    <p>The controller is allowed to make the current issuance setting permanent.</p>
                  </span>
                  <span v-else-if="privilege === 'issuance' && token.settings.includes('issuance')">
                    <h5>
                      <font-awesome-icon :icon="faMagic" class="mr-2"/>
                      Issuance
                    </h5>
                    <p>The controller is allowed to issue additional {{token.symbol}}.</p>
                  </span>
                  <span v-else-if="privilege === 'change_revoke' && token.settings.includes('modify_revoke')">
                    <h5>
                      <font-awesome-icon :icon="faMask" class="mr-2"/>
                      Change Revoke
                    </h5>
                    <p>The controller can change the revoke setting of {{token.name}}. This allows controllers to revoke {{token.symbol}} from user accounts.</p>
                  </span>
                  <span v-else-if="privilege === 'change_modify_revoke' && token.settings.includes('modify_revoke')">
                    <h5>
                      <font-awesome-icon :icon="faLockAlt" class="mr-2"/>
                      Immute Revoke
                    </h5>
                    <p>The controller is allowed to make the current revoke setting permanent.</p>
                  </span>
                  <span v-else-if="privilege === 'revoke' && token.settings.includes('revoke')">
                    <h5>
                      <font-awesome-icon :icon="faMask" class="mr-2"/>
                      Revoke
                    </h5>
                    <p>The controller is allowed to revoke {{token.symbol}} from user accounts.</p>
                  </span>
                  <span v-else-if="privilege === 'change_freeze' && token.settings.includes('modify_freeze')">
                    <h5>
                      <font-awesome-icon :icon="faSnowflake" class="mr-2"/>
                      Change Freeze
                    </h5>
                    <p>The controller can change the freeze setting of {{token.name}}. This allows controllers to freeze {{token.symbol}} in user accounts.</p>
                  </span>
                  <span v-else-if="privilege === 'change_modify_freeze' && token.settings.includes('modify_freeze')">
                    <h5>
                      <font-awesome-icon :icon="faLockAlt" class="mr-2"/>
                      Immute Freeze
                    </h5>
                    <p>The controller is allowed to make the current freeze setting permanent.</p>
                  </span>
                  <span v-else-if="privilege === 'freeze' && token.settings.includes('freeze')">
                    <h5>
                      <font-awesome-icon :icon="faSnowflake" class="mr-2"/>
                      Freeze
                    </h5>
                    <p>The controller is allowed to freeze {{token.symbol}} in user accounts.</p>
                  </span>
                  <span v-else-if="privilege === 'change_adjust_fee' && token.settings.includes('modify_adjust_fee')">
                    <h5>
                      <font-awesome-icon :icon="faPercentage" class="mr-2"/>
                      Change Adjust Fee
                    </h5>
                    <p>The controller can change the adjust fee setting of {{token.name}}. This allows controllers to change the {{token.symbol}} token fee.</p>
                  </span>
                  <span v-else-if="privilege === 'change_modify_adjust_fee' && token.settings.includes('modify_adjust_fee')">
                    <h5>
                      <font-awesome-icon :icon="faLockAlt" class="mr-2"/>
                      Immute Adjust Fee
                    </h5>
                    <p>The controller is allowed to make the current adjust fee setting permanent.</p>
                  </span>
                  <span v-else-if="privilege === 'adjust_fee' && token.settings.includes('adjust_fee')">
                    <h5>
                      <font-awesome-icon :icon="faPercentage" class="mr-2"/>
                      Adjust Fee
                    </h5>
                    <p>The controller is allowed to to change the {{token.symbol}} token fee.</p>
                  </span>
                  <span v-else-if="privilege === 'change_whitelist' && token.settings.includes('modify_whitelist')">
                    <h5>
                      <font-awesome-icon :icon="faListAlt" class="mr-2"/>
                      Change Whitelist
                    </h5>
                    <p>The controller can change the whitelist setting of {{token.name}}. This allows controllers to only allow approved accounts to use the {{token.symbol}} token.</p>
                  </span>
                  <span v-else-if="privilege === 'change_modify_whitelist' && token.settings.includes('modify_whitelist')">
                    <h5>
                      <font-awesome-icon :icon="faLockAlt" class="mr-2"/>
                      Immute Whitelist
                    </h5>
                    <p>The controller is allowed to make the current whitelist setting permanent.</p>
                  </span>
                  <span v-else-if="privilege === 'whitelist' && token.settings.includes('whitelist')">
                    <h5>
                      <font-awesome-icon :icon="faListAlt" class="mr-2"/>
                      Whitelist
                    </h5>
                    <p>The controller is allowed to approved accounts to use the {{token.symbol}} token.</p>
                  </span>
                  <span v-else-if="privilege === 'update_issuer_info'">
                    <h5>
                      <font-awesome-icon :icon="faEdit" class="mr-2"/>
                      Update Token Info
                    </h5>
                    <p>The controller is allowed to change the token info of {{token.name}}.</p>
                  </span>
                  <span v-else-if="privilege === 'update_controller'">
                    <h5>
                      <font-awesome-icon :icon="faCrown" class="mr-2"/>
                      Token Admin
                    </h5>
                    <p>This controller has admin rights and can add controllers, remove controllers, or change controllers privileges.</p>
                  </span>
                  <span v-else-if="privilege === 'burn'">
                    <h5>
                      <font-awesome-icon :icon="faFire" class="mr-2"/>
                      Burn
                    </h5>
                    <p>The controller is allowed to burn tokens that are inside the official {{token.name}} token account.</p>
                  </span>
                  <span v-else-if="privilege === 'distribute'">
                    <h5>
                      <font-awesome-icon :icon="faArrowDown" class="mr-2"/>
                      Distribute
                    </h5>
                    <p>The controller is allowed to distribute tokens that are inside the official {{token.name}} token account.</p>
                  </span>
                  <span v-else-if="privilege === 'withdraw_fee'">
                    <h5>
                      <font-awesome-icon :icon="faHandReceiving" class="mr-2"/>
                      Withdraw Fee
                    </h5>
                    <p>The controller is allowed to withdraw the collected token fees from the {{token.symbol}} token fee pool.</p>
                  </span>
                </div>
              </div>
            </span>
          </b-modal>
        </div>
      </div>
      <div v-infinite-scroll="getMoreRequests" infinite-scroll-distance="500">
        <b-row v-if="type">
          <b-col cols="12" class="mb-3">
            <h4 class="text-left">
              <span>{{requestCount}} </span>
              <span v-t="'requests'"></span>
              <small v-if='requests.length >= count'> (showing last {{requests.length}})</small>
              <small v-if='requests.length < count'> (showing all {{requests.length}})</small>
            </h4>
            <p class="text-left" v-if="lastModified"><span v-t="'lastUpdated'"></span> <strong> {{ lastModified | moment("MMMM DD, YYYY h:mm:ss A") }}</strong></p>
            <b-row class="mb-3 text-left">
              <b-col>
                <div class="btn-group btn-group-toggle flex-wrap" data-toggle="buttons">
                  <label class="btn btn-outline-secondary btnWrap" v-bind:class="{ active: selected === 'all' }">
                    <input type="radio" name="tokenFilter" id="all" autocomplete="off" :checked="selected === 'all'" v-on:click="changeSelected('all')"> All
                  </label>
                  <label class="btn btn-outline-secondary btnWrap" v-bind:class="{ active: selected === 'lgs' }">
                    <input type="radio" name="tokenFilter" id="lgs" autocomplete="off" :checked="selected === 'lgs'" v-on:click="changeSelected('lgs')">
                    <img class="avatar mr-1" src="/favicon-32x32.png">
                    <span>Logos</span>
                  </label>
                  <label v-for="tokenBalance in Object.entries(tokenBalances)" :key="tokenBalance[0]" class="btn btn-outline-secondary btnWrap" v-bind:class="{ active: selected === tokenBalance[0] }">
                    <input type="radio" name="tokenFilter" :id="tokenBalance[0]" autocomplete="off" :checked="selected === tokenBalance[0]" v-on:click="changeSelected(tokenBalance[0])">
                    <span v-if="tokenBalance[1].tokenInfo.pending !== true">
                      <img v-if="tokenBalance[1].tokenInfo.issuerInfo.image" class="avatar mr-1" :src="tokenBalance[1].tokenInfo.issuerInfo.image">
                      <font-awesome-icon :icon="faCoins" v-if="!tokenBalance[1].tokenInfo.issuerInfo.image" class="mr-1" />
                      <span>{{tokenBalance[1].tokenInfo.symbol}}</span>
                    </span>
                    <span v-if="tokenBalance[1].tokenInfo.pending === true">
                      <font-awesome-icon :icon="faSpinner" spin />
                    </span>
                  </label>
                </div>
              </b-col>
            </b-row>
            <div name="list" is="transition-group" v-if="requests && requests.length > 0">
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
            <div v-else>
              This account has no requests
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
import infiniteScroll from 'vue-infinite-scroll'
import axios from 'axios'
import { faSpinner, faCoins, faCrown, faUserCircle, faMagic, faLockAlt, faMask, faSnowflake, faListAlt, faArrowDown, faFire, faEdit, faHandReceiving, faPercentage } from '@fortawesome/pro-light-svg-icons'
import VueMoment from 'vue-moment'
import vBModal from 'bootstrap-vue/es/directives/modal/modal'
import vBTooltip from 'bootstrap-vue/es/directives/tooltip/tooltip'
Vue.directive('b-tooltip', vBTooltip)
Vue.directive('b-modal', vBModal)
Vue.use(VueMoment)
Vue.use(infiniteScroll)

export default {
  computed: {
    ...mapState('settings', {
      mqttHost: state => state.mqttHost,
      requestURL: state => state.requestURL
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
    'qrcode': () => import(/* webpackChunkName: "vue-qrcode" */ '@xkeshi/vue-qrcode'),
    'request': () => import(/* webpackChunkName: "RequestWrapper" */ '@/components/requests/request.vue'),
    'b-card-body': () => import(/* webpackChunkName: "b-card-body" */ 'bootstrap-vue/es/components/card/card-body'),
    'b-card-title': () => import(/* webpackChunkName: "b-card-title" */ 'bootstrap-vue/es/components/card/card-title'),
    'b-card-text': () => import(/* webpackChunkName: "b-card-text" */ 'bootstrap-vue/es/components/card/card-text'),
    'b-list-group': () => import(/* webpackChunkName: "b-list-group" */ 'bootstrap-vue/es/components/list-group/list-group'),
    'LogosAddress': () => import(/* webpackChunkName: "LogosAddress" */ '@/components/LogosAddress.vue'),
    'b-list-group-item': () => import(/* webpackChunkName: "b-list-group-item" */ 'bootstrap-vue/es/components/list-group/list-group-item'),
    'b-modal': () => import(/* webpackChunkName: "b-modal" */ 'bootstrap-vue/es/components/modal/modal'),
    'TokenSettings': () => import(/* webpackChunkName: "TokenSettings" */ '@/components/requests/tokenSettings.vue'),
    'token': () => import(/* webpackChunkName: "token" */ '@/components/requests/token.vue')
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
      if (this.type && !this.requestsBusy && this.requests && this.requests.length > 0) {
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
    },
    requestFaucet () {
      if (this.account.match(/^lgs_[13456789abcdefghijkmnopqrstuwxyz]{60}$/) !== null) {
        axios.post(`${this.requestURL}/faucet`, {
          address: this.account
        }).then((res) => {
        }).catch((err) => {
          alert(err)
        })
      }
    }
  },
  destroyed: function () {
    this.unsubscribe(`account/${this.account}`)
  },
  data () {
    return {
      requestsBusy: false,
      selected: 'all',
      faSpinner,
      faCoins,
      faCrown,
      faUserCircle,
      faMagic,
      faListAlt,
      faMask,
      faSnowflake,
      faLockAlt,
      faFire,
      faArrowDown,
      faEdit,
      faHandReceiving,
      faPercentage,
      selectedController: null
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
  @media (min-width: 768px) {
    .iconSettings {
      height: 23.326px;
      overflow: hidden;
    }
  }
  .tkCtrlContainer {
    display: inline-block;
  }
  .fundBtn {
    max-height: 33px;
    margin-left: auto;
  }
  .content > div:not(:first-child) {
    margin-top: 2rem;
  }
  .btnWrap {
    max-width: 119px;
    width: 119px;
  }
</style>
