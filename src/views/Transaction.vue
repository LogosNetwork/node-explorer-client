<template>
  <div id="primary">
    <b-container>
      <b-row class="text-left pt-5">
        <b-col cols="12" md="8" class="mb-5">
          <h4 class="text-left" v-t="'transaction'"></h4>
          <code style="background-color:#FFF;color:#ff3860;padding:6px">{{transaction}}</code>
        </b-col>
        <b-col cols="12" md="4" class="mb-5">
        </b-col>
      </b-row>
      <b-row v-if="!error">
        <b-col cols="12" class="text-left">
            <p class="text-truncate">Stuff</p>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Vue from 'vue'
import Logos from '../logosPackages/rpc'
Vue.use(Logos, { url: 'http://52.215.106.54:55000', debug: true })

let transaction = null
let error = null
export default {
  name: 'transaction',
  components: {},
  created: function () {
    console.log(transaction)
    this.$Logos.blocks.info(transaction).then(val => {
      if (val && !val.error) {
        console.log(val)
      } else {
        if (val && val.error) { this.error = val.error }
      }
    })
  },
  data () {
    transaction = this.$route.params.transaction
    return {
      transaction: transaction,
      error: error
    }
  }
}
</script>

<style scoped lang="scss">
</style>
