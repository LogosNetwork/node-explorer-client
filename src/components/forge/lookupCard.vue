<template>
  <div class="mb-3 shadow-sm">
    <b-card no-body class="text-left">
      <b-card-body>
        <b-card-title>
          <div class="d-flex justify-content-between">
            <div>
              {{lookupInfo.title}}
            </div>
            <div v-if="lookupInfo.time" class="timestamp text-right">
              <small>
                <span>{{ lookupInfo.time | moment('h:mm:ss a') }}</span>
              </small>
            </div>
          </div>
        </b-card-title>
        <b-card-text v-for="(param, index) in lookupInfo.params" :key="`params${index}`">
          <strong>{{param.label}}: </strong>
          <LogosAddress v-if="param.label.toLowerCase() === 'address'" :address="param.value" :force="true"/>
          <code v-else>{{param.value}}</code>
        </b-card-text>
      </b-card-body>
      <b-list-group flush>
        <b-list-group-item>
          <strong>Response</strong><br/>
          <codepad class="text-left" :code="lookupInfo.response" :thin="true"/>
        </b-list-group-item>
      </b-list-group>
    </b-card>
  </div>
</template>

<script>
import Vue from 'vue'
import VueMoment from 'vue-moment'
Vue.use(VueMoment)

export default {
  name: 'lookupCard',
  props: {
    lookupInfo: Object
  },
  components: {
    'b-card-body': () => import(/* webpackChunkName: "b-card-body" */'bootstrap-vue/es/components/card/card-body'),
    'b-card-title': () => import(/* webpackChunkName: "b-card-title" */'bootstrap-vue/es/components/card/card-title'),
    'b-card-subtitle': () => import(/* webpackChunkName: "b-card-subtitle" */'bootstrap-vue/es/components/card/card-sub-title'),
    'b-card-text': () => import(/* webpackChunkName: "b-card-text" */'bootstrap-vue/es/components/card/card-text'),
    'b-list-group': () => import(/* webpackChunkName: "b-list-group" */'bootstrap-vue/es/components/list-group/list-group'),
    'b-list-group-item': () => import(/* webpackChunkName: "b-list-group-item" */'bootstrap-vue/es/components/list-group/list-group-item'),
    'codepad': () => import(/* webpackChunkName: "Codepad" */ '@/components/codepad.vue'),
    'LogosAddress': () => import(/* webpackChunkName: "LogosAddress" */'@/components/LogosAddress.vue')
  }
}
</script>
<style lang="scss" scoped>
  .timestamp {
    font-size: 1rem
  }
</style>
