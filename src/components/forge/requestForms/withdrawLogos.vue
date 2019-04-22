<template>
  <div>
    <b-form-group
      id="withdrawFeeToken"
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
        :options="withdrawableTokens"
        :disabled="withdrawableTokens.length <= 1"
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
        You must select a token to withdraw from
      </div>
      <div v-if="selectedToken && !sufficientBalance" style="display:block" class="invalid-feedback">
        {{selectedToken.name}} has an insufficient supply of logos to afford the fee for this transaction
      </div>
    </b-form-group>

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
        @tag="addAccount"
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
import { mapState } from 'vuex'
import cloneDeep from 'lodash.clonedeep'
import bigInt from 'big-integer'
export default {
  name: 'withdrawFeeForm',
  data () {
    return {
      accounts: [],
      selectedToken: null,
      transaction: {
        destination: null,
        amount: ''
      }
    }
  },
  components: {
    'b-form-group': () => import(/* webpackChunkName: "b-form-group" */'bootstrap-vue/es/components/form-group/form-group'),
    'b-form-input': () => import(/* webpackChunkName: "b-form-input" */'bootstrap-vue/es/components/form-input/form-input'),
    'LogosAddress': () => import(/* webpackChunkName: "LogosAddress" */'@/components/LogosAddress.vue'),
    'Multiselect': () => import(/* webpackChunkName: "Multiselect" */'vue-multiselect')
  },
  computed: {
    ...mapState('forge', {
      forgeAccounts: state => state.accounts,
      forgeTokens: state => state.tokens,
      currentAccount: state => state.currentAccount
    }),
    isValidAmount: function () {
      if (this.transaction.amount === '') return null
      if (!this.selectedToken) return null
      if (!/^([0-9]+(?:[.][0-9]*)?|\.[0-9]+)$/.test(this.transaction.amount)) return false
      let requestedAmount = this.$Logos.convert.toReason(this.transaction.amount, 'LOGOS')
      let availableAmount = bigInt(this.selectedToken.balance).minus(this.$utils.minimumFee)
      return (
        bigInt(requestedAmount).greater(0) &&
        availableAmount.greaterOrEquals(bigInt(requestedAmount))
      )
    },
    sufficientBalance: function () {
      if (!this.selectedToken) return null
      return bigInt(this.selectedToken.balance).greaterOrEquals(bigInt(this.$utils.minimumFee))
    },
    combinedAccounts: function () {
      let forgeAccounts = cloneDeep(this.forgeAccounts)
      return Array.from(Object.values(forgeAccounts)).concat(this.accounts)
    },
    withdrawableTokens: function () {
      let tokens = []
      for (let tokenAddress in this.forgeTokens) {
        if (this.forgeTokens[tokenAddress].controllers instanceof Array) {
          for (let controller of this.forgeTokens[tokenAddress].controllers) {
            if (controller.account === this.currentAccount.address &&
              controller.privileges instanceof Array &&
              controller.privileges.indexOf('withdraw_logos') > -1) {
              tokens.push(this.forgeTokens[tokenAddress])
            }
          }
        }
      }
      return tokens
    },
    availableToWithdraw: function () {
      if (this.selectedToken) {
        let amount = bigInt(this.selectedToken.balance).minus(this.$utils.minimumFee).toString()
        amount = this.$Logos.convert.fromReason(amount, 'LOGOS')
        return `${amount} Logos is available to withdraw`
      }
      return 'Select a token first'
    }
  },
  methods: {
    addAccount (newAddress) {
      if (newAddress.match(/^lgs_[13456789abcdefghijkmnopqrstuwxyz]{60}$/) !== null) {
        let newAccount = { label: newAddress, address: newAddress }
        this.accounts.push(newAccount)
        this.transaction.destination = newAccount
      }
    },
    createWithdrawLogos () {
      if (this.isValidAmount &&
        this.sufficientBalance &&
        this.transaction.destination) {
        let amountInRaw = cloneDeep(this.transaction.amount)
        amountInRaw = this.$Logos.convert.toReason(amountInRaw, 'LOGOS')
        let data = {
          tokenAccount: this.selectedToken.tokenAccount,
          transaction: {
            destination: this.transaction.destination.address,
            amount: amountInRaw
          }
        }
        this.$wallet.account.createWithdrawLogosRequest(data)
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
    if (this.withdrawableTokens.length > 0) {
      this.selectedToken = this.withdrawableTokens[0]
    }
    this.transaction.destination = this.currentAccount
  },
  watch: {
    withdrawableTokens: function (newDistTks, oldDistTks) {
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
