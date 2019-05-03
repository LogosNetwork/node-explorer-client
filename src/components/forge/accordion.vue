<template>
  <b-card no-body class="shadow-sm mb-3 accordionCard">
    <b-button class="w-100 text-left p-0" variant="link"
      :class="showCollapse ? 'collapsed' : null"
      :aria-expanded="showCollapse ? 'true' : 'false'"
      :aria-controls="`collapse_${type}`"
      @click="showCollapse = !showCollapse"
    >
      <b-card-body>
        <b-row>
          <b-col cols="auto" class="d-none d-sm-block">
            <div v-bind:class="background" class="iconHolder text-white rounded d-flex align-items-center justify-content-center" >
              <font-awesome-icon size="2x" :icon="requestIcon" />
            </div>
          </b-col>
          <b-col>
            <b-card-title>
              {{title}}
            </b-card-title>
            <b-card-subtitle>
              {{subtitle}}
            </b-card-subtitle>
          </b-col>
          <b-col cols="auto">
            <div class="iconHolder text-muted rounded d-flex align-items-center justify-content-center">
              <font-awesome-icon v-if="!showCollapse" size="lg" class="rotatable" :icon="faChevronDown" rotation="180" />
              <font-awesome-icon v-else size="lg" class="rotatable" :icon="faChevronDown"  />
            </div>
          </b-col>
        </b-row>
      </b-card-body>
    </b-button>
    <b-collapse v-bind:class="{ hideTransition: disableAnimation }" v-model="showCollapse" @hide="updateSlot()" @show="updateSlot()" :id="`collapse_${type}`" accordion="accordion" role="tabpanel">
      <b-card-body v-bind:style="{ minHeight: slotMinHeight + 'px' }" class="collapsedForm">
        <slot v-if="loadSlot" v-show="showSlot"></slot>
      </b-card-body>
    </b-collapse>
  </b-card>
</template>

<script>
import Vue from 'vue'
import { faChevronDown } from '@fortawesome/pro-light-svg-icons'

export default {
  name: 'accordionComponent',
  computed: {
    currentAccount: function () {
      return this.$wallet.account
    },
    background: function () {
      let x = {}
      x[this.bgClass] = true
      return x
    },
    type: function () {
      return this.title.replace(/\s/g, '')
    }
  },
  data () {
    return {
      showCollapse: false,
      loadSlot: false,
      showSlot: false,
      disableAnimation: false,
      faChevronDown
    }
  },
  methods: {
    updateSlot: function () {
      if (this.showCollapse === false) {
        setTimeout(() => {
          this.showSlot = false
        }, 300)
      } else {
        this.showSlot = true
        this.loadSlot = true
      }
    }
  },
  props: {
    bgClass: String,
    accordionGroup: String,
    requestIcon: Object,
    title: String,
    slotMinHeight: {
      type: Number,
      default: 172
    },
    subtitle: String
  },
  components: {
    'b-card-body': () => import(/* webpackChunkName: "b-card-body" */'bootstrap-vue/es/components/card/card-body'),
    'b-card-title': () => import(/* webpackChunkName: "b-card-title" */'bootstrap-vue/es/components/card/card-title'),
    'b-card-subtitle': () => import(/* webpackChunkName: "b-card-subtitle" */'bootstrap-vue/es/components/card/card-sub-title'),
    'b-collapse': () => import(/* webpackChunkName: "b-collapse" */'bootstrap-vue/es/components/collapse/collapse')
  },
  watch: {
    currentAccount: function (newAccount, oldAccount) {
      if (newAccount && oldAccount && newAccount.address !== oldAccount.address) {
        this.disableAnimation = true
        this.showCollapse = false
        Vue.nextTick(() => {
          this.disableAnimation = false
        })
      }
    }
  }
}
</script>
<style scoped lang="scss">
.hideTransition {
  transition: none !important;
}
.rotatable {
  -webkit-transition: all .3s;
  -o-transition: all .3s;
  transition: all .3s;
}
</style>
