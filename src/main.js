import Vue from 'vue'
import App from './App.vue'
import VueMoment from 'vue-moment'
import Toasted from 'vue-toasted'
import Wallet from './api/wallet'
import RPC from './api/rpc'
import config from '../config'
import router from './router'
import i18n from './i18n'
import store from './store/index'
import './assets/css/shame.scss'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import vueHeadful from 'vue-headful'
import bForm from 'bootstrap-vue/es/components/form/form'
import bFormInput from 'bootstrap-vue/es/components/form-input/form-input'
import bFormInvalidFeedback from 'bootstrap-vue/es/components/form/form-invalid-feedback'
import bImgLazy from 'bootstrap-vue/es/components/image/img-lazy'
import bNavbar from 'bootstrap-vue/es/components/navbar/navbar'
import bNavbarBrand from 'bootstrap-vue/es/components/navbar/navbar-brand'
import bNavbarToggle from 'bootstrap-vue/es/components/navbar/navbar-toggle'
import bNavbarNav from 'bootstrap-vue/es/components/navbar/navbar-nav'
import bNavItem from 'bootstrap-vue/es/components/nav/nav-item'
import bCollapse from 'bootstrap-vue/es/components/collapse/collapse'
import bButton from 'bootstrap-vue/es/components/button/button'
import bTabs from 'bootstrap-vue/es/components/tabs/tabs'
import bTab from 'bootstrap-vue/es/components/tabs/tab'
import bCard from 'bootstrap-vue/es/components/card/card'
import bFormSelect from 'bootstrap-vue/es/components/form-select/form-select'
import bLink from 'bootstrap-vue/es/components/link/link'
import vBTooltip from 'bootstrap-vue/es/directives/tooltip/tooltip'
import vBModal from 'bootstrap-vue/es/directives/modal/modal'
import vBToggle from 'bootstrap-vue/es/directives/toggle/toggle'
import bContainer from 'bootstrap-vue/es/components/layout/container'
import bRow from 'bootstrap-vue/es/components/layout/row'
import bCol from 'bootstrap-vue/es/components/layout/col'
import bTable from 'bootstrap-vue/es/components/table/table'
import bFormCheckbox from 'bootstrap-vue/es/components/form-checkbox/form-checkbox'

// Icons
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome'

Vue.config.productionTip = false
Vue.directive('b-tooltip', vBTooltip)
Vue.directive('b-modal', vBModal)
Vue.directive('b-toggle', vBToggle)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('font-awesome-layers', FontAwesomeLayers)
Vue.component('font-awesome-layers-text', FontAwesomeLayersText)
Vue.component('b-form', bForm)
Vue.component('b-input', bFormInput)
Vue.component('b-container', bContainer)
Vue.component('b-row', bRow)
Vue.component('b-col', bCol)
Vue.component('b-link', bLink)
Vue.component('b-button', bButton)
Vue.component('b-tabs', bTabs)
Vue.component('b-tab', bTab)
Vue.component('b-card', bCard)
Vue.component('b-form-select', bFormSelect)
Vue.component('b-form-invalid-feedback', bFormInvalidFeedback)
Vue.component('b-img-lazy', bImgLazy)
Vue.component('b-navbar', bNavbar)
Vue.component('b-navbar-brand', bNavbarBrand)
Vue.component('b-navbar-toggle', bNavbarToggle)
Vue.component('b-navbar-nav', bNavbarNav)
Vue.component('b-nav-item', bNavItem)
Vue.component('b-collapse', bCollapse)
Vue.component('b-table', bTable)
Vue.component('b-form-checkbox', bFormCheckbox)
Vue.component('vue-headful', vueHeadful)
Vue.use(VueMoment)
Vue.use(Toasted, {
  router,
  iconPack: 'fontawesome'
})
Vue.use(Wallet, {
  mqtt: config.mqttHost,
  rpc: {
    proxy: config.rpcProxy,
    delegates: Object.values(config.delegates)
  }
})
Vue.use(RPC)
new Vue({
  router,
  i18n,
  store,
  render: h => h(App)
}).$mount('#app')
