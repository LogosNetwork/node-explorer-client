<template>
  <div>
    <b-form-group id="sendTo"
      label="To"
      label-size="lg"
    >
      <Multiselect
        id="toSelector"
        v-model="sendForm.to"
        required
        tag-placeholder="Add this account"
        track-by="address"
        label="label"
        :custom-label="labelWithAddress"
        :options="combinedAccounts"
        :multiple="false"
        :taggable="true"
        @tag="addSend"
        placeholder="Search or add an account"
      >
        <template slot="singleLabel" slot-scope="{ option }">
          <span v-if="option.label !== option.address">
            <strong>{{ option.label }}</strong>  -
          </span>
          <LogosAddress :inactive="true" :force="true" :address="option.address" />
        </template>
      </Multiselect>
    </b-form-group>

    <b-form-group
      id="sendAmount"
      label="Amount"
      label-size="lg"
      :description="currentAccount ? `${availableToSend} Logos available to send` : `No account found`"
    >
      <b-form-input
        id="amountInput"
        v-model="sendForm.amount"
        autocomplete="off"
        aria-describedby="amountError"
        :state="isValidAmount"
        required
        placeholder="Amount in Logos"
      ></b-form-input>
      <b-form-invalid-feedback id="amountError">
        This is a required field and must be a positive decimal or integer value that is less than the current accounts balance
      </b-form-invalid-feedback>
    </b-form-group>
    <div class="text-right">
      <b-button
        v-on:click="createSend()"
        type="submit"
        variant="primary"
        :disabled="!isValidAmount || !sendForm.to"
      >
        Create Send
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
import cloneDeep from 'lodash.clonedeep'
import bigInt from 'big-integer'

export default {
  name: 'sendForm',
  data () {
    return {
      accounts: [],
      sendForm: {
        to: null,
        amount: ''
      }
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
    combinedAccounts: function () {
      let forgeAccounts = cloneDeep(this.forgeAccounts)
      let forgeTokens = []
      for (let token in this.forgeTokens) {
        forgeTokens.push({ label: `${this.forgeTokens[token].name} (${this.forgeTokens[token].symbol})`, address: token })
      }
      if (this.currentAccount) delete forgeAccounts[this.currentAccount.address]
      return Array.from(Object.values(forgeAccounts)).concat(this.accounts).concat(forgeTokens)
    },
    availableToSend: function () {
      return this.$Logos.convert.fromReason(bigInt(this.currentAccount.balance).minus(bigInt(this.$utils.minimumFee)).toString(), 'LOGOS')
    },
    isValidAmount: function () {
      if (this.sendForm.amount === '') return null
      let amountInRaw = cloneDeep(this.sendForm.amount)
      if (amountInRaw) {
        if (!/^([0-9]+(?:[.][0-9]*)?|\.[0-9]+)$/.test(amountInRaw)) return false
        amountInRaw = this.$Logos.convert.toReason(amountInRaw, 'LOGOS')
        return (
          bigInt(amountInRaw).greater(0) &&
          bigInt(this.$wallet.account.balance)
            .greaterOrEquals(
              bigInt(amountInRaw)
                .plus(
                  bigInt(this.$utils.minimumFee)
                )
            )
        )
      }
      return false
    }
  },
  methods: {
    addSend (newAddress) {
      if (newAddress.match(/^lgs_[13456789abcdefghijkmnopqrstuwxyz]{60}$/) !== null) {
        let newAccount = { label: newAddress, address: newAddress }
        this.accounts.push(newAccount)
        this.sendForm.to = newAccount
      }
    },
    createSend () {
      if (this.sendForm.to && this.sendForm.to.address.match(/^lgs_[13456789abcdefghijkmnopqrstuwxyz]{60}$/) !== null) {
        let amount = this.$Logos.convert.toReason(this.sendForm.amount, 'LOGOS')
        if (bigInt(this.$wallet.account.balance)
          .greaterOrEquals(
            bigInt(amount).plus(bigInt(this.$utils.minimumFee))
          )) {
          this.$wallet.account.createSendRequest([{
            destination: this.sendForm.to.address,
            amount: amount
          }])
        }
      }
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
    if (this.combinedAccounts.length > 0) {
      this.sendForm.to = this.combinedAccounts[0]
    }
  },
  watch: {
    combinedAccounts: function (newAccounts, oldAccounts) {
      if (newAccounts.length > 0) {
        let valid = false
        for (let account of newAccounts) {
          if (this.sendForm.to && account.address === this.sendForm.to.address) {
            this.sendForm.to = account
            valid = true
          }
        }
        if (valid === false) {
          this.sendForm.to = newAccounts[0]
        }
      } else {
        this.sendForm.to = null
      }
    },
    currentAccount: function (newAccount, oldAccount) {
      if (newAccount.address !== oldAccount.address) {
        for (let account of this.combinedAccounts) {
          this.sendForm.to = account
          break
        }
      }
    }
  }
}
</script>
