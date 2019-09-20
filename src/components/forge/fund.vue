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
            <b-card-sub-title>
              Send Logos from the testnet faucet to this account.
            </b-card-sub-title>
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
import { BCardBody, BCardTitle, BCardSubTitle } from 'bootstrap-vue'

export default {
  name: 'forgeFund',
  props: {
    address: String
  },
  data () {
    return {
      faArrowDown
    }
  },
  components: {
    BCardBody,
    BCardTitle,
    BCardSubTitle
  },
  computed: {
    ...mapState('settings', {
      requestURL: state => state.requestURL
    })
  },
  methods: {
    requestFaucet () {
      if (this.address.match(/^lgs_[13456789abcdefghijkmnopqrstuwxyz]{60}$/) !== null) {
        axios.post(`${this.requestURL}/faucet`, {
          address: this.address
        }).then((res) => {
        }).catch((err) => {
          alert(err)
        })
      }
    }
  }
}
</script>
