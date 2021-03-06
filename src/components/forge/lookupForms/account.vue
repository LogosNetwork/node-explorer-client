<template>
  <div>
    <b-form-group
      id="address"
      label="Address"
      label-size="lg"
      description="Lookup an Account by address or public key"
    >
      <Multiselect
        id="toSelector"
        v-model="address"
        required
        tag-placeholder="Use this account"
        track-by="address"
        label="label"
        :custom-label="labelWithAddress"
        :options="combinedAccounts"
        :multiple="false"
        :taggable="true"
        @tag="addAddress"
        placeholder="Account Address or Public Key"
      >
        <template slot="singleLabel" slot-scope="{ option }">
          <span v-if="option.label !== option.address">
            <strong>{{ option.label }}</strong>  -
          </span>
          <LogosAddress :inactive="true" :force="true" :address="option.address" />
        </template>
      </Multiselect>
    </b-form-group>

    <div class="text-right">
      <b-button
        v-on:click="parseInput()"
        :disabled="!validKeyOrAddress"
        type="submit"
        variant="primary"
      >
        Lookup Account
      </b-button>
    </div>

    <div class="mt-3 d-xl-none" v-if="info">
      <div class="mt-2">Address: <LogosAddress :forceExpand="true" :address="info.params[0].value" /></div>
      <codepad class="text-left mt-2" :code="info.response" :thin="true"/>
    </div>

  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { BFormGroup, BFormInput } from 'bootstrap-vue'

export default {
  name: 'accountLookupForm',
  data () {
    return {
      address: null,
      info: null,
      error: null
    }
  },
  created: function () {
    if (this.combinedAccounts.length > 0) {
      this.address = this.combinedAccounts[0]
    }
  },
  components: {
    BFormGroup,
    BFormInput,
    'codepad': () => import(/* webpackChunkName: "Codepad" */ '@/components/codepad.vue'),
    'LogosAddress': () => import(/* webpackChunkName: "LogosAddress" */'@/components/LogosAddress.vue'),
    'Multiselect': () => import(/* webpackChunkName: "Multiselect" */'vue-multiselect')
  },
  computed: {
    ...mapState('forge', {
      accounts: state => state.accounts
    }),
    forgeAccounts: function () {
      return this.$wallet.accounts
    },
    forgeTokens: function () {
      return this.$wallet.tokenAccounts
    },
    combinedAccounts: function () {
      let forgeTokens = []
      for (let token in this.forgeTokens) {
        forgeTokens.push({ label: `${this.forgeTokens[token].name} (${this.forgeTokens[token].symbol})`, address: token })
      }
      return Object.values(this.forgeAccounts).concat(this.accounts).concat(forgeTokens)
    },
    validKeyOrAddress () {
      if (this.address === null) return null
      return /^lgs_[13456789abcdefghijkmnopqrstuwxyz]{60}$/.test(this.address.address) || /^[0-9A-F]{64}$/i.test(this.address.address)
    }
  },
  methods: {
    ...mapActions('forge',
      [
        'addLookup',
        'addAccount'
      ]
    ),
    accountExists (newAddress) {
      for (let account of this.combinedAccounts) {
        if (account.address === newAddress) return true
      }
      return false
    },
    addAddress (newAddress) {
      if (/^lgs_[13456789abcdefghijkmnopqrstuwxyz]{60}$/.test(newAddress)) {
        let newAccount = { label: newAddress, address: newAddress }
        if (!this.accountExists(newAddress)) {
          this.addAccount(newAccount)
          this.address = newAccount
        }
      } else if (/^[0-9A-F]{64}$/i.test(newAddress)) {
        newAddress = this.$utils.accountFromHexKey(newAddress)
        let newAccount = { label: newAddress, address: newAddress }
        if (!this.accountExists(newAddress)) {
          this.addAccount(newAccount)
          this.address = newAccount
        }
      }
    },
    parseInput () {
      this.info = null
      if (this.validKeyOrAddress) {
        let address = this.address.address
        if (/^[0-9A-F]{64}$/i.test(address)) {
          address = this.$utils.accountFromHexKey(address)
        }
        this.$Logos.accounts.info(address).then((val) => {
          if (!val.error) {
            this.info = {
              title: `Account Info`,
              type: `accountInfo`,
              time: Date.now(),
              params: [
                {
                  label: 'Address',
                  value: address
                }
              ],
              response: JSON.stringify(val, null, 2)
            }
            this.addLookup(this.info)
          } else {
            this.error = 'Invalid Account, Not Found!'
          }
        })
      }
    },
    labelWithAddress ({ label, address }) {
      if (address && label !== address) {
        return `${label} — ${address.substring(0, 9)}...${address.substring(59, 64)}`
      } else {
        return address
      }
    }
  },
  watch: {
    combinedAccounts: function (newAccounts, oldAccounts) {
      if (newAccounts.length > 0) {
        let valid = false
        for (let account of newAccounts) {
          if (this.address && account.address === this.address.address) {
            this.address = account
            valid = true
          }
        }
        if (valid === false) {
          this.address = newAccounts[0]
        }
      } else {
        this.address = null
      }
    }
  }
}
</script>
