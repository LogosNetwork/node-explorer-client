<template>
  <div>
    <b-form-group id="createAccountCheckboxGroup">
      <b-form-checkbox v-model="createAccountForm.usePrivateKey">Generate Account From Private Key</b-form-checkbox>
    </b-form-group>

    <b-form-group
      v-if="!createAccountForm.usePrivateKey"
      id="createAccountSeed"
      label="Seed"
      label-for="seedInput"
    >
      <b-form-input
        id="seedInput"
        v-model="seed"
        required
        placeholder="Seed"
      ></b-form-input>
    </b-form-group>

    <b-form-group
      v-if="createAccountForm.usePrivateKey"
      id="createAccountPKey"
      label="Private Key"
      label-for="privateKeyInput"
    >
      <b-form-input
        id="privateKeyInput"
        v-model="createAccountForm.privateKey"
        required
        placeholder="Private Key of account you want to import"
      ></b-form-input>
    </b-form-group>

    <div class="text-right">
      <b-button type="submit" variant="primary" v-on:click="generateAccount()">Create Account</b-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import bFormGroup from 'bootstrap-vue/es/components/form-group/form-group'
import bFormInput from 'bootstrap-vue/es/components/form-input/form-input'
import LogosAddress from '@/components/LogosAddress.vue'

export default {
  name: 'createAccountForm',
  data () {
    return {
      createAccountForm: {
        usePrivateKey: false,
        privateKey: ''
      }
    }
  },
  components: {
    bFormGroup,
    bFormInput,
    LogosAddress
  },
  computed: {
    ...mapState('forge', {
      seed: state => state.seed
    })
  },
  methods: {
    generateAccount () {
      if (this.createAccountForm.privateKey) {
        this.$wallet.createAccount({ privateKey: this.createAccountForm.privateKey })
      } else {
        this.$wallet.seed = this.seed
        this.$wallet.createAccount()
      }
    }
  }
}
</script>
