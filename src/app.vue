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

    <!-- RIGHT PANEL -->
    <right_panel/>
  </div>
</template>

<script>
  import login from './f7components/login'
  import main_view from './f7components/main-view'
  import left_panel from './f7components/left-panel'
  import right_panel from './f7components/right-panel'

  export default {
    components: {
      login,
      main_view,
      left_panel,
      right_panel,
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
