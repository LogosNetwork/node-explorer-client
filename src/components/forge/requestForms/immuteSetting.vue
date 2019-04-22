<template>
  <div>
    <b-form-group
      id="immuteSettingToken"
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
        :options="immutableTokens"
        :disabled="immutableTokens.length <= 1"
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
        You must select a token in order to change a setting
      </div>
      <div v-if="selectedToken && !sufficientBalance" style="display:block" class="invalid-feedback">
        {{selectedToken.name}} has an insufficient supply of logos to afford the fee for this transaction
      </div>
    </b-form-group>

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
        :disabled="!sufficientBalance || !selectedToken || !setting"
        variant="primary"
      >
          <span v-if="setting && setting.label">{{setting.label}}</span>
          <span v-else>Immute Setting</span>
      </b-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import bigInt from 'big-integer'
export default {
  name: 'immuteSettingForm',
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
    ...mapState('forge', {
      forgeAccounts: state => state.accounts,
      forgeTokens: state => state.tokens,
      currentAccount: state => state.currentAccount
    }),
    sufficientBalance: function () {
      if (!this.selectedToken) return null
      return bigInt(this.selectedToken.balance).greaterOrEquals(bigInt(this.$utils.minimumFee))
    },
    immutableTokens: function () {
      let tokens = []
      for (let tokenAddress in this.forgeTokens) {
        if (this.forgeTokens[tokenAddress].controllers instanceof Array) {
          for (let controller of this.forgeTokens[tokenAddress].controllers) {
            if (controller.account === this.currentAccount.address) {
              if (this.forgeTokens[tokenAddress].settings.includes('modify_issuance') &&
              controller.privileges instanceof Array &&
              controller.privileges.includes('change_modify_issuance')) {
                tokens.push(this.forgeTokens[tokenAddress])
              } else if (this.forgeTokens[tokenAddress].settings.includes('modify_revoke') &&
              controller.privileges instanceof Array &&
              controller.privileges.includes('change_modify_revoke')) {
                tokens.push(this.forgeTokens[tokenAddress])
              } else if (this.forgeTokens[tokenAddress].settings.includes('modify_freeze') &&
              controller.privileges instanceof Array &&
              controller.privileges.includes('change_modify_freeze')) {
                tokens.push(this.forgeTokens[tokenAddress])
              } else if (this.forgeTokens[tokenAddress].settings.includes('modify_adjust_fee') &&
              controller.privileges instanceof Array &&
              controller.privileges.includes('change_modify_adjust_fee')) {
                tokens.push(this.forgeTokens[tokenAddress])
              } else if (this.forgeTokens[tokenAddress].settings.includes('modify_whitelist') &&
              controller.privileges instanceof Array &&
              controller.privileges.includes('change_modify_whitelist')) {
                tokens.push(this.forgeTokens[tokenAddress])
              }
            }
          }
        }
      }
      return tokens
    },
    immutableDescription: function () {
      if (this.setting) {
        if (this.setting.action === 'issuance') {
          return `Immuting issuance will lock the issuance setting to ${this.selectedToken.settings.includes('issuance')}`
        } else if (this.setting.action === 'revoke') {
          return `Immuting revoke will lock the revoke setting to ${this.selectedToken.settings.includes('revoke')}`
        } else if (this.setting.action === 'freeze') {
          return `Immuting freeze will lock the freeze setting to ${this.selectedToken.settings.includes('freeze')}`
        } else if (this.setting.action === 'adjust_fee') {
          return `Immuting fee adjustments will lock the fee adjustment setting to ${this.selectedToken.settings.includes('adjust_fee')}`
        } else if (this.setting.action === 'whitelist') {
          return `Immuting whitelist will lock the whitelist setting to ${this.selectedToken.settings.includes('whitelist')}`
        }
      }
      return null
    },
    immutableSettings: function () {
      let settings = []
      if (this.selectedToken) {
        for (let controller of this.selectedToken.controllers) {
          if (controller.account === this.currentAccount.address) {
            if (this.selectedToken.settings.includes('modify_issuance') &&
              controller.privileges instanceof Array &&
              controller.privileges.includes('change_modify_issuance')) {
              settings.push({
                label: 'Immute Issuance',
                action: 'issuance'
              })
            }
            if (this.selectedToken.settings.includes('modify_revoke') &&
              controller.privileges instanceof Array &&
              controller.privileges.includes('change_modify_revoke')) {
              settings.push({
                label: 'Immute Revoke',
                action: 'revoke'
              })
            }
            if (this.selectedToken.settings.includes('modify_freeze') &&
              controller.privileges instanceof Array &&
              controller.privileges.includes('change_modify_freeze')) {
              settings.push({
                label: 'Immute Freeze',
                action: 'freeze',
                value: false
              })
            }
            if (this.selectedToken.settings.includes('modify_adjust_fee') &&
              controller.privileges instanceof Array &&
              controller.privileges.includes('change_modify_adjust_fee')) {
              settings.push({
                label: 'Immute Fee Adjustments',
                action: 'adjust_fee'
              })
            }
            if (this.selectedToken.settings.includes('modify_whitelist') &&
              controller.privileges instanceof Array &&
              controller.privileges.includes('change_modify_whitelist')) {
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
      if (this.sufficientBalance && this.selectedToken && this.setting) {
        this.$wallet.account.createImmuteSettingRequest({
          tokenAccount: this.selectedToken.tokenAccount,
          setting: this.setting.action
        })
      }
    },
    nameWithAddress ({ name, tokenAccount }) {
      return `${name} — ${tokenAccount.substring(0, 9)}...${tokenAccount.substring(59, 64)}`
    }
  },
  created: function () {
    if (this.immutableTokens.length > 0) {
      this.selectedToken = this.immutableTokens[0]
      if (this.immutableSettings.length > 0) {
        this.setting = this.immutableSettings[0]
      }
    }
  },
  watch: {
    immutableTokens: function (newTks, oldTks) {
      if (newTks.length > 0) {
        let foundToken = false
        for (let token of newTks) {
          if (this.selectedToken && token.tokenAccount === this.selectedToken.tokenAccount) {
            this.selectedToken = token
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
            foundToken = true
          }
        }
        if (foundToken === false) {
          this.selectedToken = newTks[0]
        }
      } else {
        this.selectedToken = null
      }
    }
  }
}
</script>
