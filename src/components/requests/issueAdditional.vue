<template>
  <div class="mb-3">
    <b-link class="cardLink" :to="'/'+requestInfo.hash">
      <b-card no-body class="text-left">
        <b-card-body>
          <b-card-title>
            <div class="d-flex justify-content-between">
              <div>
                Token Issue Additional Request
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
          <token :tokenInfo="requestInfo.tokenInfo" :origin="requestInfo.origin" />
        </b-card-body>
        <b-list-group flush>
          <b-list-group-item>
            <icon name="magic" class="text-success mr-2"></icon>
            <strong class="mr-2">Added</strong>
            <span v-if="requestInfo.amountInToken" class="text-success mr-2">{{requestInfo.amountInToken}}</span>
            <span v-if="!requestInfo.amountInToken" class="text-success mr-2">{{requestInfo.amount}}</span>
            <span>{{requestInfo.tokenInfo.symbol}}</span>
          </b-list-group-item>
        </b-list-group>
      </b-card>
    </b-link>
  </div>
</template>

<script>
import bCardBody from 'bootstrap-vue/es/components/card/card-body'
import bCardTitle from 'bootstrap-vue/es/components/card/card-title'
import bCardSubtitle from 'bootstrap-vue/es/components/card/card-sub-title'
import bCardText from 'bootstrap-vue/es/components/card/card-text'
import bListGroup from 'bootstrap-vue/es/components/list-group/list-group'
import bListGroupItem from 'bootstrap-vue/es/components/list-group/list-group-item'
import token from '@/components/requests/token.vue'
import 'vue-awesome/icons/magic'

export default {
  name: 'issueAdditioanl',
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
    token
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
  .cardLink > .card {
    -webkit-transition: all .3s;
    -o-transition: all .3s;
    transition: all .3s;
  }
  .cardLink:hover > .card {
    box-shadow: 0 10px 30px -5px rgba(10,16,34,.2);
  }
</style>
