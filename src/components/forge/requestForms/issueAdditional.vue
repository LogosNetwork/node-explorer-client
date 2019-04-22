<template>
  <div>
    <b-form-group
      id="issueAdditionalToken"
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
        :options="issuableTokens"
        :disabled="issuableTokens.length <= 1"
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
        You must select a token to issue additional tokens
      </div>
      <div v-if="selectedToken && !sufficientBalance" style="display:block" class="invalid-feedback">
        {{selectedToken.name}} has an insufficient supply of logos to afford the fee for this transaction
      </div>
    </b-form-group>

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
        :disabled="!sufficientBalance || !selectedToken || !amount || !isValidAmount"
        variant="primary"
      >
          Issue Additional Tokens
      </b-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import bigInt from 'big-integer'
import cloneDeep from 'lodash.clonedeep'
export default {
  name: 'issueAdditionalForm',
  data () {
    return {
      selectedToken: null,
      amount: null
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
      forgeTokens: state => state.tokens,
      currentAccount: state => state.currentAccount
    }),
    isValidAmount: function () {
      if (this.amount === '') return null
      let token = this.selectedToken
      if (!token) return null
      let amountInRaw = cloneDeep(this.amount)
      if (amountInRaw && token && token.issuerInfo &&
        typeof token.issuerInfo.decimals !== 'undefined' &&
        token.issuerInfo.decimals > 0) {
        if (!/^([0-9]+(?:[.][0-9]*)?|\.[0-9]+)$/.test(amountInRaw)) return false
        amountInRaw = this.$Logos.convert.fromTo(amountInRaw, token.issuerInfo.decimals, 0)
      } else {
        if (!/^([0-9]+)$/.test(amountInRaw)) return false
      }
      return (
        bigInt(amountInRaw).greater(0) &&
        bigInt(this.$utils.MAXUINT128).minus(bigInt(token.total_supply)).greaterOrEquals(bigInt(amountInRaw))
      )
    },
    sufficientBalance: function () {
      if (!this.selectedToken) return null
      return bigInt(this.selectedToken.balance).greaterOrEquals(bigInt(this.$utils.minimumFee))
    },
    availableToIssue: function () {
      let token = this.selectedToken
      if (!token) return null
      let amountInRaw = bigInt(this.$utils.MAXUINT128).minus(bigInt(token.total_supply))
      if (amountInRaw && token && token.issuerInfo &&
        typeof token.issuerInfo.decimals !== 'undefined' &&
        token.issuerInfo.decimals > 0) {
        amountInRaw = this.$Logos.convert.fromTo(amountInRaw, 0, token.issuerInfo.decimals)
        return `You can issue an additional ${amountInRaw} ${token.symbol}`
      } else {
        return `You can issue an additional ${amountInRaw} base units of ${token.symbol}`
      }
    },
    issuableTokens: function () {
      let tokens = []
      for (let tokenAddress in this.forgeTokens) {
        if (this.forgeTokens[tokenAddress].controllers instanceof Array) {
          for (let controller of this.forgeTokens[tokenAddress].controllers) {
            if (controller.account === this.currentAccount.address) {
              if (this.forgeTokens[tokenAddress].settings.includes('issuance') &&
              controller.privileges instanceof Array &&
              controller.privileges.includes('issuance')) {
                tokens.push(this.forgeTokens[tokenAddress])
              }
            }
          }
        }
      }
      return tokens
    }
  },
  methods: {
    createIssueAdditional () {
      if (this.sufficientBalance && this.selectedToken && this.amount && this.isValidAmount) {
        let token = this.selectedToken
        let amountInRaw = cloneDeep(this.amount)
        if (amountInRaw && token && token.issuerInfo &&
          typeof token.issuerInfo.decimals !== 'undefined' &&
          token.issuerInfo.decimals > 0) {
          amountInRaw = this.$Logos.convert.fromTo(amountInRaw, token.issuerInfo.decimals, 0)
        }
        let data = {
          tokenAccount: this.selectedToken.tokenAccount,
          amount: amountInRaw
        }
        this.$wallet.account.createIssueAdditionalRequest(data)
      }
    },
    nameWithAddress ({ name, tokenAccount }) {
      return `${name} — ${tokenAccount.substring(0, 9)}...${tokenAccount.substring(59, 64)}`
    }
  },
  created: function () {
    if (this.issuableTokens.length > 0) {
      this.selectedToken = this.issuableTokens[0]
    }
  },
  watch: {
    issuableTokens: function (newTks, oldTks) {
      if (newTks.length > 0) {
        let valid = false
        for (let token of newTks) {
          if (this.selectedToken && token.tokenAccount === this.selectedToken.tokenAccount) {
            this.selectedToken = token
            valid = true
          }
        }
        if (valid === false) {
          this.selectedToken = newTks[0]
        }
      } else {
        this.selectedToken = null
      }
    }
  }
}
</script>
