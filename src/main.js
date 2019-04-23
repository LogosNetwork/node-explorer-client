import Vue from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import store from './store/index'
import './assets/css/shame.scss'
import vBTooltip from 'bootstrap-vue/es/directives/tooltip/tooltip'
Vue.config.productionTip = false
Vue.directive('b-tooltip', vBTooltip)
Vue.component('font-awesome-icon', () => import(/* webpackChunkName: "FontAwesomeIcon" */'@fortawesome/vue-fontawesome').then(({ FontAwesomeIcon }) => FontAwesomeIcon))
Vue.component('font-awesome-layers', () => import(/* webpackChunkName: "FontAwesomeLayers" */'@fortawesome/vue-fontawesome').then(({ FontAwesomeLayers }) => FontAwesomeLayers))
Vue.component('b-form', () => import(/* webpackChunkName: "b-form" */'bootstrap-vue/es/components/form/form'))
Vue.component('b-input', () => import(/* webpackChunkName: "b-input" */'bootstrap-vue/es/components/form-input/form-input'))
Vue.component('b-container', () => import(/* webpackChunkName: "b-container" */'bootstrap-vue/es/components/layout/container'))
Vue.component('b-row', () => import(/* webpackChunkName: "b-row" */'bootstrap-vue/es/components/layout/row'))
Vue.component('b-col', () => import(/* webpackChunkName: "b-col" */'bootstrap-vue/es/components/layout/col'))
Vue.component('b-link', () => import(/* webpackChunkName: "b-link" */'bootstrap-vue/es/components/link/link'))
Vue.component('b-button', () => import(/* webpackChunkName: "b-button" */'bootstrap-vue/es/components/button/button'))
Vue.component('b-tabs', () => import(/* webpackChunkName: "b-tabs" */'bootstrap-vue/es/components/tabs/tabs'))
Vue.component('b-tab', () => import(/* webpackChunkName: "b-tab" */'bootstrap-vue/es/components/tabs/tab'))
Vue.component('b-card', () => import(/* webpackChunkName: "b-card" */'bootstrap-vue/es/components/card/card'))
Vue.component('b-form-select', () => import(/* webpackChunkName: "b-form-select" */'bootstrap-vue/es/components/form-select/form-select'))
Vue.component('b-form-invalid-feedback', () => import(/* webpackChunkName: "b-form-invalid-feedback" */'bootstrap-vue/es/components/form/form-invalid-feedback'))
Vue.component('b-img-lazy', () => import(/* webpackChunkName: "b-img-lazy" */'bootstrap-vue/es/components/image/img-lazy'))
Vue.component('b-collapse', () => import(/* webpackChunkName: "b-collapse" */'bootstrap-vue/es/components/collapse/collapse'))
Vue.component('b-table', () => import(/* webpackChunkName: "b-table" */'bootstrap-vue/es/components/table/table'))
Vue.component('b-form-checkbox', () => import(/* webpackChunkName: "b-form-checkbox" */'bootstrap-vue/es/components/form-checkbox/form-checkbox'))
new Vue({
  router,
  i18n,
  store,
  render: h => h(App)
}).$mount('#app')
