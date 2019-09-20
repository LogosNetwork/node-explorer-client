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
      <div v-if="validDestination === false" style="display:block" class="invalid-feedback">
        {{invalidDestinationError}}
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
        :disabled="!sufficientBalance || !tokenAccount || !status || !account || !validDestination"
        variant="primary"
      >
          <span v-if="status && status.label">{{status.label}} Account</span>
          <span v-else>Adjust User's Status</span>
      </b-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import bigInt from 'big-integer'
import { BFormGroup, BFormInput } from 'bootstrap-vue'

export default {
  name: 'adjustUserStatusForm',
  props: {
    tokenAccount: Object
  },
  data () {
    return {
      validDestination: null,
      invalidDestinationError: '',
      account: null,
      status: null
    }
  },
  components: {
    BFormGroup,
    BFormInput,
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
      return Object.values(this.$wallet.accounts).concat(this.accounts)
    },
    adjustableStatuses: function () {
      let statuses = []
      if (this.tokenAccount) {
        for (let controller of this.tokenAccount.controllers) {
          if (this.$wallet.accounts[controller.account]) {
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
          if (this.$wallet.accounts[controller.account] && controller.privileges[this.status.privilege]) {
            controllers.push(this.$wallet.accounts[controller.account])
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
      let fullAccountList = this.combinedAccounts.concat(Object.values(this.$wallet.tokenAccounts))
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
    isValidDestination: async function (account) {
      this.validDestination = null
      this.invalidDestinationError = ''
      if (account && account.address) {
        let address = account.address
        let accountInfo = await this.$Logos.accounts.info(address)
        if (!accountInfo) {
          this.validDestination = false
          this.invalidDestinationError = 'Unable to validate this account.'
          return
        }
        if (accountInfo.error && accountInfo.error === 'Bad account number') {
          this.validDestination = false
          this.invalidDestinationError = 'This is not a valid address.'
          return
        }
        if (accountInfo.type !== 'LogosAccount') {
          this.validDestination = false
          this.invalidDestinationError = 'TokenAccounts cannot have their status set.'
          return
        }
        this.validDestination = true
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
    },
    account: function (newAccount, oldAccount) {
      if (this.account !== null) {
        this.isValidDestination(this.account)
      }
    }
  }
}
</script>
