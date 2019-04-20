<template>
  <b-card no-body class="text-left">
    <b-card-body>
      <b-card-title>
        <div class="d-flex justify-content-between">
          <div>
            Token Info Update
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
      <token :tokenInfo="requestInfo.tokenInfo" :origin="requestInfo.origin" :small="small" />
    </b-card-body>
    <b-list-group flush>
      <b-list-group-item v-on:click.prevent>
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
import token from '@/components/requests/token.vue'
import codepad from '@/components/codepad.vue'

export default {
  name: 'issuerInfo',
  props: {
    requestInfo: Object,
    small: {
      type: Boolean,
      default: false
    }
  },
  components: {
    'b-card-body': bCardBody,
    'b-card-title': bCardTitle,
    'b-card-subtitle': bCardSubtitle,
    'b-card-text': bCardText,
    'b-list-group': bListGroup,
    'b-list-group-item': bListGroupItem,
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
