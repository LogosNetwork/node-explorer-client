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
import send from '@/components/requests/requestCards/send.vue'
import burn from '@/components/requests/requestCards/burn.vue'
import issuerInfo from '@/components/requests/requestCards/issuerInfo.vue'
import distribute from '@/components/requests/requestCards/distribute.vue'
import adjustFee from '@/components/requests/requestCards/adjustFee.vue'
import changeSetting from '@/components/requests/requestCards/changeSetting.vue'
import adjustUserStatus from '@/components/requests/requestCards/adjustUserStatus.vue'
import issuance from '@/components/requests/requestCards/issuance.vue'
import issueAdditional from '@/components/requests/requestCards/issueAdditional.vue'
import withdrawFee from '@/components/requests/requestCards/withdrawFee.vue'
import withdrawLogos from '@/components/requests/requestCards/withdrawLogos.vue'
import updateController from '@/components/requests/requestCards/updateController.vue'
import revoke from '@/components/requests/requestCards/revoke.vue'
import immuteSetting from '@/components/requests/requestCards/immuteSetting.vue'
import tokenSend from '@/components/requests/requestCards/tokenSend.vue'

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
    send,
    burn,
    issuerInfo,
    distribute,
    adjustFee,
    changeSetting,
    adjustUserStatus,
    issuance,
    issueAdditional,
    withdrawFee,
    withdrawLogos,
    updateController,
    revoke,
    immuteSetting,
    tokenSend
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
