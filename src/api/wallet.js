import LogosWallet from '@logosnetwork/logos-webwallet-sdk'

export { LogosWallet }

export default {
  install (Vue, options) {
    if (this.installed) {
      return
    }
    this.installed = true
    Vue.prototype.$wallet = new LogosWallet.Wallet(options)
    Vue.prototype.$utils = LogosWallet.Utils
  }
}
