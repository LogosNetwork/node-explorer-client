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
        track-by="address"
        label="name"
        :allow-empty="false"
        deselect-label="Can't remove this value"
        :custom-label="nameWithAddress"
        :options="updateableTokens"
        :disabled="updateableTokens.length <= 1"
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
        You must select a token to update its controllers
      </div>
      <div v-if="selectedToken && !sufficientBalance" style="display:block" class="invalid-feedback">
        {{selectedToken.name}} has an insufficient supply of logos to afford the fee for this transaction
      </div>
    </b-form-group>

    <b-form-group
      v-if="selectedToken"
      id="controllerDestination"
      label="Controller's Address"
      label-size="lg"
    >
      <Multiselect
        id="controllerSelector"
        v-model="controllerAccount"
        required
        tag-placeholder="Add this account as a controller"
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
      <div v-if="!controllerAccount" style="display:block" class="invalid-feedback">
        You must select an account add, remove, or modifiy
      </div>
    </b-form-group>

    <b-form-group
      v-if="controllerAccount && selectedToken"
      id="actionType"
      label="Action"
      label-size="lg"
      description=""
    >
      <multiselect
        id="actionInput"
        :allow-empty="false"
        :searchable="false"
        track-by="label"
        label="label"
        deselect-label="Can't remove this value"
        v-model="action"
        :disabled="actionOptions.length <= 1"
        :options="actionOptions"
      >
        <template slot="singleLabel" slot-scope="{ option }">
          <span>
            <strong>{{ option.label }}</strong>
          </span>
        </template>
      </multiselect>
    </b-form-group>

    <b-form-group
      v-if="action && action.action !== 'remove' && this.controllerAccount"
      id="controllerPrivileges"
      label="Privileges"
      label-size="lg"
    >
      <b-form-checkbox v-model="privileges.update_controller" name="Update Controller" switch>
        Token Admin <span v-b-tooltip.hover :title="`Token Admins can add, modify, or remove other controllers of this token`"><font-awesome-icon size="sm" :icon="faQuestionCircle" /></span>
      </b-form-checkbox>
      <b-form-checkbox v-model="privileges.update_issuer_info" name="Update Issuer Info" switch>
        Update Issuer Info <span v-b-tooltip.hover :title="`Issuer Info privilege allows the controller to modify the 512 bytes of additional data allocated for each token`"><font-awesome-icon size="sm" :icon="faQuestionCircle" /></span>
      </b-form-checkbox>
      <b-form-checkbox v-model="privileges.burn" name="Burn" switch>
        Burn <span v-b-tooltip.hover :title="`Burn allows the controller to reduce the total supply of the token by burning tokens in the token account`"><font-awesome-icon size="sm" :icon="faQuestionCircle" /></span>
      </b-form-checkbox>
      <b-form-checkbox v-model="privileges.distribute" name="Distribute" switch>
        Distribute <span v-b-tooltip.hover :title="`Distribute allows the controller to send tokens from the token accounts balance`"><font-awesome-icon size="sm" :icon="faQuestionCircle" /></span>
      </b-form-checkbox>
      <b-form-checkbox v-model="privileges.withdraw_fee" name="Withdraw Fee" switch>
        Withdraw Fee <span v-b-tooltip.hover :title="`Withdraw Fee allows the controller to withdraw any of the fee's collected by the token`"><font-awesome-icon size="sm" :icon="faQuestionCircle" /></span>
      </b-form-checkbox>
      <b-form-checkbox v-model="privileges.withdraw_logos" name="Withdraw Logos" switch>
        Withdraw Logos <span v-b-tooltip.hover :title="`Withdraw Logos allows the controller to withdraw any Logos contained in the token account`"><font-awesome-icon size="sm" :icon="faQuestionCircle" /></span>
      </b-form-checkbox>
      <b-form-checkbox v-if="selectedToken.settings.issuance || selectedToken.settings.modify_issuance" v-model="privileges.issuance" name="Issuance" switch>
        Issuance <span v-b-tooltip.hover :title="`Issuance allows the controller to mint new tokens to the token account, increasing the total supply`"><font-awesome-icon size="sm" :icon="faQuestionCircle" /></span>
      </b-form-checkbox>
      <b-form-checkbox v-if="selectedToken.settings.modify_issuance" v-model="privileges.change_issuance" name="Change Issuance" switch>
        Change Issuance <span v-b-tooltip.hover :title="`Change Issuance allows the controller to enable or disable issuance for the token`"><font-awesome-icon size="sm" :icon="faQuestionCircle" /></span>
      </b-form-checkbox>
      <b-form-checkbox v-if="selectedToken.settings.modify_issuance" v-model="privileges.change_modify_issuance" name="Change Modify Issuance" switch>
        Immute Issuance <span v-b-tooltip.hover :title="`Immute Issuance will lock the current issuance setting and make it permanent`"><font-awesome-icon size="sm" :icon="faQuestionCircle" /></span>
      </b-form-checkbox>
      <b-form-checkbox v-if="selectedToken.settings.revoke || selectedToken.settings.modify_revoke" v-model="privileges.revoke" name="Revoke" switch>
        Revoke <span v-b-tooltip.hover :title="`Revoke allows the controller to remove tokens from any users account and send them to a different destination`"><font-awesome-icon size="sm" :icon="faQuestionCircle" /></span>
      </b-form-checkbox>
      <b-form-checkbox v-if="selectedToken.settings.modify_revoke" v-model="privileges.change_revoke" name="Change Revoke" switch>
        Change Revoke <span v-b-tooltip.hover :title="`Change Revoke allows the controller to enable or disable revoke for the token`"><font-awesome-icon size="sm" :icon="faQuestionCircle" /></span>
      </b-form-checkbox>
      <b-form-checkbox v-if="selectedToken.settings.modify_revoke" v-model="privileges.change_modify_revoke" name="Modify Revoke" switch>
        Immute Revoke <span v-b-tooltip.hover :title="`Immute Revoke will lock the current revoke setting and make it permanent`"><font-awesome-icon size="sm" :icon="faQuestionCircle" /></span>
      </b-form-checkbox>
      <b-form-checkbox v-if="selectedToken.settings.freeze || selectedToken.settings.modify_freeze" v-model="privileges.freeze" name="Freeze" switch>
        Freeze <span v-b-tooltip.hover :title="`Freeze allows the controller to freeze any account which will prevent them from sending or receiving this token`"><font-awesome-icon size="sm" :icon="faQuestionCircle" /></span>
      </b-form-checkbox>
      <b-form-checkbox v-if="selectedToken.settings.modify_freeze" v-model="privileges.change_freeze" name="Change Freeze" switch>
        Change Freeze <span v-b-tooltip.hover :title="`Change Freeze allows the controller to enable or disable account freezing for the token`"><font-awesome-icon size="sm" :icon="faQuestionCircle" /></span>
      </b-form-checkbox>
      <b-form-checkbox v-if="selectedToken.settings.modify_freeze" v-model="privileges.change_modify_freeze" name="Modify Freeze" switch>
        Immute Freeze <span v-b-tooltip.hover :title="`Immute Freeze will lock the current freeze setting and make it permanent`"><font-awesome-icon size="sm" :icon="faQuestionCircle" /></span>
      </b-form-checkbox>
      <b-form-checkbox v-if="selectedToken.settings.adjust_fee || selectedToken.settings.modify_adjust_fee" v-model="privileges.adjust_fee" name="Adjust Fee" switch>
        Adjust Fee <span v-b-tooltip.hover :title="`Adjust Fee allows the controller to adjust the fee type and fee rate of the token`"><font-awesome-icon size="sm" :icon="faQuestionCircle" /></span>
      </b-form-checkbox>
      <b-form-checkbox v-if="selectedToken.settings.modify_adjust_fee" v-model="privileges.change_adjust_fee" name="Change Adjust Fee" switch>
        Change Adjust Fee <span v-b-tooltip.hover :title="`Change Adjust Fee allows the controller to enable or disable the ability to adjust fees for the token`"><font-awesome-icon size="sm" :icon="faQuestionCircle" /></span>
      </b-form-checkbox>
      <b-form-checkbox v-if="selectedToken.settings.modify_adjust_fee" v-model="privileges.change_modify_adjust_fee" name="Modify Adjust Fee" switch>
        Immute Adjust Fee <span v-b-tooltip.hover :title="`Immute Adjust Fee will lock the current adjust fee setting and make it permanent`"><font-awesome-icon size="sm" :icon="faQuestionCircle" /></span>
      </b-form-checkbox>
      <b-form-checkbox v-if="selectedToken.settings.whitelist || selectedToken.settings.modify_whitelist" v-model="privileges.whitelist" name="Whitelist" switch>
        Whitelist <span v-b-tooltip.hover :title="`Whitelist allows the controller to whitelist or un-whitelist any account for this token`"><font-awesome-icon size="sm" :icon="faQuestionCircle" /></span>
      </b-form-checkbox>
      <b-form-checkbox v-if="selectedToken.settings.modify_whitelist" v-model="privileges.change_whitelist" name="Change Whitelist" switch>
        Change Whitelist <span v-b-tooltip.hover :title="`Change Whitelist allows the controller to enable or disable the whitelist for the token`"><font-awesome-icon size="sm" :icon="faQuestionCircle" /></span>
      </b-form-checkbox>
      <b-form-checkbox v-if="selectedToken.settings.modify_whitelist" v-model="privileges.change_modify_whitelist" name="Modify Whitelist" switch>
        Immute Whitelist <span v-b-tooltip.hover :title="`Immute Whitelist will lock the current whitelist setting and make it permanent`"><font-awesome-icon size="sm" :icon="faQuestionCircle" /></span>
      </b-form-checkbox>
    </b-form-group>
    <div class="text-right">
      <b-button
        v-on:click="createUpdateController()"
        type="submit"
        :disabled="!selectedToken || !controllerAccount || !action || !privileges"
        variant="primary"
      >
          <span v-if="action && action.label">{{action.label}}</span>
          <span v-else>Update Controller</span>
      </b-button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import cloneDeep from 'lodash.clonedeep'
