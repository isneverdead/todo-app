<template>
  <div class="signup">
    <img alt="Vue logo" src="../assets/logo.png">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <!-- <TodoList/> -->
    <h2>Register</h2> 
    <input v-model="email" @keyup.enter="signUp" type="text" placeholder="Email"> <br>
    <input v-model="password" @keyup.enter="signUp" type="password" placeholder="Password"> <br>
    <button @click="signUp" type="submit">Sign Up</button>
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
        
      }
  },
  methods: {
      signUp() {
        firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(
            (user) => {
            this.boxMsg = 'Akun anda berhasil didaftarkan!'
            this.popUpMessage()
            if (user == null) this.gotoLogin()
            console.log(user)
        },  (err) => {
            this.boxMsg = err.message
            this.popUpMessage()
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
        font-size: 13px;
    }
    p a {
        text-decoration: underline;
        cursor: pointer;
    }
</style>
