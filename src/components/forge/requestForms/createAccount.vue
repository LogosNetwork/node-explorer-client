<template>
  <div>
    <b-form-group id="createAccountCheckboxGroup">
      <b-form-checkbox v-model="createAccountForm.usePrivateKey">Generate Account From Private Key</b-form-checkbox>
    </b-form-group>

    <b-form-group
      v-if="!createAccountForm.usePrivateKey"
      id="createAccountSeed"
      label="Seed"
      label-size="lg"
    >
      <b-form-input
        id="seedInput"
        v-model="localSeed"
        required
        aria-describedby="seedError"
        :state="validSeed"
        placeholder="Seed"
      ></b-form-input>
      <b-form-invalid-feedback id="seedError">
        64 Length Hexadecimal Value is requried for seeds
      </b-form-invalid-feedback>
    </b-form-group>

    <b-form-group
      v-if="createAccountForm.usePrivateKey"
      id="createAccountPKey"
      label="Private Key"
      label-size="lg"
    >
      <b-form-input
        id="privateKeyInput"
        v-model="createAccountForm.privateKey"
        required
        aria-describedby="privateKeyError"
        :state="validPrivateKey"
        placeholder="Private Key of account you want to import"
      ></b-form-input>
      <b-form-invalid-feedback id="privateKeyError">
        64 Length Hexadecimal Value is requried for private keys
      </b-form-invalid-feedback>
    </b-form-group>

    <div class="text-right">
      <b-button
        type="submit"
        variant="primary"
        :disabled="createAccountForm.usePrivateKey ? !validPrivateKey : !validSeed"
        v-on:click="generateAccount()"
      >
        Create Account
      </b-button>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash.clonedeep'

export default {
  name: 'createAccountForm',
  data () {
    return {
      localSeed: '',
      createAccountForm: {
        usePrivateKey: false,
        privateKey: ''
      }
    }
  },
  components: {
    'b-form-group': () => import(/* webpackChunkName: "b-form-group" */'bootstrap-vue/es/components/form-group/form-group'),
    'b-form-input': () => import(/* webpackChunkName: "b-form-input" */'bootstrap-vue/es/components/form-input/form-input'),
    'b-form-invalid-feedback': () => import(/* webpackChunkName: "b-form-invalid-feedback" */'bootstrap-vue/es/components/form/form-invalid-feedback'),
    'b-form-checkbox': () => import(/* webpackChunkName: "b-form-checkbox" */'bootstrap-vue/es/components/form-checkbox/form-checkbox')
  },
  created: function () {
    if (this.seed) {
      this.localSeed = cloneDeep(this.seed)
    }
  },
  computed: {
    seed: function () {
      return this.$wallet.seed
    },
    validSeed () {
      if (this.localSeed === '') return null
      return /^[0-9A-F]{64}$/i.test(this.localSeed)
    },
    validPrivateKey () {
      if (this.createAccountForm.privateKey === '') return null
      return /^[0-9A-F]{64}$/i.test(this.createAccountForm.privateKey)
    }
  },
  methods: {
    generateAccount () {
      if (this.createAccountForm.privateKey) {
        this.$wallet.createAccount({ privateKey: this.createAccountForm.privateKey })
      } else {
        this.$wallet.seed = this.localSeed
        this.$wallet.createAccount()
      }
    }
  }
}
</script>
