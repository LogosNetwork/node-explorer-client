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
import { mapActions, mapState } from 'vuex'
import codepad from '@/components/codepad.vue'

export default {
  components: {
    codepad
  },
  computed: {
    ...mapState('settings', {
      mqttHost: state => state.mqttHost
    }),
    ...mapState('transaction', {
      transaction: state => state.transaction,
      details: state => state.details,
      prettyDetails: state => state.prettyDetails,
      error: state => state.error
    })
  },
  methods: {
    ...mapActions('transaction', [
      'getTransactionInfo',
      'reset'
    ])
  },
  created: function () {
    this.getTransactionInfo(this.$route.params.transaction)
  },
  beforeRouteUpdate (to, from, next) {
    this.reset()
    this.getTransactionInfo(to.params.transaction)
    next()
  }
}
</script>

<style scoped lang="scss">
</style>
