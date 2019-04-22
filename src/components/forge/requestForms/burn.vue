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
        track-by="tokenAccount"
        label="name"
        :custom-label="nameWithAddress"
        :options="burnableTokens"
        :disabled="burnableTokens.length <= 1"
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
import { mapState } from 'vuex'
import bFormGroup from 'bootstrap-vue/es/components/form-group/form-group'
import bFormInput from 'bootstrap-vue/es/components/form-input/form-input'
import LogosAddress from '@/components/LogosAddress.vue'
import Multiselect from 'vue-multiselect'
import cloneDeep from 'lodash.clonedeep'
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
    bFormGroup,
    bFormInput,
    LogosAddress,
    Multiselect
  },
  computed: {
    ...mapState('forge', {
      forgeTokens: state => state.tokens,
      currentAccount: state => state.currentAccount
    }),
    isValidAmount: function () {
      if (this.amount === '') return null
      let token = this.selectedToken
      if (!token) return null
      let amountInRaw = cloneDeep(this.amount)
      if (amountInRaw && token && token.issuerInfo &&
        typeof token.issuerInfo.decimals !== 'undefined' &&
        token.issuerInfo.decimals > 0) {
        if (!/^([0-9]+(?:[.][0-9]*)?|\.[0-9]+)$/.test(amountInRaw)) return false
        amountInRaw = this.$Logos.convert.fromTo(amountInRaw, token.issuerInfo.decimals, 0)
      } else {
        if (!/^([0-9]+)$/.test(amountInRaw)) return false
      }
      return (
        bigInt(amountInRaw).greater(0) &&
        bigInt(token.token_balance).greaterOrEquals(bigInt(amountInRaw))
      )
    },
    sufficientBalance: function () {
      if (!this.selectedToken) return null
      return bigInt(this.selectedToken.balance).greaterOrEquals(bigInt(this.$utils.minimumFee))
    },
    sufficientTokenBalance: function () {
      if (!this.selectedToken) return null
      return bigInt(this.selectedToken.token_balance).greater(0)
    },
    burnableTokens: function () {
      let tokens = []
      for (let tokenAddress in this.forgeTokens) {
        if (this.forgeTokens[tokenAddress].controllers instanceof Array) {
          for (let controller of this.forgeTokens[tokenAddress].controllers) {
            if (controller.account === this.currentAccount.address &&
              controller.privileges instanceof Array &&
              controller.privileges.indexOf('burn') > -1) {
              tokens.push(this.forgeTokens[tokenAddress])
            }
          }
        }
      }
      return tokens
    },
    availableToBurn: function () {
      if (this.selectedToken) {
        let amount = null
        if (this.selectedToken.issuerInfo && typeof this.selectedToken.issuerInfo.decimals !== 'undefined') {
          amount = this.$Logos.convert.fromTo(this.selectedToken.token_balance, 0, this.selectedToken.issuerInfo.decimals)
          return `${amount} ${this.selectedToken.symbol} are available to burn`
        } else {
          amount = this.selectedToken.token_balance
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
        if (this.selectedToken.issuerInfo && typeof this.selectedToken.issuerInfo.decimals !== 'undefined') {
          amountInBaseUnit = this.$Logos.convert.fromTo(this.amount, this.selectedToken.issuerInfo.decimals, 0)
        } else {
          amountInBaseUnit = this.amount
        }
        let data = {
          tokenAccount: this.selectedToken.tokenAccount,
          amount: amountInBaseUnit
        }
        this.$wallet.account.createBurnRequest(data)
      }
    },
    nameWithAddress ({ name, tokenAccount }) {
      return `${name} — ${tokenAccount.substring(0, 9)}...${tokenAccount.substring(59, 64)}`
    }
  },
  created: function () {
    if (this.burnableTokens.length > 0) {
      this.selectedToken = this.burnableTokens[0]
    }
  },
  watch: {
    burnableTokens: function (newDistTks, oldDistTks) {
      if (newDistTks.length > 0) {
        let valid = false
        for (let token of newDistTks) {
          if (this.selectedToken && token.tokenAccount === this.selectedToken.tokenAccount) {
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
    }
  }
}
</script>
