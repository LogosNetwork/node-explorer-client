<template>
  <span v-on:click.stop>
    <b-link class="d-lg-none" :title="address" :to="'/'+address">{{abrvAddress}}</b-link>
    <b-link class="d-none d-lg-inline-block" :title="address" :to="'/'+address">{{address}}</b-link>
  </span>
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
