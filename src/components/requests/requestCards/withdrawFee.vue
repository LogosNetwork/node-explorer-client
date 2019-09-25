<template>
  <b-card no-body class="text-left">
    <b-card-body>
      <b-card-title>
        <div class="d-flex justify-content-between">
          <div>
            Withdraw Fee
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
      <token :tokenInfo="requestInfo.tokenInfo" :origin="originAccount" :small="small" />
    </b-card-body>
    <b-list-group flush>
      <b-list-group-item>
        <font-awesome-icon :icon="faArrowDown" class="text-success mr-2"/>
        <LogosAddress class="mr-2" :address="requestInfo.transaction.destination" :force="small" />
        <span class="mr-2">received</span>
        <span v-if="requestInfo.transaction.amountInToken" class="text-success mr-2">{{requestInfo.transaction.amountInToken}}</span>
        <span v-if="typeof requestInfo.transaction.amountInToken === 'undefined'" class="text-success mr-2">{{requestInfo.transaction.amount}}</span>
        <span>{{requestInfo.tokenInfo.symbol}}</span>
      </b-list-group-item>
    </b-list-group>
  </b-card>
</template>

<script>
import { faArrowDown } from '@fortawesome/pro-light-svg-icons'
import token from '@/components/requests/token.vue'
import { BCardBody, BCardTitle, BCardSubTitle, BCardText, BListGroup, BListGroupItem } from 'bootstrap-vue'

export default {
  name: 'withdrawFee',
  data () {
    return {
      faArrowDown
    }
  },
  props: {
    requestInfo: Object,
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
    'LogosAddress': () => import(/* webpackChunkName: "LogosAddress" */'@/components/LogosAddress.vue'),
    'token': token
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
