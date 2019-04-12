<template>
  <div>
    <b-form-group
      id="sendToken"
      label="Select Token"
      label-size="lg"
    >
      <Multiselect
        id="destinationSelector"
        v-model="selectedToken"
        required
        track-by="tokenAccount"
        label="name"
        :custom-label="nameWithAddress"
        :options="sendableTokens"
        :disabled="sendableTokens.length <= 1"
        :multiple="false"
        placeholder="Search for a token"
      >
        <template slot="singleLabel" slot-scope="{ option }">
          <span v-if="option.name !== option.tokenAccount">
            <strong>{{ option.name }}</strong>  -
          </span>
          <LogosAddress :inactive="true" :force="true" :address="option.tokenAccount" />
        </template>
      </Multiselect>
    </b-form-group>

    <b-form-group
      id="sendDestination"
      label="Send To"
      label-size="lg"
    >
      <Multiselect
        id="destinationSelector"
        v-model="transaction.destination"
        required
        tag-placeholder="Add this account"
        track-by="label"
        label="label"
        :custom-label="labelWithAddress"
        :options="combinedAccounts"
        :multiple="false"
        :taggable="true"
        @tag="addDestiantionAccount"
        placeholder="Search or add an account"
      >
        <template slot="singleLabel" slot-scope="{ option }">
          <span v-if="option.label !== option.address">
            <strong>{{ option.label }}</strong>  -
          </span>
          <LogosAddress :inactive="true" :force="true" :address="option.address" />
        </template>
      </Multiselect>
    </b-form-group>

    <b-form-group
      id="sendAmount"
      label="Amount"
      label-size="lg"
      :description="availableToSend"
    >
      <b-form-input
        id="amountInput"
        v-model="transaction.amount"
        autocomplete="off"
        required
        aria-describedby="amountError"
        :state="isValidAmount"
        placeholder="Amount of Tokens"
      ></b-form-input>
      <b-form-invalid-feedback id="amountError">
        This is a required field and must be a positive decimal or integer value that is less than the current account's token balance
      </b-form-invalid-feedback>
    </b-form-group>
    <div class="text-right">
      <b-button
        v-on:click="createTokenSend()"
        type="submit"
        variant="primary"
        :disabled="!isValidAmount || !transaction.destination || !selectedToken"
      >
        Send Tokens
      </b-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import bFormGroup from 'bootstrap-vue/es/components/form-group/form-group'
import bFormInput from 'bootstrap-vue/es/components/form-input/form-input'
import LogosAddress from '@/components/LogosAddress.vue'
import Multiselect from 'vue-multiselect'
import cloneDeep from 'lodash/cloneDeep'
import bigInt from 'big-integer'

