<template>
  <div class="mb-3">
    <b-link class="cardLink" :to="'/'+requestInfo.hash">
      <b-card no-body class="text-left">
        <b-card-body>
          <b-card-title>
            <div class="d-flex justify-content-between">
              <div>
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
    </b-link>
  </div>
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
    requestInfo: Object
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
  .cardLink {
    color:#525f7f;
  }
  .cardLink:hover {
    text-decoration: none;
  }
  .cardLink > .card {
    -webkit-transition: all .3s;
    -o-transition: all .3s;
    transition: all .3s;
  }
  .cardLink:hover > .card {
    box-shadow: 0 10px 30px -5px rgba(10,16,34,.2);
  }
</style>
