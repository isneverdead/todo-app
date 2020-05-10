<template>
  <div class="container">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css">
    <h1>Vue ToDo List</h1>
    
    <input type="text" class="todo-input" placeholder="What's your plan?"
    v-model="todo" @keyup.enter="addTodo">
    
    <transition-group name="fade">
    <!-- <transition-group name="fade" enter-active-class="animated fadeInUp faster" leave-active-class="animated fadeOutDown fast"> -->

    <div class="todo-item" v-for="todo in todos" :key="todo.id" >
        
        <div class="todo-item-left">
            <button class="todo-item-label" :class="{ completed : todo.completed }" @click="check(todo)">[___]</button>
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
        <button @click="signOut">logout</button>
    </div>
  </div>
</template>

<script>
import { db } from '../firebaseSetting'
import { auth } from '../firebaseSetting'
import { mapGetters } from 'vuex'

export default {
  name: 'TodoList',
  
  data () {
    return {
        todo: '',
        todos: [],
        
        checkAll: false,
        beforeEditCache: '',
        filter: 'all',
        }
    },
    firestore: {
        todos: db.collection('todos'),
        
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
        }
        
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
                editing: false
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
                editing: false
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
                    editing: false
                })
            })
        },
        clearCompleted() {
            this.todos.forEach((todo) => {
                if (todo.completed) this.removeTodo(todo.id)
            })
        },
        finishedEdit(data) {
            this.todos.splice(data.index, 1, data.todo)
        },
        signOut() {
            auth.signOut()
            console.log("logout")
            console.log(this.currentUser)
            this.$router.replace(this.nextRoute)
        }
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
</style>