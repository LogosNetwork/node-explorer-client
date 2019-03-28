import LogosWallet from '@logosnetwork/logos-webwallet-sdk'

export { LogosWallet }

export default {
  install (Vue) {
    if (this.installed) {
      return
    }
    this.installed = true
    Vue.prototype.$Wallet = LogosWallet.Wallet
    Vue.prototype.$Utils = LogosWallet.Utils
  }
}
