<template>
  <div id="primary">
    <b-container class="pt-5">
      <div v-if="showSuccess" id="success">
        <div class="alert alert-success text-left alert-dismissible fade show" role="alert">
          <h4 class="alert-heading">Logos was sent!</h4>
          <p>{{successMessage}}</p>
          <button type="button" class="close" v-on:click="showSuccess=false" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      </div>
      <div class="card mb-5">
        <div class="card-body">
          <h3>Please enter your Logos address</h3>
          <div>This testnet faucet will automatically distribute 0.0001% of the faucet balance with a maximum of 1000 Logos.<br></div>
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
      successMessage: '',
      showSuccess: false,
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
    hideSuccess () {
      this.showSuccess = false
    },
    requestFaucet () {
      if (this.address.match(/^lgs_[13456789abcdefghijkmnopqrstuwxyz]{60}$/) !== null) {
        axios.post('http://localhost:3000/faucet', {
          address: this.address
        })
          .then((res) => {
            this.successMessage = res.data
            this.showSuccess = true
            setTimeout(() => {
              this.showSuccess = false
            }, 3000)
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
  #success {
    position: fixed;
    z-index: 99;
    margin-top:15px;
    padding:15px;
    top: 0;
    left: 0;
    width: 100%;
  }
</style>
