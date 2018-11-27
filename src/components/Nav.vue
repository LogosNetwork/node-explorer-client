<template>
  <div>
    <div id="nav">
      <b-navbar toggleable="md" v-bind:type="dark == 'true' ? 'dark' : 'light'" v-bind:id="dark == 'true' ? 'dark' : 'light'">
        <b-navbar-brand to="/" v-t="'name'"></b-navbar-brand>
        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
        <b-collapse is-nav id="nav_collapse">
          <b-navbar-nav class="ml-auto">
            <b-nav-item to="/" exact-active-class="is-active">{{ $t('explore') }}</b-nav-item>
            <b-nav-item to="/chains" exact-active-class="is-active">{{ $t('chains') }}</b-nav-item>
            <!-- <b-nav-item to="/governance" exact-active-class="is-active">{{ $t('governance') }}</b-nav-item> -->
            <b-nav-item to="/faucet" exact-active-class="is-active">{{ $t('faucet') }}</b-nav-item>
            <b-nav-item to="/workbench" exact-active-class="is-active">{{ $t('workbench') }}</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
    <div class="alert alert-warning" role="alert">
      This is the permissioned testnet we will be periodically reseting the network. If your funds are gone please obtain more from the facuet.
    </div>
  </div>
</template>

<script>
export default {
  name: 'Nav',
  props: {
    dark: String
  }
}
</script>

<style scoped lang="scss">
#nav {
  position: relative;
  z-index: 2;
  background:#FFF;
  font-weight: bold;
  border-bottom:1px solid #ced4db;
}
#nav {
  #dark {
    a {
      color:#FFF;
      height: 38px;
    }
  }
  #light {
    a {
      color:#6b7c93;
      height: 38px;
    }
    a:hover {
      color:#32325d;
    }
  }
}
@media (min-width: 768px) {
  #nav {
    #dark {
      a {
        margin-right: 1rem;
        color:#FFF;
      }
      a.is-active {
        padding-bottom: 4px;
        border-bottom: 2px solid #fff;
      }
      a:not(.is-active):not(.navbar-brand):hover {
        opacity: 0.7;
        padding-bottom: 4px;
        border-bottom: 2px solid #fff;
      }
    }
    #light {
      a {
        margin-right: 1rem;
        color:#6b7c93;
      }
      a:hover {
        color:#32325d;
      }
      a.is-active {
        padding-bottom: 4px;
        border-bottom: 2px solid #6b7c93;
      }
      a:not(.is-active):not(.navbar-brand):hover {
        opacity: 0.7;
        padding-bottom: 4px;
        border-bottom: 2px solid #6b7c93;
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
      border-bottom: 2px solid #fff;
    }
    a:not(.is-active):not(.navbar-brand):hover {
      opacity: 0.7;
      padding-bottom: 4px;
      border-bottom: 2px solid #fff;
    }
  }
}
</style>
