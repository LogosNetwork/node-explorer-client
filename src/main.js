import Vue from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import store from './store/index'
import './assets/css/shame.scss'
import BContainer from 'bootstrap-vue/es/components/layout/container'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import BRow from 'bootstrap-vue/es/components/layout/row'
import BCol from 'bootstrap-vue/es/components/layout/col'
import BLink from 'bootstrap-vue/es/components/link/link'
import BCard from 'bootstrap-vue/es/components/card/card'
import BButton from 'bootstrap-vue/es/components/button/button'

store.dispatch('settings/loadDelegates')
Vue.config.productionTip = false
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('b-container', BContainer)
Vue.component('b-row', BRow)
Vue.component('b-col', BCol)
Vue.component('b-link', BLink)
Vue.component('b-button', BButton)
Vue.component('b-card', BCard)
new Vue({
  router,
  i18n,
  store,
  render: h => h(App)
}).$mount('#app')
