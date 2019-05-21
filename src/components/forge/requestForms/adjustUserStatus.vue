<template>
  <div>
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
        :disabled="!sufficientBalance || !tokenAccount || !status || !account"
        variant="primary"
      >
          Adjust User's Status
      </b-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import bigInt from 'big-integer'
export default {
  name: 'adjustUserStatusForm',
  props: {
    tokenAccount: Object
  },
  data () {
    return {
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
    ...mapState('forge', {
      accounts: state => state.accounts
    }),
    currentAccountStatus: function () {
      if (!this.account) return null
      return this.tokenAccount.getAccountStatus(this.account.address)
    },
    sufficientBalance: function () {
      if (!this.tokenAccount) return null
      return bigInt(this.tokenAccount.balance).greaterOrEquals(bigInt(this.$utils.minimumFee))
    },
    combinedAccounts: function () {
      return Array.from(Object.values(this.$wallet.accountsObject)).concat(this.accounts)
    },
    adjustableStatuses: function () {
      let statuses = []
      if (this.tokenAccount) {
        for (let controller of this.tokenAccount.controllers) {
          if (this.$wallet.accountsObject[controller.account]) {
            if (this.tokenAccount.settings.whitelist &&
              controller.privileges.whitelist) {
              if (!this.currentAccountStatus || this.currentAccountStatus.whitelisted === false) {
                statuses.push({
                  label: 'Whitelist',
                  action: 'whitelisted',
                  privilege: 'whitelist'
                })
              }
              if (this.currentAccountStatus && this.currentAccountStatus.whitelisted === true) {
                statuses.push({
                  label: 'Remove from Whitelist',
                  action: 'not_whitelisted',
                  privilege: 'whitelist'
                })
              }
            }
            if (this.tokenAccount.settings.freeze &&
              controller.privileges.freeze) {
              if (!this.currentAccountStatus || this.currentAccountStatus.frozen === false) {
                statuses.push({
                  label: 'Freeze',
                  action: 'frozen',
                  privilege: 'freeze'
                })
              }
              if (this.currentAccountStatus && this.currentAccountStatus.frozen === true) {
                statuses.push({
                  label: 'Un-freeze',
                  action: 'unfrozen',
                  privilege: 'freeze'
                })
              }
            }
          }
        }
      }
      return statuses
    },
    adjustUserStatusControllers: function () {
      let controllers = []
      if (this.status) {
        for (let controller of this.tokenAccount.controllers) {
          if (this.$wallet.accountsObject[controller.account] && controller.privileges[this.status.privilege]) {
            controllers.push(this.$wallet.accountsObject[controller.account])
          }
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
          this.account = newAccount
        }
      }
    },
    createAdjustUserStatus () {
      if (this.sufficientBalance && this.tokenAccount &&
        this.status && this.account && this.adjustUserStatusControllers.length > 0) {
        this.adjustUserStatusControllers[0].createAdjustUserStatusRequest({
          tokenAccount: this.tokenAccount.address,
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
    if (this.adjustableStatuses.length > 0) {
      this.status = this.adjustableStatuses[0]
    }
    if (this.combinedAccounts.length > 0) {
      this.account = this.combinedAccounts[0]
    }
  },
  watch: {
    adjustableStatuses: function (newStatus, oldStatus) {
      if (this.adjustableStatuses.length > 0) this.status = this.adjustableStatuses[0]
    }
  }
}
</script>
