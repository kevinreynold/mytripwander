<template>
  <f7-page @page:beforeinit="test">
    <f7-navbar title="TICKET" back-link="Back" sliding></f7-navbar>
    <iframe src="https://www.tiket.com/order/add/flight?flight=334509377&date=2017-11-23&ret_flight=339366511&ret_date=2017-11-30"></iframe>
  </f7-page>
</template>

<script>

export default {
  components: {
  },
  data: () => ({
  }),
  methods: {
    test() {
      // console.log("masuk");
      // $.get('https://www.tiket.com/order/add/flight?flight=334509377&date=2017-11-23&ret_flight=339366511&ret_date=2017-11-30', {}, function (data) {
      //     $('.browser-own').html(data);
      // });
    }
  },
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
    /*position: fixed;
    top: 0px;
    left: 0px;*/
    width: 100%;
    height: 100%;
  }
</style>
