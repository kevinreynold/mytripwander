<template>
  <f7-page>
    <f7home_main_view/>
    <f7home_left_panel/>
    <f7home_right_panel/>
    <f7home_popup/>
    <f7home_login_screen/>
  </f7-page>
</template>
<script>
import f7home_left_panel from './f7home-left-panel'
import f7home_right_panel from './f7home-right-panel'
import f7home_main_view from './f7home-main-view'
import f7home_popup from './f7home-popup'
import f7home_login_screen from './f7home-login-screen'

export default {
  name: "f7home",
  components: {
    f7home_left_panel,
    f7home_right_panel,
    f7home_main_view,
    f7home_popup,
    f7home_login_screen
  }
}
</script>

<style scoped>
</style>
