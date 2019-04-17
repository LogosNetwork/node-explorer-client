<template>
  <div>
    <div id="nav">
      <b-navbar class="shadow-sm" :fixed="'top'" toggleable="md" v-bind:type="dark == 'true' ? 'dark' : 'light'" v-bind:id="dark == 'true' ? 'dark' : 'light'">
        <b-navbar-brand to="/">
          <font-awesome-icon size="lg" class="logosLogo align-middle" :icon="faLambda" />
          Logos
        </b-navbar-brand>
        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
        <b-collapse is-nav id="nav_collapse">
          <b-navbar-nav class="ml-auto">
            <b-nav-item to="/" exact-active-class="is-active">{{ $t('explore') }}</b-nav-item>
            <b-nav-item to="/chains" exact-active-class="is-active">{{ $t('chains') }}</b-nav-item>
            <b-nav-item to="/tokens" exact-active-class="is-active">{{ $t('tokens') }}</b-nav-item>
            <b-nav-item to="/faucet" exact-active-class="is-active">{{ $t('faucet') }}</b-nav-item>
            <b-nav-item to="/forge" exact-active-class="is-active">{{ $t('forge') }}</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
    <div v-if="showAlert" class="alert alert-warning alert-dismissible fade show" role="alert">
      Please note that this is a test net, which means that we will periodically reset the network. In the case that the reset will cause your funds to disappear, please obtain more from the faucet.
      <button type="button" class="close" v-on:click="showAlert=false" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  </div>
</template>

<script>
import { faLambda } from '@fortawesome/pro-light-svg-icons'
export default {
  name: 'Nav',
  props: {
    dark: String
  },
  data () {
    return {
      faLambda,
      showAlert: false
    }
  }
}
</script>

<style scoped lang="scss">
#nav {
  position: relative;
}
#nav {
  z-index: 5;
  font-weight: bold;
  #dark {
    background-color: var(--secondary);
    a {
      color:#4668da;
      height: 38px;
    }
  }
  #light {
    background-color: #FFF;
    a {
      color:#4668da;
      height: 38px;
    }
  }
}
@media (min-width: 768px) {
  #nav {
    #dark {
      a {
        margin-right: 1rem;
        color:#4668da;
      }
      a.is-active {
        padding-bottom: 4px;
        border-bottom: 2px solid #4668da;
      }
      a:not(.is-active):not(.navbar-brand):hover {
        opacity: 0.7;
        padding-bottom: 4px;
        border-bottom: 2px solid #4668da;
      }
    }
    #light {
      a {
        margin-right: 1rem;
        color:#4668da;
      }
      a.is-active {
        padding-bottom: 4px;
        border-bottom: 2px solid #4668da;
      }
      a:not(.is-active):not(.navbar-brand):hover {
        opacity: 0.7;
        padding-bottom: 4px;
        border-bottom: 2px solid #4668da;
      }
    }
  }
}
@media (min-width: 768px) {
  #nav {
    a {
      margin-right: 1rem;
    }
    a.is-active {
      padding-bottom: 4px;
      border-bottom: 2px solid #4668da;
    }
    a:not(.is-active):not(.navbar-brand):hover {
      opacity: 0.7;
      padding-bottom: 4px;
      border-bottom: 2px solid #4668da;
    }
  }
}
</style>
