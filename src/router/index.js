import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import SignUp from '../views/SignUp.vue'
// import { firebase } from '../firebaseSetting'
import * as firebase from 'firebase/app'
import 'firebase/auth'

Vue.use(VueRouter)

  const routes = [
  {
    path: '*',
    redirect: '/'
  },
  
  {
    path: '/',
    name: 'Home',
    component: Home,
    // meta: {
    //   requiresAuth: true
    // }
  },
  {
    path: '/dashboard',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
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


// router.beforeEach((to, from, next) => {
//   const currentUser = $store.getters.user
//   const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

//   // if (to.matched.some(route => route.meta.requiresAuth)) {
//   //   currentUser.then(() => {
//   //     //we're getting 200 status code response here, so user is authorized
//   //     //be sure that API you're consuming return correct status code when user is authorized
//   //     next()
//   //   }).catch(() => {
//   //     //we're getting anything but not 200 status code response here, so user is not authorized
//   //     next({name: 'home'})
//   //   })
//   // } else {
//   //   next()
//   // }

//   if (requiresAuth && !currentUser) {
//     next('login')
//   }
// //   // else if (!requiresAuth && currentUser) {
// //   //   next('Home')
// //   // }
//   else next()
// })
export default router
