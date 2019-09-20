import { Wallet, Utils } from '@logosnetwork/logos-webwallet-sdk'
import store from '../store'

export { Wallet }

export default {
  install (Vue) {
    if (this.installed) {
      return
    }
    let walletOptions = {}
    if (store.getters['forge/walletData']) {
      walletOptions = JSON.parse(JSON.stringify(store.getters['forge/walletData']))
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
    if (store.getters['settings/rpcHost'] && store.getters['settings/rpcPort']) {
      walletOptions.rpc = {
        nodeURL: store.getters['settings/rpcHost'],
        nodePort: store.getters['settings/rpcPort']
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
    Vue.prototype.$wallet = new Wallet(walletOptions)
    Vue.prototype.$utils = Utils
  }
}