import bigInt from 'big-integer'
import { faQuestionCircle } from '@fortawesome/pro-light-svg-icons'
import vBTooltip from 'bootstrap-vue/es/directives/tooltip/tooltip'
Vue.directive('b-tooltip', vBTooltip)
export default {
  name: 'updateControllerForm',
  data () {
    return {
      faQuestionCircle,
      accounts: [],
      selectedToken: null,
      controllerAccount: null,
      action: null,
      defaultPrivileges: {
        change_issuance: false,
        change_modify_issuance: false,
        change_revoke: false,
        change_modify_revoke: false,
        change_freeze: false,
        change_modify_freeze: false,
        change_adjust_fee: false,
        change_modify_adjust_fee: false,
        change_whitelist: false,
        change_modify_whitelist: false,
        issuance: false,
        revoke: false,
        freeze: false,
        adjust_fee: false,
        whitelist: false,
        update_issuer_info: false,
        update_controller: false,
        burn: false,
        distribute: false,
        withdraw_fee: false,
        withdraw_logos: false
      },
      privileges: null
    }
  },
  components: {
    'b-form-group': () => import(/* webpackChunkName: "b-form-group" */'bootstrap-vue/es/components/form-group/form-group'),
    'b-form-input': () => import(/* webpackChunkName: "b-form-input" */'bootstrap-vue/es/components/form-input/form-input'),
    'LogosAddress': () => import(/* webpackChunkName: "LogosAddress" */'@/components/LogosAddress.vue'),
    'Multiselect': () => import(/* webpackChunkName: "Multiselect" */'vue-multiselect'),
    'b-form-checkbox-group': () => import(/* webpackChunkName: "b-form-checkbox-group" */'bootstrap-vue/es/components/form-checkbox/form-checkbox-group'),
    'b-form-checkbox': () => import(/* webpackChunkName: "b-form-checkbox" */'bootstrap-vue/es/components/form-checkbox/form-checkbox')
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
    actionOptions: function () {
      if (this.controllerAccount && this.controllerAccount.privileges) {
        return [
          {
            label: 'Modify Controller',
            action: 'modify'
          },
          {
            label: 'Remove Controller',
            action: 'remove'
          }
        ]
      } else {
        return [
          {
            label: 'Add Controller',
            action: 'add'
          }
        ]
      }
    },
    combinedAccounts: function () {
      let forgeAccounts = cloneDeep(this.forgeAccounts)
      let tokenControllers = []
      if (this.selectedToken && this.selectedToken.controllers) {
        this.selectedToken.controllers.forEach((value, i) => {
          tokenControllers.push({
            label: `Controller ${i}`,
            address: value.account,
            privileges: value.privileges
          })
          if (forgeAccounts[value.account]) delete forgeAccounts[value.account]
        })
      }
      forgeAccounts = Array.from(Object.values(forgeAccounts))
      return tokenControllers.concat(forgeAccounts).concat(this.accounts)
    },
    updateableTokens: function () {
      let tokens = []
      for (let tokenAddress in this.forgeTokens) {
        let token = this.forgeTokens[tokenAddress]
        for (let controllerAddress in token.controllers) {
          let controller = token.controllers[controllerAddress]
          if (controller.account === this.currentAccount.address &&
            controller.privileges.update_controller) {
            tokens.push(token)
          }
        }
      }
      return tokens
    }
  },
  methods: {
    addAccount (newAddress) {
      if (newAddress.match(/^lgs_[13456789abcdefghijkmnopqrstuwxyz]{60}$/) !== null) {
        for (let value of this.combinedAccounts) {
          if (newAddress === value.address) {
            this.controllerAccount = value
            return false
          }
        }
        let newAccount = { label: newAddress, address: newAddress }
        this.accounts.push(newAccount)
        this.controllerAccount = newAccount
        return true
      }
      return false
    },
    createUpdateController () {
      let data = {
        tokenAccount: this.selectedToken.address,
        action: this.action.action,
        controller: {
          account: this.controllerAccount.address,
          privileges: this.privileges
        }
      }
      if (this.action.action === 'add') {
        this.$wallet.account.createUpdateControllerRequest(data)
        this.controllerAccount = null
      } else if (this.action.action === 'remove') {
        delete data.controller.privileges
        this.$wallet.account.createUpdateControllerRequest(data)
        this.controllerAccount = null
      } else if (this.action.action === 'modify') {
        let modifiedPrivileges = this.$utils.convertObjectToArray(this.privileges)
        let existingPrivileges = []
        let removedPrivileges = []
        let addedPrivileges = []
        for (let controllerAddress in this.selectedToken.controllers) {
          let controller = this.selectedToken.controllers[controllerAddress]
          if (controller.account === this.controllerAccount.address) {
            existingPrivileges = this.$utils.convertObjectToArray(controller.privileges)
          }
        }
        addedPrivileges = modifiedPrivileges.filter((i) => { return existingPrivileges.indexOf(i) < 0 })
        removedPrivileges = existingPrivileges.filter((i) => { return modifiedPrivileges.indexOf(i) < 0 })
        if (addedPrivileges.length > 0) {
          let addForm = {
            tokenAccount: this.selectedToken.address,
            action: 'add',
            controller: {
              account: this.controllerAccount.address,
              privileges: addedPrivileges
            }
          }
          this.$wallet.account.createUpdateControllerRequest(addForm)
        }
        if (removedPrivileges.length > 0) {
          let removeForm = {
            tokenAccount: this.selectedToken.address,
            action: 'remove',
            controller: {
              account: this.controllerAccount.address,
              privileges: removedPrivileges
            }
          }
          this.$wallet.account.createUpdateControllerRequest(removeForm)
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
    if (this.updateableTokens.length > 0) {
      this.selectedToken = this.updateableTokens[0]
      if (this.combinedAccounts.length > 0) {
        this.controllerAccount = this.combinedAccounts[0]
      }
    }
  },
  watch: {
    controllerAccount: {
      handler: function (newAccount, oldAccount) {
        if (newAccount !== null) {
          if (!newAccount.privileges) {
            this.privileges = this.defaultPrivileges
          } else {
            this.privileges = cloneDeep(newAccount.privileges)
          }
          this.action = this.actionOptions[0]
        }
      }
    },
    updateableTokens: {
      handler: function (newTks, oldTks) {
        if (newTks.length > 0) {
          let valid = false
          for (let token of newTks) {
            if (this.selectedToken && token.address === this.selectedToken.address) {
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
      },
      deep: true
    }
  }
}
</script>
