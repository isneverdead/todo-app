import Firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

// Get a Firestore instance
export const firebase = Firebase
  .initializeApp({ 
    apiKey: "AIzaSyAZsOSIiS1aFYP09RTZm2lR2YuLfFcy0iA",
    authDomain: "vue-todolist-app.firebaseapp.com",
    databaseURL: "https://vue-todolist-app.firebaseio.com",
    projectId: "vue-todolist-app",
    storageBucket: "vue-todolist-app.appspot.com",
    messagingSenderId: "820343771205",
    appId: "1:820343771205:web:d773e58be4a11e2f9f932c"
  })
export const db = firebase.firestore()
export const auth = firebase.auth()

