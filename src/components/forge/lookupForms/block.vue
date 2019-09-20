<template>
  <div>
    <b-form-group
      id="hash"
      label="Hash"
      label-size="lg"
      description="Lookup a Request, RequestBlock, MicroEpoch, or Epoch"
    >
      <b-form-input
        id="hashInput"
        v-model="hash"
        required
        aria-describedby="hashError"
        :state="validHash && !error"
        placeholder="Block Hash you wish to lookup"
      ></b-form-input>
      <b-form-invalid-feedback id="hashError">
        <span v-if="!error">64 Length Hexadecimal Hash is requried</span>
        <span v-else>{{error}}</span>
      </b-form-invalid-feedback>
    </b-form-group>

    <div class="text-right">
      <b-button
        v-on:click="parseInput()"
        :disabled="!validHash"
        type="submit"
        variant="primary"
      >
        Lookup Block
      </b-button>
    </div>

    <div class="mt-3 d-xl-none" v-if="info">
      <div class="mt-2">
        {{info.type.charAt(0).toUpperCase() + info.type.slice(1)}} Hash:
        <router-link :to="`${info.type !== `request` ? `/${info.type}/` : '/'}${info.params[0].value}`">{{info.params[0].value}}</router-link>
      </div>
      <codepad class="text-left mt-2" :code="info.response" :thin="true"/>
    </div>

  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { BFormGroup, BFormInput, BFormInvalidFeedback } from 'bootstrap-vue'

export default {
  name: 'blockForm',
  data () {
    return {
      hash: '',
      info: null,
      error: null
    }
  },
  components: {
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback,
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
    createLookup (type, val) {
      this.info = {
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Info`,
        type: `${type}`,
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
    },
    parseInput () {
      this.info = null
      this.error = null
      if (this.hash.match(/^[0-9a-fA-F]{64}$/) !== null) {
        this.$Logos.requests.info(this.hash, false).then((val) => {
          if (!val.error) {
            this.createLookup('request', val)
          } else {
            this.$Logos.requestBlocks.get([this.hash]).then((val) => {
              if (!val.error) {
                this.createLookup('requestBlock', val)
              } else {
                this.$Logos.epochs.get([this.hash]).then((val) => {
                  if (!val.error) {
                    this.createLookup('epoch', val)
                  } else {
                    this.$Logos.microEpochs.get([this.hash]).then((val) => {
                      if (!val.error) {
                        this.createLookup('microEpoch', val)
                      } else {
                        this.error = 'Invalid Block, Not Found!'
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
    }
  }
}
</script>
