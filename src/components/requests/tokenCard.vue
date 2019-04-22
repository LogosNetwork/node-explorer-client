<template>
  <div class="mb-3 shadow-sm">
    <b-link class="cardLink" :to="'/'+tokenInfo.tokenAccount">
      <b-card no-body class="text-left">
        <b-card-body>
          <b-card-title>
            <div class="d-flex justify-content-between">
              <token :tokenInfo="tokenInfo" />
              <div v-if="tokenInfo.createdAt" class="timestamp text-right">
                <small>
                  <span>Created on {{ tokenInfo.createdAt | moment('ddd, D MMM YYYY') }}</span>
                </small>
              </div>
            </div>
          </b-card-title>
          <b-card-text v-if="typeof tokenInfo.totalSupplyInToken !== 'undefined'">
            <strong>Total Supply: </strong>{{tokenInfo.totalSupplyInToken}} {{tokenInfo.symbol}}
          </b-card-text>
          <b-card-text v-if="typeof tokenInfo.totalSupplyInToken === 'undefined'">
            <strong>Total Supply: </strong>{{tokenInfo.total_supply}} {{tokenInfo.symbol}}
          </b-card-text>
          <b-card-text v-if="tokenInfo.fee_type.toLowerCase() === 'flat'">
            <strong>Fee Rate: </strong>{{tokenInfo.fee_rate}} base units of {{tokenInfo.symbol}}
          </b-card-text>
          <b-card-text v-if="tokenInfo.fee_type.toLowerCase() === 'percentage'">
            <strong>Fee Rate: </strong>{{tokenInfo.fee_rate}}% of each token_send
          </b-card-text>
        </b-card-body>
      </b-card>
    </b-link>
  </div>
</template>

<script>
import Vue from 'vue'
import VueMoment from 'vue-moment'
Vue.use(VueMoment)

export default {
  name: 'tokenCard',
  props: {
    tokenInfo: Object
  },
  components: {
    'b-card-body': () => import(/* webpackChunkName: "b-card-body" */'bootstrap-vue/es/components/card/card-body'),
    'b-card-title': () => import(/* webpackChunkName: "b-card-title" */'bootstrap-vue/es/components/card/card-title'),
    'b-card-text': () => import(/* webpackChunkName: "b-card-text" */'bootstrap-vue/es/components/card/card-text'),
    'token': () => import(/* webpackChunkName: "token" */'@/components/requests/token.vue')
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
  .list-group-item {
    background-color: inherit;
  }
  .cardLink > .card {
    -webkit-transition: all .3s;
    -o-transition: all .3s;
    transition: all .3s;
    border: 0px;
  }
  .cardLink:hover > .card {
    box-shadow: 0 10px 30px -5px rgba(10,16,34,.2);
  }
</style>
