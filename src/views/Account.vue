<template>
  <div id="primary">
    <b-container>
      <b-row class="text-left pt-5">
        <b-col cols="12" md="8" class="mb-5">
          <h4 class="text-left" v-t="'account'"></h4>
          <code style="background-color:#FFF;color:#ff3860;padding:6px">{{account}}</code>
          <h3 v-if="!error" class="pt-3" style="color:green">{{balance}} LOGOS</h3>
          <h4 v-if="error" class="pt-3" style="color:red">This account has not been opened yet</h4>
        </b-col>
        <b-col cols="12" md="4" class="mb-5">
            <qrcode :value="'lgs:'+account" :options="{ size: 200 }"></qrcode>
        </b-col>
      </b-row>
      <b-row v-if="!error">
        <b-col cols="12" class="text-left">
            <p class="text-truncate">Representaive: <a :href="'/'+representaive">{{representaive}}</a></p>
            <p class="text-truncate">Last Transaction: <a :href="'/'+frontier">{{frontier}}</a></p>
            <p class="text-truncate">Last Modified: <span>{{ lastModified | moment("MMM Do, h:mm:ss a") }}</span></p>
            <p>Total block count: {{blockCount}}</p>
        </b-col>
      </b-row>

    </b-container>
  </div>
</template>

<script>
import Vue from 'vue'
import Logos from '../logosPackages/rpc'
import VueQrcode from '@xkeshi/vue-qrcode'
Vue.use(Logos, { url: 'http://52.215.106.54:55000', debug: true })
Vue.component(VueQrcode.name, VueQrcode)

let frontier = null
let openBlock = null
let representaive = null
let balance = 0
let account = null
let error = null
let blockCount = 0
let lastModified = 0
export default {
  name: 'account',
  components: {},
  created: function () {
    this.$Logos.accounts.info(account.replace('lgs_', 'xrb_')).then(val => {
      if (!val.error) {
        this.frontier = val.frontier
        this.openBlock = val.open_block
        this.$Logos.accounts.get(val.representative_block).then(val => {
          this.representaive = val.account.replace('xrb_', 'lgs_')
        })
        this.balance = parseFloat(this.$Logos.convert.fromReason(val.balance, 'LOGOS'), 4)
        this.blockCount = val.block_count
        this.lastModified = parseInt(val.modified_timestamp)
      } else {
        this.error = val.error
      }
    })
  },
  data () {
    account = this.$route.params.account
    return {
      frontier: frontier,
      error: error,
      openBlock: openBlock,
      representaive: representaive,
      balance: balance,
      blockCount: blockCount,
      lastModified: lastModified,
      account: account
    }
  }
}
</script>

<style scoped lang="scss">
</style>
