<template>
  <div>
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
import { BFormGroup, BFormInput, BFormInvalidFeedback } from 'bootstrap-vue'

export default {
  name: 'burnForm',
  props: {
    tokenAccount: Object
  },
  data () {
    return {
      amount: ''
    }
  },
  components: {
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback
  },
  computed: {
    issuerInfo: function () {
      if (!this.tokenAccount) return null
      try {
        return JSON.parse(this.tokenAccount.issuerInfo)
      } catch (e) {
        return {}
      }
    },
    isValidAmount: function () {
      if (this.amount === '') return null
      if (!this.tokenAccount) return null
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
        bigInt(this.tokenAccount.tokenBalance).greaterOrEquals(bigInt(amountInRaw))
      )
    },
    sufficientBalance: function () {
      if (!this.tokenAccount) return null
      return bigInt(this.tokenAccount.balance).greaterOrEquals(bigInt(this.$utils.minimumFee))
    },
    sufficientTokenBalance: function () {
      if (!this.tokenAccount) return null
      return bigInt(this.tokenAccount.tokenBalance).greater(0)
    },
    availableToBurn: function () {
      if (this.tokenAccount) {
        let amount = null
        if (this.issuerInfo && typeof this.issuerInfo.decimals !== 'undefined') {
          amount = this.$Logos.convert.fromTo(this.tokenAccount.tokenBalance, 0, this.issuerInfo.decimals)
          return `${amount} ${this.tokenAccount.symbol} are available to burn`
        } else {
          amount = this.tokenAccount.tokenBalance
          return `${amount} base units of ${this.tokenAccount.symbol} are available to burn`
        }
      }
      return 'Select a token first'
    },
    burnableControllers: function () {
      let controllers = []
      for (let controller of this.tokenAccount.controllers) {
        if (this.$wallet.accounts[controller.account] && controller.privileges.burn) {
          controllers.push(this.$wallet.accounts[controller.account])
        }
      }
      return controllers
    }
  },
  methods: {
    createBurn () {
      if (this.isValidAmount && this.sufficientBalance &&
        this.sufficientTokenBalance && this.burnableControllers.length > 0) {
        let amountInBaseUnit = null
        if (this.issuerInfo && typeof this.issuerInfo.decimals !== 'undefined') {
          amountInBaseUnit = this.$Logos.convert.fromTo(this.amount, this.issuerInfo.decimals, 0)
        } else {
          amountInBaseUnit = this.amount
        }
        let data = {
          tokenAccount: this.tokenAccount.address,
          amount: amountInBaseUnit
        }
        this.burnableControllers[0].createBurnRequest(data)
      }
    },
    nameWithAddress ({ name, address }) {
      return `${name} — ${address.substring(0, 9)}...${address.substring(59, 64)}`
    }
  }
}
</script>
