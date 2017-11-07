<template>
  <f7-list-item :link="link" :link-view="link_view" link-close-panel v-on:click="doLogOut">
    <div class="list-menu-panel">
      <div><f7-icon :fa="icon" size="150%"></f7-icon></div>
      <div>{{title}}</div>
    </div>
  </f7-list-item>
</template>

<script>
export default {
  name: "f7-list-item-media",
  props:{
    link: { type: String, default: null },
    link_view: { type: String, default: "#main-view" },
    icon: { type: String },
    title: { type: String },
    // FALSE : BUKA LOGIN SCREEN
    log_out: { type: String, default: "false" },
  },
  methods: {
    doLogOut() {
      if (this.log_out === "true") {
        window.f7.showPreloader();
        setTimeout(function () {
          window.f7.hidePreloader();
          window.f7.closePanel("left");
          window.f7.openModal('#login-screen', true);
        }, 1000);
      }
    }
  }
}
</script>

<style scoped>
  .list-menu-panel div{
    float: left;
  }

  .list-menu-panel div:nth-child(1){
    width: 50px;
  }
</style>
