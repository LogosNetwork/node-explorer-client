<template>
  <b-card no-body class="text-left">
    <b-card-body>
      <b-card-title>
        <div class="d-flex justify-content-between">
          <div>
            Immute Setting
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
        <strong>Immute: </strong>{{requestInfo.setting}}
      </b-list-group-item>
    </b-list-group>
  </b-card>
</template>

<script>
import token from '@/components/requests/token.vue'
import { BCardBody, BCardTitle, BCardSubTitle, BCardText, BListGroup, BListGroupItem } from 'bootstrap-vue'

export default {
  name: 'immuteSetting',
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
