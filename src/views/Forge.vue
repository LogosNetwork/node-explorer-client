<template>
  <b-container fluid class="d-flex">
    <b-row class="flex-grow flex-fill">
      <b-col xs="auto" class="accountPanel">
        <div class="d-flex justify-content-between mt-3 mb-3 align-items-center font-weight-bold">
          <h4 class="mb-0">Accounts</h4>
          <b-button class="font-weight-bolder" variant="link" v-on:click="$wallet.createAccount()">+ New</b-button>
        </div>
        <div v-if="accounts.length > 0">
          <b-list-group flush>
            <b-list-group-item
              v-bind:class="{ active: currentAccount && account.address === currentAccount.address }"
              v-for="account in accounts" :key="account.address"
              class="d-flex justify-content-between align-items-center mb-2"
              button
              v-on:click="setCurrentAccount(account.address)"
            >
              <div class="text-left">
                <div>{{account.label}}</div>
                <small><LogosAddress class="text-muted" :inactive="true" :force="true" :address="account.address" /></small>
              </div>
              <b-dropdown v-on:click.stop variant="link" size="lg" no-caret>
                <template slot="button-content">
                  <font-awesome-icon size="lg" :icon="faEllipsisVAlt" />
                  <span class="sr-only">Account Options</span>
                </template>
                <b-dropdown-item :href="`/${account.address}`" target="_blank">Open Account Page</b-dropdown-item>
                <b-dropdown-item href="#">Change Label</b-dropdown-item>
                <b-dropdown-item href="#">Account Info</b-dropdown-item>
                <b-dropdown-item href="#">Copy Account Address</b-dropdown-item>
                <b-dropdown-item v-on:click="removeAccount(account.address)">Remove Account</b-dropdown-item>
              </b-dropdown>
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
              v-for="token in tokens" :key="token.tokenAccount"
              class="d-flex justify-content-between align-items-center mb-2"
            >
              <span v-if="token.name">
                <font-awesome-icon size="lg" class="mr-2" :icon="faCoins" />
                {{token.name}} - ({{token.symbol}})
              </span>
              <span v-else>
                <font-awesome-icon size="lg" class="mr-2" :icon="faSpinner" spin />
                Loading...
              </span>
              <b-dropdown v-on:click.stop variant="link" size="lg" no-caret>
                <template slot="button-content">
                  <font-awesome-icon size="sm" :icon="faEllipsisVAlt" />
                  <span class="sr-only">Token Options</span>
                </template>
                <b-dropdown-item :href="`/${token.tokenAccount}`" target="_blank">Open Token Page</b-dropdown-item>
                <b-dropdown-item href="#">Token Info</b-dropdown-item>
                <b-dropdown-item href="#">Copy Token Address</b-dropdown-item>
              </b-dropdown>
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
      <b-col>
        <b-row class="h-100">
          <b-col cols="12" class="d-flex flex-column">
            <b-row class="actionToggle">
              <b-col>
                <div class="btn-group btn-group-toggle pt-3 pb-3" data-toggle="buttons">
                  <label class="btn btn-link" v-bind:class="{ active: selected === 'requests' }">
                    <input type="radio" name="actionFilter" id="requests" autocomplete="off" :checked="selected === 'requests'" v-on:click="changeSelected('requests')">
                    <font-awesome-icon size="lg" class="mr-2" :icon="faWrench" />
                    <span>Build Requests</span>
                  </label>
                  <label class="btn btn-link" v-bind:class="{ active: selected === 'lookup' }">
                    <input type="radio" name="actionFilter" id="lookup" autocomplete="off" :checked="selected === 'lookup'" v-on:click="changeSelected('lookup')">
                    <font-awesome-icon size="lg" class="mr-2" :icon="faSearch" />
                    <span>Lookup Info</span>
                  </label>
                </div>
              </b-col>
            </b-row>
            <b-row class="actionSelector flex-grow flex-fill">
              <b-col class="m-5 text-left">
                <div v-if="selected === 'lookup'">
                  <Lookups />
                </div>
                <div v-else-if="selected === 'requests'">
                  <Requests />
                </div>
              </b-col>
            </b-row>
          </b-col>
          <b-col v-if="false" cols="4" class="d-flex flex-column">
            <b-row class="chainToggle">
              <b-col>
                <div class="btn-group btn-group-toggle pt-3 pb-3" data-toggle="buttons">
                  <label class="btn btn-link" v-bind:class="{ active: selectedVisual === 'visual' }">
                    <input type="radio" name="chainFilter" id="visual" autocomplete="off" :checked="selectedVisual === 'visual'" v-on:click="changeSelectedVisual('visual')">
                    <font-awesome-icon size="lg" class="mr-2" :icon="faEye" />
                    <span>Visual</span>
                  </label>
                  <label class="btn btn-link" v-bind:class="{ active: selectedVisual === 'text' }">
                    <input type="radio" name="chainFilter" id="text" autocomplete="off" :checked="selectedVisual === 'text'" v-on:click="changeSelectedVisual('text')">
                    <font-awesome-icon size="lg" class="mr-2" :icon="faFont" />
                    <span>Text</span>
                  </label>
                </div>
              </b-col>
            </b-row>
            <b-row class="chainViewer flex-grow flex-fill">
              <b-col>

              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import bListGroup from 'bootstrap-vue/es/components/list-group/list-group'
