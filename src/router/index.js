import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
// import component login, dan signup
import Login from '../views/Login.vue'
import SignUp from '../views/SignUp.vue'
// import firebase auth
import 'firebase/auth'

Vue.use(VueRouter)

  const routes = [
    // semua alamat yang tidak tersedia akan diarahkan ke halaman '/'
  {
    path: '*',
    redirect: '/'
  },
    // halaman '/' menggunakan component Home
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
    //menambahkan halaman '/login' menggunakan component Login
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
    //menambahkan halaman '/sign-up' menggunakan component SignUp
  {
    path: '/sign-up',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
