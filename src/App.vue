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
    <Footer/>
  </div>
</template>

<script>
// @ is an alias to /src
import Nav from '@/components/Nav.vue'
import Footer from '@/components/Footer.vue'
export default {
  name: 'app',
  components: {
    Nav,
    Footer
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color:#525f7f;
  background:#F5F5F5;
  position: relative;
  min-height: 100vh;
  flex-direction: column;
  display: flex;
}
#content {
  flex: 1;
}
@keyframes highlight {
  0% {
    background-color: #fff;
  }
  50% {
    background-color: #fff3cd;
  }
  100% {
    background-color: #fff;
  }
}
.highlight {
  animation-name: highlight;
  animation-duration: 2s;
}
.list-enter-active {
  transition: all 2s;
  animation-name: highlight;
  animation-duration: 2s;
}
</style>
