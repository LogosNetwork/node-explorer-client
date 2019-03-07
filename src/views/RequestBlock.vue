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
            <send v-if="request.type === 'send'" :requestInfo="request"/>
            <burn v-if="request.type === 'burn'" :requestInfo="request"/>
            <issuerInfo v-if="request.type === 'update_issuer_info'" :requestInfo="request"/>
            <tokenSend v-if="request.type === 'token_send'" :requestInfo="request"/>
            <distribute v-if="request.type === 'distribute'" :requestInfo="request"/>
            <adjustFee v-if="request.type === 'adjust_fee'" :requestInfo="request"/>
            <changeSetting v-if="request.type === 'change_setting'" :requestInfo="request"/>
            <adjustUserStatus v-if="request.type === 'adjust_user_status'" :requestInfo="request"/>
            <issuance v-if="request.type === 'issuance'" :requestInfo="request"/>
            <issueAdditional v-if="request.type === 'issue_additional'" :requestInfo="request"/>
            <withdrawFee v-if="request.type === 'withdraw_fee'" :requestInfo="request"/>
            <updateController v-if="request.type === 'update_controller'" :requestInfo="request"/>
            <revoke v-if="request.type === 'revoke'" :requestInfo="request"/>
            <immuteSetting v-if="request.type === 'immute_setting'" :requestInfo="request"/>
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
import send from '@/components/requests/send.vue'
import burn from '@/components/requests/burn.vue'
import issuerInfo from '@/components/requests/issuerInfo.vue'
import distribute from '@/components/requests/distribute.vue'
import adjustFee from '@/components/requests/adjustFee.vue'
import changeSetting from '@/components/requests/changeSetting.vue'
import adjustUserStatus from '@/components/requests/adjustUserStatus.vue'
import issuance from '@/components/requests/issuance.vue'
import issueAdditional from '@/components/requests/issueAdditional.vue'
import withdrawFee from '@/components/requests/withdrawFee.vue'
import updateController from '@/components/requests/updateController.vue'
import revoke from '@/components/requests/revoke.vue'
import immuteSetting from '@/components/requests/immuteSetting.vue'
import tokenSend from '@/components/requests/tokenSend.vue'

export default {
  components: {
    codepad,
    send,
    burn,
    issuerInfo,
    distribute,
    adjustFee,
    changeSetting,
    adjustUserStatus,
    issuance,
    issueAdditional,
    withdrawFee,
    updateController,
    revoke,
    immuteSetting,
    tokenSend
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
