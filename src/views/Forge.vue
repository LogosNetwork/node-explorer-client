<template>
  <b-container fluid class="d-flex">
    <b-row class="flex-grow flex-fill overflow-hidden">
      <b-col cols="auto" class="accountPanel d-none d-sm-block">
        <div class="d-flex justify-content-between mt-3 mb-3 align-items-center font-weight-bold">
          <h4 class="mb-0">Accounts</h4>
          <b-button class="font-weight-bolder" variant="link" v-on:click="createAccount">+ New</b-button>
        </div>
        <div v-if="Object.values(wallet.accounts).length > 0">
          <b-list-group flush>
            <b-list-group-item
              v-bind:class="{ active: currentAccount && account.address === currentAccount.address }"
              v-for="account in wallet.accounts" :key="account.address"
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
                    <b-dropdown-item v-on:click.stop.prevent="removeAccount(account.address)">Remove Account</b-dropdown-item>
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
        <div v-if="hasTokens">
          <b-list-group flush>
            <b-list-group-item
              v-bind:class="{ active: currentAccount && token.address === currentAccount.address }"
              v-for="token in wallet.tokenAccounts" :key="token.address"
              class="d-flex justify-content-between align-items-center mb-2"
              button
              v-on:click="setCurrentAccount(token.address)"
            >
              <b-row v-if="token.name" :no-gutters="true" class="d-flex flex-wrap align-items-center w-100">
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
      <b-col class="forge overflow-hidden">
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
            <div class="m-3 text-left">
              <affix ref="scrollAffixElement" v-if="renderSidePanel" class="scrollaffix-sidebar" :offset="{ top: 124, bottom: 16 }" relative-element-selector="#sidePanel" :scroll-affix="true">
                <resize-observer @notify="handleResize" />
                <b-alert v-model="showInfo" variant="success" dismissible>
                  Connected to 32 delegate provisioned testnet
                </b-alert>
                <div v-if="selected === 'lookup'">
                  <Lookups />
                </div>
                <div v-else-if="selected === 'requests'">
                  <Requests :account="currentAccount" />
                </div>
              </affix>
              <div v-else>
                <div v-if="selected === 'lookup'">
                  <Lookups />
                </div>
                <div v-else-if="selected === 'requests'">
                  <Requests :account="currentAccount" />
                </div>
              </div>
            </div>
          </b-col>
          <b-col v-if="renderSidePanel" col xl="5" class="flex-column d-none d-xl-flex chainViewer">
            <div id="sidePanel" v-if="selected === 'requests'" class="d-flex flex-column">
              <div class="m-3 text-left">
                <div class="mb-3">
                  <div class="d-flex flex-column m-auto align-items-start">
                    <h4 class="m-0" v-if="currentAccount && currentAccount.label">{{currentAccount.label}}</h4>
                    <h4 class="m-0" v-else-if="currentAccount && currentAccount.name">{{currentAccount.name}} - {{currentAccount.symbol}}</h4>
                  </div>
                </div>
                <div v-if="currentAccount">
                  <requestList :requests="history(currentAccount)" :address="currentAccount.address" :small="true"/>
                </div>
              </div>
            </div>
            <div id="sidePanel" v-else-if="selected === 'lookup'" class="d-flex flex-column">
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
import cloneDeep from 'lodash.clonedeep'
import { faUser, faEllipsisVAlt, faSearch, faWrench, faHistory, faSpinner, faCube, faTimes, faCircle, faCoins } from '@fortawesome/pro-light-svg-icons'
import Toasted from 'vue-toasted'
import RPC from '../api/rpc'
import bigInt from 'big-integer'
import 'vue-resize/dist/vue-resize.css'
import requestList from '@/components/requests/requestList.vue'
import requests from '@/components/forge/requests.vue'
import { BListGroup, BListGroupItem, BDropdown, BDropdownItem, BAlert } from 'bootstrap-vue'

