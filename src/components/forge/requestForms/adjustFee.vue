<template>
  <div>
    <b-form-group
      id="adjustFeeToken"
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
        :options="adjustableTokens"
        :disabled="adjustableTokens.length <= 1"
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
        You must select a token to adjust the token's fee
      </div>
      <div v-if="selectedToken && !sufficientBalance" style="display:block" class="invalid-feedback">
        {{selectedToken.name}} has an insufficient supply of logos to afford the fee for this transaction
      </div>
    </b-form-group>

    <b-form-group
      id="tokenFeeType"
      label="Fee Type"
      label-size="lg"
      description=""
    >
      <multiselect
        id="feeTypeInput"
        :allow-empty="false"
        :searchable="false"
        deselect-label="Can't remove this value"
        v-model="feeType"
        :options="feeOptions"
      >
      </multiselect>
    </b-form-group>

    <b-form-group
      id="tokenFeeRate"
      label="Fee Rate"
      label-size="lg"
      :description="feeType === 'flat' ? `The flat number of base unit tokens to charge for each token send` : `The percentage to charge in fees for each token send 0%-100%`"
    >
      <b-form-input
        id="feeRateInput"
        v-model="feeRate"
        autocomplete="off"
        aria-describedby="rateError"
        :state="validFeeRate"
        placeholder="Enter the fee rate"
      ></b-form-input>
      <b-form-invalid-feedback id="rateError">
        This is a required field and must be an integer value that is <span v-if='feeType === "flat"'>less than the total supply of {{selectedToken.totalSupply}}</span><span v-if='feeType === "percentage"'>between 0 - 100</span>
      </b-form-invalid-feedback>
    </b-form-group>

    <div class="text-right">
      <b-button
        v-on:click="createAdjustFee()"
        type="submit"
        :disabled="!sufficientBalance || !selectedToken || !validFeeRate"
        variant="primary"
      >
          Adjust Fee
      </b-button>
    </div>
  </div>
</template>

<script>
import bigInt from 'big-integer'
export default {
  name: 'adjustFeeForm',
  data () {
    return {
      selectedToken: null,
      feeRate: null,
      feeType: null,
      feeOptions: ['flat', 'percentage']
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
    currentAccount: function () {
      return this.$wallet.account
    },
    sufficientBalance: function () {
      if (!this.selectedToken) return null
      return bigInt(this.selectedToken.balance).greaterOrEquals(bigInt(this.$utils.minimumFee))
    },
    adjustableTokens: function () {
      let tokens = []
      for (let tokenAddress in this.forgeTokens) {
        for (let controller in this.forgeTokens[tokenAddress].controllers) {
          if (this.forgeTokens[tokenAddress].controllers[controller].account === this.currentAccount.address) {
            if (this.forgeTokens[tokenAddress].settings.adjust_fee &&
            this.forgeTokens[tokenAddress].controllers[controller].privileges.adjust_fee) {
              tokens.push(this.forgeTokens[tokenAddress])
            }
          }
        }
      }
      return tokens
    },
    validFeeRate: function () {
      if (!this.selectedToken) return false
      if (!/^([0-9]+)$/.test(this.feeRate)) return false
      if (this.feeType === 'percentage' && bigInt(this.feeRate).lesserOrEquals(bigInt('100'))) {
        return true
      } else if (this.feeType === 'flat' && bigInt(this.feeRate).lesserOrEquals(bigInt(this.selectedToken.totalSupply))) {
        return true
      }
      return false
    }
  },
  methods: {
    createAdjustFee () {
      if (this.sufficientBalance && this.selectedToken && this.validFeeRate) {
        let data = {
          tokenAccount: this.selectedToken.address,
          feeRate: this.feeRate,
          feeType: this.feeType
        }
        this.$wallet.account.createAdjustFeeRequest(data)
      }
    },
    nameWithAddress ({ name, address }) {
      return `${name} — ${address.substring(0, 9)}...${address.substring(59, 64)}`
    }
  },
  created: function () {
    if (this.adjustableTokens.length > 0) {
      this.selectedToken = this.adjustableTokens[0]
    }
  },
  watch: {
    selectedToken: function (newTk, oldTk) {
      this.feeRate = newTk.feeRate
      this.feeType = newTk.feeType
    },
    adjustableTokens: {
      handler: function (newTks, oldTks) {
        if (newTks.length > 0) {
          let valid = false
          for (let token of newTks) {
            if (this.selectedToken && token.address === this.selectedToken.address) {
              this.selectedToken = token
              valid = true
            }
          }
          if (!valid) this.selectedToken = newTks[0]
        } else {
          this.selectedToken = null
        }
      },
      deep: true
    }
  }
}
</script>
