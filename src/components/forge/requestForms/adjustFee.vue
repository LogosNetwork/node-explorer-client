<template>
  <div>
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
        This is a required field and must be an integer value that is <span v-if='feeType === "flat"'>less than the total supply of {{tokenAccount.totalSupply}}</span><span v-if='feeType === "percentage"'>between 0 - 100</span>
      </b-form-invalid-feedback>
    </b-form-group>

    <div class="text-right">
      <b-button
        v-on:click="createAdjustFee()"
        type="submit"
        :disabled="!sufficientBalance || !tokenAccount || !validFeeRate"
        variant="primary"
      >
          Adjust Fee
      </b-button>
    </div>
  </div>
</template>

<script>
import bigInt from 'big-integer'
import { BFormGroup, BFormInput, BFormInvalidFeedback } from 'bootstrap-vue'

export default {
  name: 'adjustFeeForm',
  props: {
    tokenAccount: Object
  },
  data () {
    return {
      feeRate: null,
      feeType: null,
      feeOptions: ['flat', 'percentage']
    }
  },
  components: {
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback,
    'LogosAddress': () => import(/* webpackChunkName: "LogosAddress" */'@/components/LogosAddress.vue'),
    'Multiselect': () => import(/* webpackChunkName: "Multiselect" */'vue-multiselect')
  },
  computed: {
    sufficientBalance: function () {
      if (!this.tokenAccount) return null
      return bigInt(this.tokenAccount.balance).greaterOrEquals(bigInt(this.$utils.minimumFee))
    },
    validFeeRate: function () {
      if (!this.tokenAccount) return false
      if (!/^([0-9]+)$/.test(this.feeRate)) return false
      if (this.feeType === 'percentage' && bigInt(this.feeRate).lesserOrEquals(bigInt('100'))) {
        return true
      } else if (this.feeType === 'flat' && bigInt(this.feeRate).lesserOrEquals(bigInt(this.tokenAccount.totalSupply))) {
        return true
      }
      return false
    },
    adjustableControllers: function () {
      let controllers = []
      for (let controller of this.tokenAccount.controllers) {
        if (this.$wallet.accounts[controller.account] && controller.privileges.adjust_fee) {
          controllers.push(this.$wallet.accounts[controller.account])
        }
      }
      return controllers
    }
  },
  methods: {
    createAdjustFee () {
      if (this.sufficientBalance && this.tokenAccount &&
        this.validFeeRate && this.adjustableControllers.length > 0) {
        let data = {
          tokenAccount: this.tokenAccount.address,
          feeRate: this.feeRate,
          feeType: this.feeType
        }
        this.adjustableControllers[0].createAdjustFeeRequest(data)
      }
    },
    nameWithAddress ({ name, address }) {
      return `${name} — ${address.substring(0, 9)}...${address.substring(59, 64)}`
    }
  },
  created: function () {
    this.feeRate = this.tokenAccount.feeRate
    this.feeType = this.tokenAccount.feeType
  },
  watch: {
    tokenAccount: {
      handler: function (newTk, oldTk) {
        if (this.tokenAccount && newTk.address === this.tokenAccount.address) {
          this.feeRate = newTk.feeRate
          this.feeType = newTk.feeType
        }
      },
      deep: true
    }
  }
}
</script>
