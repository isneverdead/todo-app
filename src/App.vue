<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters( {
      isComponentModalActive: 'lihatModalStatus',
      modalMsg: 'lihatModalMsg'
    }),
  },
  watch: {
    isComponentModalActive() {
      if (this.isComponentModalActive) this.success()
      this.$store.commit('updateModal', {status: false, msg: null})
    }
  },
  methods: {
    success() {
        this.$buefy.notification.open({
            message: this.modalMsg,
            type: 'is-success'
        })
    },
  },
  
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
