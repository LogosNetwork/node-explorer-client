<template>
  <b-card no-body class="text-left mb-3 shadow-sm accordionCard">
    <b-button class="w-100 text-left p-0" variant="link"
      :class="showCollapse ? 'collapsed' : null"
      :aria-expanded="showCollapse ? 'true' : 'false'"
      :aria-controls="`collapse_${type}_${index}`"
      @click="showCollapse = !showCollapse"
    >
      <b-card-body>
        <b-row class="d-flex align-items-center justify-content-center">
          <b-col cols="auto">
            <div class="text-muted rounded">
              <font-awesome-icon v-if="!showCollapse" size="lg" class="rotatable" :icon="faChevronDown" rotation="180" />
              <font-awesome-icon v-else size="lg" class="rotatable" :icon="faChevronDown"  />
            </div>
          </b-col>
          <b-col>
            <h5 class="mb-0">
              {{lookupInfo.title}}
            </h5>
          </b-col>
          <b-col cols="auto" v-if="lookupInfo.time" class="timestamp text-right text-muted">
            <small>
              <span>{{ lookupInfo.time | moment('h:mm:ss a') }}</span>
            </small>
          </b-col>
        </b-row>
      </b-card-body>
    </b-button>
    <b-collapse v-model="showCollapse" :id="`collapse_${type}_${index}`" accordion="lookups" role="tabpanel">
      <b-list-group flush class="collapsedForm">
        <b-list-group-item>
          <b-card-text v-for="(param, index) in lookupInfo.params" :key="`params${index}`">
            <strong>{{param.label}}: </strong><br/>
            <LogosAddress v-if="param.label.toLowerCase() === 'address'" :address="param.value" :force="true"/>
            <code v-else>{{param.value}}</code>
          </b-card-text>
          <strong>Response: </strong><br/>
          <codepad class="text-left" :code="lookupInfo.response" :thin="true"/>
        </b-list-group-item>
      </b-list-group>
    </b-collapse>
  </b-card>
</template>

<script>
import Vue from 'vue'
import { faChevronDown } from '@fortawesome/pro-light-svg-icons'
import { BCardBody, BCardTitle, BCardText, BCardSubTitle, BListGroup, BListGroupItem, BCollapse } from 'bootstrap-vue'
import VueMoment from 'vue-moment'
Vue.use(VueMoment)

export default {
  name: 'lookupCard',
  props: {
    lookupInfo: Object,
    index: Number
  },
  data () {
    return {
      showCollapse: false,
      disableAnimation: false,
      faChevronDown
    }
  },
  created: function () {
    if (this.index === 0) {
      this.showCollapse = true
    }
  },
  computed: {
    type: function () {
      return this.lookupInfo.title.replace(/\s/g, '')
    }
  },
  components: {
    BCardBody,
    BCardTitle,
    BCardSubTitle,
    BCardText,
    BListGroup,
    BListGroupItem,
    BCollapse,
    'codepad': () => import(/* webpackChunkName: "Codepad" */ '@/components/codepad.vue'),
    'LogosAddress': () => import(/* webpackChunkName: "LogosAddress" */'@/components/LogosAddress.vue')
  },
  watch: {
    lookupInfo: {
      handler: function (newInfo, oldInfo) {
        if (this.index === 0) {
          this.showCollapse = true
        }
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
  .timestamp {
    font-size: 1rem
  }
  .rotatable {
    -webkit-transition: all .3s;
    -o-transition: all .3s;
    transition: all .3s;
  }
</style>
