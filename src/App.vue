<template>
  <div id="app">
    <vue-headful
     title="Logos Node Explorer"
     description="Detailed information on node actions on the logos network aswell as providing and interface to interact and explore the logos network"
     lang="en-US"
     ogLocale="en_US"
     keywords="Logos,Cryptocurrency,Node,Block,Explorer,Transaction"
    />
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color:#525f7f;
  overflow:hidden;
  position: relative;
}
</style>
