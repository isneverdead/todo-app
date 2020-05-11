<template>
  <div class="signup">
    <img alt="Vue logo" src="../assets/logo.png">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <!-- <TodoList/> -->
    <h1>Register</h1> 
    <div class="form">
      <div class="tile is-vertical is-4" @keyup.enter="signUp">
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
      <b-message type="is-danger" v-if="msg">
        {{ msg }}
      </b-message>
      </div>
    </div>
    <button class="button is-success is-small is-outlined" @click="signUp" type="submit">Sign Up</button>
    <p>Sudah punya akun? yaudah masuk disini <button @click="gotoLogin" class="button is-success is-small  is-outlined">Login</button> </p>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
// import { firebase } from '../firebaseSetting'
import * as firebase from 'firebase/app'
import 'firebase/auth'

export default {
  name: 'SignUp',
  data() {
      return {
        email: '',
        password: '',
        boxMsg: '',
        msg: null
        
      }
  },
  methods: {
      signUp() {
        firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(
            (user) => {
            // this.boxMsg = 'Akun anda berhasil didaftarkan!'
            // this.popUpMessage()
            this.$store.commit('updateModal', {status: true, msg: 'Akun anda berhasil didaftarkan'})  
            this.$router.replace('/sign-up')
            console.log(user)
        },  (err) => {
            this.msg = err.message
            // this.popUpMessage()
        })
      },
      popUpMessage() {
        this.$bvModal.msgBoxOk(this.boxMsg, {
          title: 'Status',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'success',
          headerClass: 'p-2 border-bottom-0',
          footerClass: 'p-2 border-top-0',
          centered: true
        })
      },
      gotoLogin() {
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
