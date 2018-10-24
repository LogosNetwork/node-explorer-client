import LogosWallet from '@logosnetwork/logos-webwallet-sdk'

export { LogosWallet }

export default {
  install (Vue) {
    if (this.installed) {
      return
    }
    this.installed = true
    Vue.prototype.$Block = LogosWallet.Block
    Vue.prototype.$LogosFunctions = LogosWallet.LogosFunctions
    Vue.prototype.$Wallet = LogosWallet.Wallet
  }
}
