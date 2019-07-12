<template>
  <div>
    <b-form-group
      id="revokeSource"
      label="Revoke tokens from"
      label-size="lg"
    >
      <Multiselect
        id="sourceSelector"
        v-model="source"
        required
        tag-placeholder="Add this account"
        track-by="label"
        label="label"
        :custom-label="labelWithAddress"
        :options="sourceAccounts"
        :multiple="false"
        :taggable="true"
        @tag="addSourceAccount"
        placeholder="Search or add an account"
      >
        <template slot="singleLabel" slot-scope="{ option }">
          <span v-if="option.label !== option.address">
            <strong>{{ option.label }}</strong>  -
          </span>
          <LogosAddress :inactive="true" :force="true" :address="option.address" />
        </template>
      </Multiselect>
      <div v-if="!validSource" style="display:block" class="invalid-feedback">
        You must select an account that has a {{this.tokenAccount.symbol}} balance
      </div>
    </b-form-group>

    <b-form-group
      id="revokeDestination"
      label="Revoke tokens to"
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
        @tag="addDestinationAccount"
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
        You must select an account to revoke to
      </div>
      <div v-if="validDestination === false" style="display:block" class="invalid-feedback">
        {{invalidDestinationError}}
      </div>
    </b-form-group>

    <b-form-group
      id="revokeAmount"
      label="Amount"
      label-size="lg"
      :description="availableToRevoke"
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
        This is a required field and must be a positive decimal or integer value that is less than the token balance of the source account
      </b-form-invalid-feedback>
    </b-form-group>
    <div class="text-right">
      <b-button
        v-on:click="createRevoke()"
        type="submit"
        :disabled="!isValidAmount || !sufficientBalance || !transaction.destination || !validSource || !validDestination"
        variant="primary"
      >
          Revoke Tokens
      </b-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import bigInt from 'big-integer'
export default {
  name: 'revokeForm',
  props: {
    tokenAccount: Object
  },
  data () {
    return {
      validDestination: null,
      invalidDestinationError: '',
      source: null,
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
    sufficientBalance: function () {
      if (!this.tokenAccount) return null
      return bigInt(this.tokenAccount.balance).greaterOrEquals(bigInt(this.$utils.minimumFee))
    },
    validSource: function () {
      if (!this.source) return false
      if (!this.source.tokenBalances) return false
      if (!this.tokenAccount) return null
      return (this.source.tokenBalances[this.$utils.keyFromAccount(this.tokenAccount.address)])
    },
    isValidAmount: function () {
      if (!this.source) return null
      if (!this.tokenAccount) return null
      if (this.transaction.amount === '') return null
      let tokenBalance = this.source.tokenBalances[this.$utils.keyFromAccount(this.tokenAccount.address)]
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
        bigInt(amountInRaw).lesserOrEquals(bigInt(tokenBalance))
      )
    },
    combinedAccounts: function () {
      return Object.values(this.$wallet.accounts).concat(this.accounts)
    },
    sourceAccounts: function () {
      let accounts = []
      for (let account of this.combinedAccounts) {
        if (account.tokenBalances && account.tokenBalances[this.$utils.keyFromAccount(this.tokenAccount.address)]) {
          accounts.push(account)
        }
      }
      return accounts
    },
    availableToRevoke: function () {
      if (this.tokenAccount && this.validSource) {
        let amount = null
        if (this.issuerInfo && typeof this.issuerInfo.decimals !== 'undefined') {
          amount = this.$Logos.convert.fromTo(this.source.tokenBalances[this.$utils.keyFromAccount(this.tokenAccount.address)], 0, this.issuerInfo.decimals)
          return `${amount} ${this.tokenAccount.symbol} are available to revoke`
        } else {
          amount = this.source.tokenBalances[this.$utils.keyFromAccount(this.tokenAccount.address)]
          return `${amount} base units of ${this.tokenAccount.name} are available to revoke`
        }
      }
      return 'Select a source first'
    },
    revokeableControllers: function () {
      let controllers = []
      for (let controller of this.tokenAccount.controllers) {
        if (this.$wallet.accounts[controller.account] && controller.privileges.revoke) {
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
    addDestinationAccount (newAddress) {
      if (newAddress.match(/^lgs_[13456789abcdefghijkmnopqrstuwxyz]{60}$/) !== null) {
        this.$Logos.accounts.info(newAddress).then(val => {
          let data = { label: newAddress, address: newAddress }
          if (!val.error) {
            data.address = newAddress
            data.balance = val.balance
            data.label = newAddress
            data.logosBalance = this.$Logos.convert.fromReason(val.balance, 'LOGOS')
            data.tokenBalances = {}
            for (let token in val.tokens) {
              data.tokenBalances[token] = val.tokens[token].balance
            }
          }
          if (!this.accountExists(newAddress)) {
            this.addAccount(data)
            this.transaction.destination = data
          }
        })
      }
    },
    addSourceAccount (newAddress) {
      if (newAddress.match(/^lgs_[13456789abcdefghijkmnopqrstuwxyz]{60}$/) !== null) {
        this.$Logos.accounts.info(newAddress).then(val => {
          let data = { label: newAddress, address: newAddress }
          if (!val.error) {
            data.address = newAddress
            data.balance = val.balance
            data.label = newAddress
            data.logosBalance = this.$Logos.convert.fromReason(val.balance, 'LOGOS')
            data.tokenBalances = {}
            for (let token in val.tokens) {
              data.tokenBalances[token] = val.tokens[token].balance
            }
          }
          if (!this.accountExists(newAddress)) {
            this.addAccount(data)
            this.source = data
          }
        })
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
    createRevoke () {
      let data = {
        tokenAccount: this.tokenAccount.address,
        source: this.source.address,
        transaction: {
          destination: this.transaction.destination.address
        }
      }
      if (this.issuerInfo && typeof this.issuerInfo.decimals !== 'undefined' && this.issuerInfo.decimals > 0) {
        data.transaction.amount = this.$Logos.convert.fromTo(this.transaction.amount, this.issuerInfo.decimals, 0)
      } else {
        data.transaction.amount = this.transaction.amount
      }
      this.revokeableControllers[0].createRevokeRequest(data)
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
    if (this.sourceAccounts.length > 0) {
      this.source = this.sourceAccounts[0]
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
