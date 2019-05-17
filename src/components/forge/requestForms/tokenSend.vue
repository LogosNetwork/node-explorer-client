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
        track-by="address"
        label="name"
        :custom-label="nameWithAddress"
        :options="sendableTokens"
        :disabled="sendableTokens.length <= 1"
        :multiple="false"
        placeholder="Search for a token"
      >
        <template slot="singleLabel" slot-scope="{ option }">
          <span v-if="option.name !== option.address">
            <strong>{{ option.name }}</strong>  -
          </span>
          <LogosAddress :inactive="true" :force="true" :address="option.address" />
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
import cloneDeep from 'lodash.clonedeep'
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
    'b-form-group': () => import(/* webpackChunkName: "b-form-group" */'bootstrap-vue/es/components/form-group/form-group'),
    'b-form-input': () => import(/* webpackChunkName: "b-form-input" */'bootstrap-vue/es/components/form-input/form-input'),
    'b-form-invalid-feedback': () => import(/* webpackChunkName: "b-form-invalid-feedback" */'bootstrap-vue/es/components/form/form-invalid-feedback'),
    'LogosAddress': () => import(/* webpackChunkName: "LogosAddress" */'@/components/LogosAddress.vue'),
    'Multiselect': () => import(/* webpackChunkName: "Multiselect" */'vue-multiselect')
  },
  computed: {
    issuerInfo: function () {
      if (!this.selectedToken) return null
      try {
        return JSON.parse(this.selectedToken.issuerInfo)
      } catch (e) {
        return {}
      }
    },
    currentAccount: function () {
      return this.$wallet.account
    },
    combinedAccounts: function () {
      let forgeAccounts = cloneDeep(this.$wallet.accountsObject)
      if (this.currentAccount) delete forgeAccounts[this.currentAccount.address]
      return Array.from(Object.values(forgeAccounts)).concat(this.accounts)
    },
    isValidAmount: function () {
      if (this.transaction.amount === '') return null
      if (!this.selectedToken) return null
      let amountInRaw = null
      if (this.issuerInfo && typeof this.issuerInfo.decimals !== 'undefined' &&
        this.issuerInfo.decimals > 0) {
        if (!/^([0-9]+(?:[.][0-9]*)?|\.[0-9]+)$/.test(this.transaction.amount)) return false
        amountInRaw = this.$Logos.convert.fromTo(this.transaction.amount, this.issuerInfo.decimals, 0)
      } else {
        amountInRaw = this.transaction.amount
        if (!/^([0-9]+)$/.test(amountInRaw)) return false
      }
      if (amountInRaw === null) return false
      if (this.selectedToken.feeType === 'flat') {
        return (bigInt(this.currentAccount.tokenBalances[this.$utils.keyFromAccount(this.selectedToken.address)])
          .minus(bigInt(this.selectedToken.feeRate))
          .greaterOrEquals(bigInt(amountInRaw)))
      } else {
        return (bigInt(this.currentAccount.tokenBalances[this.$utils.keyFromAccount(this.selectedToken.address)])
          .greaterOrEquals(bigInt(amountInRaw)))
      }
    },
    sendableTokens: function () {
      let tokens = []
      if (this.currentAccount && this.currentAccount.tokenBalances) {
        for (let tokenID in this.currentAccount.tokenBalances) {
          let forgeToken = this.$wallet.tokenAccounts[this.$utils.parseAccount(tokenID)]
          if (forgeToken.feeType === 'flat') {
            if (bigInt(this.currentAccount.tokenBalances[tokenID])
              .minus(bigInt(forgeToken.feeRate)).greater(0)) {
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
        let amountInBaseUnit = this.currentAccount.tokenBalances[this.$utils.keyFromAccount(this.selectedToken.address)]
        if (this.selectedToken.feeType === 'flat') {
          amountInBaseUnit = bigInt(amountInBaseUnit).minus(bigInt(this.selectedToken.feeRate)).toString()
        }
        if (this.issuerInfo && typeof this.issuerInfo.decimals !== 'undefined') {
          amount = this.$Logos.convert.fromTo(amountInBaseUnit, 0, this.issuerInfo.decimals)
          return `${amount} ${this.selectedToken.symbol} are available to send`
        } else {
          amount = amountInBaseUnit
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
        if (this.issuerInfo && typeof this.issuerInfo.decimals !== 'undefined') {
          amountInBaseUnit = this.$Logos.convert.fromTo(this.transaction.amount, this.issuerInfo.decimals, 0)
        } else {
          amountInBaseUnit = this.transaction.amount
        }
        // Check if target account is open?
        if (this.selectedToken.feeType === 'flat') {
          if (bigInt(this.currentAccount.tokenBalances[this.$utils.keyFromAccount(this.selectedToken.address)])
            .minus(bigInt(this.selectedToken.feeRate))
            .greaterOrEquals(bigInt(amountInBaseUnit))) {
            this.$wallet.account.createTokenSendRequest(
              this.selectedToken.address,
              [{
                destination: this.transaction.destination.address,
                amount: amountInBaseUnit
              }]
            )
          }
        } else {
          if (bigInt(this.currentAccount.tokenBalances[this.$utils.keyFromAccount(this.selectedToken.address)])
            .greaterOrEquals(bigInt(amountInBaseUnit))) {
            this.$wallet.account.createTokenSendRequest(
              this.selectedToken.address,
              [{
                destination: this.transaction.destination.address,
                amount: amountInBaseUnit
              }]
            )
          }
        }
      }
    },
    nameWithAddress ({ name, address }) {
      return `${name} — ${address.substring(0, 9)}...${address.substring(59, 64)}`
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
    sendableTokens: {
      handler: function (newTks, oldTks) {
        if (newTks.length > 0) {
          let valid = false
          for (let token of newTks) {
            if (this.selectedToken && token.address === this.selectedToken.address) {
              this.selectedToken = token
              valid = true
            }
          }
          if (valid === false) {
            this.selectedToken = newTks[0]
          }
        } else {
          this.selectedToken = null
        }
      },
      deep: true
    }
  }
}
</script>
