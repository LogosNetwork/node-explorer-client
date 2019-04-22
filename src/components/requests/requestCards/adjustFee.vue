<template>
  <b-card no-body class="text-left">
    <b-card-body>
      <b-card-title>
        <div class="d-flex justify-content-between">
          <div>
            Fee Adjustment
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
      <b-list-group-item>
        <strong>Fee Type: </strong>{{requestInfo.fee_type}}
      </b-list-group-item>
      <b-list-group-item>
        <span v-if="requestInfo.fee_type.toLowerCase() === 'flat'">
          <strong>Fee Rate: </strong>{{requestInfo.fee_rate}} base units of {{requestInfo.tokenInfo.symbol}}
        </span>
        <span v-if="requestInfo.fee_type.toLowerCase() === 'percentage'">
          <strong>Fee Rate: </strong>{{requestInfo.fee_rate}}%
        </span>
      </b-list-group-item>
    </b-list-group>
  </b-card>
</template>

<script>

export default {
  name: 'adjustFee',
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
    'token': () => import(/* webpackChunkName: "token" */'@/components/requests/token.vue')
  }
}
</script>
<style lang="scss" scoped>
  .timestamp {
    font-size: 1rem
  }
</style>
