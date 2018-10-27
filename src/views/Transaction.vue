<template>
  <div id="primary">
    <b-container>
      <b-row class="text-left pt-5">
        <b-col cols="12" md="8" class="mb-5">
          <h3 class="text-left" v-t="'transaction'"></h3>
          <code style="background-color:#FFF;color:#ff3860;padding:6px">{{transaction}}</code>
        </b-col>
      </b-row>
      <b-row v-if="!error && details !== null" class="mb-5">
        <b-col cols="12" class="text-left">
          <h4 class="text-left" v-t="'from'"></h4>
          <p v-if="details.type === 'send'"><router-link :to="details.account">{{details.account}}</router-link></p>
          <p v-if="details.type === 'receive'"><router-link :to="details.link_as_account">{{details.link_as_account}}</router-link></p>
          <h4 class="text-left" v-t="'to'"></h4>
          <p v-if="details.type === 'send'"><router-link :to="details.link_as_account">{{details.link_as_account}}</router-link></p>
          <p v-if="details.type === 'receive'"><router-link :to="details.account">{{details.account}}</router-link></p>
          <h4 class="text-left" v-t="'amount'"></h4>
          <p>{{details.amount}} Logos</p>
          <div v-if="details.previous !== '0000000000000000000000000000000000000000000000000000000000000000' && details.type === 'send'">
            <h4 class="text-left" v-t="'prevSend'"></h4>
            <p><router-link :to="details.previous">{{details.previous}}</router-link></p>
          </div>
          <div v-if="details.previous !== '0000000000000000000000000000000000000000000000000000000000000000' && details.type === 'receive'">
            <h4 class="text-left" v-t="'prevReceive'"></h4>
            <p><router-link :to="details.previous">{{details.previous}}</router-link></p>
          </div>
        </b-col>
      </b-row>
      <b-row v-if="!error && details !== null">
        <b-col cols="12" class="text-left">
          <h4 class="text-left" v-t="'prettyTransaction'"></h4>
          <codepad id='editor' class="text-left mb-3" v-if='details' :code='prettyDetails'/>
        </b-col>
      </b-row>
      <b-row v-if="error">
        <b-col cols="12" class="text-left">
          <h4 style="color:red">This transaction does not exist</h4>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Vue from 'vue'
import Logos from '../api/rpc'
import codepad from '@/components/codepad.vue'
Vue.use(Logos, { url: 'http://18.212.15.104:55000', debug: true })

let transaction = null
let details = null
let prettyDetails = null
let error = null
export default {
  name: 'transaction',
  components: {
    codepad
  },
  created: function () {
    this.transaction = this.$route.params.transaction
    this.$Logos.transactions.info(this.transaction).then(val => {
      if (val && !val.error) {
        this.details = val
        this.details.type = val.type
        if (this.details.type === 'receive') {
          this.$Logos.transactions.info(this.details.link).then(val => {
            this.details.link_as_account = val.account.replace('xrb_', 'lgs_')
            this.prettyDetails = JSON.stringify(this.details, null, ' ')
          })
        } else {
          this.details.link_as_account = this.details.link_as_account.replace('xrb_', 'lgs_')
          this.prettyDetails = JSON.stringify(this.details, null, ' ')
        }
        this.details.amount = parseFloat(Number(this.$Logos.convert.fromReason(this.details.amount, 'LOGOS')).toFixed(5))
        this.details.account = this.details.account.replace('xrb_', 'lgs_')
      } else {
        if (val && val.error) { this.error = val.error } else { this.error = '404' }
      }
    })
  },
  data () {
    return {
      transaction: transaction,
      details: details,
      prettyDetails: prettyDetails,
      error: error
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.transaction = to.params.transaction
    this.$Logos.transactions.info(this.transaction).then(val => {
      if (val && !val.error) {
        this.details = val
        this.details.type = val.type
        if (this.details.type === 'receive') {
          this.$Logos.transactions.info(this.details.link).then(val => {
            this.details.link_as_account = val.account.replace('xrb_', 'lgs_')
            this.prettyDetails = JSON.stringify(this.details, null, ' ')
          })
        } else {
          this.details.link_as_account = this.details.link_as_account.replace('xrb_', 'lgs_')
          this.prettyDetails = JSON.stringify(this.details, null, ' ')
        }
        this.details.amount = parseFloat(Number(this.$Logos.convert.fromReason(this.details.amount, 'LOGOS')).toFixed(5))
        this.details.account = this.details.account.replace('xrb_', 'lgs_')
      } else {
        if (val && val.error) { this.error = val.error } else { this.error = '404' }
      }
    })
    next()
  }
}
</script>

<style scoped lang="scss">
</style>
