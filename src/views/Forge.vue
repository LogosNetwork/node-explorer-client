<template>
  <b-container fluid class="d-flex">
    <b-row class="flex-grow flex-fill">
      <b-col cols="3" class="accountPanel">
        Account / Token Selector
      </b-col>
      <b-col>
        <b-row class="h-100">
          <b-col cols="7" class="d-flex flex-column">
            <b-row class="actionToggle">
              <b-col>Action Toggles</b-col>
            </b-row>
            <b-row class="actionSelector flex-grow flex-fill">
              <b-col>Action Selector</b-col>
            </b-row>
          </b-col>
          <b-col cols="5" class="d-flex flex-column">
            <b-row class="chainToggle">
              <b-col>Chain Toggles</b-col>
            </b-row>
            <b-row class="chainViewer flex-grow flex-fill">
              <b-col>Chain Viewer</b-col>
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
Vue.use(Logos, { url: config.rpcHost, proxyURL: config.rpcProxy, debug: true })
Vue.use(Wallet)
export default {
  name: 'workshop',
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
$bg-tertiary: #ECEEF0;
$bg-secondary: #FDFDFD;
$bg-primary: #F7F8F9;
$bg-white: #FFF;
.accountPanel {
  background: $bg-secondary;
}
.actionToggle {
  background: $bg-secondary;
}
.actionSelector {
  background: $bg-primary;
}
.chainToggle {
  background: $bg-secondary;
}
.chainViewer {
  background: $bg-tertiary;
}
</style>
