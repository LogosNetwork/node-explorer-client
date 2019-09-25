<template>
  <b-card no-body class="text-left">
    <b-card-body>
      <b-card-title>
        <div class="d-flex justify-content-between">
          <div>
            Fee Adjustment
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
        <strong>Fee Type: </strong>{{feeType}}
      </b-list-group-item>
      <b-list-group-item>
        <span v-if="feeType === 'flat'">
          <strong>Fee Rate: </strong>{{feeRate}} base units of {{requestInfo.tokenInfo.symbol}}
        </span>
        <span v-if="feeType === 'percentage'">
          <strong>Fee Rate: </strong>{{feeRate}}%
        </span>
      </b-list-group-item>
    </b-list-group>
  </b-card>
</template>

<script>
import token from '@/components/requests/token.vue'
import { BCardBody, BCardTitle, BCardSubTitle, BCardText, BListGroup, BListGroupItem } from 'bootstrap-vue'

export default {
  name: 'adjustFee',
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
    'token': token
  },
  computed: {
    feeRate () {
      return this.requestInfo.feeRate ? this.requestInfo.feeRate : this.requestInfo.fee_rate
    },
    feeType () {
      return this.requestInfo.feeType ? this.requestInfo.feeType.toLowerCase() : this.requestInfo.fee_type.toLowerCase()
    },
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
