<template>
  <div>
    <b-form-group
      id="immutableSettings"
      label="Action"
      label-size="lg"
    >
      <Multiselect
        id="settingSelector"
        v-model="setting"
        required
        track-by="label"
        label="label"
        :options="immutableSettings"
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
      <small v-if="immutableDescription" class="form-text">{{immutableDescription}}</small>
    </b-form-group>

    <div class="text-right">
      <b-button
        v-on:click="createImmuteSetting()"
        type="submit"
        :disabled="!sufficientBalance || !tokenAccount || !setting || settingsImmuteControllers.length === 0"
        variant="primary"
      >
          <span v-if="setting && setting.label">{{setting.label}}</span>
          <span v-else>Immute Setting</span>
      </b-button>
    </div>
  </div>
</template>

<script>
import bigInt from 'big-integer'
export default {
  name: 'immuteSettingForm',
  props: {
    tokenAccount: Object
  },
  data () {
    return {
      setting: null
    }
  },
  components: {
    'b-form-group': () => import(/* webpackChunkName: "b-form-group" */'bootstrap-vue/es/components/form-group/form-group'),
    'b-form-input': () => import(/* webpackChunkName: "b-form-input" */'bootstrap-vue/es/components/form-input/form-input'),
    'LogosAddress': () => import(/* webpackChunkName: "LogosAddress" */'@/components/LogosAddress.vue'),
    'Multiselect': () => import(/* webpackChunkName: "Multiselect" */'vue-multiselect')
  },
  computed: {
    sufficientBalance: function () {
      if (!this.tokenAccount) return null
      return bigInt(this.tokenAccount.balance).greaterOrEquals(bigInt(this.$utils.minimumFee))
    },
    immutableDescription: function () {
      if (this.setting && this.tokenAccount) {
        if (this.setting.action === 'issuance') {
          return `Immuting issuance will lock the issuance setting to ${this.tokenAccount.settings.issuance}`
        } else if (this.setting.action === 'revoke') {
          return `Immuting revoke will lock the revoke setting to ${this.tokenAccount.settings.revoke}`
        } else if (this.setting.action === 'freeze') {
          return `Immuting freeze will lock the freeze setting to ${this.tokenAccount.settings.freeze}`
        } else if (this.setting.action === 'adjust_fee') {
          return `Immuting fee adjustments will lock the fee adjustment setting to ${this.tokenAccount.settings.adjust_fee}`
        } else if (this.setting.action === 'whitelist') {
          return `Immuting whitelist will lock the whitelist setting to ${this.tokenAccount.settings.whitelist}`
        }
      }
      return null
    },
    settingsImmuteControllers: function () {
      let controllers = []
      if (this.setting) {
        for (let controller of this.tokenAccount.controllers) {
          if (this.$wallet.accounts[controller.account] && controller.privileges[`change_modify_${this.setting.action}`]) {
            controllers.push(this.$wallet.accounts[controller.account])
          }
        }
      }
      return controllers
    },
    immutableSettings: function () {
      let settings = []
      if (this.tokenAccount) {
        for (let controller of this.tokenAccount.controllers) {
          if (this.$wallet.accounts[controller.account]) {
            if (this.tokenAccount.settings.modify_issuance &&
              controller.privileges.change_modify_issuance) {
              settings.push({
                label: 'Immute Issuance',
                action: 'issuance'
              })
            }
            if (this.tokenAccount.settings.modify_revoke &&
              controller.privileges.change_modify_revoke) {
              settings.push({
                label: 'Immute Revoke',
                action: 'revoke'
              })
            }
            if (this.tokenAccount.settings.modify_freeze &&
              controller.privileges.change_modify_freeze) {
              settings.push({
                label: 'Immute Freeze',
                action: 'freeze',
                value: false
              })
            }
            if (this.tokenAccount.settings.modify_adjust_fee &&
              controller.privileges.change_modify_adjust_fee) {
              settings.push({
                label: 'Immute Fee Adjustments',
                action: 'adjust_fee'
              })
            }
            if (this.tokenAccount.settings.modify_whitelist &&
              controller.privileges.change_modify_whitelist) {
              settings.push({
                label: 'Immute Whitelist',
                action: 'whitelist'
              })
            }
          }
        }
      }
      return settings
    }
  },
  methods: {
    createImmuteSetting () {
      if (this.sufficientBalance && this.tokenAccount &&
        this.setting && this.settingsImmuteControllers.length > 0) {
        this.settingsImmuteControllers[0].createImmuteSettingRequest({
          tokenAccount: this.tokenAccount.address,
          setting: this.setting.action
        })
      }
    },
    nameWithAddress ({ name, address }) {
      return `${name} — ${address.substring(0, 9)}...${address.substring(59, 64)}`
    }
  },
  created: function () {
    if (this.immutableSettings.length > 0) {
      this.setting = this.immutableSettings[0]
    }
  },
  watch: {
    tokenAccount: {
      handler: function (newTk, oldTk) {
        if (this.tokenAccount && newTk.address === this.tokenAccount.address) {
          let foundSetting = false
          for (let setting of this.immutableSettings) {
            if (this.setting && this.setting.action === setting.action) {
              this.setting = setting
              foundSetting = true
            }
          }
          if (!foundSetting) {
            this.setting = this.immutableSettings[0]
          }
        }
      },
      deep: true
    }
  }
}
</script>
