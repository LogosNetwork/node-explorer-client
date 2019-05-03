<template>
  <b-card no-body class="shadow-sm mb-3 accordionCard">
    <b-button v-on:click="requestFaucet()" class="w-100 text-left p-0" variant="link">
      <b-card-body>
        <b-row>
          <b-col cols="auto d-none d-sm-block">
            <div class="iconHolder text-white rounded bg-success d-flex align-items-center justify-content-center">
              <font-awesome-icon size="2x" :icon="faArrowDown" />
            </div>
          </b-col>
          <b-col>
            <b-card-title>
              Fund this account
            </b-card-title>
            <b-card-subtitle>
              Send Logos from the testnet faucet to this account.
            </b-card-subtitle>
          </b-col>
        </b-row>
      </b-card-body>
    </b-button>
  </b-card>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import { faArrowDown } from '@fortawesome/pro-light-svg-icons'

export default {
  name: 'forgeFund',
  data () {
    return {
      faArrowDown
    }
  },
  components: {
    'b-card-body': () => import(/* webpackChunkName: "b-card-body" */'bootstrap-vue/es/components/card/card-body'),
    'b-card-title': () => import(/* webpackChunkName: "b-card-title" */'bootstrap-vue/es/components/card/card-title'),
    'b-card-subtitle': () => import(/* webpackChunkName: "b-card-subtitle" */'bootstrap-vue/es/components/card/card-sub-title')
  },
  computed: {
    ...mapState('settings', {
      requestURL: state => state.requestURL
    }),
    currentAccount: function () {
      return this.$wallet.account
    }
  },
  methods: {
    requestFaucet () {
      if (this.currentAccount.address.match(/^lgs_[13456789abcdefghijkmnopqrstuwxyz]{60}$/) !== null) {
        axios.post(`${this.requestURL}/faucet`, {
          address: this.currentAccount.address
        }).then((res) => {
        }).catch((err) => {
          alert(err)
        })
      }
    }
  }
}
</script>
