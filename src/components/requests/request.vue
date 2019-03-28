<template>
  <div class="mb-3">
    <b-link v-if="!requestInfo.inactive" class="cardLink" :to="'/'+requestInfo.hash">
      <send v-if="requestInfo.type === 'send'" :requestInfo="requestInfo" :account="account"/>
      <burn v-if="requestInfo.type === 'burn'" :requestInfo="requestInfo"/>
      <issuerInfo v-if="requestInfo.type === 'update_issuer_info'" :requestInfo="requestInfo"/>
      <tokenSend v-if="requestInfo.type === 'token_send'" :requestInfo="requestInfo" :account="account"/>
      <distribute v-if="requestInfo.type === 'distribute'" :requestInfo="requestInfo"/>
      <adjustFee v-if="requestInfo.type === 'adjust_fee'" :requestInfo="requestInfo"/>
      <changeSetting v-if="requestInfo.type === 'change_setting'" :requestInfo="requestInfo"/>
      <adjustUserStatus v-if="requestInfo.type === 'adjust_user_status'" :requestInfo="requestInfo"/>
      <issuance v-if="requestInfo.type === 'issuance'" :requestInfo="requestInfo"/>
      <issueAdditional v-if="requestInfo.type === 'issue_additional'" :requestInfo="requestInfo"/>
      <withdrawFee v-if="requestInfo.type === 'withdraw_fee'" :requestInfo="requestInfo"/>
      <withdrawLogos v-if="requestInfo.type === 'withdraw_logos'" :requestInfo="requestInfo"/>
      <updateController v-if="requestInfo.type === 'update_controller'" :requestInfo="requestInfo"/>
      <revoke v-if="requestInfo.type === 'revoke'" :requestInfo="requestInfo"/>
      <immuteSetting v-if="requestInfo.type === 'immute_setting'" :requestInfo="requestInfo"/>
    </b-link>
    <div v-else>
      <send v-if="requestInfo.type === 'send'" :requestInfo="requestInfo" :account="account"/>
      <burn v-if="requestInfo.type === 'burn'" :requestInfo="requestInfo"/>
      <issuerInfo v-if="requestInfo.type === 'update_issuer_info'" :requestInfo="requestInfo"/>
      <tokenSend v-if="requestInfo.type === 'token_send'" :requestInfo="requestInfo" :account="account"/>
      <distribute v-if="requestInfo.type === 'distribute'" :requestInfo="requestInfo"/>
      <adjustFee v-if="requestInfo.type === 'adjust_fee'" :requestInfo="requestInfo"/>
      <changeSetting v-if="requestInfo.type === 'change_setting'" :requestInfo="requestInfo"/>
      <adjustUserStatus v-if="requestInfo.type === 'adjust_user_status'" :requestInfo="requestInfo"/>
      <issuance v-if="requestInfo.type === 'issuance'" :requestInfo="requestInfo"/>
      <issueAdditional v-if="requestInfo.type === 'issue_additional'" :requestInfo="requestInfo"/>
      <withdrawFee v-if="requestInfo.type === 'withdraw_fee'" :requestInfo="requestInfo"/>
      <withdrawLogos v-if="requestInfo.type === 'withdraw_logos'" :requestInfo="requestInfo"/>
      <updateController v-if="requestInfo.type === 'update_controller'" :requestInfo="requestInfo"/>
      <revoke v-if="requestInfo.type === 'revoke'" :requestInfo="requestInfo"/>
      <immuteSetting v-if="requestInfo.type === 'immute_setting'" :requestInfo="requestInfo"/>
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
    account: String
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
  }
  .cardLink:hover > .card {
    box-shadow: 0 10px 30px -5px rgba(10,16,34,.2);
  }
</style>
