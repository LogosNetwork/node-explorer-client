<template>
  <div>
    <div v-if="tokenInfo.pending !== true">
      <b-card-text v-on:click.stop>
        <img v-if="tokenInfo.issuerInfo.image" class="avatar mr-2" :src="tokenInfo.issuerInfo.image">
        <icon v-if="!tokenInfo.issuerInfo.image" class="mr-2" label="Token Image">
          <icon name="circle" scale="2" class="alert"/>
          <icon name="coins" style="color:#FFF"/>
        </icon>
        <b-link :title="tokenInfo.name" :to="'/'+tokenInfo.tokenAccount">{{tokenInfo.name}} - {{tokenInfo.symbol}}</b-link>
      </b-card-text>
      <b-card-text v-if="origin">
        <icon style="vertical-align:middle;" scale="2" name="user-circle" class="text-info mr-2"></icon>
        <strong class="mr-2">Token Controller:</strong>
        <LogosAddress class="mr-2" :address="origin" />
      </b-card-text>
    </div>
    <div v-if="tokenInfo.pending === true">
      <b-card-text>
        Loading Token Info
      </b-card-text>
    </div>
  </div>
</template>

<script>
import bCardText from 'bootstrap-vue/es/components/card/card-text'
import LogosAddress from '@/components/LogosAddress.vue'
import 'vue-awesome/icons/coins'
import 'vue-awesome/icons/circle'
import 'vue-awesome/icons/user-circle'
export default {
  name: 'token',
  props: {
    tokenInfo: Object,
    origin: String
  },
  components: {
    'b-card-text': bCardText,
    LogosAddress
  }
}
</script>
<style lang="scss" scoped>
  .avatar {
    width: 30px;
    height: 30px;
  }
</style>
