<template>
  <div id="primary">
    <b-container v-if="requestBlock">
      <b-row class="text-left pt-5">
        <b-col cols="12">
          <h3 class="text-left" v-t="'request_block'"></h3>
          <code style="background-color:#FFF;color:#ff3860;padding:6px">{{requestBlock.hash}}</code>
          <h4 v-if="error" class="pt-3" style="color:red">This request block does not exist</h4>
        </b-col>
      </b-row>
      <b-row v-if="!error && requestBlock.previous !== '0000000000000000000000000000000000000000000000000000000000000000'" class="mt-3">
        <b-col cols="12" class="text-left">
            <div>
              <h4>
                Previous Request Block for Delegate {{requestBlock.delegate}}
              </h4>
              <p class="text-truncate"><router-link :to="'/requestBlock/'+requestBlock.previous">{{requestBlock.previous}}</router-link></p>
            </div>
        </b-col>
      </b-row>
      <b-row v-if="!error && requestBlock.next !== '0000000000000000000000000000000000000000000000000000000000000000'" class="mt-3">
        <b-col cols="12" class="text-left">
            <div>
              <h4>
                Next Request Block for Delegate {{requestBlock.delegate}}
              </h4>
              <p class="text-truncate"><router-link :to="'/requestBlock/'+requestBlock.next">{{requestBlock.next}}</router-link></p>
            </div>
        </b-col>
      </b-row>
      <b-row v-if="requestBlock.requests && requestBlock.requests.length > 0">
        <b-col cols="12" class="mb-3">
          <h4 class="text-left">
            <span>{{requestBlock.request_count}} </span>
            <span v-t="'requests'"></span>
          </h4>
          <p class="text-left"><span v-t="'requestBlockCreatedOn'"></span> <strong> {{parseInt(requestBlock.timestamp) | moment('ddd, D MMM YYYY h:mm:ssa')}}</strong></p>
          <div v-for="(request, index) in requestBlock.requests" :key='index'>
            <request :requestInfo="request"/>
          </div>
        </b-col>
      </b-row>
    <b-row v-if="!error">
        <b-col cols="12" class="text-left">
          <h4 class="text-left" v-t="'requestBlockJSON'"></h4>
          <codepad id='editor' class="text-left" :code="prettyDetails"/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import codepad from '@/components/codepad.vue'
import request from '@/components/requests/request.vue'

export default {
  components: {
    codepad,
    request
  },
  computed: {
    ...mapState('requestBlock', {
      hash: state => state.hash,
      requestBlock: state => state.requestBlock,
      prettyDetails: state => state.prettyDetails,
      error: state => state.error
    })
  },
  created: function () {
    this.reset()
    this.getRequestBlock(this.$route.params.hash)
  },
  methods: {
    ...mapActions('requestBlock', [
      'getRequestBlock',
      'reset'
    ])
  },
  beforeRouteUpdate (to, from, next) {
    this.reset()
    this.getRequestBlock(to.params.hash)
    next()
  }
}
</script>

<style scoped lang="scss">
</style>
