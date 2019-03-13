<template>
  <b-card no-body class="text-left">
    <b-card-body>
      <b-card-title>
        <div class="d-flex justify-content-between">
          <div v-if="account && requestInfo.origin !== account">
            Token Recieve Request
          </div>
          <div v-if="!account || (account && requestInfo.origin === account)">
            Token Send Request
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
      <token :tokenInfo="requestInfo.tokenInfo" />
      <b-card-text class="mt-3">
        <icon name="paper-plane" class="text-danger mr-2"></icon>
        <LogosAddress class="mr-2" :address="requestInfo.origin" />
        <span class="mr-2">sent</span>
        <span v-if="requestInfo.totalAmountInToken" class="text-danger mr-2">{{requestInfo.totalAmountInToken}}</span>
        <span v-if="typeof requestInfo.totalAmountInToken === 'undefined'" class="text-danger mr-2">{{requestInfo.totalAmount}}</span>
        <span>{{requestInfo.tokenInfo.symbol}}</span>
      </b-card-text>
    </b-card-body>
    <b-list-group flush>
      <b-list-group-item v-for="transaction in requestInfo.transactions" :key="transaction.hash">
        <icon name="arrow-down" class="text-success mr-2"></icon>
        <LogosAddress class="mr-2" :address="transaction.destination" />
        <span class="mr-2">received</span>
        <span v-if="transaction.amountInToken" class="text-success mr-2">{{transaction.amountInToken}}</span>
        <span v-if="typeof transaction.amountInToken === 'undefined'" class="text-success mr-2">{{transaction.amount}}</span>
        <span>{{requestInfo.tokenInfo.symbol}}</span>
      </b-list-group-item>
    </b-list-group>
  </b-card>
</template>

<script>
import bCardBody from 'bootstrap-vue/es/components/card/card-body'
import bCardTitle from 'bootstrap-vue/es/components/card/card-title'
import bCardSubtitle from 'bootstrap-vue/es/components/card/card-sub-title'
import bCardText from 'bootstrap-vue/es/components/card/card-text'
import bListGroup from 'bootstrap-vue/es/components/list-group/list-group'
import bListGroupItem from 'bootstrap-vue/es/components/list-group/list-group-item'
import LogosAddress from '@/components/LogosAddress.vue'
import token from '@/components/requests/token.vue'
import 'vue-awesome/icons/paper-plane'
import 'vue-awesome/icons/arrow-down'

export default {
  name: 'tokenSend',
  props: {
    requestInfo: Object,
    account: String
  },
  components: {
    'b-card-body': bCardBody,
    'b-card-title': bCardTitle,
    'b-card-subtitle': bCardSubtitle,
    'b-card-text': bCardText,
    'b-list-group': bListGroup,
    'b-list-group-item': bListGroupItem,
    LogosAddress,
    token
  }
}
</script>
<style lang="scss" scoped>
  .timestamp {
    font-size: 1rem
  }
</style>
