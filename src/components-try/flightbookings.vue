<template>
  <f7-page>
    <f7-navbar title="My Bookings" back-link="Back" sliding></f7-navbar>


  </f7-page>
</template>

<script>

export default {
  components: {
  },
  data: () => ({
  }),
  created() {
    //do something after creating vue instance
    $(document).ready(function(){
      $('iframe').ready(function(){
        window.f7.popup('#popup-loading',false,false);
        window.f7.showPreloader();
        console.log("IFRAME DONE");
      });
      $('iframe').on('load', function(){
        window.f7.closeModal('#popup-loading', true);
        window.f7.hidePreloader();
        console.log("IFRAME LOAD");
      });
    });
  }
}
</script>

<style scoped>
  iframe{
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
  }
</style>
