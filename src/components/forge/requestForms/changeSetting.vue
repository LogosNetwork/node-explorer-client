<template>
  <div>
    <b-form-group
      id="changeableSettings"
      label="Action"
      label-size="lg"
    >
      <Multiselect
        id="settingSelector"
        v-model="setting"
        required
        track-by="label"
        label="label"
        :options="changeableSettings"
        :multiple="false"
        placeholder="Search for a setting"
      >
        <template slot="singleLabel" slot-scope="{ option }">
          <span>
            <strong>{{ option.label }}</strong>
          </span>
        </template>
      </Multiselect>
      <div v-if="!setting" style="display:block" class="invalid-feedback">
        You must select a setting to change
      </div>
    </b-form-group>

    <div class="text-right">
      <b-button
        v-on:click="createChangeSetting()"
        type="submit"
        :disabled="!sufficientBalance || !tokenAccount || !setting || settingsChangeControllers.length === 0"
        variant="primary"
      >
          <span v-if="setting && setting.label">{{setting.label}}</span>
          <span v-else>Change Setting</span>
      </b-button>
    </div>
  </div>
</template>

<script>
import bigInt from 'big-integer'
import { BFormGroup, BFormInput } from 'bootstrap-vue'

export default {
  name: 'changeSettingForm',
  props: {
    tokenAccount: Object
  },
  data () {
    return {
      setting: null
    }
  },
  components: {
    BFormGroup,
    BFormInput,
    'LogosAddress': () => import(/* webpackChunkName: "LogosAddress" */'@/components/LogosAddress.vue'),
    'Multiselect': () => import(/* webpackChunkName: "Multiselect" */'vue-multiselect')
  },
  computed: {
    sufficientBalance: function () {
      if (!this.tokenAccount) return null
      return bigInt(this.tokenAccount.balance).greaterOrEquals(bigInt(this.$utils.minimumFee))
    },
    settingsChangeControllers: function () {
      let controllers = []
      if (this.setting) {
        for (let controller of this.tokenAccount.controllers) {
          if (this.$wallet.accounts[controller.account] && controller.privileges[`change_${this.setting.action}`]) {
            controllers.push(this.$wallet.accounts[controller.account])
          }
        }
      }
      return controllers
    },
    changeableSettings: function () {
      let statuses = []
      if (this.tokenAccount) {
        for (let controller of this.tokenAccount.controllers) {
          if (this.$wallet.accounts[controller.account]) {
            if (this.tokenAccount.settings.modify_issuance &&
              controller.privileges.change_issuance) {
              if (this.tokenAccount.settings.issuance) {
                statuses.push({
                  label: 'Disable Issuance',
                  action: 'issuance',
                  value: false
                })
              } else {
                statuses.push({
                  label: 'Enable Issuance',
                  action: 'issuance',
                  value: true
                })
              }
            }
            if (this.tokenAccount.settings.modify_revoke &&
              controller.privileges.change_revoke) {
              if (this.tokenAccount.settings.revoke) {
                statuses.push({
                  label: 'Disable Revoke',
                  action: 'revoke',
                  value: false
                })
              } else {
                statuses.push({
                  label: 'Enable Revoke',
                  action: 'revoke',
                  value: true
                })
              }
            }
            if (this.tokenAccount.settings.modify_freeze &&
              controller.privileges.change_freeze) {
              if (this.tokenAccount.settings.freeze) {
                statuses.push({
                  label: 'Disable Freeze',
                  action: 'freeze',
                  value: false
                })
              } else {
                statuses.push({
                  label: 'Enable Freeze',
                  action: 'freeze',
                  value: true
                })
              }
            }
            if (this.tokenAccount.settings.modify_adjust_fee &&
              controller.privileges.change_adjust_fee) {
              if (this.tokenAccount.settings.adjust_fee) {
                statuses.push({
                  label: 'Disable Fee Adjustments',
                  action: 'adjust_fee',
                  value: false
                })
              } else {
                statuses.push({
                  label: 'Enable Fee Adjustments',
                  action: 'adjust_fee',
                  value: true
                })
              }
            }
            if (this.tokenAccount.settings.modify_whitelist &&
              controller.privileges.change_whitelist) {
              if (this.tokenAccount.settings.whitelist) {
                statuses.push({
                  label: 'Disable Whitelist',
                  action: 'whitelist',
                  value: false
                })
              } else {
                statuses.push({
                  label: 'Enable Whitelist',
                  action: 'whitelist',
                  value: true
                })
              }
            }
          }
        }
      }
      return statuses
    }
  },
  methods: {
    createChangeSetting () {
      if (this.sufficientBalance && this.tokenAccount &&
        this.setting && this.settingsChangeControllers.length > 0) {
        this.settingsChangeControllers[0].createChangeSettingRequest({
          tokenAccount: this.tokenAccount.address,
          setting: this.setting.action,
          value: this.setting.value
        })
      }
    },
    nameWithAddress ({ name, address }) {
      return `${name} — ${address.substring(0, 9)}...${address.substring(59, 64)}`
    }
  },
  created: function () {
    if (this.changeableSettings.length > 0) {
      this.setting = this.changeableSettings[0]
    }
  },
  watch: {
    tokenAccount: {
      handler: function (newTk, oldTk) {
        if (this.tokenAccount && newTk.address === this.tokenAccount.address) {
          let foundSetting = false
          for (let setting of this.changeableSettings) {
            if (this.setting.action === setting.action) {
              this.setting = setting
              foundSetting = true
            }
          }
          if (!foundSetting) {
            this.setting = this.changeableSettings[0]
          }
        }
      },
      deep: true
    }
  }
}
</script>
