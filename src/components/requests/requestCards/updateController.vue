<template>
  <b-card no-body class="text-left">
    <b-card-body>
      <b-card-title>
        <div class="d-flex justify-content-between">
          <div>
            Update Controller
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
        <strong>Action: </strong>{{requestInfo.action}}
      </b-list-group-item>
      <b-list-group-item>
        <strong>Controller: </strong><LogosAddress :address="requestInfo.controller.account" :force="small" /><br/>
        <ul v-if="requestInfo.controller.privileges.length > 0">
          <li v-for="privilege in requestInfo.controller.privileges" :key="privilege">
            {{requestInfo.action === 'add' ? 'added' : 'removed'}} {{privilege}}
          </li>
        </ul>
        <span v-else-if="requestInfo.action === 'remove'">
          Was Removed from the token's controllers
        </span>
        <span v-else-if="requestInfo.action === 'add'">
          Was Added to the token's controllers with no permissions
        </span>
      </b-list-group-item>
    </b-list-group>
  </b-card>
</template>

<script>
import token from '@/components/requests/token.vue'
import { BCardBody, BCardTitle, BCardSubTitle, BCardText, BListGroup, BListGroupItem } from 'bootstrap-vue'

export default {
  name: 'updateController',
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
