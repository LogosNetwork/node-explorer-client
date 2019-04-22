<template>
  <b-card no-body class="text-left">
    <b-card-body>
      <b-card-title>
        <div class="d-flex justify-content-between">
          <div v-if="account && requestInfo.origin !== account">
            Recieve
          </div>
          <div v-if="!account || (account && requestInfo.origin === account)">
            Send
          </div>
          <div v-if="requestInfo.createdAt" class="timestamp text-right">
            <small>
              <span>{{ requestInfo.createdAt | moment('ddd, D MMM YYYY h:mm:ssa') }}</span>
            </small>
          </div>
          <div v-if="requestInfo.timestamp" class="timestamp text-right">
            <small>
              <span>{{ parseInt(requestInfo.timestamp) | moment('ddd, D MMM YYYY h:mm:ssa') }}</span>
            </small>
          </div>
        </div>
      </b-card-title>
      <b-card-text>
        <font-awesome-icon :icon="faPaperPlane" class="text-danger mr-2"/>
        <LogosAddress class="mr-2" :address="requestInfo.origin" :force="small" />
        <span class="mr-2">sent</span>
        <span class="text-danger">{{requestInfo.totalAmountLogos}} Logos</span>
      </b-card-text>
    </b-card-body>
    <b-list-group flush>
      <b-list-group-item v-for="transaction in requestInfo.transactions" :key="transaction.hash">
        <font-awesome-icon :icon="faArrowDown" class="text-success mr-2"/>
        <LogosAddress class="mr-2" :address="transaction.destination" :force="small" />
        <span class="mr-2">received</span>
        <span class="text-success">{{transaction.amountInLogos}} Logos</span>
      </b-list-group-item>
    </b-list-group>
  </b-card>
</template>

<script>
import { faPaperPlane, faArrowDown } from '@fortawesome/pro-light-svg-icons'
import Vue from 'vue'
import VueMoment from 'vue-moment'
Vue.use(VueMoment)

export default {
  name: 'Send',
  data () {
    return {
      faPaperPlane,
      faArrowDown
    }
  },
  props: {
    requestInfo: Object,
    account: String,
    small: {
      type: Boolean,
      default: false
    }
  },
  components: {
    'b-card-body': () => import(/* webpackChunkName: "b-card-body" */'bootstrap-vue/es/components/card/card-body'),
    'b-card-title': () => import(/* webpackChunkName: "b-card-title" */'bootstrap-vue/es/components/card/card-title'),
    'b-card-subtitle': () => import(/* webpackChunkName: "b-card-subtitle" */'bootstrap-vue/es/components/card/card-sub-title'),
    'b-card-text': () => import(/* webpackChunkName: "b-card-text" */'bootstrap-vue/es/components/card/card-text'),
    'b-list-group': () => import(/* webpackChunkName: "b-list-group" */'bootstrap-vue/es/components/list-group/list-group'),
    'b-list-group-item': () => import(/* webpackChunkName: "b-list-group-item" */'bootstrap-vue/es/components/list-group/list-group-item'),
    'LogosAddress': () => import(/* webpackChunkName: "LogosAddress" */'@/components/LogosAddress.vue')
  }
}
</script>
<style lang="scss" scoped>
  .timestamp {
    font-size: 1rem
  }
</style>
