<template>
  <b-card no-body class="text-left">
    <b-card-body>
      <b-card-title>
        <div class="d-flex justify-content-between">
          <div>
            Mint Tokens
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
      <token :tokenInfo="requestInfo.tokenInfo" :origin="requestInfo.origin" :small="small" />
    </b-card-body>
    <b-list-group flush>
      <b-list-group-item>
        <font-awesome-icon :icon="faMagic" class="text-success mr-2"/>
        <strong class="mr-2">Minted</strong>
        <span v-if="requestInfo.amountInToken" class="text-success mr-2">{{requestInfo.amountInToken}}</span>
        <span v-if="typeof requestInfo.amountInToken === 'undefined'" class="text-success mr-2">{{requestInfo.amount}}</span>
        <span>{{requestInfo.tokenInfo.symbol}}</span>
      </b-list-group-item>
    </b-list-group>
  </b-card>
</template>

<script>
import { faMagic } from '@fortawesome/pro-light-svg-icons'
import token from '@/components/requests/token.vue'
import { BCardBody, BCardTitle, BCardSubTitle, BCardText, BListGroup, BListGroupItem } from 'bootstrap-vue'

export default {
  name: 'issueAdditional',
  data () {
    return {
      faMagic
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
    'token': token
  }
}
</script>
<style lang="scss" scoped>
  .timestamp {
    font-size: 1rem
  }
</style>