Vue.use(Toasted, {
  iconPack: 'fontawesome'
})
Vue.use(Wallet)
Vue.use(RPC)
export default {
  name: 'workshop',
  data () {
    return {
      wallet: this.$wallet,
      selected: 'requests',
      selectedVisual: 'text',
      requestsBusy: false,
      currentAccount: null,
      faUser,
      faEllipsisVAlt,
      faSearch,
      faWrench,
      faHistory,
      faSpinner,
      faTimes,
      faCube,
      faCircle,
      faCoins
    }
  },
  components: {
    BListGroup,
    BListGroupItem,
    BDropdown,
    BDropdownItem,
    BAlert,
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
      lookups: state => state.lookups,
      currentAccountAddress: state => state.currentAccountAddress,
      showInfo: state => state.showInfo
    }),
    chains: function () {
      let requests = {}
      for (let tokenAddress in this.wallet.tokenAccounts) {
        requests[tokenAddress] = this.history(this.wallet.tokenAccounts[tokenAddress])
      }
      for (let address in this.wallet.accounts) {
        requests[address] = this.history(this.wallet.accounts[address])
      }
      return requests
    },
    renderSidePanel: function () {
      return (this.currentAccount) || (this.selected === 'lookup' && this.lookups && this.lookups.length > 0)
    },
    hasTokens: function () {
      if (!this.wallet || !this.wallet.tokenAccounts) return false
      for (let prop in this.wallet.tokenAccounts) {
        if (this.wallet.tokenAccounts.hasOwnProperty(prop)) {
          return true
        }
      }
      return false
    }
  },
  methods: {
    ...mapActions('forge',
      [
        'setShowInfo'
      ]
    ),
    handleResize () {
      this.$refs.scrollAffixElement.onScroll()
    },
    history (account) {
      if (!account.chain || !account.receiveChain) return []
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
    recordData () {
      this.setWalletData(this.wallet.toJSON())
    },
    changeSelected: function (newSelected) {
      this.selected = newSelected
    },
    setCurrentAccount: function (address) {
      if (this.wallet.accounts[address]) {
        this.wallet.currentAccountAddress = address
        this.currentAccount = this.wallet.accounts[address]
      } else if (this.wallet.tokenAccounts[address]) {
        this.currentAccount = this.wallet.tokenAccounts[address]
      }
      if (this.currentAccount) {
        this.setCurrentAccountAddress(this.currentAccount.address)
      }
      this.changeSelected('requests')
    },
    replaceAddresses: function (msg) {
      if (msg) {
        for (let account in this.wallet.accounts) {
          msg = msg.replace(new RegExp(account, 'g'), this.wallet.accounts[account].label)
        }
        for (let account in this.wallet.tokenAccounts) {
          msg = msg.replace(new RegExp(account, 'g'), this.wallet.tokenAccounts[account].name)
        }
      }
      return msg
    },
    removeAccount: function (address) {
      Vue.delete(this.wallet._accounts, address)
      this.wallet.removeAccount(address)
    },
    createAccount: async function () {
      let newAccount = await this.wallet.createAccount(null, false)
      delete this.wallet._accounts[newAccount.address]
      this.$set(this.wallet._accounts, newAccount.address, newAccount)
      for (let token in this.wallet._tokenAccounts) {
        let tkAccount = this.wallet._tokenAccounts[token]
        delete this.wallet._tokenAccounts[token]
        this.$set(this.wallet._tokenAccounts, tkAccount.address, tkAccount)
      }
    },
    changeSelectedVisual: function (newSelected) {
      this.selectedVisual = newSelected
    },
    ...mapActions('forge', [
      'setWalletData',
      'createToast',
      'setCurrentAccountAddress'
    ]),
    ...mapActions('mqtt', [
      'initalize',
      'subscribe'
    ])
  },
  mounted: function () {
    this.wallet.sync()
    if (this.currentAccountAddress) {
      this.setCurrentAccount(this.currentAccountAddress)
    } else {
      this.setCurrentAccount(this.wallet.currentAccountAddress)
    }

    window.addEventListener('beforeunload', this.recordData)
    this.initalize({ url: this.mqttHost,
      cb: () => {
        this.subscribe(`delegateChange`)
      }
    })
  },
  watch: {
    currentAccount: function (newAccount, oldAccount) {
      window.scrollTo(0, 0)
    },
    'wallet.account': function (newAccount, oldAccount) {
      if (this.currentAccount === null) {
        this.setCurrentAccount(newAccount.address)
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
      this.wallet.rpc.delegates = newDelegates
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
      if (this.wallet.synced && oldRequests) {
        for (let address in oldRequests) {
          if (newRequests[address]) {
            let newRequestCount = newRequests[address].length - oldRequests[address].length
            if (newRequestCount > 0) {
              for (let i = 0; i < newRequestCount; i++) {
                if (newRequests[address][i].type === 'issuance') {
                  for (let token in this.wallet._tokenAccounts) {
                    let tkAccount = this.wallet._tokenAccounts[token]
                    delete this.wallet._tokenAccounts[token]
                    this.$set(this.wallet._tokenAccounts, tkAccount.address, tkAccount)
                  }
                }
                this.createToast({
                  address: address,
                  request: newRequests[address][i]
                })
              }
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
  margin: 0px;
}
.scrollContainer {
  margin-top: 70px;
  min-height: calc(100vh - 124px);
  width: 100%;
}
@media (min-width: 576px) {
  .forge {
    margin-left: 265px;
  }
  .scrollContainer {
    width: calc(100% + 30px);
  }
  .selectors {
    left: 280px;
    margin-left: -15px;
    margin-right: -15px;
    width: calc(100% - 265px);
  }
}
@media (min-width: 1200px) {
  .affix {
    width: calc((100% - 265px) * 0.5833333 - 62px);
  }
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
