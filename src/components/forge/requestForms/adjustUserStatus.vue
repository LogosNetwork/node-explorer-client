<template>
  <div>
    <b-form-group
      id="adjustUserStatusOfToken"
      label="Select Token"
      label-size="lg"
    >
      <Multiselect
        id="destinationSelector"
        v-model="selectedToken"
        required
        track-by="address"
        label="name"
        :custom-label="nameWithAddress"
        :options="adjustableTokens"
        :disabled="adjustableTokens.length <= 1"
        :multiple="false"
        placeholder="Search for a token"
      >
        <template slot="singleLabel" slot-scope="{ option }">
          <span v-if="option.name !== option.address">
            <strong>{{ option.name }}</strong>  -
          </span>
          <LogosAddress :inactive="true" :force="true" :address="option.address" />
        </template>
      </Multiselect>
      <div v-if="!selectedToken" style="display:block" class="invalid-feedback">
        You must select a token to adjust user's statuses
      </div>
      <div v-if="selectedToken && !sufficientBalance" style="display:block" class="invalid-feedback">
        {{selectedToken.name}} has an insufficient supply of logos to afford the fee for this transaction
      </div>
    </b-form-group>

    <b-form-group
      id="adjustedDestination"
      label="Adjustable Account"
      label-size="lg"
    >
      <Multiselect
        id="destinationSelector"
        v-model="account"
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
      <div v-if="!account" style="display:block" class="invalid-feedback">
        You must select an account to adjust the status of
      </div>
    </b-form-group>

    <b-form-group
      id="adjustableStatus"
      label="Action"
      label-size="lg"
    >
      <Multiselect
        id="statusSelector"
        v-model="status"
        required
        track-by="label"
        label="label"
        :options="adjustableStatuses"
        :multiple="false"
        placeholder="Search for a status"
      >
        <template slot="singleLabel" slot-scope="{ option }">
          <span>
            <strong>{{ option.label }}</strong>
          </span>
        </template>
      </Multiselect>
      <div v-if="!status" style="display:block" class="invalid-feedback">
        You must select an action to adjust a user's status
      </div>
    </b-form-group>

    <div class="text-right">
      <b-button
        v-on:click="createAdjustUserStatus()"
        type="submit"
        :disabled="!sufficientBalance || !selectedToken || !status || !account"
        variant="primary"
      >
          Adjust User's Status
      </b-button>
    </div>
  </div>
</template>

<script>
import bigInt from 'big-integer'
export default {
  name: 'adjustUserStatusForm',
  data () {
    return {
      accounts: [],
      selectedToken: null,
      account: null,
      status: null
    }
  },
  components: {
    'b-form-group': () => import(/* webpackChunkName: "b-form-group" */'bootstrap-vue/es/components/form-group/form-group'),
    'b-form-input': () => import(/* webpackChunkName: "b-form-input" */'bootstrap-vue/es/components/form-input/form-input'),
    'LogosAddress': () => import(/* webpackChunkName: "LogosAddress" */'@/components/LogosAddress.vue'),
    'Multiselect': () => import(/* webpackChunkName: "Multiselect" */'vue-multiselect')
  },
  computed: {
    forgeAccounts: function () {
      return this.$wallet.accountsObject
    },
    forgeTokens: function () {
      return this.$wallet.tokenAccounts
    },
    currentAccount: function () {
      return this.$wallet.account
    },
    sufficientBalance: function () {
      if (!this.selectedToken) return null
      return bigInt(this.selectedToken.balance).greaterOrEquals(bigInt(this.$utils.minimumFee))
    },
    combinedAccounts: function () {
      let forgeTokens = []
      for (let token in this.forgeTokens) {
        if (this.selectedToken && this.selectedToken.address !== token) {
          forgeTokens.push({ label: `${this.forgeTokens[token].name} (${this.forgeTokens[token].symbol})`, address: token })
        }
      }
      return Array.from(Object.values(this.forgeAccounts)).concat(this.accounts).concat(forgeTokens)
    },
    adjustableTokens: function () {
      let tokens = []
      for (let tokenAddress in this.forgeTokens) {
        for (let controller in this.forgeTokens[tokenAddress].controllers) {
          if (this.forgeTokens[tokenAddress].controllers[controller].account === this.currentAccount.address) {
            if (this.forgeTokens[tokenAddress].settings.whitelist &&
              this.forgeTokens[tokenAddress].controllers[controller].privileges.whitelist) {
              tokens.push(this.forgeTokens[tokenAddress])
            } else if (this.forgeTokens[tokenAddress].settings.freeze &&
              this.forgeTokens[tokenAddress].controllers[controller].privileges.freeze) {
              tokens.push(this.forgeTokens[tokenAddress])
            }
          }
        }
      }
      return tokens
    },
    adjustableStatuses: function () {
      let statuses = []
      if (this.selectedToken) {
        for (let controller in this.selectedToken.controllers) {
          if (this.selectedToken.controllers[controller].account === this.currentAccount.address) {
            if (this.selectedToken.settings.whitelist &&
              this.selectedToken.controllers[controller].privileges.whitelist) {
              statuses.push({
                label: 'Whitelist',
                action: 'whitelisted'
              })
              statuses.push({
                label: 'Remove from Whitelist',
                action: 'not_whitelisted'
              })
            }
            if (this.selectedToken.settings.freeze &&
              this.selectedToken.controllers[controller].privileges.freeze) {
              statuses.push({
                label: 'Freeze',
                action: 'frozen'
              })
              statuses.push({
                label: 'Un-freeze',
                action: 'unfrozen'
              })
            }
          }
        }
      }
      return statuses
    }
  },
  methods: {
    addDestiantionAccount (newAddress) {
      if (newAddress.match(/^lgs_[13456789abcdefghijkmnopqrstuwxyz]{60}$/) !== null) {
        let newAccount = { label: newAddress, address: newAddress }
        this.accounts.push(newAccount)
        this.account = newAccount
      }
    },
    createAdjustUserStatus () {
      if (this.sufficientBalance && this.selectedToken && this.status && this.account) {
        this.$wallet.account.createAdjustUserStatusRequest({
          tokenAccount: this.selectedToken.address,
          account: this.account.address,
          status: this.status.action
        })
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
    if (this.adjustableTokens.length > 0) {
      this.selectedToken = this.adjustableTokens[0]
    }
    if (this.adjustableStatuses.length > 0) {
      this.status = this.adjustableStatuses[0]
    }
    this.account = this.currentAccount
  },
  watch: {
    adjustableTokens: {
      handler: function (newTks, oldTks) {
        if (newTks.length > 0) {
          let valid = false
          for (let token of newTks) {
            if (this.selectedToken && token.address === this.selectedToken.address) {
              this.selectedToken = token
              valid = true
            }
          }
          if (!valid) this.selectedToken = newTks[0]
        } else {
          this.selectedToken = null
        }
      },
      deep: true
    }
  }
}
</script>
