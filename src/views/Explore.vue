<template>
  <div id="primary">
    <b-container class="pt-5">
      <h5 class="text-left d-block d-sm-none" v-t="'explore_cta'"></h5>
      <h2 class="d-none d-sm-block" v-t="'explore_cta'"></h2>
      <b-form id="addressForm" class="mb-3">
        <label class="sr-only" for="address" v-t="'searchPlaceholder'"></label>
        <b-input @keydown.native="submitSearch" id="address" type="text" :state="searchState" aria-describedby="inputLiveFeedback" :placeholder="$t('searchPlaceholder')" v-model="address" />
        <b-form-invalid-feedback id="inputLiveFeedback">
          Enter a Logos address or a request hash
        </b-form-invalid-feedback>
      </b-form>
      <b-row class="text-left">
        <b-col cols="12" md="4" class="mb-3">
          <h5>Latest Request Block</h5>
          <b-link v-if="requestBlock" class="cardLink" :to="'/requestBlock/'+requestBlock.hash">
            <b-card v-highlight="requestBlock.hash">
              <b-row>
                <b-col class="text-truncate">
                  <b-link :to="'/requestBlock/'+requestBlock.hash">{{requestBlock.hash}}</b-link>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <span> {{parseInt(requestBlock.timestamp) | moment('ddd, D MMM YYYY h:mm:ssa')}}</span>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  Contains {{requestBlock.request_count}} Requests
                </b-col>
              </b-row>
            </b-card>
          </b-link>
        </b-col>
        <b-col cols="12" md="4" class="mb-3">
          <h5>Current Micro Epoch</h5>
           <b-link v-if="microEpoch" class="cardLink" :to="'/microEpoch/'+microEpoch.hash">
              <b-card v-highlight="microEpoch.hash">
                <b-row>
                  <b-col class="text-truncate">
                    <b-link :to="'/microEpoch/'+microEpoch.hash" v-if="microEpoch.timestamp !== '0'">Micro Epoch #{{microEpoch.sequence}}</b-link>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <span v-if="microEpoch.timestamp !== '0'"> {{parseInt(microEpoch.timestamp) | moment('ddd, D MMM YYYY h:mma')}}</span>
                    <span v-if="microEpoch.timestamp === '0'"> Genesis Micro Epoch</span>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    Contains {{microEpoch.number_batch_blocks}} Request Blocks
                  </b-col>
                </b-row>
              </b-card>
            </b-link>
        </b-col>
        <b-col cols="12" md="4" class="mb-3">
          <h5>Current Epoch</h5>
          <b-link v-if="epoch" class="cardLink" :to="'/epoch/'+epoch.hash">
              <b-card v-highlight="epoch.hash">
                <b-row>
                  <b-col class="text-truncate">
                    <b-link :to="'/epoch/'+epoch.hash">Epoch #{{epoch.epoch_number}}</b-link>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <span v-if="epoch.timestamp !== '0'"> {{parseInt(epoch.timestamp) | moment('ddd, D MMM YYYY h:mma')}}</span>
                    <span v-if="epoch.timestamp === '0'"> Genesis Epoch</span>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    Reward: {{epoch.feeInLogos}} Logos
                  </b-col>
                </b-row>
              </b-card>
            </b-link>
        </b-col>
      </b-row>
      <b-row class="text-left">
        <b-col cols="12" class="mb-5">
          <h5 class="text-left" v-t="'recent_requests'"></h5>
          <div v-infinite-scroll="getMoreRequests" infinite-scroll-distance="500">
            <div v-for="(request, index) in requests" :key='index'>
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
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Vue from 'vue'
import infiniteScroll from 'vue-infinite-scroll'
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
Vue.use(infiniteScroll)

const hlCache = new Map()
Vue.directive('highlight', {
  bind (el, { value }) {
    hlCache.set(el, value)
  },
  componentUpdated (el, { value }) {
    if (hlCache.get(el) !== value) {
      hlCache.set(el, value)
      el.classList.remove('highlight')
      el.classList.add('highlight')

      setTimeout(() => {
        el.classList.remove('highlight')
      }, 2000)
    }
  },
  unbind (el) {
    hlCache.delete(el)
  }
})
export default {
  name: 'explore',
  components: {
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
  data () {
    return {
      address: '',
      txBusy: false
    }
  },
  computed: {
    searchState () {
      if (this.address.length === 0) {
        return null
      } else {
        return (
          this.address.match(/^lgs_[13456789abcdefghijkmnopqrstuwxyz]{60}$/) !==
            null || this.address.match(/^[0-9a-fA-F]{64}$/) !== null
        )
      }
    },
    ...mapState('settings', {
      mqttHost: state => state.mqttHost
    }),
    ...mapState('explorer', {
      error: state => state.error,
      requests: state => state.requests,
      microEpoch: state => state.microEpoch,
      requestBlock: state => state.requestBlock,
      epoch: state => state.epoch
    })
  },
  created: function () {
    this.initalize({
      url: this.mqttHost,
      cb: () => {
        this.subscribe(`#`)
      }
    })
    this.getLatestRequestBlock()
    this.getLatestMicroEpoch()
    this.getLatestEpoch()
    this.getMoreRequests(true)
  },
  methods: {
    submitSearch (event) {
      if (event.which === 13) {
        event.preventDefault()
        if (
          this.address.match(/^lgs_[13456789abcdefghijkmnopqrstuwxyz]{60}$/) !==
          null
        ) {
          this.$router.push({
            name: 'account',
            params: { account: this.address }
          })
        } else {
          if (this.address.match(/^[0-9a-fA-F]{64}$/) !== null) {
            this.getBlockType({
              hash: this.address,
              cb: blockType => {
                if (blockType === 'request') {
                  this.$router.push({
                    name: 'request',
                    params: { request: this.address }
                  })
                } else if (blockType === 'requestBlock') {
                  this.$router.push({
                    name: 'requestBlock',
                    params: { hash: this.address }
                  })
                } else if (blockType === 'epoch') {
                  this.$router.push({
                    name: 'epoch',
                    params: { hash: this.address }
                  })
                } else if (blockType === 'microEpoch') {
                  this.$router.push({
                    name: 'microEpoch',
                    params: { hash: this.address }
                  })
                } else {
                  alert('Invalid Block 404')
                }
              }
            })
          }
        }
      }
    },
    ...mapActions('mqtt', ['initalize', 'unsubscribe', 'subscribe']),
    ...mapActions('explorer', ['getRequests', 'getBlockType', 'getLatestRequestBlock', 'getLatestMicroEpoch', 'getLatestEpoch']),
    getMoreRequests: function (force = false) {
      if (!this.txBusy || force) {
        this.txBusy = true
        this.getRequests((response) => {
          if (response === 'out of content') {
            this.txBusy = true
          } else if (response === 'success') {
            this.txBusy = false
          }
        })
      }
    }
  },
  destroyed: function () {
    this.unsubscribe(`#`)
  }
}
</script>

<style scoped lang="scss">
.cardLink {
  color: #525f7f;
}
.cardLink:hover {
  text-decoration: none;
}
.cardLink > .card {
  -webkit-transition: all 0.3s;
  -o-transition: all 0.3s;
  transition: all 0.3s;
}
.cardLink:hover > .card {
  box-shadow: 0 10px 30px -5px rgba(10, 16, 34, 0.2);
}
</style>
