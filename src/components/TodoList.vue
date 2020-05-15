<template>
  <div class="container">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css">
    <h1>Vue ToDo List</h1>
    
    <input type="text" class="todo-input" placeholder="What's your plan?"
    v-model="todo" @keyup.enter="addTodo">    
    <!-- <transition-group name="fade" enter-active-class="animated fadeInUp faster" leave-active-class="animated fadeOutDown fast"> -->
    <transition-group name="fade">
        <div  class="todo-item" v-for="todo in todosFiltered" :key="todo.id" >
        
            <div class="todo-item-left">
                <button class="todo-item-label" @click="check(todo)">
                    <i v-if="todo.completed" class="gg-check"  aria-hidden="true"></i>
                    <i v-else class="gg-shape-circle" aria-hidden="true"></i>
                    </button>
                <!-- <input @click="check(todo)" type="checkbox" v-model="todo.completed" > -->
                
                <div v-if="!todo.editing" @dblclick="editTodo(todo)" 
                class="todo-item-label" :class="{ completed : todo.completed }">{{ todo.title }}</div>
                
                <input v-else class="todo-item-edit" type="text" 
                v-model="todo.title" @blur="doneEdit(todo)" 
                @keyup.enter="doneEdit(todo)" @keyup.esc="cancelEdit(todo)"
                v-focus>
            </div>
            
            <div class="remove-item" @click="removeTodo(todo.id)">
                &times;
            </div>    

        </div>
    </transition-group>

    <div class="extra-container">
        <div><label>
            <button class="check-all" :class="{ active: checkAll }" @click="checkAllTodos">Check All</button>
        </label></div>
        <div>{{ remaining }} item left</div>
    </div>

    <div class="extra-container">
        <div>
            <button :class="{ active: filter == 'all' }" @click="filter = 'all'">All</button>
            <button :class="{ active: filter == 'active' }" @click="filter = 'active'">Active</button>
            <button :class="{ active: filter == 'completed' }" @click="filter = 'completed'">Completed</button>
        </div>

        <div> 
            <button v-if="showClearCompletedButton" @click="clearCompleted">Clear Completed</button>
        </div>
    </div>

    <div>
        <button @click="signOut" class="button is-success is-outlined">logout</button>
    </div>
  </div>
</template>

<script>
import { db, auth } from '../firebaseSetting'
import { mapGetters } from 'vuex'

