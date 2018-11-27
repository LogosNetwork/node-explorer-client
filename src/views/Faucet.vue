<template>
  <div id="primary">
    <b-container class="pt-5">
      <div class="card mb-5">
        <div class="card-body">
          <h3>Please enter your Logos address</h3>
          <div>This faucet will automatically distribute 0.01% of the faucet balance with a maximum of 1000 Logos.<br></div>
          <form>
            <div class="form-group">
              <div class="input-group input-group-lg mb-3">
                <b-input id="address" type="text" :state="searchState" aria-describedby="addressHelp" placeholder="lgs_address" v-model="address" />
                <div class="input-group-append">
                  <b-button v-b-tooltip.hover title="Scan a QR Code Address" :pressed="scanQR" variant="primary" v-on:click="toggleQRCode()" class="btn btn-default btn-sm">
                    <icon name="qrcode"></icon>
                    <span class="sr-only">Scan QR Code</span>
                  </b-button>
                </div>
              </div>
              <small id="addressHelp" class="form-text text-muted">If you don't have an address you should download our iPhone app here???</small>
            </div>
            <button type="submit" v-on:click="requestFaucet()" class="btn btn-primary">Send me some Logos</button>
          </form>
          <div v-if="scanQR" class="mt-3">
            <qrcode-reader @init="onInit" @decode="onDecode" :paused="!scanQR"></qrcode-reader>
            <div class="error">
              {{ errorMessage }}
            </div>
          </div>
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
import axios from 'axios'
import Vue from 'vue'
import VueQrcodeReader from 'vue-qrcode-reader'
Vue.use(VueQrcodeReader)
export default {
  name: 'Facuet',
  computed: {
    searchState () {
      if (this.address.length === 0) {
        return null
      } else {
        return this.address.match(/^lgs_[13456789abcdefghijkmnopqrstuwxyz]{60}$/) !== null
      }
    }
  },
  data () {
    return {
      address: '',
      scanQR: false,
      errorMessage: null
    }
  },
  methods: {
    onDecode (content) {
      if (content.match(/^lgs:lgs_[13456789abcdefghijkmnopqrstuwxyz]{60}$/)) {
        this.address = content.substring(4, 68)
        this.scanQR = false
      }
    },
    requestFaucet () {
      if (this.address.match(/^lgs_[13456789abcdefghijkmnopqrstuwxyz]{60}$/) !== null) {
        axios.post('/faucet', {
          address: this.address
        })
          .then((res) => {
            console.log(res)
          })
          .catch((err) => {
            alert(err)
          })
      }
    },
    toggleQRCode () {
      this.scanQR = !this.scanQR
    },
    onInit (promise) {
      promise.then(() => {
        console.log('Successfully initilized! Ready for scanning now!')
      })
        .catch(error => {
          if (error.name === 'NotAllowedError') {
            this.errorMessage = 'Hey! I need access to your camera'
          } else if (error.name === 'NotFoundError') {
            this.errorMessage = 'Do you even have a camera on your device?'
          } else if (error.name === 'NotSupportedError') {
            this.errorMessage = 'Seems like this page is served in non-secure context (HTTPS, localhost or file://)'
          } else if (error.name === 'NotReadableError') {
            this.errorMessage = 'Couldn\'t access your camera. Is it already in use?'
          } else if (error.name === 'OverconstrainedError') {
            this.errorMessage = 'Constraints don\'t match any installed camera. Did you asked for the front camera although there is none?'
          } else {
            this.errorMessage = 'UNKNOWN ERROR: ' + error.message
          }
        })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
