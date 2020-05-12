import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/bootstrap-vue'
import { firebase } from './firebaseSetting'
import { firestorePlugin } from 'vuefire'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'


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


