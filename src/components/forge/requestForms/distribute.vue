<template>
  <div>
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
      <div v-if="validDestination === false" style="display:block" class="invalid-feedback">
        {{invalidDestinationError}}
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
        :disabled="!isValidAmount || !sufficientBalance || !sufficientTokenBalance || !transaction.destination || !validDestination"
        variant="primary"
      >
          Distribute Tokens
      </b-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import bigInt from 'big-integer'
export default {
  name: 'distributeForm',
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
    combinedAccounts: function () {
      return Array.from(Object.values(this.$wallet.accountsObject)).concat(this.accounts)
    },
    availableToSend: function () {
      if (this.tokenAccount) {
        let amount = null
        if (this.issuerInfo && typeof this.issuerInfo.decimals !== 'undefined') {
          amount = this.$Logos.convert.fromTo(this.tokenAccount.tokenBalance, 0, this.issuerInfo.decimals)
          return `${amount} ${this.tokenAccount.symbol} are available to distribute`
        } else {
          amount = this.tokenAccount.tokenBalance
          return `${amount} base units of ${this.tokenAccount.symbol} are available to distribute`
        }
      }
      return 'Select a token first'
    },
    distributeControllers: function () {
      let controllers = []
      for (let controller of this.tokenAccount.controllers) {
        if (this.$wallet.accountsObject[controller.account] && controller.privileges.distribute) {
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
    addDestiantionAccount (newAddress) {
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
      if (this.tokenAccount) {
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
        let tokenInfo = null
        if (accountInfo.tokens && accountInfo.tokens.hasOwnProperty(this.tokenAccount.tokenID)) {
          tokenInfo = accountInfo.tokens[this.tokenAccount.tokenID]
        }
        if (this.tokenAccount.settings.whitelist && (!tokenInfo || tokenInfo.whitelisted !== 'true')) {
          this.validDestination = false
          this.invalidDestinationError = 'This account has not been whitelisted.'
        } else if (tokenInfo && tokenInfo.frozen === 'true') {
          this.validDestination = false
          this.invalidDestinationError = 'This account is frozen and cannot receive or send tokens.'
        } else {
          this.validDestination = true
        }
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
        if (bigInt(this.tokenAccount.tokenBalance)
          .greaterOrEquals(bigInt(amountInBaseUnit))) {
          let data = {
            tokenAccount: this.tokenAccount.address,
            transaction: {
              destination: this.transaction.destination.address,
              amount: amountInBaseUnit
            }
          }
          this.distributeControllers[0].createDistributeRequest(data)
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
    if (this.combinedAccounts.length > 0) {
      this.transaction.destination = this.combinedAccounts[0]
    }
  },
  watch: {
    'transaction.destination': function (newDest, oldDest) {
      this.isValidDestination(this.transaction.destination)
    }
  }
}
</script>
