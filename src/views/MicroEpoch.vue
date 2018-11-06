<template>
  <div id="primary">
    <b-container v-if="microEpoch">
      <b-row class="text-left pt-5">
        <b-col cols="12" class="mb-3">
          <h3 class="text-left">Micro Epoch #{{microEpoch.micro_block_number}}</h3>
          <code style="background-color:#FFF;color:#ff3860;padding:6px">{{microEpoch.hash}}</code>
          <h4 v-if="error" class="pt-3" style="color:red">This micro epoch does not exist</h4>
        </b-col>
      </b-row>
      <b-row v-if="!error" class="mb-3">
        <b-col cols="12" class="text-left">
            <div>
              <h4>
                Parent Epoch
              </h4>
              <p class="text-truncate">Epoch #{{microEpoch.epoch_number}}</p>
            </div>
        </b-col>
      </b-row>
      <b-row v-if="!error" class="mb-3">
        <b-col v-if="microEpoch.previous !== '0000000000000000000000000000000000000000000000000000000000000000'" cols="12" class="text-left">
            <div>
              <h4>
                Previous
              </h4>
              <p class="text-truncate"><router-link :to="'/microEpoch/'+microEpoch.previous">{{microEpoch.previous}}</router-link></p>
            </div>
        </b-col>
      </b-row>
      <b-row v-if="!error" class="mb-3">
        <b-col cols="12" class="text-left">
            <div>
              <h4>
                Delegate
              </h4>
              <p class="text-truncate"><router-link :to="'/delegate/'+microEpoch.delegate">{{microEpoch.delegate}}</router-link></p>
            </div>
        </b-col>
      </b-row>
      <b-row v-if="!error" class="mb-3">
        <b-col cols="12" class="text-left">
            <div>
              <h4>
                Batch Blocks contained in this Micro Epoch
              </h4>
              <p class="text-truncate">{{microEpoch.number_batch_blocks}}</p>
            </div>
        </b-col>
      </b-row>
      <b-row v-if="microEpoch.tips && microEpoch.tips.length > 0">
        <b-col cols="12" class="mb-3">
          <h4 class="text-left">
            <span v-t="'tips_batchblocks'"></span>
          </h4>
          <p class="text-left"><span v-t="'microEpochCreatedOn'"></span> <strong> {{parseInt(microEpoch.timestamp) | moment('ddd, D MMM YYYY h:mm:ssa')}}</strong></p>
          <b-table style="background:#FFF" bordered small fixed :fields="fields" :items="microEpoch.tips">
            <template slot="index" slot-scope="data">
              <div class="text-truncate">{{data.index}}</div>
            </template>
            <template slot="hash" slot-scope="data">
              <div class="text-truncate">
                  <router-link :to="'/batchBlock/'+data.item">{{data.item}}</router-link>
              </div>
            </template>
          </b-table>
        </b-col>
      </b-row>
    <b-row v-if="!error">
        <b-col cols="12" class="text-left">
          <h4 class="text-left" v-t="'microEpochJSON'"></h4>
          <codepad id='editor' class="text-left mb-3" :code="JSON.stringify(microEpoch, null, ' ')"/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import codepad from '@/components/codepad.vue'
let fields = [
  { key: 'index', label: 'Delegate #' },
  { key: 'hash', label: 'Hash' }
]
export default {
  components: {
    codepad
  },
  computed: {
    ...mapState('microEpoch', {
      hash: state => state.hash,
      microEpoch: state => state.microEpoch,
      error: state => state.error
    })
  },
  created: function () {
    this.reset()
    this.getMicroEpoch(this.$route.params.hash)
  },
  methods: {
    ...mapActions('microEpoch', [
      'getMicroEpoch',
      'reset'
    ])
  },
  data () {
    return {
      fields: fields
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.reset()
    this.getMicroEpoch(to.params.hash)
    next()
  }
}
</script>

<style scoped lang="scss">
</style>