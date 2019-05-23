<template>
<div id="primary">
    <b-container class="pt-5">
      <b-row class="text-left">
        <b-col cols="12" class="mb-5">
          <h3 class="text-left" v-t="'tokens'"></h3>
          <div v-infinite-scroll="getMoreTokens" v-if="tokens && tokens.length > 0" infinite-scroll-distance="500" name="list" is="transition-group">
            <div v-for="token in tokens" :key='token.token_id'>
              <tokenCard :tokenInfo="token" class="mb-3"/>
            </div>
          </div>
          <div v-else class="text-center">
            <p>No Tokens have been created yet.</p>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Vue from 'vue'
import infiniteScroll from 'vue-infinite-scroll'
Vue.use(infiniteScroll)

export default {
  name: 'tokens',
  components: {
    'codepad': () => import(/* webpackChunkName: "Codepad" */'@/components/codepad.vue'),
    'tokenCard': () => import(/* webpackChunkName: "tokenCard" */'@/components/requests/tokenCard.vue')
  },
  computed: {
    ...mapState('tokens', {
      tokens: state => state.tokens,
      error: state => state.error
    })
  },
  methods: {
    ...mapActions('tokens', [
      'getTokens',
      'reset'
    ]),
    getMoreTokens: function (force = false) {
      if (!this.txBusy || force) {
        this.txBusy = true
        this.getTokens((response) => {
          if (response === 'out of content') {
            this.txBusy = true
          } else if (response === 'success') {
            this.txBusy = false
          }
        })
      }
    }
  },
  data () {
    return {
      txBusy: false
    }
  },
  created: function () {
    this.getMoreTokens(true)
  },
  beforeRouteUpdate (to, from, next) {
    this.reset()
    this.getMoreTokens(true)
    next()
  }
}
</script>

<style scoped lang="scss">
</style>
