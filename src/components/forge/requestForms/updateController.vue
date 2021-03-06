<template>
  <div>
    <b-form-group
      v-if="tokenAccount"
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
        @tag="addControllerAccount"
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
      <div v-if="validDestination === false" style="display:block" class="invalid-feedback">
        {{invalidDestinationError}}
      </div>
    </b-form-group>

    <b-form-group
      v-if="controllerAccount && tokenAccount"
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
      <b-form-checkbox v-if="tokenAccount.settings.issuance || tokenAccount.settings.modify_issuance" v-model="privileges.issuance" name="Issuance" switch>
        Issuance <span v-b-tooltip.hover :title="`Issuance allows the controller to mint new tokens to the token account, increasing the total supply`"><font-awesome-icon size="sm" :icon="faQuestionCircle" /></span>
      </b-form-checkbox>
      <b-form-checkbox v-if="tokenAccount.settings.modify_issuance" v-model="privileges.change_issuance" name="Change Issuance" switch>
        Change Issuance <span v-b-tooltip.hover :title="`Change Issuance allows the controller to enable or disable issuance for the token`"><font-awesome-icon size="sm" :icon="faQuestionCircle" /></span>
      </b-form-checkbox>
      <b-form-checkbox v-if="tokenAccount.settings.modify_issuance" v-model="privileges.change_modify_issuance" name="Change Modify Issuance" switch>
        Immute Issuance <span v-b-tooltip.hover :title="`Immute Issuance will lock the current issuance setting and make it permanent`"><font-awesome-icon size="sm" :icon="faQuestionCircle" /></span>
      </b-form-checkbox>
      <b-form-checkbox v-if="tokenAccount.settings.revoke || tokenAccount.settings.modify_revoke" v-model="privileges.revoke" name="Revoke" switch>
        Revoke <span v-b-tooltip.hover :title="`Revoke allows the controller to remove tokens from any users account and send them to a different destination`"><font-awesome-icon size="sm" :icon="faQuestionCircle" /></span>
      </b-form-checkbox>
      <b-form-checkbox v-if="tokenAccount.settings.modify_revoke" v-model="privileges.change_revoke" name="Change Revoke" switch>
        Change Revoke <span v-b-tooltip.hover :title="`Change Revoke allows the controller to enable or disable revoke for the token`"><font-awesome-icon size="sm" :icon="faQuestionCircle" /></span>
      </b-form-checkbox>
      <b-form-checkbox v-if="tokenAccount.settings.modify_revoke" v-model="privileges.change_modify_revoke" name="Modify Revoke" switch>
        Immute Revoke <span v-b-tooltip.hover :title="`Immute Revoke will lock the current revoke setting and make it permanent`"><font-awesome-icon size="sm" :icon="faQuestionCircle" /></span>
      </b-form-checkbox>
      <b-form-checkbox v-if="tokenAccount.settings.freeze || tokenAccount.settings.modify_freeze" v-model="privileges.freeze" name="Freeze" switch>
        Freeze <span v-b-tooltip.hover :title="`Freeze allows the controller to freeze any account which will prevent them from sending or receiving this token`"><font-awesome-icon size="sm" :icon="faQuestionCircle" /></span>
      </b-form-checkbox>
      <b-form-checkbox v-if="tokenAccount.settings.modify_freeze" v-model="privileges.change_freeze" name="Change Freeze" switch>
        Change Freeze <span v-b-tooltip.hover :title="`Change Freeze allows the controller to enable or disable account freezing for the token`"><font-awesome-icon size="sm" :icon="faQuestionCircle" /></span>
      </b-form-checkbox>
      <b-form-checkbox v-if="tokenAccount.settings.modify_freeze" v-model="privileges.change_modify_freeze" name="Modify Freeze" switch>
        Immute Freeze <span v-b-tooltip.hover :title="`Immute Freeze will lock the current freeze setting and make it permanent`"><font-awesome-icon size="sm" :icon="faQuestionCircle" /></span>
      </b-form-checkbox>
      <b-form-checkbox v-if="tokenAccount.settings.adjust_fee || tokenAccount.settings.modify_adjust_fee" v-model="privileges.adjust_fee" name="Adjust Fee" switch>
        Adjust Fee <span v-b-tooltip.hover :title="`Adjust Fee allows the controller to adjust the fee type and fee rate of the token`"><font-awesome-icon size="sm" :icon="faQuestionCircle" /></span>
      </b-form-checkbox>
      <b-form-checkbox v-if="tokenAccount.settings.modify_adjust_fee" v-model="privileges.change_adjust_fee" name="Change Adjust Fee" switch>
        Change Adjust Fee <span v-b-tooltip.hover :title="`Change Adjust Fee allows the controller to enable or disable the ability to adjust fees for the token`"><font-awesome-icon size="sm" :icon="faQuestionCircle" /></span>
      </b-form-checkbox>
      <b-form-checkbox v-if="tokenAccount.settings.modify_adjust_fee" v-model="privileges.change_modify_adjust_fee" name="Modify Adjust Fee" switch>
        Immute Adjust Fee <span v-b-tooltip.hover :title="`Immute Adjust Fee will lock the current adjust fee setting and make it permanent`"><font-awesome-icon size="sm" :icon="faQuestionCircle" /></span>
      </b-form-checkbox>
      <b-form-checkbox v-if="tokenAccount.settings.whitelist || tokenAccount.settings.modify_whitelist" v-model="privileges.whitelist" name="Whitelist" switch>
        Whitelist <span v-b-tooltip.hover :title="`Whitelist allows the controller to whitelist or un-whitelist any account for this token`"><font-awesome-icon size="sm" :icon="faQuestionCircle" /></span>
      </b-form-checkbox>
      <b-form-checkbox v-if="tokenAccount.settings.modify_whitelist" v-model="privileges.change_whitelist" name="Change Whitelist" switch>
        Change Whitelist <span v-b-tooltip.hover :title="`Change Whitelist allows the controller to enable or disable the whitelist for the token`"><font-awesome-icon size="sm" :icon="faQuestionCircle" /></span>
      </b-form-checkbox>
      <b-form-checkbox v-if="tokenAccount.settings.modify_whitelist" v-model="privileges.change_modify_whitelist" name="Modify Whitelist" switch>
        Immute Whitelist <span v-b-tooltip.hover :title="`Immute Whitelist will lock the current whitelist setting and make it permanent`"><font-awesome-icon size="sm" :icon="faQuestionCircle" /></span>
      </b-form-checkbox>
    </b-form-group>
    <div class="text-right">
      <b-button
        v-on:click="createUpdateController()"
        type="submit"
        :disabled="!tokenAccount || !controllerAccount || !action || !privileges || !validDestination"
        variant="primary"
      >
          <span v-if="action && action.label">{{action.label}}</span>
          <span v-else>Update Controller</span>
      </b-button>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash.clonedeep'
