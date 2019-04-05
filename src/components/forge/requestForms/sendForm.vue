<template>
  <div>
    <b-form-group
      id="sendFrom"
      label="From"
      label-for="fromSelector"
    >
      <Multiselect
        id="fromSelector"
        v-model="currentAccount"
        required
        tag-placeholder="Add this account"
        track-by="label"
        label="label"
        :options="combinedAccounts"
        :multiple="false"
        :taggable="true"
        :disabled="true"
        @tag="addSendFrom"
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

    <b-form-group id="sendTo"
      label="To"
      label-for="toSelector"
    >
      <Multiselect
        id="toSelector"
        v-model="sendForm.to"
        required
        tag-placeholder="Add this account"
        track-by="label"
        label="label"
        :options="combinedAccounts"
        :multiple="false"
        :taggable="true"
        @tag="addSendTo"
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
      label-for="amountInput"
      :description="currentAccount ? `${currentAccount.logosBalance} Logos available to send` : `No account found`"
    >
      <b-form-input
        id="amountInput"
        v-model="sendForm.amount"
        required
        placeholder="Amount in Logos"
      ></b-form-input>
    </b-form-group>
    <div class="text-right">
      <b-button type="submit" variant="primary">Create Send</b-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import bFormGroup from 'bootstrap-vue/es/components/form-group/form-group'
import bFormInput from 'bootstrap-vue/es/components/form-input/form-input'
import LogosAddress from '@/components/LogosAddress.vue'
import Multiselect from 'vue-multiselect'

export default {
  name: 'sendForm',
  data () {
    return {
      accounts: [],
      sendForm: {
        from: '',
        to: '',
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
      currentAccount: state => state.currentAccount
    }),
    combinedAccounts: function () {
      return Array.from(Object.values(this.forgeAccounts)).concat(this.accounts)
    }
  },
  methods: {
    addSendTo (newAddress) {
      if (newAddress.match(/^lgs_[13456789abcdefghijkmnopqrstuwxyz]{60}$/) !== null) {
        let newAccount = { label: newAddress, address: newAddress }
        this.accounts.push(newAccount)
        this.sendForm.to = newAccount
      }
    },
    addSendFrom (newAddress) {
      if (newAddress.match(/^lgs_[13456789abcdefghijkmnopqrstuwxyz]{60}$/) !== null) {
        let newAccount = { label: newAddress, address: newAddress }
        this.accounts.push(newAccount)
        this.sendForm.from = newAccount
      }
    }
  }
}
</script>
