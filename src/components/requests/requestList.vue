<template>
  <virtual-list v-if="requests && requests.length > 0"
    :size="153" :remain="4"
    ref="vlist"
    :item="request"
    :itemcount="requests.length"
    :itemprops="getItemProps"
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
      request: Request
    }
  },
  methods: {
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
    }
  },
  components: { 'virtual-list': virtualList },
  watch: {
    requests: function (newRequests, oldRequests) {
      if (newRequests.length !== oldRequests.length) {
        this.$refs.vlist.forceRender()
      }
    }
  }
}
</script>
