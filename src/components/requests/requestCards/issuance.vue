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
        <strong>Token Account: </strong><LogosAddress v-if="requestInfo.tokenInfo && requestInfo.tokenInfo.tokenAccount" :address="requestInfo.tokenInfo.tokenAccount" :force="small" />
      </b-list-group-item>
      <b-list-group-item>
        <strong>Issued By: </strong><LogosAddress :address="originAccount" :force="small" />
      </b-list-group-item>
      <b-list-group-item>
        <strong>Name: </strong>{{requestInfo.name}}
      </b-list-group-item>
      <b-list-group-item>
        <strong>Symbol: </strong>{{requestInfo.symbol}}
      </b-list-group-item>
      <b-list-group-item>
        <strong>Total Supply: </strong>{{totalSupply}} {{requestInfo.symbol}}
      </b-list-group-item>
      <b-list-group-item>
        <span v-if="feeType === 'flat'">
          <strong>Fee Rate: </strong>{{feeRate}} base units of {{requestInfo.symbol}}
        </span>
        <span v-if="feeType === 'percentage'">
          <strong>Fee Rate: </strong>{{feeRate}}%
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
import { BCardBody, BCardTitle, BCardSubTitle, BCardText, BListGroup, BListGroupItem } from 'bootstrap-vue'

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
    BCardBody,
    BCardTitle,
    BCardSubTitle,
    BCardText,
    BListGroup,
    BListGroupItem,
    'LogosAddress': () => import(/* webpackChunkName: "LogosAddress" */'@/components/LogosAddress.vue'),
    'token': token,
    'codepad': () => import(/* webpackChunkName: "Codepad" */ '@/components/codepad.vue')
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
    },
    totalSupply () {
      if (typeof this.requestInfo.totalSupplyInToken !== 'undefined') {
        return this.requestInfo.totalSupplyInToken
      } else if (typeof this.requestInfo.totalSupply !== 'undefined') {
        return this.requestInfo.totalSupply
      } else {
        return this.requestInfo.total_supply
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .timestamp {
    font-size: 1rem
  }
</style>
