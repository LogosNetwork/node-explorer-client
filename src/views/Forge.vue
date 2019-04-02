<template>
  <b-container fluid class="d-flex">
    <b-row class="flex-grow flex-fill">
      <b-col cols="auto" class="accountPanel">
        <div class="d-flex justify-content-between mt-3 mb-3 align-items-center font-weight-bold">
          <h4 class="mb-0">Accounts</h4>
          <b-button class="font-weight-bolder" variant="link">+ New</b-button>
        </div>
        <div>
          <b-list-group flush>
            <b-list-group-item class="d-flex justify-content-between align-items-center" button>
              <span>
                <font-awesome-icon size="lg" class="mr-2" :icon="faUser" />
                <LogosAddress class="mr-2" :inactive="true" :force="true" address="lgs_1ggscsb3ndafjxz9ymczuziiuys5ct64tnmsjuenbio9gnmqqsznh6poxge9" />
              </span>
            </b-list-group-item>
          </b-list-group>
        </div>
        <div class="d-flex justify-content-between mt-3 align-items-center font-weight-bold">
          <h4 class="mb-0">Tokens</h4>
          <b-button class="font-weight-bolder" variant="link">+ New</b-button>
        </div>
        <div>
          <b-list-group flush>
            <b-list-group-item class="d-flex justify-content-between align-items-center" button>
              <span>
                <font-awesome-icon size="lg" class="mr-2" :icon="faCoins" />
                Pyr
              </span>
            </b-list-group-item>
          </b-list-group>
        </div>
      </b-col>
      <b-col>
        <b-row class="h-100">
          <b-col cols="8" class="d-flex flex-column">
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
          <b-col cols="4" class="d-flex flex-column">
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
import Vue from 'vue'
import Logos from '../api/rpc'
import Wallet from '../api/wallet'
import config from '../../config'
import bListGroup from 'bootstrap-vue/es/components/list-group/list-group'
import bListGroupItem from 'bootstrap-vue/es/components/list-group/list-group-item'
import LogosAddress from '@/components/LogosAddress.vue'
import Lookups from '@/components/forge/lookups.vue'
import Requests from '@/components/forge/requests.vue'
import { faUser, faEllipsisV, faCoins, faSearch, faWrench, faEye, faFont } from '@fortawesome/pro-light-svg-icons'

Vue.use(Logos, { url: config.rpcHost, proxyURL: config.rpcProxy, debug: true })
Vue.use(Wallet)
export default {
  name: 'workshop',
  data () {
    return {
      faUser,
      faEllipsisV,
      faCoins,
      faSearch,
      faWrench,
      faEye,
      faFont,
      selected: 'requests',
      selectedVisual: 'visual'
    }
  },
  components: {
    bListGroup,
    bListGroupItem,
    LogosAddress,
    Lookups,
    Requests
  },
  methods: {
    changeSelected: function (newSelected) {
      this.selected = newSelected
    },
    changeSelectedVisual: function (newSelected) {
      this.selectedVisual = newSelected
    }
  },
  created: function () {
    this.wallet = new this.$Wallet({
      mqtt: config.mqttHost,
      rpc: {
        proxy: config.rpcProxy,
        delegates: Object.values(config.delegates)
      }
    })
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
.accountPanel {
  background: $bg-secondary;
  min-width: 260px;
}
.actionToggle {
  background: $bg-secondary;
}
.actionSelector {
  background: $bg-primary;
  overflow-y: auto;
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
.chainViewer {
  background: $bg-tertiary;
}
</style>
