<template>
  <div>
  
    <div v-if="$store.state.loading" class="lds-ring">
      <div></div><div></div><div></div><div></div>
    </div>

    <div v-else>
        <div class="login">
          <img alt="Vue logo" src="../assets/logo.png">
          <h2>Sign in</h2>
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
          <b-message type="is-danger" v-if="error">
            {{ error }}
          </b-message>
          </div>
          <button v-if="!loadingButton" @click="login" class="button is-success is-outlined">Login</button>
          <button v-else class="button is-success is-small is-loading">Loading</button>
          
        </div>
        <section id="firebaseui-auth-container"></section>
        <button @click="showFirebaseUi" class="button is-small is-success is-outlined">Firebase UI</button>
          <p>Dont have account? daftar disini <button @click="gotoSignUp" class="button is-small is-success is-outlined">Register</button> </p>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
// import { firebase } from '../firebaseSetting'
import * as firebase from 'firebase/app'
import 'firebase/auth'
// import firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
var firebaseui = require('firebaseui')
var ui = new firebaseui.auth.AuthUI(firebase.auth())
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
      document.getElementById('loader').style.display = 'none';
    }
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: 'popup',
  signInSuccessUrl: '<url-to-redirect-to-on-success>',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    // firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.PhoneAuthProvider.PROVIDER_ID
  ],
  // Terms of service url.
  tosUrl: '<your-tos-url>',
  // Privacy policy url.
  privacyPolicyUrl: '<your-privacy-policy-url>'
}
import { mapGetters, mapMutations } from 'vuex'


export default {
  name: 'Login',
  components: {
    HelloWorld,
  },
  computed: {
    ...mapGetters({
      currentUser: 'lihatUser',
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
            error: null,
            loadingButton: false
        }
  },
  watch: {
    currentUser(auth) {
      if (auth) {
        this.$router.replace(this.nextRoute)
      } 
    }
  },
  methods: {
      showFirebaseUi() {
        ui.start('#firebaseui-auth-container', uiConfig)
      },
      login() {
        this.loadingButton = true
        firebase.auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(
          (user) => {
            this.$router.replace({name: 'Home' })
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
