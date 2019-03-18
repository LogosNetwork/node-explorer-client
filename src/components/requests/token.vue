<template>
  <div>
    <div v-if="tokenInfo.pending !== true">
      <b-card-text v-on:click.stop>
        <span v-if="size"><img v-bind:style="{ width: size + 'px', height: size + 'px' }" v-if="tokenInfo.issuerInfo.image" class="avatar mr-2" :src="tokenInfo.issuerInfo.image"></span>
        <span v-else><img v-if="tokenInfo.issuerInfo.image" class="avatar mr-2" :src="tokenInfo.issuerInfo.image"></span>
        <font-awesome-layers class="fa-lg mr-2" v-if="!tokenInfo.issuerInfo.image">
          <font-awesome-icon :icon="faCircle" />
          <font-awesome-icon :icon="faCoins" transform="shrink-6" :style="{ color: 'white' }" />
        </font-awesome-layers>
        <b-link v-if="!inactive" :title="tokenInfo.name" :to="'/'+tokenInfo.tokenAccount">{{tokenInfo.name}} - {{tokenInfo.symbol}}</b-link>
        <span v-if="inactive">{{tokenInfo.name}} - {{tokenInfo.symbol}}</span>
      </b-card-text>
      <b-card-text v-if="origin">
        <font-awesome-icon size="lg" class="text-info mr-2 align-middle" :icon="faUserCircle" />
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
import { faCoins, faCircle, faUserCircle } from '@fortawesome/pro-light-svg-icons'
export default {
  name: 'token',
  data () {
    return {
      faCoins,
      faCircle,
      faUserCircle
    }
  },
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
