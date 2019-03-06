<template>
  <b-card-text v-on:click.stop>
    <img v-if="tokenInfo.issuerInfo.image" class="avatar mr-2" :src="tokenInfo.issuerInfo.image">
    <icon v-if="!tokenInfo.issuerInfo.image" class="mr-2" label="Token Image">
      <icon name="circle" scale="2" class="alert"/>
      <icon name="coins" style="color:#FFF"/>
    </icon>
    <b-link :title="tokenInfo.name" :to="'/'+tokenInfo.tokenAccount">{{tokenInfo.name}} - {{tokenInfo.symbol}}</b-link>
  </b-card-text>
</template>

<script>
import bCardText from 'bootstrap-vue/es/components/card/card-text'
import 'vue-awesome/icons/coins'
import 'vue-awesome/icons/circle'
export default {
  name: 'token',
  props: {
    tokenInfo: Object
  },
  components: {
    'b-card-text': bCardText
  }
}
</script>
<style lang="scss" scoped>
  .avatar {
    width: 30px;
    height: 30px;
  }
</style>
