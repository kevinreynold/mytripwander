<template>
  <!-- App -->
  <div id="app">
    <!-- <f7-statusbar></f7-statusbar> -->
    <!-- <f7-views> -->
    <!-- <lesson1 :msg="halo"/> -->
    <!-- <users/> -->
    <!-- <f7home/> -->
    <login/>
    <!-- </f7-views> -->
  </div>
</template>

<script>
  import kevin from './components/kevin'
  import lesson1 from './components/lesson1'
  import users from './components/users'
  import f7home from './components/f7home'
  import login from './pages/login'

  export default {
    components: {
      kevin,
      lesson1,
      users,
      f7home,
      login
    },
    data () {
      return {
        halo: 'WOI'
      }
    },
    methods: {
    },
    created () {
    },
  }
</script>
