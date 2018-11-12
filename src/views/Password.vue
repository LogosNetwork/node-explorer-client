<template>
  <div id="primary">
    <b-container class="pt-5">
        <h1>Welcome to the Logos Node Explorer</h1>
        <p>for the permissioned testnet you are required to provide a password to access the node explorer</p>
        <b-input type="password" @keydown.native="submitPassword" id="password" placeholder="password" v-model="password" />
    </b-container>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Password',
  components: {},
  created: function () {
    console.log()
  },
  data () {
    return {
      password: ''
    }
  },
  methods: {
    submitPassword (event) {
      if (event.which === 13) {
        event.preventDefault()
        axios.post('/password', {
          password: this.password
        })
          .then((res) => {
            localStorage.setItem('authtoken', res.data.token)
            if (this.$route.query.redirect) {
              this.$router.push({ path: this.$route.query.redirect })
            } else {
              this.$router.push({ path: '/' })
            }
          })
          .catch((err) => {
            alert(err)
          })
      }
    }
  }
}
</script>

<style scoped lang="scss">
</style>
