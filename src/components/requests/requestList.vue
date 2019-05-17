<template>
  <virtual-list v-if="requests && requests.length > 0"
    :size="153" :remain="remains"
    ref="vlist"
    :item="request"
    :itemcount="requests.length"
    :itemprops="getItemProps"
    :variable="getItemHeight"
    :pagemode="true"
  />
</template>
<script>
import Request from '@/components/requests/request.vue'
import virtualList from 'vue-virtual-scroll-list'
export default {
  name: 'requestList',
  props: {
    requests: Array,
    address: String,
    small: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      request: Request,
      remains: this.updateRemains()
    }
  },
  mounted () {
    window.addEventListener('resize', this.updateRemains)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.updateRemains)
  },
  methods: {
    updateRemains () {
      this.remains = Math.ceil(document.documentElement.clientHeight / 153)
      return this.remains
    },
    getItemProps (itemIndex) {
      let data = {
        key: this.requests[itemIndex].hash,
        props: {
          requestInfo: this.requests[itemIndex],
          account: this.address,
          small: this.small
        }
      }
      return data
    },
    getItemHeight (itemIndex) {
      let request = this.requests[itemIndex]
      if (request.type === 'send') {
        return 104 + request.transactions.length * 49
      } else if (request.type === 'token_send') {
        return 144 + request.transactions.length * 49
      } else if (request.type === 'issuance') {
        let myRequest = JSON.parse(request.toJSON())
        let defaultHeight = 637
        let settingsHeight = 0
        let controllersHeight = 0
        if (myRequest.settings.length > 0) {
          settingsHeight += 46
          settingsHeight += myRequest.settings.length * 24
        }
        if (myRequest.controllers.length > 0) {
          controllersHeight += 46 * myRequest.controllers.length
          for (let controller of myRequest.controllers) {
            controllersHeight += controller.privileges.length * 24
          }
        }
        return defaultHeight + settingsHeight + controllersHeight
      } else if (request.type === 'update_controller') {
        let myRequest = JSON.parse(request.toJSON())
        if (myRequest.controller.privileges.length > 0) {
          return 259 + myRequest.controller.privileges.length * 24
        } else {
          return 267
        }
      } else if (request.type === 'adjust_fee') {
        return 243
      } else if (request.type === 'distribute' ||
        request.type === 'withdraw_fee' ||
        request.type === 'withdraw_logos' ||
        request.type === 'issue_additional' ||
        request.type === 'immute_setting' ||
        request.type === 'adjust_user_status' ||
        request.type === 'burn') {
        return 194
      } else if (request.type === 'revoke') {
        return 243
      } else {
        return 153
      }
    }
  },
  components: { 'virtual-list': virtualList },
  watch: {
    requests: function (newRequests, oldRequests) {
      if (newRequests.length !== oldRequests.length && this.$refs.vlist) {
        this.$refs.vlist.forceRender()
      }
    }
  }
}
</script>
