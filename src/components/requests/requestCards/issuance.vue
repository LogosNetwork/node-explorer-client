<template>
  <b-card no-body class="text-left">
    <b-card-body>
      <b-card-title>
        <div class="d-flex justify-content-between">
          <div>
            Token Issuance Request
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
      <small class="text-muted">Values below only represent the token when it was first issued</small>
    </b-card-body>
    <b-list-group flush>
      <b-list-group-item>
        <strong>Token Account: </strong><LogosAddress :address="requestInfo.tokenInfo.tokenAccount" />
      </b-list-group-item>
      <b-list-group-item>
        <strong>Issued By: </strong><LogosAddress :address="requestInfo.origin" />
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
        <strong>Controller: </strong><LogosAddress :address="controller.account" /><br/>
        <ul class="mb-0" v-if="controller.privileges.length > 0">
          <li v-for="privilege in controller.privileges" :key="controller.account+privilege">
            {{privilege}}
          </li>
        </ul>
      </b-list-group-item>
      <b-list-group-item v-on:click.prevent>
        <strong>Issuer Info</strong><br/>
        <codepad class="text-left" :code="requestInfo.prettyInfo" :thin="true"/>
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
import codepad from '@/components/codepad.vue'

export default {
  name: 'issuance',
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
    codepad,
    token
  }
}
</script>
<style lang="scss" scoped>
  .timestamp {
    font-size: 1rem
  }
</style>
