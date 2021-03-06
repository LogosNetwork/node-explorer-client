<template>
  <div>
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
        You must select an account to withdraw the fees to
      </div>
      <div v-if="validDestination === false" style="display:block" class="invalid-feedback">
        {{invalidDestinationError}}
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
        :disabled="!isValidAmount || !sufficientBalance || !sufficientTokenFeeBalance || !transaction.destination || !validDestination"
        variant="primary"
      >
          Withdraw Fees
      </b-button>
    </div>
  </div>
</template>

<script>
import bigInt from 'big-integer'
import { mapActions, mapState } from 'vuex'
import { BFormGroup, BFormInput, BFormInvalidFeedback } from 'bootstrap-vue'

export default {
  name: 'withdrawFeeForm',
  props: {
    tokenAccount: Object
  },
  data () {
    return {
      validDestination: null,
      invalidDestinationError: '',
      transaction: {
        destination: null,
        amount: ''
      }
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
    ...mapState('forge', {
      accounts: state => state.accounts
    }),
    issuerInfo: function () {
      if (!this.tokenAccount) return null
      try {
        return JSON.parse(this.tokenAccount.issuerInfo)
      } catch (e) {
        return {}
      }
    },
    isValidAmount: function () {
      if (this.transaction.amount === '') return null
      if (!this.tokenAccount) return null
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
        bigInt(this.tokenAccount.tokenFeeBalance).greaterOrEquals(bigInt(amountInRaw))
      )
    },
    sufficientBalance: function () {
      if (!this.tokenAccount) return null
      return bigInt(this.tokenAccount.balance).greaterOrEquals(bigInt(this.$utils.minimumFee))
    },
    sufficientTokenFeeBalance: function () {
      if (!this.tokenAccount) return null
      return bigInt(this.tokenAccount.tokenFeeBalance).greater(0)
    },
    combinedAccounts: function () {
      return Object.values(this.$wallet.accounts).concat(this.accounts)
    },
    availableToWithdraw: function () {
      if (this.tokenAccount) {
        let amount = null
        if (this.issuerInfo && typeof this.issuerInfo.decimals !== 'undefined') {
          amount = this.$Logos.convert.fromTo(this.tokenAccount.tokenFeeBalance, 0, this.issuerInfo.decimals)
          return `${amount} ${this.tokenAccount.symbol} in fees is available to withdraw`
        } else {
          amount = this.tokenAccount.tokenFeeBalance
          return `${amount} base units of ${this.tokenAccount.symbol} in fees is available to withdraw`
        }
      }
      return 'Select a token first'
    },
    withdrawFeeControllers: function () {
      let controllers = []
      for (let controller of this.tokenAccount.controllers) {
        if (this.$wallet.accounts[controller.account] && controller.privileges.withdraw_fee) {
          controllers.push(this.$wallet.accounts[controller.account])
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
      let fullAccountList = this.combinedAccounts.concat(Object.values(this.$wallet.tokenAccounts))
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
    isValidDestination: async function (account) {
      this.validDestination = null
      this.invalidDestinationError = ''
      if (this.tokenAccount && account && account.address) {
        let address = account.address
        let accountInfo = await this.$Logos.accounts.info(address)
        if (!accountInfo) {
          this.validDestination = false
          this.invalidDestinationError = 'Unable to validate this account.'
          return
        }
        if (accountInfo.error && accountInfo.error === 'failed to get account') {
          this.validDestination = false
          this.invalidDestinationError = 'This account must be opened first before sending tokens to it.'
          return
        }
        if (accountInfo.error && accountInfo.error === 'Bad account number') {
          this.validDestination = false
          this.invalidDestinationError = 'This is not a valid address.'
          return
        }
        if (accountInfo.type !== 'LogosAccount') {
          this.validDestination = false
          this.invalidDestinationError = 'You cannot send tokens to TokenAccounts.'
          return
        }
        let tokenInfo = this.tokenAccount.getAccountStatus(account.address)
        if (this.tokenAccount.settings.whitelist && tokenInfo.whitelisted === false) {
          this.validDestination = false
          this.invalidDestinationError = 'This account has not been whitelisted.'
        } else if (tokenInfo.frozen === true) {
          this.validDestination = false
          this.invalidDestinationError = `This account is frozen and cannot receive or send ${this.tokenAccount.symbol}.`
        } else {
          this.validDestination = true
        }
      }
    },
    createWithdrawFee () {
      if (this.isValidAmount &&
        this.sufficientBalance &&
        this.sufficientTokenFeeBalance &&
        this.transaction.destination &&
        this.withdrawFeeControllers.length > 0) {
        let amountInRaw = null
        if (this.issuerInfo && typeof this.issuerInfo.decimals !== 'undefined') {
          amountInRaw = this.$Logos.convert.fromTo(this.transaction.amount, this.issuerInfo.decimals, 0)
        } else {
          amountInRaw = this.amount
        }
        let data = {
          tokenAccount: this.tokenAccount.address,
          transaction: {
            destination: this.transaction.destination.address,
            amount: amountInRaw
          }
        }
        this.withdrawFeeControllers[0].createWithdrawFeeRequest(data)
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
  },
  watch: {
    'transaction.destination': function (newDest, oldDest) {
      if (this.transaction.destination !== null) {
        this.isValidDestination(this.transaction.destination)
      }
    }
  }
}
</script>
