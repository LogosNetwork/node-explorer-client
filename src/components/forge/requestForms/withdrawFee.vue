<template>
  <div>
    <b-form-group
      id="withdrawFeeToken"
      label="Select Token"
      label-size="lg"
    >
      <Multiselect
        id="tokenSelector"
        v-model="selectedToken"
        required
        track-by="address"
        label="name"
        :custom-label="nameWithAddress"
        :options="withdrawableTokens"
        :disabled="withdrawableTokens.length <= 1"
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
      <div v-if="!selectedToken" style="display:block" class="invalid-feedback">
        You must select a token to withdraw from
      </div>
      <div v-if="selectedToken && !sufficientBalance" style="display:block" class="invalid-feedback">
        {{selectedToken.name}} has an insufficient supply of logos to afford the fee for this transaction
      </div>
      <div v-if="selectedToken && !sufficientTokenFeeBalance" style="display:block" class="invalid-feedback">
        {{selectedToken.name}} has no tokens to withdraw
      </div>
    </b-form-group>

    <b-form-group
      id="withdrawFeeDestination"
      label="Send the fees To"
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
        @tag="addAccount"
        placeholder="Search or add an account"
      >
        <template slot="singleLabel" slot-scope="{ option }">
          <span v-if="option.label !== option.address">
            <strong>{{ option.label }}</strong>  -
          </span>
          <LogosAddress :inactive="true" :force="true" :address="option.address" />
        </template>
      </Multiselect>
      <div v-if="!transaction.destination" style="display:block" class="invalid-feedback">
        You must select an account to withdraw the fees to
      </div>
    </b-form-group>

    <b-form-group
      id="distributeAmount"
      label="Amount"
      label-size="lg"
      :description="availableToWithdraw"
    >
      <b-form-input
        id="amountInput"
        v-model="transaction.amount"
        aria-describedby="amountError"
        :state="isValidAmount"
        autocomplete="off"
        required
        placeholder="Amount of Tokens"
      ></b-form-input>
      <b-form-invalid-feedback id="amountError">
        This is a required field and must be a positive decimal or integer value that is less than the token fee balance
      </b-form-invalid-feedback>
    </b-form-group>
    <div class="text-right">
      <b-button
        v-on:click="createWithdrawFee()"
        type="submit"
        :disabled="!isValidAmount || !sufficientBalance || !sufficientTokenFeeBalance || !transaction.destination"
        variant="primary"
      >
          Withdraw Fees
      </b-button>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash.clonedeep'
import bigInt from 'big-integer'
export default {
  name: 'withdrawFeeForm',
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
    forgeAccounts: function () {
      return this.$wallet.accountsObject
    },
    forgeTokens: function () {
      return this.$wallet.tokenAccounts
    },
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
      return (
        bigInt(amountInRaw).greater(0) &&
        bigInt(this.selectedToken.tokenFeeBalance).greaterOrEquals(bigInt(amountInRaw))
      )
    },
    sufficientBalance: function () {
      if (!this.selectedToken) return null
      return bigInt(this.selectedToken.balance).greaterOrEquals(bigInt(this.$utils.minimumFee))
    },
    sufficientTokenFeeBalance: function () {
      if (!this.selectedToken) return null
      return bigInt(this.selectedToken.tokenFeeBalance).greater(0)
    },
    combinedAccounts: function () {
      let forgeAccounts = cloneDeep(this.forgeAccounts)
      return Array.from(Object.values(forgeAccounts)).concat(this.accounts)
    },
    withdrawableTokens: function () {
      let tokens = []
      for (let tokenAddress in this.forgeTokens) {
        let token = this.forgeTokens[tokenAddress]
        for (let controllerAddress in token.controllers) {
          let controller = token.controllers[controllerAddress]
          if (controller.account === this.currentAccount.address &&
            controller.privileges.withdraw_fee) {
            tokens.push(token)
          }
        }
      }
      return tokens
    },
    availableToWithdraw: function () {
      if (this.selectedToken) {
        let amount = null
        if (this.issuerInfo && typeof this.issuerInfo.decimals !== 'undefined') {
          amount = this.$Logos.convert.fromTo(this.selectedToken.tokenFeeBalance, 0, this.issuerInfo.decimals)
          return `${amount} ${this.selectedToken.symbol} in fees is available to withdraw`
        } else {
          amount = this.selectedToken.tokenFeeBalance
          return `${amount} base units of ${this.selectedToken.symbol} in fees is available to withdraw`
        }
      }
      return 'Select a token first'
    }
  },
  methods: {
    addAccount (newAddress) {
      if (newAddress.match(/^lgs_[13456789abcdefghijkmnopqrstuwxyz]{60}$/) !== null) {
        let newAccount = { label: newAddress, address: newAddress }
        this.accounts.push(newAccount)
        this.transaction.destination = newAccount
      }
    },
    createWithdrawFee () {
      if (this.isValidAmount &&
        this.sufficientBalance &&
        this.sufficientTokenFeeBalance &&
        this.transaction.destination) {
        let amountInRaw = null
        if (this.issuerInfo && typeof this.issuerInfo.decimals !== 'undefined') {
          amountInRaw = this.$Logos.convert.fromTo(this.transaction.amount, this.issuerInfo.decimals, 0)
        } else {
          amountInRaw = this.amount
        }
        let data = {
          tokenAccount: this.selectedToken.address,
          transaction: {
            destination: this.transaction.destination.address,
            amount: amountInRaw
          }
        }
        this.$wallet.account.createWithdrawFeeRequest(data)
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
    if (this.withdrawableTokens.length > 0) {
      this.selectedToken = this.withdrawableTokens[0]
    }
    this.transaction.destination = this.currentAccount
  },
  watch: {
    withdrawableTokens: {
      handler: function (newDistTks, oldDistTks) {
        if (newDistTks.length > 0) {
          let valid = false
          for (let token of newDistTks) {
            if (this.selectedToken && token.address === this.selectedToken.address) {
              this.selectedToken = token
              valid = true
            }
          }
          if (valid === false) {
            this.selectedToken = newDistTks[0]
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
