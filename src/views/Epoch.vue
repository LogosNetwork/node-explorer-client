<template>
  <div id="primary">
    <b-container v-if="epoch">
      <b-row class="text-left pt-5">
        <b-col cols="12" class="mb-3">
          <h3 class="text-left">Epoch #{{epoch.epoch_number}}</h3>
          <code style="background-color:#FFF;color:#ff3860;padding:6px">{{epoch.hash}}</code>
          <h4 v-if="error" class="pt-3" style="color:red">This epoch does not exist</h4>
        </b-col>
      </b-row>
      <b-row v-if="!error && epoch.previous !== '0000000000000000000000000000000000000000000000000000000000000000'" class="mb-3">
        <b-col cols="12" class="text-left">
          <div>
            <h4>
              Previous Epoch
            </h4>
            <p class="text-truncate"><router-link :to="'/epoch/'+epoch.previous">{{epoch.previous}}</router-link></p>
          </div>
        </b-col>
      </b-row>
      <b-row v-if="!error && epoch.next !== '0000000000000000000000000000000000000000000000000000000000000000'" class="mb-3">
        <b-col cols="12" class="text-left">
          <div>
            <h4>
              Next Epoch
            </h4>
            <p class="text-truncate"><router-link :to="'/epoch/'+epoch.next">{{epoch.next}}</router-link></p>
          </div>
        </b-col>
      </b-row>
      <b-row v-if="!error && epoch.delegate !== '255'" class="mb-3">
        <b-col cols="12" class="text-left">
          <div>
            <h4>
              Delegate
            </h4>
            <p class="text-truncate"><router-link :to="'/delegate/'+epoch.delegate">{{epoch.delegate}}</router-link></p>
          </div>
        </b-col>
      </b-row>
      <b-row v-if="!error" class="mb-3">
        <b-col cols="12" class="text-left">
          <div>
            <h4>
              Micro Epoch Tip
            </h4>
            <p class="text-truncate"><router-link :to="'/microEpoch/'+epoch.micro_block_tip">{{epoch.micro_block_tip}}</router-link></p>
          </div>
        </b-col>
      </b-row>
      <b-row v-if="epoch.delegates && epoch.delegates.length > 0">
        <b-col cols="12" class="mb-3">
          <h4 class="text-left">
            <span v-t="'epoch_delegates'"></span>
          </h4>
          <p class="text-left" v-if="epoch.timestamp !== '0'"><span v-t="'epochCreatedOn'"></span> <strong> {{parseInt(epoch.timestamp) | moment('ddd, D MMM YYYY h:mm:ssa')}}</strong></p>
          <b-table style="background:#FFF" bordered small fixed :fields="fields" :items="epoch.delegates">
            <template slot="index" slot-scope="data">
              <div class="text-truncate">
                  {{data.index}}
              </div>
            </template>
            <template slot="account" slot-scope="data">
              <div class="text-truncate">
                <router-link :to="'/delegate/'+data.item.account">{{data.item.account}}</router-link>
              </div>
            </template>
            <template slot="vote" slot-scope="data">
              <div class="text-truncate">
                  {{data.item.vote}}
              </div>
            </template>
           <template slot="stake" slot-scope="data">
              <div class="text-truncate">
                  {{data.item.stake}}
              </div>
            </template>
          </b-table>
        </b-col>
      </b-row>
      <b-row v-if="!error">
        <b-col cols="12" class="text-left">
          <h4 class="text-left" v-t="'epochJSON'"></h4>
          <codepad id='editor' class="text-left mb-3" :code="JSON.stringify(epoch, null, ' ')"/>
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
  { key: 'account', label: 'Delegate Account' },
  { key: 'vote', label: 'Vote' },
  { key: 'stake', label: 'Stake' }
]
export default {
  components: {
    codepad
  },
  computed: {
    ...mapState('epoch', {
      hash: state => state.hash,
      epoch: state => state.epoch,
      error: state => state.error
    })
  },
  created: function () {
    this.reset()
    this.getEpoch(this.$route.params.hash)
  },
  methods: {
    ...mapActions('epoch', [
      'getEpoch',
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
    this.getEpoch(to.params.hash)
    next()
  }
}
</script>

<style scoped lang="scss">
</style>
