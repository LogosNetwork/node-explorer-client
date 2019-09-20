<template>
  <div>
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
        :disabled="!sufficientBalance || !tokenAccount || !amount || !isValidAmount"
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
import { BFormGroup, BFormInput, BFormInvalidFeedback } from 'bootstrap-vue'

export default {
  name: 'issueAdditionalForm',
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
        bigInt(this.$utils.MAXUINT128).minus(bigInt(this.tokenAccount.totalSupply)).greaterOrEquals(bigInt(amountInRaw))
      )
    },
    sufficientBalance: function () {
      if (!this.tokenAccount) return null
      return bigInt(this.tokenAccount.balance).greaterOrEquals(bigInt(this.$utils.minimumFee))
    },
    availableToIssue: function () {
      if (this.tokenAccount) {
        let amountInRaw = bigInt(this.$utils.MAXUINT128).minus(bigInt(this.tokenAccount.totalSupply))
        if (this.issuerInfo && typeof this.issuerInfo.decimals !== 'undefined') {
          amountInRaw = this.$Logos.convert.fromTo(amountInRaw, 0, this.issuerInfo.decimals)
          return `You can mint ${amountInRaw} ${this.tokenAccount.symbol}`
        } else {
          return `You can mint ${amountInRaw} base units of ${this.tokenAccount.symbol}`
        }
      }
      return 'Select a token first'
    },
    mintableControllers: function () {
      let controllers = []
      for (let controller of this.tokenAccount.controllers) {
        if (this.$wallet.accounts[controller.account] && controller.privileges.issuance) {
          controllers.push(this.$wallet.accounts[controller.account])
        }
      }
      return controllers
    }
  },
  methods: {
    createIssueAdditional () {
      if (this.sufficientBalance && this.tokenAccount && this.amount && this.isValidAmount) {
        let amountInRaw = cloneDeep(this.amount)
        if (amountInRaw && this.issuerInfo &&
          typeof this.issuerInfo.decimals !== 'undefined' &&
          this.issuerInfo.decimals > 0) {
          amountInRaw = this.$Logos.convert.fromTo(amountInRaw, this.issuerInfo.decimals, 0)
        }
        let data = {
          tokenAccount: this.tokenAccount.address,
          amount: amountInRaw
        }
        this.mintableControllers[0].createIssueAdditionalRequest(data)
      }
    },
    nameWithAddress ({ name, address }) {
      return `${name} — ${address.substring(0, 9)}...${address.substring(59, 64)}`
    }
  }
}
</script>
