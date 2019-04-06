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
          <b-col cols="auto">
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
              <font-awesome-icon v-if="!showCollapse" size="lg" :icon="faChevronDown" />
              <font-awesome-icon v-else size="lg" :icon="faChevronUp" />
            </div>
          </b-col>
        </b-row>
      </b-card-body>
    </b-button>
    <b-collapse v-bind:class="{ hideTransition: disableAnimation }" v-model="showCollapse" :id="`collapse_${type}`" accordion="accordion" role="tabpanel">
      <b-card-body class="collapsedForm">
        <slot></slot>
      </b-card-body>
    </b-collapse>
  </b-card>
</template>

<script>
import { mapState } from 'vuex'
import bCardBody from 'bootstrap-vue/es/components/card/card-body'
import bCardTitle from 'bootstrap-vue/es/components/card/card-title'
import bCardSubtitle from 'bootstrap-vue/es/components/card/card-sub-title'
import bCollapse from 'bootstrap-vue/es/components/collapse/collapse'
import { faChevronDown, faChevronUp } from '@fortawesome/pro-light-svg-icons'

export default {
  name: 'accordionComponent',
  computed: {
    ...mapState('forge', {
      currentAccount: state => state.currentAccount
    }),
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
      disableAnimation: false,
      faChevronDown,
      faChevronUp
    }
  },
  props: {
    bgClass: String,
    accordionGroup: String,
    requestIcon: Object,
    title: String,
    subtitle: String
  },
  components: {
    bCardBody,
    bCardTitle,
    bCardSubtitle,
    bCollapse
  },
  watch: {
    currentAccount: function (newAccount, oldAccount) {
      if (newAccount.address !== oldAccount.address) {
        this.disableAnimation = true
        this.showCollapse = false
        setTimeout(() => {
          this.disableAnimation = false
        }, 1)
      }
    }
  }
}
</script>
<style scoped lang="scss">
.hideTransition {
  transition: none !important;
}
</style>
