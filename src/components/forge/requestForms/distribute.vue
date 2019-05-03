<template>
  <div>
    <b-form-group
      id="distributeToken"
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
        :options="distributableTokens"
        :disabled="distributableTokens.length <= 1"
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
        You must select a token to distribute from
      </div>
      <div v-if="selectedToken && !sufficientBalance" style="display:block" class="invalid-feedback">
        {{selectedToken.name}} has an insufficient supply of logos to afford the fee for this transaction
      </div>
      <div v-if="selectedToken && !sufficientTokenBalance" style="display:block" class="invalid-feedback">
        {{selectedToken.name}} has no tokens to distribute
      </div>
    </b-form-group>

    <b-form-group
      id="distributeDestination"
      label="Distribute To"
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
      <div v-if="!transaction.destination" style="display:block" class="invalid-feedback">
        You must select an account to distribute to
      </div>
    </b-form-group>

    <b-form-group
      id="distributeAmount"
      label="Amount"
      label-size="lg"
      :description="availableToSend"
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
        This is a required field and must be a positive decimal or integer value that is less than the token balance
      </b-form-invalid-feedback>
    </b-form-group>
    <div class="text-right">
      <b-button
        v-on:click="createDistribute()"
        type="submit"
        :disabled="!isValidAmount || !sufficientBalance || !sufficientTokenBalance || !transaction.destination"
        variant="primary"
      >
          Distribute Tokens
      </b-button>
    </div>
  </div>
</template>

<script>
import bigInt from 'big-integer'
export default {
  name: 'distributeForm',
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
      if (amountInRaw === null) return false
      return (
        bigInt(amountInRaw).greater(0) &&
        bigInt(this.selectedToken.tokenBalance).greaterOrEquals(bigInt(amountInRaw))
      )
    },
    sufficientBalance: function () {
      if (!this.selectedToken) return null
      return bigInt(this.selectedToken.balance).greaterOrEquals(bigInt(this.$utils.minimumFee))
    },
    sufficientTokenBalance: function () {
      if (!this.selectedToken) return null
      return bigInt(this.selectedToken.tokenBalance).greater(0)
    },
    combinedAccounts: function () {
      return Array.from(Object.values(this.forgeAccounts)).concat(this.accounts)
    },
    distributableTokens: function () {
      let tokens = []
      for (let tokenAddress in this.forgeTokens) {
        let token = this.forgeTokens[tokenAddress]
        for (let controllerAddress in token.controllers) {
          let controller = token.controllers[controllerAddress]
          if (controller.account === this.currentAccount.address &&
            controller.privileges.distribute) {
            tokens.push(token)
          }
        }
      }
      return tokens
    },
    availableToSend: function () {
      if (this.selectedToken) {
        let amount = null
        if (this.issuerInfo && typeof this.issuerInfo.decimals !== 'undefined') {
          amount = this.$Logos.convert.fromTo(this.selectedToken.tokenBalance, 0, this.issuerInfo.decimals)
          return `${amount} ${this.selectedToken.symbol} are available to distribute`
        } else {
          amount = this.selectedToken.tokenBalance
          return `${amount} base units of ${this.selectedToken.symbol} are available to distribute`
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
    createDistribute () {
      if (this.transaction.destination &&
        this.transaction.amount &&
        this.transaction.destination.address.match(/^lgs_[13456789abcdefghijkmnopqrstuwxyz]{60}$/) !== null) {
        let amountInBaseUnit = null
        if (this.issuerInfo && typeof this.issuerInfo.decimals !== 'undefined') {
          amountInBaseUnit = this.$Logos.convert.fromTo(this.transaction.amount, this.issuerInfo.decimals, 0)
        } else {
          amountInBaseUnit = this.transaction.amount
        }
        // TODO check if target account is open & whitelisted & not frozen
        if (bigInt(this.selectedToken.tokenBalance)
          .greaterOrEquals(bigInt(amountInBaseUnit))) {
          let data = {
            tokenAccount: this.selectedToken.address,
            transaction: {
              destination: this.transaction.destination.address,
              amount: amountInBaseUnit
            }
          }
          this.$wallet.account.createDistributeRequest(data)
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
    if (this.distributableTokens.length > 0) {
      this.selectedToken = this.distributableTokens[0]
    }
    this.transaction.destination = this.currentAccount
  },
  watch: {
    distributableTokens: {
      handler: function (newTks, oldTks) {
        if (newTks.length > 0) {
          let found = false
          for (let tkAccount of newTks) {
            if (this.selectedToken && tkAccount.address === this.selectedToken.address) {
              this.selectedToken = tkAccount
              found = true
            }
          }
          if (!found) this.selectedToken = newTks[0]
        } else {
          this.selectedToken = null
        }
      },
      deep: true
    }
  }
}
</script>
