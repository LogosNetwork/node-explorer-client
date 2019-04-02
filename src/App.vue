<template>
  <div id="app">
    <vue-headful
      title="Logos Node Explorer"
      description="Access detailed information on the logos network and interface with the logos network"
      lang="en-US"
      ogLocale="en_US"
      keywords="Logos,Cryptocurrency,Node,Block,Explorer,Transaction,Workbench"
    />
    <Nav dark="false"/>
    <router-view id="content"/>
  </div>
</template>

<script>
import Nav from '@/components/Nav.vue'
export default {
  name: 'app',
  components: {
    Nav
  }
}
</script>

<style lang="scss">
</style>
