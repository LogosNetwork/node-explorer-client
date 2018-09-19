<template>
  <div>
    <Nav dark="false"/>
    <div id="primary" class="pt-5"></div>
    <Footer/>
  </div>
</template>

<script>
// @ is an alias to /src
import Nav from '@/components/Nav.vue'
import Footer from '@/components/Footer.vue'
export default {
  name: 'node',
  components: {
    Nav,
    Footer
  }
}
</script>

<style scoped lang="scss">
#primary {
  min-height: 100vh;
  background: cornflowerblue;
}
</style>
