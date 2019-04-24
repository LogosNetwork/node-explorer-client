<template>
  <div>
    <b-form-group
      id="work"
      label="Work"
      label-size="lg"
    >
      <b-form-input
        id="workInput"
        v-model="work"
        required
        aria-describedby="workError"
        :state="validWork"
        placeholder="Work to validate"
        @input="parseInput"
      ></b-form-input>
      <b-form-invalid-feedback id="workError">
        16 Length Hexadecimal Work is requried
      </b-form-invalid-feedback>
    </b-form-group>

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
        placeholder="Hash for work validation"
        @input="parseInput"
      ></b-form-input>
      <b-form-invalid-feedback id="hashError">
        64 Length Hexadecimal Hash is requried
      </b-form-invalid-feedback>
    </b-form-group>

    <div class="mt-3" v-if="info">
      <div class="mt-2">Hash: <code>{{ info.params[0].value }}</code></div>
      <div class="mt-2">Work: <code>{{ info.params[1].value }}</code></div>
      <codepad class="text-left mt-2" :code="info.response" :thin="true"/>
    </div>

  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'validateWorkForm',
  data () {
    return {
      hash: '',
      work: '',
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
    },
    validWork () {
      if (this.work === '') return null
      return /^[0-9A-F]{16}$/i.test(this.work)
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
      if (this.validHash && this.validWork) {
        this.$Logos.work.validate(this.work, this.hash).then((val) => {
          if (!val.error) {
            this.info = {
              title: 'Validate Work',
              type: 'validateWork',
              time: Date.now(),
              params: [
                {
                  label: 'Work',
                  value: this.work
                },
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
