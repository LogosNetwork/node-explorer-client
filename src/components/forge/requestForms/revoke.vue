<template>
  <div>
    <b-form-group
      id="revokeToken"
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
        :options="revokableTokens"
        :disabled="revokableTokens.length <= 1"
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
        You must select a token to issue a revoke from
      </div>
      <div v-if="selectedToken && !sufficientBalance" style="display:block" class="invalid-feedback">
        {{selectedToken.name}} has an insufficient supply of logos to afford the fee for this transaction
      </div>
    </b-form-group>

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
        :options="combinedAccounts"
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
      <div v-if="validSource === false" style="display:block" class="invalid-feedback">
        You must select an account that has a balance with the selected token
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
        :disabled="!isValidAmount || !sufficientBalance || !transaction.destination || !validSource"
        variant="primary"
      >
          Revoke Tokens
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
import cloneDeep from 'lodash/cloneDeep'
import bigInt from 'big-integer'
export default {
  name: 'revokeForm',
  data () {
    return {
      accounts: [],
      selectedToken: null,
      source: null,
      transaction: {
        destination: null,
        amount: ''
      }
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
      forgeAccounts: state => state.accounts,
      forgeTokens: state => state.tokens,
      currentAccount: state => state.currentAccount
    }),
    sufficientBalance: function () {
      if (!this.selectedToken) return null
      return bigInt(this.selectedToken.balance).greaterOrEquals(bigInt(this.$utils.minimumFee))
    },
    validSource: function () {
      if (!this.source) return false
      if (!this.source.tokenBalances) return false
      if (!this.selectedToken) return null
      return (this.source.tokenBalances[this.$utils.keyFromAccount(this.selectedToken.tokenAccount)])
    },
    isValidAmount: function () {
      if (!this.source) return null
      if (!this.selectedToken) return null
      if (this.transaction.amount === '') return null
      let tokenBalance = this.source.tokenBalances[this.$utils.keyFromAccount(this.selectedToken.tokenAccount)]
      let amountInRaw = cloneDeep(this.transaction.amount)
      if (amountInRaw && this.selectedToken && this.selectedToken.issuerInfo &&
        typeof this.selectedToken.issuerInfo.decimals !== 'undefined' &&
        this.selectedToken.issuerInfo.decimals > 0) {
        if (!/^([0-9]+(?:[.][0-9]*)?|\.[0-9]+)$/.test(amountInRaw)) return false
        amountInRaw = this.$Logos.convert.fromTo(this.transaction.amount, this.selectedToken.issuerInfo.decimals, 0)
      } else {
        if (!/^([0-9]+)$/.test(amountInRaw)) return false
      }
      return (
        bigInt(amountInRaw).greater(0) &&
        bigInt(amountInRaw).lesserOrEquals(bigInt(tokenBalance))
      )
    },
    combinedAccounts: function () {
      let forgeAccounts = cloneDeep(this.forgeAccounts)
      return Array.from(Object.values(forgeAccounts)).concat(this.accounts)
    },
    revokableTokens: function () {
      let tokens = []
      for (let tokenAddress in this.forgeTokens) {
        if (this.forgeTokens[tokenAddress].settings.includes('revoke') &&
          this.forgeTokens[tokenAddress].controllers instanceof Array) {
          for (let controller of this.forgeTokens[tokenAddress].controllers) {
            if (controller.account === this.currentAccount.address &&
              controller.privileges instanceof Array &&
              controller.privileges.indexOf('revoke') > -1) {
              tokens.push(this.forgeTokens[tokenAddress])
            }
          }
        }
      }
      return tokens
    },
    availableToRevoke: function () {
      if (this.selectedToken && this.validSource) {
        let amount = null
        if (this.selectedToken.issuerInfo && typeof this.selectedToken.issuerInfo.decimals !== 'undefined') {
          amount = this.$Logos.convert.fromTo(this.source.tokenBalances[this.$utils.keyFromAccount(this.selectedToken.tokenAccount)], 0, this.selectedToken.issuerInfo.decimals)
          return `${amount} ${this.selectedToken.symbol} are available to revoke`
        } else {
          amount = this.source.tokenBalances[this.$utils.keyFromAccount(this.selectedToken.tokenAccount)]
          return `${amount} base units of ${this.selectedToken.name} are available to revoke`
        }
      }
      return 'Select a token and source first'
    }
  },
  methods: {
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
          this.accounts.push(data)
          this.transaction.destination = data
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
          this.accounts.push(data)
          this.source = data
        })
      }
    },
    createRevoke () {
      // TODO check if destination account is open & whitelisted & not frozen
      let amountInRaw = cloneDeep(this.transaction.amount)
      if (amountInRaw && this.selectedToken && this.selectedToken.issuerInfo &&
        typeof this.selectedToken.issuerInfo.decimals !== 'undefined' &&
        this.selectedToken.issuerInfo.decimals > 0) {
        amountInRaw = this.$Logos.convert.fromTo(this.transaction.amount, this.selectedToken.issuerInfo.decimals, 0)
      }
      let data = {
        tokenAccount: this.selectedToken.tokenAccount,
        source: this.source.address,
        transaction: {
          destination: this.transaction.destination.address,
          amount: amountInRaw
        }
      }
      this.$wallet.account.createRevokeRequest(data)
      let kfa = this.$utils.keyFromAccount(this.selectedToken.tokenAccount)
      for (let account of this.accounts) {
        if (account.label === account.address) {
          if (account.address === data.source) {
            account.tokenBalances[kfa] = bigInt(account.tokenBalances[kfa]).minus(bigInt(data.transaction.amount))
            this.source = account
          } else if (account.address === data.transaction.destination) {
            account.tokenBalances[kfa] = bigInt(account.tokenBalances[kfa]).plus(bigInt(data.transaction.amount))
            this.transaction.destination = account
          }
        }
      }
    },
    nameWithAddress ({ name, tokenAccount }) {
      return `${name} — ${tokenAccount.substring(0, 9)}...${tokenAccount.substring(59, 64)}`
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
    if (this.revokableTokens.length > 0) {
      this.selectedToken = this.revokableTokens[0]
    }
    this.transaction.destination = this.currentAccount
  },
  watch: {
    revokableTokens: function (newDistTks, oldDistTks) {
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
