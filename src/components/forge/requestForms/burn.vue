<template>
  <div>
    <b-form-group
      id="burnToken"
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
        :options="burnableTokens"
        :disabled="burnableTokens.length <= 1"
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
        You must select a token to burn
      </div>
      <div v-if="selectedToken && !sufficientBalance" style="display:block" class="invalid-feedback">
        {{selectedToken.name}} has an insufficient supply of logos to afford the fee for this transaction
      </div>
      <div v-if="selectedToken && !sufficientTokenBalance" style="display:block" class="invalid-feedback">
        {{selectedToken.name}} has no tokens to burn
      </div>
    </b-form-group>

    <b-form-group
      id="burnAmount"
      label="Amount"
      label-size="lg"
      :description="availableToBurn"
    >
      <b-form-input
        id="amountInput"
        v-model="amount"
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
        v-on:click="createBurn()"
        type="submit"
        :disabled="!isValidAmount || !sufficientBalance || !sufficientTokenBalance"
        variant="primary"
      >
          Burn Tokens
      </b-button>
    </div>
  </div>
</template>

<script>
import bigInt from 'big-integer'
export default {
  name: 'burnForm',
  data () {
    return {
      selectedToken: null,
      amount: ''
    }
  },
  components: {
    'b-form-group': () => import(/* webpackChunkName: "b-form-group" */'bootstrap-vue/es/components/form-group/form-group'),
    'b-form-input': () => import(/* webpackChunkName: "b-form-input" */'bootstrap-vue/es/components/form-input/form-input'),
    'LogosAddress': () => import(/* webpackChunkName: "LogosAddress" */'@/components/LogosAddress.vue'),
    'b-form-invalid-feedback': () => import(/* webpackChunkName: "b-form-invalid-feedback" */'bootstrap-vue/es/components/form/form-invalid-feedback'),
    'Multiselect': () => import(/* webpackChunkName: "Multiselect" */'vue-multiselect')
  },
  computed: {
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
      if (this.amount === '') return null
      if (!this.selectedToken) return null
      let amountInRaw = null
      if (this.issuerInfo && typeof this.issuerInfo.decimals !== 'undefined' &&
        this.issuerInfo.decimals > 0) {
        if (!/^([0-9]+(?:[.][0-9]*)?|\.[0-9]+)$/.test(this.amount)) return false
        amountInRaw = this.$Logos.convert.fromTo(this.amount, this.issuerInfo.decimals, 0)
      } else {
        amountInRaw = this.amount
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
    burnableTokens: function () {
      let tokens = []
      for (let tokenAddress in this.forgeTokens) {
        for (let controller in this.forgeTokens[tokenAddress].controllers) {
          if (this.forgeTokens[tokenAddress].controllers[controller].account === this.currentAccount.address &&
            this.forgeTokens[tokenAddress].controllers[controller].privileges.burn) {
            tokens.push(this.forgeTokens[tokenAddress])
          }
        }
      }
      return tokens
    },
    availableToBurn: function () {
      if (this.selectedToken) {
        let amount = null
        if (this.issuerInfo && typeof this.issuerInfo.decimals !== 'undefined') {
          amount = this.$Logos.convert.fromTo(this.selectedToken.tokenBalance, 0, this.issuerInfo.decimals)
          return `${amount} ${this.selectedToken.symbol} are available to burn`
        } else {
          amount = this.selectedToken.tokenBalance
          return `${amount} base units of ${this.selectedToken.symbol} are available to burn`
        }
      }
      return 'Select a token first'
    }
  },
  methods: {
    createBurn () {
      if (this.isValidAmount && this.sufficientBalance && this.sufficientTokenBalance) {
        let amountInBaseUnit = null
        if (this.issuerInfo && typeof this.issuerInfo.decimals !== 'undefined') {
          amountInBaseUnit = this.$Logos.convert.fromTo(this.amount, this.issuerInfo.decimals, 0)
        } else {
          amountInBaseUnit = this.amount
        }
        let data = {
          tokenAccount: this.selectedToken.address,
          amount: amountInBaseUnit
        }
        this.$wallet.account.createBurnRequest(data)
      }
    },
    nameWithAddress ({ name, address }) {
      return `${name} — ${address.substring(0, 9)}...${address.substring(59, 64)}`
    }
  },
  created: function () {
    if (this.burnableTokens.length > 0) {
      this.selectedToken = this.burnableTokens[0]
    }
  },
  watch: {
    burnableTokens: {
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
