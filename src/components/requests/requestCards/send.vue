<template>
  <b-card no-body class="text-left">
    <b-card-body>
      <b-card-title>
        <div class="d-flex justify-content-between">
          <div v-if="account && requestInfo.origin !== account">
            Recieve Request
          </div>
          <div v-if="!account || (account && requestInfo.origin === account)">
            Send Request
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
        <LogosAddress class="mr-2" :address="requestInfo.origin" />
        <span class="mr-2">sent</span>
        <span class="text-danger">{{requestInfo.totalAmountLogos}} Logos</span>
      </b-card-text>
    </b-card-body>
    <b-list-group flush>
      <b-list-group-item v-for="transaction in requestInfo.transactions" :key="transaction.hash">
        <font-awesome-icon :icon="faArrowDown" class="text-success mr-2"/>
        <LogosAddress class="mr-2" :address="transaction.destination" />
        <span class="mr-2">received</span>
        <span class="text-success">{{transaction.amountInLogos}} Logos</span>
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
import { faPaperPlane, faArrowDown } from '@fortawesome/pro-light-svg-icons'

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
    account: String
  },
  components: {
    'b-card-body': bCardBody,
    'b-card-title': bCardTitle,
    'b-card-subtitle': bCardSubtitle,
    'b-card-text': bCardText,
    'b-list-group': bListGroup,
    'b-list-group-item': bListGroupItem,
    LogosAddress
  }
}
</script>
<style lang="scss" scoped>
  .timestamp {
    font-size: 1rem
  }
</style>
