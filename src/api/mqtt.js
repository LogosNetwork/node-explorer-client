import Mqtt from 'mqtt'

export { Mqtt }

export default {
  install (Vue) {
    if (this.installed) {
      return
    }
    this.installed = true
    Vue.prototype.$Mqtt = Mqtt
  }
}
