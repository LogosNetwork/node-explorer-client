<template>
  <div>
    <b-form-group id="sendTo"
      label="To"
      label-size="lg"
    >
      <Multiselect
        id="toSelector"
        v-model="sendForm.to"
        required
        tag-placeholder="Add this account"
        track-by="address"
        label="label"
        :custom-label="labelWithAddress"
        :options="combinedAccounts"
        :multiple="false"
        :taggable="true"
        @tag="addSend"
        placeholder="Search or add an account"
      >
        <template slot="singleLabel" slot-scope="{ option }">
          <span v-if="option.label !== option.address">
            <strong>{{ option.label }}</strong>  -
          </span>
          <LogosAddress :inactive="true" :force="true" :address="option.address" />
        </template>
      </Multiselect>
      <div v-if="validDestination === false" style="display:block" class="invalid-feedback">
        {{invalidDestinationError}}
      </div>
    </b-form-group>

    <b-form-group
      id="sendAmount"
      label="Amount"
      label-size="lg"
      :description="currentAccount ? `${availableToSend} Logos available to send` : `No account found`"
    >
      <b-form-input
        id="amountInput"
        v-model="sendForm.amount"
        autocomplete="off"
        aria-describedby="amountError"
        :state="isValidAmount"
        required
        placeholder="Amount in Logos"
      ></b-form-input>
      <b-form-invalid-feedback id="amountError">
        This is a required field and must be a positive decimal or integer value that is less than the current accounts balance
      </b-form-invalid-feedback>
    </b-form-group>
    <div class="text-right">
      <b-button
        v-on:click="createSend()"
        type="submit"
        variant="primary"
        :disabled="!isValidAmount || !sendForm.to || !validDestination"
      >
        Create Send
      </b-button>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash.clonedeep'
import bigInt from 'big-integer'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'sendForm',
  data () {
    return {
      validDestination: null,
      invalidDestinationError: '',
      sendForm: {
        to: null,
        amount: ''
      }
    }
  },
  components: {
    'b-form-group': () => import(/* webpackChunkName: "b-form-group" */'bootstrap-vue/es/components/form-group/form-group'),
    'b-form-input': () => import(/* webpackChunkName: "b-form-input" */'bootstrap-vue/es/components/form-input/form-input'),
    'b-form-invalid-feedback': () => import(/* webpackChunkName: "b-form-invalid-feedback" */'bootstrap-vue/es/components/form/form-invalid-feedback'),
    'LogosAddress': () => import(/* webpackChunkName: "LogosAddress" */'@/components/LogosAddress.vue'),
    'Multiselect': () => import(/* webpackChunkName: "Multiselect" */'vue-multiselect')
  },
  computed: {
    ...mapState('forge', {
      accounts: state => state.accounts
    }),
    currentAccount: function () {
      return this.$wallet.account
    },
    combinedAccounts: function () {
      let forgeAccounts = cloneDeep(this.$wallet.accounts)
      let forgeTokens = []
      for (let token in this.$wallet.tokenAccounts) {
        forgeTokens.push({ label: `${this.$wallet.tokenAccounts[token].name} (${this.$wallet.tokenAccounts[token].symbol})`, address: token })
      }
      if (this.currentAccount) delete forgeAccounts[this.currentAccount.address]
      return Object.values(forgeAccounts).concat(this.accounts).concat(forgeTokens)
    },
    availableToSend: function () {
      return this.$Logos.convert.fromReason(bigInt(this.currentAccount.balance).minus(bigInt(this.$utils.minimumFee)).toString(), 'LOGOS')
    },
    isValidAmount: function () {
      if (this.sendForm.amount === '') return null
      let amountInRaw = cloneDeep(this.sendForm.amount)
      if (amountInRaw) {
        if (!/^([0-9]+(?:[.][0-9]*)?|\.[0-9]+)$/.test(amountInRaw)) return false
        amountInRaw = this.$Logos.convert.toReason(amountInRaw, 'LOGOS')
        return (
          bigInt(amountInRaw).greater(0) &&
          bigInt(this.$wallet.account.balance)
            .greaterOrEquals(
              bigInt(amountInRaw)
                .plus(
                  bigInt(this.$utils.minimumFee)
                )
            )
        )
      }
      return false
    }
  },
  methods: {
    ...mapActions('forge',
      [
        'addAccount'
      ]
    ),
    accountExists (newAddress) {
      for (let account of this.combinedAccounts) {
        if (account.address === newAddress) return true
      }
      return false
    },
    addSend (newAddress) {
      if (newAddress.match(/^lgs_[13456789abcdefghijkmnopqrstuwxyz]{60}$/) !== null) {
        let newAccount = { label: newAddress, address: newAddress }
        if (!this.accountExists(newAddress)) {
          this.addAccount(newAccount)
          this.sendForm.to = newAccount
        }
      }
    },
    isValidDestination: async function (account) {
      this.validDestination = null
      this.invalidDestinationError = ''
      if (account && account.address) {
        let address = account.address
        let accountInfo = await this.$Logos.accounts.info(address)
        if (!accountInfo) {
          this.validDestination = false
          this.invalidDestinationError = 'Unable to validate this account.'
          return
        }
        if (accountInfo.error && accountInfo.error === 'Bad account number') {
          this.validDestination = false
          this.invalidDestinationError = 'This is not a valid address.'
          return
        }
        this.validDestination = true
      }
    },
    createSend () {
      if (this.sendForm.to && this.sendForm.to.address.match(/^lgs_[13456789abcdefghijkmnopqrstuwxyz]{60}$/) !== null) {
        let amount = this.$Logos.convert.toReason(this.sendForm.amount, 'LOGOS')
        if (bigInt(this.$wallet.account.balance)
          .greaterOrEquals(
            bigInt(amount).plus(bigInt(this.$utils.minimumFee))
          )) {
          this.$wallet.account.createSendRequest([{
            destination: this.sendForm.to.address,
            amount: amount
          }])
        }
      }
    },
    labelWithAddress ({ label, address }) {
      if (label !== address) {
        return `${label} — ${address.substring(0, 9)}...${address.substring(59, 64)}`
      } else {
        return address
      }
    }
  },
  created: function () {
    if (this.combinedAccounts.length > 0) {
      this.sendForm.to = this.combinedAccounts[0]
    }
  },
  watch: {
    combinedAccounts: function (newAccounts, oldAccounts) {
      if (newAccounts.length > 0) {
        let valid = false
        for (let account of newAccounts) {
          if (this.sendForm.to && account.address === this.sendForm.to.address) {
            this.sendForm.to = account
            valid = true
          }
        }
        if (valid === false) {
          this.sendForm.to = newAccounts[0]
        }
      } else {
        this.sendForm.to = null
      }
    },
    'sendForm.to': function (newDest, oldDest) {
      if (this.sendForm.to !== null) {
        this.isValidDestination(this.sendForm.to)
      }
    },
    currentAccount: function (newAccount, oldAccount) {
      if (newAccount.address !== oldAccount.address) {
        for (let account of this.combinedAccounts) {
          this.sendForm.to = account
          break
        }
      }
    }
  }
}
</script>
