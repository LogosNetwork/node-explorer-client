<template>
  <div class="mb-3 shadow-sm">
    <b-link v-if="!request.inactive" class="cardLink" :to="'/'+request.hash">
      <send v-if="request.type === 'send'" :requestInfo="request" :account="account" :small="small"/>
      <burn v-if="request.type === 'burn'" :requestInfo="request" :small="small"/>
      <issuerInfo v-if="request.type === 'update_issuer_info'" :requestInfo="request" :small="small"/>
      <tokenSend v-if="request.type === 'token_send'" :requestInfo="request" :account="account" :small="small"/>
      <distribute v-if="request.type === 'distribute'" :requestInfo="request" :small="small"/>
      <adjustFee v-if="request.type === 'adjust_fee'" :requestInfo="request" :small="small"/>
      <changeSetting v-if="request.type === 'change_setting'" :requestInfo="request" :small="small"/>
      <adjustUserStatus v-if="request.type === 'adjust_user_status'" :requestInfo="request" :small="small"/>
      <issuance v-if="request.type === 'issuance'" :requestInfo="request" :small="small"/>
      <issueAdditional v-if="request.type === 'issue_additional'" :requestInfo="request" :small="small"/>
      <withdrawFee v-if="request.type === 'withdraw_fee'" :requestInfo="request" :small="small"/>
      <withdrawLogos v-if="request.type === 'withdraw_logos'" :requestInfo="request" :small="small"/>
      <updateController v-if="request.type === 'update_controller'" :requestInfo="request" :small="small"/>
      <revoke v-if="request.type === 'revoke'" :requestInfo="request" :small="small"/>
      <immuteSetting v-if="request.type === 'immute_setting'" :requestInfo="request" :small="small"/>
    </b-link>
    <div v-else>
      <send v-if="request.type === 'send'" :requestInfo="request" :account="account" :small="small"/>
      <burn v-if="request.type === 'burn'" :requestInfo="request" :small="small"/>
      <issuerInfo v-if="request.type === 'update_issuer_info'" :requestInfo="request" :small="small"/>
      <tokenSend v-if="request.type === 'token_send'" :requestInfo="request" :account="account" :small="small"/>
      <distribute v-if="request.type === 'distribute'" :requestInfo="request" :small="small"/>
      <adjustFee v-if="request.type === 'adjust_fee'" :requestInfo="request" :small="small"/>
      <changeSetting v-if="request.type === 'change_setting'" :requestInfo="request" :small="small"/>
      <adjustUserStatus v-if="request.type === 'adjust_user_status'" :requestInfo="request" :small="small"/>
      <issuance v-if="request.type === 'issuance'" :requestInfo="request" :small="small"/>
      <issueAdditional v-if="request.type === 'issue_additional'" :requestInfo="request" :small="small"/>
      <withdrawFee v-if="request.type === 'withdraw_fee'" :requestInfo="request" :small="small"/>
      <withdrawLogos v-if="request.type === 'withdraw_logos'" :requestInfo="request" :small="small"/>
      <updateController v-if="request.type === 'update_controller'" :requestInfo="request" :small="small"/>
      <revoke v-if="request.type === 'revoke'" :requestInfo="request" :small="small"/>
      <immuteSetting v-if="request.type === 'immute_setting'" :requestInfo="request" :small="small"/>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VueMoment from 'vue-moment'
Vue.use(VueMoment)

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
  computed: {
    request: function () {
      if (this.requestInfo.constructor.name !== 'Object') {
        let request = JSON.parse(this.requestInfo.toJSON())
        if (request.token_id) {
          let tokenAddress = this.$utils.accountFromHexKey(request.token_id)
          let tokenAccount = this.$wallet.tokenAccounts[tokenAddress]
          request.tokenInfo = {
            name: tokenAccount.name,
            symbol: tokenAccount.symbol,
            tokenAccount: tokenAddress
          }
          try {
            request.tokenInfo.issuerInfo = JSON.parse(tokenAccount.issuerInfo)
          } catch (e) {
            request.tokenInfo.issuerInfo = null
          }
          if (this.requestInfo.constructor.name === 'Issuance') {
            try {
              request.prettyInfo = JSON.stringify(JSON.parse(request.issuer_info), null, 2)
            } catch (e) {
              request.prettyInfo = request.issuer_info
            }
          } else if (this.requestInfo.constructor.name === 'UpdateIssuerInfo') {
            try {
              request.prettyInfo = JSON.stringify(JSON.parse(request.new_info), null, 2)
            } catch (e) {
              request.prettyInfo = request.issuer_info
            }
          } else if (this.requestInfo.constructor.name === 'WithdrawLogos') {
            request.transaction.amountInLogos = this.$Logos.convert.fromReason(request.transaction.amount, 'LOGOS')
          } else if (request.transaction) {
            if (request.tokenInfo.issuerInfo &&
              typeof request.tokenInfo.issuerInfo.decimals !== 'undefined' &&
              request.tokenInfo.issuerInfo.decimals > 0) {
              request.transaction.amountInToken = this.$Logos.convert.fromTo(request.transaction.amount, request.tokenInfo.issuerInfo.decimals, 0)
            }
          } else if (request.transactions) {
            request.totalAmount = this.requestInfo.totalAmount
            if (request.tokenInfo.issuerInfo &&
              typeof request.tokenInfo.issuerInfo.decimals !== 'undefined' &&
              request.tokenInfo.issuerInfo.decimals > 0) {
              request.totalAmountInToken = this.$Logos.convert.fromTo(request.totalAmount, request.tokenInfo.issuerInfo.decimals, 0)
              for (let transaction of request.transactions) {
                transaction.amountInToken = this.$Logos.convert.fromTo(transaction.amount, request.tokenInfo.issuerInfo.decimals, 0)
              }
            }
          }
        } else if (request.transactions) {
          request.totalAmountLogos = this.$Logos.convert.fromReason(this.requestInfo.totalAmount, 'LOGOS')
          for (let transaction of request.transactions) {
            transaction.amountInLogos = this.$Logos.convert.fromReason(transaction.amount, 'LOGOS')
          }
        }
        return request
      } else {
        return this.requestInfo
      }
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
