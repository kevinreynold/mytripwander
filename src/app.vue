<template>
  <!-- App -->
  <div id="app">
    <f7-statusbar></f7-statusbar>

    <!-- MAIN VIEW -->
    <main_view/>

    <!-- LOGIN -->
    <login :shown='loginScreenShown'/>

    <!-- LEFT PANEL -->
    <left_panel/>

    <!-- RIGHT PANEL -->
    <right_panel/>

    <!-- POP UP FOR LOADING -->
    <f7-popup id="popup-loading"/>
  </div>
</template>

<script>
  import login from './f7components/login'
  import main_view from './f7components/main-view'
  import left_panel from './f7components/left-panel'
  import right_panel from './f7components/right-panel'

  import store from "./js/store"
  import plan_trip from "./js/plantrip"

  export default {
    components: {
      login,
      main_view,
      left_panel,
      right_panel,
    },
    data: () => ({
      loginScreenShown: false
    }),
    methods: {
    },
    mounted() {
      //do something after mounting vue instance
    },
    created () {
      if(localStorage.getItem('user_id')){
        plan_trip.loadUserData();
        this.loginScreenShown = false;
      }
      else{
        this.loginScreenShown = true;
      }
    },
  }
</script>
