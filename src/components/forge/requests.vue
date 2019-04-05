<template>
  <div v-if="currentAccount !== null">
    <div v-if="hasFunds">

      <accordion
        bgClass="bg-success"
        accordionGroup="accordion"
        :requestIcon="faPaperPlane"
        title="Send Logos"
        subtitle="Send logos to another account."
      >
        <sendForm/>
      </accordion>

      <accordion
        bgClass="bg-primary"
        accordionGroup="accordion"
        :requestIcon="faCoins"
        title="Send Tokens"
        subtitle="Send tokens to another account."
      >
        Hello World
      </accordion>

      <accordion
        bgClass="bg-info"
        accordionGroup="accordion"
        :requestIcon="faPlus"
        title="Issue a Token"
        subtitle="Create and issue your token."
      >
        Hello World
      </accordion>

      <accordion
        bgClass="bg-secondary"
        accordionGroup="accordion"
        :requestIcon="faMagic"
        title="Issue Additional Tokens"
        subtitle="Increases the total supply of a token."
      >
        Hello World
      </accordion>

      <accordion
        bgClass="bg-warning"
        accordionGroup="accordion"
        :requestIcon="faExchange"
        title="Change Token Setting"
        subtitle="Change the settings of the given token."
      >
        Hello World
      </accordion>

      <accordion
        bgClass="bg-danger"
        accordionGroup="accordion"
        :requestIcon="faLockAlt"
        title="Immute Token Setting"
        subtitle="Permanently immute a setting of the given token."
      >
        Hello World
      </accordion>

      <accordion
        bgClass="bg-success"
        accordionGroup="accordion"
        :requestIcon="faMask"
        title="Revoke Token from User"
        subtitle="Remove tokens from a one account and send them to another."
      >
        Hello World
      </accordion>

      <accordion
        bgClass="bg-primary"
        accordionGroup="accordion"
        :requestIcon="faUserEdit"
        title="Adjust User Token Setting"
        subtitle="Freeze, Un-Freeze, Whitelist, or Blacklist a user."
      >
        Hello World
      </accordion>

      <accordion
        bgClass="bg-info"
        accordionGroup="accordion"
        :requestIcon="faPercentage"
        title="Adjust Token Fee"
        subtitle="Change the token fee for the given token."
      >
        Hello World
      </accordion>

      <accordion
        bgClass="bg-secondary"
        accordionGroup="accordion"
        :requestIcon="faEdit"
        title="Update Token Info"
        subtitle="Change the token information of the given token."
      >
        Hello World
      </accordion>

      <accordion
        bgClass="bg-warning"
        accordionGroup="accordion"
        :requestIcon="faFire"
        title="Burn Tokens"
        subtitle="Remove some tokens from the total supply."
      >
        Hello World
      </accordion>

      <accordion
        bgClass="bg-danger"
        accordionGroup="accordion"
        :requestIcon="faArrowDown"
        title="Distribute Tokens"
        subtitle="Send tokens from the token account to a user's account."
      >
        Hello World
      </accordion>

      <accordion
        bgClass="bg-success"
        accordionGroup="accordion"
        :requestIcon="faHandReceiving"
        title="Withdraw Fee"
        subtitle="Withdraw the token balance to a user's account."
      >
        Hello World
      </accordion>

      <accordion
        bgClass="bg-primary"
        accordionGroup="accordion"
        :requestIcon="faLambda"
        title="Withdraw Logos"
        subtitle="Withdraw the Logos balance of the token account to a user's account."
      >
        Hello World
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
      <createAccountForm/>
    </accordion>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import accordion from '@/components/forge/accordion.vue'
import fund from '@/components/forge/fund.vue'
import createAccountForm from '@/components/forge/requestForms/createAccountForm.vue'
import sendForm from '@/components/forge/requestForms/sendForm.vue'
import bigInt from 'big-integer'
import { faLambda, faCoins, faPlus, faMagic, faExchange, faLockAlt, faMask, faUserEdit, faPaperPlane, faEdit, faFire, faArrowDown, faHandReceiving, faPercentage, faChevronDown, faChevronUp } from '@fortawesome/pro-light-svg-icons'

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
      faChevronDown,
      faChevronUp
    }
  },
  components: {
    accordion,
    fund,
    createAccountForm,
    sendForm
  },
  computed: {
    ...mapState('forge', {
      currentAccount: state => state.currentAccount
    }),
    hasFunds: function () {
      return bigInt(this.currentAccount.balance).greater(0)
    }
  }
}
</script>
