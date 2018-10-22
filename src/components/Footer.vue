<template>
  <div id="footer">
    <b-container>
      <b-row>
        <b-col cols="12" sm="6" class="text-left">
          <h4><b-link to="/" v-t="'name'"></b-link></h4>
        </b-col>
        <b-col cols="12" sm="6">
          <b-row>
            <b-col>
              <b-link to="/" exact-active-class="is-active" v-t="'explore'"></b-link>
            </b-col>
            <b-col>
              <b-link to="/chains" exact-active-class="is-active" v-t="'chains'"></b-link>
            </b-col>
            <b-col>
              <b-link to="/governance" exact-active-class="is-active" v-t="'governance'"></b-link>
            </b-col>
            <b-col>
              <b-link to="/workbench" exact-active-class="is-active" v-t="'workbench'"></b-link>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped lang="scss">
#footer {
  padding:0.5rem 1rem;
  background:#FFF;
  border-top:1px solid #ced4db;
  a {
    margin-right: 1rem;
    color:#8898aa;
    padding-top:6px;
  }
  a:hover {
    color:#32325d;
    text-decoration: none;
  }
  a.is-active {
    padding-bottom: 4px;
    border-bottom: 2px solid #8898aa;
  }
  a:not(.is-active):not(.navbar-brand):hover {
    opacity: 0.7;
    padding-bottom: 4px;
    border-bottom: 2px solid #8898aa;
  }
}
</style>
