<template>
  <!-- App -->
  <div id="app">
    <!-- <lesson1 msg="Jacqueline"/> -->
    <!-- <users/> -->
    <f7home/>
  </div>
</template>

<script>
  import kevin from './components/kevin'
  import lesson1 from './components/lesson1'
  import users from './components/users'
  import f7home from './components/f7home'

  export default {
    components: {
      kevin,
      lesson1,
      users,
      f7home
    },
    data () {
      return {
      }
    },
    methods: {
    },
    created () {
    },
  }
</script>
