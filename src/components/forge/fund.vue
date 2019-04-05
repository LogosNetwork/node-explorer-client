<template>
  <b-card no-body class="shadow-sm mb-3 accordionCard">
    <b-button v-on:click="requestFaucet()" class="w-100 text-left p-0" variant="link">
      <b-card-body>
        <b-row>
          <b-col cols="auto">
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
import bCardBody from 'bootstrap-vue/es/components/card/card-body'
import bCardTitle from 'bootstrap-vue/es/components/card/card-title'
import bCardSubtitle from 'bootstrap-vue/es/components/card/card-sub-title'
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
    bCardBody,
    bCardTitle,
    bCardSubtitle
  },
  computed: {
    ...mapState('settings', {
      requestURL: state => state.requestURL
    }),
    ...mapState('forge', {
      currentAccount: state => state.currentAccount
    })
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
