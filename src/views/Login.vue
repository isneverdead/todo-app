<template>
  <div>

    <div v-if="loading">
      <div class="loader loader--style1" title="0">
        <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        width="40px" height="40px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve">
        <path opacity="0.2" fill="#000" d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
          s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
          c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"/>
        <path fill="#000" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
          C22.32,8.481,24.301,9.057,26.013,10.047z">
          <animateTransform attributeType="xml"
            attributeName="transform"
            type="rotate"
            from="0 20 20"
            to="360 20 20"
            dur="0.5s"
            repeatCount="indefinite"/>
          </path>
        </svg>
      </div>
    </div>

    <div v-else>
        <div class="login">
          <img alt="Vue logo" src="../assets/logo.png">
          <h2>Sign in</h2>
          <input v-model="email" type="text" placeholder="Email"> <br>
          <input v-model="password" type="password" placeholder="Password"> <br>
          <button @click="login" type="submit">Login</button>
          <p>Dont have account? daftar disini <button @click="gotoSignUp">Register</button> </p>
          
        </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
// import { firebase } from '../firebaseSetting'
import * as firebase from 'firebase/app'
import 'firebase/auth'

import { mapGetters } from 'vuex'

export default {
  name: 'Login',
  components: {
    HelloWorld,
  },
  computed: {
    ...mapGetters({
      currentUser: 'lihatUser',
      loading: 'lihatLoading'
    }),
    nextRoute() {
        return this.$route.query.redirect || '/dashboard'
    }
  },
  data() {
        return {
            email: '',
            password: '',
            boxMsg: '',
        
        }
  },
  watch: {
    currentUser(auth) {
      if (auth) {
        this.$router.replace(this.nextRoute)
      } 
    }
  },
  mounted() {
    // if (this.currentUser == null) {
    //   console.log('not auth')
    //   this.loading = false
    //   console.log(this.loading)
    // }
  },
  methods: {
      login() {
        firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(
            (user) => {
            this.$router.replace({name: 'Home' })
        })
      },
      gotoSignUp() {
        this.$router.replace('/sign-up')
      },
      
  }
}
</script>
<style scoped>
    .login {
        margin-top: 40px;
    }
    input {
        margin: 10px 0;
        width: 20%;
        padding: 15px;
    }
    button {
        margin-top: 20px;
        width: 10%;
        cursor: pointer;
    }
    p {
        margin-top: 40px;
        font-size: 23px;
    }
    p a {
        text-decoration: underline;
        cursor: pointer;
    }
/*
  Set the color of the icon
*/
svg path,
svg rect{
  fill: #FF6700;
}


</style>
