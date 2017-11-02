<template>
  <!-- App -->
  <div id="app">
    <f7-statusbar></f7-statusbar>

    <!-- MAIN VIEW -->
    <main_view/>

    <!-- LOGIN -->
    <login :shown='false'/>

    <!-- LEFT PANEL -->
    <left_panel/>
  </div>
</template>

<script>
  import kevin from './components/kevin'
  import lesson1 from './components/lesson1'
  import users from './components/users'
  import f7home from './components/f7home'
  import f7home_main_view from './components/f7home-main-view'
  import f7home_left_panel from './components/f7home-left-panel'
  import login from './f7components/login'
  import left_panel from './f7components/left-panel'
  import main_view from './f7components/main-view'

  export default {
    components: {
      kevin,
      lesson1,
      users,
      f7home,
      f7home_main_view,
      f7home_left_panel,
      login,
      left_panel,
      main_view,
    },
    data () {
      return {

      }
    },
    methods: {
      onRefresh: function (event, done) {
        done();
        window.f7.showPreloader();
        setTimeout(function () {
          window.f7.hidePreloader();
        }, 1000);
      }
    },
    created () {
    },
  }
</script>
