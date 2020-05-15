<template>
  <div class="signup">
    <!-- logo vue  -->
    <img alt="Vue logo" src="../assets/logo.png">
    <h1 style="margin: 20px 0 20px 0; font-size: 2.5em" >Register</h1> 
    <!-- form register  -->
    <div class="form">
      <div class="tile is-vertical is-4" @keyup.enter="signUp">
      <b-field label="Email">
          <b-input type="email"
          placeholder="Email"
              v-model="email"
              
              
              maxlength="30">
          </b-input>
      </b-field>
      <b-field label="Password">
          <b-input type="password"
          placeholder="Password"
              v-model="password"
              
              
              maxlength="30">
          </b-input>
      </b-field>
      <!-- error message box -->
      <b-message type="is-danger" v-if="msg">
        {{ msg }}
      </b-message>
      </div>
    </div>
    <!-- tombol untuk ke halaman login  -->
    <button class="button is-success is-small is-outlined" @click="signUp" type="submit">Sign Up</button>
    <p>Sudah punya akun?</p>
    <button @click="gotoLogin" class="button is-success is-small is-outlined">Login</button>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import * as firebase from 'firebase/app'
import 'firebase/auth'

export default {
  name: 'SignUp',
  data() {
      return {
        email: '',
        password: '',
        msg: null
        
      }
  },
  methods: {
    // method mendaftarkan user ke firebase 
      signUp() {
        firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(
            (user) => {
              // mengisi variabel pop up jika pendaftaran berhasil
            this.$store.commit('updateModal', {status: true, msg: 'Akun anda berhasil didaftarkan'})  
            console.log(user)
            this.gotoLogin()
        },  (err) => {
            this.msg = err.message
        })
      },
      gotoLogin() {
        // ganti halaman ke login
        this.$router.replace('/login')
      }
  }
}
</script>
<style scoped>
    .signup {
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
    .form {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  </style>