export default {
  name: 'sendForm',
  data () {
    return {
      accounts: [],
      selectedToken: null,
      transaction: {
        destination: null,
        amount: ''
      }
    }
  },
  components: {
    bFormGroup,
    bFormInput,
    LogosAddress,
    Multiselect
  },
  computed: {
    ...mapState('forge', {
      forgeAccounts: state => state.accounts,
      forgeTokens: state => state.tokens,
      currentAccount: state => state.currentAccount
    }),
    combinedAccounts: function () {
      let forgeAccounts = cloneDeep(this.forgeAccounts)
      if (this.currentAccount) delete forgeAccounts[this.currentAccount.address]
      return Array.from(Object.values(forgeAccounts)).concat(this.accounts)
    },
    isValidAmount: function () {
      if (this.transaction.amount === '') return null
      let token = this.selectedToken
      if (!token) return null
      let amountInRaw = cloneDeep(this.transaction.amount)
      if (amountInRaw && token && token.issuerInfo &&
        typeof token.issuerInfo.decimals !== 'undefined' &&
        token.issuerInfo.decimals > 0) {
        if (!/^([0-9]+(?:[.][0-9]*)?|\.[0-9]+)$/.test(amountInRaw)) return false
        amountInRaw = this.$Logos.convert.fromTo(amountInRaw, token.issuerInfo.decimals, 0)
      } else {
        if (!/^([0-9]+)$/.test(amountInRaw)) return false
      }
      if (token.fee_type === 'flat') {
        return (bigInt(this.currentAccount.tokenBalances[this.$utils.keyFromAccount(token.tokenAccount)])
          .minus(bigInt(token.fee_rate))
          .greaterOrEquals(bigInt(amountInRaw)))
      } else {
        return (bigInt(this.currentAccount.tokenBalances[this.$utils.keyFromAccount(token.tokenAccount)])
          .greaterOrEquals(bigInt(amountInRaw)))
      }
    },
    sendableTokens: function () {
      let tokens = []
      if (this.currentAccount && this.currentAccount.tokenBalances) {
        for (let tokenID in this.currentAccount.tokenBalances) {
          let forgeToken = this.forgeTokens[this.$utils.parseAccount(tokenID)]
          if (forgeToken.fee_type === 'flat') {
            if (bigInt(this.currentAccount.tokenBalances[tokenID])
              .minus(bigInt(forgeToken.fee_rate)).greater(0)) {
              tokens.push(forgeToken)
            }
          } else {
            if (bigInt(this.currentAccount.tokenBalances[tokenID]).greater(0)) {
              tokens.push(forgeToken)
            }
          }
        }
      }
      return tokens
    },
    availableToSend: function () {
      if (this.selectedToken) {
        let amount = null
        if (this.selectedToken.issuerInfo && typeof this.selectedToken.issuerInfo.decimals !== 'undefined') {
          amount = this.$Logos.convert.fromTo(this.currentAccount.tokenBalances[this.$utils.keyFromAccount(this.selectedToken.tokenAccount)], 0, this.selectedToken.issuerInfo.decimals)
          return `${amount} ${this.selectedToken.symbol} are available to send`
        } else {
          amount = this.currentAccount.tokenBalances[this.$utils.keyFromAccount(this.selectedToken.tokenAccount)]
          return `${amount} base units of ${this.selectedToken.name} are available to send`
        }
      }
      return 'Select a token first'
    }
  },
  methods: {
    addDestiantionAccount (newAddress) {
      if (newAddress.match(/^lgs_[13456789abcdefghijkmnopqrstuwxyz]{60}$/) !== null) {
        let newAccount = { label: newAddress, address: newAddress }
        this.accounts.push(newAccount)
        this.transaction.destination = newAccount
      }
    },
    createTokenSend () {
      if (this.transaction.destination &&
        this.transaction.amount &&
        this.transaction.destination.address.match(/^lgs_[13456789abcdefghijkmnopqrstuwxyz]{60}$/) !== null) {
        let amountInBaseUnit = null
        if (this.selectedToken.issuerInfo && typeof this.selectedToken.issuerInfo.decimals !== 'undefined') {
          amountInBaseUnit = this.$Logos.convert.fromTo(this.transaction.amount, this.selectedToken.issuerInfo.decimals, 0)
        } else {
          amountInBaseUnit = this.transaction.amount
        }
        // Check if target account is open?
        if (this.selectedToken.fee_type === 'flat') {
          if (bigInt(this.currentAccount.tokenBalances[this.$utils.keyFromAccount(this.selectedToken.tokenAccount)])
            .minus(bigInt(this.selectedToken.fee_rate))
            .greaterOrEquals(bigInt(amountInBaseUnit))) {
            this.$wallet.account.createTokenSendRequest(
              this.selectedToken.tokenAccount,
              [{
                destination: this.transaction.destination.address,
                amount: amountInBaseUnit
              }]
            )
          }
        } else {
          if (bigInt(this.currentAccount.tokenBalances[this.$utils.keyFromAccount(this.selectedToken.tokenAccount)])
            .greaterOrEquals(bigInt(amountInBaseUnit))) {
            this.$wallet.account.createTokenSendRequest(
              this.selectedToken.tokenAccount,
              [{
                destination: this.transaction.destination.address,
                amount: amountInBaseUnit
              }]
            )
          }
        }
      }
    },
    nameWithAddress ({ name, tokenAccount }) {
      return `${name} — ${tokenAccount.substring(0, 9)}...${tokenAccount.substring(59, 64)}`
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
    if (this.sendableTokens.length > 0) {
      this.selectedToken = this.sendableTokens[0]
    }
    if (this.combinedAccounts.length > 0) {
      this.transaction.destination = this.combinedAccounts[0]
    }
  },
  watch: {
    sendableTokens: function (newTks, oldTks) {
      if (newTks.length > 0) {
        let valid = false
        for (let token in newTks) {
          if (token.tokenAccount === this.selectedToken.token) {
            this.selectedToken = token
          }
        }
        if (valid === false) {
          this.selectedToken = newTks[0]
        }
      } else {
        this.selectedToken = null
      }
    }
  }
}
</script>
