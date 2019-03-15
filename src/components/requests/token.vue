<template>
  <div>
    <div v-if="tokenInfo.pending !== true">
      <b-card-text v-on:click.stop>
        <span v-if="size"><img v-bind:style="{ width: size + 'px', height: size + 'px' }" v-if="tokenInfo.issuerInfo.image" class="avatar mr-2" :src="tokenInfo.issuerInfo.image"></span>
        <span v-else><img v-if="tokenInfo.issuerInfo.image" class="avatar mr-2" :src="tokenInfo.issuerInfo.image"></span>
        <icon v-if="!tokenInfo.issuerInfo.image" class="mr-2" label="Token Image">
          <icon name="circle" scale="2" class="alert"/>
          <icon name="coins" style="color:#FFF"/>
        </icon>
        <b-link v-if="!inactive" :title="tokenInfo.name" :to="'/'+tokenInfo.tokenAccount">{{tokenInfo.name}} - {{tokenInfo.symbol}}</b-link>
        <span v-if="inactive">{{tokenInfo.name}} - {{tokenInfo.symbol}}</span>
      </b-card-text>
      <b-card-text v-if="origin">
        <icon style="vertical-align:middle;" scale="1.35" name="user-circle" class="text-info mr-2"></icon>
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
    origin: String,
    inactive: Boolean,
    size: String
  },
  components: {
    'b-card-text': bCardText,
    LogosAddress
  }
}
</script>
<style lang="scss" scoped>
  .avatar {
    width: 22px;
    height: 22px;
    vertical-align: top;
  }
</style>
