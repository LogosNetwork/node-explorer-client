<template>
  <b-link :title="address" :href="'/'+address">{{abrvAddress}}</b-link>
</template>

<script>
export default {
  name: 'LogosAddress',
  props: {
    address: String
  },
  computed: {
    abrvAddress: function () {
      return this.address.substring(0, 9) + '...' + this.address.substring(59, 64)
    }
  }
}
</script>
