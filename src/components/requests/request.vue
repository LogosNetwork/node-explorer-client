<template>
  <div class="mb-3 shadow-sm">
    <b-link v-if="!requestInfo.inactive" class="cardLink" :to="'/'+requestInfo.hash">
      <send v-if="requestInfo.type === 'send'" :requestInfo="requestInfo" :account="account" :small="small"/>
      <burn v-if="requestInfo.type === 'burn'" :requestInfo="requestInfo" :small="small"/>
      <issuerInfo v-if="requestInfo.type === 'update_issuer_info'" :requestInfo="requestInfo" :small="small"/>
      <tokenSend v-if="requestInfo.type === 'token_send'" :requestInfo="requestInfo" :account="account" :small="small"/>
      <distribute v-if="requestInfo.type === 'distribute'" :requestInfo="requestInfo" :small="small"/>
      <adjustFee v-if="requestInfo.type === 'adjust_fee'" :requestInfo="requestInfo" :small="small"/>
      <changeSetting v-if="requestInfo.type === 'change_setting'" :requestInfo="requestInfo" :small="small"/>
      <adjustUserStatus v-if="requestInfo.type === 'adjust_user_status'" :requestInfo="requestInfo" :small="small"/>
      <issuance v-if="requestInfo.type === 'issuance'" :requestInfo="requestInfo" :small="small"/>
      <issueAdditional v-if="requestInfo.type === 'issue_additional'" :requestInfo="requestInfo" :small="small"/>
      <withdrawFee v-if="requestInfo.type === 'withdraw_fee'" :requestInfo="requestInfo" :small="small"/>
      <withdrawLogos v-if="requestInfo.type === 'withdraw_logos'" :requestInfo="requestInfo" :small="small"/>
      <updateController v-if="requestInfo.type === 'update_controller'" :requestInfo="requestInfo" :small="small"/>
      <revoke v-if="requestInfo.type === 'revoke'" :requestInfo="requestInfo" :small="small"/>
      <immuteSetting v-if="requestInfo.type === 'immute_setting'" :requestInfo="requestInfo" :small="small"/>
    </b-link>
    <div v-else>
      <send v-if="requestInfo.type === 'send'" :requestInfo="requestInfo" :account="account" :small="small"/>
      <burn v-if="requestInfo.type === 'burn'" :requestInfo="requestInfo" :small="small"/>
      <issuerInfo v-if="requestInfo.type === 'update_issuer_info'" :requestInfo="requestInfo" :small="small"/>
      <tokenSend v-if="requestInfo.type === 'token_send'" :requestInfo="requestInfo" :account="account" :small="small"/>
      <distribute v-if="requestInfo.type === 'distribute'" :requestInfo="requestInfo" :small="small"/>
      <adjustFee v-if="requestInfo.type === 'adjust_fee'" :requestInfo="requestInfo" :small="small"/>
      <changeSetting v-if="requestInfo.type === 'change_setting'" :requestInfo="requestInfo" :small="small"/>
      <adjustUserStatus v-if="requestInfo.type === 'adjust_user_status'" :requestInfo="requestInfo" :small="small"/>
      <issuance v-if="requestInfo.type === 'issuance'" :requestInfo="requestInfo" :small="small"/>
      <issueAdditional v-if="requestInfo.type === 'issue_additional'" :requestInfo="requestInfo" :small="small"/>
      <withdrawFee v-if="requestInfo.type === 'withdraw_fee'" :requestInfo="requestInfo" :small="small"/>
      <withdrawLogos v-if="requestInfo.type === 'withdraw_logos'" :requestInfo="requestInfo" :small="small"/>
      <updateController v-if="requestInfo.type === 'update_controller'" :requestInfo="requestInfo" :small="small"/>
      <revoke v-if="requestInfo.type === 'revoke'" :requestInfo="requestInfo" :small="small"/>
      <immuteSetting v-if="requestInfo.type === 'immute_setting'" :requestInfo="requestInfo" :small="small"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'request',
  props: {
    requestInfo: Object,
    account: String,
    small: {
      type: Boolean,
      default: false
    }
  },
  components: {
    'send': () => import(/* webpackChunkName: "sendCard" */'@/components/requests/requestCards/send.vue'),
    'burn': () => import(/* webpackChunkName: "burnCard" */'@/components/requests/requestCards/burn.vue'),
    'issuerInfo': () => import(/* webpackChunkName: "issuerInfoCard" */'@/components/requests/requestCards/issuerInfo.vue'),
    'distribute': () => import(/* webpackChunkName: "distributeCard" */'@/components/requests/requestCards/distribute.vue'),
    'adjustFee': () => import(/* webpackChunkName: "adjustFeeCard" */'@/components/requests/requestCards/adjustFee.vue'),
    'changeSetting': () => import(/* webpackChunkName: "changeSettingCard" */'@/components/requests/requestCards/changeSetting.vue'),
    'adjustUserStatus': () => import(/* webpackChunkName: "adjustUserStatusCard" */'@/components/requests/requestCards/adjustUserStatus.vue'),
    'issuance': () => import(/* webpackChunkName: "issuanceCard" */'@/components/requests/requestCards/issuance.vue'),
    'issueAdditional': () => import(/* webpackChunkName: "issueAdditionalCard" */'@/components/requests/requestCards/issueAdditional.vue'),
    'withdrawFee': () => import(/* webpackChunkName: "withdrawFeeCard" */'@/components/requests/requestCards/withdrawFee.vue'),
    'withdrawLogos': () => import(/* webpackChunkName: "withdrawLogosCard" */'@/components/requests/requestCards/withdrawLogos.vue'),
    'updateController': () => import(/* webpackChunkName: "updateControllerCard" */'@/components/requests/requestCards/updateController.vue'),
    'revoke': () => import(/* webpackChunkName: "revokeCard" */'@/components/requests/requestCards/revoke.vue'),
    'immuteSetting': () => import(/* webpackChunkName: "immuteSettingCard" */'@/components/requests/requestCards/immuteSetting.vue'),
    'tokenSend': () => import(/* webpackChunkName: "tokenSendCard" */'@/components/requests/requestCards/tokenSend.vue')
  }
}
</script>

<style lang="scss" scoped>
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
