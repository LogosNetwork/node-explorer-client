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
        track-by="tokenAccount"
        label="name"
        :custom-label="nameWithAddress"
        :options="adjustableTokens"
        :disabled="adjustableTokens.length <= 1"
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
import { mapState } from 'vuex'
import bFormGroup from 'bootstrap-vue/es/components/form-group/form-group'
import bFormInput from 'bootstrap-vue/es/components/form-input/form-input'
import LogosAddress from '@/components/LogosAddress.vue'
import Multiselect from 'vue-multiselect'
import cloneDeep from 'lodash/cloneDeep'
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
    combinedAccounts: function () {
      let forgeAccounts = cloneDeep(this.forgeAccounts)
      return Array.from(Object.values(forgeAccounts)).concat(this.accounts)
    },
    adjustableTokens: function () {
      let tokens = []
      for (let tokenAddress in this.forgeTokens) {
        if (this.forgeTokens[tokenAddress].controllers instanceof Array) {
          for (let controller of this.forgeTokens[tokenAddress].controllers) {
            if (controller.account === this.currentAccount.address) {
              if (this.forgeTokens[tokenAddress].settings.includes('whitelist') &&
              controller.privileges instanceof Array &&
              controller.privileges.includes('whitelist')) {
                tokens.push(this.forgeTokens[tokenAddress])
              } else if (this.forgeTokens[tokenAddress].settings.includes('freeze') &&
              controller.privileges instanceof Array &&
              controller.privileges.includes('freeze')) {
                tokens.push(this.forgeTokens[tokenAddress])
              }
            }
          }
        }
      }
      return tokens
    },
    adjustableStatuses: function () {
      let statuses = []
      if (this.selectedToken) {
        for (let controller of this.selectedToken.controllers) {
          if (controller.account === this.currentAccount.address) {
            if (this.selectedToken.settings.includes('whitelist') &&
              controller.privileges instanceof Array &&
              controller.privileges.includes('whitelist')) {
              statuses.push({
                label: 'Whitelist',
                action: 'whitelisted'
              })
              statuses.push({
                label: 'Remove from Whitelist',
                action: 'not_whitelisted'
              })
            }
            if (this.selectedToken.settings.includes('freeze') &&
              controller.privileges instanceof Array &&
              controller.privileges.includes('freeze')) {
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
          tokenAccount: this.selectedToken.tokenAccount,
          account: this.account.address,
          status: this.status.action
        })
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
    if (this.adjustableTokens.length > 0) {
      this.selectedToken = this.adjustableTokens[0]
    }
    this.account = this.currentAccount
  },
  watch: {
    adjustableTokens: function (newTks, oldTks) {
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
