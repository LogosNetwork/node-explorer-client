<template>
  <span class="wordBreak" v-on:click.stop v-if="!inactive">
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
    forceExpand: Boolean,
    separator: {
      type: String,
      default: '...'
    },
    prefixCount: {
      type: Number,
      default: 5
    },
    suffixCount: {
      type: Number,
      default: 5
    }
  },
  computed: {
    abrvAddress: function () {
      if (this.address) {
        return this.address.substring(0, 4 + this.prefixCount) + this.separator + this.address.substring(64 - this.suffixCount, 64)
      } else {
        return ''
      }
    }
  }
}
</script>
<style scoped lang="scss">
.wordBreak {
  word-break: break-all
}
</style>
