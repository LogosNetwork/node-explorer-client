<template>
  <b-container fluid class="d-flex">
    <b-row class="flex-grow flex-fill">
      <b-col cols="auto" class="accountPanel d-none d-sm-block">
        <div class="d-flex justify-content-between mt-3 mb-3 align-items-center font-weight-bold">
          <h4 class="mb-0">Accounts</h4>
          <b-button class="font-weight-bolder" variant="link" v-on:click="$wallet.createAccount(null, false)">+ New</b-button>
        </div>
        <div v-if="accounts.length > 0">
          <b-list-group flush>
            <b-list-group-item
              v-bind:class="{ active: currentAccount && account.address === currentAccount.address }"
              v-for="account in accounts" :key="account.address"
              class="d-flex justify-content-between align-items-center mb-2"
              button
              :disabled="!account.synced"
              v-on:click="setCurrentAccount(account.address)"
            >
              <b-row v-if="account" :no-gutters="true" class="w-100">
                <b-col cols="12" class="d-flex justify-content-between flex-wrap align-items-center w-100">
                  <div class="text-left text-nowrap text-truncate">
                    <div class="text-truncate">{{account.label}}</div>
                    <small><LogosAddress class="text-muted" :inactive="true" :force="true" :address="account.address" /></small>
                  </div>
                  <b-dropdown v-on:click.stop variant="link" size="lg" no-caret>
                    <template slot="button-content">
                      <font-awesome-icon size="lg" :icon="faEllipsisVAlt" />
                      <span class="sr-only">Account Options</span>
                    </template>
                    <b-dropdown-item :href="`/${account.address}`" target="_blank">Open Account Page</b-dropdown-item>
                    <!-- <b-dropdown-item href="#">Change Label</b-dropdown-item>
                    <b-dropdown-item href="#">Account Info</b-dropdown-item>
                    <b-dropdown-item href="#">Copy Account Address</b-dropdown-item> -->
                    <b-dropdown-item v-on:click="removeAccount(account.address)">Remove Account</b-dropdown-item>
                  </b-dropdown>
                </b-col>
              </b-row>
              <div class="loadingToken" v-else>
                <font-awesome-icon size="lg" class="mr-2" :icon="faSpinner" spin />
                Syncing {{account.label}}
              </div>
            </b-list-group-item>
          </b-list-group>
        </div>
        <div v-else>
          <b-list-group flush>
            <b-list-group-item class="d-flex justify-content-between align-items-center">
              No Accounts, create one.
            </b-list-group-item>
          </b-list-group>
        </div>
        <div class="d-flex justify-content-between mt-3 mb-3 align-items-center font-weight-bold">
          <h4 class="mb-0">Tokens</h4>
        </div>
        <div v-if="tokens.length > 0">
          <b-list-group flush>
            <b-list-group-item
              v-for="token in tokens" :key="token.address"
              class="d-flex justify-content-between align-items-center mb-2"
              v-on:click="setChainAccount(token)"
              button
            >
              <b-row v-if="token.name" :no-gutters="true" class="d-flex flex-wrap align-items-center w-100">
                <b-col cols="auto" class="mr-2" v-if="token.issuerInfo.image">
                  <img :alt="`${token.name} image`" class="avatar" :src="token.issuerInfo.image">
                </b-col>
                <b-col cols="auto" class="mr-2 defaultIcon" v-else>
                  <font-awesome-layers class="fa-lg mr-2 align-middle">
                    <font-awesome-icon :icon="faCircle" />
                    <font-awesome-icon :icon="faCoins" transform="shrink-6" />
                  </font-awesome-layers>
                </b-col>
                <b-col class="text-overflow text-left text-nowrap text-truncate">
                  <div class="text-truncate">{{token.name}} - ({{token.symbol}})</div>
                  <small><LogosAddress class="text-muted" :inactive="true" :force="true" :address="token.address" /></small>
                </b-col>
                <b-col cols="auto">
                  <b-dropdown v-on:click.stop variant="link" size="lg" no-caret>
                    <template slot="button-content">
                      <font-awesome-icon size="lg" :icon="faEllipsisVAlt" />
                      <span class="sr-only">Token Options</span>
                    </template>
                    <b-dropdown-item :href="`/${token.address}`" target="_blank">Open Token Page</b-dropdown-item>
                    <!-- <b-dropdown-item href="#">Token Info</b-dropdown-item>
                    <b-dropdown-item href="#">Copy Token Address</b-dropdown-item> -->
                  </b-dropdown>
                </b-col>
              </b-row>
              <div class="loadingToken" v-else>
                <font-awesome-icon size="lg" class="mr-2" :icon="faSpinner" spin />
                Syncing {{token.symbol}}
              </div>
            </b-list-group-item>
          </b-list-group>
        </div>
        <div v-else>
          <b-list-group flush>
            <b-list-group-item class="d-flex justify-content-between align-items-center">
              No Tokens, issue one.
            </b-list-group-item>
          </b-list-group>
        </div>
      </b-col>
      <b-col class="forge">
        <b-row class="selectors">
          <b-col col :xl="renderSidePanel ? 7 : 12" class="d-flex flex-column">
            <b-row class="actionToggle">
              <b-col>
                <div class="btn-group btn-group-toggle pt-3 pb-3" data-toggle="buttons">
                  <label class="btn btn-link" v-bind:class="{ active: selected === 'requests' }">
                    <input type="radio" name="buildRequests" id="requests" autocomplete="off" :checked="selected === 'requests'" v-on:click="changeSelected('requests')">
                    <font-awesome-icon size="lg" class="mr-2" :icon="faWrench" />
                    <span>Build Requests</span>
                  </label>
                  <label class="btn btn-link" v-bind:class="{ active: selected === 'lookup' }">
                    <input type="radio" name="lookupInfo" id="lookup" autocomplete="off" :checked="selected === 'lookup'" v-on:click="changeSelected('lookup')">
                    <font-awesome-icon size="lg" class="mr-2" :icon="faSearch" />
                    <span>Lookup Info</span>
                  </label>
                </div>
              </b-col>
            </b-row>
          </b-col>
          <b-col v-if="renderSidePanel" col xl="5" class="flex-column d-none d-xl-flex">
            <div v-if="selected === 'requests'" class="d-flex flex-column flex-grow flex-fill">
              <b-row class="chainToggle">
                <b-col>
                  <div class="btn-group btn-group-toggle pt-3 pb-3" data-toggle="buttons">
                    <label class="btn btn-link active">
                      <input type="radio" name="chainFilter" id="requests" autocomplete="off" :checked="true">
                      <font-awesome-icon size="lg" class="mr-2" :icon="faCube" />
                      <span>Requests</span>
                    </label>
                  </div>
                </b-col>
              </b-row>
            </div>
            <div v-if="selected === 'lookup'" class="d-flex flex-column flex-grow flex-fill">
              <b-row class="chainToggle">
                <b-col>
                  <div class="btn-group btn-group-toggle pt-3 pb-3" data-toggle="buttons">
                    <label class="btn btn-link" v-bind:class="{ active: selectedVisual === 'text' }">
                      <input type="radio" name="textResponse" id="lookups" autocomplete="off" :checked="selectedVisual === 'text'" v-on:click="changeSelectedVisual('text')">
                      <font-awesome-icon size="lg" class="mr-2" :icon="faHistory" />
                      <span>Lookup History</span>
                    </label>
                  </div>
                </b-col>
              </b-row>
            </div>
          </b-col>
        </b-row>
        <b-row class="scrollContainer">
          <b-col col :xl="renderSidePanel ? 7 : 12" class="d-flex flex-column">
            <b-row class="actionSelector flex-grow flex-fill">
              <b-col class="m-3 text-left overflow-hidden">
                <affix ref="scrollAffixElement" v-if="renderSidePanel" class="scrollaffix-sidebar" :offset="{ top: 124, bottom: 30 }" relative-element-selector="#sidePanel" :scroll-affix="true">
                  <resize-observer @notify="handleResize" />
                  <div v-if="selected === 'lookup'">
                    <Lookups />
                  </div>
                  <div v-else-if="selected === 'requests'">
                    <Requests />
                  </div>
                </affix>
                <div v-else>
                  <div v-if="selected === 'lookup'">
                    <Lookups />
                  </div>
                  <div v-else-if="selected === 'requests'">
                    <Requests />
                  </div>
                </div>
              </b-col>
            </b-row>
          </b-col>
          <b-col id="sidePanel" v-if="renderSidePanel" col xl="5" class="flex-column d-none d-xl-flex chainViewer">
            <div v-if="selected === 'requests'" class="d-flex flex-column flex-grow flex-fill">
              <div class="m-3 text-left" v-infinite-scroll="getMoreRequests" infinite-scroll-distance="500">
                <b-row class="mb-3">
                  <b-col cols="9" class="d-flex flex-column m-auto align-items-start">
                    <h4 class="m-0" v-if="currentChainAccount && currentChainAccount.label">{{currentChainAccount.label}}</h4>
                    <h4 class="m-0" v-else-if="currentChainAccount && currentChainAccount.name">{{currentChainAccount.name}} - {{currentChainAccount.symbol}}</h4>
                  </b-col>
                  <b-col cols="3" class="d-flex flex-column m-auto align-items-end">
                    <b-button v-if="currentChainAccount && currentAccount && currentChainAccount.address !== currentAccount.address" class="font-weight-bolder" variant="link" v-on:click="closeChain()">
                      <font-awesome-icon size="lg" class="mr-2" :icon="faTimes" />
                    </b-button>
                  </b-col>
                </b-row>
                <div v-if="currentChainAccount && requests && requests.length > 0">
                  <requestList :requests="requests" :address="currentChainAccount.address" :small="true"/>
                </div>
              </div>
            </div>
            <div v-if="selected === 'lookup'" class="d-flex flex-column flex-grow flex-fill">
              <div class="m-3 text-left">
                <div v-if="lookups && lookups.length > 0">
                  <div v-for="(lookup, index) in lookups" :key="index">
                    <lookupCard :lookupInfo="lookup" :index="index"/>
                  </div>
                </div>
              </div>
            </div>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapState } from 'vuex'
