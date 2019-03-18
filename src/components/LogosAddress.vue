<template>
  <span v-on:click.stop v-if="!inactive">
    <b-link class="d-lg-none" :title="address" :to="'/'+address">
      <span v-if="forceExpand">
        {{address}}
      </span>
      <span v-else>
        {{abrvAddress}}
      </span>
    </b-link>
    <b-link class="d-none d-lg-inline-block" :title="address" :to="'/'+address">
      <span v-if="force">
        {{abrvAddress}}
      </span>
      <span v-else>
        {{address}}
      </span>
    </b-link>
  </span>
  <span v-else>
    <span class="d-lg-none" :title="address">
      <span v-if="forceExpand">
        {{address}}
      </span>
      <span v-else>
        {{abrvAddress}}
      </span>
    </span>
    <span class="d-none d-lg-inline-block" :title="address">
      <span v-if="force">
        {{abrvAddress}}
      </span>
      <span v-else>
        {{address}}
      </span>
    </span>
  </span>
</template>

<script>
export default {
  name: 'LogosAddress',
  props: {
    address: String,
    inactive: Boolean,
    force: Boolean,
    forceExpand: Boolean
  },
  computed: {
    abrvAddress: function () {
      return this.address.substring(0, 9) + '...' + this.address.substring(59, 64)
    }
  }
}
</script>