import bigInt from 'big-integer'
import { faQuestionCircle } from '@fortawesome/pro-light-svg-icons'
import { mapActions, mapState } from 'vuex'
import { BFormGroup, BFormInput, BFormInvalidFeedback, BFormCheckbox, BFormCheckboxGroup } from 'bootstrap-vue'

export default {
  name: 'updateControllerForm',
  props: {
    tokenAccount: Object
  },
  data () {
    return {
      validDestination: null,
      invalidDestinationError: '',
      faQuestionCircle,
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
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback,
    BFormCheckboxGroup,
    BFormCheckbox,
    'LogosAddress': () => import(/* webpackChunkName: "LogosAddress" */'@/components/LogosAddress.vue'),
    'Multiselect': () => import(/* webpackChunkName: "Multiselect" */'vue-multiselect')
  },
  computed: {
    ...mapState('forge', {
      accounts: state => state.accounts
    }),
    sufficientBalance: function () {
      if (!this.tokenAccount) return null
      return bigInt(this.tokenAccount.balance).greaterOrEquals(bigInt(this.$utils.minimumFee))
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
      let forgeAccounts = cloneDeep(this.$wallet.accounts)
      let tokenControllers = []
      if (this.tokenAccount && this.tokenAccount.controllers) {
        this.tokenAccount.controllers.forEach((value, i) => {
          tokenControllers.push({
            label: `Controller ${i}`,
            address: value.account,
            privileges: value.privileges
          })
          if (forgeAccounts[value.account]) delete forgeAccounts[value.account]
        })
      }
      // TODO Remove duplicate Controllers from local account edge case?
      forgeAccounts = Object.values(forgeAccounts)
      return tokenControllers.concat(forgeAccounts).concat(this.accounts)
    },
    updateControllerControllers: function () {
      let controllers = []
      for (let controller of this.tokenAccount.controllers) {
        if (this.$wallet.accounts[controller.account] && controller.privileges.update_controller) {
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
    addControllerAccount (newAddress) {
      if (newAddress.match(/^lgs_[13456789abcdefghijkmnopqrstuwxyz]{60}$/) !== null) {
        let newAccount = { label: newAddress, address: newAddress }
        if (!this.accountExists(newAddress)) {
          this.addAccount(newAccount)
          this.controllerAccount = newAccount
        }
        return true
      }
      return false
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
          this.invalidDestinationError = 'TokenAccounts cannot be a token controller.'
          return
        }
        this.validDestination = true
      }
    },
    createUpdateController () {
      if (this.updateControllerControllers.length > 0) {
        let data = {
          tokenAccount: this.tokenAccount.address,
          action: this.action.action,
          controller: {
            account: this.controllerAccount.address,
            privileges: this.privileges
          }
        }
        if (this.action.action === 'add') {
          this.updateControllerControllers[0].createUpdateControllerRequest(data)
          this.controllerAccount = null
        } else if (this.action.action === 'remove') {
          delete data.controller.privileges
          this.updateControllerControllers[0].createUpdateControllerRequest(data)
          this.controllerAccount = null
        } else if (this.action.action === 'modify') {
          let modifiedPrivileges = this.$utils.convertObjectToArray(this.privileges)
          let existingPrivileges = []
          let removedPrivileges = []
          let addedPrivileges = []
          for (let controllerAddress in this.tokenAccount.controllers) {
            let controller = this.tokenAccount.controllers[controllerAddress]
            if (controller.account === this.controllerAccount.address) {
              existingPrivileges = this.$utils.convertObjectToArray(controller.privileges)
            }
          }
          addedPrivileges = modifiedPrivileges.filter((i) => { return existingPrivileges.indexOf(i) < 0 })
          removedPrivileges = existingPrivileges.filter((i) => { return modifiedPrivileges.indexOf(i) < 0 })
          if (addedPrivileges.length > 0) {
            let addForm = {
              tokenAccount: this.tokenAccount.address,
              action: 'add',
              controller: {
                account: this.controllerAccount.address,
                privileges: addedPrivileges
              }
            }
            this.updateControllerControllers[0].createUpdateControllerRequest(addForm)
          }
          if (removedPrivileges.length > 0) {
            let removeForm = {
              tokenAccount: this.tokenAccount.address,
              action: 'remove',
              controller: {
                account: this.controllerAccount.address,
                privileges: removedPrivileges
              }
            }
            this.updateControllerControllers[0].createUpdateControllerRequest(removeForm)
          }
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
  watch: {
    controllerAccount: function (newAccount, oldAccount) {
      if (newAccount !== null) {
        this.isValidDestination(newAccount)
        if (!newAccount.privileges) {
          this.privileges = this.defaultPrivileges
        } else {
          this.privileges = cloneDeep(newAccount.privileges)
        }
        this.action = this.actionOptions[0]
      }
    }
  }
}
</script>
