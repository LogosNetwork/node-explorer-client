import Logos from '@logosnetwork/logos-rpc-client'
import store from '../store'

export { Logos }

export default {
  install (Vue) {
    if (this.installed) {
      return
    }
    let rpcOptions = {
      url: `http://${store.getters['settings/rpcHost']}:${store.getters['settings/rpcPort']}`
    }
    if (store.getters['settings/proxyURL']) {
      rpcOptions.proxyURL = store.getters['settings/proxyURL']
    }
    this.installed = true
    Vue.prototype.$Logos = new Logos(rpcOptions)
  }
}
