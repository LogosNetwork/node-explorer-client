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
        track-by="label"
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
      :description="currentAccount ? `${currentAccount.logosBalance} Logos available to send` : `No account found`"
    >
      <b-form-input
        id="amountInput"
        v-model="sendForm.amount"
        autocomplete="off"
        required
        placeholder="Amount in Logos"
      ></b-form-input>
    </b-form-group>
    <div class="text-right">
      <b-button v-on:click="createSend()" type="submit" variant="primary">Create Send</b-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import bFormGroup from 'bootstrap-vue/es/components/form-group/form-group'
import bFormInput from 'bootstrap-vue/es/components/form-input/form-input'
import LogosAddress from '@/components/LogosAddress.vue'
import Multiselect from 'vue-multiselect'
import cloneDeep from 'lodash/cloneDeep'
import bigInt from 'big-integer'

export default {
  name: 'sendForm',
  data () {
    return {
      accounts: [],
      sendForm: {
        to: null,
        amount: null
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
      currentAccount: state => state.currentAccount
    }),
    combinedAccounts: function () {
      let forgeAccounts = cloneDeep(this.forgeAccounts)
      if (this.currentAccount) delete forgeAccounts[this.currentAccount.address]
      return Array.from(Object.values(forgeAccounts)).concat(this.accounts)
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
  watch: {
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
