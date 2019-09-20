<template>
  <div v-if="tokenInfo">
    <div v-if="tokenInfo.pending !== true">
      <b-card-text v-on:click.stop>
        <span v-if="size && tokenInfo.issuerInfo && tokenInfo.issuerInfo.image"><img :alt="`${tokenInfo.name} currency image`" v-bind:style="{ width: size + 'px', height: size + 'px' }" class="avatar mr-2" :src="tokenInfo.issuerInfo.image"></span>
        <span v-else-if="tokenInfo.issuerInfo && tokenInfo.issuerInfo.image"><img :alt="`${tokenInfo.name} currency image`" class="avatar mr-2" :src="tokenInfo.issuerInfo.image"></span>
        <font-awesome-layers class="fa-lg mr-2 align-middle faIcon" v-if="!tokenInfo.issuerInfo || !tokenInfo.issuerInfo.image">
          <font-awesome-icon :icon="faCircle" />
          <font-awesome-icon :icon="faCoins" transform="shrink-6" />
        </font-awesome-layers>
        <b-link v-if="!inactive" :title="tokenInfo.name" :to="'/'+tokenInfo.tokenAccount">{{tokenInfo.name}} - {{tokenInfo.symbol}}</b-link>
        <span v-if="inactive">{{tokenInfo.name}} - {{tokenInfo.symbol}}</span>
      </b-card-text>
      <b-card-text v-if="originAddress">
        <font-awesome-icon size="lg" class="text-info mr-2 align-middle faIcon" :icon="faUserCircle" />
        <strong class="mr-2">Controller:</strong>
        <LogosAddress class="mr-2" :address="originAddress" :force="small" />
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
import { faCoins, faCircle, faUserCircle } from '@fortawesome/pro-light-svg-icons'
import { BCardText } from 'bootstrap-vue'
import { Utils } from '@logosnetwork/logos-webwallet-sdk'

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
    size: String,
    small: {
      type: Boolean,
      default: false
    }
  },
  components: {
    BCardText,
    'LogosAddress': () => import(/* webpackChunkName: "LogosAddress" */'@/components/LogosAddress.vue'),
    'font-awesome-layers': () => import(/* webpackChunkName: "FontAwesomeLayers" */'@fortawesome/vue-fontawesome').then(({ FontAwesomeLayers }) => FontAwesomeLayers)
  },
  computed: {
    originAddress () {
      return this.origin ? Utils.accountFromHexKey(this.origin) : null
    }
  }
}
</script>
<style lang="scss" scoped>
  .faIcon {
    height: 20px;
  }
  .avatar {
    width: 22px;
    height: 22px;
    vertical-align: top;
  }
</style>
