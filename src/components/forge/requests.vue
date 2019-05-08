<template>
  <div v-if="currentAccount">

    <b-row class="mb-3">
      <b-col cols="9">
        <h4>{{currentAccount.label}}</h4>
        <small><LogosAddress :address="currentAccount.address" /></small>
      </b-col>
      <b-col cols="3" class="d-flex flex-column m-auto align-items-end">
        <qrcode
          :value="'lgs:'+currentAccount.address"
          :options="{ size: 70, background: 'transparent' }"
        ></qrcode>
      </b-col>
    </b-row>
    <div v-if="hasFunds">

      <accordion
        bgClass="bg-success"
        accordionGroup="accordion"
        :slotMinHeight="290"
        :requestIcon="faPaperPlane"
        title="Send Logos"
        subtitle="Send logos to another account."
      >
        <send/>
      </accordion>

      <accordion
        v-if="hasTokenBalance"
        bgClass="bg-primary"
        accordionGroup="accordion"
        :slotMinHeight="388"
        :requestIcon="faCoins"
        title="Send Tokens"
        subtitle="Send tokens to another account."
      >
        <tokenSend/>
      </accordion>

      <accordion
        bgClass="bg-info"
        accordionGroup="accordion"
        :slotMinHeight="1702"
        :requestIcon="faPlus"
        title="Issue a Token"
        subtitle="Create and issue your token."
      >
        <issuance/>
      </accordion>

      <accordion
        v-if="tokenPrivileges('issuance')"
        bgClass="bg-secondary"
        accordionGroup="accordion"
        :slotMinHeight="290"
        :requestIcon="faMagic"
        title="Mint Additional Tokens"
        subtitle="Increases the total supply of a token."
      >
        <issueAdditional/>
      </accordion>

      <accordion
        v-if="tokenPrivileges('change')"
        bgClass="bg-warning"
        accordionGroup="accordion"
        :slotMinHeight="269"
        :requestIcon="faExchange"
        title="Change Token Setting"
        subtitle="Change the settings of the given token."
      >
        <changeSetting/>
      </accordion>

      <accordion
        v-if="tokenPrivileges('modify')"
        bgClass="bg-danger"
        accordionGroup="accordion"
        :slotMinHeight="292"
        :requestIcon="faLockAlt"
        title="Immute Token Setting"
        subtitle="Permanently immute a setting of the given token."
      >
        <immuteSetting/>
      </accordion>

      <accordion
        v-if="tokenPrivileges('revoke')"
        bgClass="bg-success"
        accordionGroup="accordion"
        :slotMinHeight="480"
        :requestIcon="faMask"
        title="Revoke Token from User"
        subtitle="Remove tokens from a one account and send them to another."
      >
        <revoke/>
      </accordion>

      <accordion
        v-if="tokenPrivileges('adjustUser')"
        bgClass="bg-primary"
        accordionGroup="accordion"
        :slotMinHeight="364"
        :requestIcon="faUserEdit"
        title="Adjust User Token Setting"
        subtitle="Freeze, Un-Freeze, Whitelist, or Un-Whitelist a user."
      >
        <adjustUserStatus/>
      </accordion>

      <accordion
        v-if="tokenPrivileges('adjust_fee')"
        bgClass="bg-info"
        accordionGroup="accordion"
        :slotMinHeight="385"
        :requestIcon="faPercentage"
        title="Adjust Token Fee"
        subtitle="Change the token fee for the given token."
      >
        <adjustFee/>
      </accordion>

      <accordion
        v-if="tokenPrivileges('update_issuer_info')"
        bgClass="bg-secondary"
        accordionGroup="accordion"
        :slotMinHeight="394"
        :requestIcon="faEdit"
        title="Update Token Info"
        subtitle="Change the token information of the given token."
      >
        <updateIssuerInfo/>
      </accordion>

      <accordion
        v-if="tokenPrivileges('update_controller')"
        bgClass="bg-warning"
        accordionGroup="accordion"
        :slotMinHeight="295"
        :requestIcon="faCrown"
        title="Update Controllers"
        subtitle="Add, remove, or change a controller's privileges"
      >
        <updateController/>
      </accordion>

      <accordion
        v-if="tokenPrivileges('burn')"
        bgClass="bg-danger"
        accordionGroup="accordion"
        :slotMinHeight="290"
        :requestIcon="faFire"
        title="Burn Tokens"
        subtitle="Remove some tokens from the total supply."
      >
        <burn/>
      </accordion>

      <accordion
        v-if="tokenPrivileges('distribute')"
        bgClass="bg-success"
        accordionGroup="accordion"
        :slotMinHeight="385"
        :requestIcon="faArrowDown"
        title="Distribute Tokens"
        subtitle="Send tokens from the token account to a user's account."
      >
        <distribute/>
      </accordion>

      <accordion
        v-if="tokenPrivileges('withdraw_fee')"
        bgClass="bg-primary"
        accordionGroup="accordion"
        :slotMinHeight="385"
        :requestIcon="faHandReceiving"
        title="Withdraw Fee"
        subtitle="Withdraw the token balance to a user's account."
      >
        <withdrawFee/>
      </accordion>

      <accordion
        v-if="tokenPrivileges('withdraw_logos')"
        bgClass="bg-info"
        accordionGroup="accordion"
        :slotMinHeight="385"
        :requestIcon="faLambda"
        title="Withdraw Logos"
        subtitle="Withdraw the Logos balance of the token account to a user's account."
      >
        <withdrawLogos/>
      </accordion>
    </div>
    <div v-else>
      <fund/>
    </div>
  </div>
  <div v-else>
    <accordion
      bgClass="bg-success"
      accordionGroup="accordion"
      :requestIcon="faPlus"
      title="Create an Account"
      subtitle="Create an account automatically or with a given private key."
    >
      <createAccount/>
    </accordion>
  </div>