import Wallet from '../api/wallet'
import infiniteScroll from 'vue-infinite-scroll'
import cloneDeep from 'lodash.clonedeep'
import { faUser, faEllipsisVAlt, faSearch, faWrench, faHistory, faSpinner, faCube, faTimes, faCircle, faCoins } from '@fortawesome/pro-light-svg-icons'
import Toasted from 'vue-toasted'
import RPC from '../api/rpc'
import bigInt from 'big-integer'
import 'vue-resize/dist/vue-resize.css'
import requestList from '@/components/requests/requestList.vue'
import requests from '@/components/forge/requests.vue'
Vue.use(infiniteScroll)
Vue.use(Toasted, {
  iconPack: 'fontawesome'
})
Vue.use(Wallet)
Vue.use(RPC)
export default {
  name: 'workshop',
  data () {
    return {
      faUser,
      faEllipsisVAlt,
      faSearch,
      faWrench,
      faHistory,
      faSpinner,
      faTimes,
      faCube,
      faCircle,
      faCoins,
      currentChainAccount: null,
      selected: 'requests',
      selectedVisual: 'text',
      wallet: this.$wallet,
      requestsBusy: false
    }
  },
  components: {
    'b-list-group': () => import(/* webpackChunkName: "b-list-group" */'bootstrap-vue/es/components/list-group/list-group'),
    'b-list-group-item': () => import(/* webpackChunkName: "b-list-group-item" */'bootstrap-vue/es/components/list-group/list-group-item'),
    'b-dropdown': () => import(/* webpackChunkName: "b-dropdown" */'bootstrap-vue/es/components/dropdown/dropdown'),
    'b-dropdown-item': () => import(/* webpackChunkName: "b-dropdown-item" */'bootstrap-vue/es/components/dropdown/dropdown-item'),
    'LogosAddress': () => import(/* webpackChunkName: "LogosAddress" */'@/components/LogosAddress.vue'),
    'Lookups': () => import(/* webpackChunkName: "ForgeLookups" */'@/components/forge/lookups.vue'),
    'Requests': requests,
    'requestList': requestList,
    'lookupCard': () => import(/* webpackChunkName: "LookupCard" */'@/components/forge/lookupCard.vue'),
    'Affix': () => import(/* webpackChunkName: "Affix" */'@/components/affix.vue'),
    'resize-observer': () => import(/* webpackChunkName: "Resize" */'vue-resize').then(({ ResizeObserver }) => ResizeObserver),
    'font-awesome-layers': () => import(/* webpackChunkName: "FontAwesomeLayers" */'@fortawesome/vue-fontawesome').then(({ FontAwesomeLayers }) => FontAwesomeLayers)
  },
  computed: {
    ...mapState('settings', {
      mqttHost: state => state.mqttHost,
      rpcHost: state => state.rpcHost,
      proxyURL: state => state.proxyURL,
      delegates: state => state.delegates
    }),
    ...mapState('forge', {
      toasts: state => state.toasts,
      lookups: state => state.lookups
    }),
    ...mapState('forge/account', {
      chainAccount: state => state.account,
      requests: state => state.requests
    }),
    forgeTokens: function () {
      return this.$wallet.tokenAccounts
    },
    forgeAccounts: function () {
      return this.$wallet.accountsObject
    },
    currentAccount: function () {
      return this.$wallet.account
    },
    chains: function () {
      let requests = {}
      for (let tokenAddress in this.forgeTokens) {
        requests[tokenAddress] = this.history(this.forgeTokens[tokenAddress])
      }
      for (let address in this.forgeAccounts) {
        requests[address] = this.history(this.forgeAccounts[address])
      }
      return requests
    },
    requests: function () {
      return this.history(this.currentChainAccount)
    },
    renderSidePanel: function () {
      return (this.currentChainAccount) || (this.selected === 'lookup' && this.lookups && this.lookups.length > 0)
    },
    accounts: function () {
      if (this.forgeAccounts) {
        return Array.from(Object.values(this.forgeAccounts))
      } else {
        return []
      }
    },
    tokens: function () {
      return Array.from(Object.values(this.forgeTokens))
    }
  },
  methods: {
    handleResize () {
      this.$refs.scrollAffixElement.onScroll()
    },
    history (account) {
      let myRequests = account.chain.concat(account.receiveChain)
      myRequests.sort((a, b) => {
        if (bigInt(a.timestamp).greater(bigInt(b.timestamp))) {
          return -1
        } else if (bigInt(a.timestamp).lesser(bigInt(b.timestamp))) {
          return 1
        }
        return 0
      })
      let hashes = []
      let deduped = myRequests.filter(request => {
        let valid = !hashes.includes(request.hash)
        hashes.push(request.hash)
        return valid
      })
      return deduped
    },
    setChainAccount: function (account) {
      if (!this.currentChainAccount || this.currentChainAccount.address !== account.address) {
        this.currentChainAccount = account
        window.scrollTo(0, 0)
      }
    },
    recordData () {
      this.setWalletData(this.$wallet.toJSON())
    },
    closeChain: function () {
      this.setChainAccount(this.currentAccount)
    },
    changeSelected: function (newSelected) {
      this.selected = newSelected
    },
    setCurrentAccount: function (address) {
      if (this.$wallet.currentAccountAddress !== address) {
        this.$wallet.currentAccountAddress = address
      } else if (this.currentChainAccount && this.currentAccount && this.currentChainAccount.address !== address) {
        this.setChainAccount(this.currentAccount)
      }
    },
    replaceAddresses: function (msg) {
      if (msg) {
        for (let account in this.forgeAccounts) {
          msg = msg.replace(new RegExp(account, 'g'), this.forgeAccounts[account].label)
        }
        for (let account in this.forgeTokens) {
          msg = msg.replace(new RegExp(account, 'g'), this.forgeTokens[account].name)
        }
      }
      return msg
    },
    removeAccount: function (address) {
      this.$wallet.removeAccount(address)
    },
    changeSelectedVisual: function (newSelected) {
      this.selectedVisual = newSelected
    },
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
    ...mapActions('forge', [
      'setWalletData',
      'createToast'
    ]),
    ...mapActions('mqtt', [
      'initalize',
      'subscribe'
    ])
  },
  mounted: function () {
    window.addEventListener('beforeunload', this.recordData)
    this.initalize({ url: this.mqttHost,
      cb: () => {
        this.subscribe(`delegateChange`)
      }
    })
  },
  created: function () {
    this.$wallet.sync()
    if (this.$wallet.currentAccountAddress) {
      this.setChainAccount(this.$wallet.account)
    }
    if (!this.currentChainAccount && this.currentAccount) {
      this.currentChainAccount = this.currentAccount
    }
  },
  watch: {
    currentAccount: function (newAccount, oldAccount) {
      if ((newAccount && oldAccount === null) || (newAccount && oldAccount && newAccount.address !== oldAccount.address)) {
        this.setChainAccount(newAccount)
      }
    },
    rpcHost: function (newRpcHost, oldRpcHost) {
      if (this.proxyURL) {
        this.$Logos.changeServer(this.proxyURL, newRpcHost)
      } else {
        this.$Logos.changeServer(newRpcHost)
      }
    },
    delegates: function (newDelegates, oldDelegates) {
      this.$wallet.rpc.delegates = newDelegates
    },
    toasts: function (newToasts, oldToasts) {
      if (oldToasts !== null && newToasts.length > 0) {
        let newToast = cloneDeep(newToasts[newToasts.length - 1])
        newToast.message = this.replaceAddresses(newToast.message)
        let actions = [
          {
            text: 'Close',
            onClick: (e, toastObject) => {
              toastObject.goAway(0)
            }
          }
        ]
        if (newToast.hash) {
          actions.push({
            text: 'View',
            href: `/${newToast.hash}`,
            target: '_blank'
          })
        }
        this.$toasted.show(newToast.message, {
          theme: 'toasted-primary',
          position: 'bottom-right',
          duration: 5000,
          action: actions
        })
      }
    },
    chains: function (newRequests, oldRequests) {
      if (this.$wallet.synced) {
        for (let address in oldRequests) {
          let newRequestCount = newRequests[address].length - oldRequests[address].length
          if (newRequestCount > 0) {
            for (let i = 0; i < newRequestCount; i++) {
              this.createToast({
                address: address,
                request: newRequests[address][i]
              })
            }
          }
        }
      }
    }
  },
  beforeDestroy: function () {
    window.removeEventListener('beforeunload', this.recordData)
    this.recordData()
  }
}
</script>

