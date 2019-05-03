<template>
  <div>
    <b-form-group
      id="privateKey"
      label="Private Key"
      label-size="lg"
    >
      <b-form-input
        id="privateKeyInput"
        v-model="privateKey"
        required
        aria-describedby="privateKeyError"
        :state="validPrivateKey"
        placeholder="Private Key you wish to expand"
      ></b-form-input>
      <b-form-invalid-feedback id="privateKeyError">
        64 Length Hexadecimal Value is requried for private keys
      </b-form-invalid-feedback>
    </b-form-group>

    <div class="text-right">
      <b-button
        v-on:click="expandKey()"
        :disabled="!validPrivateKey"
        type="submit"
        variant="primary"
      >
        Expand
      </b-button>
    </div>

    <div class="mt-3 d-xl-none" v-if="expandedKey">
      <div class="mt-2">Private Key: <code>{{ expandedKey.privateKey }}</code></div>
      <div class="mt-2">Public Key: <code>{{ expandedKey.publicKey }}</code></div>
      <div class="mt-2">Address: <LogosAddress :forceExpand="true" :address="expandedKey.address" /></div>
    </div>

  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'expandKeyForm',
  data () {
    return {
      privateKey: '',
      expandedKey: null
    }
  },
  components: {
    'b-form-group': () => import(/* webpackChunkName: "b-form-group" */'bootstrap-vue/es/components/form-group/form-group'),
    'b-form-input': () => import(/* webpackChunkName: "b-form-input" */'bootstrap-vue/es/components/form-input/form-input'),
    'b-form-invalid-feedback': () => import(/* webpackChunkName: "b-form-invalid-feedback" */'bootstrap-vue/es/components/form/form-invalid-feedback'),
    'LogosAddress': () => import(/* webpackChunkName: "LogosAddress" */'@/components/LogosAddress.vue')
  },
  computed: {
    validPrivateKey () {
      if (this.privateKey === '') return null
      return /^[0-9A-F]{64}$/i.test(this.privateKey)
    }
  },
  methods: {
    ...mapActions('forge',
      [
        'addLookup'
      ]
    ),
    expandKey () {
      this.expandedKey = null
      if (this.validPrivateKey) {
        this.$Logos.key.expand(this.privateKey).then((expandedKey) => {
          this.expandedKey = expandedKey
          this.addLookup({
            title: 'Expand Private Key',
            type: 'expandKey',
            time: Date.now(),
            params: [
              {
                label: 'Private Key',
                value: this.privateKey
              }
            ],
            response: JSON.stringify(this.expandedKey, null, 2)
          })
        })
      }
    }
  }
}
</script>
