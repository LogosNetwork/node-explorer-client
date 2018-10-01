import Logos from 'logos-rpc-client'

export { Logos }

export default {
  install (Vue, options) {
    if (this.installed) {
      return
    }
    this.installed = true
    Vue.prototype.$Logos = new Logos(options)
  }
}
