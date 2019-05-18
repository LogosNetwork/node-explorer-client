<template>
  <div>
    <b-form-group
      id="withdrawLogosDestination"
      label="Send the logos to"
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
        @tag="addWithdrawAccount"
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
        You must select an account to withdraw the logos to
      </div>
    </b-form-group>

    <b-form-group
      id="withdrawAmount"
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
        This is a required field and must be a positive decimal or integer value that is less than the token's logos balance
      </b-form-invalid-feedback>
    </b-form-group>
    <div class="text-right">
      <b-button
        v-on:click="createWithdrawLogos()"
        type="submit"
        :disabled="!isValidAmount || !sufficientBalance || !transaction.destination"
        variant="primary"
      >
          Withdraw Logos
      </b-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import cloneDeep from 'lodash.clonedeep'
import bigInt from 'big-integer'
export default {
  name: 'withdrawFeeForm',
  props: {
    tokenAccount: Object
  },
  data () {
    return {
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
    ...mapState('forge', {
      accounts: state => state.accounts
    }),
    isValidAmount: function () {
      if (this.transaction.amount === '') return null
      if (!this.tokenAccount) return null
      if (!/^([0-9]+(?:[.][0-9]*)?|\.[0-9]+)$/.test(this.transaction.amount)) return false
      let requestedAmount = this.$Logos.convert.toReason(this.transaction.amount, 'LOGOS')
      let availableAmount = bigInt(this.tokenAccount.balance).minus(this.$utils.minimumFee)
      return (
        bigInt(requestedAmount).greater(0) &&
        availableAmount.greaterOrEquals(bigInt(requestedAmount))
      )
    },
    sufficientBalance: function () {
      if (!this.tokenAccount) return null
      return bigInt(this.tokenAccount.balance).greaterOrEquals(bigInt(this.$utils.minimumFee))
    },
    combinedAccounts: function () {
      return Array.from(Object.values(this.$wallet.accountsObject)).concat(this.accounts)
    },
    availableToWithdraw: function () {
      if (this.tokenAccount) {
        let amount = bigInt(this.tokenAccount.balance).minus(this.$utils.minimumFee).toString()
        amount = this.$Logos.convert.fromReason(amount, 'LOGOS')
        return `${amount} Logos is available to withdraw`
      }
      return 'Select a token first'
    },
    withdrawLogosControllers: function () {
      let controllers = []
      for (let controller of this.tokenAccount.controllers) {
        if (this.$wallet.accountsObject[controller.account] && controller.privileges.withdraw_logos) {
          controllers.push(this.$wallet.accountsObject[controller.account])
        }
      }
      return controllers
    }
  },
  methods: {
    ...mapActions('forge',
      [
        'addAccount'
      ]
    ),
    accountExists (newAddress) {
      let fullAccountList = this.combinedAccounts.concat(Array.from(Object.values(this.$wallet.tokenAccounts)))
      for (let account of fullAccountList) {
        if (account.address === newAddress) return true
      }
      return false
    },
    addWithdrawAccount (newAddress) {
      if (newAddress.match(/^lgs_[13456789abcdefghijkmnopqrstuwxyz]{60}$/) !== null) {
        let newAccount = { label: newAddress, address: newAddress }
        if (!this.accountExists(newAddress)) {
          this.addAccount(newAccount)
          this.transaction.destination = newAccount
        }
      }
    },
    createWithdrawLogos () {
      if (this.isValidAmount &&
        this.sufficientBalance &&
        this.transaction.destination &&
        this.withdrawLogosControllers.length > 0) {
        let amountInRaw = cloneDeep(this.transaction.amount)
        amountInRaw = this.$Logos.convert.toReason(amountInRaw, 'LOGOS')
        let data = {
          tokenAccount: this.tokenAccount.address,
          transaction: {
            destination: this.transaction.destination.address,
            amount: amountInRaw
          }
        }
        this.withdrawLogosControllers[0].createWithdrawLogosRequest(data)
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
    if (this.combinedAccounts.length > 0) {
      this.transaction.destination = this.combinedAccounts[0]
    }
  }
}
</script>