</template>

<script>
import bigInt from 'big-integer'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import qrcode from '@xkeshi/vue-qrcode'
import { faLambda, faCoins, faPlus, faMagic, faExchange, faLockAlt, faMask, faUserEdit, faPaperPlane, faEdit, faFire, faArrowDown, faHandReceiving, faPercentage, faCrown } from '@fortawesome/pro-light-svg-icons'

export default {
  name: 'Requests',
  data () {
    return {
      faLambda,
      faCoins,
      faPlus,
      faMagic,
      faExchange,
      faLockAlt,
      faMask,
      faUserEdit,
      faPaperPlane,
      faEdit,
      faFire,
      faArrowDown,
      faHandReceiving,
      faPercentage,
      faCrown
    }
  },
  components: {
    'qrcode': qrcode,
    'accordion': () => import(/* webpackChunkName: "accordion" */'@/components/forge/accordion.vue'),
    'LogosAddress': () => import(/* webpackChunkName: "LogosAddress" */'@/components/LogosAddress.vue'),
    'fund': () => import(/* webpackChunkName: "fundForm" */'@/components/forge/fund.vue'),
    'createAccount': () => import(/* webpackChunkName: "createAccountForm" */'@/components/forge/requestForms/createAccount.vue'),
    'send': () => import(/* webpackChunkName: "sendForm" */'@/components/forge/requestForms/send.vue'),
    'tokenSend': () => import(/* webpackChunkName: "tokenSendForm" */'@/components/forge/requestForms/tokenSend.vue'),
    'issuance': () => import(/* webpackChunkName: "issuanceForm" */'@/components/forge/requestForms/issuance.vue'),
    'issueAdditional': () => import(/* webpackChunkName: "issueAdditionalForm" */'@/components/forge/requestForms/issueAdditional.vue'),
    'changeSetting': () => import(/* webpackChunkName: "changeSettingForm" */'@/components/forge/requestForms/changeSetting.vue'),
    'immuteSetting': () => import(/* webpackChunkName: "immuteSettingForm" */'@/components/forge/requestForms/immuteSetting.vue'),
    'revoke': () => import(/* webpackChunkName: "revokeForm" */'@/components/forge/requestForms/revoke.vue'),
    'adjustUserStatus': () => import(/* webpackChunkName: "adjustUserStatusForm" */'@/components/forge/requestForms/adjustUserStatus.vue'),
    'adjustFee': () => import(/* webpackChunkName: "adjustFeeForm" */'@/components/forge/requestForms/adjustFee.vue'),
    'updateIssuerInfo': () => import(/* webpackChunkName: "updateIssuerInfoForm" */'@/components/forge/requestForms/updateIssuerInfo.vue'),
    'updateController': () => import(/* webpackChunkName: "updateControllerForm" */'@/components/forge/requestForms/updateController.vue'),
    'burn': () => import(/* webpackChunkName: "burnForm" */'@/components/forge/requestForms/burn.vue'),
    'distribute': () => import(/* webpackChunkName: "distributeForm" */'@/components/forge/requestForms/distribute.vue'),
    'withdrawFee': () => import(/* webpackChunkName: "withdrawFeeForm" */'@/components/forge/requestForms/withdrawFee.vue'),
    'withdrawLogos': () => import(/* webpackChunkName: "withdrawLogosForm" */'@/components/forge/requestForms/withdrawLogos.vue')
  },
  computed: {
    forgeTokens: function () {
      return this.$wallet.tokenAccounts
    },
    currentAccount: function () {
      return this.$wallet.account
    },
    hasFunds: function () {
      if (this.currentAccount && this.currentAccount.balance) {
        return bigInt(this.currentAccount.balance).greater(0)
      } else {
        return false
      }
    },
    hasTokenBalance: function () {
      if (this.currentAccount && this.currentAccount.tokenBalances) {
        for (let tokenID in this.currentAccount.tokenBalances) {
          let forgeToken = this.forgeTokens[this.$utils.parseAccount(tokenID)]
          if (forgeToken.feeType === 'flat') {
            if (bigInt(this.currentAccount.tokenBalances[tokenID])
              .minus(bigInt(forgeToken.feeRate)).greater(0)) {
              return true
            }
          } else {
            if (bigInt(this.currentAccount.tokenBalances[tokenID]).greater(0)) {
              return true
            }
          }
        }
      } else {
        return false
      }
    }
  },
  methods: {
    tokenPrivileges: function (privilege) {
      if (this.forgeTokens) {
        for (let tokenAddress in this.forgeTokens) {
          let token = this.forgeTokens[tokenAddress]
          for (let controllerAddress in token.controllers) {
            let controller = token.controllers[controllerAddress]
            if (controller.account === this.currentAccount.address) {
              if (privilege === 'distribute' ||
                privilege === 'withdraw_logos' ||
                privilege === 'withdraw_fee' ||
                privilege === 'burn' ||
                privilege === 'update_controller' ||
                privilege === 'update_issuer_info') {
                return controller.privileges[privilege]
              } else {
                if (privilege === 'adjust_fee' ||
                  privilege === 'revoke' ||
                  privilege === 'issuance') {
                  return controller.privileges[privilege] && token.settings[privilege]
                } else if (privilege === 'adjustUser') {
                  return (
                    (controller.privileges.whitelist && token.settings.whitelist) ||
                    (controller.privileges.freeze && token.settings.freeze)
                  )
                } else if (privilege === 'change') {
                  return (
                    (controller.privileges.change_issuance && token.settings.modify_issuance) ||
                    (controller.privileges.change_revoke && token.settings.modify_revoke) ||
                    (controller.privileges.change_freeze && token.settings.modify_freeze) ||
                    (controller.privileges.change_adjust_fee && token.settings.modify_adjust_fee) ||
                    (controller.privileges.change_whitelist && token.settings.modify_whitelist)
                  )
                } else if (privilege === 'modify') {
                  return (
                    (controller.privileges.change_modify_issuance && token.settings.modify_issuance) ||
                    (controller.privileges.change_modify_revoke && token.settings.modify_revoke) ||
                    (controller.privileges.change_modify_freeze && token.settings.modify_freeze) ||
                    (controller.privileges.change_modify_adjust_fee && token.settings.modify_adjust_fee) ||
                    (controller.privileges.change_modify_whitelist && token.settings.modify_whitelist)
                  )
                }
              }
            }
          }
        }
      }
      return false
    }
  }
}
</script>
