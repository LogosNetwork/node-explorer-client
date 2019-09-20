import Vue from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import store from './store/index'
import './assets/css/shame.scss'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import LogosAddress from '@/components/LogosAddress.vue'
import { VBModal, VBTooltip, BContainer, BRow, BCol, BLink, BCard, BButton } from 'bootstrap-vue'

Vue.config.productionTip = false
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('b-container', BContainer)
Vue.component('b-row', BRow)
Vue.component('b-col', BCol)
Vue.component('b-link', BLink)
Vue.component('b-button', BButton)
Vue.component('b-card', BCard)
Vue.component('LogosAddress', LogosAddress)
Vue.directive('b-modal', VBModal)
Vue.directive('b-tooltip', VBTooltip)
new Vue({
  router,
  i18n,
  store,
  render: h => h(App)
}).$mount('#app')
