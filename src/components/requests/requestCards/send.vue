<template>
  <b-card no-body class="text-left">
    <b-card-body>
      <b-card-title>
        <div class="d-flex justify-content-between">
          <div v-if="account && originAccount !== account">
            Recieve
          </div>
          <div v-if="!account || (account && originAccount === account)">
            Send
          </div>
          <div v-if="requestInfo.createdAt" class="timestamp text-right">
            <small>
              <span>{{ requestInfo.createdAt | moment('calendar') }}</span>
            </small>
          </div>
          <div v-if="requestInfo.timestamp" class="timestamp text-right">
            <small>
              <span>{{ parseInt(requestInfo.timestamp) | moment('calendar') }}</span>
            </small>
          </div>
        </div>
      </b-card-title>
      <b-card-text>
        <font-awesome-icon :icon="faPaperPlane" class="text-danger mr-2"/>
        <LogosAddress class="mr-2" :address="originAccount" :force="small" />
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
import { BCardBody, BCardTitle, BCardSubTitle, BCardText, BListGroup, BListGroupItem } from 'bootstrap-vue'

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
    BCardBody,
    BCardTitle,
    BCardSubTitle,
    BCardText,
    BListGroup,
    BListGroupItem,
    'LogosAddress': () => import(/* webpackChunkName: "LogosAddress" */'@/components/LogosAddress.vue')
  },
  computed: {
    originAccount () {
      return this.requestInfo.originAccount ? this.requestInfo.originAccount : this.requestInfo.origin
    }
  }
}
</script>
<style lang="scss" scoped>
  .timestamp {
    font-size: 1rem
  }
</style>
