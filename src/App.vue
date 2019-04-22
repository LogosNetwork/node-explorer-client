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
export default {
  name: 'app',
  components: {
    'vueHeadful': () => import(/* webpackChunkName: "vue-headful" */'vue-headful'),
    'Nav': () => import(/* webpackChunkName: "Nav" */'@/components/Nav.vue')
  }
}
</script>

<style lang="scss">
</style>