<style scoped lang="scss">
$bg-tertiary: rgb(230, 230, 230);
$bg-secondary: #FDFDFD;
$bg-primary: #F5F5F5;
$bg-white: #FFF;
.selectors {
  position: fixed;
  top: 54px;
  left: 0;
  width: 100vw;
  z-index: 2;
}
.scrollContainer {
  margin-top: 70px;
  min-height: calc(100vh - 124px);
  max-width: 100vw
}
@media (min-width: 576px) {
  .forge {
    margin-left: 265px;
  }
  .scrollContainer {
    max-width: calc(100vw - 280px);
  }
  .selectors {
    left: 280px;
    width: calc(100vw - 265px);
  }
}
@media (min-width: 1200px) {
  .affix {
    width: calc((100vw - 387px) * 7 / 12)
  }
}
.scrollaffix-sidebar:not(.affix) {
  min-height: calc(100vh - 172px);
}
.list-group-flush > .list-group-item {
  border-top: 0;
  border-bottom: 0;
  padding-top: 0;
  padding-bottom: 0;
}
.list-group-item {
  background: transparent;
}
label.btn-link {
  cursor: pointer;
}
label.btn-link:not(.active) {
  color: #525f7f;
}
label.btn-link.active {
  font-weight: 900;
}
.list-group-item.active {
  background-color: transparent;
  color: var(--primary);
  font-weight: 900
}
.accountPanel {
  background: $bg-secondary;
  width: 265px;
  position: fixed;
  left: 0px;
  height: calc(100vh - 54px);
  z-index: 2;
}
.actionToggle {
  background: $bg-secondary;
}
.actionToggle > .col {
  z-index: 1;
  -webkit-box-shadow: 0 0.125rem 0rem rgba(0, 0, 0, 0.075) !important;
  box-shadow: 0 0.125rem 0rem rgba(0, 0, 0, 0.075) !important;
}
.actionSelector {
  background: $bg-primary;
}
.chainToggle {
  background: $bg-secondary;
}
.chainToggle > .col {
  z-index: 1;
  -webkit-box-shadow: 0 0.125rem 0rem rgba(0, 0, 0, 0.075) !important;
  box-shadow: 0 0.125rem 0rem rgba(0, 0, 0, 0.075) !important;
}
.loadingToken {
  height: 48px;
  width: 100%;
  padding-top: 12px;
}
.chainViewer {
  background: $bg-tertiary;
}
.defaultIcon {
  max-width: 24px;
}
.avatar {
  width: 22px;
  height: 22px;
  vertical-align: top;
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
<style lang="scss">
  .collapsedForm:not(.card-body) {
    padding: 0;
    padding-bottom: 1.25rem;
  }
  .collapsedForm {
    border-top:1px solid rgba(0, 0, 0, 0.075);
    margin-left: 1.25rem;
    margin-right: 1.25rem;
  }
  .iconHolder {
    width: 52px;
    height: 52px;
  }
  .accordionCard > .btn-link:hover,
  .accordionCard > .btn-link:focus {
    text-decoration: none;
  }
  .accordionCard {
    -webkit-transition: all .3s;
    -o-transition: all .3s;
    transition: all .3s;
    border: 0px;
  }
</style>
