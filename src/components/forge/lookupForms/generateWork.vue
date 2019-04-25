<template>
  <div>
    <b-form-group
      id="hash"
      label="Hash"
      label-size="lg"
    >
      <b-form-input
        id="hashInput"
        v-model="hash"
        required
        aria-describedby="hashError"
        :state="validHash"
        placeholder="Hash to generate work for"
      ></b-form-input>
      <b-form-invalid-feedback id="hashError">
        64 Length Hexadecimal Hash is requried
      </b-form-invalid-feedback>
    </b-form-group>

    <div class="text-right">
      <b-button
        v-on:click="parseInput()"
        :disabled="!validHash"
        type="submit"
        variant="primary"
      >
        Generate Work
      </b-button>
    </div>

    <div class="mt-3 d-xl-none" v-if="info">
      <div class="mt-2">Hash: <code>{{ info.params[0].value }}</code></div>
      <codepad class="text-left mt-2" :code="info.response" :thin="true"/>
    </div>

  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'generateWorkForm',
  data () {
    return {
      hash: '',
      info: null
    }
  },
  components: {
    'b-form-group': () => import(/* webpackChunkName: "b-form-group" */'bootstrap-vue/es/components/form-group/form-group'),
    'b-form-input': () => import(/* webpackChunkName: "b-form-input" */'bootstrap-vue/es/components/form-input/form-input'),
    'codepad': () => import(/* webpackChunkName: "Codepad" */ '@/components/codepad.vue')
  },
  computed: {
    validHash () {
      if (this.hash === '') return null
      return /^[0-9A-F]{64}$/i.test(this.hash)
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
      if (this.validHash) {
        this.$Logos.work.generate(this.hash).then((val) => {
          if (!val.error) {
            this.info = {
              title: 'Generate Work',
              type: 'generateWork',
              time: Date.now(),
              params: [
                {
                  label: 'Hash',
                  value: this.hash
                }
              ],
              response: JSON.stringify(val, null, 2)
            }
            this.addLookup(this.info)
          }
        })
      }
    }
  }
}
</script>
