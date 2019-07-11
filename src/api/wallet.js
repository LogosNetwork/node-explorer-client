import LogosWallet from '@logosnetwork/logos-webwallet-sdk'
import store from '../store'

export { LogosWallet }

export default {
  install (Vue) {
    if (this.installed) {
      return
    }
    let walletOptions = {}
    if (store.getters['forge/walletData']) {
      walletOptions = JSON.parse(store.getters['forge/walletData'])
      walletOptions.mqtt = store.getters['settings/mqttHost']
      walletOptions.validateSync = false
      walletOptions.tokenSync = true
    } else {
      walletOptions = {
        tokenSync: true,
        validateSync: false,
        mqtt: store.getters['settings/mqttHost']
      }
    }
    if (store.getters['settings/delegates']) {
      walletOptions.rpc = {
        delegates: Object.values(store.getters['settings/delegates'])
      }
    }
    if (store.getters['settings/proxyURL']) {
      if (walletOptions.rpc) {
        walletOptions.rpc.proxy = store.getters['settings/proxyURL']
      } else {
        walletOptions = {
          rpc: {
            proxy: store.getters['settings/proxyURL']
          }
        }
      }
    }
    this.installed = true
    Vue.prototype.$wallet = new LogosWallet.Wallet(walletOptions)
    Vue.prototype.$utils = LogosWallet.Utils
  }
}
