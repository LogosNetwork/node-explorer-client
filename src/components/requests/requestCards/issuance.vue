<template>
  <b-card no-body class="text-left">
    <b-card-body>
      <b-card-title>
        <div class="d-flex justify-content-between">
          <div>
            Issuance
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
      <token :tokenInfo="requestInfo.tokenInfo" :small="small" />
      <small class="text-muted">Values below only represent the token when it was first issued</small>
    </b-card-body>
    <b-list-group flush>
      <b-list-group-item>
        <strong>Token Account: </strong><LogosAddress :address="requestInfo.tokenInfo.tokenAccount" :force="small" />
      </b-list-group-item>
      <b-list-group-item>
        <strong>Issued By: </strong><LogosAddress :address="requestInfo.origin" :force="small" />
      </b-list-group-item>
      <b-list-group-item>
        <strong>Name: </strong>{{requestInfo.name}}
      </b-list-group-item>
      <b-list-group-item>
        <strong>Symbol: </strong>{{requestInfo.symbol}}
      </b-list-group-item>
      <b-list-group-item>
        <span v-if="typeof requestInfo.totalSupplyInToken !== 'undefined'">
          <strong>Total Supply: </strong>{{requestInfo.totalSupplyInToken}} {{requestInfo.symbol}}
        </span>
        <span v-if="typeof requestInfo.totalSupplyInToken === 'undefined'">
          <strong>Total Supply: </strong>{{requestInfo.total_supply}} {{requestInfo.symbol}}
        </span>
      </b-list-group-item>
      <b-list-group-item>
        <span v-if="requestInfo.fee_type.toLowerCase() === 'flat'">
          <strong>Fee Rate: </strong>{{requestInfo.fee_rate}} base units of {{requestInfo.symbol}}
        </span>
        <span v-if="requestInfo.fee_type.toLowerCase() === 'percentage'">
          <strong>Fee Rate: </strong>{{requestInfo.fee_rate}}%
        </span>
      </b-list-group-item>
      <b-list-group-item v-if="requestInfo.settings.length > 0">
        <strong>Settings: </strong>
        <ul class="mb-0">
          <li v-for="setting in requestInfo.settings" :key="'set'+setting">
            {{setting}}
          </li>
        </ul>
      </b-list-group-item>
      <b-list-group-item v-for="controller in requestInfo.controllers" :key="requestInfo.hash+'controller'+controller.account">
        <strong>Controller: </strong><LogosAddress :address="controller.account" :force="small" /><br/>
        <ul class="mb-0" v-if="controller.privileges.length > 0">
          <li v-for="privilege in controller.privileges" :key="controller.account+privilege">
            {{privilege}}
          </li>
        </ul>
      </b-list-group-item>
      <b-list-group-item>
        <strong>Issuer Info</strong><br/>
        <codepad class="text-left" :code="requestInfo.prettyInfo" :thin="true"/>
      </b-list-group-item>
    </b-list-group>
  </b-card>
</template>

<script>
import token from '@/components/requests/token.vue'

export default {
  name: 'issuance',
  props: {
    requestInfo: Object,
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
    'LogosAddress': () => import(/* webpackChunkName: "LogosAddress" */'@/components/LogosAddress.vue'),
    'token': token,
    'codepad': () => import(/* webpackChunkName: "Codepad" */ '@/components/codepad.vue')
  }
}
</script>
<style lang="scss" scoped>
  .timestamp {
    font-size: 1rem
  }
</style>
