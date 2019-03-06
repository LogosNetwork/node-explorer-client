import LogosWallet from '@logosnetwork/logos-rpc-client'

export { LogosWallet }

export default {
  install (Vue, options) {
    if (this.installed) {
      return
    }
    this.installed = true
    Vue.prototype.$Wallet = LogosWallet.Wallet
    Vue.prototype.$Utils = LogosWallet.LogosUtils
  }
}
