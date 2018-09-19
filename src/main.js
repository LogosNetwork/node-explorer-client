import Vue from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import vueHeadful from 'vue-headful'
import bForm from 'bootstrap-vue/es/components/form/form'
import bFormInput from 'bootstrap-vue/es/components/form-input/form-input'
import bImgLazy from 'bootstrap-vue/es/components/image/img-lazy'
import bNavbar from 'bootstrap-vue/es/components/navbar/navbar'
import bNavbarBrand from 'bootstrap-vue/es/components/navbar/navbar-brand'
import bNavbarToggle from 'bootstrap-vue/es/components/navbar/navbar-toggle'
import bNavbarNav from 'bootstrap-vue/es/components/navbar/navbar-nav'
import bNavItem from 'bootstrap-vue/es/components/nav/nav-item'
import bCollapse from 'bootstrap-vue/es/components/collapse/collapse'
import bButton from 'bootstrap-vue/es/components/button/button'
import bLink from 'bootstrap-vue/es/components/link/link'
import bContainer from 'bootstrap-vue/es/components/layout/container'
import bRow from 'bootstrap-vue/es/components/layout/row'
import bCol from 'bootstrap-vue/es/components/layout/col'

// Icons
import Icon from 'vue-awesome/components/Icon'

Vue.config.productionTip = false
Vue.component('b-form', bForm)
Vue.component('b-input', bFormInput)
Vue.component('b-container', bContainer)
Vue.component('b-row', bRow)
Vue.component('b-col', bCol)
Vue.component('b-link', bLink)
Vue.component('b-button', bButton)
Vue.component('b-img-lazy', bImgLazy)
Vue.component('b-navbar', bNavbar)
Vue.component('b-navbar-brand', bNavbarBrand)
Vue.component('b-navbar-toggle', bNavbarToggle)
Vue.component('b-navbar-nav', bNavbarNav)
Vue.component('b-nav-item', bNavItem)
Vue.component('b-collapse', bCollapse)
Vue.component('vue-headful', vueHeadful)
Vue.component('icon', Icon)

new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')