import bListGroupItem from 'bootstrap-vue/es/components/list-group/list-group-item'
import bDropdown from 'bootstrap-vue/es/components/dropdown/dropdown'
import bDropdownItem from 'bootstrap-vue/es/components/dropdown/dropdown-item'
import LogosAddress from '@/components/LogosAddress.vue'
import Lookups from '@/components/forge/lookups.vue'
import Requests from '@/components/forge/requests.vue'
import cloneDeep from 'lodash/cloneDeep'
import { faUser, faEllipsisVAlt, faCoins, faSearch, faWrench, faEye, faFont, faSpinner } from '@fortawesome/pro-light-svg-icons'

export default {
  name: 'workshop',
  data () {
    return {
      faUser,
      faEllipsisVAlt,
      faCoins,
      faSearch,
      faWrench,
      faEye,
      faFont,
      faSpinner,
      selected: 'requests',
      selectedVisual: 'visual',
      wallet: this.$wallet
    }
  },
  components: {
    bListGroup,
    bListGroupItem,
    bDropdown,
    bDropdownItem,
    LogosAddress,
    Lookups,
    Requests
  },
  computed: {
    ...mapState('settings', {
      mqttHost: state => state.mqttHost
    }),
    ...mapState('forge', {
      forgeAccounts: state => state.accounts,
      currentAccount: state => state.currentAccount,
      toasts: state => state.toasts,
      forgeTokens: state => state.tokens
    }),
    accounts: function () {
      return Array.from(Object.values(this.forgeAccounts))
    },
    tokens: function () {
      return Array.from(Object.values(this.forgeTokens))
    }
  },
  methods: {
    changeSelected: function (newSelected) {
      this.selected = newSelected
    },
    setCurrentAccount: function (address) {
      if (this.$wallet.currentAccountAddress !== address) {
        this.$wallet.currentAccountAddress = address
      }
    },
    replaceAddresses: function (msg) {
      for (let account of this.$wallet.accounts) {
        msg = msg.replace(new RegExp(account.address, 'g'), account.label)
      }
      return msg
    },
    removeAccount: function (address) {
      this.$wallet.removeAccount(address)
    },
    changeSelectedVisual: function (newSelected) {
      this.selectedVisual = newSelected
    },
    ...mapActions('forge',
      [
        'update',
        'setSeed'
      ]
    ),
    ...mapActions('mqtt', [
      'initalize',
      'unsubscribe',
      'subscribe'
    ])
  },
  created: function () {
    this.initalize({ url: this.mqttHost })
    this.setSeed(this.$wallet.seed)
  },
  watch: {
    wallet: {
      handler: function (newWallet, oldWallet) {
        for (let account in newWallet.accountsObject) {
          if (account) {
            this.subscribe(`account/${account}`)
          }
        }
        this.update(newWallet)
      },
      deep: true
    },
    toasts: function (newToasts, oldToasts) {
      if (newToasts.length > 0) {
        let newToast = cloneDeep(newToasts[newToasts.length - 1])
        newToast.message = this.replaceAddresses(newToast.message)
        this.$toasted.show(newToast.message, {
          theme: 'toasted-primary',
          position: 'bottom-right',
          duration: 5000,
          action: [
            {
              text: 'Cancel',
              onClick: (e, toastObject) => {
                toastObject.goAway(0)
              }
            },
            {
              text: 'View',
              href: `/${newToast.hash}`,
              target: '_blank'
            }
          ]
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
$bg-tertiary: rgb(230, 230, 230);
$bg-secondary: #FDFDFD;
$bg-primary: #F5F5F5;
$bg-white: #FFF;
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
  max-width: 265px;
  z-index: 1;
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
  overflow-y: scroll;
  max-height: calc(100vh - 123px);
}
.actionSelector::-webkit-scrollbar {
  background-color: transparent;
  width:16px
}
.actionSelector::-webkit-scrollbar-track {
  background-color: transparent;
}
.actionSelector::-webkit-scrollbar-track:hover {
  background-color:#f4f4f4;
}
.actionSelector::-webkit-scrollbar-thumb {
  background-color:#babac0;
  border-radius:16px;
  border:5px solid $bg-primary;
}
.actionSelector::-webkit-scrollbar-thumb:hover {
  background-color:#a0a0a5;
  border:4px solid #f4f4f4;
}
.actionSelector::-webkit-scrollbar-button {
  display:none;
}
.chainToggle {
  background: $bg-secondary;
}
.chainToggle > .col {
  z-index: 1;
  -webkit-box-shadow: 0 0.125rem 0rem rgba(0, 0, 0, 0.075) !important;
  box-shadow: 0 0.125rem 0rem rgba(0, 0, 0, 0.075) !important;
}
.chainViewer {
  background: $bg-tertiary;
}
</style>
<style lang="scss">
  .collapsedForm {
    border-top:1px solid rgba(0, 0, 0, 0.075);
    margin-left: 1.25rem;
    margin-right: 1.25rem;
    padding: 0;
    padding-bottom: 1.25rem;
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
