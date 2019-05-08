<template>
  <div>
    <b-form-group
      id="issueAdditionalToken"
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
        :options="issuableTokens"
        :disabled="issuableTokens.length <= 1"
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
        You must select a token to mint additional tokens
      </div>
      <div v-if="selectedToken && !sufficientBalance" style="display:block" class="invalid-feedback">
        {{selectedToken.name}} has an insufficient supply of logos to afford the fee for this transaction
      </div>
    </b-form-group>

    <b-form-group
      id="additionalAmount"
      label="Amount"
      label-size="lg"
      :description="availableToIssue"
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
        This is a required field and must be a positive decimal or integer value that is less than the uint128 - base token total supply
      </b-form-invalid-feedback>
    </b-form-group>

    <div class="text-right">
      <b-button
        v-on:click="createIssueAdditional()"
        type="submit"
        :disabled="!sufficientBalance || !selectedToken || !amount || !isValidAmount"
        variant="primary"
      >
          Mint Tokens
      </b-button>
    </div>
  </div>
</template>

<script>
import bigInt from 'big-integer'
import cloneDeep from 'lodash.clonedeep'
export default {
  name: 'issueAdditionalForm',
  data () {
    return {
      selectedToken: null,
      amount: null
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
        bigInt(this.$utils.MAXUINT128).minus(bigInt(this.selectedToken.totalSupply)).greaterOrEquals(bigInt(amountInRaw))
      )
    },
    sufficientBalance: function () {
      if (!this.selectedToken) return null
      return bigInt(this.selectedToken.balance).greaterOrEquals(bigInt(this.$utils.minimumFee))
    },
    availableToIssue: function () {
      if (this.selectedToken) {
        let amountInRaw = bigInt(this.$utils.MAXUINT128).minus(bigInt(this.selectedToken.totalSupply))
        if (this.issuerInfo && typeof this.issuerInfo.decimals !== 'undefined') {
          amountInRaw = this.$Logos.convert.fromTo(amountInRaw, 0, this.issuerInfo.decimals)
          return `You can mint an additional ${amountInRaw} ${this.selectedToken.symbol}`
        } else {
          return `You can mint an additional ${amountInRaw} base units of ${this.selectedToken.symbol}`
        }
      }
      return 'Select a token first'
    },
    issuableTokens: function () {
      let tokens = []
      for (let tokenAddress in this.forgeTokens) {
        let token = this.forgeTokens[tokenAddress]
        for (let controllerAddress in token.controllers) {
          let controller = token.controllers[controllerAddress]
          if (controller.account === this.currentAccount.address) {
            if (token.settings.issuance && controller.privileges.issuance) {
              tokens.push(token)
            }
          }
        }
      }
      return tokens
    }
  },
  methods: {
    createIssueAdditional () {
      if (this.sufficientBalance && this.selectedToken && this.amount && this.isValidAmount) {
        let amountInRaw = cloneDeep(this.amount)
        if (amountInRaw && this.issuerInfo &&
          typeof this.issuerInfo.decimals !== 'undefined' &&
          this.issuerInfo.decimals > 0) {
          amountInRaw = this.$Logos.convert.fromTo(amountInRaw, this.issuerInfo.decimals, 0)
        }
        let data = {
          tokenAccount: this.selectedToken.address,
          amount: amountInRaw
        }
        this.$wallet.account.createIssueAdditionalRequest(data)
      }
    },
    nameWithAddress ({ name, address }) {
      return `${name} — ${address.substring(0, 9)}...${address.substring(59, 64)}`
    }
  },
  created: function () {
    if (this.issuableTokens.length > 0) {
      this.selectedToken = this.issuableTokens[0]
    }
  },
  watch: {
    issuableTokens: {
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
