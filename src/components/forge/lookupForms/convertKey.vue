<template>
  <div>
    <b-form-group
      id="key"
      label="Key or Address"
      label-size="lg"
    >
      <b-form-input
        id="keyInput"
        v-model="key"
        required
        aria-describedby="keyError"
        :state="validKeyOrAddress"
        placeholder="Logos Address or Public Key"
      ></b-form-input>
      <b-form-invalid-feedback id="keyError">
        Logos Address or 64 Length Hexadecimal Public key is requried
      </b-form-invalid-feedback>
    </b-form-group>

    <div class="text-right">
      <b-button
        v-on:click="parseInput()"
        :disabled="!validKeyOrAddress"
        type="submit"
        variant="primary"
      >
        Convert
      </b-button>
    </div>

    <div class="mt-3 d-xl-none" v-if="info">
      <div class="mt-2">Public Key: <code>{{ info.publicKey }}</code></div>
      <div class="mt-2">Address: <LogosAddress :forceExpand="true" :address="info.address" /></div>
    </div>

  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'convertKeyForm',
  data () {
    return {
      key: '',
      info: null
    }
  },
  components: {
    'b-form-group': () => import(/* webpackChunkName: "b-form-group" */'bootstrap-vue/es/components/form-group/form-group'),
    'b-form-input': () => import(/* webpackChunkName: "b-form-input" */'bootstrap-vue/es/components/form-input/form-input'),
    'b-form-invalid-feedback': () => import(/* webpackChunkName: "b-form-invalid-feedback" */'bootstrap-vue/es/components/form/form-invalid-feedback'),
    'LogosAddress': () => import(/* webpackChunkName: "LogosAddress" */'@/components/LogosAddress.vue')
  },
  computed: {
    validKeyOrAddress () {
      if (this.key === '') return null
      return /^lgs_[13456789abcdefghijkmnopqrstuwxyz]{60}$/.test(this.key) || /^[0-9A-F]{64}$/i.test(this.key)
    }
  },
  methods: {
    ...mapActions('forge',
      [
        'addLookup'
      ]
    ),
    parseInput () {
      this.info = null
      if (/^[0-9A-F]{64}$/i.test(this.key)) {
        this.info = {
          publicKey: this.key,
          address: this.$utils.accountFromHexKey(this.key)
        }
        this.addLookup({
          title: 'Public Key to Address',
          type: 'convertKey',
          time: Date.now(),
          params: [
            {
              label: 'Public Key',
              value: this.key
            }
          ],
          response: JSON.stringify(this.info, null, 2)
        })
      } else if (/^lgs_[13456789abcdefghijkmnopqrstuwxyz]{60}$/.test(this.key)) {
        this.info = {
          publicKey: this.$utils.keyFromAccount(this.key),
          address: this.key
        }
        this.addLookup({
          title: 'Address to Public Key',
          type: 'convertKey',
          time: Date.now(),
          params: [
            {
              label: 'Address',
              value: this.key
            }
          ],
          response: JSON.stringify(this.info, null, 2)
        })
      }
    }
  }
}
</script>
