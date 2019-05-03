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
      walletOptions.rpc = {
        delegates: Object.values(store.getters['settings/delegates'])
      }
    } else {
      walletOptions = {
        fullSync: true,
        syncTokens: true,
        mqtt: store.getters['settings/mqttHost'],
        rpc: {
          delegates: Object.values(store.getters['settings/delegates'])
        }
      }
    }
    if (store.getters['settings/proxyURL']) {
      walletOptions.rpc.proxy = store.getters['settings/proxyURL']
    }
    this.installed = true
    Vue.prototype.$wallet = new LogosWallet.Wallet(walletOptions)
    Vue.prototype.$utils = LogosWallet.Utils
  }
}
