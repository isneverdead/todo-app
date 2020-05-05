<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <TodoList/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import TodoList from '@/components/TodoList.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld,
    TodoList
  }
}
</script>
