import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/bootstrap-vue'
import { firebase } from './firebaseSetting'
// import { firebase } from './firebaseSetting'

// import * as firebase from 'firebase/app'
// import 'firebase/auth'
// import 'firebase/firestore'

// const firebaseConfig = {
//     apiKey: "AIzaSyAZsOSIiS1aFYP09RTZm2lR2YuLfFcy0iA",
//     authDomain: "vue-todolist-app.firebaseapp.com",
//     databaseURL: "https://vue-todolist-app.firebaseio.com",
//     projectId: "vue-todolist-app",
//     storageBucket: "vue-todolist-app.appspot.com",
//     messagingSenderId: "820343771205",
//     appId: "1:820343771205:web:d773e58be4a11e2f9f932c"
// }
// const app = firebase.initializeApp(firebaseConfig)
// export const db = app.firestore()
// export var Firebase = fi.firestore()
import { firestorePlugin } from 'vuefire'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'


Vue.use(Buefy)

Vue.use(Buefy)

Vue.use(firestorePlugin)
Vue.config.productionTip = false

firebase.auth().onAuthStateChanged((user) => {
  store.commit('updateUser', user)
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


