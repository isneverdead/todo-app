<template>
  <div>
    <!-- Jika data user yang berada di VueX masih 'null' status loading akan menjadi true, dan loading akan ditampilkan -->
    <!-- Animasi Loading -->
    <div v-if="$store.state.loading" class="lds-ring">
      <div></div><div></div><div></div><div></div>
    </div>

    <!-- Form Login  -->
    <div v-else>
        <div class="login">
          <img alt="Vue logo" src="../assets/logo.png">
          <h2 style="margin: 20px 0 20px 0; font-size: 2.5em">Sign in</h2>
          <div class="tile is-vertical is-4" @keyup.enter="login">
          <b-field label="Email">
              <b-input type="email"
              placeholder="Email"
                  v-model="email"
                  
                  
                  maxlength="30">
              </b-input>
          </b-field>
          <b-field label="password">
              <b-input type="password"
              placeholder="password"
                  v-model="password"
                  
                  
                  maxlength="30">
              </b-input>
          </b-field>

          <!-- Menampilkan pesan error dari firebase  -->
          <b-message type="is-danger" v-if="error">
            {{ error }}
          </b-message>
          </div>
          <!-- Jika sedang proses login, maka akan menampilkan animasi tombol login  -->
          <button v-if="!loadingButton" @click="login" class="button is-success is-small is-outlined">Login</button>
          <button v-else class="button is-success is-small is-loading">Loading</button>
        </div>
        <h5 style="margin: 10px 0 0 0;" >or</h5>  
        <section id="firebaseui-auth-container"></section>
        <button @click="showFirebaseUi" class="button is-small is-success is-outlined">Login With...</button>
        
          <p>Dont have account?</p>
          <button @click="gotoSignUp" class="button is-small is-success is-outlined">Register</button>
        
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import firebase auth 
import * as firebase from 'firebase/app'
import 'firebase/auth'
// import firebase UI login
import 'firebaseui/dist/firebaseui.css'
var firebaseui = require('firebaseui')

var ui = new firebaseui.auth.AuthUI(firebase.auth())

// kongfigurasi firebase UI 
var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      return true;
    },
    uiShown: function() {
      // The widget is rendered.
      // Hide the loader.
      // document.getElementById('loader').style.display = 'none';
    }
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: 'popup',

  // signInSuccessUrl (url redirect) bisa dimatikan saja

  // signInSuccessUrl: '<url-to-redirect-to-on-success>',
  signInOptions: [
    // list provider yang akan digunakan (disable yang tidak perlu)
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    // firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.PhoneAuthProvider.PROVIDER_ID
  ],

  // dibawah ini di disable saja jika tidak punya 
  // Terms of service url.
  // tosUrl: '<your-tos-url>',
  // Privacy policy url.
  // privacyPolicyUrl: '#'
}

// import map getters dan map mutations dari vuex
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'Login',
  
  computed: {
    ...mapGetters({
      // ambil data user 
      currentUser: 'lihatUser',
    }),
    // untuk redirect ke halaman home 
    nextRoute() {
        return this.$route.query.redirect || '/'
    }
  },
  data() {
        return {
            email: '',
            password: '',
            boxMsg: '',
            error: null,
            loadingButton: false
        }
  },
  watch: {
    // melihat perubahan di variabel 'currentUser' jika ada perubahan, maka akan melakukan redirect 
    currentUser(auth) {
      if (auth) {
        this.$router.replace(this.nextRoute)
      } 
    }
  },
  methods: {
      // untuk memunculkan firebase UI login 
      showFirebaseUi() {
        ui.start('#firebaseui-auth-container', uiConfig)
      },
      login() {
        // mengubah loadingButton menjadi 'true'
        this.loadingButton = true
        // melakukan sign in ke firebase 
        firebase.auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(
          (user) => {
            // mengarahkan ke halaman home
            this.$router.replace({name: 'Home' })
            // mengisi 
            this.$store.commit('updateModal', {status: true, msg: 'login berhasil'})
        },(err) => {
            this.error = err.message
            this.loadingButton = false
          }
      )},
      gotoSignUp() {
        this.$router.replace('/sign-up')
      },  
  }
}
</script>
<style scoped>
/* @import url("node_modules/firebaseui/dist/firebaseui.css"); */
    .login {
        margin-top: 40px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
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
        padding: 0 50px 0 50px;
    }
    p {
        margin-top: 40px;
        font-size: 1rem;
    }
    p a {
        text-decoration: underline;
        cursor: pointer;
    }
   



/* // CSS Spinning Loader */
.lds-ring {
  display: block;
  position: absolute;
  left: 45%;
  top: 45%;
  width: 64px;
  height: 64px;
  margin: auto;
  margin-bottom: 16px;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 51px;
  height: 51px;
  margin: 6px;
  border: 6px solid #2bde73;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #2bde73 transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>
