<template>
  <div>
    <b-form-group
      id="changeSettingToken"
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
        :options="changeableTokens"
        :disabled="changeableTokens.length <= 1"
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
        You must select a token in order to change a setting
      </div>
      <div v-if="selectedToken && !sufficientBalance" style="display:block" class="invalid-feedback">
        {{selectedToken.name}} has an insufficient supply of logos to afford the fee for this transaction
      </div>
    </b-form-group>

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
        :disabled="!sufficientBalance || !selectedToken || !setting"
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
export default {
  name: 'changeSettingForm',
  data () {
    return {
      selectedToken: null,
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
    changeableTokens: function () {
      let tokens = []
      for (let tokenAddress in this.forgeTokens) {
        let token = this.forgeTokens[tokenAddress]
        for (let controllerAddress in token.controllers) {
          let controller = token.controllers[controllerAddress]
          if (controller.account === this.currentAccount.address) {
            if (token.settings.modify_issuance &&
              controller.privileges.change_issuance) {
              tokens.push(token)
            } else if (token.settings.modify_revoke &&
              controller.privileges.change_revoke) {
              tokens.push(token)
            } else if (token.settings.modify_freeze &&
              controller.privileges.change_freeze) {
              tokens.push(token)
            } else if (token.settings.modify_adjust_fee &&
              controller.privileges.change_adjust_fee) {
              tokens.push(token)
            } else if (token.settings.modify_whitelist &&
              controller.privileges.change_whitelist) {
              tokens.push(token)
            }
          }
        }
      }
      return tokens
    },
    changeableSettings: function () {
      let statuses = []
      if (this.selectedToken) {
        for (let controllerAddress in this.selectedToken.controllers) {
          let controller = this.selectedToken.controllers[controllerAddress]
          if (controller.account === this.currentAccount.address) {
            if (this.selectedToken.settings.modify_issuance &&
              controller.privileges.change_issuance) {
              if (this.selectedToken.settings.issuance) {
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
            if (this.selectedToken.settings.modify_revoke &&
              controller.privileges.change_revoke) {
              if (this.selectedToken.settings.revoke) {
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
            if (this.selectedToken.settings.modify_freeze &&
              controller.privileges.change_freeze) {
              if (this.selectedToken.settings.freeze) {
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
            if (this.selectedToken.settings.modify_adjust_fee &&
              controller.privileges.change_adjust_fee) {
              if (this.selectedToken.settings.adjust_fee) {
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
            if (this.selectedToken.settings.modify_whitelist &&
              controller.privileges.change_whitelist) {
              if (this.selectedToken.settings.whitelist) {
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
      if (this.sufficientBalance && this.selectedToken && this.setting) {
        this.$wallet.account.createChangeSettingRequest({
          tokenAccount: this.selectedToken.address,
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
    if (this.changeableTokens.length > 0) {
      this.selectedToken = this.changeableTokens[0]
      this.setting = this.changeableSettings[0]
    }
  },
  watch: {
    changeableTokens: {
      handler: function (newTks, oldTks) {
        if (newTks.length > 0) {
          let foundToken = false
          for (let token of newTks) {
            if (this.selectedToken && token.address === this.selectedToken.address) {
              this.selectedToken = token
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
              foundToken = true
            }
          }
          if (foundToken === false) {
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
