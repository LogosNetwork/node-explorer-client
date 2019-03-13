<template>
  <div id="primary">
    <b-container>
      <b-row class="text-left pt-5">
        <b-col cols="12" md="8" class="mb-3">
          <h3 class="text-left" v-t="'request'"></h3>
          <code style="background-color:#FFF;color:#ff3860;padding:6px">{{request}}</code>
        </b-col>
      </b-row>
      <b-row v-if="!error && details && details.origin" class="mt-3">
        <b-col cols="12" class="text-left">
            <div>
              <h4>
                Created By
              </h4>
              <p class="text-truncate">
                <router-link :to="'/'+details.origin">{{details.origin}}</router-link>
              </p>
            </div>
        </b-col>
      </b-row>
      <b-row v-if="!error && details && details.previous !== '0000000000000000000000000000000000000000000000000000000000000000'" class="mt-3">
        <b-col cols="12" class="text-left">
            <div>
              <h4>
                Previous Request
              </h4>
              <p class="text-truncate"><router-link :to="'/'+details.previous">{{details.previous}}</router-link></p>
            </div>
        </b-col>
      </b-row>
      <b-row v-if="!error && details && details.next !== '0000000000000000000000000000000000000000000000000000000000000000'" class="mt-3">
        <b-col cols="12" class="text-left">
            <div>
              <h4>
                Next Request
              </h4>
              <p class="text-truncate"><router-link :to="'/'+details.next">{{details.next}}</router-link></p>
            </div>
        </b-col>
      </b-row>
      <b-row v-if="!error && details" class="mt-3">
        <b-col cols="12" class="text-left">
            <div>
              <h4>
                Confirmed in Request Block
              </h4>
              <p class="text-truncate"><router-link :to="'/requestBlock/'+details.request_block_hash">{{details.request_block_hash}}</router-link></p>
            </div>
        </b-col>
      </b-row>
      <b-row v-if="!error && details" class="mb-5">
        <b-col cols="12">
          <request :requestInfo="details"/>
        </b-col>
      </b-row>
      <b-row v-if="!error && details !== null">
        <b-col cols="12" class="text-left">
          <h4 class="text-left" v-t="'prettyRequest'"></h4>
          <codepad id='editor' class="text-left mb-3" v-if='details' :code='prettyDetails'/>
        </b-col>
      </b-row>
      <b-row v-if="error">
        <b-col cols="12" class="text-left">
          <h4 style="color:red">This request does not exist yet.</h4>
          <br>
          <small>If you have just sent this request it will appear here when confirmed.</small>
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
    ...mapState('settings', {
      mqttHost: state => state.mqttHost
    }),
    ...mapState('request', {
      request: state => state.request,
      details: state => state.details,
      prettyDetails: state => state.prettyDetails,
      error: state => state.error
    })
  },
  methods: {
    ...mapActions('mqtt', [
      'initalize',
      'unsubscribe',
      'subscribe'
    ]),
    ...mapActions('request', [
      'getRequestInfo',
      'reset'
    ])
  },
  created: function () {
    this.getRequestInfo(this.$route.params.request)
    this.initalize({ url: this.mqttHost,
      cb: () => {
        this.subscribe(`request/${this.$route.params.request}`)
      }
    })
  },
  destroyed: function () {
    this.unsubscribe(`request/${this.request}`)
  },
  beforeRouteUpdate (to, from, next) {
    this.unsubscribe(`request/${this.request}`)
    this.reset()
    this.initalize({ url: this.mqttHost,
      cb: () => {
        this.subscribe(`request/${to.params.request}`)
      }
    })
    this.getRequestInfo(to.params.request)
    next()
  }
}
</script>

<style scoped lang="scss">
</style>
