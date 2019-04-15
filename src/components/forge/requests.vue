<template>
  <div v-if="currentAccount !== null">

    <b-row class="mb-3">
      <b-col cols="12" md="9">
        <h4>{{currentAccount.label}}</h4>
        <small><LogosAddress :address="currentAccount.address" /></small>
      </b-col>
      <b-col cols="12" md="3" class="d-flex flex-column m-auto align-items-end">
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
        :requestIcon="faCoins"
        title="Send Tokens"
        subtitle="Send tokens to another account."
      >
        <tokenSend/>
      </accordion>

      <accordion
        bgClass="bg-info"
        accordionGroup="accordion"
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
        :requestIcon="faMagic"
        title="Issue Additional Tokens"
        subtitle="Increases the total supply of a token."
      >
        <issueAdditional/>
      </accordion>

      <accordion
        v-if="tokenPrivileges('change')"
        bgClass="bg-warning"
        accordionGroup="accordion"
        :requestIcon="faExchange"
        title="Change Token Setting"
        subtitle="Change the settings of the given token."
      >
        Not Yet Implemented :(
      </accordion>

      <accordion
        v-if="tokenPrivileges('modify')"
        bgClass="bg-danger"
        accordionGroup="accordion"
        :requestIcon="faLockAlt"
        title="Immute Token Setting"
        subtitle="Permanently immute a setting of the given token."
      >
        Not Yet Implemented :(
      </accordion>

      <accordion
        v-if="tokenPrivileges('revoke')"
        bgClass="bg-success"
        accordionGroup="accordion"
        :requestIcon="faMask"
        title="Revoke Token from User"
        subtitle="Remove tokens from a one account and send them to another."
      >
        Not Yet Implemented :(
      </accordion>

      <accordion
        v-if="tokenPrivileges('adjustUser')"
        bgClass="bg-primary"
        accordionGroup="accordion"
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
        :requestIcon="faPercentage"
        title="Adjust Token Fee"
        subtitle="Change the token fee for the given token."
      >
        Not Yet Implemented :(
      </accordion>

      <accordion
        v-if="tokenPrivileges('update_issuer_info')"
        bgClass="bg-secondary"
        accordionGroup="accordion"
        :requestIcon="faEdit"
        title="Update Token Info"
        subtitle="Change the token information of the given token."
      >
        Not Yet Implemented :(
      </accordion>

      <accordion
        v-if="tokenPrivileges('burn')"
        bgClass="bg-warning"
        accordionGroup="accordion"
        :requestIcon="faFire"
        title="Burn Tokens"
        subtitle="Remove some tokens from the total supply."
      >
        Not Yet Implemented :(
      </accordion>

      <accordion
        v-if="tokenPrivileges('distribute')"
        bgClass="bg-danger"
        accordionGroup="accordion"
        :requestIcon="faArrowDown"
        title="Distribute Tokens"
        subtitle="Send tokens from the token account to a user's account."
      >
        <distribute/>
      </accordion>

      <accordion
        v-if="tokenPrivileges('withdraw_fee')"
        bgClass="bg-success"
        accordionGroup="accordion"
        :requestIcon="faHandReceiving"
        title="Withdraw Fee"
        subtitle="Withdraw the token balance to a user's account."
      >
        Not Yet Implemented :(
      </accordion>

      <accordion
        v-if="tokenPrivileges('withdraw_logos')"
        bgClass="bg-primary"
        accordionGroup="accordion"
        :requestIcon="faLambda"
        title="Withdraw Logos"
        subtitle="Withdraw the Logos balance of the token account to a user's account."
      >
        Not Yet Implemented :(
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
import { mapState } from 'vuex'
import accordion from '@/components/forge/accordion.vue'
import fund from '@/components/forge/fund.vue'
import createAccount from '@/components/forge/requestForms/createAccount.vue'
import send from '@/components/forge/requestForms/send.vue'
import tokenSend from '@/components/forge/requestForms/tokenSend.vue'
import issuance from '@/components/forge/requestForms/issuance.vue'
import issueAdditional from '@/components/forge/requestForms/issueAdditional.vue'
import adjustUserStatus from '@/components/forge/requestForms/adjustUserStatus.vue'
import distribute from '@/components/forge/requestForms/distribute.vue'
import bigInt from 'big-integer'
import LogosAddress from '@/components/LogosAddress.vue'
import { faLambda, faCoins, faPlus, faMagic, faExchange, faLockAlt, faMask, faUserEdit, faPaperPlane, faEdit, faFire, faArrowDown, faHandReceiving, faPercentage } from '@fortawesome/pro-light-svg-icons'

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
      faPercentage
    }
  },
  components: {
    accordion,
    LogosAddress,
    fund,
    createAccount,
    send,
    tokenSend,
    issuance,
    issueAdditional,
    adjustUserStatus,
    distribute
  },
  computed: {
    ...mapState('forge', {
      currentAccount: state => state.currentAccount,
      forgeTokens: state => state.tokens
    }),
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
          if (forgeToken.fee_type === 'flat') {
            if (bigInt(this.currentAccount.tokenBalances[tokenID])
              .minus(bigInt(forgeToken.fee_rate)).greater(0)) {
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
          if (this.forgeTokens[tokenAddress].controllers instanceof Array) {
            for (let controller of this.forgeTokens[tokenAddress].controllers) {
              if (controller.account === this.currentAccount.address &&
                controller.privileges instanceof Array) {
                if (privilege === 'distribute' ||
                  privilege === 'withdraw_logos' ||
                  privilege === 'withdraw_fee' ||
                  privilege === 'burn' ||
                  privilege === 'update_issuer_info') {
                  return controller.privileges.indexOf(privilege) > -1
                } else if (this.forgeTokens[tokenAddress].settings instanceof Array) {
                  if (privilege === 'adjust_fee' ||
                    privilege === 'revoke' ||
                    privilege === 'issuance') {
                    if (controller.privileges.indexOf(privilege) > -1 &&
                      this.forgeTokens[tokenAddress].settings.indexOf(privilege) > -1) {
                      return true
                    }
                  } else if (privilege === 'adjustUser') {
                    if (controller.privileges.indexOf('whitelist') > -1 &&
                      this.forgeTokens[tokenAddress].settings.indexOf('whitelist') > -1) {
                      return true
                    }
                    if (controller.privileges.indexOf('freeze') > -1 &&
                      this.forgeTokens[tokenAddress].settings.indexOf('freeze') > -1) {
                      return true
                    }
                  } else if (privilege === 'change') {
                    if (controller.privileges.indexOf('change_issuance') > -1 &&
                      this.forgeTokens[tokenAddress].settings.indexOf('modify_issuance') > -1) {
                      return true
                    }
                    if (controller.privileges.indexOf('change_revoke') > -1 &&
                      this.forgeTokens[tokenAddress].settings.indexOf('modify_revoke') > -1) {
                      return true
                    }
                    if (controller.privileges.indexOf('change_freeze') > -1 &&
                      this.forgeTokens[tokenAddress].settings.indexOf('modify_freeze') > -1) {
                      return true
                    }
                    if (controller.privileges.indexOf('change_adjust_fee') > -1 &&
                      this.forgeTokens[tokenAddress].settings.indexOf('modify_adjust_fee') > -1) {
                      return true
                    }
                    if (controller.privileges.indexOf('change_whitelist') > -1 &&
                      this.forgeTokens[tokenAddress].settings.indexOf('modify_whitelist') > -1) {
                      return true
                    }
                  } else if (privilege === 'modify') {
                    if (controller.privileges.indexOf('change_modify_issuance') > -1 &&
                      this.forgeTokens[tokenAddress].settings.indexOf('modify_issuance') > -1) {
                      return true
                    }
                    if (controller.privileges.indexOf('change_modify_revoke') > -1 &&
                      this.forgeTokens[tokenAddress].settings.indexOf('modify_revoke') > -1) {
                      return true
                    }
                    if (controller.privileges.indexOf('change_modify_freeze') > -1 &&
                      this.forgeTokens[tokenAddress].settings.indexOf('modify_freeze') > -1) {
                      return true
                    }
                    if (controller.privileges.indexOf('change_modify_adjust_fee') > -1 &&
                      this.forgeTokens[tokenAddress].settings.indexOf('modify_adjust_fee') > -1) {
                      return true
                    }
                    if (controller.privileges.indexOf('change_modify_whitelist') > -1 &&
                      this.forgeTokens[tokenAddress].settings.indexOf('modify_whitelist') > -1) {
                      return true
                    }
                  }
                }
              }
            }
          }
        }
        return false
      } else {
        return false
      }
    }
  }
}
</script>