export default {
  name: 'TodoList',
  
  data () {
    return {
        todo: '',
        todos: [],
        icon: '',
        checkAll: false,
        beforeEditCache: '',
        filter: 'all',
        }
    },
    firestore: {
        todos: db.collection('todos').orderBy('created'),
        

    },
    computed: {
        remaining() {
            return this.todos.filter(todo => !todo.completed).length
        },
        anyRemaining() {
            return this.remaining == 0
        },
        todosFiltered() {
            if (this.filter == 'all') {
                return this.todos
            } else if (this.filter == 'active') {
                return this.todos.filter(todo => !todo.completed)
            } else if (this.filter == 'completed') {
                return this.todos.filter(todo => todo.completed)
            }
        },
        showClearCompletedButton() {
            return this.todos.filter(todo => todo.completed).length > 0
        },
        ...mapGetters({
            currentUser: 'lihatUser'
        }),
        nextRoute() {
            return this.$route.query.redirect || '/login'
        },
    },
    mounted() {
        if (this.currentUser == null) {
            this.$router.replace(this.nextRoute)
        }
        
    },
    directives: {
        focus: {
            inserted: function (el) {
                el.focus()
            }
        }
    },
    methods: {
        addTodo() {
            if (this.todo.trim().length == 0) {
                return
            }
            const ref = db.collection('todos').doc()

            ref.set({
                id: ref.id,
                title: this.todo,
                completed: false,
                editing: false,
                created: new Date()
            })
            this.todo = ''
        },
        editTodo(todo) {
            this.beforeEditCache = todo.title
            todo.editing = true
        },
        doneEdit(todo) {
            if (todo.title.trim().length == 0) {
                todo.title = this.beforeEditCache
            }
            const ref = db.collection('todos').doc(todo.id)
            ref.set({
                id: ref.id,
                title: todo.title,
                completed: false,
                editing: false,
                created: todo.created
            })
        },
        cancelEdit(todo) {
            todo.title = this.beforeEditCache
            todo.editing = false
        },
        removeTodo(id) {
            db.collection('todos').doc(id).delete()
        },
        check(todo) {
            console.log("check : "+todo.completed)
            const ref = db.collection('todos').doc(todo.id)
            ref.set({
                id: ref.id,
                title: todo.title,
                completed: !todo.completed,
                editing: false,
                created: todo.created
            })
        },
        checkAllTodos() {
            this.checkAll = !this.checkAll
            this.todos.forEach((todo)=>{
                console.log("check : "+todo.completed)
                const ref = db.collection('todos').doc(todo.id)
                ref.set({
                    id: ref.id,
                    title: todo.title,
                    completed: this.checkAll,
                    editing: false,
                    created: todo.created
                })
            })
        },
        clearCompleted() {
            this.todos.forEach((todo) => {
                if (todo.completed) this.removeTodo(todo.id)
            })
        },
        signOut() {
            auth.signOut()
            console.log("logout")
            console.log(this.currentUser)
            this.$router.replace(this.nextRoute)
        },
        
    },
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    .todo-input {
        width: 100%;
        padding: 10px 18px;
        font-size: 18px;
        margin-bottom: 16px;
    }
    .todo-item {
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        animation-duration: 1s;
    }
    .remove-item {
        cursor: pointer;
        margin-left: 14px;
    }
    .todo-item-left {
        display: flex;
        align-items: center;
    }
    .todo-item-label {
        padding: 10px;
        border: 1px solid white;
        margin-left: 12px;
    }
    .todo-item-edit {
        font-size: 24px;
        color: #2c3e50;
        margin-left: 12px;
        width: 100%;
        padding: 10px;
        border: 1px solid #ccc;
        font-family: 'Avenir', Arial, Helvetica, sans-serif;
    }
    .completed {
        text-decoration: line-through;
        color: gray;
    }
    .extra-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 16px;
        border-top: 1px solid lightgray;
        padding-top: 14px;
        margin-bottom: 14px;
    }
    .check-all {
        background-color: white;
    }
    button {
        font-size: 14px;
        background-color: white;
        appearance: none;
    }
    
    .active {
        background: lightgreen;
    }

    .gg-check {
    box-sizing: border-box;
    position: relative;
    display: block;
    transform: scale(var(--ggs,2));
    width: 22px;
    height: 22px;
    border: 2px solid transparent;
    border-radius: 100px
    }
    .gg-check::after {
        content: "";
        display: block;
        box-sizing: border-box;
        position: absolute;
        left: 3px;
        top: -1px;
        width: 6px;
        height: 10px;
        border-width: 0 2px 2px 0;
        border-style: solid;
        transform-origin: bottom left;
        transform: rotate(45deg)
    }
    .gg-shape-circle {
    box-sizing: border-box;
    position: relative;
    display: block;
    transform: scale(var(--ggs,1));
    width: 22px;
    height: 22px;
    border: 3px solid;
    border-radius: 100px
    }


    @keyframes ldio-ski5n9k737b-1 {
        0% { transform: rotate(0deg) }
       50% { transform: rotate(-45deg) }
      100% { transform: rotate(0deg) }
    }
    @keyframes ldio-ski5n9k737b-2 {
        0% { transform: rotate(180deg) }
       50% { transform: rotate(225deg) }
      100% { transform: rotate(180deg) }
    }
    .ldio-ski5n9k737b > div:nth-child(2) {
      transform: translate(-15px,0);
    }
    .ldio-ski5n9k737b > div:nth-child(2) div {
      position: absolute;
      top: 40.199999999999996px;
      left: 40.199999999999996px;
      width: 120.6px;
      height: 60.3px;
      border-radius: 120.6px 120.6px 0 0;
      background: #2bde73;
      animation: ldio-ski5n9k737b-1 1s linear infinite;
      transform-origin: 60.3px 60.3px
    }
    .ldio-ski5n9k737b > div:nth-child(2) div:nth-child(2) {
      animation: ldio-ski5n9k737b-2 1s linear infinite
    }
    .ldio-ski5n9k737b > div:nth-child(2) div:nth-child(3) {
      transform: rotate(-90deg);
      animation: none;
    }@keyframes ldio-ski5n9k737b-3 {
        0% { transform: translate(190.95px,0); opacity: 0 }
       20% { opacity: 1 }
      100% { transform: translate(70.35px,0); opacity: 1 }
    }
    .ldio-ski5n9k737b > div:nth-child(1) {
      display: block;
    }
    .ldio-ski5n9k737b > div:nth-child(1) div {
      position: absolute;
      top: 92.46px;
      left: -8.04px;
      width: 16.08px;
      height: 16.08px;
      border-radius: 50%;
      background: #ffd14f;
      animation: ldio-ski5n9k737b-3 1s linear infinite
    }
    .ldio-ski5n9k737b > div:nth-child(1) div:nth-child(1) { animation-delay: -0.67s }
    .ldio-ski5n9k737b > div:nth-child(1) div:nth-child(2) { animation-delay: -0.33s }
    .ldio-ski5n9k737b > div:nth-child(1) div:nth-child(3) { animation-delay: 0s }
    .loadingio-spinner-bean-eater-sebx2tpg1ah {
      width: 201px;
      height: 201px;
      display: inline-block;
      overflow: hidden;
      background: none;
    }
    .ldio-ski5n9k737b {
      width: 100%;
      height: 100%;
      position: relative;
      transform: translateZ(0) scale(1);
      backface-visibility: hidden;
      transform-origin: 0 0; /* see note above */
    }
    .ldio-ski5n9k737b div { box-sizing: content-box; }
    /* generated by https://loading.io/ */
</style>