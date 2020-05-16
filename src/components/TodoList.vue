<template>
  <div class="container">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css">
        <h1 style="font-size: 2rem" >Todo List</h1>    

        <!-- input todo  -->
    <input type="text" class="todo-input" placeholder="What's your plan?"
    v-model="todo" @keyup.enter="addTodo">    

                    <!-- jika ingin menggunakan animasi, bisa gunakan kode dibawah ini -->
    <!-- <transition-group name="fade" enter-active-class="animated fadeInUp faster" leave-active-class="animated fadeOutDown fast"> -->
    <transition-group name="fade">
        <div  class="todo-item" v-for="todo in todosFiltered" :key="todo.id" >
        
            <div class="todo-item-left">
                <!-- tombol centang todo  -->
                <button class="todo-item-label" @click="check(todo)">
                    <i v-if="todo.completed" class="gg-check"  aria-hidden="true"></i>
                    <i v-else class="gg-shape-circle" aria-hidden="true"></i>
                    </button>

                    <!-- menampilkan todo ketika todo.completed  == false      -->
                <div v-if="!todo.editing" @dblclick="editTodo(todo)" 
                class="todo-item-label" :class="{ completed : todo.completed }">{{ todo.title }}</div>
                    <!-- menampilkan todo jika todo.completed == true  -->
                <input v-else class="todo-item-edit" type="text" 
                v-model="todo.title" @blur="doneEdit(todo)" 
                @keyup.enter="doneEdit(todo)" @keyup.esc="cancelEdit(todo)"
                v-focus>
            </div>

                <!-- remove todo  -->
            <div class="remove-item" @click="removeTodo(todo.id)">
                &times;
            </div>    

        </div>
    </transition-group>

    <!-- tombol check all  -->
    <div class="extra-container">
        <div><label>
            <button class="check-all" :class="{ active: checkAll }" @click="checkAllTodos">Check All</button>
        </label></div>
        <div>{{ remaining }} item left</div>
    </div>

    <!-- tombol filter todo  -->
    <div class="extra-container">
        <div>
            <!-- :class="{ active: filter == 'all' }" adalah  style akan digunakan jika variabel filter == all -->
            <button :class="{ active: filter == 'all' }" @click="filter = 'all'">All</button>
            <button :class="{ active: filter == 'active' }" @click="filter = 'active'">Active</button>
            <button :class="{ active: filter == 'completed' }" @click="filter = 'completed'">Completed</button>
        </div>
    <!-- tombol clear completed  -->
        <div> 
            <button v-if="showClearCompletedButton" @click="clearCompleted">Clear Completed</button>
        </div>
    </div>
    
    <!-- tombol sign out  -->
    <div>
        <button @click="signOut" class="button is-success is-outlined">logout</button>
    </div>
  </div>
</template>

<script>
// import firebase
import { db, auth } from '../firebaseSetting'
// import mapGetters dari vuex 
import { mapGetters } from 'vuex'

export default {
  name: 'TodoList',
    // tempat manaruh variabel / data
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
    // fetch todos menggunakan firebase properties
    firestore: {
        todos: db.collection('todos').orderBy('created') // orderBy('created') urutkan berdasarkan waktu dibuat
    },

    // computed properties fungsinya untuk me-return jika ada terjadi perubahan perubahan data pada variabel
    computed: {
        // return todos yang belum completed
        remaining() {
            return this.todos.filter(todo => !todo.completed).length
        },
        // me return todos berdasarkan filter
        todosFiltered() {
            if (this.filter == 'all') {
                return this.todos
            } else if (this.filter == 'active') {
                return this.todos.filter(todo => !todo.completed)
            } else if (this.filter == 'completed') {
                return this.todos.filter(todo => todo.completed)
            }
        },
        // menampilkan clearCompletedButton jika ada todo yang sudah completed 
        showClearCompletedButton() {
            return this.todos.filter(todo => todo.completed).length > 0
        },
        // mengambil informasi data user yang sedang login dari vuex
        ...mapGetters({
            currentUser: 'lihatUser'
        }),
        // mengarahkan ke halaman login
        nextRoute() {
            return this.$route.query.redirect || '/login'
        },
    },
    // mounted properties adalah jika halaman sudah ter-load maka perintah perintah akan ter eksekusi 
    mounted() {
        // jika user tidak ada/ belum login, maka akan diarahkan ke halaman login
        if (this.currentUser == null) {
            this.$router.replace(this.nextRoute)
        }
        
    },
    // ini untuk mengatur fokus kursor saat kita mengedit todos
    directives: {
        focus: {
            inserted: function (el) {
                el.focus()
            }
        }
    },
    // tempat kita menaruh function
    methods: {
        // menambahkan todo
        addTodo() {
            // jika todo == 0 maka todo tidak akan ditambahkan 
            if (this.todo.trim().length == 0) {
                return
            }
            // menambahkan todo ke dalam koleksi 'todos' 
            const ref = db.collection('todos').doc()

            ref.set({
                id: ref.id,
                title: this.todo,
                completed: false,
                editing: false,
                created: new Date()
            })
            // mengosongkan todo setelah berhasil di tambahkan ke firebase 
            this.todo = ''
        },
        // meng enable kan status editing
        editTodo(todo) {
            this.beforeEditCache = todo.title
            todo.editing = true
        },
        // menyimpan kembali todo yang sudah di update 
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
        // tidak jadi edit, todo.title dikembalikan berdasarkan data yang disimpan ke variabel sementara 
        cancelEdit(todo) {
            todo.title = this.beforeEditCache
            todo.editing = false
        },
        // menghapus todo 
        removeTodo(id) {
            db.collection('todos').doc(id).delete()
        },
        // meng-check todo, mengubah status completed todo di firebase
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
        // meng-check semua todo 
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
        // menghapus todo yang sudah completed 
        clearCompleted() {
            this.todos.forEach((todo) => {
                if (todo.completed) this.removeTodo(todo.id)
            })
        },
        // sign out user dari aplikasi kita 
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


</style>